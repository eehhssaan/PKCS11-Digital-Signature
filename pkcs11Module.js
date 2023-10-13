// pkcs11Module.js
const pkcs11js = require('pkcs11js');

const lib = '/usr/local/lib/softhsm/libsofthsm2.so';
const slot = 0;
const pin = '1234';

const mod = new pkcs11js.PKCS11();
mod.load(lib);
mod.C_Initialize();

function initializePKCS11() {
  let slotList = mod.C_GetSlotList(true);
  let slotInfo = mod.C_GetSlotInfo(slotList[slot]);
  let session = mod.C_OpenSession(slotList[slot], pkcs11js.CKF_RW_SESSION | pkcs11js.CKF_SERIAL_SESSION);
  mod.C_Login(session, pkcs11js.CKU_USER, pin);
  return session;
}

function findObjectByLabel(session, label) {
  let objects = mod.C_FindObjectsInit(session, [{ type: pkcs11js.CKA_CLASS, value: pkcs11js.CKO_DATA }]);
  let object;
  while ((object = mod.C_FindObjects(session))) {
    let attrs = mod.C_GetAttributeValue(session, object, [
      { type: pkcs11js.CKA_LABEL },
      { type: pkcs11js.CKA_ID },
      { type: pkcs11js.CKA_VALUE }
    ]);
    if (attrs[0].value.toString() === label) {
      return attrs[2].value;
    }
  }
  mod.C_FindObjectsFinal(session);
}

function finalizePKCS11(session) {
  mod.C_CloseSession(session);
  mod.C_Finalize();
}

module.exports = {
  initializePKCS11,
  findObjectByLabel,
  finalizePKCS11,
};

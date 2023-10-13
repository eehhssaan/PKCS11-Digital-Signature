// app.js
const express = require('express');
const app = express();
const multer = require('multer');
const { initializePKCS11, findObjectByLabel, finalizePKCS11 } = require('./pkcs11Module');
const { calculateSHA256Hash } = require('./hashModule');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post('/upload', upload.single('pdf'), async (req, res) => {
  const { file } = req;
  const session = initializePKCS11();
  const dataToSign = findObjectByLabel(session, 'file.pdf');
  const uploadedFileHash = await calculateSHA256Hash(file.path);
  const pkcs11Hash = crypto.createHash('sha256').update(dataToSign).digest('hex');
  finalizePKCS11(session);

  // Compare the hashes or perform the signing process here
  // ...

  res.download(file.path);
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

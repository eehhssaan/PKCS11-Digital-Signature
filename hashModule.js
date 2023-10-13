// hashModule.js
const crypto = require('crypto');
const fs = require('fs');

function calculateSHA256Hash(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const input = fs.createReadStream(filePath);
    input.on('error', reject);
    input.on('data', data => hash.update(data));
    input.on('end', () => resolve(hash.digest('hex')));
  });
}

module.exports = {
  calculateSHA256Hash,
};

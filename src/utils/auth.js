const crypto = require('crypto');

exports.generateResetToken = () => {
  return crypto.randomBytes(20).toString('hex');
};
exports.generateVerificationToken = () => {
  return crypto.randomBytes(20).toString('hex');
};
exports.generateEmailVerificationToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

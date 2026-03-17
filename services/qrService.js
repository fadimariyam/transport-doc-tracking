const QRCode = require("qrcode");

const generateQR = async (text) => {
  const qr = await QRCode.toDataURL(text);
  return qr;
};

module.exports = {
  generateQR,
};
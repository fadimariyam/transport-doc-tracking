const transporter =
  require("../config/mail");

const sendMail = async (
  to,
  subject,
  html
) => {

  await transporter.sendMail({

    from: process.env.MAIL_USER,

    to,

    subject,

    html,   // ✅ HTML not text

  });

};

module.exports = {
  sendMail,
};
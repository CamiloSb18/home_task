// backend/services/sendEmail.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, text) => {
  const msg = {
    to,
    from: process.env.FROM_EMAIL,
    subject,
    text,
  };

  await sgMail.send(msg);
};

module.exports = sendEmail;
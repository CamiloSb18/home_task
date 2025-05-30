// backend/services/sendWhatsApp.js
const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendWhatsApp = async (to, body) => {
  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: `whatsapp:${to}`,
    body,
  });
};

module.exports = sendWhatsApp;

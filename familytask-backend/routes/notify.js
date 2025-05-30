// backend/routes/notify.js
const express = require('express');
const router = express.Router();
const sendEmail = require('../services/sendEmail');
const sendWhatsApp = require('../services/sendWhatsApp');

router.post('/', async (req, res) => {
  const { member, message, methods } = req.body;

  try {
    if (methods.email && member.email) {
      await sendEmail(member.email, 'Recordatorio de tarea', message);
    }

    if (methods.whatsapp && member.phone) {
      await sendWhatsApp(member.phone, message);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

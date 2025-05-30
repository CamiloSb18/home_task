const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const sgMail = require('@sendgrid/mail');
const twilio = require('twilio');
const cron = require('node-cron');
const moment = require('moment-timezone');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5051;
app.use(cors());
app.use(bodyParser.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Simulación de datos en memoria (reemplaza esto con una base de datos o archivo real)
let tareas = [];
let miembros = [];

// Utilidad: enviar notificación
const sendNotification = async (member, message, methods) => {
  try {
    if (methods.email && member.email) {
      await sgMail.send({
        to: member.email,
        from: { email: process.env.SENDGRID_SENDER_EMAIL, name: 'Family Task Bot' },
        subject: 'Recordatorio de tarea',
        text: message,
      });
    }

    if (methods.whatsapp && member.phone) {
      await twilioClient.messages.create({
        body: message,
        from: 'whatsapp:' + process.env.TWILIO_WHATSAPP_NUMBER,
        to: 'whatsapp:' + member.phone,
      });
    }

    console.log(`Notificación enviada a ${member.name}`);
  } catch (error) {
    console.error('Error enviando notificación:', error.response?.body || error.message);
  }
};

// Utilidad: buscar miembro
const getMemberById = (id) => miembros.find(m => m.id === id);

// Endpoint principal
app.get('/', (req, res) => {
  res.json({ message: 'Servidor activo' });
});

// Endpoint de notificación manual
app.post('/api/notify', async (req, res) => {
  const { member, message, methods } = req.body;

  try {
    await sendNotification(member, message, methods);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Fallo al enviar notificación' });
  }
});

// Endpoint para registrar tareas (simulado para test)
app.post('/api/tareas', (req, res) => {
  const tarea = { ...req.body, reminderSent: false };
  tareas.push(tarea);
  res.status(201).json(tarea);
});

// Endpoint para registrar miembros
app.post('/api/miembros', (req, res) => {
  miembros.push(req.body);
  res.status(201).json(req.body);
});

// Cron job que corre cada minuto y envía recordatorios si son las 10 a.m.
cron.schedule('* * * * *', async () => {
  const now = moment().tz('America/Bogota');
  const horaActual = now.format('HH:mm');
  const hoy = now.format('YYYY-MM-DD');

  if (horaActual === '10:00') {
    console.log('⌚ Enviando recordatorios de tareas programadas para hoy:', hoy);

    for (const tarea of tareas) {
      if (tarea.startDate === hoy && !tarea.reminderSent) {
        const miembro = getMemberById(tarea.assignedTo);
        if (!miembro) continue;

        const mensaje = `¡Hola ${miembro.name}! Recuerda tu tarea de hoy: ${tarea.title}`;
        await sendNotification(miembro, mensaje, tarea.notificationMethods);
        tarea.reminderSent = true;
      }
    }
  }
});

app.listen(PORT, () => {
  console.log(`Servidor de notificaciones corriendo en http://localhost:${PORT}`);
});

import React, { useState, useEffect } from 'react';
import Notification from './Notification';

const NotificationManager = ({ members, tasks, newTaskId }) => {
  const [notifications, setNotifications] = useState([]);
  const [remindedTaskIds, setRemindedTaskIds] = useState([]);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const sendNotification = async (member, message, methods) => {
    try {
      //const response = await fetch('http://localhost:5051/api/notify', { //Local
        const response = await fetch('https://familytaskbackv1.onrender.com/api/notify', { //Web service
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member, message, methods }),
      });

      if (response.ok) {
        if (methods.whatsapp) addNotification(`WhatsApp enviado a ${member.name}`, 'success');
        if (methods.email) addNotification(`Email enviado a ${member.name}`, 'success');
      } else {
        const error = await response.json();
        addNotification(`Error al enviar notificación: ${error.error}`, 'error');
      }
    } catch (err) {
      console.error(err);
      addNotification('Error al conectar con el servidor de notificaciones', 'error');
    }
  };

  // Notificación al crear nueva tarea
  useEffect(() => {
    if (newTaskId) {
      const task = tasks.find(t => t.id === newTaskId);
      if (task) {
        const member = members.find(m => m.id === task.assignedTo);
        if (member) {
          const [year, month, day] = task.startDate.split('-');
          const formattedDate = `${day}/${month}/${year}`;
          const message = `Nueva tarea asignada: ${task.title} para el ${formattedDate}. Se repite cada ${task.recurrenceDays} días`;

          sendNotification(member, message, task.notificationMethods);
        }
      }
    }
  }, [newTaskId, members, tasks]);

  // Recordatorio el día de la tarea a las 10am hora Colombia (UTC-5)
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();

      // Hora Colombia sin horario de verano: UTC-5
      const colombiaTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Bogota" }));

      // Solo enviar recordatorio a las 10:00 am (entre 10:00 y 10:01 para evitar múltiples envíos)
      if (colombiaTime.getHours() === 10 && colombiaTime.getMinutes() === 0) {
        tasks.forEach(task => {
          if (remindedTaskIds.includes(task.id)) return; // ya enviado

          // Fecha tarea (sin hora)
          const [year, month, day] = task.startDate.split('-');
          const taskDate = new Date(year, month - 1, day);

          // Fecha hoy Colombia (sin hora)
          const today = new Date(colombiaTime.getFullYear(), colombiaTime.getMonth(), colombiaTime.getDate());

          if (taskDate.getTime() === today.getTime()) {
            const member = members.find(m => m.id === task.assignedTo);
            if (member) {
              const message = `Recordatorio: La tarea "${task.title}" se debe realizar hoy.`;
              sendNotification(member, message, task.notificationMethods);

              setRemindedTaskIds(prev => [...prev, task.id]);
            }
          }
        });
      }
    }, 60 * 1000); // cada minuto

    return () => clearInterval(intervalId);
  }, [tasks, members, remindedTaskIds]);

  return (
    <>
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
        />
      ))}
    </>
  );
};

export default NotificationManager;

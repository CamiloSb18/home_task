import React, { useState, useEffect } from 'react';

const TaskForm = ({ members, onAddTask, editingTask }) => {
  const [title, setTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [startDate, setStartDate] = useState('');
  const [recurrenceDays, setRecurrenceDays] = useState(1);
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(false);

  // Cuando cambia editingTask, precargo los datos
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setAssignedTo(editingTask.assignedTo ? editingTask.assignedTo.toString() : '');
      setStartDate(editingTask.startDate ? editingTask.startDate.slice(0,10) : ''); // yyyy-mm-dd
      setRecurrenceDays(editingTask.recurrenceDays || 1);
      setNotifyWhatsapp(editingTask.notificationMethods?.whatsapp || false);
      setNotifyEmail(editingTask.notificationMethods?.email || false);
    } else {
      setTitle('');
      setAssignedTo('');
      setStartDate('');
      setRecurrenceDays(1);
      setNotifyWhatsapp(false);
      setNotifyEmail(false);
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !assignedTo || !startDate || recurrenceDays < 1) {
      alert('Por favor llena todos los campos correctamente');
      return;
    }

    const taskData = {
      title: title.trim(),
      assignedTo: parseInt(assignedTo, 10),
      startDate,
      recurrenceDays: Number(recurrenceDays),
      notificationMethods: {
        whatsapp: notifyWhatsapp,
        email: notifyEmail,
      },
    };

    onAddTask(taskData);

    if (!editingTask) {
      // Limpio solo si NO estoy editando
      setTitle('');
      setAssignedTo('');
      setStartDate('');
      setRecurrenceDays(1);
      setNotifyWhatsapp(false);
      setNotifyEmail(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {editingTask ? 'Editar Tarea' : 'Agregar Tarea'}
      </h2>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Título de la tarea</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Asignar a</label>
        <select
          value={assignedTo}
          onChange={e => setAssignedTo(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Selecciona un miembro</option>
          {members.map(member => (
            <option key={member.id} value={member.id}>{member.name}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Fecha de inicio</label>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Repetir cada (días)</label>
        <input
          type="number"
          min="1"
          value={recurrenceDays}
          onChange={e => setRecurrenceDays(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <fieldset className="mb-4">
        <legend className="text-gray-700 mb-2">Notificaciones</legend>
        <label className="inline-flex items-center mr-4">
          <input
            type="checkbox"
            checked={notifyWhatsapp}
            onChange={e => setNotifyWhatsapp(e.target.checked)}
            className="form-checkbox"
          />
          <span className="ml-2">WhatsApp</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={notifyEmail}
            onChange={e => setNotifyEmail(e.target.checked)}
            className="form-checkbox"
          />
          <span className="ml-2">Email</span>
        </label>
      </fieldset>
      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
      >
        {editingTask ? 'Guardar Cambios' : 'Agregar Tarea'}
      </button>
    </form>
  );
};

export default TaskForm;

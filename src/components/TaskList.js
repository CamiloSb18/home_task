import React from 'react';

const formatDateToDisplay = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString();
};

const TaskList = ({ members, tasks, onCompleteTask, onDeleteTask, onEditTask }) => {
  const getMemberName = (id) => {
    const member = members.find(m => m.id === id);
    return member ? member.name : 'Desconocido';
  };

  const handleComplete = (taskId) => {
    onCompleteTask(taskId);
  };

  const handleDelete = (taskId) => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      onDeleteTask(taskId);
    }
  };

  const handleEdit = (taskId) => {
    onEditTask(taskId);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Tareas Programadas</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No hay tareas programadas aún</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {tasks.map(task => (
            <li key={task.id} className="py-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-sm text-gray-500">
                    Asignado a: {getMemberName(task.assignedTo)} |{' '}
                    Próxima: {formatDateToDisplay(task.startDate)} |{' '}
                    Cada: {task.recurrenceDays} días |{' '}
                    Notificaciones: {task.notificationMethods.whatsapp ? 'WhatsApp ' : ''} 
                    {task.notificationMethods.email ? 'Email' : ''}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleComplete(task.id)}
                    className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    Completar
                  </button>
                  <button
                    onClick={() => handleEdit(task.id)}
                    className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;

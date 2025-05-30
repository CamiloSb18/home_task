// utils/taskUtils.js

const MEMBERS_KEY = 'familytask_members';
const TASKS_KEY = 'familytask_tasks';

export function loadMembers() {
  const data = localStorage.getItem(MEMBERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveMembers(members) {
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
}

export function loadTasks() {
  const data = localStorage.getItem(TASKS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

// Nueva función para parsear fecha local sin problema de timezone
function parseLocalDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDateLocal(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function rotateAssignment(tasks, taskId, members) {
  return tasks.map(task => {
    if (task.id === taskId) {
      // Parsear la fecha local correctamente
      const currentStartDate = parseLocalDate(task.startDate);

      // Añadir días de recurrencia a la fecha local
      const newStartDate = new Date(currentStartDate);
      newStartDate.setDate(currentStartDate.getDate() + Number(task.recurrenceDays));

      // Calcular siguiente miembro asignado
      const currentMemberIndex = members.findIndex(m => m.id === task.assignedTo);
      const nextMemberIndex = currentMemberIndex === -1 ? 0 : (currentMemberIndex + 1) % members.length;

      // Guardar la fecha en formato local YYYY-MM-DD, sin usar toISOString
      return {
        ...task,
        assignedTo: members[nextMemberIndex]?.id || null,
        startDate: formatDateLocal(newStartDate),
      };
    }
    return task;
  });
}

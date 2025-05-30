import React, { useState, useEffect } from 'react';
import MemberForm from './components/MemberForm';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import MemberList from './components/MemberList'; // Nuevo
import NotificationManager from './components/NotificationManager';
import {
  loadMembers,
  saveMembers,
  loadTasks,
  saveTasks,
  rotateAssignment
} from './utils/taskUtils';

const App = () => {
  const [members, setMembers] = useState(() => loadMembers());
  const [tasks, setTasks] = useState(() => loadTasks());
  const [newTaskId, setNewTaskId] = useState(null);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  

  useEffect(() => {
    saveMembers(members);
  }, [members]);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const handleAddMember = (member) => {
    if (editingMember) {
      const updated = members.map(m => m.id === editingMember.id ? { ...member, id: editingMember.id } : m);
      setMembers(updated);
      setEditingMember(null);
    } else {
      setMembers([...members, { ...member, id: Date.now() }]);
    }
  };

  const handleEditMember = (memberId) => {
    const member = members.find(m => m.id === memberId);
    if (member) setEditingMember(member);
  };

  const handleDeleteMember = (memberId) => {
    if (window.confirm('¿Seguro que quieres eliminar este miembro?')) {
      setMembers(members.filter(m => m.id !== memberId));
      setTasks(tasks.filter(t => t.assignedTo !== memberId));
    }
  };

  const handleAddTask = (task) => {
    if (editingTask) {
      const updated = tasks.map(t => t.id === editingTask.id ? { ...task, id: editingTask.id } : t);
      setTasks(updated);
      setEditingTask(null);
    } else {
      const taskWithId = {
        ...task,
        id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1
      };
      setTasks([...tasks, taskWithId]);
      setNewTaskId(taskWithId.id);
    }
  };

  const handleEditTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) setEditingTask(task);
  };

  const handleCompleteTask = (taskId) => {
    const updatedTasks = rotateAssignment(tasks, taskId, members);
    setTasks(updatedTasks);
    setNewTaskId(taskId);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    setDeleteTaskId(taskId);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">FamilyTask Pro</h1>
        <p className="text-gray-600">Gestión completa de tareas domésticas</p>

        <MemberForm
          onAddMember={handleAddMember}
          editingMember={editingMember}
        />
        <MemberList
          members={members}
          onEditMember={handleEditMember}
          onDeleteMember={handleDeleteMember}
        />

        {members.length > 0 ? (
          <>
            <TaskForm
              members={members}
              onAddTask={handleAddTask}
              editingTask={editingTask}
            />
            <TaskList
              members={members}
              tasks={tasks}
              onCompleteTask={handleCompleteTask}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
            />
            <NotificationManager
              members={members}
              tasks={tasks}
              newTaskId={newTaskId}
              onDeleteTaskId={deleteTaskId}
            />
          </>
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-yellow-700">Agrega al menos un miembro del hogar para comenzar a crear tareas</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

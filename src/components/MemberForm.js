import React, { useState, useEffect } from 'react';

const MemberForm = ({ onAddMember, editingMember }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Cuando cambia editingMember, actualizo los campos
  useEffect(() => {
    if (editingMember) {
      setName(editingMember.name || '');
      setPhone(editingMember.phone || '');
      setEmail(editingMember.email || '');
    } else {
      setName('');
      setPhone('');
      setEmail('');
    }
  }, [editingMember]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !email.trim()) {
      alert('Por favor llena todos los campos');
      return;
    }

    // No asigno id aquí, lo hace App.js al agregar o editar
    const memberData = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim()
    };

    onAddMember(memberData);

    // Limpio campos solo si NO estoy editando (si editas, limpia en App.js)
    if (!editingMember) {
      setName('');
      setPhone('');
      setEmail('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {editingMember ? 'Editar Miembro' : 'Agregar Miembro'}
      </h2>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Nombre completo</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">WhatsApp (con código de país)</label>
        <input
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="+521234567890"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Correo electrónico</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
      >
        {editingMember ? 'Guardar Cambios' : 'Agregar Miembro'}
      </button>
    </form>
  );
};

export default MemberForm;

import React from 'react';

const MemberList = ({ members, onEditMember, onDeleteMember }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Miembros del Hogar</h2>
      {members.length === 0 ? (
        <p className="text-gray-500">No hay miembros aún</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {members.map((member) => (
            <li key={member.id} className="py-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.phone} | {member.email}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEditMember(member.id)}
                    className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDeleteMember(member.id)}
                    className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 text-sm"
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

export default MemberList;

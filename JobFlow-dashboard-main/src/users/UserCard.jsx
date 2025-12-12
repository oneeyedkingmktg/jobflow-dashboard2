// File: src/users/UserCard.jsx
import React from "react";

export default function UserCard({ user, currentUser, onEdit, onDelete }) {
  const isSelf = currentUser && currentUser.id === user.id;

  return (
    <div className="p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:shadow-md transition-all">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h4 className="font-bold text-gray-900">{user.name}</h4>
          <p className="text-sm text-gray-600">{user.email}</p>
          {user.phone && (
            <p className="text-xs text-gray-500 mt-1">Phone: {user.phone}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Role: <span className="font-semibold">{user.role}</span>
          </p>
          {user.is_active === false && (
            <p className="text-xs text-red-600 font-semibold mt-1">
              Inactive
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg"
          >
            Edit
          </button>

          {!isSelf && (
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

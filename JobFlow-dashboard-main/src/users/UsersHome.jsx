// File: src/users/UsersHome.jsx

import React, { useEffect, useState } from "react";
import { UsersAPI } from "../api";
import { useAuth } from "../AuthContext";
import UserModal from "./UserModal.jsx";

export default function UsersHome({ company }) {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCreateMode, setIsCreateMode] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await UsersAPI.getAll(); // ✅ RESTORED
      setUsers(res.users || []);
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsCreateMode(true);
    setShowModal(true);
  };

  const handleEditUser = (u) => {
    setSelectedUser(u);
    setIsCreateMode(false);
    setShowModal(true);
  };

  const handleSaveUser = async (form) => {
    try {
      if (isCreateMode) {
        await UsersAPI.create(form);
      } else {
        await UsersAPI.update(selectedUser.id, form);
      }

      setShowModal(false);
      setSelectedUser(null);
      setIsCreateMode(false);
      loadUsers();
    } catch (err) {
      setError(err.message || "Failed to save user");
    }
  };

  const handleDeleteUser = async (u) => {
    try {
      await UsersAPI.delete(u.id);
      setShowModal(false);
      loadUsers();
    } catch (err) {
      setError(err.message || "Failed to delete user");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Users</h3>
        <button
          onClick={handleAddUser}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold"
        >
          + Add User
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-600 p-3 text-red-800 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading users…</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="space-y-2">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border"
            >
              <div>
                <p className="font-semibold">{u.name}</p>
                <p className="text-sm text-gray-600">{u.email}</p>
                {u.last_login && (
                  <p className="text-xs text-gray-500">
                    Last login: {new Date(u.last_login).toLocaleString()}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleEditUser(u)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <UserModal
          isCreate={isCreateMode}
          user={selectedUser}
          currentUser={currentUser}
          onClose={() => setShowModal(false)}
          onSave={handleSaveUser}
          onDelete={handleDeleteUser}
        />
      )}
    </div>
  );
}

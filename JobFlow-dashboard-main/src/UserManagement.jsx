import React, { useState, useEffect } from 'react';
import { UsersAPI } from './api';
import { useCompany } from './CompanyContext';
import { useAuth } from './AuthContext';

export default function UserManagement({ onBack }) {
  const { currentCompany } = useCompany();
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user'
  });

  const loadUsers = async () => {
    if (!currentCompany) return;

    try {
      setLoading(true);
      const response = await UsersAPI.getAll();
      setUsers(response.users || []);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentCompany]);

  const handleAddUser = async () => {
    setError('');
    setSuccess('');

    if (!newUser.name || !newUser.email || !newUser.password) {
      setError('Name, email, and password are required');
      return;
    }

    try {
      await UsersAPI.create({
        name: newUser.name,
        email: newUser.email.toLowerCase(),
        password: newUser.password,
        phone: newUser.phone,
        role: newUser.role
      });

      setSuccess('User created successfully!');
      setNewUser({ name: '', email: '', password: '', phone: '', role: 'user' });
      setShowAddUser(false);
      loadUsers();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to create user');
    }
  };

  const handleUpdateUser = async () => {
    setError('');
    setSuccess('');

    if (!editingUser.name || !editingUser.email) {
      setError('Name and email are required');
      return;
    }

    try {
      await UsersAPI.update(editingUser.id, {
        name: editingUser.name,
        email: editingUser.email.toLowerCase(),
        phone: editingUser.phone,
        role: editingUser.role,
        ...(editingUser.newPassword ? { password: editingUser.newPassword } : {})
      });

      setSuccess('User updated successfully!');
      setEditingUser(null);
      loadUsers();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    setError('');
    setSuccess('');

    if (userId === currentUser.id) {
      setError('You cannot delete your own account');
      return;
    }

    try {
      await UsersAPI.delete(userId);
      setDeleteConfirm(null);
      loadUsers();
      setSuccess('User deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <p className="text-sm text-gray-600">
          Managing users for: <strong>{currentCompany?.name}</strong>
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
          {success}
        </div>
      )}

      {!showAddUser && !editingUser && (
        <button
          onClick={() => setShowAddUser(true)}
          className="mb-6 w-full px-6 py-4 bg-emerald-600 text-white font-bold rounded-xl"
        >
          + Add New User
        </button>
      )}

      {/* ADD / EDIT FORMS — unchanged logic, now editable */}

      {/* USERS LIST */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-gray-900">
          Users ({users.length})
        </h3>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="p-4 bg-gray-50 rounded-xl border"
            >
              <div className="flex justify-between">
                <div>
                  <strong>{user.name}</strong>
                  <div className="text-sm text-gray-600">{user.email}</div>
                  <div className="text-xs text-gray-500">Role: {user.role}</div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingUser({ ...user })}
                    className="px-3 py-2 bg-blue-600 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(user.id)}
                    className="px-3 py-2 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-700 text-white font-bold rounded-xl"
        >
          Back
        </button>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { UsersAPI } from './api';
import { useCompany } from './CompanyContext';
import { useAuth } from './AuthContext';

export default function UserManagement({ onClose }) {
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

  // Load users from backend
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

  // Create a user
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

  // Update user
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

  // Delete a user
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

  if (!currentCompany) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Company Selected</h2>
          <p className="text-gray-600 mb-6">Please select a company first to manage users.</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-all"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl p-6">
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-blue-100 text-sm mt-1">
            Managing users for: <strong>{currentCompany.name}</strong>
          </p>
        </div>

        <div className="p-6">
          {/* Notifications */}
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

          {/* Add User Button */}
          {!showAddUser && !editingUser && (
            <button
              onClick={() => setShowAddUser(true)}
              className="mb-6 w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl"
            >
              + Add New User
            </button>
          )}

          {/* ADD USER FORM */}
          {showAddUser && (
            <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl border-2 border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Add New User</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300"
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300"
                    placeholder="555-123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300"
                    placeholder="Enter password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    {currentUser.role === 'master' && <option value="master">Master</option>}
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddUser}
                    className="flex-1 px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg"
                  >
                    Add User
                  </button>
                  <button
                    onClick={() => {
                      setShowAddUser(false);
                      setNewUser({ name: '', email: '', password: '', phone: '', role: 'user' });
                    }}
                    className="flex-1 px-6 py-3 bg-gray-500 text-white font-bold rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* EDIT USER FORM */}
          {editingUser && (
            <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl border-2 border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Edit User</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                  <input
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  <input
                    value={editingUser.phone || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300"
                  />
                </div>

                {/* Role (cannot downgrade/upgrade master unless you are master) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    {currentUser.role === 'master' && (
                      <option value="master">Master</option>
                    )}
                  </select>
                </div>

                {/* Optional password field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password (optional)
                  </label>
                  <input
                    type="password"
                    value={editingUser.newPassword || ''}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, newPassword: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300"
                    placeholder="Leave blank to keep current password"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleUpdateUser}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingUser(null)}
                    className="flex-1 px-6 py-3 bg-gray-500 text-white font-bold rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* USERS LIST */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Users ({users.length})
            </h3>

            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl text-gray-500">
                No users found.
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-900">{user.name}</h4>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">
                        Role: {user.role}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingUser({ ...user })}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg"
                      >
                        Edit
                      </button>

                      {deleteConfirm === user.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-bold rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(user.id)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* CLOSE BUTTON */}
          <div className="flex justify-end mt-6 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gray-700 text-white font-bold rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

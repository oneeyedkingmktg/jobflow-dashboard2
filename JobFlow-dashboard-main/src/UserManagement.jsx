import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useCompany } from './CompanyContext';

export default function UserManagement({ onClose }) {
  const { createUser, updateUser, deleteUser, getUsersByCompany } = useAuth();
  const { currentCompany } = useCompany();
  const [users, setUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    loadUsers();
  }, [currentCompany]);

  const loadUsers = () => {
    if (currentCompany) {
      const companyUsers = getUsersByCompany(currentCompany.id);
      setUsers(companyUsers);
    }
  };

  const handleAddUser = () => {
    setError('');
    setSuccess('');

    if (!newUser.name || !newUser.email || !newUser.password) {
      setError('Name, email, and password are required');
      return;
    }

    if (!currentCompany) {
      setError('No company selected');
      return;
    }

    const result = createUser({
      ...newUser,
      companyId: currentCompany.id
    });

    if (result.success) {
      setSuccess('User added successfully!');
      setNewUser({ name: '', email: '', password: '' });
      setShowAddUser(false);
      loadUsers();
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error);
    }
  };

  const handleUpdateUser = () => {
    setError('');
    setSuccess('');

    if (!editingUser.name || !editingUser.email) {
      setError('Name and email are required');
      return;
    }

    const updates = {
      name: editingUser.name,
      email: editingUser.email
    };

    // Only update password if a new one is provided
    if (editingUser.newPassword) {
      updates.password = editingUser.newPassword;
    }

    const result = updateUser(editingUser.id, updates);

    if (result.success) {
      setSuccess('User updated successfully!');
      setEditingUser(null);
      loadUsers();
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error);
    }
  };

  const handleDeleteUser = (userId) => {
    deleteUser(userId);
    setDeleteConfirm(null);
    loadUsers();
    setSuccess('User deleted successfully!');
    setTimeout(() => setSuccess(''), 3000);
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
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl p-6">
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-blue-100 text-sm mt-1">
            Managing users for: <strong>{currentCompany.name}</strong>
          </p>
        </div>

        <div className="p-6">
          {/* Success/Error Messages */}
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
              className="mb-6 w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              + Add New User
            </button>
          )}

          {/* Add User Form */}
          {showAddUser && (
            <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl border-2 border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Add New User</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    placeholder="Enter password"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleAddUser}
                    className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg"
                  >
                    Add User
                  </button>
                  <button
                    onClick={() => {
                      setShowAddUser(false);
                      setNewUser({ name: '', email: '', password: '' });
                      setError('');
                    }}
                    className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit User Form */}
          {editingUser && (
            <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl border-2 border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Edit User</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password <span className="text-gray-500 text-xs">(leave blank to keep current)</span>
                  </label>
                  <input
                    type="password"
                    value={editingUser.newPassword || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, newPassword: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleUpdateUser}
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditingUser(null);
                      setError('');
                    }}
                    className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Users List */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Users ({users.length})
            </h3>
            {users.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <p className="text-gray-500">No users yet. Add your first user above.</p>
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
                      <p className="text-xs text-gray-500 mt-1">
                        Created: {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingUser({ ...user })}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-all"
                      >
                        Edit
                      </button>
                      {deleteConfirm === user.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-all"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-bold rounded-lg transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(user.id)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg transition-all"
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

          {/* Close Button */}
          <div className="flex justify-end mt-6 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
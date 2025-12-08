import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { UsersAPI } from './api';

export default function UserProfileModal({ onClose, editingUser = null }) {
  const { user: currentUser, logout } = useAuth();

  // Determine if this modal is editing the logged-in user or another user
  const isEditingOther = editingUser && editingUser.id !== currentUser?.id;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Pre-fill user data
  useEffect(() => {
    const target = editingUser || currentUser;

    if (target) {
      setFormData(prev => ({
        ...prev,
        name: target.name || '',
        email: target.email || '',
        role: target.role || '',
        phone: target.phone || '',
      }));
    }
  }, [editingUser, currentUser]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  // Save main profile changes
  const handleSaveProfile = async () => {
    setError('');
    setSuccess('');

    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and email are required');
      return;
    }

    try {
      await UsersAPI.update(editingUser?.id || currentUser.id, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        role: editingUser ? formData.role : undefined
      });

      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);

      // If editing another user, close modal after a second
      if (isEditingOther) {
        setTimeout(() => onClose(), 800);
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };

  // Handle password update
  const handleSavePassword = async () => {
    setError('');
    setSuccess('');

    if (!formData.newPassword) {
      setError('New password is required');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Changing own password
      if (!isEditingOther) {
        if (!formData.currentPassword) {
          setError('Current password is required');
          return;
        }

        await UsersAPI.changePassword(
          formData.currentPassword,
          formData.newPassword
        );
      }
      // Admin/Master changing another user's password
      else {
        await UsersAPI.update(editingUser.id, {
          password: formData.newPassword
        });
      }

      setSuccess('Password updated successfully!');
      setShowPasswordFields(false);

      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update password');
    }
  };

  const targetUser = editingUser || currentUser;

  if (!targetUser) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl p-6">
          <h2 className="text-2xl font-bold text-white">
            {isEditingOther ? 'Edit User' : 'My Profile'}
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            {isEditingOther ? `Editing: ${targetUser.name}` : 'Update your information'}
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Messages */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-600 p-3 rounded">
              <p className="text-green-800 font-semibold">{success}</p>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-600 p-3 rounded">
              <p className="text-red-800 font-semibold">{error}</p>
            </div>
          )}

          {/* --- Profile Fields --- */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Name
            </label>
            <input
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={e => handleChange('email', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={e => handleChange('phone', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300"
            />
          </div>

          {/* ROLE only visible when editing others */}
          {isEditingOther && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Role
              </label>
              <select
                value={formData.role}
                onChange={e => handleChange('role', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="master">Master</option>
              </select>
            </div>
          )}

          {/* --- Password Section --- */}
          <div className="border-t pt-4">
            {!showPasswordFields ? (
              <button
                onClick={() => setShowPasswordFields(true)}
                className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold"
              >
                Change Password
              </button>
            ) : (
              <div className="space-y-4">
                {!isEditingOther && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={formData.currentPassword}
                      onChange={e => handleChange('currentPassword', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300"
                      placeholder="Current password"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={e => handleChange('newPassword', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300"
                    placeholder="New password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={e => handleChange('confirmPassword', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300"
                    placeholder="Confirm password"
                  />
                </div>

                <button
                  onClick={handleSavePassword}
                  className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  Save Password
                </button>

                <button
                  onClick={() => {
                    setShowPasswordFields(false);
                    setFormData(prev => ({
                      ...prev,
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    }));
                  }}
                  className="w-full px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold"
                >
                  Cancel Password Change
                </button>
              </div>
            )}
          </div>

          {/* --- Footer Buttons --- */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-bold"
            >
              Close
            </button>
            <button
              onClick={handleSaveProfile}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
            >
              Save Profile
            </button>
          </div>

          {/* Logout only for own account */}
          {!isEditingOther && (
            <div className="border-t pt-4">
              <button
                onClick={logout}
                className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

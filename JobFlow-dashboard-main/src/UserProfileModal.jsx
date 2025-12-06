import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export default function UserProfileModal({ onClose, editingUserId = null }) {
  const { currentUser, updateUser, logout, isMaster } = useAuth();
  
  // Determine which user to edit
  const userToEdit = editingUserId 
    ? JSON.parse(localStorage.getItem('users') || '[]').find(u => u.id === editingUserId)
    : currentUser;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const isEditingOther = editingUserId && editingUserId !== currentUser?.id;

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        name: userToEdit.name || '',
        email: userToEdit.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [userToEdit]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSave = () => {
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }

    // If changing password
    if (showPasswordFields) {
      // Master editing another user doesn't need current password
      if (!isEditingOther && !formData.currentPassword) {
        setError('Current password is required to change password');
        return;
      }

      if (!formData.newPassword) {
        setError('New password is required');
        return;
      }

      if (formData.newPassword.length < 6) {
        setError('New password must be at least 6 characters');
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // Verify current password only if user is editing their own
      if (!isEditingOther) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.id === currentUser.id);
        if (!user || user.password !== formData.currentPassword) {
          setError('Current password is incorrect');
          return;
        }
      }
    }

    // Prepare updates
    const updates = {
      name: formData.name.trim(),
      email: formData.email.trim()
    };

    // Add password if changing
    if (showPasswordFields && formData.newPassword) {
      updates.password = formData.newPassword;
    }

    // Save updates
    const result = updateUser(userToEdit.id, updates);

    if (result.success) {
      setSuccess('Profile updated successfully!');
      setShowPasswordFields(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      // Close after 1 second if editing another user
      if (isEditingOther) {
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } else {
      setError(result.error || 'Failed to update profile');
    }
  };

  if (!userToEdit) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h2>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-all"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl p-6">
          <h2 className="text-2xl font-bold text-white">
            {isEditingOther ? 'Edit User Profile' : 'My Profile'}
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            {isEditingOther ? `Editing: ${userToEdit.name}` : 'Update your account information'}
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded animate-fade-in">
              <p className="text-green-800 font-semibold">✓ {success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded animate-fade-in">
              <p className="text-red-800 font-semibold">{error}</p>
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-base"
              placeholder="Your name"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-base"
              placeholder="your@email.com"
            />
          </div>

          {/* Change Password Toggle */}
          <div className="border-t pt-4">
            {!showPasswordFields ? (
              <button
                onClick={() => setShowPasswordFields(true)}
                className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all"
              >
                Change Password
              </button>
            ) : (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900">Change Password</h3>
                
                {/* Only show current password field if user is editing themselves */}
                {!isEditingOther && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Password <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) => handleChange('currentPassword', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-base"
                      placeholder="Enter current password"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => handleChange('newPassword', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-base"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm New Password <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-base"
                    placeholder="Confirm new password"
                  />
                </div>

                <button
                  onClick={() => {
                    setShowPasswordFields(false);
                    setFormData(prev => ({
                      ...prev,
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    }));
                    setError('');
                  }}
                  className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-lg transition-all text-sm"
                >
                  Cancel Password Change
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Save Changes
            </button>
          </div>

          {/* Logout Button - Only show when editing own profile */}
          {!isEditingOther && (
            <div className="border-t pt-4">
              <button
                onClick={logout}
                className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all"
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
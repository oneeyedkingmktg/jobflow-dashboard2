import React, { useState, useEffect } from 'react';
import { CompaniesAPI } from './api';
import { useCompany } from './CompanyContext';
import { useAuth } from './AuthContext';

export default function CompanyManagement({ onClose }) {
  const { currentCompany, updateCompany } = useCompany();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Load initial company data
  useEffect(() => {
    if (!currentCompany) {
      setLoading(false);
      return;
    }

    setFormData({
      name: currentCompany.name || '',
      phone: currentCompany.phone || '',
      email: currentCompany.email || '',
      address: currentCompany.address || '',
    });

    setLoading(false);
  }, [currentCompany]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const saveChanges = async () => {
    if (!currentCompany) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const result = await updateCompany(currentCompany.id, formData);

      if (!result.success) {
        throw new Error(result.error || 'Failed to update company');
      }

      setSuccess('Company updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  // Placeholder — backend does NOT support this yet
  const handleDeleteCompany = () => {
    setError('Deleting companies is not supported yet.');
  };

  if (!currentCompany) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">No Company Found</h2>
          <p className="mb-6 text-gray-600">
            You don't have a company assigned. Contact system admin.
          </p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl p-6">
          <h2 className="text-2xl font-bold text-white">Company Management</h2>
          <p className="text-blue-100 text-sm mt-1">
            Manage settings for: <strong>{currentCompany.name}</strong>
          </p>
        </div>

        <div className="p-6 space-y-4">
          {loading ? (
            <p className="text-center py-6 text-gray-600">Loading...</p>
          ) : (
            <>
              {/* Success Message */}
              {success && (
                <div className="p-3 bg-green-50 border-l-4 border-green-600 text-green-800 rounded">
                  {success}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border-l-4 border-red-600 text-red-800 rounded">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="font-semibold text-gray-700 mb-1 block">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                  placeholder="Company Name"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="font-semibold text-gray-700 mb-1 block">
                  Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                  placeholder="555-123-4567"
                />
              </div>

              {/* Email */}
              <div>
                <label className="font-semibold text-gray-700 mb-1 block">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                  placeholder="company@email.com"
                />
              </div>

              {/* Address */}
              <div>
                <label className="font-semibold text-gray-700 mb-1 block">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg h-28"
                  placeholder="123 Main St..."
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-xl"
                >
                  Close
                </button>
                <button
                  onClick={saveChanges}
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

              {/* Delete Company (disabled) */}
              {user?.role === 'master' && (
                <div className="pt-6 border-t">
                  <button
                    onClick={handleDeleteCompany}
                    className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  >
                    Delete Company (Not Enabled)
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-1">
                    Backend does not support deleting companies yet.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

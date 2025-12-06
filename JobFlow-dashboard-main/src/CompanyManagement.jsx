import React, { useState } from 'react';
import { useCompany } from './CompanyContext';
import { useAuth } from './AuthContext';
import UserProfileModal from './UserProfileModal';

export default function CompanyManagement({ onClose }) {
  const { companies, deleteCompany, switchCompany, currentCompany, updateCompany } = useCompany();
  const { getUsersByCompany } = useAuth();
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingCompany, setEditingCompany] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [expandedCompany, setExpandedCompany] = useState(null);

  const handleDelete = (companyId) => {
    deleteCompany(companyId);
    setDeleteConfirm(null);
  };

  const handleViewCompany = (company) => {
    switchCompany(company.id);
    onClose();
  };

  const handleEditCompany = (company) => {
    setEditingCompany({ ...company });
  };

  const handleSaveCompany = () => {
    if (editingCompany) {
      updateCompany(editingCompany.id, {
        name: editingCompany.name,
        ownerName: editingCompany.ownerName,
        ownerEmail: editingCompany.ownerEmail,
        ownerPhone: editingCompany.ownerPhone,
        address: editingCompany.address
      });
      setEditingCompany(null);
    }
  };

  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const toggleExpand = (companyId) => {
    setExpandedCompany(expandedCompany === companyId ? null : companyId);
  };

  if (editingUser) {
    return (
      <UserProfileModal 
        onClose={() => setEditingUser(null)}
        editingUserId={editingUser.id}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl p-6">
          <h2 className="text-2xl font-bold text-white">Manage Companies</h2>
          <p className="text-blue-100 text-sm mt-1">View and manage all companies and their users</p>
        </div>

        <div className="p-6">
          {companies.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏢</div>
              <p className="text-gray-600 text-xl font-semibold mb-2">No Companies Yet</p>
              <p className="text-gray-500">Create your first company to get started</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {companies.map((company) => {
                const companyUsers = getUsersByCompany(company.id);
                const isExpanded = expandedCompany === company.id;
                
                return (
                  <div
                    key={company.id}
                    className={`bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-5 border-2 transition-all ${
                      currentCompany?.id === company.id
                        ? 'border-blue-500 shadow-lg'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold text-gray-900">{company.name}</h3>
                          {currentCompany?.id === company.id && (
                            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                              ACTIVE
                            </span>
                          )}
                          <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">
                            {companyUsers.length} {companyUsers.length === 1 ? 'User' : 'Users'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                          <div>
                            <p className="text-gray-600 font-semibold mb-1">Owner</p>
                            <p className="text-gray-900">{company.ownerName}</p>
                            <p className="text-gray-700">{company.ownerEmail}</p>
                            <p className="text-gray-700">{company.ownerPhone}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 font-semibold mb-1">Address</p>
                            <p className="text-gray-900">{company.address}</p>
                          </div>
                        </div>

                        {/* Users List */}
                        {isExpanded && companyUsers.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-300">
                            <h4 className="text-sm font-bold text-gray-700 mb-2">Company Users:</h4>
                            <div className="space-y-2">
                              {companyUsers.map((user) => (
                                <div
                                  key={user.id}
                                  onClick={() => setEditingUser(user)}
                                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer"
                                >
                                  <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{user.name}</p>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                  </div>
                                  <span className="text-blue-600 text-sm font-semibold">Edit →</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Toggle Users Button */}
                        {companyUsers.length > 0 && (
                          <button
                            onClick={() => toggleExpand(company.id)}
                            className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            {isExpanded ? '▼ Hide Users' : `▶ Show ${companyUsers.length} ${companyUsers.length === 1 ? 'User' : 'Users'}`}
                          </button>
                        )}

                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>API Key: {company.ml_apiKey ? '✓ Configured' : '✗ Not Set'}</span>
                            <span>•</span>
                            <span>Created: {new Date(company.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        {currentCompany?.id !== company.id && (
                          <button
                            onClick={() => handleViewCompany(company)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                          >
                            Switch To
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleEditCompany(company)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                        >
                          Edit
                        </button>
                        
                        {deleteConfirm === company.id ? (
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleDelete(company.id)}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-all whitespace-nowrap"
                            >
                              Confirm Delete
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-bold rounded-lg transition-all whitespace-nowrap"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(company.id)}
                            className="px-4 py-2 bg-gray-200 hover:bg-red-100 text-red-600 text-sm font-bold rounded-lg transition-all whitespace-nowrap"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-end items-center mt-6 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Edit Company Modal */}
      {editingCompany && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-slide-up">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-t-2xl p-6">
              <h3 className="text-2xl font-bold text-white">Edit Company</h3>
              <p className="text-emerald-100 text-sm mt-1">Update company information</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={editingCompany.name}
                  onChange={(e) => setEditingCompany({ ...editingCompany, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Owner Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={editingCompany.ownerName}
                  onChange={(e) => setEditingCompany({ ...editingCompany, ownerName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Owner Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  value={editingCompany.ownerEmail}
                  onChange={(e) => setEditingCompany({ ...editingCompany, ownerEmail: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Owner Phone <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  value={editingCompany.ownerPhone}
                  onChange={(e) => setEditingCompany({ ...editingCompany, ownerPhone: formatPhoneNumber(e.target.value) })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Address <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={editingCompany.address}
                  onChange={(e) => setEditingCompany({ ...editingCompany, address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all text-base"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setEditingCompany(null)}
                  className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCompany}
                  className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
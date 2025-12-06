import React, { useState } from 'react';
import { useCompany } from './CompanyContext';
import { useAuth } from './AuthContext';
import SettingsModal from './SettingsModal';
import CompanyManagement from './CompanyManagement';
import CompanyWizard from './CompanyWizard';
import UserProfileModal from './UserProfileModal';

export default function SettingsMenu() {
  const { companies, switchCompany, currentCompany } = useCompany();
  const { isMaster, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCompanyMgmt, setShowCompanyMgmt] = useState(false);
  const [showCompanyWizard, setShowCompanyWizard] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);

  const handleSwitchCompany = (companyId) => {
    switchCompany(companyId);
    setShowMenu(false);
  };

  const handleNewCompany = () => {
    setShowMenu(false);
    setShowCompanyWizard(true);
  };

  const handleManageCompanies = () => {
    setShowMenu(false);
    setShowCompanyMgmt(true);
  };

  const handleSettings = () => {
    setShowMenu(false);
    setShowSettings(true);
  };

  const handleMyProfile = () => {
    setShowMenu(false);
    setShowUserProfile(true);
  };

  const handleLogout = () => {
    setShowMenu(false);
    logout();
  };

  return (
    <>
      {/* Gear Icon Button */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="touch-target p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
          aria-label="Menu"
        >
          <span className="text-2xl">⚙️</span>
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />

            {/* Menu Panel */}
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border-2 border-gray-200">
              {/* Master Menu */}
              {isMaster() ? (
                <>
                  {/* Company Switcher Section */}
                  <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 p-4">
                    <h3 className="text-sm font-bold text-gray-700 mb-3">Switch Company</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {companies.map((company) => (
                        <button
                          key={company.id}
                          onClick={() => handleSwitchCompany(company.id)}
                          className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                            currentCompany?.id === company.id
                              ? 'bg-blue-600 text-white font-bold shadow-md'
                              : 'bg-white hover:bg-blue-50 text-gray-900 border border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">{company.name}</span>
                            {currentCompany?.id === company.id && (
                              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                                ACTIVE
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-3 space-y-2">
                    <button
                      onClick={handleNewCompany}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg"
                    >
                      <span className="text-xl">➕</span>
                      <span>New Company</span>
                    </button>

                    <button
                      onClick={handleManageCompanies}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg"
                    >
                      <span className="text-xl">🏢</span>
                      <span>Manage Companies</span>
                    </button>

                    <button
                      onClick={handleSettings}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-gray-700 hover:bg-gray-800 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg"
                    >
                      <span className="text-xl">⚙️</span>
                      <span>Company Settings</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg"
                    >
                      <span className="text-xl">🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                /* User Menu */
                <div className="p-3 space-y-2">
                  <button
                    onClick={handleMyProfile}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg"
                  >
                    <span className="text-xl">👤</span>
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg"
                  >
                    <span className="text-xl">🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showCompanyMgmt && <CompanyManagement onClose={() => setShowCompanyMgmt(false)} />}
      {showCompanyWizard && (
        <CompanyWizard
          onComplete={() => setShowCompanyWizard(false)}
          onCancel={() => setShowCompanyWizard(false)}
        />
      )}
      {showUserProfile && <UserProfileModal onClose={() => setShowUserProfile(false)} />}
    </>
  );
}
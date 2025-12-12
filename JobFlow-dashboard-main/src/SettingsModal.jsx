import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useCompany } from "./CompanyContext";

// Screens
import CompanyManagement from "./CompanyManagement";
import CompanyDetails from "./CompanyDetails";
import UserManagement from "./UserManagement";
import UsersHome from "./users/UsersHome";
import UserProfileModal from "./UserProfileModal";

// TODO: add when ready
// import SuperAdminDetails from "./SuperAdminDetails";
// import CompanySettings from "./CompanySettings";

export default function SettingsModal({ onClose }) {
  const { user, logout, isMaster } = useAuth();
  const { currentCompany } = useCompany();

  // Navigation state
  const [screen, setScreen] = useState("home");
  const [selectedCompany, setSelectedCompany] = useState(null);

  // ===============================
  // NAVIGATION HANDLERS (STACK-LIKE)
  // ===============================

  const goHome = () => {
    setSelectedCompany(null);
    setScreen("home");
  };

  const openManageCompanies = () => {
    setScreen("manage_companies");
  };

  const openCompanyDetails = (company) => {
    setSelectedCompany(company);
    setScreen("company_details");
  };

  const openManageUsers = () => {
    setScreen("manage_users");
  };

  const openMyProfile = () => {
    setScreen("my_profile");
  };

  const openCompanySettings = () => {
    setScreen("company_settings");
  };

  const openSuperAdminDetails = () => {
    setScreen("superadmin");
  };

  const handleBack = () => {
    // strict single-level back rules
    if (screen === "company_details") return setScreen("manage_companies");
    if (screen === "manage_companies") return setScreen("home");
    if (screen === "manage_users") return setScreen("home");
    if (screen === "my_profile") return setScreen("home");
    if (screen === "company_settings") return setScreen("home");
    if (screen === "superadmin") return setScreen("home");

    // fallback to close modal
    onClose();
  };

  // ===============================
  // SETTINGS HOME SCREEN
  // ===============================

  const renderHome = () => (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        Settings & Administration
      </h2>

      <div className="space-y-3">

        {/* Manage Companies (Superadmin Only) */}
        {isMaster() && (
          <button
            onClick={openManageCompanies}
            className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
          >
            Manage Companies
          </button>
        )}

        {/* Manage Users (Superadmin only) */}
        {isMaster() && (
          <button
            onClick={openManageUsers}
            className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
          >
            Manage Users
          </button>
        )}

        {/* Super Admin Details */}
        {isMaster() && (
          <button
            onClick={openSuperAdminDetails}
            className="w-full px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
          >
            Super Admin Details
          </button>
        )}

        {/* Company Settings (Admin Only) */}
        {!isMaster() && (
          <button
            onClick={openCompanySettings}
            className="w-full px-6 py-4 bg-gray-700 hover:bg-gray-800 text-white font-bold rounded-xl"
          >
            Company Settings
          </button>
        )}

        {/* My Profile (Always) */}
        <button
          onClick={openMyProfile}
          className="w-full px-6 py-4 bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-xl"
        >
          My Profile
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl"
        >
          Logout
        </button>
      </div>
    </div>
  );

  // ===============================
  // MAIN RENDER LOGIC
  // ===============================

  let content = null;

  switch (screen) {
    case "home":
      content = renderHome();
      break;

    case "manage_companies":
      content = (
        <CompanyManagement
          onClose={handleBack}
          onSelectCompany={openCompanyDetails}
        />
      );
      break;

    case "company_details":
      content = (
        <CompanyDetails
          company={selectedCompany}
          onBack={handleBack}
          onSave={() => {}}
        />
      );
      break;

    case "manage_users":
      content = (
        <div className="p-4">
          <UsersHome />
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg"
          >
            Back
          </button>
        </div>
      );
      break;

    case "my_profile":
      content = (
        <UserProfileModal
          onClose={handleBack}
        />
      );
      break;

    // Placeholder for future screens
    case "company_settings":
      content = (
        <div className="p-6">
          <p className="text-lg text-gray-700">Company Settings Coming Soon…</p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg"
          >
            Back
          </button>
        </div>
      );
      break;

    case "superadmin":
      content = (
        <div className="p-6">
          <p className="text-lg text-gray-700">Super Admin Details Coming Soon…</p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg"
          >
            Back
          </button>
        </div>
      );
      break;

    default:
      content = renderHome();
  }

  // ===============================
  // MODAL WRAPPER
  // ===============================

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999] p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl">
        {content}
      </div>
    </div>
  );
}

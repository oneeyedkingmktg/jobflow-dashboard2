import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useCompany } from "./CompanyContext";
import UserManagement from "./UserManagement";

export default function SettingsModal({ onClose }) {
  const { user, isMaster, logout } = useAuth();
  const { currentCompany, updateCompany } = useCompany();

  const [ghlApiKey, setGhlApiKey] = useState("");
  const [showSaved, setShowSaved] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);

  // ================================
  // ACCESS GUARD
  // ================================
  // 1) Master (superadmin) should NOT use this modal for company config
  if (isMaster()) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Company Settings Restricted
          </h2>
          <p className="text-gray-600 mb-6">
            The master account manages companies from the{" "}
            <strong>Manage Companies</strong> screen instead of this Company
            Settings panel.
          </p>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-bold"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // 2) Only company admins may access this screen
  if (!user || user.role !== "admin") {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            Only company admins can access Company Settings.
          </p>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-bold"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // 3) No company selected
  if (!currentCompany) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Company Selected
          </h2>
          <p className="text-gray-600 mb-6">
            Please select a company first.
          </p>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-bold"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // ================================
  // LOAD EXISTING COMPANY SETTINGS
  // ================================
  useEffect(() => {
    if (!currentCompany) return;
    setGhlApiKey(currentCompany.ghl_api_key || "");
  }, [currentCompany]);

  // ================================
  // SAVE COMPANY SETTINGS
  // ================================
  const handleSave = async () => {
    await updateCompany(currentCompany.id, {
      ghl_api_key: ghlApiKey.trim(),
    });

    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  // ================================
  // TEST CONNECTION (GHL PLACEHOLDER)
  // ================================
  const handleTestConnection = async () => {
    if (!ghlApiKey.trim()) {
      alert("Enter your Company GHL Location Code first.");
      return;
    }

    // Placeholder – real GHL test wiring can be added later
    alert("Test Connection is not wired up yet for GHL. This is a placeholder.");
  };

  // ================================
  // USER MANAGEMENT SUB-SCREEN
  // ================================
  if (showUserManagement) {
    return (
      <UserManagement onClose={() => setShowUserManagement(false)} />
    );
  }

  // ================================
  // MAIN COMPANY SETTINGS MODAL
  // ================================
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-auto max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Company Settings</h2>
            <p className="text-blue-100 text-sm mt-1">
              Manage settings for <strong>{currentCompany.name}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-sm font-semibold underline"
          >
            Back
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">
          {/* SAVE SUCCESS */}
          {showSaved && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="text-green-800 font-semibold">
                ✓ Settings saved successfully!
              </p>
            </div>
          )}

          {/* GHL API KEY - COMPANY GHL LOCATION CODE */}
          <div className="space-y-3">
            <div className="flex justify-between items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Company GHL Location Code
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  This field is stored as <code>ghl_api_key</code> for this company.
                </p>
              </div>
              <button
                onClick={handleTestConnection}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-md"
              >
                Test Connection
              </button>
            </div>

            <input
              type="text"
              value={ghlApiKey}
              onChange={(e) => setGhlApiKey(e.target.value)}
              placeholder="Enter Company GHL Location Code"
              className="w-full px-4 py-3 font-mono text-sm rounded-lg border-2 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          {/* USER MANAGEMENT LINK (OPTIONAL) */}
          <div className="border-t pt-6">
            <button
              onClick={() => setShowUserManagement(true)}
              className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl"
            >
              Manage Users for {currentCompany.name}
            </button>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-between items-center pt-6 border-t gap-3">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl shadow-lg"
            >
              Back
            </button>

            <button
              onClick={handleSave}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg"
            >
              Save Settings
            </button>
          </div>

          {/* LOGOUT (optional quick exit) */}
          <div className="border-t pt-6 pb-2">
            <button
              onClick={logout}
              className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

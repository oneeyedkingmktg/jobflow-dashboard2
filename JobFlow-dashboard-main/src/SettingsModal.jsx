import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useCompany } from "./CompanyContext";
import UserManagement from "./UserManagement";

export default function SettingsModal({ onClose }) {
  const { isMaster, logout } = useAuth();
  const { currentCompany, updateCompany } = useCompany();

  const [apiKey, setApiKey] = useState("");
  const [groups, setGroups] = useState({
    lead: "",
    appointment_set: "",
    sold: "",
    not_sold: "",
    complete: "",
  });

  const [showSaved, setShowSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);

  // Load existing company settings
  useEffect(() => {
    if (!currentCompany) return;

    setApiKey(currentCompany.ml_apiKey || "");
    setGroups(
      currentCompany.ml_groups || {
        lead: "",
        appointment_set: "",
        sold: "",
        not_sold: "",
        complete: "",
      }
    );
  }, [currentCompany]);

  // ================================
  // ACCESS GUARD
  // ================================
  if (!isMaster()) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            Only the master account can access company settings.
          </p>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-bold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!currentCompany) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Company Selected
          </h2>
          <p className="text-gray-600 mb-6">Please select a company first.</p>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-bold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // ================================
  // SAVE COMPANY SETTINGS
  // ================================
  const handleSave = async () => {
    await updateCompany(currentCompany.id, {
      ml_apiKey: apiKey.trim(),
      ml_groups: groups,
    });

    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  // ================================
  // TEST MAILERLITE v3 API KEY
  // ================================
  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      alert("Enter your MailerLite API key first.");
      return;
    }

    setTesting(true);
    setTestSuccess(false);

    try {
      const response = await fetch(
        "https://connect.mailerlite.com/api/subscribers",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey.trim()}`,
          },
        }
      );

      if (response.ok) {
        setTestSuccess(true);
        setTimeout(() => setTestSuccess(false), 3000);
      } else {
        const errJson = await response.json();
        alert("Connection failed: " + (errJson.message || "Invalid API key"));
      }
    } catch (err) {
      alert("Connection error: " + err.message);
    }

    setTesting(false);
  };

  // ================================
  // USER MANAGEMENT SUB-MODAL
  // ================================
  if (showUserManagement) {
    return (
      <UserManagement onClose={() => setShowUserManagement(false)} />
    );
  }

  // ================================
  // MAIN SETTINGS MODAL
  // ================================
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-auto max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl p-6">
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <p className="text-blue-100 text-sm mt-1">
            Manage settings for <strong>{currentCompany.name}</strong>
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* SAVE SUCCESS */}
          {showSaved && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="text-green-800 font-semibold">
                ✓ Settings saved successfully!
              </p>
            </div>
          )}

          {/* MAILERLITE API KEY */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                MailerLite API Key
              </h3>
              <button
                onClick={handleTestConnection}
                disabled={testing || !apiKey.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-bold rounded-lg shadow-md"
              >
                {testing ? "Testing..." : "Test Connection"}
              </button>
            </div>

            {testSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-800 text-sm font-semibold">
                  ✓ Connection successful!
                </p>
              </div>
            )}

            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="mlpat_xxxxxxxxxxxxx"
              className="w-full px-4 py-3 font-mono text-sm rounded-lg border-2 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          {/* MAILERLITE GROUPS */}
          <div className="space-y-3 border-t pt-6">
            <h3 className="text-lg font-bold text-gray-900">
              MailerLite Group IDs
            </h3>
            <p className="text-sm text-gray-600">
              Enter the MailerLite Group ID for each status.
            </p>

            <div className="grid gap-4">
              {[
                { key: "lead", label: "Lead" },
                { key: "appointment_set", label: "Appointment Set" },
                { key: "sold", label: "Sold" },
                { key: "not_sold", label: "Not Sold" },
                { key: "complete", label: "Complete" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {label} Group ID
                  </label>
                  <input
                    type="text"
                    value={groups[key]}
                    onChange={(e) =>
                      setGroups({ ...groups, [key]: e.target.value })
                    }
                    placeholder="123456789"
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* USER MANAGEMENT */}
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
              Close
            </button>

            <button
              onClick={handleSave}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg"
            >
              Save Settings
            </button>
          </div>

          {/* LOGOUT */}
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

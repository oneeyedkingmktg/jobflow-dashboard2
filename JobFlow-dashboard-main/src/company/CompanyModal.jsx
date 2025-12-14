// ============================================================================
// File: src/company/CompanyModal.jsx
// Version: v1.3.0 - Full GHL Keys tab with view/edit modes
// ============================================================================

import React, { useEffect, useState } from "react";
import UsersHome from "../users/UsersHome";

export default function CompanyModal({
  mode, // "view" | "edit" | "create"
  company,
  onEdit,
  onClose,
  onSave,
}) {
  const isCreate = mode === "create";

  // ------------------------------------------------------------
  // SECTION STATE
  // ------------------------------------------------------------
  const [activeSection, setActiveSection] = useState("info"); // info | ghl | estimator | users
  const [sectionMode, setSectionMode] = useState("view"); // view | edit

  const [form, setForm] = useState(null);
  const [ghlForm, setGhlForm] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // ------------------------------------------------------------
  // INIT FORM
  // ------------------------------------------------------------
  useEffect(() => {
    if (isCreate) {
      setActiveSection("info");
      setSectionMode("edit");
      setForm({
        name: "",
        phone: "",
        email: "",
        address: "",
      });
      setGhlForm({
        ghlApiKey: "",
        ghlLocationId: "",
        ghlInstallCalendar: "",
        ghlApptCalendar: "",
      });
    } else if (company) {
      setActiveSection("info");
      setSectionMode("view");
      setForm({
        name: company.name || company.companyName || company.company_name || "",
        phone: company.phone || "",
        email: company.email || "",
        address: company.address || "",
      });
      setGhlForm({
        ghlApiKey: company.ghlApiKey || company.ghl_api_key || "",
        ghlLocationId: company.ghlLocationId || company.ghl_location_id || "",
        ghlInstallCalendar: company.ghlInstallCalendar || company.ghl_install_calendar || "",
        ghlApptCalendar: company.ghlApptCalendar || company.ghl_appt_calendar || "",
      });
    }
  }, [isCreate, company]);

  if (!form || !ghlForm) return null;

  // ------------------------------------------------------------
  // HANDLERS
  // ------------------------------------------------------------
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleGhlChange = (field, value) => {
    setGhlForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSaveCompanyInfo = async () => {
    if (!form.name) {
      setError("Company name is required");
      return;
    }

    if (saving) return;

    try {
      setSaving(true);
      await onSave(form);
      setSectionMode("view");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGhlKeys = async () => {
    if (saving) return;

    try {
      setSaving(true);
      
      // Merge GHL data with company data
      const payload = {
        ...form,
        ghl_api_key: ghlForm.ghlApiKey,
        ghl_location_id: ghlForm.ghlLocationId,
        ghl_install_calendar: ghlForm.ghlInstallCalendar,
        ghl_appt_calendar: ghlForm.ghlApptCalendar,
      };

      await onSave(payload);
      setSectionMode("view");
    } catch (err) {
      setError(err.message || "Failed to save GHL keys");
    } finally {
      setSaving(false);
    }
  };

  // ------------------------------------------------------------
  // UI CLASSES
  // ------------------------------------------------------------
  const sectionBtn = (active) =>
    `px-4 py-2 rounded-lg font-semibold transition ${
      active
        ? "bg-blue-600 text-white"
        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
    }`;

  const editBox =
    "w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500";

  const viewLabel = "text-xs text-gray-500 uppercase tracking-wide";
  const viewValue = "text-sm font-semibold text-gray-800";

  // ------------------------------------------------------------
  // RENDER SECTIONS
  // ------------------------------------------------------------
  const renderCompanyInfo = () => (
    <div className="space-y-5">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-600 p-3 text-red-800 rounded">
          {error}
        </div>
      )}

      <div>
        <div className={viewLabel}>Company Name</div>
        {sectionMode === "view" ? (
          <div className={viewValue}>{form.name}</div>
        ) : (
          <input
            className={editBox}
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        )}
      </div>

      <div>
        <div className={viewLabel}>Phone</div>
        {sectionMode === "view" ? (
          <div className={viewValue}>{form.phone || "—"}</div>
        ) : (
          <input
            className={editBox}
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        )}
      </div>

      <div>
        <div className={viewLabel}>Email</div>
        {sectionMode === "view" ? (
          <div className={viewValue}>{form.email || "—"}</div>
        ) : (
          <input
            className={editBox}
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        )}
      </div>

      <div>
        <div className={viewLabel}>Address</div>
        {sectionMode === "view" ? (
          <div className={viewValue}>{form.address || "—"}</div>
        ) : (
          <textarea
            className={editBox}
            rows={3}
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        )}
      </div>
    </div>
  );

  const renderGhlKeys = () => (
    <div className="space-y-5">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-600 p-3 text-red-800 rounded">
          {error}
        </div>
      )}

      <div>
        <div className={viewLabel}>API Key</div>
        {sectionMode === "view" ? (
          <div className={viewValue}>
            {ghlForm.ghlApiKey ? "***hidden***" : "—"}
          </div>
        ) : (
          <input
            type="password"
            className={editBox}
            value={ghlForm.ghlApiKey}
            onChange={(e) => handleGhlChange("ghlApiKey", e.target.value)}
            placeholder="Enter new API key to change"
          />
        )}
      </div>

      <div>
        <div className={viewLabel}>Location ID</div>
        {sectionMode === "view" ? (
          <div className={viewValue}>{ghlForm.ghlLocationId || "—"}</div>
        ) : (
          <input
            className={editBox}
            value={ghlForm.ghlLocationId}
            onChange={(e) => handleGhlChange("ghlLocationId", e.target.value)}
          />
        )}
      </div>

      <div>
        <div className={viewLabel}>Install Calendar ID</div>
        {sectionMode === "view" ? (
          <div className={viewValue}>{ghlForm.ghlInstallCalendar || "—"}</div>
        ) : (
          <input
            className={editBox}
            value={ghlForm.ghlInstallCalendar}
            onChange={(e) => handleGhlChange("ghlInstallCalendar", e.target.value)}
          />
        )}
      </div>

      <div>
        <div className={viewLabel}>Appointment Calendar ID</div>
        {sectionMode === "view" ? (
          <div className={viewValue}>{ghlForm.ghlApptCalendar || "—"}</div>
        ) : (
          <input
            className={editBox}
            value={ghlForm.ghlApptCalendar}
            onChange={(e) => handleGhlChange("ghlApptCalendar", e.target.value)}
          />
        )}
      </div>
    </div>
  );

  const renderPlaceholder = (label) => (
    <div className="text-gray-600 text-sm">
      {label} settings will live here.
    </div>
  );

  // ------------------------------------------------------------
  // MODAL
  // ------------------------------------------------------------
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="bg-blue-600 text-white px-6 py-4 rounded-t-2xl">
          <h2 className="text-xl font-bold">
            {isCreate ? "Add Company" : form.name}
          </h2>
        </div>

        {/* TAB BUTTONS - Mobile: 2 columns (50% width), Desktop: Flexible wrap */}
        <div className="px-6 py-4 grid grid-cols-2 sm:flex sm:flex-wrap gap-2 border-b">
          <button
            className={sectionBtn(activeSection === "info")}
            onClick={() => {
              setActiveSection("info");
              setSectionMode("view");
            }}
          >
            Company Info
          </button>

          <button
            className={sectionBtn(activeSection === "ghl")}
            onClick={() => {
              setActiveSection("ghl");
              setSectionMode("view");
            }}
          >
            GHL Keys
          </button>

          <button
            className={sectionBtn(activeSection === "estimator")}
            onClick={() => {
              setActiveSection("estimator");
              setSectionMode("view");
            }}
          >
            Estimator
          </button>

          <button
            className={sectionBtn(activeSection === "users")}
            onClick={() => {
              setActiveSection("users");
              setSectionMode("view");
            }}
          >
            Users
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeSection === "info" && renderCompanyInfo()}
          {activeSection === "ghl" && renderGhlKeys()}
          {activeSection === "estimator" && renderPlaceholder("Estimator")}
          {activeSection === "users" && <UsersHome scopedCompany={company} />}
        </div>

        <div className="border-t px-6 py-4 bg-white rounded-b-2xl flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold"
          >
            Close
          </button>

          {activeSection === "info" && (
            <button
              onClick={() =>
                sectionMode === "view"
                  ? setSectionMode("edit")
                  : handleSaveCompanyInfo()
              }
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold"
              disabled={saving}
            >
              {sectionMode === "view"
                ? "Edit Company Info"
                : saving
                ? "Saving…"
                : "Save"}
            </button>
          )}

          {activeSection === "ghl" && (
            <button
              onClick={() =>
                sectionMode === "view"
                  ? setSectionMode("edit")
                  : handleSaveGhlKeys()
              }
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold"
              disabled={saving}
            >
              {sectionMode === "view"
                ? "Edit GHL Keys"
                : saving
                ? "Saving…"
                : "Save"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

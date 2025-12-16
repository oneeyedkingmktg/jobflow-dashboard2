// ============================================================================
// File: src/company/CompanyModal.jsx
// Version: v1.6.5 - CRITICAL FIX: Prevent useEffect from resetting checkboxes
// ============================================================================

import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import UsersHome from "../users/UsersHome";

// Phone formatter utility
const formatPhoneNumber = (value) => {
  if (!value) return "";
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export default function CompanyModal({
  mode, // "view" | "edit" | "create"
  company,
  onEdit,
  onClose,
  onSave,
}) {
  const { user, isMaster } = useAuth();
  const isCreate = mode === "create";
  const isMasterUser = isMaster();
  const isAdminUser = user?.role === "admin";

  // ------------------------------------------------------------
  // SECTION STATE
  // ------------------------------------------------------------
  const [activeSection, setActiveSection] = useState("info");
  const [sectionMode, setSectionMode] = useState("view");

  const [form, setForm] = useState(null);
  const [ghlForm, setGhlForm] = useState(null);
  const [estimatorForm, setEstimatorForm] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  
  // CRITICAL: Track if user has modified checkboxes to prevent reset
  const [estimatorTouched, setEstimatorTouched] = useState(false);
  const [suspendedTouched, setSuspendedTouched] = useState(false);

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
        website: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        suspended: false,
      });
      setGhlForm({
        ghlApiKey: "",
        ghlLocationId: "",
        ghlInstallCalendar: "",
        ghlApptCalendar: "",
      });
      setEstimatorForm({
        estimatorEnabled: false,
      });
      setEstimatorTouched(false);
      setSuspendedTouched(false);
    } else if (company) {
      setActiveSection("info");
      setSectionMode("view");
      
      // Preserve suspended if user touched it
      const suspendedValue = suspendedTouched ? form?.suspended : (company.suspended === true);
      
      setForm({
        name: company.name || "",
        phone: company.phone || "",
        email: company.email || "",
        website: company.website || "",
        address: company.address || "",
        city: company.city || "",
        state: company.state || "",
        zip: company.zip || "",
        suspended: suspendedValue,
      });
      setGhlForm({
        ghlApiKey: company.ghlApiKey || "",
        ghlLocationId: company.ghlLocationId || "",
        ghlInstallCalendar: company.ghlInstallCalendar || "",
        ghlApptCalendar: company.ghlApptCalendar || "",
      });
      
      // CRITICAL: Only reset estimatorForm if user hasn't touched it
      if (!estimatorTouched) {
        console.log("RESETTING estimatorForm from company data:", company.estimatorEnabled);
        setEstimatorForm({
          estimatorEnabled: company.estimatorEnabled === true,
        });
      } else {
        console.log("PRESERVING estimatorForm (user touched it)");
      }
    }
  }, [isCreate, company, estimatorTouched, suspendedTouched, form]);

  // DEBUG: Log whenever estimatorForm changes
  useEffect(() => {
    console.log("estimatorForm state changed:", estimatorForm);
  }, [estimatorForm]);

  if (!form) return null;

  // ------------------------------------------------------------
  // HANDLERS
  // ------------------------------------------------------------
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
    if (field === "suspended") {
      setSuspendedTouched(true);
      console.log("Suspended changed to:", value, "- Set suspendedTouched = true");
    }
  };

  const handleSave = async () => {
    if (!form.name) {
      setError("Company name is required");
      return;
    }

    if (saving) return;

    try {
      setSaving(true);
      setError("");
      
      // Send ONLY snake_case for API
      const payload = {
        company_name: form.name,
        phone: form.phone || null,
        email: form.email || null,
        website: form.website || null,
        address: form.address || null,
        city: form.city || null,
        state: form.state || null,
        zip: form.zip || null,
        suspended: form.suspended, // Always boolean
      };

      console.log("Saving company info:", payload);
      console.log("Suspended value type:", typeof form.suspended, "value:", form.suspended);
      
      await onSave(payload);
      
      setSectionMode("view");
    } catch (err) {
      console.error("Save company info error:", err);
      setError(err.message || "Failed to save company");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGHLKeys = async () => {
    if (saving) return;

    try {
      setSaving(true);
      setError("");
      
      // Send ONLY snake_case for API
      const payload = {
        company_name: form.name,
        phone: form.phone || null,
        email: form.email || null,
        website: form.website || null,
        address: form.address || null,
        city: form.city || null,
        state: form.state || null,
        zip: form.zip || null,
        suspended: form.suspended,
        ghl_api_key: ghlForm.ghlApiKey || null,
        ghl_location_id: ghlForm.ghlLocationId || null,
        ghl_install_calendar: ghlForm.ghlInstallCalendar || null,
        ghl_appt_calendar: ghlForm.ghlApptCalendar || null,
      };
      
      console.log("Saving GHL keys:", payload);
      
      await onSave(payload);
      console.log("GHL Keys saved successfully");
    } catch (err) {
      console.error("GHL save error:", err);
      setError(err.message || "Failed to save GHL keys");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEstimator = async () => {
    if (saving) return;

    try {
      setSaving(true);
      setError("");
      
      console.log("=== SAVE ESTIMATOR CALLED ===");
      console.log("estimatorForm state:", estimatorForm);
      console.log("estimatorForm.estimatorEnabled:", estimatorForm.estimatorEnabled);
      
      // Send ONLY snake_case for API
      const payload = {
        company_name: form.name,
        phone: form.phone || null,
        email: form.email || null,
        website: form.website || null,
        address: form.address || null,
        city: form.city || null,
        state: form.state || null,
        zip: form.zip || null,
        suspended: form.suspended,
        estimator_enabled: estimatorForm.estimatorEnabled, // Always boolean
      };
      
      console.log("Saving estimator with payload:", payload);
      console.log("Estimator value type:", typeof estimatorForm.estimatorEnabled, "value:", estimatorForm.estimatorEnabled);
      
      await onSave(payload);
      console.log("Estimator settings saved successfully");
    } catch (err) {
      console.error("Estimator save error:", err);
      setError(err.message || "Failed to save estimator settings");
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
            onChange={(e) => handleChange("phone", formatPhoneNumber(e.target.value))}
            placeholder="(555) 555-5555"
          />
        )}
      </div>

      <div>
        <div className={viewLabel}>Email</div>
        {sectionMode === "view" ? (
          <div className={viewValue}>{form.email || "—"}</div>
        ) : (
          <input
            type="email"
            className={editBox}
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        )}
      </div>

      <div>
        <div className={viewLabel}>Website</div>
        {sectionMode === "view" ? (
          <div className={viewValue}>{form.website || "—"}</div>
        ) : (
          <input
            type="url"
            className={editBox}
            value={form.website}
            onChange={(e) => handleChange("website", e.target.value)}
            placeholder="https://example.com"
          />
        )}
      </div>

      <div>
        <div className={viewLabel}>Address</div>
        {sectionMode === "view" ? (
          <div className={viewValue}>{form.address || "—"}</div>
        ) : (
          <input
            className={editBox}
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className={viewLabel}>City</div>
          {sectionMode === "view" ? (
            <div className={viewValue}>{form.city || "—"}</div>
          ) : (
            <input
              className={editBox}
              value={form.city}
              onChange={(e) => handleChange("city", e.target.value)}
            />
          )}
        </div>

        <div>
          <div className={viewLabel}>State</div>
          {sectionMode === "view" ? (
            <div className={viewValue}>{form.state || "—"}</div>
          ) : (
            <input
              className={editBox}
              value={form.state}
              onChange={(e) => handleChange("state", e.target.value)}
              maxLength={2}
              placeholder="CA"
            />
          )}
        </div>

        <div>
          <div className={viewLabel}>ZIP</div>
          {sectionMode === "view" ? (
            <div className={viewValue}>{form.zip || "—"}</div>
          ) : (
            <input
              className={editBox}
              value={form.zip}
              onChange={(e) => handleChange("zip", e.target.value)}
            />
          )}
        </div>
      </div>

      {/* SUSPENDED - Master only */}
      {isMasterUser && (
        <div className="pt-4 border-t">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.suspended}
              onChange={(e) => handleChange("suspended", e.target.checked)}
              className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500"
              disabled={sectionMode === "view"}
            />
            <div>
              <div className="font-semibold text-gray-900">Suspend Account</div>
              <div className="text-sm text-gray-600">
                Prevent all users from this company from logging in
              </div>
            </div>
          </label>
        </div>
      )}
    </div>
  );

  const renderGHLKeys = () => {
    if (!ghlForm) return null;

    const viewLabel = "text-xs uppercase text-gray-500 font-semibold mb-1";
    const editBox = "w-full px-3 py-2 border rounded-lg text-sm";

    return (
      <div className="space-y-4">
        <div>
          <div className={viewLabel}>API Key</div>
          <input
            type="password"
            className={editBox}
            value={ghlForm.ghlApiKey}
            onChange={(e) => setGhlForm({ ...ghlForm, ghlApiKey: e.target.value })}
            placeholder="Enter GHL API Key"
          />
        </div>

        <div>
          <div className={viewLabel}>Location ID</div>
          <input
            className={editBox}
            value={ghlForm.ghlLocationId}
            onChange={(e) => setGhlForm({ ...ghlForm, ghlLocationId: e.target.value })}
            placeholder="Enter Location ID"
          />
        </div>

        <div>
          <div className={viewLabel}>Install Calendar ID</div>
          <input
            className={editBox}
            value={ghlForm.ghlInstallCalendar}
            onChange={(e) => setGhlForm({ ...ghlForm, ghlInstallCalendar: e.target.value })}
            placeholder="Enter Install Calendar ID"
          />
        </div>

        <div>
          <div className={viewLabel}>Appointment Calendar ID</div>
          <input
            className={editBox}
            value={ghlForm.ghlApptCalendar}
            onChange={(e) => setGhlForm({ ...ghlForm, ghlApptCalendar: e.target.value })}
            placeholder="Enter Appointment Calendar ID"
          />
        </div>

        <div className="pt-4">
          <button
            onClick={handleSaveGHLKeys}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save GHL Keys"}
          </button>
        </div>
      </div>
    );
  };

  const renderEstimator = () => {
    if (!estimatorForm) return null;

    return (
      <div className="space-y-4">
        {/* MASTER: Show toggle */}
        {isMasterUser && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={estimatorForm.estimatorEnabled}
                onChange={(e) => {
                  console.log("CHECKBOX CLICKED - checked:", e.target.checked);
                  console.log("BEFORE UPDATE - estimatorForm:", estimatorForm);
                  const newForm = { ...estimatorForm, estimatorEnabled: e.target.checked };
                  console.log("AFTER UPDATE - newForm:", newForm);
                  setEstimatorForm(newForm);
                  setEstimatorTouched(true); // ← Prevent useEffect from resetting
                  console.log("Set estimatorTouched = true");
                }}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <div className="font-semibold text-gray-900">Enable Estimator</div>
                <div className="text-sm text-gray-600">
                  Allow company admins to access and configure estimator pricing
                </div>
              </div>
            </label>

            <div className="mt-4">
              <button
                onClick={handleSaveEstimator}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Estimator Settings"}
              </button>
            </div>
          </div>
        )}

        {/* ADMIN: Show status */}
        {isAdminUser && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="font-semibold text-gray-900 mb-2">Estimator Pricing</div>
            <div className="text-sm text-gray-600 mb-4">
              Configure pricing for your public-facing estimator tool
            </div>
            <div className="text-sm text-gray-500">
              [Pricing configuration interface coming soon]
            </div>
          </div>
        )}
      </div>
    );
  };

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

        <div className="px-6 py-4 flex flex-wrap gap-2 border-b">
          <button
            className={sectionBtn(activeSection === "info")}
            onClick={() => {
              setActiveSection("info");
              setSectionMode("view");
            }}
          >
            Company Info
          </button>

          {/* GHL KEYS - Master only */}
          {isMasterUser && (
            <button
              className={sectionBtn(activeSection === "ghl")}
              onClick={() => {
                setActiveSection("ghl");
                setSectionMode("edit");
              }}
            >
              GHL Keys
            </button>
          )}

          {/* ESTIMATOR - Master always, Admin only if enabled */}
          {(isMasterUser || (isAdminUser && company?.estimatorEnabled)) && (
            <button
              className={sectionBtn(activeSection === "estimator")}
              onClick={() => {
                setActiveSection("estimator");
                setSectionMode("edit");
              }}
            >
              Estimator
            </button>
          )}

          {/* USERS - Master and Admin */}
          {(isMasterUser || isAdminUser) && !isCreate && (
            <button
              className={sectionBtn(activeSection === "users")}
              onClick={() => {
                setActiveSection("users");
                setSectionMode("view");
              }}
            >
              Users
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeSection === "info" && renderCompanyInfo()}
          {activeSection === "ghl" && renderGHLKeys()}
          {activeSection === "estimator" && renderEstimator()}
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
                  : handleSave()
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
        </div>
      </div>
    </div>
  );
}

// File: src/company/CompanyModal.jsx
// Version: v1.1.0 – Section buttons (Leads-style) + Users tab

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
  const [sectionMode, setSectionMode] = useState("view"); // view | edit (Company Info only)

  const [form, setForm] = useState(null);
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
    } else if (company) {
      setActiveSection("info");
      setSectionMode("view");
      setForm({
        name: company.name || "",
        phone: company.phone || "",
        email: company.email || "",
        address: company.address || "",
      });
    }
  }, [isCreate, company]);

  if (!form) return null;

  // ------------------------------------------------------------
  // HANDLERS
  // ------------------------------------------------------------
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSave = async () => {
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

  // ------------------------------------------------------------
  // UI CLASSES (REUSED STYLE)
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

      {/* NAME */}
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

      {/* PHONE */}
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

      {/* EMAIL */}
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

      {/* ADDRESS */}
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
        {/* HEADER */}
        <div className="bg-blue-600 text-white px-6 py-4 rounded-t-2xl">
          <h2 className="text-xl font-bold">
            {isCreate ? "Add Company" : form.name}
          </h2>
        </div>

        {/* SECTION BUTTONS */}
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

          <button
            className={sectionBtn(activeSection === "ghl")}
            onClick={() => {
              setActiveSection("ghl");
              setSectionMode("edit");
            }}
          >
            GHL Keys
          </button>

          <button
            className={sectionBtn(activeSection === "estimator")}
            onClick={() => {
              setActiveSection("estimator");
              setSectionMode("edit");
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

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeSection === "info" && renderCompanyInfo()}
          {activeSection === "ghl" && renderPlaceholder("GHL")}
          {activeSection === "estimator" && renderPlaceholder("Estimator")}
          {activeSection === "users" && <UsersHome />}
        </div>

        {/* ACTION BAR */}
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
            </butt

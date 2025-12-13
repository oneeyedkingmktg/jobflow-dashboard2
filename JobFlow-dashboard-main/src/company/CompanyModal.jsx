// File: src/company/CompanyModal.jsx
// Version: v1.0.0 – Clone of UserModal for Company Management

import React, { useEffect, useState } from "react";
import { useCompany } from "../CompanyContext";

export default function CompanyModal({
  mode, // "view" | "edit" | "create"
  company,
  onEdit,
  onClose,
  onSave,
}) {
  const isCreate = mode === "create";
  const isView = mode === "view";

  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isCreate) {
      setForm({
        name: "",
        phone: "",
        email: "",
        address: "",
      });
    } else if (company) {
      setForm({
        name: company.name || "",
        phone: company.phone || "",
        email: company.email || "",
        address: company.address || "",
      });
    }
  }, [isCreate, company]);

  if (!form) return null;

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
    } finally {
      setSaving(false);
    }
  };

  /* styles */
  const editBox =
    "w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500";

  const viewRow = "space-y-1";
  const viewLabel = "text-xs text-gray-500 uppercase tracking-wide";
  const viewValue = "text-sm font-semibold text-gray-800";

  const fieldGroup = "space-y-2";
  const formStack = "space-y-5";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="bg-blue-600 text-white px-6 py-4 rounded-t-2xl">
          <h2 className="text-xl font-bold">
            {isView
              ? form.name
              : isCreate
              ? "Add Company"
              : `Edit ${form.name}`}
          </h2>
        </div>

        {/* BODY */}
        <div className={`flex-1 overflow-y-auto px-6 py-5 ${formStack}`}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-600 p-3 text-red-800 rounded">
              {error}
            </div>
          )}

          {/* NAME */}
          <div className={isView ? viewRow : fieldGroup}>
            <div className={viewLabel}>Company Name</div>
            {isView ? (
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
          <div className={isView ? viewRow : fieldGroup}>
            <div className={viewLabel}>Phone</div>
            {isView ? (
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
          <div className={isView ? viewRow : fieldGroup}>
            <div className={viewLabel}>Email</div>
            {isView ? (
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
          <div className={isView ? viewRow : fieldGroup}>
            <div className={viewLabel}>Address</div>
            {isView ? (
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

        {/* ACTION BAR */}
        <div className="border-t px-6 py-4 bg-white rounded-b-2xl">
          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                if (!isView) handleSave();
                onClose();
              }}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold"
              disabled={saving}
            >
              Save & Exit
            </button>

            <button
              onClick={() => {
                if (isView) onEdit();
                else handleSave();
              }}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold"
              disabled={saving}
            >
              {isView ? "Edit" : saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


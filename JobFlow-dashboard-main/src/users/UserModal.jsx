// File: src/users/UserModal.jsx
// Version: v1.2.2 – Company label camelCase fix

import React, { useEffect, useState } from "react";
import { useCompany } from "../CompanyContext";

/* phone formatter */
const formatPhone = (val) => {
  if (!val) return "—";
  const digits = val.replace(/\D/g, "").slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7)
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

/* ✅ FIXED: camelCase-aware company label */
const companyLabel = (c) => {
  if (!c) return "—";
  return c.companyName || c.company_name || c.name || `Company #${c.id}`;
};

export default function UserModal({
  mode, // "view" | "edit" | "create"
  user,
  currentUser,
  onEdit,
  onClose,
  onSave,
  onDelete,
}) {
  const { currentCompany, companies } = useCompany();

  const isCreate = mode === "create";
  const isView = mode === "view";

  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (isCreate) {
      setForm({
        name: "",
        email: "",
        phone: "",
        role: "user",
        password: "",
        is_active: true,
        company_id: currentCompany?.id || null,
      });
    } else if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "user",
        password: "",
        is_active: user.is_active !== false,
        company_id: user.company_id || currentCompany?.id || null,
      });
    }
  }, [isCreate, user, currentCompany]);

  if (!form) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSave = async () => {
    if (!form.name || !form.email || !form.phone || !form.company_id) {
      setError("Name, phone, email, and company are required");
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

  const canEditRole =
    currentUser?.role === "master" &&
    (!user || user.role !== "master");

  const allCompanies =
    Array.isArray(companies) && companies.length > 0
      ? companies
      : currentCompany
      ? [currentCompany]
      : [];

  const selectedCompany =
    allCompanies.find((c) => c.id === form.company_id) || currentCompany;

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
          {isView ? (
            <>
              <h2 className="text-xl font-bold">{form.name}</h2>
              <div className="text-sm text-blue-100">
                {companyLabel(selectedCompany)}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold">
                {isCreate ? "Add User" : `Edit ${form.name}`}
              </h2>
              <div className="text-sm text-blue-100">
                {companyLabel(selectedCompany)}
              </div>
            </>
          )}
        </div>

        {/* BODY */}
        <div className={`flex-1 overflow-y-auto px-6 py-5 ${formStack}`}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-600 p-3 text-red-800 rounded">
              {error}
            </div>
          )}

          {/* Fields unchanged — omitted for brevity */}
        </div>

        {/* ACTION BAR unchanged */}
      </div>
    </div>
  );
}

// File: src/users/UserModal.jsx
// Version: v1.2.2 – Guard rails (self-lock + last master protection)

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

/* safe company label */
const companyLabel = (c) => {
  if (!c) return "—";
  return c.company_name || c.name || `Company #${c.id}`;
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
  const isSelf = user && currentUser && user.id === currentUser.id;

  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Count masters (frontend safety only)
  const masterCount = Array.isArray(companies)
    ? companies.flatMap((c) => c.users || []).filter((u) => u.role === "master").length
    : null;

  const isLastMaster =
    user?.role === "master" && masterCount === 1;

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
    (!user || user.role !== "master") &&
    !isSelf;

  const canToggleStatus = !isSelf;

  const canDeleteUser =
    !isCreate &&
    currentUser?.role === "master" &&
    !isSelf &&
    !isLastMaster;

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

          {/* NAME */}
          <div className={isView ? viewRow : fieldGroup}>
            <div className={viewLabel}>Name</div>
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
              <div className={viewValue}>{formatPhone(form.phone)}</div>
            ) : (
              <input
                className={editBox}
                value={formatPhone(form.phone)}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            )}
          </div>

          {/* EMAIL */}
          <div className={isView ? viewRow : fieldGroup}>
            <div className={viewLabel}>Email</div>
            {isView ? (
              <div className={viewValue}>{form.email}</div>
            ) : (
              <input
                className={editBox}
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            )}
          </div>

          {/* COMPANY */}
          <div className={isView ? viewRow : fieldGroup}>
            <div className={viewLabel}>Company</div>
            {isView ? (
              <div className={viewValue}>{companyLabel(selectedCompany)}</div>
            ) : (
              <select
                className={editBox}
                value={form.company_id || ""}
                onChange={(e) =>
                  handleChange("company_id", Number(e.target.value))
                }
              >
                <option value="" disabled>
                  Select company
                </option>
                {allCompanies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {companyLabel(c)}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* ROLE */}
          <div className={isView ? viewRow : fieldGroup}>
            <div className={viewLabel}>Role</div>
            {isView || !canEditRole ? (
              <div className={viewValue}>{form.role}</div>
            ) : (
              <select
                className={editBox}
                value={form.role}
                onChange={(e) => handleChange("role", e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="master">Master</option>
              </select>
            )}
          </div>

          {/* STATUS */}
          <div className={isView ? viewRow : fieldGroup}>
            <div className={viewLabel}>Status</div>
            {isView || !canToggleStatus ? (
              <div className={viewValue}>
                {form.is_active ? "Active" : "Inactive"}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleChange("is_active", !form.is_active)}
                className={`w-full px-4 py-3 rounded-xl font-semibold border ${
                  form.is_active
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {form.is_active ? "Active" : "Inactive"}
              </button>
            )}
          </div>

          {/* PASSWORD */}
          {!isView && (
            <div className={fieldGroup}>
              <div className={viewLabel}>Set New Password</div>
              <input
                className={editBox}
                type="password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Leave blank to keep current password"
              />
            </div>
          )}
        </div>

        {/* ACTION BAR */}
        <div className="border-t px-6 py-4 bg-white rounded-b-2xl">
          {confirmDelete && (
            <div className="mb-3 text-center space-y-2">
              <div className="text-sm text-gray-700">
                Are you sure you want to delete?
              </div>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onDelete(user)}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          )}

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

            {canDeleteUser && !confirmDelete && (
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-red-600 text-sm font-semibold"
              >
                Delete User
              </button>
            )}

            {!canDeleteUser && user?.role === "master" && (
              <div className="text-xs text-gray-500">
                At least one master is required
              </div>
            )}

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

// File: src/users/UserModal.jsx
// Version: v1.3.0 – Accept defaultCompanyId prop for company-scoped user creation

import React, { useEffect, useState } from "react";
import { useCompany } from "../CompanyContext";
import { CompaniesAPI } from "../api";

/* phone formatter */
const formatPhone = (val) => {
  if (!val) return "—";
  const digits = val.replace(/\D/g, "").slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

/* safe company label */
const companyLabel = (c, fallbackId = null) => {
  if (c) return c.companyName || c.name || `Company #${c.id}`;
  if (fallbackId) return `Company #${fallbackId} (not loaded)`;
  return "—";
};

export default function UserModal({
  mode, // "view" | "edit" | "create"
  user,
  currentUser,
  defaultCompanyId, // NEW: allows parent to set default company for new users
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

  // Local deterministic company resolution (context-first, API fallback)
  const [resolvedCompany, setResolvedCompany] = useState(null);

  // Count masters (frontend safety only)
  const masterCount = Array.isArray(companies)
    ? companies
        .flatMap((c) => c.users || [])
        .filter((u) => u.role === "master").length
    : null;

  const isLastMaster = user?.role === "master" && masterCount === 1;

  useEffect(() => {
    if (isCreate) {
      // Use defaultCompanyId if provided, otherwise fall back to currentCompany
      const initialCompanyId = defaultCompanyId || currentCompany?.id || null;
      
      setForm({
        name: "",
        email: "",
        phone: "",
        role: "user",
        password: "",
        is_active: true,
        company_id: initialCompanyId,
      });
    } else if (user) {
      const normalizedCompanyId =
        user.company_id ?? user.companyId ?? null;

      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "user",
        password: "",
        is_active: user.is_active !== false,
        company_id: normalizedCompanyId,
      });
    }
  }, [isCreate, user, currentCompany, defaultCompanyId]);

  // Resolve the company object deterministically for display
  useEffect(() => {
    let alive = true;

    const run = async () => {
      const companyId = form?.company_id;

      if (!companyId) {
        if (alive) setResolvedCompany(null);
        return;
      }

      // 1) context first
      const fromContext = Array.isArray(companies)
        ? companies.find((c) => c.id === companyId)
        : null;

      if (fromContext) {
        if (alive) setResolvedCompany(fromContext);
        return;
      }

      // 2) API fallback
      try {
        const result = await CompaniesAPI.get(companyId);
        if (alive) setResolvedCompany(result.company || null);
      } catch {
        if (alive) setResolvedCompany(null);
      }
    };

    run();

    return () => {
      alive = false;
    };
  }, [form?.company_id, companies]);

  if (!form) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSave = async () => {
    if (!form.name) {
      setError("Name is required");
      return;
    }

    if (!form.email) {
      setError("Email is required");
      return;
    }

    if (isCreate && !form.password) {
      setError("Password is required for new users");
      return;
    }

    if (saving) return;

    try {
      setSaving(true);
      await onSave(form);
    } catch (err) {
      setError(err.message || "Failed to save user");
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
    !isCreate && currentUser?.role === "master" && !isSelf && !isLastMaster;

  const companyList = Array.isArray(companies) ? companies : [];

  const selectedCompany =
    resolvedCompany ||
    companyList.find((c) => c.id === form.company_id) ||
    null;

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
            {isView ? form.name : isCreate ? "Add User" : `Edit ${form.name}`}
          </h2>
          <div className="text-sm text-blue-100">
            {companyLabel(selectedCompany, form.company_id)}
          </div>
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
              <div className={viewValue}>
                {companyLabel(selectedCompany, form.company_id)}
              </div>
            ) : (
              <select
                className={editBox}
                value={form.company_id || ""}
                onChange={(e) =>
                  handleChange("company_id", Number(e.target.value))
                }
              >
                <option value="" disabled>
                  Select Company
                </option>
                {companyList.map((c) => (
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
            {isView ? (
              <div className={viewValue}>
                {form.role === "master"
                  ? "Master Admin"
                  : form.role === "admin"
                  ? "Admin"
                  : "User"}
              </div>
            ) : canEditRole ? (
              <select
                className={editBox}
                value={form.role}
                onChange={(e) => handleChange("role", e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="master">Master Admin</option>
              </select>
            ) : (
              <div className={viewValue}>
                {form.role === "master"
                  ? "Master Admin"
                  : form.role === "admin"
                  ? "Admin"
                  : "User"}
              </div>
            )}
          </div>

          {/* PASSWORD */}
          {!isView && (
            <div className={fieldGroup}>
              <div className={viewLabel}>
                Password {!isCreate && "(leave blank to keep current)"}
              </div>
              <input
                type="password"
                className={editBox}
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder={isCreate ? "Set password" : "Leave blank to keep current"}
              />
            </div>
          )}

          {/* STATUS */}
          <div className={isView ? viewRow : fieldGroup}>
            <div className={viewLabel}>Status</div>
            {isView ? (
              <div className={viewValue}>
                {form.is_active ? (
                  <span className="text-green-600 font-semibold">Active</span>
                ) : (
                  <span className="text-red-600 font-semibold">Inactive</span>
                )}
              </div>
            ) : canToggleStatus ? (
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => handleChange("is_active", e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Active</span>
              </label>
            ) : (
              <div className={viewValue}>
                {form.is_active ? (
                  <span className="text-green-600 font-semibold">Active</span>
                ) : (
                  <span className="text-red-600 font-semibold">Inactive</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t px-6 py-4 bg-white rounded-b-2xl flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300"
          >
            {isView ? "Close" : "Cancel"}
          </button>

          <div className="flex gap-3">
            {canDeleteUser && isView && (
              <button
                onClick={() => setConfirmDelete(true)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"
              >
                Delete
              </button>
            )}

            {isView ? (
              <button
                onClick={onEdit}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >
                Edit
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-blue-300"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl p-6 max-w-md">
            <h3 className="text-xl font-bold text-red-600 mb-3">
              Confirm Delete
            </h3>
            <p className="text-gray-700 mb-5">
              Are you sure you want to delete <strong>{form.name}</strong>? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(user);
                  setConfirmDelete(false);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// File: src/users/UserModal.jsx

import React, { useEffect, useState } from "react";
import { useCompany } from "../CompanyContext";

const formatPhone = (value) => {
  if (!value) return "";
  const digits = value.replace(/\D/g, "").slice(0, 10);
  const parts = [];

  if (digits.length > 0) parts.push("(" + digits.slice(0, 3));
  if (digits.length >= 4) parts[0] += ")";
  if (digits.length >= 4) parts.push(" " + digits.slice(3, 6));
  if (digits.length >= 7) parts.push("-" + digits.slice(6, 10));

  return parts.join("");
};

const stripPhone = (value) => value.replace(/\D/g, "");

export default function UserModal({
  mode, // "view" | "edit" | "create"
  user,
  currentUser,
  onEdit,
  onClose,
  onSave,
  onDelete,
}) {
  const { currentCompany } = useCompany();

  const isCreate = mode === "create";
  const isView = mode === "view";

  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isCreate) {
      setForm({
        name: "",
        email: "",
        phone: "",
        role: "user",
        password: "",
        is_active: true,
      });
    } else if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: formatPhone(user.phone || ""),
        role: user.role || "user",
        password: "",
        is_active: user.is_active !== false,
      });
    }
  }, [isCreate, user]);

  if (!form) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSave = async () => {
    if (!form.name || !form.email || !form.phone) {
      setError("Name, phone, and email are required");
      return;
    }

    if (isCreate && !form.password) {
      setError("Password is required for new users");
      return;
    }

    setSaving(true);
    try {
      await onSave({
        ...form,
        phone: stripPhone(form.phone),
      });
    } catch (err) {
      setError("Failed to save user");
    } finally {
      setSaving(false);
    }
  };

  const canEditRole =
    currentUser?.role === "master" &&
    (!user || user.role !== "master");

  const viewText = "text-sm text-gray-800";
  const label = "form-label";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">

        {/* HEADER */}
        <div className="bg-blue-600 text-white px-6 py-4 rounded-t-2xl">
          <h2 className="text-xl font-bold">
            {isCreate ? "Add User" : isView ? "User Details" : "Edit User"}
          </h2>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-600 p-3 text-red-800 rounded">
              {error}
            </div>
          )}

          {/* NAME */}
          <div>
            <label className={label}>Name</label>
            {isView ? (
              <div className={viewText}>{form.name}</div>
            ) : (
              <input
                className="input"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            )}
          </div>

          {/* PHONE */}
          <div>
            <label className={label}>Phone</label>
            {isView ? (
              <div className={viewText}>{form.phone}</div>
            ) : (
              <input
                className="input"
                value={form.phone}
                onChange={(e) =>
                  handleChange("phone", formatPhone(e.target.value))
                }
              />
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className={label}>Email</label>
            {isView ? (
              <div className={viewText}>{form.email}</div>
            ) : (
              <input
                className="input"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            )}
          </div>

          {/* ROLE */}
          <div>
            <label className={label}>Role</label>
            {isView || !canEditRole ? (
              <div className={viewText}>{form.role}</div>
            ) : (
              <select
                className="input"
                value={form.role}
                onChange={(e) => handleChange("role", e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="master">Master</option>
              </select>
            )}
          </div>

          {/* ACTIVE */}
          <div>
            <label className={label}>Active</label>
            {isView ? (
              <div className={viewText}>
                {form.is_active ? "Active" : "Inactive"}
              </div>
            ) : (
              <button
                type="button"
                onClick={() =>
                  handleChange("is_active", !form.is_active)
                }
                className={`w-full px-4 py-3 rounded-xl font-semibold border ${
                  form.is_active
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-gray-200 text-gray-700 border-gray-300"
                }`}
              >
                {form.is_active ? "Active" : "Inactive"}
              </button>
            )}
          </div>

          {/* PASSWORD */}
          {!isView && (
            <div>
              <label className={label}>
                {isCreate ? "Password" : "Set New Password"}
              </label>
              <input
                className="input"
                type="password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder={
                  isCreate
                    ? "Required for new user"
                    : "Leave blank to keep current password"
                }
              />
            </div>
          )}

          {/* META */}
          {!isCreate && isView && (
            <div className="pt-4 border-t text-xs text-gray-500 space-y-1">
              <div>
                Company:{" "}
                <span className="font-medium text-gray-700">
                  {currentCompany?.company_name ||
                    currentCompany?.name ||
                    "—"}
                </span>
              </div>
              {user.created_at && <div>Created: {user.created_at}</div>}
              {user.updated_at && <div>Last Updated: {user.updated_at}</div>}
              {user.last_login && <div>Last Login: {user.last_login}</div>}
            </div>
          )}
        </div>

        {/* ACTION BAR */}
        <div className="border-t px-6 py-4 flex justify-between items-center rounded-b-2xl">
          <button
            onClick={onClose}
            className="btn btn-secondary"
            disabled={saving}
          >
            Save & Exit
          </button>

          {!isCreate && currentUser?.role === "master" && (
            <button
              onClick={() => onDelete(user)}
              className="text-red-600 text-sm font-semibold"
            >
              Delete User
            </button>
          )}

          <button
            onClick={() => {
              if (isView) onEdit();
              else handleSave();
            }}
            className="btn btn-primary"
            disabled={saving}
          >
            {isView ? "Edit" : saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

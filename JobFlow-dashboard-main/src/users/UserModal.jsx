// File: src/users/UserModal.jsx

import React, { useEffect, useState } from "react";
import { useCompany } from "../CompanyContext";

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
        phone: user.phone || "",
        role: user.role || "user",
        password: "",
        is_active: user.is_active !== false,
      });
    }
  }, [isCreate, user]);

  if (!form) return null;

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  const validate = () => {
    if (!form.name || !form.email || !form.phone) {
      setError("Name, phone, and email are required");
      return false;
    }

    if (isCreate && !form.password) {
      setError("Password is required for new users");
      return false;
    }

    return true;
  };

  const handleSave = async (closeAfter = false) => {
    if (!validate()) return;

    await onSave(form);

    if (closeAfter) {
      onClose();
    }
  };

  const canEditRole =
    currentUser?.role === "master" &&
    (!user || user.role !== "master");

  const viewBox =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col">

        {/* HEADER */}
        <div className="bg-blue-600 text-white px-6 py-4 rounded-t-2xl">
          <h2 className="text-xl font-bold">
            {isCreate ? "Add User" : isView ? "User Details" : "Edit User"}
          </h2>
        </div>

        {/* BODY */}
        <div className="px-6 py-5 space-y-4 text-gray-900 overflow-y-auto">

          {error && (
            <div className="bg-red-50 border-l-4 border-red-600 p-3 text-red-800 rounded">
              {error}
            </div>
          )}

          {/* NAME */}
          <div>
            <label className="form-label form-label-required">Name</label>
            {isView ? (
              <div className={viewBox}>{form.name}</div>
            ) : (
              <input
                className="input"
                value={form.name}
                onChange={e => handleChange("name", e.target.value)}
              />
            )}
          </div>

          {/* PHONE */}
          <div>
            <label className="form-label form-label-required">Phone</label>
            {isView ? (
              <div className={viewBox}>{form.phone || "—"}</div>
            ) : (
              <input
                className="input"
                value={form.phone}
                onChange={e => handleChange("phone", e.target.value)}
              />
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="form-label form-label-required">Email</label>
            {isView ? (
              <div className={viewBox}>{form.email}</div>
            ) : (
              <input
                className="input"
                value={form.email}
                onChange={e => handleChange("email", e.target.value)}
              />
            )}
          </div>

          {/* ROLE */}
          <div>
            <label className="form-label">Role</label>
            {isView || !canEditRole ? (
              <div className={viewBox}>{form.role}</div>
            ) : (
              <select
                className="input"
                value={form.role}
                onChange={e => handleChange("role", e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="master">Master</option>
              </select>
            )}
          </div>

          {/* ACTIVE */}
          <div>
            <label className="form-label">Active</label>
            {isView ? (
              <div className={viewBox}>
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
            <div>
              <label className="form-label">
                {isCreate ? "Password" : "New Password"}
              </label>
              <input
                type="password"
                className="input"
                value={form.password}
                onChange={e => handleChange("password", e.target.value)}
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
            <div className="pt-4 border-t text-sm text-gray-500 space-y-1">
              <div>Company: {currentCompany?.company_name || "—"}</div>
              {user?.created_at && <div>Created: {user.created_at}</div>}
              {user?.updated_at && <div>Updated: {user.updated_at}</div>}
              {user?.last_login && <div>Last Login: {user.last_login}</div>}
            </div>
          )}
        </div>

        {/* ACTION BAR */}
        <div className="border-t px-6 py-4 flex justify-between items-center rounded-b-2xl">
          <button
            onClick={() => handleSave(true)}
            className="px-4 py-2 rounded-lg bg-gray-200 font-semibold"
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
            onClick={() => (isView ? onEdit() : handleSave(false))}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold"
          >
            {isView ? "Edit" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

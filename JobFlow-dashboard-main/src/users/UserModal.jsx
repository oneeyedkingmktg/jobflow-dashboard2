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
  const isEdit = mode === "edit";

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
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSave = () => {
    if (!form.name || !form.email || !form.phone) {
      setError("Name, phone, and email are required");
      return;
    }
    onSave(form);
  };

  const canEditRole =
    currentUser?.role === "master" &&
    (!user || user.role !== "master");

  /* --- Shared Styles --- */
  const viewBox =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900";

  const editBox =
    "w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500";

  const fieldGroup = "space-y-2";
  const formStack = "space-y-5";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">

        {/* HEADER */}
        <div className="bg-blue-600 text-white px-6 py-4 rounded-t-2xl">
          <h2 className="text-xl font-bold">
            {isCreate ? "Add User" : isEdit ? "Edit User" : "User Details"}
          </h2>
        </div>

        {/* BODY */}
        <div className={`flex-1 overflow-y-auto px-6 py-5 ${formStack} text-gray-900`}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-600 p-3 text-red-800 rounded">
              {error}
            </div>
          )}

          {/* NAME */}
          <div className={fieldGroup}>
            <label className="form-label form-label-required">Name</label>
            {isView ? (
              <div className={viewBox}>{form.name}</div>
            ) : (
              <input
                className={editBox}
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            )}
          </div>

          {/* PHONE */}
          <div className={fieldGroup}>
            <label className="form-label form-label-required">Phone</label>
            {isView ? (
              <div className={viewBox}>{form.phone || "—"}</div>
            ) : (
              <input
                className={editBox}
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            )}
          </div>

          {/* EMAIL */}
          <div className={fieldGroup}>
            <label className="form-label form-label-required">Email</label>
            {isView ? (
              <div className={viewBox}>{form.email}</div>
            ) : (
              <input
                className={editBox}
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            )}
          </div>

          {/* ROLE */}
          <div className={fieldGroup}>
            <label className="form-label">Role</label>
            {isView || !canEditRole ? (
              <div className={viewBox}>{form.role}</div>
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

          {/* ACTIVE */}
          <div className={fieldGroup}>
            <label className="form-label">Active</label>
            {isView ? (
              <div className={viewBox}>
                {form.is_active ? "Active" : "Inactive"}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleChange("is_active", !form.is_active)}
                className={`w-full px-4 py-3 rounded-xl font-semibold border transition ${
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
            <div className={fieldGroup}>
              <label className="form-label">Set New Password</label>
              <input
                className={editBox}
                type="password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Leave blank to keep current password"
              />
            </div>
          )}

          {/* META (VIEW ONLY) */}
          {!isCreate && isView && (
            <div className="pt-4 border-t text-sm text-gray-500 space-y-1">
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
        <div className="border-t px-6 py-4 bg-white flex justify-between items-center rounded-b-2xl">
          <button
            onClick={() => {
              if (!isView) handleSave();
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold"
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
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold"
          >
            {isView ? "Edit" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

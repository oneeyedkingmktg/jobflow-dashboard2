// File: src/users/UserModal.jsx

import React, { useEffect, useState } from "react";

export default function UserModal({
  mode,              // "view" | "edit" | "create"
  user,
  currentUser,
  onEdit,
  onClose,
  onSave,
  onDelete,
}) {
  const isCreate = mode === "create";
  const isView = mode === "view";
  const isEditing = mode === "edit";

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
    if (!form.name || !form.email) {
      setError("Name and email are required");
      return;
    }
    onSave(form);
  };

  const canEditRole =
    currentUser?.role === "master" &&
    (!user || user.role !== "master");

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl relative">

        {/* HEADER */}
        <div className="bg-blue-600 text-white p-6 rounded-t-2xl">
          <h2 className="text-xl font-bold">
            {isCreate
              ? "Add User"
              : isEditing
              ? "Edit User"
              : "User Details"}
          </h2>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4 pb-24">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-600 p-3 text-red-800">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="form-label">Name</label>
            {isView ? (
              <div className="text-gray-900">{form.name}</div>
            ) : (
              <input
                className="input"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            )}
          </div>

          {/* Email */}
          <div>
            <label className="form-label">Email</label>
            {isView ? (
              <div className="text-gray-900">{form.email}</div>
            ) : (
              <input
                className="input"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="form-label">Phone</label>
            {isView ? (
              <div className="text-gray-900">{form.phone || "—"}</div>
            ) : (
              <input
                className="input"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            )}
          </div>

          {/* Role */}
          <div>
            <label className="form-label">Role</label>
            {isView || !canEditRole ? (
              <div className="text-gray-900">{form.role}</div>
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

          {/* Status */}
          <div>
            <label className="form-label">Status</label>
            {isView ? (
              <div className="text-gray-900">
                {form.is_active ? "Active" : "Inactive"}
              </div>
            ) : (
              <select
                className="input"
                value={form.is_active ? "active" : "inactive"}
                onChange={(e) =>
                  handleChange("is_active", e.target.value === "active")
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            )}
          </div>

          {/* Password */}
          {!isView && (
            <div>
              <label className="form-label">
                {isCreate ? "Password" : "Set New Password"}
              </label>
              <input
                className="input"
                type="password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder={
                  isCreate
                    ? "Enter password"
                    : "Leave blank to keep current password"
                }
              />
            </div>
          )}

          {/* META */}
          {!isCreate && (
            <div className="text-sm text-gray-500 pt-4 border-t space-y-1">
              <div>User ID: {user.id}</div>
              {user.created_at && <div>Created: {user.created_at}</div>}
              {user.updated_at && <div>Updated: {user.updated_at}</div>}
              {user.last_login && <div>Last login: {user.last_login}</div>}
            </div>
          )}
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center">
          <button onClick={onClose} className="btn btn-secondary">
            Save & Exit
          </button>

          {!isCreate && (
            <button
              onClick={() => onDelete(user)}
              className="text-red-600 text-sm"
            >
              Delete User
            </button>
          )}

          <button
            onClick={() => {
              if (isEditing || isCreate) {
                handleSave();
              } else {
                onEdit();
              }
            }}
            className="btn btn-primary"
          >
            {isEditing || isCreate ? "Save" : "Edit"}
          </button>
        </div>
      </div>
    </div>
  );
}

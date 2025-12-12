// File: src/users/UserModal.jsx

import React, { useEffect, useState } from "react";

export default function UserModal({
  isCreate,
  user,
  currentUser,
  onClose,
  onSave,
  onDelete,
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user",
    password: "",
    isActive: true,
  });

  const [error, setError] = useState("");

  const isEditing = !isCreate && !!user;

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "user",
        password: "",
        isActive: user.is_active !== false,
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required");
      return;
    }

    if (isCreate && !form.password.trim()) {
      setError("Password is required for new users");
      return;
    }

    onSave(form);
  };

  const canEditRole =
    currentUser?.role === "master" &&
    (!isEditing || user?.role !== "master");

  return (
    <div className="w-full flex justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {isCreate ? "Add User" : "Edit User"}
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              {isCreate
                ? "Create a new user for this company"
                : `Editing ${user?.name}`}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-white/90 hover:text-white underline text-sm"
          >
            Back
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border-l-4 border-red-600 text-red-800 rounded">
              {error}
            </div>
          )}

          {/* NAME */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Name
            </label>
            <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Phone
            </label>
            <input
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
            />
          </div>

          {/* ROLE */}
          {canEditRole && (
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) => handleChange("role", e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="master">Master</option>
              </select>
            </div>
          )}

          {/* PASSWORD */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              {isCreate ? "Password" : "New Password (optional)"}
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
            />
          </div>

          {/* ACTIVE */}
          {!isCreate && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={() =>
                  handleChange("isActive", !form.isActive)
                }
              />
              Active user
            </label>
          )}

          {/* ACTIONS */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg font-bold"
            >
              Back
            </button>

            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
            >
              {isCreate ? "Create User" : "Save Changes"}
            </button>
          </div>

          {/* DELETE */}
          {!isCreate && currentUser?.role === "master" && (
            <div className="pt-4 border-t">
              <button
                onClick={() => onDelete(user)}
                className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold"
              >
                Delete User
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

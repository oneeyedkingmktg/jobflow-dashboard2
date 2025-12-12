// File: src/users/UserModal.jsx
import React, { useState, useEffect } from "react";
import CenteredModalWrapper from "../CenteredModalWrapper";

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
    if (isEditing) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "user",
        password: "",
        isActive: user.is_active !== false,
      });
    } else {
      setForm({
        name: "",
        email: "",
        phone: "",
        role: "user",
        password: "",
        isActive: true,
      });
    }
    setError("");
  }, [isEditing, user]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    if (isCreate && !form.password.trim()) {
      setError("Password is required for new users.");
      return;
    }

    onSave(form);
  };

  const handleDeleteClick = () => {
    if (!user) return;
    if (currentUser && currentUser.id === user.id) {
      setError("You cannot delete your own account.");
      return;
    }
    if (window.confirm("Delete this user? This cannot be undone.")) {
      onDelete(user);
    }
  };

  const title = isCreate ? "Add New User" : "Edit User";

  return (
    <CenteredModalWrapper onClose={onClose}>
      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-t-2xl p-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {user && (
          <p className="text-blue-100 text-sm mt-1">
            Editing: <span className="font-semibold">{user.name}</span>
          </p>
        )}
      </div>

      {/* BODY */}
      <div className="p-6 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border-l-4 border-red-600 rounded text-red-800">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Name
          </label>
          <input
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300"
            placeholder="John Smith"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300"
            placeholder="john@company.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Phone
          </label>
          <input
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300"
            placeholder="555-123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Role
          </label>
          <select
            value={form.role}
            onChange={(e) => handleChange("role", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            {currentUser?.role === "master" && (
              <option value="master">Master</option>
            )}
          </select>
        </div>

        {isCreate && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300"
              placeholder="Temporary password"
            />
          </div>
        )}

        {!isCreate && (
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={() =>
                handleChange("isActive", !form.isActive)
              }
            />
            <span className="text-sm text-gray-700">Active user</span>
          </div>
        )}

        {/* FOOTER */}
        <div className="flex flex-wrap gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-bold"
          >
            Back
          </button>

          <button
            onClick={handleSubmit}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
          >
            Save
          </button>

          {isEditing && (
            <button
              onClick={handleDeleteClick}
              className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </CenteredModalWrapper>
  );
}

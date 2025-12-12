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

  const handleSubmit = () => {
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
    <div className="w-full flex justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="bg-blue-600 text-white p-6 rounded-t-2xl flex justify-between">
          <h2 className="text-xl font-bold">
            {isCreate ? "Add User" : "Edit User"}
          </h2>
          <button onClick={onClose} className="underline">
            Back
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-600 p-3 text-red-800">
              {error}
            </div>
          )}

          <input
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Name"
            className="w-full px-4 py-3 border rounded-lg"
          />

          <input
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 border rounded-lg"
          />

          <input
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Phone"
            className="w-full px-4 py-3 border rounded-lg"
          />

          {canEditRole && (
            <select
              value={form.role}
              onChange={(e) => handleChange("role", e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="master">Master</option>
            </select>
          )}

          <input
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder={isCreate ? "Password" : "New password (optional)"}
            className="w-full px-4 py-3 border rounded-lg"
          />

          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white py-3 rounded-lg"
            >
              Back
            </button>

            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg"
            >
              Save
            </button>
          </div>

          {!isCreate && currentUser?.role === "master" && (
            <button
              onClick={() => onDelete(user)}
              className="w-full bg-red-600 text-white py-3 rounded-lg"
            >
              Delete User
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

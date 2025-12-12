import React, { useState, useEffect } from "react";
import { UsersAPI } from "./api";
import { useCompany } from "./CompanyContext";
import { useAuth } from "./AuthContext";

export default function UserManagement({ onBack }) {
  const { currentCompany } = useCompany();
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const loadUsers = async () => {
    if (!currentCompany) return;

    try {
      setLoading(true);
      const response = await UsersAPI.getAll();
      setUsers(response.users || []);
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentCompany]);

  const handleUpdateUser = async () => {
    setError("");
    setSuccess("");

    if (!editForm.name || !editForm.email) {
      setError("Name and email are required");
      return;
    }

    try {
      await UsersAPI.update(editingUser.id, {
        name: editForm.name,
        email: editForm.email.toLowerCase(),
        phone: editForm.phone,
        role: editForm.role,
        ...(editForm.newPassword ? { password: editForm.newPassword } : {}),
      });

      setSuccess("User updated successfully");
      setEditingUser(null);
      setEditForm(null);
      loadUsers();
    } catch (err) {
      setError(err.message || "Failed to update user");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>

      {error && <div className="mb-4 text-red-600">{error}</div>}
      {success && <div className="mb-4 text-green-600">{success}</div>}

      {editingUser && editForm && (
        <div className="space-y-4 mb-8">
          <h3 className="font-bold">Edit User</h3>

          <input
            className="input"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            placeholder="Name"
          />

          <input
            className="input"
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            placeholder="Email"
          />

          <input
            className="input"
            value={editForm.phone || ""}
            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
            placeholder="Phone"
          />

          <select
            className="input"
            value={editForm.role}
            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            {currentUser.role === "master" && (
              <option value="master">Master</option>
            )}
          </select>

          <input
            className="input"
            type="password"
            value={editForm.newPassword || ""}
            onChange={(e) =>
              setEditForm({ ...editForm, newPassword: e.target.value })
            }
            placeholder="New password (optional)"
          />

          <div className="flex gap-3">
            <button
              onClick={handleUpdateUser}
              className="btn btn-primary"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditingUser(null);
                setEditForm(null);
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {loading ? (
          <div className="text-gray-500">Loading…</div>
        ) : (
          users.map((u) => (
            <div
              key={u.id}
              className="p-4 border rounded-lg flex justify-between items-start"
            >
              <div>
                <div className="font-bold">{u.name}</div>
                <div className="text-sm text-gray-600">{u.email}</div>
                <div className="text-xs text-gray-500">Role: {u.role}</div>
              </div>

              <button
                onClick={() => {
                  setEditingUser(u);
                  setEditForm({
                    name: u.name,
                    email: u.email,
                    phone: u.phone || "",
                    role: u.role,
                    newPassword: "",
                  });
                }}
                className="btn btn-primary"
              >
                Edit
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-8">
        <button onClick={onBack} className="btn btn-secondary">
          Back
        </button>
      </div>
    </div>
  );
}

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

  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
  });

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

  const handleAddUser = async () => {
    setError("");
    setSuccess("");

    if (!newUser.name || !newUser.email || !newUser.password) {
      setError("Name, email, and password are required");
      return;
    }

    try {
      await UsersAPI.create({
        name: newUser.name,
        email: newUser.email.toLowerCase(),
        password: newUser.password,
        phone: newUser.phone,
        role: newUser.role,
      });

      setSuccess("User created successfully");
      setShowAddUser(false);
      setNewUser({ name: "", email: "", password: "", phone: "", role: "user" });
      loadUsers();
    } catch (err) {
      setError(err.message || "Failed to create user");
    }
  };

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

  const handleDeleteUser = async (id) => {
    if (id === currentUser.id) {
      setError("You cannot delete your own account");
      return;
    }

    try {
      await UsersAPI.delete(id);
      setDeleteConfirm(null);
      loadUsers();
    } catch (err) {
      setError(err.message || "Failed to delete user");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      {error && <div className="mb-4 text-red-600">{error}</div>}
      {success && <div className="mb-4 text-green-600">{success}</div>}

      {!showAddUser && !editingUser && (
        <button
          onClick={() => setShowAddUser(true)}
          className="mb-6 px-6 py-3 bg-emerald-600 text-white rounded"
        >
          + Add User
        </button>
      )}

      {editingUser && editForm && (
        <div className="mb-6 space-y-3">
          <h3 className="font-bold">Edit User</h3>

          <input
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            placeholder="Name"
            className="w-full border p-2"
          />

          <input
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            placeholder="Email"
            className="w-full border p-2"
          />

          <input
            value={editForm.phone || ""}
            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
            placeholder="Phone"
            className="w-full border p-2"
          />

          <select
            value={editForm.role}
            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
            className="w-full border p-2"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            {currentUser.role === "master" && <option value="master">Master</option>}
          </select>

          <input
            type="password"
            value={editForm.newPassword || ""}
            onChange={(e) =>
              setEditForm({ ...editForm, newPassword: e.target.value })
            }
            placeholder="New password (optional)"
            className="w-full border p-2"
          />

          <div className="flex gap-2">
            <button
              onClick={handleUpdateUser}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditingUser(null);
                setEditForm(null);
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {users.map((u) => (
          <div key={u.id} className="border p-3 flex justify-between">
            <div>
              <div className="font-bold">{u.name}</div>
              <div className="text-sm">{u.email}</div>
              <div className="text-xs">Role: {u.role}</div>
            </div>
            <div className="flex gap-2">
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
                className="px-3 py-2 bg-blue-600 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteUser(u.id)}
                className="px-3 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button onClick={onBack} className="px-6 py-3 bg-gray-700 text-white rounded">
          Back
        </button>
      </div>
    </div>
  );
}

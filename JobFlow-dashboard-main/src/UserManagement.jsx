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

  const handleUpdateUser = async () => {
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

      setSuccess("User updated");
      setEditingUser(null);
      setEditForm(null);
      loadUsers();
    } catch (err) {
      setError(err.message || "Failed to update user");
    }
  };

  return (
    <div className="p-6 text-gray-900">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      {editingUser && editForm && (
        <div className="space-y-3 mb-6">
          <input
            className="w-full border p-2 text-gray-900"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            placeholder="Name"
          />

          <input
            className="w-full border p-2 text-gray-900"
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            placeholder="Email"
          />

          <input
            className="w-full border p-2 text-gray-900"
            value={editForm.phone || ""}
            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
            placeholder="Phone"
          />

          <select
            className="w-full border p-2 text-gray-900"
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
            className="w-full border p-2 text-gray-900"
            type="password"
            value={editForm.newPassword || ""}
            onChange={(e) =>
              setEditForm({ ...editForm, newPassword: e.target.value })
            }
            placeholder="New password (optional)"
          />

          <button
            onClick={handleUpdateUser}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      )}

      {users.map((u) => (
        <div key={u.id} className="border p-3 mb-2 flex justify-between">
          <div>
            <div className="font-bold">{u.name}</div>
            <div className="text-sm">{u.email}</div>
            <div className="text-xs">Role: {u.role}</div>
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
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            Edit
          </button>
        </div>
      ))}

      <button onClick={onBack} className="mt-6 px-6 py-3 bg-gray-700 text-white rounded">
        Back
      </button>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { UsersAPI } from "./api";
import { useCompany } from "./CompanyContext";
import { useAuth } from "./AuthContext";

export default function UserManagement({ onBack }) {
  const { currentCompany } = useCompany();
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const loadUsers = async () => {
    if (!currentCompany) return;
    const res = await UsersAPI.getAll();
    setUsers(res.users || []);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, [currentCompany]);

  const handleUpdateUser = async () => {
    await UsersAPI.update(editingUser.id, {
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      role: editForm.role,
      ...(editForm.newPassword ? { password: editForm.newPassword } : {}),
    });

    setEditingUser(null);
    setEditForm(null);
    loadUsers();
  };

  const inputStyle = {
    color: "#111",
    caretColor: "#111",
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>

      {editingUser && editForm && (
        <div className="space-y-4 mb-8">
          <input
            className="input"
            style={inputStyle}
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            placeholder="Name"
          />

          <input
            className="input"
            style={inputStyle}
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            placeholder="Email"
          />

          <input
            className="input"
            style={inputStyle}
            value={editForm.phone || ""}
            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
            placeholder="Phone"
          />

          <select
            className="input"
            style={inputStyle}
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
            style={inputStyle}
            type="password"
            value={editForm.newPassword || ""}
            onChange={(e) =>
              setEditForm({ ...editForm, newPassword: e.target.value })
            }
            placeholder="New password (optional)"
          />

          <button
            onClick={handleUpdateUser}
            className="btn btn-primary"
          >
            Save
          </button>
        </div>
      )}

      {loading ? (
        <div>Loading…</div>
      ) : (
        users.map((u) => (
          <div
            key={u.id}
            className="p-4 border rounded-lg flex justify-between"
          >
            <div>
              <div className="font-bold">{u.name}</div>
              <div className="text-sm text-gray-600">{u.email}</div>
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

      <button onClick={onBack} className="btn btn-secondary mt-8">
        Back
      </button>
    </div>
  );
}

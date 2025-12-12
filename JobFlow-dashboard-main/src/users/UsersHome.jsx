// File: src/users/UsersHome.jsx

import React, { useEffect, useState } from "react";
import { UsersAPI } from "../api";
import { useAuth } from "../AuthContext";
import { useCompany } from "../CompanyContext";
import UserCard from "./UserCard.jsx";
import UserModal from "./UserModal.jsx";

export default function UsersHome() {
  const { user, isAuthenticated } = useAuth();
  const { currentCompany } = useCompany();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCreateMode, setIsCreateMode] = useState(false);

  const canManage =
    isAuthenticated && (user?.role === "admin" || user?.role === "master");

  useEffect(() => {
    if (!canManage || !currentCompany) {
      setLoading(false);
      return;
    }
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canManage, currentCompany?.id]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await UsersAPI.getAll();
      setUsers(res.users || []);
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsCreateMode(true);
    setShowModal(true);
  };

  const handleEditUser = (u) => {
    setSelectedUser(u);
    setIsCreateMode(false);
    setShowModal(true);
  };

  const handleSaveUser = async (form) => {
    try {
      setError("");

      if (isCreateMode) {
        const payload = {
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: form.role,
          password: form.password,
        };

        const res = await UsersAPI.create(payload);
        const created = res.user;

        setUsers((prev) => [created, ...prev]);
      } else if (selectedUser) {
        const payload = {
          name: form.name,
          phone: form.phone,
          role: form.role,
          is_active: form.isActive,
        };

        const res = await UsersAPI.update(selectedUser.id, payload);
        const updated = res.user;

        setUsers((prev) =>
          prev.map((u) => (u.id === updated.id ? updated : u))
        );
      }

      setShowModal(false);
      setSelectedUser(null);
      setIsCreateMode(false);
    } catch (err) {
      setError(err.message || "Failed to save user");
    }
  };

  const handleDeleteUser = async (userToDelete) => {
    try {
      await UsersAPI.delete(userToDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setShowModal(false);
      setSelectedUser(null);
      setIsCreateMode(false);
    } catch (err) {
      setError(err.message || "Failed to delete user");
    }
  };

  if (!canManage) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow px-6 py-5 text-gray-700">
          You do not have permission to manage users.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-gray-400">
              Company
            </div>
            <div className="text-lg font-semibold text-gray-800">
              {currentCompany?.company_name || "Current Company"}
            </div>
          </div>
          <button
            onClick={handleAddUser}
            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white shadow hover:bg-blue-700 transition"
          >
            + Add User
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-10 text-center text-gray-500">Loading users…</div>
        ) : users.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            No users found for this company.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {users.map((u) => (
              <UserCard
                key={u.id}
                user={u}
                currentUser={user}
                onEdit={() => handleEditUser(u)}
                onDelete={() => handleDeleteUser(u)}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <UserModal
          isCreate={isCreateMode}
          user={selectedUser}
          currentUser={user}
          onClose={() => {
            setShowModal(false);
            setSelectedUser(null);
            setIsCreateMode(false);
          }}
          onSave={handleSaveUser}
          onDelete={handleDeleteUser}
        />
      )}
    </div>
  );
}

// File: src/users/UsersHome.jsx

import React, { useEffect, useState, useMemo } from "react";
import { UsersAPI } from "../api";
import { useAuth } from "../AuthContext";
import { useCompany } from "../CompanyContext";
import UserCard from "./UserCard.jsx";
import UserModal from "./UserModal.jsx";

export default function UsersHome({ onBack }) {
  const { user, isAuthenticated } = useAuth();
  const { currentCompany } = useCompany();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [mode, setMode] = useState("view"); // view | edit | create

  // ONLY MASTER CAN MANAGE USERS
  const canManage =
    isAuthenticated && user?.role === "master" && !!currentCompany;

  useEffect(() => {
    if (!canManage) {
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

  /* =========================
     OPEN MODAL HANDLERS
     ========================= */

  const openCreate = () => {
    setSelectedUser(null);
    setMode("create");
    setShowModal(true);
  };

  const openView = (u) => {
    setSelectedUser(u);
    setMode("view");
    setShowModal(true);
  };

  const openEdit = () => {
    setMode("edit");
  };

  /* =========================
     SAVE / DELETE
     ========================= */

  const handleSaveUser = async (form) => {
    try {
      setError("");

      if (mode === "create") {
        const payload = {
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: form.role,
          password: form.password,
        };

        const res = await UsersAPI.create(payload);
        const created = res.user || res;
        setUsers((prev) => [created, ...prev]);
      }

      if (mode === "edit" && selectedUser) {
        const payload = {
          name: form.name,
          phone: form.phone,
          role: form.role,
          is_active: form.isActive,
          ...(form.password ? { password: form.password } : {}),
        };

        const res = await UsersAPI.update(selectedUser.id, payload);
        const updated = res.user || res;

        setUsers((prev) =>
          prev.map((u) => (u.id === updated.id ? updated : u))
        );
      }

      closeModal();
    } catch (err) {
      setError(err.message || "Failed to save user");
    }
  };

  const handleDeleteUser = async (userToDelete) => {
    try {
      await UsersAPI.delete(userToDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      closeModal();
    } catch (err) {
      setError(err.message || "Failed to delete user");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setMode("view");
  };

  /* =========================
     SEARCH
     ========================= */

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const term = search.toLowerCase();
    return users.filter((u) => {
      const name = (u.name || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      const phone = (u.phone || "").toLowerCase();
      return (
        name.includes(term) || email.includes(term) || phone.includes(term)
      );
    });
  }, [search, users]);

  if (!canManage) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-4">
          Only the master account can manage users.
        </p>
        {onBack && (
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg font-bold"
          >
            Back
          </button>
        )}
      </div>
    );
  }

  const companyLabel =
    currentCompany?.company_name || currentCompany?.name || "Current Company";

  return (
    <div className="p-6 space-y-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-gray-400">
            Company
          </div>
          <div className="text-lg font-semibold text-gray-800">
            {companyLabel}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users…"
            className="px-4 py-2.5 rounded-lg border-2 border-gray-300 text-sm"
          />
          <button
            onClick={openCreate}
            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white shadow hover:bg-blue-700 transition"
          >
            + Add User
          </button>
        </div>
      </div>

      {/* BODY */}
      {error && (
        <div className="rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-10 text-center text-gray-500">Loading users…</div>
      ) : filteredUsers.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          No users found for this company.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((u) => (
            <UserCard
              key={u.id}
              user={u}
              currentUser={user}
              onClick={() => openView(u)}
            />
          ))}
        </div>
      )}

      {onBack && (
        <div className="pt-6 border-t mt-4 flex justify-end">
          <button
            onClick={onBack}
            className="px-8 py-3 bg-gray-700 text-white font-bold rounded-xl"
          >
            Back
          </button>
        </div>
      )}

      {showModal && (
        <UserModal
          mode={mode}              // "view" | "edit" | "create"
          user={selectedUser}
          currentUser={user}
          onEdit={openEdit}
          onClose={closeModal}
          onSave={handleSaveUser}
          onDelete={handleDeleteUser}
        />
      )}
    </div>
  );
}

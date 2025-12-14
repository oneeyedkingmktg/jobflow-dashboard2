// File: src/company/CompaniesHome.jsx
// Version: v1.0.5 – Header cleanup (Close button, 50/50 actions)

import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../AuthContext";
import { useCompany } from "../CompanyContext";
import CompanyCard from "./CompanyCard.jsx";
import CompanyModal from "./CompanyModal.jsx";

export default function CompaniesHome({ onBack }) {
  const { user, isAuthenticated } = useAuth();
  const {
    companies,
    currentCompany,
    loadCompanies,
    createCompany,
    updateCompany,
    switchCompany,
  } = useCompany();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [modalMode, setModalMode] = useState("view"); // view | edit | create

  const canManage = isAuthenticated && user?.role === "master";

  // ------------------------------------------------------------
  // LOAD companies when screen is opened
  // ------------------------------------------------------------
  useEffect(() => {
    if (!canManage) {
      setLoading(false);
      return;
    }

    const run = async () => {
      try {
        setLoading(true);
        await loadCompanies();
      } catch (err) {
        setError(err.message || "Failed to load companies");
      } finally {
        setLoading(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canManage]);

  const openViewCompany = (c) => {
    if (!c) return;
    setSelectedCompany(c);
    setModalMode("view");
    setShowModal(true);
  };

  const openCreateCompany = () => {
    setSelectedCompany(null);
    setModalMode("create");
    setShowModal(true);
  };

  const handleSaveCompany = async (form) => {
    try {
      setError("");

      if (modalMode === "create") {
        await createCompany(form);
      }

      if (modalMode === "edit" && selectedCompany) {
        await updateCompany(selectedCompany.id, form);
      }

      setShowModal(false);
      setSelectedCompany(null);
      setModalMode("view");
    } catch (err) {
      setError(err.message || "Failed to save company");
    }
  };

  // ------------------------------------------------------------
  // FILTER
  // ------------------------------------------------------------
  const filteredCompanies = useMemo(() => {
    if (!search.trim()) return companies;

    const term = search.toLowerCase();
    return companies.filter((c) =>
      (c.name || "").toLowerCase().includes(term)
    );
  }, [search, companies]);

  if (!canManage) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-4">
          Only the master account can manage companies.
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

  return (
    <div className="p-6 space-y-5">
      {/* HEADER */}
      <div className="grid grid-cols-2 gap-3 items-center">
        <div className="text-lg font-semibold text-gray-800">
          CoatingPro360 – Manage Companies
        </div>

        <button
          onClick={onBack}
          className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg font-semibold"
        >
          Close
        </button>
      </div>

      {/* SEARCH */}
      <div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search companies..."
          className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-10 text-center text-gray-500">
          Loading companies…
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          No companies found.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* CREATE COMPANY CARD */}
          <button
            onClick={openCreateCompany}
            className="h-[90px] flex flex-col items-center justify-center rounded-xl border-2 border-emerald-500 bg-emerald-50 hover:bg-emerald-100 transition"
          >
            <div className="text-emerald-600 text-2xl font-bold">+</div>
            <div className="text-emerald-700 font-semibold mt-1">
              New Company
            </div>
          </button>

          {filteredCompanies.map((c) => (
            <CompanyCard
              key={c.id}
              company={c}
              isActive={currentCompany?.id === c.id}
              onClick={() => openViewCompany(c)}
              onSetActive={() => switchCompany(c.id)}
            />
          ))}
        </div>
      )}

      {showModal && (
        <CompanyModal
          mode={modalMode}
          company={selectedCompany}
          onEdit={() => setModalMode("edit")}
          onClose={() => {
            setShowModal(false);
            setSelectedCompany(null);
            setModalMode("view");
          }}
          onSave={handleSaveCompany}
        />
      )}
    </div>
  );
}

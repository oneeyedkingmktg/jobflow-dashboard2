import React, { useState, useEffect } from "react";
import { CompaniesAPI } from "./api";
import { useCompany } from "./CompanyContext";
import { useAuth } from "./AuthContext";
import CompanyDetails from "./CompanyDetails";

export default function CompanyManagement({ onClose }) {
  const { user } = useAuth();
  const { updateCompany } = useCompany();

  const [companies, setCompanies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);

  // =========================
  // ACCESS GUARD – MASTER ONLY
  // =========================
  if (!user || user.role !== "master") {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            Only the master account can manage all companies.
          </p>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-bold"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // LOAD COMPANIES FROM BACKEND
  // =========================
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await CompaniesAPI.getAll();
        const list = Array.isArray(result)
          ? result
          : result?.companies && Array.isArray(result.companies)
          ? result.companies
          : [];

        setCompanies(list);
        setFiltered(list);
      } catch (err) {
        console.error("Error loading companies:", err);
        setError(err.message || "Failed to load companies");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // =========================
  // SEARCH
  // =========================
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(companies);
      return;
    }

    const term = search.toLowerCase();
    setFiltered(
      companies.filter((c) => {
        const name = (c.name || "").toLowerCase();
        const email = (c.email || "").toLowerCase();
        const city = (c.city || "").toLowerCase();
        const phone = (c.phone || "").toLowerCase();
        return (
          name.includes(term) ||
          email.includes(term) ||
          city.includes(term) ||
          phone.includes(term)
        );
      })
    );
  }, [search, companies]);

  // =========================
  // SAVE FROM DETAILS
  // =========================
  const handleCompanySaved = async (companyId, updates) => {
    setSaving(true);
    setError("");

    try {
      const result = await updateCompany(companyId, updates);
      if (result && result.success === false) {
        throw new Error(result.error || "Failed to update company");
      }

      // Update local state so UI reflects changes
      setCompanies((prev) =>
        prev.map((c) => (c.id === companyId ? { ...c, ...updates } : c))
      );
      setFiltered((prev) =>
        prev.map((c) => (c.id === companyId ? { ...c, ...updates } : c))
      );
      if (selectedCompany && selectedCompany.id === companyId) {
        setSelectedCompany((prev) => ({ ...prev, ...updates }));
      }
    } catch (err) {
      console.error("Error saving company:", err);
      setError(err.message || "Failed to save company");
    } finally {
      setSaving(false);
    }
  };

  const handleAddCompany = () => {
    // Placeholder for future "New Company" flow
    alert("New Company creation flow is not implemented yet.");
  };

  const handleSelectCompany = (company) => {
    setSelectedCompany(company);
  };

  const handleBackFromDetails = () => {
    setSelectedCompany(null);
  };

  // =========================
  // RENDER LIST VIEW
  // =========================
  const renderListView = () => (
    <>
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl p-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Manage Companies</h2>
          <p className="text-blue-100 text-sm mt-1">
            View and manage all JobFlow companies.
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white text-sm font-semibold underline"
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

        {/* CONTROLS */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, email, or city..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleAddCompany}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-md"
          >
            + Company
          </button>
        </div>

        {/* LIST */}
        {loading ? (
          <p className="text-center py-8 text-gray-600">Loading companies...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-8 text-gray-500">
            No companies match your search.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 max-h-[60vh] overflow-y-auto">
            {filtered.map((company) => {
              const isSuspended = !!company.suspended;
              return (
                <button
                  key={company.id}
                  onClick={() => handleSelectCompany(company)}
                  className="relative text-left bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  {/* STATUS TAB */}
                  <div
                    className={`h-2 w-full ${
                      isSuspended ? "bg-red-500" : "bg-emerald-500"
                    }`}
                  />

                  <div className="p-4 space-y-1">
                    <h3 className="text-lg font-bold text-gray-900 truncate">
                      {company.name || "Unnamed Company"}
                    </h3>
                    {company.phone && (
                      <p className="text-sm text-gray-700">
                        Phone: {company.phone}
                      </p>
                    )}
                    {company.email && (
                      <p className="text-sm text-gray-700 truncate">
                        Email: {company.email}
                      </p>
                    )}
                    <p className="text-sm font-semibold mt-1">
                      Status:{" "}
                      <span
                        className={
                          isSuspended ? "text-red-600" : "text-emerald-600"
                        }
                      >
                        {isSuspended ? "Suspended" : "Active"}
                      </span>
                    </p>
                  </div>
                </button>
            );
            })}
          </div>
        )}

        {saving && (
          <p className="text-xs text-gray-400 text-right">
            Saving changes...
          </p>
        )}
      </div>
    </>
  );

  // =========================
  // MAIN MODAL WRAPPER
  // =========================
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
        {selectedCompany ? (
          <CompanyDetails
            company={selectedCompany}
            onBack={handleBackFromDetails}
            onSave={handleCompanySaved}
            saving={saving}
          />
        ) : (
          renderListView()
        )}
      </div>
    </div>
  );
}

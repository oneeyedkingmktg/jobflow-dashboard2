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
        const name = (c.company_name || c.name || "").toLowerCase();
        const email = (c.email || "").toLowerCase();
        const phone = (c.phone || "").toLowerCase();
        const addr = (c.address || "").toLowerCase();

        return (
          name.includes(term) ||
          email.includes(term) ||
          phone.includes(term) ||
          addr.includes(term)
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

      // update UI state
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === companyId ? { ...c, ...updates } : c
        )
      );
      setFiltered((prev) =>
        prev.map((c) =>
          c.id === companyId ? { ...c, ...updates } : c
        )
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

  // =========================
  // SELECT COMPANY
  // =========================
  const handleSelectCompany = (company) => {
    setSelectedCompany(company);
  };

  const handleBack = () => {
    setSelectedCompany(null);
  };

  const handleAddCompany = () => {
    alert("New Company creation flow not implemented yet.");
  };

  // =========================
  // LIST VIEW
  // =========================
  const renderListView = () => (
    <>
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

      <div className="p-6 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border-l-4 border-red-600 text-red-800 rounded">
            {error}
          </div>
        )}

        {/* Search + Add */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search companies..."
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg"
          />

          <button
            onClick={handleAddCompany}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
          >
            + Company
          </button>
        </div>

        {/* Companies List */}
        {loading ? (
          <p className="text-center py-8 text-gray-600">Loading companies...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No companies found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
            {filtered.map((company) => {
              const activeName = company.company_name || company.name || "";
              const isSuspended = !!company.suspended;

              return (
                <button
                  key={company.id}
                  onClick={() => handleSelectCompany(company)}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden text-left"
                >
                  {/* Status Color Tab */}
                  <div
                    className={`h-2 ${
                      isSuspended ? "bg-red-500" : "bg-emerald-500"
                    }`}
                  />

                  <div className="p-4 space-y-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {activeName}
                    </h3>

                    {company.phone && (
                      <p className="text-sm text-gray-700">
                        Phone: {company.phone}
                      </p>
                    )}

                    <p className="text-sm font-semibold">
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
          <p className="text-xs text-gray-500 text-right">Saving changes…</p>
        )}
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full">
        {selectedCompany ? (
          <CompanyDetails
            company={selectedCompany}
            onBack={handleBack}
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

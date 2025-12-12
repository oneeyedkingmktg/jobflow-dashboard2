// ============================================================================
// CompanyContext – Normalized for camelCase + backend integration (v4.0)
// ============================================================================

import { createContext, useContext, useState, useEffect } from "react";
import { CompaniesAPI } from "./api";
import { useAuth } from "./AuthContext";

const CompanyContext = createContext(null);

export const useCompany = () => {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used inside CompanyProvider");
  return ctx;
};

// Normalize backend → frontend
const normalizeCompany = (c) => {
  if (!c) return null;

  return {
    id: c.id,
    companyId: c.id, // convenience alias
    companyName: c.company_name ?? c.companyName ?? "",
    phone: c.phone ?? null,
    email: c.email ?? null,
    address: c.address ?? null,
    city: c.city ?? null,
    state: c.state ?? null,
    zip: c.zip ?? null,
    ghlLocationId: c.ghl_location_id ?? c.ghlLocationId ?? null,
    createdAt: c.created_at ?? null,
    updatedAt: c.updated_at ?? null,
  };
};

export const CompanyProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [companies, setCompanies] = useState([]);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load on login
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setCompanies([]);
      setCurrentCompany(null);
      setLoading(false);
      return;
    }

    loadCompanies();
  }, [isAuthenticated, user]);

  // Fetch from backend
  const loadCompanies = async () => {
    try {
      setLoading(true);

      const companyId =
        user.companyId ??
        user.company_id ??
        null;

      if (companyId) {
        const c = await CompaniesAPI.get(companyId);
        const normalized = normalizeCompany(c);
        setCompanies([normalized]);
        setCurrentCompany(normalized);
      } else {
        setCompanies([]);
        setCurrentCompany(null);
      }
    } catch {
      setCompanies([]);
      setCurrentCompany(null);
    } finally {
      setLoading(false);
    }
  };

  // Switch company (future multi-company support)
  const switchCompany = async (companyId) => {
    try {
      const c = await CompaniesAPI.get(companyId);
      const normalized = normalizeCompany(c);
      setCurrentCompany(normalized);
    } catch {}
  };

  // Create new company
  const createCompany = async (data) => {
    try {
      const created = await CompaniesAPI.create(data);
      const normalized = normalizeCompany(created);
      setCompanies((prev) => [...prev, normalized]);
      setCurrentCompany(normalized);
      return { success: true, company: normalized };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Update company info
  const updateCompany = async (companyId, updates) => {
    try {
      const updated = await CompaniesAPI.update(companyId, updates);
      const normalized = normalizeCompany(updated);

      setCompanies((prev) =>
        prev.map((c) => (c.id === companyId ? normalized : c))
      );

      if (currentCompany?.id === companyId) {
        setCurrentCompany(normalized);
      }

      return { success: true, company: normalized };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteCompany = async () => {
    return { success: false, error: "Delete not implemented" };
  };

  const value = {
    companies,
    currentCompany,
    loading,
    loadCompanies,
    switchCompany,
    createCompany,
    updateCompany,
    deleteCompany,
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};

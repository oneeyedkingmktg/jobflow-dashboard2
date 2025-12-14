// ============================================================================
// CompanyContext – FULL Multi-Company Support (Normalized)
// Version: 4.1 – Normalize company_name → name (single source of truth)
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

// ---------------------------------------------------------------------------
// Normalize company object ONCE here
// ---------------------------------------------------------------------------
const normalizeCompany = (c) => {
  if (!c || typeof c !== "object") return null;

  return {
    ...c,
    name: c.name ?? c.company_name ?? "",
  };
};

export const CompanyProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [companies, setCompanies] = useState([]);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================================================================
  // Load companies automatically when logged in
  // ============================================================================
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setCompanies([]);
      setCurrentCompany(null);
      setLoading(false);
      return;
    }

    loadCompanies();
  }, [isAuthenticated, user]);

  // ============================================================================
  // Load companies
  // ============================================================================
  const loadCompanies = async () => {
    try {
      setLoading(true);

      if (user.role === "master") {
        const res = await CompaniesAPI.getAll();
        const raw = res.companies || [];
        const normalized = raw.map(normalizeCompany).filter(Boolean);

        setCompanies(normalized);
        setCurrentCompany((prev) => {
          if (prev && normalized.some((c) => c.id === prev.id)) {
            return prev;
          }
          return normalized[0] || null;
        });
      } else {
        if (!user.company_id) {
          setCompanies([]);
          setCurrentCompany(null);
          return;
        }

        const res = await CompaniesAPI.get(user.company_id);
        const company = normalizeCompany(res.company);

        setCompanies(company ? [company] : []);
        setCurrentCompany(company);
      }
    } catch (err) {
      console.error("CompanyContext load error:", err);
      setCompanies([]);
      setCurrentCompany(null);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // Switch active company (MASTER ONLY)
  // ============================================================================
  const switchCompany = async (companyId) => {
    try {
      const res = await CompaniesAPI.get(companyId);
      setCurrentCompany(normalizeCompany(res.company));
    } catch (err) {
      console.error("Failed to switch company:", err);
    }
  };

  // ============================================================================
  // CREATE COMPANY (MASTER ONLY)
  // ============================================================================
  const createCompany = async (data) => {
    try {
      const res = await CompaniesAPI.create({
        company_name: data.name,
        phone: data.phone || "",
        email: data.email || "",
        address: data.address || "",
      });

      if (!res.company) {
        return { success: false, error: res.error || "Missing company from API" };
      }

      await loadCompanies();
      return { success: true, company: normalizeCompany(res.company) };
    } catch (err) {
      console.error("createCompany error:", err);
      return { success: false, error: err.message };
    }
  };

  // ============================================================================
  // UPDATE COMPANY
  // ============================================================================
  const updateCompany = async (companyId, updates) => {
    try {
      const res = await CompaniesAPI.update(companyId, updates);

      if (!res.company) {
        return { success: false, error: res.error || "Failed to update company" };
      }

      const normalized = normalizeCompany(res.company);
      setCurrentCompany(normalized);

      if (user.role === "master") {
        await loadCompanies();
      }

      return { success: true, company: normalized };
    } catch (err) {
      console.error("updateCompany error:", err);
      return { success: false, error: err.message };
    }
  };

  // ============================================================================
  // Provider value
  // ============================================================================
  const value = {
    companies,
    currentCompany,
    loading,

    loadCompanies,
    switchCompany,
    createCompany,
    updateCompany,
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};

// ============================================================================
// CompanyContext – FULL Multi-Company Support (Master + Regular Users)
// Version: 4.0 (Includes createCompany + updateCompany)
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
  // Master → all companies
  // Admin/User → only their company
  // ============================================================================
  const loadCompanies = async () => {
    try {
      setLoading(true);

      if (user.role === "master") {
        // MASTER: load ALL companies
        const res = await CompaniesAPI.getAll();
        const allCompanies = res.companies || [];

        setCompanies(allCompanies);
        setCurrentCompany((prev) => {
          // Keep the previously selected company if still valid
          if (prev && allCompanies.some((c) => c.id === prev.id)) return prev;
          return allCompanies[0] || null;
        });
      } else {
        // REGULAR USER: load only assigned company
        if (!user.company_id) {
          console.warn("User has no company_id assigned.");
          setCompanies([]);
          setCurrentCompany(null);
          return;
        }

        const res = await CompaniesAPI.get(user.company_id);
        const company = res.company;

        setCompanies([company]);
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
      setCurrentCompany(res.company);
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

      // refresh list after creation
      await loadCompanies();

      return { success: true, company: res.company };
    } catch (err) {
      console.error("createCompany error:", err);
      return { success: false, error: err.message };
    }
  };

  // ============================================================================
  // UPDATE COMPANY SETTINGS
  // ============================================================================
  const updateCompany = async (companyId, updates) => {
    try {
      const res = await CompaniesAPI.update(companyId, updates);

      if (!res.company) {
        return { success: false, error: res.error || "Failed to update company" };
      }

      // Refresh the company's data in state
      setCurrentCompany(res.company);

      // Update list for master accounts
      if (user.role === "master") {
        await loadCompanies();
      }

      return { success: true, company: res.company };
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

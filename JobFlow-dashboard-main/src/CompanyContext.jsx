// ============================================================================
// CompanyContext – Proper Multi-Company Support (Master + Regular Users)
// Version: 3.1
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

  // ----------------------------------------------------------------------------
  // Load companies as soon as the user is authenticated
  // ----------------------------------------------------------------------------
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setCompanies([]);
      setCurrentCompany(null);
      setLoading(false);
      return;
    }

    loadCompanies();
  }, [isAuthenticated, user]);

  // ----------------------------------------------------------------------------
  // Load companies (master = all, admin/user = only their company)
  // ----------------------------------------------------------------------------
  const loadCompanies = async () => {
    try {
      setLoading(true);

      if (user.role === "master") {
        // Master: load ALL companies
        const list = await CompaniesAPI.getAll();
        const all = list.companies || [];

        setCompanies(all);
        setCurrentCompany(all[0] || null);
      } else {
        // Admin/User: load ONLY assigned company
        if (!user.company_id) {
          console.warn("User has no company_id assigned");
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

  // ----------------------------------------------------------------------------
  // Switch active company (master only)
  // ----------------------------------------------------------------------------
  const switchCompany = async (companyId) => {
    try {
      const res = await CompaniesAPI.get(companyId);
      setCurrentCompany(res.company);
    } catch (err) {
      console.error("Failed to switch company:", err);
    }
  };

  // ----------------------------------------------------------------------------
  // Exposed values
  // ----------------------------------------------------------------------------
  const value = {
    companies,
    currentCompany,
    loading,
    loadCompanies,
    switchCompany,
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};

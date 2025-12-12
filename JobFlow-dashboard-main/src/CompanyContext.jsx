// ============================================================================
// CompanyContext – Proper Multi-Company Support (Master + Regular Users)
// ============================================================================

import { createContext, useContext, useState, useEffect } from "react";
import { CompaniesAPI } from "./api";
import { useAuth } from "./AuthContext";

const CompanyContext = createContext(null);
export const useCompany = () => useContext(CompanyContext);

export const CompanyProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [companies, setCompanies] = useState([]);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  // ----------------------------------------------------------------------------
  // Load companies after login
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
  // Load companies (master = all companies, others = 1 company)
  // ----------------------------------------------------------------------------
  const loadCompanies = async () => {
    try {
      setLoading(true);

      if (user.role === "master") {
        // Master can view all companies
        const list = await CompaniesAPI.getAll();
        const all = list.companies || [];

        setCompanies(all);
        setCurrentCompany(all[0] || null);
      } else {
        // Regular users: only their assigned company
        if (!user.company_id) {
          console.warn("User has no company_id");
          setCompanies([]);
          setCurrentCompany(null);
          return;
        }

        const { company } = await CompaniesAPI.get(user.company_id);
        setCompanies([company]);
        setCurrentCompany(company);
      }
    } catch (err) {
      console.error("Failed loading companies:", err);
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
      const { company } = await CompaniesAPI.get(companyId);
      setCurrentCompany(company);
    } catch (err) {
      console.error("Failed to switch company:", err);
    }
  };

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

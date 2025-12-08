// ============================================================================
// CompanyContext – Fully Backend-Integrated (v3.0)
// ============================================================================

import { createContext, useContext, useState, useEffect } from 'react';
import { CompaniesAPI } from './api';
import { useAuth } from './AuthContext';

const CompanyContext = createContext(null);

export const useCompany = () => {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error('useCompany must be used inside CompanyProvider');
  return ctx;
};

export const CompanyProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [companies, setCompanies] = useState([]);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  // ----------------------------------------------------------------------------
  // Load companies on login
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
  // Load from backend
  // ----------------------------------------------------------------------------
  const loadCompanies = async () => {
    try {
      setLoading(true);

      // If future version has multi-company membership, switch to:
      // const list = await CompaniesAPI.getAll();
      // setCompanies(list);

      if (user?.company_id) {
        const company = await CompaniesAPI.get(user.company_id);
        setCompanies([company]);
        setCurrentCompany(company);
      } else {
        setCompanies([]);
        setCurrentCompany(null);
      }
    } catch (err) {
      console.error('Failed loading companies:', err);
      setCompanies([]);
      setCurrentCompany(null);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------------------------
  // Switch company (future multi-company admin support)
  // ----------------------------------------------------------------------------
  const switchCompany = async (companyId) => {
    try {
      const company = await CompaniesAPI.get(companyId);
      setCurrentCompany(company);
    } catch (err) {
      console.error('Failed to switch company:', err);
    }
  };

  // ----------------------------------------------------------------------------
  // Create company (master/admin only)
  // ----------------------------------------------------------------------------
  const createCompany = async (data) => {
    try {
      const created = await CompaniesAPI.create(data);
      setCompanies(prev => [...prev, created]);
      setCurrentCompany(created);
      return { success: true, company: created };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // ----------------------------------------------------------------------------
  // Update company
  // ----------------------------------------------------------------------------
  const updateCompany = async (companyId, updates) => {
    try {
      const updated = await CompaniesAPI.update(companyId, updates);

      setCompanies(prev =>
        prev.map(c => (c.id === companyId ? updated : c))
      );

      if (currentCompany?.id === companyId) {
        setCurrentCompany(updated);
      }

      return { success: true, company: updated };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // ----------------------------------------------------------------------------
  // Delete company (future expansion)
  // ----------------------------------------------------------------------------
  const deleteCompany = async () => {
    console.warn('Company deletion not implemented.');
    return { success: false, error: 'Delete not implemented' };
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

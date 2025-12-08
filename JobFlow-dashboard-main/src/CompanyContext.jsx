// ============================================================================
// CompanyContext – Updated for Real Backend Companies (v2.0)
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

  // Load companies on login
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setCompanies([]);
      setCurrentCompany(null);
      setLoading(false);
      return;
    }

    loadCompanies();
  }, [isAuthenticated, user]);

  // Load from backend
  const loadCompanies = async () => {
    try {
      setLoading(true);

      // This will eventually change when you add a /companies list endpoint
      // For now, each user only belongs to ONE company (req.user.company_id)
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

  // Switch company (future multi-company support)
  const switchCompany = async (companyId) => {
    try {
      const company = await CompaniesAPI.get(companyId);
      setCurrentCompany(company);
    } catch (err) {
      console.error('Switch company failed:', err);
    }
  };

  // Create company
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

  // Update company
  const updateCompany = async (companyId, updates) => {
    try {
      const updated = await CompaniesAPI.update(companyId, updates);

      setCompanies(prev =>
        prev.map(c => (c.id === companyId ? updated : c))
      );

      if (currentCompany?.id === companyId) {
        setCurrentCompany(updated);
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Delete company (future support)
  const deleteCompany = async () => {
    console.warn('Company deletion not supported yet.');
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

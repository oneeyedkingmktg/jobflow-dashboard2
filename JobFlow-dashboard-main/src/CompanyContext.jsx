import React, { createContext, useContext, useState, useEffect } from 'react';

const CompanyContext = createContext(null);

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

export const CompanyProvider = ({ children }) => {
  const [currentCompany, setCurrentCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load companies and current company on mount
  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = () => {
    const stored = localStorage.getItem('companies');
    const companyList = stored ? JSON.parse(stored) : [];
    setCompanies(companyList);

    // Load current company
    const currentCompanyId = localStorage.getItem('currentCompanyId');
    if (currentCompanyId && companyList.length > 0) {
      const company = companyList.find(c => c.id === currentCompanyId);
      setCurrentCompany(company || companyList[0]);
    } else if (companyList.length > 0) {
      setCurrentCompany(companyList[0]);
      localStorage.setItem('currentCompanyId', companyList[0].id);
    }

    setLoading(false);
  };

  const switchCompany = (companyId) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      setCurrentCompany(company);
      localStorage.setItem('currentCompanyId', companyId);
    }
  };

  const createCompany = (companyData) => {
    const newCompany = {
      id: `comp_${Date.now()}`,
      ...companyData,
      createdAt: new Date().toISOString()
    };

    const updatedCompanies = [...companies, newCompany];
    localStorage.setItem('companies', JSON.stringify(updatedCompanies));
    setCompanies(updatedCompanies);
    
    // Set as current company
    setCurrentCompany(newCompany);
    localStorage.setItem('currentCompanyId', newCompany.id);

    return { success: true, company: newCompany };
  };

  const updateCompany = (companyId, updates) => {
    const updatedCompanies = companies.map(c => 
      c.id === companyId ? { ...c, ...updates } : c
    );
    localStorage.setItem('companies', JSON.stringify(updatedCompanies));
    setCompanies(updatedCompanies);

    // Update current company if it's the one being edited
    if (currentCompany?.id === companyId) {
      setCurrentCompany({ ...currentCompany, ...updates });
    }

    return { success: true };
  };

  const deleteCompany = (companyId) => {
    const updatedCompanies = companies.filter(c => c.id !== companyId);
    localStorage.setItem('companies', JSON.stringify(updatedCompanies));
    setCompanies(updatedCompanies);

    // If deleting current company, switch to first available
    if (currentCompany?.id === companyId) {
      if (updatedCompanies.length > 0) {
        setCurrentCompany(updatedCompanies[0]);
        localStorage.setItem('currentCompanyId', updatedCompanies[0].id);
      } else {
        setCurrentCompany(null);
        localStorage.removeItem('currentCompanyId');
      }
    }

    // Delete all users associated with this company
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const filteredUsers = users.filter(u => u.companyId !== companyId);
    localStorage.setItem('users', JSON.stringify(filteredUsers));

    return { success: true };
  };

  const getCompanyById = (companyId) => {
    return companies.find(c => c.id === companyId);
  };

  const value = {
    currentCompany,
    companies,
    loading,
    switchCompany,
    createCompany,
    updateCompany,
    deleteCompany,
    getCompanyById,
    loadCompanies
  };

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
};
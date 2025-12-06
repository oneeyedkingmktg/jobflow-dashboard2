import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { CompanyProvider, useCompany } from './CompanyContext';
import InitialSetup from './InitialSetup';
import Login from './Login';
import LeadsHome from './LeadsHome.jsx';
import CompanyWizard from './CompanyWizard';
import './index.css';

function AppContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { companies, loading: companyLoading } = useCompany();
  const [showCompanyWizard, setShowCompanyWizard] = useState(false);

  // Show loading spinner while checking authentication
  if (isLoading || companyLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show login
  if (!isAuthenticated || !user) {
    return <Login />;
  }

  // User is authenticated - show main application
  return (
    <div className="min-h-screen bg-gray-50">
      <LeadsHome currentUser={user} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CompanyProvider>
        <AppContent />
      </CompanyProvider>
    </AuthProvider>
  );
}

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import { CompanyProvider, useCompany } from "./CompanyContext";
import Login from "./Login";
import LeadsHome from "./LeadsHome.jsx";
import CompaniesHome from "./company/CompaniesHome.jsx";
import "./index.css";

/* ===========================================================
   Error Boundary (Prevents React from white-screening)
   =========================================================== */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error.message || "Unknown error" };
  }

  componentDidCatch(error, info) {
    console.error("React ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="p-8 bg-white rounded-xl shadow-xl max-w-lg">
            <h1 className="text-2xl font-bold text-red-600 mb-2">App Error</h1>
            <p className="text-gray-700 mb-4">{this.state.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/* ===========================================================
   ROUTED APP CONTENT
   =========================================================== */
function AppContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { currentCompany, companies, loading: companyLoading } = useCompany();

  const fullyLoading = isLoading || companyLoading;

  /* ---------------------------------------
     Global loading
     --------------------------------------- */
  if (fullyLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  /* ---------------------------------------
     Auth gate
     --------------------------------------- */
  if (!isAuthenticated || !user) {
    return <Login />;
  }

  /* ---------------------------------------
     Master with no companies
     --------------------------------------- */
  if (user.role === "master" && companies.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 bg-white rounded-xl shadow-lg max-w-lg">
          <h2 className="text-2xl font-bold mb-4">Welcome Master Admin</h2>
          <p className="text-gray-700 mb-6">
            You have no companies yet. Use the Settings menu to create the first one.
          </p>
        </div>
      </div>
    );
  }

  /* ---------------------------------------
     Company not ready
     --------------------------------------- */
  if (!currentCompany) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-700">Preparing your company workspace…</p>
      </div>
    );
  }

  /* ---------------------------------------
     Routes
     --------------------------------------- */
  return (
    <Routes>
      <Route path="/" element={<LeadsHome currentUser={user} />} />
      <Route
        path="/companies"
        element={
          user.role === "master" ? (
            <CompaniesHome />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/* ===========================================================
   APP ROOT
   =========================================================== */
export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CompanyProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </CompanyProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

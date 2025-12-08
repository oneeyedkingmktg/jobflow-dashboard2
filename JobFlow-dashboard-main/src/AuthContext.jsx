// ============================================================================
// AuthContext - Fully Updated for Backend Auth + User Management
// ============================================================================
import { createContext, useContext, useState, useEffect } from 'react';
import { AuthAPI, UsersAPI } from './api';

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load token + user on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsLoading(false);
      return;
    }

    // We no longer have /auth/me — simplify by trusting token
    setIsAuthenticated(true);
    setIsLoading(false);
  }, []);

  // LOGIN
  const login = async (email, password) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await AuthAPI.login(email, password);

      localStorage.setItem('authToken', response.token);
      setUser(response.user || null);
      setIsAuthenticated(true);

      return { success: true };
    } catch (err) {
      setError(err.message || 'Login failed');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  // ============================
  // USER MANAGEMENT (BACKEND)
  // ============================

  const createUser = async (payload) => {
    try {
      const response = await UsersAPI.create(payload);
      return { success: true, user: response.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateUser = async (id, updates) => {
    try {
      const response = await UsersAPI.update(id, updates);
      if (user && user.id === id) setUser(response.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteUser = async (id) => {
    try {
      await UsersAPI.delete(id);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const getUsersByCompany = async (companyId) => {
    try {
      const response = await UsersAPI.getAll();
      return response.users.filter(u => u.company_id === companyId);
    } catch (err) {
      return [];
    }
  };

  // MASTER FLAG (user.role === 'master')
  const isMaster = user?.role === 'master';

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,

    createUser,
    updateUser,
    deleteUser,
    getUsersByCompany,
    isMaster,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

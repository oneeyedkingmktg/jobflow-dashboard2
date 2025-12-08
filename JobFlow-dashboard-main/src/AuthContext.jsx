// ============================================================================
// AuthContext - Updated to use Backend API
// ============================================================================
import { createContext, useContext, useState, useEffect } from 'react';
import { AuthAPI } from './api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

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

  const logout = async () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

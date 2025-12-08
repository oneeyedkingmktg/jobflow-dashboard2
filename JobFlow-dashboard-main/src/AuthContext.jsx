// ============================================================================
// AuthContext – Fully Updated for Backend JWT Auth (v2.0)
// ============================================================================

import { createContext, useContext, useState, useEffect } from 'react';
import { AuthAPI } from './api';

// IMPORTANT: export AuthContext so other files can import it
const AuthContext = createContext();
export { AuthContext };

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

  // Load token + fetch user profile
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        const me = await AuthAPI.me();
        setUser(me.user || null);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('authToken');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login (JWT + user object)
  const login = async (email, password) => {
    try {
      setError(null);
      setIsLoading(true);

      const res = await AuthAPI.login(email, password);

      // Save token
      localStorage.setItem('authToken', res.token);

      // Set user
      setUser(res.user || null);
      setIsAuthenticated(true);

      return { success: true };
    } catch (err) {
      const message = err.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = () => {
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

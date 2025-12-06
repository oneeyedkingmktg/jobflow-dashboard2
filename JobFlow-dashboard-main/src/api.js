// =============================================================================
// API Configuration
// =============================================================================
// FORCE REBUILD - Cache bust v1.0

const API_BASE_URL = 'https://jobflow-backend-tw5u.onrender.com/api';

// Generic API request handler
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...defaultOptions,
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API Error');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  login: async (email, password) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getCurrentUser: async () => apiRequest('/auth/verify'),

  logout: async () =>
    apiRequest('/auth/logout', {
      method: 'POST',
    }),
};

// Leads API calls
export const leadsAPI = {
  getAll: async () => apiRequest('/leads'),

  create: async (leadData) =>
    apiRequest('/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    }),

  update: async (id, leadData) =>
    apiRequest(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(leadData),
    }),

  delete: async (id) =>
    apiRequest(`/leads/${id}`, {
      method: 'DELETE',
    }),
};

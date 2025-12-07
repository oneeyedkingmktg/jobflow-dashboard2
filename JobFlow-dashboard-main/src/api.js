// =============================================================================
// API Configuration
// =============================================================================
// FORCE REBUILD - Cache bust v1.1

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
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, defaultOptions);

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(errorText || 'API request failed');
  }

  return response.json().catch(() => ({}));
};

// =============================================================================
// AUTH
// =============================================================================

export const AuthAPI = {
  login: (email, password) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

// =============================================================================
// USERS
// =============================================================================

export const UsersAPI = {
  getAll: () => apiRequest('/users'),
  get: (id) => apiRequest(`/users/${id}`),
  update: (id, data) =>
    apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// =============================================================================
// COMPANIES
// =============================================================================

export const CompaniesAPI = {
  create: (data) =>
    apiRequest('/companies', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  get: (id) => apiRequest(`/companies/${id}`),

  update: (id, data) =>
    apiRequest(`/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// =============================================================================
// LEADS
// =============================================================================

export const LeadsAPI = {
  getAll: () => apiRequest('/leads'),
  get: (id) => apiRequest(`/leads/${id}`),

  create: (leadData) =>
    apiRequest('/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    }),

  update: (id, leadData) =>
    apiRequest(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(leadData),
    }),

  delete: (id) =>
    apiRequest(`/leads/${id}`, {
      method: 'DELETE',
    }),
};

// =============================================================================
// GHL (NEW)
// =============================================================================

export const GHLAPI = {
  searchByPhone: (phone, companyId) =>
    apiRequest(`/ghl/search-by-phone?phone=${encodeURIComponent(phone)}`, {
      method: 'GET',
      headers: {
        'x-company-id': companyId,
      },
    }),

  syncLead: (leadData, companyId) =>
    apiRequest('/ghl/sync-lead', {
      method: 'POST',
      headers: {
        'x-company-id': companyId,
      },
      body: JSON.stringify(leadData),
    }),

  getContact: (contactId, companyId) =>
    apiRequest(`/ghl/contact/${contactId}`, {
      method: 'GET',
      headers: {
        'x-company-id': companyId,
      },
    }),
};

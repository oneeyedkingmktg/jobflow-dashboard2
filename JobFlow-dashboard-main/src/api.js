/* ============================================================================
   API Configuration
   ============================================================================
   FORCE REBUILD - Cache bust v4.0
============================================================================ */

const API_BASE_URL = 'https://jobflow-backend-tw5u.onrender.com';

/* Generic API request handler */
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
    ...options,
  });

  // Error handling (safe)
  if (!response.ok) {
    let message = 'API request failed';
    try {
      const clone = response.clone();
      const json = await clone.json().catch(() => null);
      if (json?.message) message = json.message;
      if (json?.error) message = json.error;
    } catch (_) {}
    throw new Error(message);
  }

  // Success (safe JSON)
  try {
    return await response.json();
  } catch {
    return {};
  }
};

/* ============================================================================
   AUTH
============================================================================ */

export const AuthAPI = {
  login: (email, password) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => apiRequest('/auth/verify'),
};

/* ============================================================================
   USERS
============================================================================ */

export const UsersAPI = {
  getAll: () => apiRequest('/users'),
  get: (id) => apiRequest(`/users/${id}`),

  create: (data) =>
    apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    apiRequest(`/users/${id}`, {
      method: 'DELETE',
    }),

  changePassword: (currentPassword, newPassword) =>
    apiRequest('/users/me/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

/* ============================================================================
   COMPANIES
============================================================================ */

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

  getAll: () => apiRequest('/companies'),
};

/* ============================================================================
   LEADS
============================================================================ */

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

/* ============================================================================
   GHL ENDPOINTS
============================================================================ */

export const GHLAPI = {
  searchByPhone: (phone, companyId) =>
    apiRequest(`/ghl/search-by-phone?phone=${encodeURIComponent(phone)}`, {
      method: 'GET',
      headers: { 'x-company-id': companyId },
    }),

  syncLead: (leadData, companyId) =>
    apiRequest('/ghl/sync-lead', {
      method: 'POST',
      headers: { 'x-company-id': companyId },
      body: JSON.stringify(leadData),
    }),

  getContact: (contactId, companyId) =>
    apiRequest(`/ghl/contact/${contactId}`, {
      method: 'GET',
      headers: { 'x-company-id': companyId },
    }),
};

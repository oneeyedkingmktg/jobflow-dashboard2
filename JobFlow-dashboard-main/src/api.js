/* ============================================================================
   API Configuration
   ============================================================================
   FORCE REBUILD - Cache bust v5.2 - Add company_id filtering to UsersAPI
============================================================================ */

const API_BASE_URL = 'https://jobflow-backend-tw5u.onrender.com';

/* Utility to convert camelCase → snake_case for payloads */
const toSnake = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const out = {};
  for (const key in obj) {
    const snake = key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
    const value = obj[key] === '' ? null : obj[key];
    
    // Debug logging for booleans
    if (typeof obj[key] === 'boolean') {
      console.log(`toSnake: ${key} (${typeof obj[key]}) = ${obj[key]} → ${snake} (${typeof value}) = ${value}`);
    }
    
    out[snake] = value;
  }
  return out;
};

/* Utility to convert snake_case → camelCase */
const toCamel = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const out = {};
  for (const key in obj) {
    const camel = key.replace(/_([a-z])/g, (_, m) => m.toUpperCase());
    out[camel] = obj[key];
  }
  return out;
};

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

  try {
    const json = await response.json();

    // 🔑 CRITICAL FIX: preserve token when present
    if (json.token && json.user) {
      return {
        token: json.token,
        user: toCamel(json.user),
      };
    }

    if (json.company) return { company: toCamel(json.company) };
    if (json.companies) return { companies: json.companies.map(toCamel) };
    if (json.user) return { user: toCamel(json.user) };
    if (json.users) return { users: json.users.map(toCamel) };
    if (json.lead) return { lead: toCamel(json.lead) };
    if (json.leads) return { leads: json.leads.map(toCamel) };

    return json;
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
  getAll: (companyId) => {
    const url = companyId ? `/users?company_id=${companyId}` : '/users';
    return apiRequest(url);
  },
  get: (id) => apiRequest(`/users/${id}`),

  create: (data) =>
    apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(toSnake(data)),
    }),

  update: (id, data) =>
    apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(toSnake(data)),
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
      body: JSON.stringify(toSnake(data)),
    }),

  get: (id) => apiRequest(`/companies/${id}`),

  update: (id, data) => {
    console.log("=== CompaniesAPI.update CALLED ===");
    console.log("ID:", id);
    console.log("Data received:", JSON.stringify(data, null, 2));
    
    // CRITICAL FIX: Don't call toSnake if data is already snake_case
    // Check if data has snake_case keys (contains underscore)
    const hasSnakeCase = Object.keys(data).some(key => key.includes('_'));
    
    let finalData;
    if (hasSnakeCase) {
      console.log("Data is already snake_case, sending as-is");
      finalData = data;
    } else {
      console.log("Data is camelCase, converting to snake_case");
      finalData = toSnake(data);
    }
    
    console.log("Final data to send:", JSON.stringify(finalData, null, 2));
    
    return apiRequest(`/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(finalData),
    });
  },

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
      body: JSON.stringify(toSnake(leadData)),
    }),

  update: (id, leadData) =>
    apiRequest(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(toSnake(leadData)),
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
      body: JSON.stringify(toSnake(leadData)),
    }),

  getContact: (contactId, companyId) =>
    apiRequest(`/ghl/contact/${contactId}`, {
      method: 'GET',
      headers: { 'x-company-id': companyId },
    }),
};

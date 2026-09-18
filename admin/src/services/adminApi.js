/**
 * Administrative API Client for Shive Shakti Enterprises
 * Standardized authenticated fetch client with token injection and error handling.
 */

const rawApiUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'http://localhost:5000/api';

const cleanBaseUrl = rawApiUrl.replace(/\/+$/, '');
const BASE_URL = cleanBaseUrl.endsWith('/api') ? cleanBaseUrl : `${cleanBaseUrl}/api`;

async function request(endpoint, options = {}) {
  const url = `${BASE_URL.replace(/\/+$/, '')}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const token =
    typeof localStorage !== 'undefined'
      ? localStorage.getItem('admin_token')
      : null;

  const headers = {
    ...options.headers,
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    credentials: 'include',
    ...options,
    headers,
  };

  // If body is plain JSON object and headers don't have Content-Type, add it
  if (options.body && !(options.body instanceof FormData) && !config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, config);

  let data = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    const error = new Error(
      data?.error?.message || data?.message || `Request failed with status ${response.status}`
    );
    error.status = response.status;
    error.fields = data?.error?.fields || null;
    throw error;
  }

  return data;
}

export const adminApi = {
  // Stats
  getDashboardStats: () => request('/admin/dashboard/stats'),

  // Products
  getAdminProducts: () => request('/admin/products'),
  getProductById: (id) => request(`/admin/products/${encodeURIComponent(id)}`),
  createProduct: (productData) =>
    request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),
  updateProduct: (id, productData) =>
    request(`/admin/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    }),
  deleteProduct: (id) =>
    request(`/admin/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),
  uploadProductImage: (id, file) => {
    const formData = new FormData();
    formData.append('image', file);
    return request(`/admin/products/${encodeURIComponent(id)}/images`, {
      method: 'POST',
      body: formData,
    });
  },

  // Categories
  getCategories: () => request('/categories'),
  getAdminCategories: () => request('/admin/categories'),
  getCategoryById: (id) => request(`/admin/categories/${encodeURIComponent(id)}`),
  createCategory: (categoryData) =>
    request('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    }),
  updateCategory: (id, categoryData) =>
    request(`/admin/categories/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    }),
  deleteCategory: (id) =>
    request(`/admin/categories/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),
  uploadCategoryImage: (id, file) => {
    const formData = new FormData();
    formData.append('image', file);
    return request(`/admin/categories/${encodeURIComponent(id)}/image`, {
      method: 'POST',
      body: formData,
    });
  },

  // Settings
  getSettings: () => request('/admin/settings'),
  updateSettings: (settingsData) =>
    request('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    }),
};

export default adminApi;

/**
 * Unified API Client for Shive Shakti Enterprises
 * Standardized error handling, network failure recovery, and development fallbacks.
 */

const BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'http://localhost:5000/api';

export class ApiError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.isNetworkError = status === 0;
  }
}

/**
 * Builds full URL combining BASE_URL and endpoint path with query parameters.
 */
function buildUrl(endpoint, params = {}) {
  const cleanBase = BASE_URL.replace(/\/+$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = new URL(`${cleanBase}${cleanEndpoint}`);

  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

/**
 * Core HTTP request handler
 */
async function request(endpoint, options = {}) {
  const { params, headers = {}, ...customConfig } = options;
  const url = buildUrl(endpoint, params);

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    },
    ...customConfig,
  };

  try {
    const response = await fetch(url, config);

    let data = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? { message: text } : null;
    }

    if (!response.ok) {
      const errorMessage =
        data?.error?.message ||
        data?.message ||
        `Request failed with status ${response.status}`;
      throw new ApiError(errorMessage, response.status, data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle Network / Connection failures (e.g. backend server is stopped)
    const isNetwork =
      error.name === 'TypeError' ||
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('NetworkError');

    throw new ApiError(
      isNetwork
        ? 'Unable to connect to the store concierge service. Please check your internet connection or verify the server is active.'
        : error.message || 'An unexpected error occurred.',
      0,
      null
    );
  }
}

export const api = {
  get: (endpoint, params) => request(endpoint, { method: 'GET', params }),
  post: (endpoint, body) =>
    request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) =>
    request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

export default api;

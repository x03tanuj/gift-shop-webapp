/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const rawApiUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'http://localhost:5000/api';

const cleanApiUrl = rawApiUrl.replace(/\/+$/, '');
const API_URL = cleanApiUrl.endsWith('/api') ? cleanApiUrl : `${cleanApiUrl}/api`;

/**
 * Authentication Provider for the Admin application.
 * Manages httpOnly cookie-based session verification, login, and logout.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check existing session on mount
  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        setLoading(true);
        const token =
          typeof localStorage !== 'undefined'
            ? localStorage.getItem('admin_token')
            : null;

        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch(`${API_URL}/auth/me`, {
          credentials: 'include',
          headers,
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setUser(data.user || null);
          }
        } else {
          if (isMounted) {
            setUser(null);
          }
        }
      } catch (err) {
        console.warn('Initial session check failed (server may be offline):', err.message);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Log in user using credentials; sets httpOnly cookie on server response.
   */
  const login = async (email, password) => {
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg =
          data?.error?.message ||
          data?.message ||
          'Invalid credentials. Please verify your email and password.';
        setError(errorMsg);
        throw new Error(errorMsg);
      }

      if (data.token && typeof localStorage !== 'undefined') {
        localStorage.setItem('admin_token', data.token);
      }

      setUser(data.user);
      return data.user;
    } catch (err) {
      const msg = err.message || 'Login failed. Unable to connect to server.';
      setError(msg);
      throw err;
    }
  };

  /**
   * Log out user; clears session cookie on server.
   */
  const logout = async () => {
    try {
      const token =
        typeof localStorage !== 'undefined'
          ? localStorage.getItem('admin_token')
          : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers,
        credentials: 'include',
      });
    } catch (err) {
      console.warn('Logout error:', err.message);
    } finally {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('admin_token');
      }
      setUser(null);
      setError(null);
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    clearError,
    isAuthenticated: Boolean(user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to consume AuthContext
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;

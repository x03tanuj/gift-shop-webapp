import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Route protection wrapper.
 * Redirects unauthenticated visitors to /login.
 * Checks optional requiredRole (e.g. 'OWNER').
 */
export default function ProtectedRoute({ requiredRole, children }) {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748b',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            border: '3px solid #e2e8f0',
            borderTopColor: '#0f172a',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '1rem',
          }}
        ></div>
        <p style={{ fontSize: '0.875rem' }}>Verifying administrator session...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role Gate Check
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div
        style={{
          maxWidth: '500px',
          margin: '4rem auto',
          padding: '2rem',
          background: '#fff',
          borderRadius: '12px',
          border: '1px solid #fee2e2',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⛔</div>
        <h2 style={{ color: '#991b1b', margin: '0 0 0.5rem 0' }}>403 - Forbidden</h2>
        <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: '1.5' }}>
          Your current account role (<strong>{user.role}</strong>) does not have permission to
          access this administrative section. Required role: <strong>{requiredRole}</strong>.
        </p>
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            onClick={() => window.history.back()}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              cursor: 'pointer',
            }}
          >
            Go Back
          </button>
          <button
            onClick={logout}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              background: '#dc2626',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return children ? children : <Outlet />;
}

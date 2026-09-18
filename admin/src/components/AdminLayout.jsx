import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { label: '📊 Dashboard', path: '/' },
    { label: '📦 Products', path: '/products' },
    { label: '🏷️ Categories', path: '/categories' },
    { label: '➕ New Product', path: '/products/new' },
    { label: '⚙️ Settings', path: '/settings' },
  ];

  const storefrontUrl =
    import.meta.env.VITE_STOREFRONT_URL ||
    (typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:5173'
      : 'https://gift-shop-webapp-rho.vercel.app');

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#0f172a',
      }}
    >
      {/* Top Administrative Navigation Bar */}
      <header
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: 0,
          zIndex: 30,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.05)',
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Logo / Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🏛️</span>
            <div>
              <Link
                to="/"
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                }}
              >
                SHIVE SHAKTI ENTERPRISES
              </Link>
              <div
                style={{
                  fontSize: '0.7rem',
                  color: '#64748b',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Store Admin Portal
              </div>
            </div>
          </div>

          {/* Links */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}
          >
            {navLinks.map((link) => {
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    padding: '0.45rem 0.85rem',
                    minHeight: '38px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    borderRadius: '6px',
                    color: isActive ? '#0f172a' : '#475569',
                    background: isActive ? '#f1f5f9' : 'transparent',
                    border: isActive ? '1px solid #cbd5e1' : '1px solid transparent',
                    transition: 'background-color 0.15s',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}

            <a
              href={storefrontUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                fontSize: '0.825rem',
                fontWeight: 600,
                padding: '0.45rem 0.85rem',
                minHeight: '38px',
                display: 'inline-flex',
                alignItems: 'center',
                borderRadius: '6px',
                color: '#2563eb',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
              }}
            >
              🛍️ Storefront ↗
            </a>
          </nav>

          {/* User Badge & Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                background: user?.role === 'OWNER' ? '#fef3c7' : '#e0e7ff',
                color: user?.role === 'OWNER' ? '#92400e' : '#3730a3',
                border: user?.role === 'OWNER' ? '1px solid #fde68a' : '1px solid #c7d2fe',
              }}
            >
              {user?.role || 'ADMIN'}
            </span>

            <button
              onClick={logout}
              style={{
                fontSize: '0.8rem',
                color: '#b91c1c',
                background: 'transparent',
                border: '1px solid #fecaca',
                padding: '0.45rem 0.85rem',
                minHeight: '38px',
                minWidth: '44px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Administrative Workspace */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1.25rem' }}>
        {children}
      </main>
    </div>
  );
}

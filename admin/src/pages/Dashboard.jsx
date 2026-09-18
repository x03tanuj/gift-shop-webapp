import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../services/adminApi.js';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Dashboard Page
 * Displays administrative statistics as plain cards without charts,
 * alongside quick action shortcuts.
 */
export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getDashboardStats();
      setStats(data.stats);
    } catch (err) {
      console.error('Failed to load dashboard statistics:', err);
      setError(err.message || 'Unable to retrieve store stats.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Welcome Banner */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>
            Boutique Overview
          </h1>
          <p style={{ margin: 0, fontSize: '0.825rem', color: '#64748b' }}>
            Logged in as <strong>{user?.name || user?.email}</strong> ({user?.role})
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link
            to="/products/new"
            style={{
              textDecoration: 'none',
              background: '#0f172a',
              color: '#ffffff',
              padding: '0.55rem 1rem',
              borderRadius: '8px',
              fontSize: '0.825rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>➕</span>
            <span>Add New Product</span>
          </Link>
          <Link
            to="/products"
            style={{
              textDecoration: 'none',
              background: '#f8fafc',
              color: '#0f172a',
              border: '1px solid #cbd5e1',
              padding: '0.55rem 1rem',
              borderRadius: '8px',
              fontSize: '0.825rem',
              fontWeight: 600,
            }}
          >
            Manage Products
          </Link>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontSize: '0.85rem', color: '#991b1b' }}>⚠️ {error}</div>
          <button
            onClick={fetchStats}
            style={{
              background: '#991b1b',
              color: '#fff',
              border: 'none',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Plain Stats Cards (No Charts) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        {/* Total Products Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.25rem',
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>
            Total Products
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', margin: '0.25rem 0' }}>
            {loading ? '—' : stats?.totalProducts ?? 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#475569' }}>Catalog offerings active in database</div>
        </div>

        {/* Available Products Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.25rem',
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#059669' }}>
            Available for Order
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#059669', margin: '0.25rem 0' }}>
            {loading ? '—' : stats?.availableProducts ?? 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#475569' }}>In stock or made-to-order creations</div>
        </div>

        {/* Featured Products Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.25rem',
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#7c3aed' }}>
            Featured Heirlooms
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#7c3aed', margin: '0.25rem 0' }}>
            {loading ? '—' : stats?.featuredCount ?? 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#475569' }}>Showcased on customer home page</div>
        </div>

        {/* Categories Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.25rem',
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#0284c7' }}>
            Craft Categories
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#0284c7', margin: '0.25rem 0' }}>
            {loading ? '—' : stats?.categoriesCount ?? 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#475569' }}>Brassware, Copper, Silks, Botanicals</div>
        </div>

        {/* Customer Enquiries Card (Stubbed for Phase 10) */}
        <div
          style={{
            background: '#f8fafc',
            borderRadius: '12px',
            border: '1px dashed #cbd5e1',
            padding: '1.25rem',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#94a3b8' }}>
            Customer Enquiries
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#94a3b8', margin: '0.25rem 0' }}>
            {loading ? '—' : stats?.enquiriesCount ?? 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>WhatsApp lead tracking (Phase 10)</div>
        </div>
      </div>

      {/* Database Connection Note */}
      <div
        style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '10px',
          padding: '1rem 1.25rem',
          fontSize: '0.825rem',
          color: '#166534',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span>✅</span>
        <span>
          Live MongoDB synchronization active: Any product edits or creations immediately propagate to the storefront.
        </span>
      </div>
    </div>
  );
}

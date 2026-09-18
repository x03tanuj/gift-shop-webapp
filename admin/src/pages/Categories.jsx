import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { adminApi } from '../services/adminApi.js';

/**
 * Categories List Page
 * Displays administrative table with image, name, slug, description,
 * product counts, and edit/delete actions with guard error handling.
 */
export default function Categories() {
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);
  const [guardError, setGuardError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getAdminCategories();
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError(err.message || 'Unable to retrieve store categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    if (location.state?.message) {
      setActionNotice(location.state.message);
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => setActionNotice(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleDelete = async (id, name, productCount) => {
    setGuardError(null);

    // Immediate user-friendly warning if products exist
    if (productCount > 0) {
      const msg = `Reassign or delete the ${productCount} products in this category first.`;
      setGuardError(msg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete category '${name}'? This will remove it from the catalog immediately.`
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await adminApi.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => (c.id || c._id) !== id));
      setActionNotice(`Successfully deleted '${name}'.`);
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err) {
      console.error('Delete category error:', err);
      setGuardError(err.message || 'Unable to delete category.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCategories = categories.filter((cat) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const nameMatch = cat.name?.toLowerCase().includes(q);
    const slugMatch = cat.slug?.toLowerCase().includes(q);
    const descMatch = cat.description?.toLowerCase().includes(q);
    return nameMatch || slugMatch || descMatch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Header & Add CTA */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>
            Product Categories
          </h1>
          <p style={{ margin: 0, fontSize: '0.825rem', color: '#64748b' }}>
            Organize catalog gifts and handicrafts into curated collections.
          </p>
        </div>

        <Link
          to="/categories/new"
          style={{
            textDecoration: 'none',
            background: '#0f172a',
            color: '#ffffff',
            padding: '0.6rem 1.1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          }}
        >
          <span>➕</span>
          <span>Add New Category</span>
        </Link>
      </div>

      {/* Action Notification */}
      {actionNotice && (
        <div
          style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#166534',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.825rem',
          }}
        >
          ✅ {actionNotice}
        </div>
      )}

      {/* Delete Guard Error Banner */}
      {guardError && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            padding: '0.875rem 1.25rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🚫</span>
            <strong>{guardError}</strong>
          </div>
          <button
            onClick={() => setGuardError(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#991b1b',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
          <input
            type="text"
            placeholder="Search categories by name, slug, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '0.825rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>
          Total: <strong>{categories.length}</strong> categories
        </div>
      </div>

      {/* General Error Alert */}
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
            onClick={fetchCategories}
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

      {/* Loading Skeleton */}
      {loading && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '2rem',
            textAlign: 'center',
            color: '#64748b',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              border: '3px solid #e2e8f0',
              borderTopColor: '#0f172a',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 0.75rem auto',
            }}
          ></div>
          <p style={{ fontSize: '0.85rem', margin: 0 }}>Loading categories...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredCategories.length === 0 && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px dashed #cbd5e1',
            padding: '3rem 1.5rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏷️</div>
          <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.1rem', color: '#0f172a' }}>
            No Categories Found
          </h3>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.825rem', color: '#64748b' }}>
            {searchQuery
              ? 'No categories match your current search query. Try clearing the filter.'
              : 'Your store has no categories yet.'}
          </p>
          <Link
            to="/categories/new"
            style={{
              textDecoration: 'none',
              background: '#0f172a',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.825rem',
              fontWeight: 600,
            }}
          >
            ➕ Add First Category
          </Link>
        </div>
      )}

      {/* Categories Table */}
      {!loading && !error && filteredCategories.length > 0 && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            overflowX: 'auto',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.05)',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.825rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, width: '60px' }}>Cover</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Name &amp; Slug</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Description</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Assigned Products</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((cat) => {
                const catId = cat.id || cat._id;
                const count = cat.productCount ?? 0;
                const imgUrl = cat.image || 'https://placehold.co/60x60/f1f5f9/64748b?text=No+Image';

                return (
                  <tr
                    key={catId}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      transition: 'background-color 0.1s',
                    }}
                  >
                    {/* Thumbnail */}
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <img
                        src={imgUrl}
                        alt={cat.name}
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          border: '1px solid #e2e8f0',
                        }}
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/44x44/f1f5f9/64748b?text=Category';
                        }}
                      />
                    </td>

                    {/* Name & Slug */}
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{cat.name}</div>
                      <div style={{ fontSize: '0.725rem', color: '#64748b', fontFamily: 'monospace' }}>
                        /{cat.slug}
                      </div>
                    </td>

                    {/* Description */}
                    <td style={{ padding: '0.75rem 1rem', color: '#475569', maxWidth: '280px' }}>
                      <div
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        title={cat.description}
                      >
                        {cat.description || <span style={{ color: '#94a3b8' }}>No description</span>}
                      </div>
                    </td>

                    {/* Product Count Badge */}
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          background: count > 0 ? '#eff6ff' : '#f1f5f9',
                          color: count > 0 ? '#1d4ed8' : '#64748b',
                          border: count > 0 ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '9999px',
                        }}
                      >
                        <span>📦</span>
                        <span>{count} {count === 1 ? 'Product' : 'Products'}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <Link
                          to={`/categories/${catId}/edit`}
                          style={{
                            textDecoration: 'none',
                            background: '#f8fafc',
                            color: '#0f172a',
                            border: '1px solid #cbd5e1',
                            padding: '0.45rem 0.8rem',
                            minHeight: '38px',
                            minWidth: '44px',
                            borderRadius: '6px',
                            fontSize: '0.775rem',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          disabled={deletingId === catId}
                          onClick={() => handleDelete(catId, cat.name, count)}
                          style={{
                            background: '#fef2f2',
                            color: '#dc2626',
                            border: '1px solid #fecaca',
                            padding: '0.45rem 0.8rem',
                            minHeight: '38px',
                            minWidth: '44px',
                            borderRadius: '6px',
                            fontSize: '0.775rem',
                            fontWeight: 600,
                            cursor: deletingId === catId ? 'not-allowed' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {deletingId === catId ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

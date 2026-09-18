import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { adminApi } from '../services/adminApi.js';

/**
 * Products List Page
 * Displays administrative table with name, category, price, availability, featured status,
 * and edit/delete actions with loading, error, and empty states.
 */
export default function Products() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getAdminProducts();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(err.message || 'Unable to retrieve catalog products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    if (location.state?.message) {
      setActionNotice(location.state.message);
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => setActionNotice(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete '${name}'? This will remove it from the live catalog immediately.`
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await adminApi.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => (p.id || p._id) !== id));
      setActionNotice(`Successfully deleted '${name}'.`);
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  // Local client filter for quick table scanning
  const filteredProducts = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const nameMatch = p.name?.toLowerCase().includes(q);
    const catMatch = p.category?.name?.toLowerCase().includes(q) || p.categoryName?.toLowerCase().includes(q);
    const slugMatch = p.slug?.toLowerCase().includes(q);
    return nameMatch || catMatch || slugMatch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Header & Actions */}
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
            Product Catalog
          </h1>
          <p style={{ margin: 0, fontSize: '0.825rem', color: '#64748b' }}>
            Manage pricing, stock availability, specifications, and images.
          </p>
        </div>

        <Link
          to="/products/new"
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
          <span>Add New Product</span>
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

      {/* Search & Filter Toolbar */}
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
            placeholder="Quick search by name, category, or slug..."
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
          Total: <strong>{products.length}</strong> creations
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
            onClick={fetchProducts}
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
          <p style={{ fontSize: '0.85rem', margin: 0 }}>Loading product catalog...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredProducts.length === 0 && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px dashed #cbd5e1',
            padding: '3rem 1.5rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📦</div>
          <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.1rem', color: '#0f172a' }}>
            No Products Found
          </h3>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.825rem', color: '#64748b' }}>
            {searchQuery
              ? 'No products match your current search query. Try clearing the filter.'
              : 'Your boutique catalog has no products yet.'}
          </p>
          <Link
            to="/products/new"
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
            ➕ Add First Product
          </Link>
        </div>
      )}

      {/* Products Table */}
      {!loading && !error && filteredProducts.length > 0 && (
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
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, width: '60px' }}>Item</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Product Name &amp; Slug</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Category</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Price</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Availability</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Featured</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const prodId = product.id || product._id;
                const isAvail = product.available === true || product.available === 'In Stock';
                const isMadeToOrder = product.available === 'Made to Order';
                const imgUrl = product.image || product.images?.[0] || 'https://placehold.co/60x60/f1f5f9/64748b?text=Item';
                const catName = product.category?.name || product.categoryName || 'Uncategorized';

                return (
                  <tr
                    key={prodId}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      transition: 'background-color 0.1s',
                    }}
                  >
                    {/* Thumbnail */}
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <img
                        src={imgUrl}
                        alt={product.name}
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          border: '1px solid #e2e8f0',
                        }}
                        onError={(e) => {
                          e.currentTarget.src = 'https://placehold.co/44x44/f1f5f9/64748b?text=Item';
                        }}
                      />
                    </td>

                    {/* Name & Slug */}
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{product.name}</div>
                      <div style={{ fontSize: '0.725rem', color: '#64748b', fontFamily: 'monospace' }}>
                        /{product.slug}
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '0.75rem 1rem', color: '#334155' }}>
                      <span
                        style={{
                          background: '#f1f5f9',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                        }}
                      >
                        {catName}
                      </span>
                    </td>

                    {/* Price */}
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#0f172a' }}>
                      ₹{product.price?.toLocaleString('en-IN') ?? product.price}
                    </td>

                    {/* Availability */}
                    <td style={{ padding: '0.75rem 1rem' }}>
                      {isAvail && (
                        <span
                          style={{
                            background: '#dcfce7',
                            color: '#15803d',
                            fontSize: '0.725rem',
                            fontWeight: 600,
                            padding: '0.2rem 0.5rem',
                            borderRadius: '9999px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                        >
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }}></span>
                          <span>In Stock</span>
                        </span>
                      )}
                      {isMadeToOrder && (
                        <span
                          style={{
                            background: '#fef3c7',
                            color: '#b45309',
                            fontSize: '0.725rem',
                            fontWeight: 600,
                            padding: '0.2rem 0.5rem',
                            borderRadius: '9999px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                        >
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b' }}></span>
                          <span>Made to Order</span>
                        </span>
                      )}
                      {!isAvail && !isMadeToOrder && (
                        <span
                          style={{
                            background: '#f1f5f9',
                            color: '#64748b',
                            fontSize: '0.725rem',
                            fontWeight: 600,
                            padding: '0.2rem 0.5rem',
                            borderRadius: '9999px',
                          }}
                        >
                          Sold Out
                        </span>
                      )}
                    </td>

                    {/* Featured */}
                    <td style={{ padding: '0.75rem 1rem' }}>
                      {product.featured ? (
                        <span
                          style={{
                            background: '#ede9fe',
                            color: '#6d28d9',
                            fontSize: '0.725rem',
                            fontWeight: 600,
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                          }}
                        >
                          ⭐ Featured
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <Link
                          to={`/products/${prodId}/edit`}
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
                          disabled={deletingId === prodId}
                          onClick={() => handleDelete(prodId, product.name)}
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
                            cursor: deletingId === prodId ? 'not-allowed' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {deletingId === prodId ? 'Deleting...' : 'Delete'}
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

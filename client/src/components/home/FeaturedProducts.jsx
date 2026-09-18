import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../ui/ProductCard.jsx';
import { getFeaturedProducts } from '../../services/products.js';

/**
 * Section 4: Featured Products
 * Fetches real featured products from the backend API.
 * Includes loading skeletons, empty state, and graceful error recovery.
 */
export default function FeaturedProducts() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeatured = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFeaturedProducts();
      setFeatured(data);
    } catch (err) {
      console.error('Failed to load featured products:', err);
      setError(err.message || 'Unable to load signature curations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

  if (!loading && featured.length === 0) {
    return null;
  }

  return (
    <section className="py-4" aria-labelledby="featured-products-heading">
      <div className="flex items-end justify-between mb-4">
        <div>
          <span className="text-[10px] tracking-[0.2em] font-bold text-brand-burgundy uppercase block">
            Heirloom Quality
          </span>
          <h2
            id="featured-products-heading"
            className="font-serif text-xl sm:text-2xl font-bold text-brand-charcoal leading-tight"
          >
            Curated Signature Pieces
          </h2>
        </div>
        <Link
          to="/shop"
          className="text-xs font-semibold text-brand-burgundy hover:underline flex items-center gap-0.5 whitespace-nowrap"
        >
          <span>View All</span>
          <span>→</span>
        </Link>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-brand-gold/20 p-3 flex flex-col space-y-3 animate-pulse"
            >
              <div className="aspect-[4/3] bg-stone-200 rounded-xl w-full"></div>
              <div className="h-3 bg-stone-200 rounded w-1/3"></div>
              <div className="h-4 bg-stone-200 rounded w-3/4"></div>
              <div className="h-8 bg-stone-200 rounded mt-auto"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error Fallback with Retry */}
      {!loading && error && (
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-center space-y-2">
          <p className="text-xs text-amber-900">{error}</p>
          <button
            type="button"
            onClick={fetchFeatured}
            className="text-xs font-semibold text-brand-burgundy underline hover:text-brand-burgundy/80 cursor-pointer"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* Real Content */}
      {!loading && !error && featured.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((product) => (
            <ProductCard
              key={product.id || product._id}
              id={product.id || product._id}
              slug={product.slug}
              name={product.name}
              price={product.price}
              image={product.image || product.images?.[0]}
              available={product.available}
              category={product.categoryName || product.category?.name}
              description={product.description}
              badge={product.badge}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && featured.length === 0 && (
        <p className="text-xs text-brand-muted text-center py-6">
          Signature curations are currently being updated.
        </p>
      )}
    </section>
  );
}

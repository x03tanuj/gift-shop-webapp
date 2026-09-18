import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../../services/categories.js';

/**
 * Section 5: Product Categories
 * 2-column mobile grid sourced from live backend API linking to /shop?category=...
 */
export default function CategoryGrid() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError(err.message || 'Unable to load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  if (!loading && categories.length === 0) {
    return null;
  }

  return (
    <section className="py-4" aria-labelledby="category-grid-heading">
      <div className="mb-3.5 text-center sm:text-left">
        <span className="text-[10px] tracking-[0.2em] font-bold text-brand-burgundy uppercase block">
          Explore Heirlooms
        </span>
        <h2
          id="category-grid-heading"
          className="font-serif text-lg sm:text-xl font-bold text-brand-charcoal"
        >
          Browse by Craft &amp; Category
        </h2>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-[4/5] bg-stone-200 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
      )}

      {/* Error Fallback */}
      {!loading && error && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center space-y-2">
          <p className="text-xs text-amber-900">{error}</p>
          <button
            type="button"
            onClick={fetchCats}
            className="text-xs font-semibold text-brand-burgundy underline cursor-pointer"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* Real Category Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id || cat._id}
              to={`/shop?category=${cat.slug}`}
              className="relative rounded-xl overflow-hidden aspect-[4/5] border border-brand-gold/40 shadow-xs group focus:outline-none transition-transform active:scale-95"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/300x400/f5f5f4/78350f?text=Curated+Collection';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
              <div className="absolute bottom-3 left-2.5 right-2.5 text-left">
                <span className="text-[9px] uppercase tracking-wider text-brand-gold font-semibold block">
                  {cat.count || `${cat.productCount || 0} Creations`}
                </span>
                <h3 className="font-serif text-xs sm:text-sm font-bold text-white leading-tight mt-0.5">
                  {cat.name}
                </h3>
                {cat.description && (
                  <span className="text-[9px] text-white/75 block mt-0.5">
                    {cat.description}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

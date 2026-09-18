import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../../services/categories.js';

/**
 * Dynamic Category Showcase (Horizontal swipe track)
 * Sourced 100% dynamically from the live database.
 * Whatever categories the store owner adds in the Admin Panel appear here automatically.
 */
export default function ShopByOccasion() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getCategories()
      .then((data) => {
        if (isMounted) {
          setCategories(data || []);
        }
      })
      .catch((err) => {
        console.warn('Could not load categories for carousel:', err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // If finished loading and no categories exist yet, don't show empty boxes
  if (!loading && categories.length === 0) {
    return null;
  }

  return (
    <section className="py-3" aria-labelledby="shop-by-category-heading">
      <div className="mb-2.5 flex items-end justify-between">
        <div>
          <span className="text-[10px] tracking-[0.18em] uppercase font-bold text-brand-burgundy block">
            Curated Collections
          </span>
          <h2
            id="shop-by-category-heading"
            className="font-serif text-lg font-bold text-brand-charcoal"
          >
            Shop by Category
          </h2>
        </div>
        {categories.length > 2 && (
          <span className="text-[11px] text-brand-burgundy/80 font-semibold tracking-wide">
            Swipe →
          </span>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="flex space-x-3 overflow-x-hidden pb-1">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="w-28 h-32 rounded-xl bg-stone-200 animate-pulse shrink-0 border border-brand-gold/20"
            />
          ))}
        </div>
      )}

      {/* Dynamic Category Horizontal Track */}
      {!loading && categories.length > 0 && (
        <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-1 snap-x snap-mandatory">
          {categories.map((cat) => {
            const catId = cat.id || cat._id;
            const imgSrc =
              cat.image ||
              'https://placehold.co/240x300/f5f5f4/78350f?text=Collection';

            return (
              <Link
                key={catId}
                to={`/shop?category=${cat.slug}`}
                className="snap-start flex-shrink-0 w-28 group text-center focus:outline-none transition-transform active:scale-95"
              >
                <div className="w-28 h-32 rounded-xl overflow-hidden relative border border-brand-gold/40 shadow-xs bg-stone-100">
                  <img
                    src={imgSrc}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://placehold.co/240x300/f5f5f4/78350f?text=Collection';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-2 left-1 right-1 text-center">
                    <span className="text-[11px] font-medium text-white block leading-tight font-serif">
                      {cat.name}
                    </span>
                    {cat.count && (
                      <span className="text-[9px] text-brand-gold block font-sans opacity-90 mt-0.5">
                        {cat.count}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

import React, { useState, useEffect } from 'react';
import ProductCard from '../ui/ProductCard.jsx';
import { getRelatedProducts } from '../../services/products.js';

/**
 * RelatedProducts Component
 * Displays 3–4 same-category products excluding the current item.
 * Sourced from real API /api/products/:id/related.
 * Features a mobile-friendly horizontal scroll track.
 *
 * @param {Object} props
 * @param {string} props.currentId - Active product ID or slug to exclude
 */
export default function RelatedProducts({ currentId }) {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (!currentId) return;

    setLoading(true);
    getRelatedProducts(currentId)
      .then((data) => {
        if (isMounted) {
          setRelated(data || []);
        }
      })
      .catch((err) => {
        console.warn('Could not load related products:', err.message);
        if (isMounted) setRelated([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentId]);

  if (!loading && related.length === 0) {
    return null;
  }

  return (
    <section className="py-6 border-t border-brand-gold/25" aria-labelledby="related-heading">
      <div className="mb-3.5 flex items-end justify-between">
        <div>
          <span className="text-[10px] tracking-[0.2em] font-bold text-brand-burgundy uppercase block">
            Curated Discovery
          </span>
          <h2 id="related-heading" className="font-serif text-lg sm:text-xl font-bold text-brand-charcoal">
            You May Also Cherish
          </h2>
        </div>
        <span className="text-xs text-brand-muted font-medium">Swipe →</span>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-shrink-0 w-72 h-80 bg-stone-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      )}

      {/* Horizontal Scroll on Mobile, Grid on Larger Screens */}
      {!loading && related.length > 0 && (
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory">
          {related.map((product) => (
            <div key={product.id || product._id} className="snap-start flex-shrink-0 w-72 sm:w-auto">
              <ProductCard
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
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard.jsx';
import Button from '../components/ui/Button.jsx';
import { getProducts } from '../services/products.js';

const ITEMS_PER_PAGE = 3;

/**
 * Direct Products Catalog Page
 * Serves as the primary storefront landing view.
 * Displays 3 products at a time with click-to-show-more pagination, debounced search, and live sorting.
 */
export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read state from URL query parameters
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'featured';

  // Local state for debounced search input & click throttling
  const [searchInput, setSearchInput] = useState(searchParam);
  const debounceTimerRef = useRef(null);
  const loadMoreCooldownRef = useRef(0);

  // Products state driven by backend API
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // Sync search input if URL changes externally
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // Fetch Products whenever search or sort changes
  useEffect(() => {
    let isMounted = true;

    const fetchInitialProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        setPage(1);

        const params = {
          page: 1,
          limit: ITEMS_PER_PAGE,
          sort: sortParam,
        };

        if (searchParam.trim()) {
          params.search = searchParam.trim();
        }

        const data = await getProducts(params);
        if (isMounted) {
          setProducts(data.products || []);
          setTotalCount(data.total || 0);
          setHasMore(Boolean(data.hasMore));
        }
      } catch (err) {
        console.error('Failed to load products:', err);
        if (isMounted) {
          setError(
            err.message || 'Unable to load products from store database.'
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchInitialProducts();

    return () => {
      isMounted = false;
    };
  }, [searchParam, sortParam]);

  // Handle Debounced Search Input Change (500ms to save free tier requests)
  const handleSearchChange = (val) => {
    setSearchInput(val);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (!val.trim()) {
            next.delete('search');
          } else {
            next.set('search', val.trim());
          }
          return next;
        },
        { replace: true }
      );
    }, 500);
  };

  // Sync state changes with URL query parameters
  const updateParam = (key, value) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (!value || value === 'all') {
          next.delete(key);
        } else {
          next.set(key, value);
        }
        return next;
      },
      { replace: true }
    );
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSearchParams({}, { replace: true });
  };

  // Load More Handler with click cooldown to prevent spamming the backend
  const handleLoadMore = async () => {
    const now = Date.now();
    if (loadingMore || !hasMore || now - loadMoreCooldownRef.current < 800) return;
    loadMoreCooldownRef.current = now;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;

      const params = {
        page: nextPage,
        limit: ITEMS_PER_PAGE,
        sort: sortParam,
      };

      if (searchParam.trim()) {
        params.search = searchParam.trim();
      }

      const data = await getProducts(params);
      setProducts((prev) => [...prev, ...(data.products || [])]);
      setPage(nextPage);
      setHasMore(Boolean(data.hasMore));
    } catch (err) {
      console.error('Failed to load more products:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Header */}
      <div className="text-center sm:text-left pt-2">
        <span className="text-[10px] tracking-[0.2em] font-bold text-brand-burgundy uppercase block mb-1">
          Artisanal Catalog
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-charcoal">
          All Handcrafted Creations
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-xl">
          Browse our curated Indian gifts, heirloom brassware, copper carafes, and royal keepsake hampers.
        </p>
      </div>

      {/* Search & Sort Toolbar */}
      <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-brand-gold/30 shadow-xs space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by gift name, craft, or material..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 min-h-[44px] bg-brand-sand/50 border border-stone-300 rounded-lg text-sm text-brand-charcoal placeholder-stone-400 focus:outline-none focus:border-brand-burgundy transition-colors"
          />
          <svg
            className="w-5 h-5 text-stone-400 absolute left-3 top-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                updateParam('search', '');
              }}
              aria-label="Clear search"
              className="absolute right-2 top-2 text-stone-400 hover:text-stone-700 w-8 h-8 flex items-center justify-center cursor-pointer rounded-full hover:bg-stone-200 text-sm"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort Dropdown & Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-stone-100">
          <div className="flex items-center gap-2 text-xs text-brand-muted">
            <span>
              Showing{' '}
              <strong className="text-brand-charcoal">{products.length}</strong>{' '}
              of <strong className="text-brand-charcoal">{totalCount}</strong>{' '}
              creations
            </span>
            {loading && (
              <span className="text-[10px] text-brand-burgundy animate-pulse">
                • Loading...
              </span>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="shop-sort-select"
              className="text-xs text-brand-muted whitespace-nowrap"
            >
              Sort by:
            </label>
            <select
              id="shop-sort-select"
              value={sortParam}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="bg-brand-sand/60 border border-stone-300 rounded-lg text-xs py-2 px-3 min-h-[40px] text-brand-charcoal focus:outline-none focus:border-brand-burgundy cursor-pointer"
            >
              <option value="featured">Featured Heirlooms</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Additions</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error State Banner */}
      {error && (
        <div className="p-6 rounded-2xl bg-amber-50/90 border border-amber-200 text-center space-y-3">
          <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
            {error}
          </p>
          <button
            type="button"
            onClick={() => {
              updateParam('_r', Date.now());
            }}
            className="inline-flex items-center justify-center bg-brand-burgundy text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-brand-burgundy/90 transition-colors cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-brand-gold/20 p-4 flex flex-col space-y-3 animate-pulse"
            >
              <div className="aspect-[4/3] bg-stone-200 rounded-xl w-full"></div>
              <div className="h-3 bg-stone-200 rounded w-1/4"></div>
              <div className="h-5 bg-stone-200 rounded w-3/4"></div>
              <div className="h-3 bg-stone-100 rounded w-full"></div>
              <div className="h-8 bg-stone-200 rounded mt-auto"></div>
            </div>
          ))}
        </div>
      )}

      {/* Product Grid */}
      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {products.map((product) => (
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
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-12 px-4 bg-white rounded-2xl border border-brand-gold/30 shadow-xs max-w-md mx-auto my-6">
          <div className="w-12 h-12 rounded-full bg-brand-sand text-brand-burgundy flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🛍️</span>
          </div>
          <h3 className="font-serif text-lg font-bold text-brand-charcoal mb-1">
            {searchParam ? 'No Creations Found' : 'New Curations Coming Soon'}
          </h3>
          <p className="text-xs text-brand-muted leading-relaxed mb-4">
            {searchParam
              ? 'We could not find any creations matching your search. Try clearing filters.'
              : 'Our boutique collection is currently being curated with new artisanal arrivals. Have a custom order or need immediate assistance? Chat with us directly on WhatsApp!'}
          </p>
          <div className="max-w-[220px] mx-auto">
            {searchParam ? (
              <Button
                variant="primary"
                onClick={clearAllFilters}
                className="text-xs py-2"
              >
                Clear Search
              </Button>
            ) : (
              <Button
                variant="primary"
                href="https://wa.me/916377027248?text=Hello%20Shive%20Shakti%20Enterprises,%20I%20would%20like%20to%20enquire%20about%20your%20products"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs py-2"
              >
                Chat on WhatsApp
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Server Pagination ("Show More Products" - 3 by 3) */}
      {!loading && hasMore && (
        <div className="text-center pt-6 pb-2">
          <div className="max-w-xs mx-auto">
            <Button
              variant="secondary"
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="text-xs py-3 w-full font-semibold shadow-xs"
            >
              {loadingMore
                ? 'Loading Next 3 Creations...'
                : `Show More Products (${totalCount - products.length} remaining)`}
            </Button>
          </div>
        </div>
      )}

      {/* All creations displayed indicator */}
      {!loading && !hasMore && products.length > 3 && (
        <div className="text-center pt-4 pb-2 text-xs text-brand-muted">
          All {totalCount} creations displayed
        </div>
      )}
    </div>
  );
}

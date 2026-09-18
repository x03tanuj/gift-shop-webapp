import { useState, useEffect, useMemo } from 'react';

/**
 * Custom hook to filter and sort an array of products client-side.
 * Debounces search input by 300ms and applies category, occasion, and sort filters.
 * Accepts `products` as an argument with zero API calls for a drop-in Phase 5 swap.
 *
 * @param {Array} products - Array of product objects
 * @param {Object} filters
 * @param {string} [filters.search=''] - Search term
 * @param {string} [filters.category='all'] - Category slug
 * @param {string} [filters.occasion='all'] - Occasion slug
 * @param {string} [filters.sort='featured'] - Sort criteria ('featured', 'price-asc', 'price-desc', 'name-asc')
 * @returns {{ filteredProducts: Array, totalCount: number, isSearching: boolean }}
 */
export function useProductFilters(
  products = [],
  { search = '', category = 'all', occasion = 'all', sort = 'featured' } = {}
) {
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    let result = [...products];

    // 1. Category Filter
    if (category && category !== 'all') {
      result = result.filter(
        (p) => p.category === category || p.slug === category
      );
    }

    // 2. Occasion Filter
    if (occasion && occasion !== 'all') {
      result = result.filter((p) => p.occasion === occasion);
    }

    // 3. Search Filter (Debounced)
    const query = debouncedSearch.trim().toLowerCase();
    if (query) {
      result = result.filter((p) => {
        const nameMatch = p.name?.toLowerCase().includes(query);
        const descMatch = p.description?.toLowerCase().includes(query);
        const catMatch = p.categoryName?.toLowerCase().includes(query);
        return nameMatch || descMatch || catMatch;
      });
    }

    // 4. Sort
    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-desc':
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [products, debouncedSearch, category, occasion, sort]);

  return {
    filteredProducts,
    totalCount: filteredProducts.length,
    isSearching: search !== debouncedSearch,
  };
}

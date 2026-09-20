import api from './api.js';

// Client-side cache to conserve free tier requests and bandwidth (5-minute TTL)
const productsCache = new Map();
const productDetailsCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Fetch filtered, sorted, and paginated products from the live backend with client caching.
 *
 * @param {Object} [params]
 * @param {string} [params.search]
 * @param {string} [params.sort]
 * @param {number} [params.page]
 * @param {number} [params.limit]
 * @returns {Promise<{ products: Array, total: number, page: number, pages: number, hasMore: boolean }>}
 */
export async function getProducts(params = {}) {
  const cacheKey = JSON.stringify(params);
  const cached = productsCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const data = await api.get('/products', params);
  productsCache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}

/**
 * Fetch a single product by its slug or unique ID with client caching.
 *
 * @param {string} slug
 * @returns {Promise<Object>} The product document
 */
export async function getProductBySlug(slug) {
  const cached = productDetailsCache.get(slug);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const data = await api.get(`/products/${encodeURIComponent(slug)}`);
  productDetailsCache.set(slug, { data: data.product, timestamp: Date.now() });
  return data.product;
}

/**
 * Fetch featured products for the home page showcase.
 *
 * @returns {Promise<Array>} Array of featured products
 */
export async function getFeaturedProducts() {
  const data = await api.get('/products/featured');
  return data.products || [];
}

/**
 * Fetch 3-4 related products in the same category, excluding current product.
 *
 * @param {string} id - Product ID or slug
 * @returns {Promise<Array>} Array of related products
 */
export async function getRelatedProducts(id) {
  const data = await api.get(`/products/${encodeURIComponent(id)}/related`);
  return data.related || [];
}

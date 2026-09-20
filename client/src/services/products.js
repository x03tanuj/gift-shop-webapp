import api from './api.js';

// Client-side cache to conserve free tier requests and bandwidth (5-minute TTL)
const productsCache = new Map();
const productDetailsCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

function readStorage(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp < CACHE_TTL_MS) {
      return data;
    }
    sessionStorage.removeItem(key);
  } catch {
    // Fallback if sessionStorage is blocked
  }
  return null;
}

function writeStorage(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // Ignore storage quota limits
  }
}

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
  const cacheKey = `products_${JSON.stringify(params)}`;
  
  // 1. Check in-memory cache
  const memCached = productsCache.get(cacheKey);
  if (memCached && Date.now() - memCached.timestamp < CACHE_TTL_MS) {
    return memCached.data;
  }

  // 2. Check sessionStorage cache
  const storageCached = readStorage(cacheKey);
  if (storageCached) {
    productsCache.set(cacheKey, { data: storageCached, timestamp: Date.now() });
    return storageCached;
  }

  const data = await api.get('/products', params);
  productsCache.set(cacheKey, { data, timestamp: Date.now() });
  writeStorage(cacheKey, data);
  return data;
}

/**
 * Fetch a single product by its slug or unique ID with client caching.
 *
 * @param {string} slug
 * @returns {Promise<Object>} The product document
 */
export async function getProductBySlug(slug) {
  const cacheKey = `product_${slug}`;

  // 1. Check in-memory cache
  const memCached = productDetailsCache.get(cacheKey);
  if (memCached && Date.now() - memCached.timestamp < CACHE_TTL_MS) {
    return memCached.data;
  }

  // 2. Check sessionStorage cache
  const storageCached = readStorage(cacheKey);
  if (storageCached) {
    productDetailsCache.set(cacheKey, { data: storageCached, timestamp: Date.now() });
    return storageCached;
  }

  const data = await api.get(`/products/${encodeURIComponent(slug)}`);
  productDetailsCache.set(cacheKey, { data: data.product, timestamp: Date.now() });
  writeStorage(cacheKey, data.product);
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

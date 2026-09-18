import api from './api.js';

/**
 * Fetch filtered, sorted, and paginated products from the live backend.
 *
 * @param {Object} [params]
 * @param {string} [params.search]
 * @param {string} [params.category]
 * @param {string} [params.sort]
 * @param {number} [params.page]
 * @param {number} [params.limit]
 * @returns {Promise<{ products: Array, total: number, page: number, pages: number, hasMore: boolean }>}
 */
export async function getProducts(params = {}) {
  const data = await api.get('/products', params);
  return data;
}

/**
 * Fetch a single product by its slug or unique ID.
 *
 * @param {string} slug
 * @returns {Promise<Object>} The product document
 */
export async function getProductBySlug(slug) {
  const data = await api.get(`/products/${encodeURIComponent(slug)}`);
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

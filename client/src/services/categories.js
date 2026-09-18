import api from './api.js';

/**
 * Fetch all categories with dynamic creation counts.
 *
 * @returns {Promise<Array>} Array of category objects
 */
export async function getCategories() {
  const data = await api.get('/categories');
  return data.categories || [];
}

/**
 * Fetch category details by slug.
 *
 * @param {string} slug
 * @returns {Promise<Object>} Category object
 */
export async function getCategoryBySlug(slug) {
  const data = await api.get(`/categories/${encodeURIComponent(slug)}`);
  return data.category;
}

/**
 * Fetch all products associated with a category slug.
 *
 * @param {string} slug
 * @returns {Promise<{ category: Object, products: Array, total: number }>}
 */
export async function getCategoryProducts(slug) {
  const data = await api.get(`/categories/${encodeURIComponent(slug)}/products`);
  return data;
}

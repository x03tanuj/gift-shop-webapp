import api from './api.js';

/**
 * Fetch boutique store settings (salons, opening hours, contact details).
 *
 * @returns {Promise<Object>} Settings document
 */
export async function getSettings() {
  const data = await api.get('/settings');
  return data.settings;
}

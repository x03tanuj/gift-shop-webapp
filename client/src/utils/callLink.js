/**
 * Single source of truth for building telephone (tel:) links across the application.
 */

export const getPhoneNumber = () => {
  return (typeof import.meta !== 'undefined' && import.meta.env?.VITE_PHONE_NUMBER) || '+91 63770 27248';
};

/**
 * Builds a tel: URI, stripping spaces and non-dialable characters while preserving the leading + prefix.
 *
 * @param {string} [phone] - Optional custom phone number, defaults to VITE_PHONE_NUMBER
 * @returns {string} Clean tel: link
 */
export const buildCallLink = (phone) => {
  const number = phone || getPhoneNumber();
  const cleaned = number.replace(/[^\d+]/g, '');
  return `tel:${cleaned}`;
};

/**
 * Single source of truth for building WhatsApp links across the application.
 */

export const getWhatsAppNumber = () => {
  return (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WHATSAPP_NUMBER) || '916377027248';
};

/**
 * Builds the wa.me link for a specific product enquiry.
 * Format specified:
 * "Hi, I am interested in [Product Name].\nProduct ID: [ID]\nPrice: ₹[Price]\nIs this product available?"
 *
 * @param {Object} product
 * @param {string|number} product.id
 * @param {string} product.name
 * @param {number|string} product.price
 * @returns {string} Fully encoded wa.me URL
 */
export const buildWhatsAppProductLink = (product) => {
  if (!product) return buildWhatsAppGeneralLink();

  const number = getWhatsAppNumber();
  const rawPrice = product.price;
  const price =
    typeof rawPrice === 'string' && rawPrice.startsWith('₹')
      ? rawPrice.slice(1).trim()
      : rawPrice;

  const text = `Hi, I am interested in ${product.name}.\nProduct ID: ${product.id}\nPrice: ₹${price}\nIs this product available?`;

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
};

/**
 * Builds a general concierge wa.me link for Header, Footer, Banners, and Docks.
 *
 * @param {string} [customMessage]
 * @returns {string} Fully encoded wa.me URL
 */
export const buildWhatsAppGeneralLink = (customMessage) => {
  const number = getWhatsAppNumber();
  const message =
    customMessage ||
    'Hello Shive Shakti Enterprises, I would like to enquire about your artisanal gifting collection.';

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};

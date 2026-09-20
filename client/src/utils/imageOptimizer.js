/**
 * Optimizes Cloudinary image URLs to use automatic modern formats (WebP/AVIF),
 * intelligent compression, and width restrictions.
 * Drastically reduces bandwidth usage and prevents hitting Cloudinary free tier limits.
 *
 * @param {string} url - Original image URL
 * @param {Object} [options]
 * @param {number} [options.width=450] - Max width in pixels
 * @param {string} [options.quality='auto'] - Cloudinary quality setting ('auto', 'auto:eco', etc.)
 * @returns {string} Optimized URL
 */
export function optimizeCloudinaryUrl(url, { width = 450, quality = 'auto' } = {}) {
  if (!url || typeof url !== 'string') return url;

  // Only transform Cloudinary URLs that haven't been transformed yet
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    if (url.includes('/upload/f_auto') || url.includes('/upload/w_')) {
      return url;
    }
    return url.replace('/upload/', `/upload/f_auto,q_${quality},w_${width},c_limit/`);
  }

  return url;
}

export default optimizeCloudinaryUrl;

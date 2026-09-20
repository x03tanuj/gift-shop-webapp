import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import RelatedProducts from '../components/product/RelatedProducts.jsx';
import { getProductBySlug } from '../services/products.js';
import { buildWhatsAppProductLink } from '../utils/whatsappLink.js';
import { buildCallLink, getPhoneNumber } from '../utils/callLink.js';
import { optimizeCloudinaryUrl } from '../utils/imageOptimizer.js';

/**
 * Product Details Page (/shop/:slug)
 * Dynamic catalog item view with gallery, specifications, conditional personalization,
 * WhatsApp inquiry, phone concierge, and related products powered by live backend API.
 */
export default function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [retryCount, setRetryCount] = useState(0);

  // Scroll to top and re-fetch whenever slug or retryCount changes
  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedImageIndex(0);

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductBySlug(slug);
        if (isMounted) {
          setProduct(data);
        }
      } catch (err) {
        console.error('Failed to load product:', err);
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [slug, retryCount]);

  // Loading Skeleton
  if (loading) {
    return (
      <div className="py-6 space-y-8 animate-pulse">
        <div className="h-4 bg-stone-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-[4/3] sm:aspect-square bg-stone-200 rounded-2xl"></div>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-16 h-16 bg-stone-200 rounded-xl"></div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-6 space-y-5">
            <div className="h-4 bg-stone-200 rounded w-1/4"></div>
            <div className="h-8 bg-stone-200 rounded w-3/4"></div>
            <div className="h-20 bg-stone-100 rounded-xl"></div>
            <div className="h-12 bg-stone-200 rounded-xl"></div>
            <div className="h-24 bg-stone-100 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // Graceful Error / 404 state
  if (error || !product) {
    const isNotFound = error?.status === 404;

    return (
      <div className="py-12 px-4 max-w-xl mx-auto text-center" role="alert">
        <div className="bg-white rounded-2xl border border-brand-gold/30 p-8 sm:p-10 shadow-luxury">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-sand border border-brand-gold/40 flex items-center justify-center text-brand-burgundy">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <span className="text-[11px] tracking-[0.2em] font-bold text-brand-burgundy uppercase block mb-1.5">
            {isNotFound ? 'Catalog Notice' : 'Service Notice'}
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-charcoal mb-2.5">
            {isNotFound ? 'Product Not Found' : 'Unable to Load Curation'}
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted leading-relaxed mb-6">
            {isNotFound
              ? 'The curated gift hamper or artisanal keepsake you requested could not be found or may have been retired.'
              : error?.message ||
                'Our concierge database is currently unavailable. Please check back shortly.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {!isNotFound && (
              <button
                type="button"
                onClick={() => setRetryCount((c) => c + 1)}
                className="w-full sm:w-auto inline-flex items-center justify-center bg-brand-burgundy hover:bg-brand-burgundy/90 text-white text-xs font-semibold uppercase tracking-wider py-3 px-6 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Retry Request
              </button>
            )}
            <Link
              to="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-brand-burgundy hover:bg-brand-burgundy/90 text-white text-xs font-semibold uppercase tracking-wider py-3 px-6 rounded-xl shadow-xs transition-colors"
            >
              Explore Full Catalog
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center border border-brand-gold/50 bg-white hover:bg-stone-50 text-brand-charcoal text-xs font-semibold uppercase tracking-wider py-3 px-6 rounded-xl transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Pre-fill links via single source of truth utilities
  const whatsappUrl = buildWhatsAppProductLink(product);
  const callUrl = buildCallLink();
  const phoneNumber = getPhoneNumber();

  // Normalized gallery images
  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : product.gallery && product.gallery.length > 0
        ? product.gallery
        : [product.image];

  const currentImage = galleryImages[selectedImageIndex] || product.image;

  // Format price
  const formattedPrice =
    typeof product.price === 'number'
      ? `₹${product.price.toLocaleString('en-IN')}`
      : String(product.price).startsWith('₹')
        ? product.price
        : `₹${product.price}`;

  // Availability status
  const isAvailable = product.available === true || product.available === 'In Stock';
  const isMadeToOrder = product.available === 'Made to Order';

  const categoryName = product.categoryName || product.category?.name || '';
  const categorySlug = product.categorySlug || product.category?.slug || '';

  return (
    <div className="py-4 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-[11px] sm:text-xs text-brand-muted">
        <ol className="flex items-center flex-wrap gap-1.5">
          <li>
            <Link to="/" className="hover:text-brand-burgundy transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-stone-300">/</li>
          <li>
            <Link to="/shop" className="hover:text-brand-burgundy transition-colors">
              Shop
            </Link>
          </li>
          {categorySlug && (
            <>
              <li aria-hidden="true" className="text-stone-300">/</li>
              <li>
                <Link
                  to={`/shop?category=${categorySlug}`}
                  className="hover:text-brand-burgundy transition-colors capitalize"
                >
                  {categoryName || categorySlug.replace(/-/g, ' ')}
                </Link>
              </li>
            </>
          )}
          <li aria-hidden="true" className="text-stone-300">/</li>
          <li
            aria-current="page"
            className="font-semibold text-brand-charcoal truncate max-w-[200px] sm:max-w-xs"
          >
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-3.5">
          {/* Main Selected Image */}
          <div className="relative aspect-[4/3] sm:aspect-square bg-stone-100 rounded-2xl overflow-hidden border border-brand-gold/30 shadow-luxury group">
            <img
              src={optimizeCloudinaryUrl(currentImage, { width: 700 })}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              decoding="async"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/600x600/f5f5f4/78350f?text=Handcrafted+Creation';
              }}
            />

            {/* Availability Pill (Top Left) */}
            {isAvailable && (
              <div className="absolute top-3.5 left-3.5 bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-300/60 shadow-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>In Stock</span>
              </div>
            )}

            {isMadeToOrder && (
              <div className="absolute top-3.5 left-3.5 bg-amber-50 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full border border-amber-300/60 shadow-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Made to Order</span>
              </div>
            )}

            {!isAvailable && !isMadeToOrder && (
              <div className="absolute top-3.5 left-3.5 bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full border border-slate-300 shadow-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span>Sold Out</span>
              </div>
            )}

            {/* Feature Badge (Top Right) */}
            {product.badge && (
              <div className="absolute top-3.5 right-3.5 bg-brand-burgundy/90 backdrop-blur-xs text-brand-gold text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded shadow-xs">
                {product.badge}
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {galleryImages.length > 1 && (
            <div
              className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 pt-0.5"
              aria-label="Product image thumbnails"
            >
              {galleryImages.map((imgUrl, idx) => {
                const isSelected = idx === selectedImageIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    aria-label={`View image ${idx + 1}`}
                    className={`relative w-20 h-20 min-w-[44px] min-h-[44px] shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-brand-burgundy ring-2 ring-brand-burgundy/20 shadow-xs scale-102'
                        : 'border-stone-200 opacity-70 hover:opacity-100 hover:border-brand-gold/60'
                    }`}
                  >
                    <img
                      src={optimizeCloudinaryUrl(imgUrl, { width: 120 })}
                      alt={`${product.name} angle ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/100x100/f5f5f4/78350f?text=Preview';
                      }}
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* Boutique Artisanship Assurance */}
          <div className="p-3.5 rounded-xl bg-brand-sand/50 border border-brand-gold/30 text-[11px] text-brand-charcoal/80 flex items-center gap-2.5">
            <svg
              className="w-4 h-4 text-brand-burgundy shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span>
              100% Authentic Indian Craftsmanship • Hand-inspected before boutique dispatch
            </span>
          </div>
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="lg:col-span-6 space-y-6">
          {/* Header & Title */}
          <div>
            {categoryName && (
              <span className="text-[10px] tracking-[0.2em] font-bold text-brand-burgundy uppercase block mb-1">
                {categoryName}
              </span>
            )}
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-charcoal leading-tight">
              {product.name}
            </h1>
            <p className="text-[11px] text-brand-muted mt-1 font-mono">
              Product ID: {product.id || product._id}
            </p>
          </div>

          {/* Pricing & Availability Block */}
          <div className="p-4 rounded-xl bg-white border border-brand-gold/30 shadow-xs flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-brand-muted block font-medium">
                Price (All Inclusive)
              </span>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-brand-burgundy">
                {formattedPrice}
              </span>
              <span className="block text-[11px] text-brand-muted mt-0.5">
                Includes luxury keepsake packaging &amp; gift card
              </span>
            </div>

            <div className="text-right">
              {isAvailable && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Ready to Dispatch
                </span>
              )}
              {isMadeToOrder && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Made to Order (3-5 days)
                </span>
              )}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="space-y-3">
            <Button
              variant="primary"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 min-h-[48px] text-sm font-bold shadow-md hover:brightness-105"
            >
              Enquire on WhatsApp
            </Button>

            <Button
              variant="call"
              href={callUrl}
              className="py-3 min-h-[48px] text-xs font-semibold"
            >
              Call Gifting Concierge ({phoneNumber})
            </Button>

            <p className="text-[11px] text-center text-brand-muted leading-tight">
              Order directly via WhatsApp or phone consultation. No online payment required upfront.
            </p>
          </div>

          {/* CONDITIONAL PERSONALIZATION NOTE */}
          {Boolean(product.personalizable && product.personalizationNote) && (
            <div className="p-4 rounded-xl bg-[#FFF9F2] border border-brand-gold/60 shadow-xs space-y-1.5">
              <div className="flex items-center gap-2 text-brand-burgundy">
                <svg
                  className="w-4 h-4 shrink-0 text-brand-terracotta"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                <h3 className="font-serif text-sm font-bold text-brand-burgundy">
                  Bespoke Personalization Included
                </h3>
              </div>
              <p className="text-xs text-brand-charcoal/90 leading-relaxed pl-6">
                {product.personalizationNote}
              </p>
              <p className="text-[11px] text-brand-muted pl-6 pt-0.5">
                Share your personalized message or initials directly on WhatsApp upon enquiry.
              </p>
            </div>
          )}

          {/* Product Description */}
          <div className="space-y-2">
            <h3 className="font-serif text-base font-bold text-brand-charcoal">
              About This Curation
            </h3>
            <p className="text-xs sm:text-sm text-brand-charcoal/80 leading-relaxed font-sans">
              {product.description}
            </p>
          </div>

          {/* Product Specifications Grid / Table */}
          {product.details && Object.keys(product.details).length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="font-serif text-base font-bold text-brand-charcoal">
                Artisan Specifications
              </h3>
              <div className="bg-white rounded-xl border border-brand-gold/30 divide-y divide-stone-100 overflow-hidden text-xs">
                {Object.entries(product.details).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-3 sm:grid-cols-4 p-3 gap-2">
                    <span className="font-semibold text-brand-muted uppercase tracking-wider text-[10px] col-span-1">
                      {key}
                    </span>
                    <span className="text-brand-charcoal col-span-2 sm:col-span-3">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RELATED PRODUCTS SECTION */}
      <RelatedProducts currentId={product.id || product._id} />
    </div>
  );
}

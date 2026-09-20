import React from 'react';
import { Link } from 'react-router-dom';
import { buildWhatsAppProductLink } from '../../utils/whatsappLink.js';
import { optimizeCloudinaryUrl } from '../../utils/imageOptimizer.js';

/**
 * Presentational ProductCard component.
 * Clicking image or title navigates to /shop/:slug.
 * WhatsApp enquiry button triggers pre-filled WhatsApp message without card navigation.
 */
export default function ProductCard({
  id,
  slug,
  name,
  price,
  image,
  available = true,
  category,
  description,
  badge,
}) {
  const productSlug = slug || id;

  // Format currency with Indian grouping (e.g. ₹2,450)
  const formattedPrice =
    typeof price === 'number'
      ? `₹${price.toLocaleString('en-IN')}`
      : price && price.toString().startsWith('₹')
        ? price
        : `₹${price}`;

  // WhatsApp pre-filled inquiry link from centralized utility
  const whatsappUrl = buildWhatsAppProductLink({ id, name, price });

  // Determine availability status styling
  const isAvailable = available === true || available === 'In Stock';
  const isMadeToOrder = available === 'Made to Order';

  return (
    <article
      data-product-id={id}
      className="bg-white rounded-2xl overflow-hidden border border-brand-gold/30 shadow-luxury hover:shadow-md transition-shadow duration-200 flex flex-col group"
    >
      {/* Clickable Image Container leading to /shop/:slug */}
      <Link
        to={`/shop/${productSlug}`}
        className="relative aspect-[4/3] bg-stone-100 overflow-hidden block focus:outline-none"
        aria-label={`View details for ${name}`}
      >
        <img
          src={optimizeCloudinaryUrl(image, { width: 450 })}
          alt={name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/400x300/f5f5f4/78350f?text=Handcrafted+Creation';
          }}
        />

        {/* Stock Status Pill Badge (Top Left) */}
        {isAvailable && (
          <div className="absolute top-3 left-3 bg-emerald-50 text-emerald-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-300/60 shadow-xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>In Stock</span>
          </div>
        )}

        {isMadeToOrder && (
          <div className="absolute top-3 left-3 bg-amber-50 text-amber-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-amber-300/60 shadow-xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>Made to Order</span>
          </div>
        )}

        {!isAvailable && !isMadeToOrder && (
          <div className="absolute top-3 left-3 bg-slate-100 text-slate-600 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-slate-300 shadow-xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            <span>Sold Out</span>
          </div>
        )}

        {/* Editorial Feature Badge (Top Right) */}
        {badge && (
          <div className="absolute top-3 right-3 bg-brand-burgundy/85 backdrop-blur-xs text-brand-gold text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded shadow-xs">
            {badge}
          </div>
        )}
      </Link>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {category && (
            <div className="text-[11px] text-brand-muted font-medium mb-1 tracking-wide uppercase">
              {category}
            </div>
          )}

          <Link
            to={`/shop/${productSlug}`}
            className="font-serif text-base font-bold text-brand-charcoal hover:text-brand-burgundy transition-colors leading-snug line-clamp-2 block"
          >
            {name}
          </Link>

          {description && (
            <p className="text-xs text-brand-muted mt-1.5 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Price & Immediate WhatsApp Conversion Action */}
        <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-brand-muted block font-medium">
              Price
            </span>
            <span className="text-lg font-bold font-serif text-brand-burgundy">
              {formattedPrice}
            </span>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Enquire on WhatsApp for ${name}`}
            className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold px-3.5 py-2.5 min-h-[44px] rounded-lg shadow-xs active:scale-95 transition-transform"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <span>Enquire</span>
          </a>
        </div>
      </div>
    </article>
  );
}

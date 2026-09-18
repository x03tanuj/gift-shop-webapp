import React, { useState, useEffect } from 'react';
import { getSettings } from '../../services/settings.js';
import { buildCallLink } from '../../utils/callLink.js';

/**
 * Section 7: Store / Contact Info Teaser
 * Compact scannable block with salon addresses, opening hours, and Get Directions action.
 * Sourced from live backend API with graceful fallback.
 */
export default function ContactTeaser() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getSettings()
      .then((data) => {
        if (isMounted && data) {
          setSettings(data);
        }
      })
      .catch((err) => {
        console.warn('Could not load live settings for ContactTeaser, using defaults:', err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const salons = settings?.salons || [
    { city: 'Ajmer', title: 'Chaman Gali, Ramsar, Ajmer - 305402' },
  ];

  const salonText = settings?.address || salons.map((s) => s.title || `${s.city} Store`).join(' • ');
  const openingHours = settings?.openingHours || 'Mon–Sat: 10:00 AM – 8:00 PM (IST)';
  const googleMapsUrl =
    settings?.mapEmbedUrl ||
    settings?.googleMapsUrl ||
    'https://maps.google.com/?q=Chaman+Gali+Ramsar+Ajmer+305402';
  const callUrl = buildCallLink(settings?.phone);

  if (loading && !settings) {
    return (
      <section className="py-4" aria-label="Boutique Heritage Salons">
        <div className="border border-brand-gold/20 rounded-xl p-5 bg-brand-sand/30 text-center animate-pulse space-y-2">
          <div className="h-3 bg-stone-200 rounded w-1/4 mx-auto"></div>
          <div className="h-4 bg-stone-200 rounded w-1/2 mx-auto"></div>
          <div className="h-3 bg-stone-200 rounded w-1/3 mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4" aria-label="Boutique Heritage Salons">
      <div className="border border-brand-gold/40 rounded-xl p-4 sm:p-5 bg-brand-sand/40 text-center shadow-xs">
        <span className="text-[10px] tracking-[0.2em] font-bold text-brand-burgundy uppercase block mb-1">
          Visit Our Store
        </span>

        <h3 className="font-serif text-sm sm:text-base font-bold text-brand-charcoal">
          {salonText}
        </h3>

        <p className="text-[11px] sm:text-xs text-brand-muted mt-1 font-sans">
          Hours: {openingHours}
        </p>

        <div className="mt-3.5 flex items-center justify-center gap-3">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-brand-burgundy border border-brand-burgundy/50 bg-white px-3.5 py-1.5 rounded-lg hover:bg-stone-50 transition-colors shadow-xs"
          >
            Get Directions
          </a>
          <a
            href={callUrl}
            className="text-xs font-semibold text-brand-charcoal hover:text-brand-burgundy px-2 py-1.5 transition-colors"
          >
            Call Salon →
          </a>
        </div>
      </div>
    </section>
  );
}

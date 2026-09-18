import React, { useState, useEffect } from 'react';
import Button from '../ui/Button.jsx';
import { getSettings } from '../../services/settings.js';

/**
 * Section 1: Hero Section
 * Image-led showcase dynamically powered by boutique settings.
 */
export default function Hero() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getSettings()
      .then((data) => {
        if (isMounted && data) {
          setSettings(data);
        }
      })
      .catch((err) => {
        console.warn('Could not load settings for Hero:', err.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const storeName = settings?.storeName || settings?.shopName || 'Shive Shakti Enterprises';
  const tagline = settings?.tagline || 'Artisanal Indian Luxury Gifts';

  const heroImage =
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80';

  return (
    <section className="relative -mx-4 sm:mx-0 overflow-hidden sm:rounded-2xl shadow-luxury border-b sm:border border-brand-gold/30">
      <div className="relative w-full h-[360px] sm:h-[420px] overflow-hidden bg-stone-900">
        <img
          src={heroImage}
          alt={`${storeName} - Luxury Artisanal Indian Gifts`}
          className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
          loading="eager"
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80';
          }}
        />

        {/* Atmospheric Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"></div>

        {/* Hero Card Overlay */}
        <div className="absolute bottom-4 left-4 right-4 p-4 sm:p-6 rounded-xl bg-brand-ivory/95 backdrop-blur-md border border-brand-gold/40 shadow-xl text-center max-w-lg mx-auto">
          <span className="inline-block text-[10px] tracking-[0.2em] font-bold text-brand-burgundy uppercase mb-1">
            Heritage Luxury • {storeName}
          </span>

          <h1 className="font-serif text-xl sm:text-2xl font-bold text-brand-charcoal leading-snug mb-1.5">
            {tagline}
          </h1>

          <p className="text-xs text-brand-charcoal/75 font-normal leading-relaxed mb-3.5">
            Thoughtfully curated handcrafted gifts, customized to perfection.
          </p>

          <Button
            variant="secondary"
            href="/shop"
            className="tracking-wider uppercase"
          >
            Explore Catalog
          </Button>
        </div>
      </div>
    </section>
  );
}

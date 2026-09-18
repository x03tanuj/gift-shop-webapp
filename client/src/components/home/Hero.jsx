import React from 'react';
import Button from '../ui/Button.jsx';

/**
 * Section 1: Hero Section
 * Full-width image-led hero with luxury gift presentation, warm tagline, and primary CTA.
 */
export default function Hero() {
  const heroImage =
    'https://lh3.googleusercontent.com/aida/AEtjO1VxrW2IGAsJ3iRk56xOlTkMhF-fCWiAgSkbh-v1qNH5i-I8-XdvWHpCBUBG-20Ebw9VTLI5LD-QPkO2OEfi9_c-y8RAhjwIB_vxgww6BPmtV2c3HLp7VuUb_j3XcjDMbRvO69BbnWO_Hkl3Jrncjk8FSYtl1yYUSzcZkvgd5fIkWO0f54bms0ImhvF7adSdmefkgdPcisjEkJNb4RkK001gZI-_rB5m9DjBnrmQpjT8wgJ8aDU26hs92uk';

  return (
    <section className="relative -mx-4 sm:mx-0 overflow-hidden sm:rounded-2xl shadow-luxury border-b sm:border border-brand-gold/30">
      <div className="relative w-full h-[360px] sm:h-[420px] overflow-hidden bg-stone-900">
        <img
          src={heroImage}
          alt="Artisanal Indian luxury gift packaging with brass diya and floral accents"
          className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
          loading="eager"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80';
          }}
        />

        {/* Atmospheric Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"></div>

        {/* Hero Card Overlay */}
        <div className="absolute bottom-4 left-4 right-4 p-4 sm:p-6 rounded-xl bg-brand-ivory/95 backdrop-blur-md border border-brand-gold/40 shadow-xl text-center max-w-lg mx-auto">
          <span className="inline-block text-[10px] tracking-[0.2em] font-bold text-brand-burgundy uppercase mb-1">
            Heritage Luxury • Made in Bharat
          </span>

          <h1 className="font-serif text-xl sm:text-2xl font-bold text-brand-charcoal leading-snug mb-1.5">
            Artisanal Gifts Crafted for Precious Moments
          </h1>

          <p className="text-xs text-brand-charcoal/75 font-normal leading-relaxed mb-3.5">
            Thoughtfully curated luxury hampers, delivered across India.
          </p>

          <Button
            variant="secondary"
            href="/shop"
            className="tracking-wider uppercase"
          >
            Explore Festive Catalog
          </Button>
        </div>
      </div>
    </section>
  );
}

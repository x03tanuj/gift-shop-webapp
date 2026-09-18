import React from 'react';
import Hero from '../components/home/Hero.jsx';
import WhatsAppBanner from '../components/home/WhatsAppBanner.jsx';
import ShopByOccasion from '../components/home/ShopByOccasion.jsx';
import FeaturedProducts from '../components/home/FeaturedProducts.jsx';
import CategoryGrid from '../components/home/CategoryGrid.jsx';
import WhyChooseUs from '../components/home/WhyChooseUs.jsx';
import ContactTeaser from '../components/home/ContactTeaser.jsx';
import HealthCheckBadge from '../components/dev/HealthCheckBadge.jsx';

/**
 * Mobile-First Home Page for Shive Shakti Enterprises
 * Sections assembled in exact order between Header and Footer:
 * 1. Hero Section
 * 2. Main CTA Banner (WhatsApp)
 * 3. Shop by Occasion
 * 4. Featured Products (4 signature cards)
 * 5. Product Categories (2-column mobile grid)
 * 6. Why Choose Us (trust markers grid)
 * 7. Store / Contact Info Teaser
 * 8. Dev Health Check Monitor
 */
export default function Home() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Main WhatsApp CTA Banner */}
      <WhatsAppBanner />

      {/* 3. Shop by Occasion */}
      <ShopByOccasion />

      {/* 4. Featured Products */}
      <FeaturedProducts />

      {/* 5. Product Categories */}
      <CategoryGrid />

      {/* 6. Why Choose Us */}
      <WhyChooseUs />

      {/* 7. Store & Boutique Teaser */}
      <ContactTeaser />

      {/* 8. Phase 0 Dev Health Check Badge */}
      <HealthCheckBadge />
    </div>
  );
}

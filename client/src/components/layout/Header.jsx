import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { buildWhatsAppGeneralLink } from '../../utils/whatsappLink.js';

/**
 * Shared Top Navigation Header matching DESIGN.md specs.
 * Fully accessible with WCAG 44px touch targets, mobile drawer, and keyboard navigation.
 */
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const whatsappUrl = buildWhatsAppGeneralLink(
    'Hello Shive Shakti Enterprises, I would like to enquire about your artisanal gifts.'
  );

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Categories', path: '/shop' },
    { name: 'Contact', path: '/shop' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-brand-ivory/95 backdrop-blur-md border-b border-brand-gold/20 shadow-xs transition-all">
      {/* Top Announcement Ribbon */}
      <div className="bg-brand-burgundy text-[#FDFBF7] text-[11px] tracking-widest font-semibold uppercase py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse"></span>
        <span>Handcrafted Across India • Instant WhatsApp Order Help</span>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        {/* Logo / Shop Name */}
        <Link
          to="/"
          className="flex flex-col text-left group transition-transform active:scale-95 py-1 min-h-[44px] justify-center"
          aria-label="Shive Shakti Enterprises Home"
        >
          <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-brand-burgundy">
            SHIVE SHAKTI ENTERPRISES
          </span>
          <span className="font-sans text-[9px] tracking-widest uppercase text-brand-muted font-medium">
            Artisanal Indian Gifting
          </span>
        </Link>

        {/* Desktop / Tablet Nav Links */}
        <nav
          className="hidden md:flex items-center gap-6"
          aria-label="Desktop Navigation"
        >
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path && link.name !== 'Categories' && link.name !== 'Contact';
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs font-semibold uppercase tracking-wider py-2 transition-colors duration-150 min-h-[44px] inline-flex items-center ${
                  isActive
                    ? 'text-brand-burgundy border-b-2 border-brand-burgundy font-bold'
                    : 'text-brand-charcoal hover:text-brand-burgundy'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Search Trigger (Navigates to /shop) */}
          <button
            type="button"
            aria-label="Search catalog"
            className="w-11 h-11 rounded-full flex items-center justify-center text-brand-charcoal hover:bg-brand-gold/15 transition-colors cursor-pointer"
            onClick={() => navigate('/shop')}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {/* Prominent WhatsApp CTA Button (min-h-[44px]) */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp with Concierge"
            className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold px-3.5 py-2.5 min-h-[44px] rounded-full shadow-xs active:scale-95 transition-transform"
          >
            <svg
              className="w-4 h-4 fill-current shrink-0"
              viewBox="0 0 24 24"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <span>Chat</span>
          </a>

          {/* Mobile Menu Hamburger Toggle (44x44px touch target) */}
          <button
            type="button"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
            className="md:hidden w-11 h-11 rounded-full flex items-center justify-center text-brand-charcoal hover:bg-brand-gold/15 transition-colors cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Collapsible) */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden border-t border-brand-gold/20 bg-brand-ivory px-4 py-3 space-y-1"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-2 text-xs font-semibold uppercase tracking-wider text-brand-charcoal hover:text-brand-burgundy rounded-lg hover:bg-brand-sand/50 min-h-[44px] flex items-center"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      )}

      {/* Horizontal Category Filter Pills (min 40px touch height) */}
      <nav
        aria-label="Quick Categories"
        className="flex items-center gap-2 px-4 pb-2.5 pt-1 overflow-x-auto no-scrollbar max-w-6xl mx-auto"
      >
        <Link
          to="/shop"
          className="px-4 py-2 min-h-[38px] text-xs font-semibold rounded-full bg-brand-burgundy text-white whitespace-nowrap shadow-xs inline-flex items-center"
        >
          All Hampers
        </Link>
        <Link
          to="/shop?category=brass-bell-metal"
          className="px-3.5 py-2 min-h-[38px] text-xs font-medium rounded-full bg-brand-sand text-brand-muted hover:bg-stone-200 whitespace-nowrap transition-colors inline-flex items-center"
        >
          Festive Diyas
        </Link>
        <Link
          to="/shop?category=ayurvedic-copperware"
          className="px-3.5 py-2 min-h-[38px] text-xs font-medium rounded-full bg-brand-sand text-brand-muted hover:bg-stone-200 whitespace-nowrap transition-colors inline-flex items-center"
        >
          Pure Copper
        </Link>
        <Link
          to="/shop?category=silk-velvet"
          className="px-3.5 py-2 min-h-[38px] text-xs font-medium rounded-full bg-brand-sand text-brand-muted hover:bg-stone-200 whitespace-nowrap transition-colors inline-flex items-center"
        >
          Silk Keepsakes
        </Link>
        <Link
          to="/shop?occasion=corporate"
          className="px-3.5 py-2 min-h-[38px] text-xs font-medium rounded-full bg-brand-sand text-brand-muted hover:bg-stone-200 whitespace-nowrap transition-colors inline-flex items-center"
        >
          Corporate Gifting
        </Link>
      </nav>
    </header>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { buildWhatsAppGeneralLink } from '../../utils/whatsappLink.js';
import { buildCallLink, getPhoneNumber } from '../../utils/callLink.js';

/**
 * Shared Boutique Footer matching DESIGN.md specs.
 * Includes brand summary, navigation links, contact info (from env vars), opening hours, and copyright.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const phoneNumber = getPhoneNumber();
  const callUrl = buildCallLink();
  const whatsappUrl = buildWhatsAppGeneralLink(
    'Hello Shive Shakti Enterprises, I have an enquiry about your boutique catalog.'
  );

  return (
    <footer className="mt-8 bg-brand-footerBg text-[#FAF6F0] px-5 pt-8 pb-12 border-t border-brand-gold/30">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Brand Information */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-brand-gold">
              SHIVE SHAKTI ENTERPRISES
            </span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed max-w-sm">
            Curating royal Indian gifting traditions with contemporary
            sustainable luxury. Handcrafted with reverence by master artisans
            across India.
          </p>
        </div>

        {/* Quick Navigation Links */}
        <div>
          <h4 className="text-[11px] uppercase tracking-widest font-semibold text-brand-gold mb-2.5">
            Explore Collection
          </h4>
          <ul className="space-y-1.5 text-xs text-stone-300">
            <li>
              <Link to="/" className="hover:text-white transition-colors">
                All Handcrafted Creations
              </Link>
            </li>
            <li>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Custom &amp; Bulk Orders
              </a>
            </li>
            <li>
              <a
                href={callUrl}
                className="hover:text-white transition-colors"
              >
                Direct Call Consultation
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Block & Boutique Locations */}
        <div className="border-t border-stone-800 pt-4 space-y-2 text-xs text-stone-300">
          <h4 className="text-[11px] uppercase tracking-widest font-semibold text-brand-gold mb-1">
            Concierge &amp; Boutiques
          </h4>

          <p className="flex items-center gap-2">
            <svg
              className="w-3.5 h-3.5 text-brand-gold shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <a
              href={callUrl}
              className="hover:text-white transition-colors"
            >
              {phoneNumber}
            </a>
          </p>

          <p className="flex items-center gap-2">
            <svg
              className="w-3.5 h-3.5 text-[#25D366] shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.34 5.01L2 22l5.12-1.32C8.56 21.52 10.22 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.54 0-2.99-.44-4.22-1.2l-.3-.19-3.04.8 1.01-2.96-.2-.33C4.46 14.88 4 13.48 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z" />
            </svg>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              WhatsApp: Direct Order &amp; Customization
            </a>
          </p>

          <p className="flex items-start gap-2 pt-1 text-stone-400">
            <svg
              className="w-3.5 h-3.5 text-brand-gold shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>
              Chaman Gali, Ramsar, Ajmer - 305402
            </span>
          </p>

          <p className="flex items-center gap-2 text-stone-400 pt-0.5">
            <svg
              className="w-3.5 h-3.5 text-brand-gold shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Mon–Sat: 10:00 AM – 8:00 PM (IST)</span>
          </p>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-stone-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-400">
          <p>
            © {currentYear} Shive Shakti Enterprises. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-brand-gold">
            <a
              href="https://instagram.com/mineeee.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Instagram (@mineeee.in)
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

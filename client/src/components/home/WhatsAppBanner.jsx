import React from 'react';
import Button from '../ui/Button.jsx';
import { buildWhatsAppGeneralLink } from '../../utils/whatsappLink.js';

/**
 * Section 2: Main WhatsApp CTA Banner
 * Compact secondary strip reinforcing the conversational WhatsApp-first ordering model.
 */
export default function WhatsAppBanner() {
  const whatsappUrl = buildWhatsAppGeneralLink(
    'Hi Shive Shakti Enterprises, I have a question regarding custom gifting and bespoke orders.'
  );

  return (
    <section className="py-2" aria-label="WhatsApp Concierge Assistance">
      <div className="bg-brand-sand/80 border border-brand-gold/40 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-1.5 text-brand-burgundy font-serif font-bold text-xs uppercase tracking-wider mb-0.5">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
            <span>Direct Gifting Concierge</span>
          </div>
          <p className="text-[11px] text-brand-charcoal/80 leading-snug">
            Have a question or need custom box curation? Chat directly with our
            concierge on WhatsApp.
          </p>
        </div>

        <div className="w-full sm:w-auto shrink-0">
          <Button
            variant="primary"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs py-2 px-4 whitespace-nowrap"
          >
            Chat on WhatsApp
          </Button>
        </div>
      </div>
    </section>
  );
}

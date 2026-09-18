import React from 'react';

/**
 * Section 6: Why Choose Us
 * 2x2 grid of trust-building value propositions with icons and concise text.
 */
export default function WhyChooseUs() {
  const pillars = [
    {
      title: '100% Artisanal',
      desc: 'Directly hand-cast by generational craftspeople across India.',
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918"
          />
        </svg>
      ),
      color: 'bg-brand-burgundy/10 text-brand-burgundy',
    },
    {
      title: 'Concierge Order',
      desc: 'Direct 1-to-1 curation and assistance via WhatsApp.',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
        </svg>
      ),
      color: 'bg-[#25D366]/15 text-[#1EBE5D]',
    },
    {
      title: 'Personal Monogram',
      desc: 'Complimentary custom name engraving & gold seal card.',
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
          />
        </svg>
      ),
      color: 'bg-brand-burgundy/10 text-brand-burgundy',
    },
    {
      title: 'Insured Delivery',
      desc: 'Tamper-proof rigid gift unboxing delivered across India.',
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25"
          />
        </svg>
      ),
      color: 'bg-brand-burgundy/10 text-brand-burgundy',
    },
  ];

  return (
    <section className="py-4" aria-labelledby="why-choose-heading">
      <div className="text-center mb-4">
        <span className="text-[10px] tracking-[0.2em] font-bold text-brand-burgundy uppercase block">
          The Shive Shakti Distinction
        </span>
        <h2
          id="why-choose-heading"
          className="font-serif text-lg sm:text-xl font-bold text-brand-charcoal"
        >
          Why Choose Shive Shakti Enterprises
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {pillars.map((item) => (
          <div
            key={item.title}
            className="bg-white p-3.5 rounded-xl border border-brand-gold/30 shadow-xs text-left"
          >
            <div
              className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center mb-2.5`}
            >
              {item.icon}
            </div>
            <h3 className="font-serif font-bold text-xs sm:text-sm text-brand-charcoal leading-snug">
              {item.title}
            </h3>
            <p className="text-[11px] text-brand-muted mt-1 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

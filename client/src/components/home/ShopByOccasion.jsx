import React from 'react';
import { Link } from 'react-router-dom';

const OCCASIONS = [
  {
    id: 'festive',
    name: 'Festive & Diwali',
    query: 'festive',
    image:
      'https://lh3.googleusercontent.com/aida/AEtjO1W5kAvD_2-TLwXQ4_5OajRbd6uLil9N4pluOUa76INdhQxc_GI9W9gO4SaMQ2qEna84LfPSGm8Sla7bqsuRSvBZcY20GxCdGVyGK8fFABe22TvFz4OtkKHKIqqe7BMv9Qw-gJ8Az0xofBnMGgxpGSAberBpx-GSAL2djwUo-yZ7RGSuP_D63Y39tpZ2M3zgcYyR0VU70vbr2yEMMPpX-24k1VRMZlqQoSkpPug_6PMVakwavAq3Ft6YX8U',
  },
  {
    id: 'weddings',
    name: 'Weddings & Shagun',
    query: 'weddings',
    image:
      'https://lh3.googleusercontent.com/aida/AEtjO1X3sQW3Ur3KWmnkiZ5kgn_Z6YV_vXtl7nMJ528ZVULHUWd8WfQtwsHydHM7xzRH-kuk67w8juF2KAf2QDe2JFPBCFJ2X76ozKH8xUEFevSCkdU1-MmPZuY0cVI2yb9c-y8o94Vm6GfsdzFHUYHamXUGDixo0hWP-u7qiaMwmfUx8i_z78eaP3181mjwVlgoKfLHk4HMKtFvAnuMp5YzaGIgeht6p_O-x2lbemiayNh_qvPyHjkuqdZphBk',
  },
  {
    id: 'anniversaries',
    name: 'Anniversaries',
    query: 'anniversaries',
    image:
      'https://lh3.googleusercontent.com/aida/AEtjO1V8dy1HooBRZvHfFh6kcm8BnndNhMLatRRymlYZIh9yiyZ7TFNt9Y7wUMWpJcbEZmC26tMrxj9dRNTgj7l9AbUXA9hch3uawUSoLl3sVAT54kyqygnOQ8CaN7iirKUombU4o7g60V5kVsPtftRMvCuFIyQx0ItH0RD6FoFgiEjb1l9s7E2wDg0Pec2_kunjOf69MQ2rkWDB6jJ4nuuALGuW7uQ3HGy9LixGdRcq4jxF7oESi3wcsmdW0Ts',
  },
  {
    id: 'housewarming',
    name: 'Griha Pravesh',
    query: 'housewarming',
    image:
      'https://lh3.googleusercontent.com/aida/AEtjO1W5kAvD_2-TLwXQ4_5OajRbd6uLil9N4pluOUa76INdhQxc_GI9W9gO4SaMQ2qEna84LfPSGm8Sla7bqsuRSvBZcY20GxCdGVyGK8fFABe22TvFz4OtkKHKIqqe7BMv9Qw-gJ8Az0xofBnMGgxpGSAberBpx-GSAL2djwUo-yZ7RGSuP_D63Y39tpZ2M3zgcYyR0VU70vbr2yEMMPpX-24k1VRMZlqQoSkpPug_6PMVakwavAq3Ft6YX8U',
  },
  {
    id: 'corporate',
    name: 'Corporate Bespoke',
    query: 'corporate',
    image:
      'https://lh3.googleusercontent.com/aida/AEtjO1XGlFZ-X-CDuyD1Okj78mn01TAruaIk1arnxZPDFQCwYuiIPevV1ZS5F-1U5CZXmzKXVjkEBVxQd3wDLIV1HuoNZEG3T4S4GIC7ajpFlcrTGPdEDglCeiRDcLzqIR23rYD4Q7pidD59TUJWq5cnbkN9Apf8EOMhrqtebYbN-1xOQSwJ99cMphSsc3l1I49WzSFP5jd4E7Jo9PFedC_IeVPveCFo8E93yrtdBqWXYTrLh8TjtQhXJ81nXYY',
  },
];

/**
 * Section 3: Shop by Occasion
 * Horizontally scrollable row of occasion tiles linking directly to /shop?occasion=...
 */
export default function ShopByOccasion() {
  return (
    <section className="py-3" aria-labelledby="shop-by-occasion-heading">
      <div className="mb-2.5 flex items-end justify-between">
        <div>
          <span className="text-[10px] tracking-[0.18em] uppercase font-bold text-brand-burgundy block">
            Curated Celebrations
          </span>
          <h2
            id="shop-by-occasion-heading"
            className="font-serif text-lg font-bold text-brand-charcoal"
          >
            Shop by Occasion
          </h2>
        </div>
        <span className="text-[11px] text-brand-burgundy/80 font-semibold tracking-wide">
          Swipe →
        </span>
      </div>

      {/* Horizontal Scrollable Track */}
      <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-1 snap-x snap-mandatory">
        {OCCASIONS.map((occ) => (
          <Link
            key={occ.id}
            to={`/shop?occasion=${occ.query}`}
            className="snap-start flex-shrink-0 w-28 group text-center focus:outline-none transition-transform active:scale-95"
          >
            <div className="w-28 h-32 rounded-xl overflow-hidden relative border border-brand-gold/40 shadow-xs bg-stone-100">
              <img
                src={occ.image}
                alt={occ.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/120x150?text=Occasion';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-2 left-1 right-1 text-center">
                <span className="text-[11px] font-medium text-white block leading-tight font-serif">
                  {occ.name}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';

const OCCASIONS = [
  {
    id: 'festive',
    name: 'Festive & Diwali',
    query: 'festive',
    image:
      'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'weddings',
    name: 'Weddings & Shagun',
    query: 'weddings',
    image:
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'anniversaries',
    name: 'Anniversaries',
    query: 'anniversaries',
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'housewarming',
    name: 'Griha Pravesh',
    query: 'housewarming',
    image:
      'https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'corporate',
    name: 'Corporate Bespoke',
    query: 'corporate',
    image:
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
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
                  e.currentTarget.src = 'https://placehold.co/120x150/f5f5f4/78350f?text=Celebration';
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

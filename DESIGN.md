# Design System & Site Layout Tokens: Artisanal Indian Gift Shop Catalog

> **Brand Tone**: Elegant, warm, trustworthy, modern, retail-oriented, image-focused.  
> **Model**: Conversational Commerce (Catalog browsing → Direct WhatsApp & Phone ordering; no cart or checkout).  
> **Target Viewport**: Mobile-first (360px – 430px, optimized for standard 390px mobile screens, scalable to tablet/desktop).

---

## 1. Color Palette & Semantic Tokens

The palette is rooted in ceremonial Indian gifting aesthetics: warm ivory raw paper stocks, deep royal wine silk, champagne gold foil accents, and an unmistakable emerald green reserved for WhatsApp conversion.

### Core Brand Colors

```css
:root {
  /* Canvas & Neutral Backgrounds */
  --color-canvas: #FAF6F0;              /* Warm alabaster body background */
  --color-ivory: #FCF9F8;               /* Pure ivory container background */
  --color-sand: #F7F3EB;                /* Subtle chip & tag background */
  --color-surface: #FFFFFF;             /* Crisp card & modal surface */
  
  /* Primary & Accent Tones */
  --color-burgundy: #801323;            /* Royal Burgundy - brand accent & headlines */
  --color-burgundy-dark: #5D0012;       /* Deep wine shade for active/footer */
  --color-terracotta: #A64B2A;          /* Warm Terracotta - craftsmanship accents */
  --color-gold: #D4AF37;                /* Champagne / Muted Gold - borders & stars */
  --color-gold-light: #F5E8C7;          /* Soft gold background tint */

  /* Conversational CTA (WhatsApp) */
  --color-whatsapp: #25D366;            /* Official WhatsApp brand green */
  --color-whatsapp-dark: #1EBE5D;       /* WhatsApp hover / active state */
  --color-whatsapp-surface: #E9F9EF;    /* Soft green tint for icons/badges */

  /* Typography & Neutrals */
  --color-charcoal: #2D2826;            /* High-contrast readable body text */
  --color-muted: #6B5E59;               /* Secondary text, category tags */
  --color-subtle: #9E918C;              /* Borders, placeholders */
  --color-border-hairline: rgba(212, 175, 55, 0.25); /* 1px Gold hairline */

  /* Semantic State Colors */
  --color-stock-available-bg: #ECFDF5;  /* Soft emerald background */
  --color-stock-available-text: #065F46;/* Deep emerald text */
  --color-stock-available-dot: #10B981; /* Glowing green status dot */

  --color-stock-order-bg: #FFFBEB;      /* Soft amber background */
  --color-stock-order-text: #92400E;    /* Deep amber text ("Made to Order") */
  --color-stock-order-dot: #F59E0B;     /* Amber status dot */

  --color-stock-unavailable-bg: #F1F5F9;/* Soft slate background */
  --color-stock-unavailable-text: #475569;/* Slate text ("Sold Out") */
  --color-stock-unavailable-dot: #94A3B8;/* Inactive dot */
}
```

---

## 2. Typography Pairing & Scale

- **Headings & Titles**: `Playfair Display`, Georgia, serif  
  Evokes royal Indian heritage, editorial catalogs, and handcrafted distinction.
- **Body, UI & Numbers**: `Plus Jakarta Sans`, system-ui, sans-serif  
  Clean, modern, open geometry for effortless mobile readability and tabular Rupee (`₹`) pricing.

### Font Styles & Tokens

```css
/* Typography Scale */
--font-serif: "Playfair Display", Georgia, serif;
--font-sans: "Plus Jakarta Sans", system-ui, sans-serif;

/* Heading 1 (Editorial Display / Hero) */
.font-display {
  font-family: var(--font-serif);
  font-size: 1.5rem;      /* 24px on mobile */
  line-height: 1.25;
  font-weight: 700;
  letter-spacing: -0.01em;
}

/* Heading 2 (Section Titles) */
.font-section-title {
  font-family: var(--font-serif);
  font-size: 1.25rem;     /* 20px */
  line-height: 1.3;
  font-weight: 700;
}

/* Heading 3 (Product Card Titles) */
.font-product-title {
  font-family: var(--font-serif);
  font-size: 1rem;        /* 16px */
  line-height: 1.35;
  font-weight: 700;
}

/* Price Display (Tabular Rupee) */
.font-price {
  font-family: var(--font-serif);
  font-size: 1.125rem;    /* 18px */
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--color-burgundy);
}

/* Body Regular */
.font-body {
  font-family: var(--font-sans);
  font-size: 0.8125rem;   /* 13px */
  line-height: 1.5;
  color: var(--color-charcoal);
}

/* Micro / Caption / Overline */
.font-caption {
  font-family: var(--font-sans);
  font-size: 0.6875rem;   /* 11px */
  letter-spacing: 0.04em;
  font-weight: 600;
  text-transform: uppercase;
}
```

---

## 3. Spacing, Elevation & Corner Radii

Designed to mirror the physical tactility of luxury gift boxes, tissue liners, and artisanal packaging:

```css
:root {
  /* Corner Radii */
  --radius-xs: 4px;       /* Micro badges, pills */
  --radius-sm: 6px;       /* Buttons & inputs */
  --radius-md: 10px;      /* Containers & secondary blocks */
  --radius-lg: 16px;      /* Product cards & banner containers */
  --radius-full: 9999px;  /* Pill buttons & category chips */

  /* Shadows (Warm diffused shadows, never harsh grey) */
  --shadow-luxury: 0 10px 28px -5px rgba(128, 19, 35, 0.07), 0 4px 10px -2px rgba(0, 0, 0, 0.03);
  --shadow-floating: 0 8px 30px rgba(128, 19, 35, 0.14), 0 2px 6px rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px rgba(45, 40, 38, 0.06);

  /* Spacing Scale (8px Grid Foundation) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;        /* Standard mobile horizontal screen padding */
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
}
```

---

## 4. Layout Architecture (Screen-by-Screen Flow)

The mobile canvas is capped at **390px–420px** wide, centered on larger viewports with an ambient cream background.

```
┌───────────────────────────────────────────────────────────┐
│ Top Announcement Ribbon (Handcrafted • WhatsApp delivery) │
├───────────────────────────────────────────────────────────┤
│ Header: Logo | Search | Quick "Chat" WhatsApp Pill | Menu │
├───────────────────────────────────────────────────────────┤
│ Quick Category Pills (All Hampers, Diyas, Copper, Silk)   │
├───────────────────────────────────────────────────────────┤
│ Hero Section (Editorial Banner Placeholder)               │
├───────────────────────────────────────────────────────────┤
│ Reusable Action Buttons Bar (WhatsApp / Catalog / Call)   │
├───────────────────────────────────────────────────────────┤
│ Product Grid (Vertical Stack):                            │
│  [ Card 1: Artisanal Brass Diya & Honey Hamper - ₹2,450 ] │
│  [ Card 2: Handcrafted Copper Carafe Set - ₹3,200       ] │
│  [ Card 3: Royal Velvet Keepsake Gift Box - ₹1,850      ] │
├───────────────────────────────────────────────────────────┤
│ Trust Markers (100% Artisanal • Pan-India Shipping)       │
├───────────────────────────────────────────────────────────┤
│ Footer: Brand Mission, Links, Boutiques, Hours, Social    │
├───────────────────────────────────────────────────────────┤
│ [Sticky Bottom Bar: Call Icon Button | Order on WhatsApp] │
└───────────────────────────────────────────────────────────┘
```

---

## 5. Component Specifications & Code Templates

### A. Top Navigation Header
```html
<header class="sticky top-0 z-40 bg-[#FCF9F8]/95 backdrop-blur-md border-b border-[#D4AF37]/20">
  <!-- Announcement Ribbon -->
  <div class="bg-[#801323] text-[#FDFBF7] text-[11px] font-semibold tracking-wider uppercase py-1 px-4 text-center">
    Handcrafted Across India • Instant WhatsApp Order Help
  </div>

  <!-- Main Navigation Row -->
  <div class="px-4 py-2.5 flex items-center justify-between gap-2">
    <!-- Brand Logo -->
    <a href="/" class="font-serif text-lg font-bold tracking-tight text-[#801323]">
      UPHAAR &amp; CO.
    </a>

    <!-- Header Actions -->
    <div class="flex items-center gap-2">
      <!-- Search Trigger -->
      <button aria-label="Search" class="w-8 h-8 rounded-full flex items-center justify-center text-[#2D2826] hover:bg-[#D4AF37]/10">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </button>

      <!-- Prominent Header WhatsApp Action -->
      <a href="https://wa.me/919876543210" class="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold px-2.5 py-1.5 rounded-full shadow-xs">
        <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><!-- WhatsApp SVG Path --></svg>
        <span>Chat</span>
      </a>

      <!-- Menu Toggle -->
      <button aria-label="Menu" class="w-8 h-8 rounded-full flex items-center justify-center text-[#2D2826]">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 6h16M4 12h16m-7 6h7"/>
        </svg>
      </button>
    </div>
  </div>

  <!-- Category Filter Pill Bar -->
  <nav class="flex items-center gap-2 px-4 pb-2.5 pt-1 overflow-x-auto no-scrollbar">
    <button class="px-3.5 py-1 text-xs font-semibold rounded-full bg-[#801323] text-white whitespace-nowrap">All Hampers</button>
    <button class="px-3 py-1 text-xs font-medium rounded-full bg-[#F7F3EB] text-[#6B5E59] whitespace-nowrap">Festive Diyas</button>
    <button class="px-3 py-1 text-xs font-medium rounded-full bg-[#F7F3EB] text-[#6B5E59] whitespace-nowrap">Pure Copper</button>
    <button class="px-3 py-1 text-xs font-medium rounded-full bg-[#F7F3EB] text-[#6B5E59] whitespace-nowrap">Silk Keepsakes</button>
  </nav>
</header>
```

---

### B. Reusable Button Styles

#### 1. Primary WhatsApp Action (`.btn-whatsapp`)
```html
<a href="https://wa.me/919876543210?text=Hello%20Uphaar%20Gifts" 
   class="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs py-3 px-4 rounded-lg shadow-sm active:scale-[0.98] transition">
  <svg class="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24"><!-- WhatsApp Icon --></svg>
  <span>Enquire on WhatsApp</span>
</a>
```

#### 2. Secondary Outline Action (`.btn-outline`)
```html
<button type="button" 
        class="w-full flex items-center justify-center gap-2 border border-[#801323] text-[#801323] hover:bg-[#801323] hover:text-white font-semibold text-xs py-2.5 px-4 rounded-lg active:scale-[0.98] transition">
  <span>View Full Catalog</span>
  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
  </svg>
</button>
```

#### 3. Phone Call Action (`.btn-call`)
```html
<a href="tel:+919876543210" 
   class="w-full flex items-center justify-center gap-2 bg-[#FBF5F0] border border-[#A64B2A]/40 text-[#A64B2A] hover:bg-orange-50 font-medium text-xs py-2.5 px-4 rounded-lg active:scale-[0.98] transition">
  <svg class="w-3.5 h-3.5 text-[#A64B2A] shrink-0" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
  </svg>
  <span>Call Now (+91 98765 43210)</span>
</a>
```

---

### C. Standard Product Card Component

This card is reused on Home, Shop, and Category filter views:

```html
<article class="bg-white rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-luxury hover:shadow-md transition">
  <!-- Image Container (4:3 Aspect Ratio) -->
  <div class="relative aspect-[4/3] bg-stone-100 overflow-hidden">
    <img src="[PRODUCT_IMAGE_URL]" alt="[PRODUCT_NAME]" class="w-full h-full object-cover object-center" loading="lazy" />

    <!-- Stock Status Badge (Top-Left) -->
    <div class="absolute top-3 left-3 bg-emerald-50 text-emerald-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-300/60 shadow-xs flex items-center gap-1.5">
      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
      In Stock
    </div>

    <!-- Craft / Feature Tag (Top-Right) -->
    <div class="absolute top-3 right-3 bg-[#801323]/80 backdrop-blur-xs text-[#D4AF37] text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded">
      Bestseller
    </div>
  </div>

  <!-- Content Block -->
  <div class="p-4 flex flex-col justify-between">
    <div>
      <div class="flex items-center gap-1 text-[11px] text-[#6B5E59] font-medium mb-1">
        <span>Festive Heritage</span>
        <span>•</span>
        <span>Handcrafted Brass</span>
      </div>
      <h3 class="font-serif text-base font-bold text-[#2D2826] leading-snug">
        Artisanal Brass Diya &amp; Honey Festive Hamper
      </h3>
      <p class="text-xs text-[#6B5E59] mt-1 line-clamp-2 leading-relaxed">
        Solid brass oil lamp diya, botanical scented candles, wild forest honey jar with dipper, and premium dry fruits.
      </p>
    </div>

    <!-- Pricing & One-Tap WhatsApp Order -->
    <div class="mt-3.5 pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
      <div>
        <span class="text-[10px] uppercase tracking-wider text-[#6B5E59] block">Price</span>
        <span class="text-lg font-bold font-serif text-[#801323]">₹2,450</span>
      </div>

      <!-- Quick WhatsApp Button with Pre-filled Message -->
      <a href="https://wa.me/919876543210?text=Hi%20Uphaar%20Gifts,%20I%20want%20to%20order%20the%20Artisanal%20Brass%20Diya%20Hamper%20(₹2,450)" 
         target="_blank" 
         rel="noopener noreferrer"
         class="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-xs active:scale-95 transition">
        <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><!-- WhatsApp Icon --></svg>
        <span>Enquire</span>
      </a>
    </div>
  </div>
</article>
```

---

### D. Rich Boutique Footer

```html
<footer class="mt-4 bg-[#1E0408] text-[#FAF6F0] px-5 pt-8 pb-10 border-t border-[#D4AF37]/30">
  <div class="space-y-6">
    <!-- Brand Info -->
    <div>
      <span class="font-serif text-xl font-bold tracking-wider text-[#D4AF37] block mb-2">UPHAAR &amp; CO.</span>
      <p class="text-xs text-stone-300 leading-relaxed max-w-xs">
        Curating royal Indian gifting traditions with contemporary sustainable luxury. Handcrafted with reverence.
      </p>
    </div>

    <!-- Quick Links -->
    <div>
      <h4 class="text-[11px] uppercase tracking-widest font-semibold text-[#D4AF37] mb-2.5">Explore</h4>
      <ul class="space-y-1.5 text-xs text-stone-300">
        <li><a href="#" class="hover:text-white transition">Home</a></li>
        <li><a href="#" class="hover:text-white transition">Festive Catalog</a></li>
        <li><a href="#" class="hover:text-white transition">Occasion &amp; Wedding Gifts</a></li>
        <li><a href="#" class="hover:text-white transition">Corporate Bespoke Orders</a></li>
      </ul>
    </div>

    <!-- Contact & Boutiques -->
    <div class="border-t border-stone-800 pt-4 space-y-2 text-xs text-stone-300">
      <h4 class="text-[11px] uppercase tracking-widest font-semibold text-[#D4AF37] mb-1">Contact &amp; Boutiques</h4>
      <p class="flex items-center gap-2">
        <span>📞</span> <a href="tel:+919876543210" class="hover:text-white">+91 98765 43210</a>
      </p>
      <p class="flex items-center gap-2">
        <span class="text-[#25D366]">💬</span> <span>WhatsApp: Direct Order &amp; Customization</span>
      </p>
      <p class="pt-1 text-stone-400">
        📍 Jaipur Studio: Civil Lines • Delhi Boutique: Mehrauli Heritage Quarter
      </p>
      <p class="text-stone-400">
        ⏰ Mon–Sat: 10:00 AM – 8:00 PM
      </p>
    </div>

    <!-- Socials & Copyright -->
    <div class="border-t border-stone-800 pt-4 flex items-center justify-between text-[11px] text-stone-400">
      <p>© 2024 Uphaar &amp; Co. All rights reserved.</p>
      <div class="flex gap-3 text-[#D4AF37]">
        <a href="#">Instagram</a>
        <a href="https://wa.me/919876543210">WhatsApp</a>
      </div>
    </div>
  </div>
</footer>
```

---

### E. Floating Mobile Conversion Dock (Sticky Bottom)

Maintains one-tap WhatsApp conversion within the natural mobile thumb zone:

```html
<aside class="fixed bottom-0 inset-x-0 mx-auto max-w-[420px] z-50 bg-white/95 backdrop-blur-md border-t border-[#D4AF37]/30 px-4 py-2.5 shadow-floating flex items-center justify-between gap-3">
  <!-- Direct Phone Call -->
  <a href="tel:+919876543210" aria-label="Call Boutique" class="w-11 h-11 shrink-0 rounded-xl bg-[#F7F3EB] border border-[#D4AF37]/40 text-[#801323] flex items-center justify-center active:scale-90 transition shadow-xs">
    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><!-- Phone Icon --></svg>
  </a>

  <!-- Primary WhatsApp Ordering Bar -->
  <a href="https://wa.me/919876543210?text=Hi%20Uphaar%20Gifts,%20I%20would%20like%20to%20place%20an%20order." target="_blank" rel="noopener noreferrer" 
     class="flex-1 h-11 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center gap-2 px-4 font-semibold text-xs shadow-md active:scale-[0.98] transition">
    <svg class="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24"><!-- WhatsApp Icon --></svg>
    <span class="tracking-wide uppercase text-[11px] font-bold">Order via WhatsApp</span>
  </a>
</aside>
```

---

## 6. Implementation Notes for Subsequent Phases

1. **No Cart / No Checkout**: Never render cart drawer icons, checkout funnels, payment gateways, or quantity counters.
2. **Dynamic WhatsApp URLs**: Build utility helper `generateWhatsAppUrl(productName, price)` that encodes:
   `https://wa.me/${PHONE}?text=${encodeURIComponent(`Hi, I would like to order: ${productName} (₹${price})`)}`.
3. **Image Ratio Locking**: All catalog and category product images must lock to a `4:3` or `1:1` aspect ratio with `object-cover` to preserve luxury editorial alignment.
4. **Availability Filtering**: Storefront filters must segment by availability badge (`In Stock` vs. `Made to Order`).

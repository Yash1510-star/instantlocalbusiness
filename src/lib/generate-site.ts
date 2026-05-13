/**
 * Site generation logic.
 * Takes business inputs → returns structured website content + layout variant.
 * Provider-agnostic: uses whatever AI_PROVIDER is set in .env
 */

import { generateText } from "./ai-client";

export type BusinessInput = {
  businessName: string;
  category: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  address?: string;
  website?: string;
  description: string;
  services?: string;
  hours?: string;
  specialties?: string;
  priceRange?: string;
  yearsInBusiness?: string;
  teamSize?: string;
  certifications?: string;
  paymentMethods?: string;
  parking?: string;
  socialMedia?: string;
  uniqueSellingPoint?: string;
};

/**
 * Layout variants — each maps to a distinct visual design:
 *
 * hospitality   — Restaurants, cafes, bakeries, bars
 *                 Warm dark hero, food-forward, "Order Now" / "Reserve a Table"
 *
 * service       — Plumbers, electricians, auto repair, cleaning, landscaping
 *                 Bold trust signals, huge phone number, emergency badge, "Get a Quote"
 *
 * wellness      — Dental, chiro, gym, salon, spa, pet grooming
 *                 Soft calming colors, booking-first, before/after, "Book Now"
 *
 * professional  — Law, accounting, real estate, photography, insurance
 *                 Clean navy/white, authority-forward, "Free Consultation"
 */
export type LayoutVariant = "hospitality" | "service" | "wellness" | "professional" | "creative" | "boutique";

export type ColorScheme = {
  primary: string;    // Tailwind bg class e.g. "bg-orange-600"
  primaryHover: string;
  primaryText: string;
  accent: string;     // Tailwind text class
  heroBg: string;     // Tailwind bg for hero
  navBg: string;
  badge: string;      // Tailwind classes for trust badge pill
};

export type MenuItemEntry = {
  name: string;
  description?: string;
  price: string;
};

export type MenuSection = {
  section: string;
  items: MenuItemEntry[];
};

export type GeneratedSite = {
  // Layout
  layout: LayoutVariant;
  colorScheme: ColorScheme;

  // Hero section
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroBadge: string;
  primaryCta: string;
  secondaryCta: string;

  // About
  aboutTitle: string;
  aboutBody: string;

  // Services (exactly 6)
  services: { title: string; description: string; icon?: string }[];

  // Stats (exactly 3)
  stats: { value: string; label: string }[];

  // Urgency/trust strip (short 3-word phrases)
  trustPoints: string[];

  // Optional menu / price list (omit or empty array if not applicable)
  menu?: MenuSection[];

  // CTA section
  ctaHeading: string;
  ctaBody: string;
  ctaButtonLabel: string;
  ctaFormPlaceholder: string;

  // SEO
  metaTitle: string;
  metaDescription: string;

  // Contact
  phone: string;
  email: string;
  address: string;
  hours: string;

  // Unsplash photo IDs
  heroPhoto: string;
  servicePhotos: string[];
};

// ─── Industry → layout + color defaults ──────────────────────────────────────

const CATEGORY_LAYOUT: Record<string, { layout: LayoutVariant; colorScheme: ColorScheme }> = {
  "Restaurant / Cafe": {
    layout: "hospitality",
    colorScheme: {
      primary: "bg-orange-500", primaryHover: "hover:bg-orange-600",
      primaryText: "text-white", accent: "text-orange-500",
      heroBg: "bg-gray-950", navBg: "bg-gray-950/90",
      badge: "bg-orange-500/20 text-orange-300 border border-orange-500/30",
    },
  },
  "Bakery": {
    layout: "hospitality",
    colorScheme: {
      primary: "bg-amber-500", primaryHover: "hover:bg-amber-600",
      primaryText: "text-white", accent: "text-amber-500",
      heroBg: "bg-stone-950", navBg: "bg-stone-950/90",
      badge: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
    },
  },
  "Plumbing": {
    layout: "service",
    colorScheme: {
      primary: "bg-blue-600", primaryHover: "hover:bg-blue-700",
      primaryText: "text-white", accent: "text-blue-500",
      heroBg: "bg-slate-900", navBg: "bg-slate-900/90",
      badge: "bg-red-500/20 text-red-300 border border-red-500/30",
    },
  },
  "Electrician": {
    layout: "service",
    colorScheme: {
      primary: "bg-yellow-500", primaryHover: "hover:bg-yellow-600",
      primaryText: "text-gray-900", accent: "text-yellow-400",
      heroBg: "bg-gray-900", navBg: "bg-gray-900/90",
      badge: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
    },
  },
  "Auto Repair": {
    layout: "service",
    colorScheme: {
      primary: "bg-red-600", primaryHover: "hover:bg-red-700",
      primaryText: "text-white", accent: "text-red-400",
      heroBg: "bg-zinc-950", navBg: "bg-zinc-950/90",
      badge: "bg-red-500/20 text-red-300 border border-red-500/30",
    },
  },
  "Cleaning Services": {
    layout: "service",
    colorScheme: {
      primary: "bg-cyan-500", primaryHover: "hover:bg-cyan-600",
      primaryText: "text-white", accent: "text-cyan-400",
      heroBg: "bg-slate-900", navBg: "bg-slate-900/90",
      badge: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
    },
  },
  "Landscaping": {
    layout: "service",
    colorScheme: {
      primary: "bg-green-600", primaryHover: "hover:bg-green-700",
      primaryText: "text-white", accent: "text-green-400",
      heroBg: "bg-stone-900", navBg: "bg-stone-900/90",
      badge: "bg-green-500/20 text-green-300 border border-green-500/30",
    },
  },
  "Hair Salon / Barbershop": {
    layout: "wellness",
    colorScheme: {
      primary: "bg-rose-500", primaryHover: "hover:bg-rose-600",
      primaryText: "text-white", accent: "text-rose-400",
      heroBg: "bg-neutral-950", navBg: "bg-neutral-950/90",
      badge: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
    },
  },
  "Dental Office": {
    layout: "wellness",
    colorScheme: {
      primary: "bg-teal-500", primaryHover: "hover:bg-teal-600",
      primaryText: "text-white", accent: "text-teal-500",
      heroBg: "bg-slate-50", navBg: "bg-white/90",
      badge: "bg-teal-50 text-teal-700 border border-teal-200",
    },
  },
  "Gym / Fitness Studio": {
    layout: "wellness",
    colorScheme: {
      primary: "bg-yellow-400", primaryHover: "hover:bg-yellow-500",
      primaryText: "text-gray-900", accent: "text-yellow-400",
      heroBg: "bg-black", navBg: "bg-black/90",
      badge: "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30",
    },
  },
  "Chiropractic": {
    layout: "wellness",
    colorScheme: {
      primary: "bg-violet-500", primaryHover: "hover:bg-violet-600",
      primaryText: "text-white", accent: "text-violet-400",
      heroBg: "bg-slate-50", navBg: "bg-white/90",
      badge: "bg-violet-50 text-violet-700 border border-violet-200",
    },
  },
  "Law Firm": {
    layout: "professional",
    colorScheme: {
      primary: "bg-slate-800", primaryHover: "hover:bg-slate-900",
      primaryText: "text-white", accent: "text-slate-300",
      heroBg: "bg-slate-900", navBg: "bg-slate-900/90",
      badge: "bg-slate-700/50 text-slate-300 border border-slate-600",
    },
  },
  "Accounting / Tax": {
    layout: "professional",
    colorScheme: {
      primary: "bg-blue-700", primaryHover: "hover:bg-blue-800",
      primaryText: "text-white", accent: "text-blue-400",
      heroBg: "bg-slate-900", navBg: "bg-slate-900/90",
      badge: "bg-blue-700/20 text-blue-300 border border-blue-700/30",
    },
  },
  "Real Estate": {
    layout: "professional",
    colorScheme: {
      primary: "bg-indigo-600", primaryHover: "hover:bg-indigo-700",
      primaryText: "text-white", accent: "text-indigo-400",
      heroBg: "bg-gray-900", navBg: "bg-gray-900/90",
      badge: "bg-indigo-600/20 text-indigo-300 border border-indigo-600/30",
    },
  },
  "Photography": {
    layout: "creative",
    colorScheme: {
      primary: "bg-neutral-100", primaryHover: "hover:bg-white",
      primaryText: "text-gray-900", accent: "text-neutral-300",
      heroBg: "bg-black", navBg: "bg-black/90",
      badge: "bg-white/10 text-white border border-white/20",
    },
  },
  "Florist": {
    layout: "creative",
    colorScheme: {
      primary: "bg-rose-400", primaryHover: "hover:bg-rose-300",
      primaryText: "text-white", accent: "text-rose-300",
      heroBg: "bg-rose-950", navBg: "bg-rose-950/90",
      badge: "bg-rose-400/20 text-rose-200 border border-rose-400/30",
    },
  },
  "Catering": {
    layout: "hospitality",
    colorScheme: {
      primary: "bg-amber-600", primaryHover: "hover:bg-amber-700",
      primaryText: "text-white", accent: "text-amber-400",
      heroBg: "bg-stone-950", navBg: "bg-stone-950/90",
      badge: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
    },
  },
  "Roofing": {
    layout: "service",
    colorScheme: {
      primary: "bg-slate-700", primaryHover: "hover:bg-slate-800",
      primaryText: "text-white", accent: "text-slate-300",
      heroBg: "bg-slate-900", navBg: "bg-slate-900/90",
      badge: "bg-slate-600/30 text-slate-300 border border-slate-600",
    },
  },
  "HVAC": {
    layout: "service",
    colorScheme: {
      primary: "bg-sky-600", primaryHover: "hover:bg-sky-700",
      primaryText: "text-white", accent: "text-sky-400",
      heroBg: "bg-slate-900", navBg: "bg-slate-900/90",
      badge: "bg-sky-500/20 text-sky-300 border border-sky-500/30",
    },
  },
  "Tutoring": {
    layout: "professional",
    colorScheme: {
      primary: "bg-indigo-600", primaryHover: "hover:bg-indigo-700",
      primaryText: "text-white", accent: "text-indigo-400",
      heroBg: "bg-indigo-950", navBg: "bg-indigo-950/90",
      badge: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",
    },
  },
  "Childcare / Daycare": {
    layout: "wellness",
    colorScheme: {
      primary: "bg-yellow-400", primaryHover: "hover:bg-yellow-500",
      primaryText: "text-gray-900", accent: "text-yellow-500",
      heroBg: "bg-sky-50", navBg: "bg-white/90",
      badge: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    },
  },
  "Massage Therapy": {
    layout: "boutique",
    colorScheme: {
      primary: "bg-stone-700", primaryHover: "hover:bg-stone-600",
      primaryText: "text-white", accent: "text-stone-500",
      heroBg: "bg-stone-50", navBg: "bg-white/95",
      badge: "bg-stone-100 text-stone-600 border border-stone-200",
    },
  },
  "Nail Salon": {
    layout: "boutique",
    colorScheme: {
      primary: "bg-fuchsia-500", primaryHover: "hover:bg-fuchsia-600",
      primaryText: "text-white", accent: "text-fuchsia-500",
      heroBg: "bg-fuchsia-50", navBg: "bg-white/95",
      badge: "bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200",
    },
  },
  "Pet Grooming": {
    layout: "boutique",
    colorScheme: {
      primary: "bg-pink-500", primaryHover: "hover:bg-pink-600",
      primaryText: "text-white", accent: "text-pink-500",
      heroBg: "bg-pink-50", navBg: "bg-white/95",
      badge: "bg-pink-50 text-pink-700 border border-pink-200",
    },
  },
  "Dance Studio / Classes": {
    layout: "creative",
    colorScheme: {
      primary: "bg-violet-500", primaryHover: "hover:bg-violet-400",
      primaryText: "text-white", accent: "text-violet-300",
      heroBg: "bg-fuchsia-950", navBg: "bg-fuchsia-950/90",
      badge: "bg-violet-400/20 text-violet-300 border border-violet-400/30",
    },
  },
};

const DEFAULT_LAYOUT: { layout: LayoutVariant; colorScheme: ColorScheme } = {
  layout: "service",
  colorScheme: {
    primary: "bg-blue-600", primaryHover: "hover:bg-blue-700",
    primaryText: "text-white", accent: "text-blue-400",
    heroBg: "bg-gray-900", navBg: "bg-gray-900/90",
    badge: "bg-blue-600/20 text-blue-300 border border-blue-600/30",
  },
};

// ─── Photo providers (Unsplash → Pexels → Pixabay cascade) ──────────────────
// All functions return full base URLs (no size params) so the photoUrl()
// helper in each component can append the right dimensions per usage.

async function fetchUnsplashPhotos(query: string, count: number): Promise<string[]> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return [];
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${Math.min(count, 30)}&orientation=landscape&content_filter=high`;
    const res = await fetch(url, {
      headers: { Authorization: `Client-ID ${key}` },
      next: { revalidate: 86400 },
    } as RequestInit);
    if (!res.ok) {
      console.error(`[unsplash] HTTP ${res.status} for query="${query}"`);
      return [];
    }
    const data = await res.json() as { results: { urls: { raw: string } }[] };
    // Keep ixid+ixlib from the raw URL — Unsplash CDN requires them to serve images.
    // Strip only non-essential params (s=, crop=, etc.) and keep ixid/ixlib.
    const urls = data.results.map((r) => {
      const u = new URL(r.urls.raw);
      const kept = new URLSearchParams();
      for (const [k, v] of u.searchParams) {
        if (k === "ixid" || k === "ixlib") kept.set(k, v);
      }
      return `${u.origin}${u.pathname}?${kept.toString()}`;
    }).filter(Boolean);
    console.log(`[unsplash] query="${query}" → ${urls.length} results`);
    return urls;
  } catch (err) {
    console.error("[unsplash] fetch failed:", err);
    return [];
  }
}

async function fetchPexelsPhotos(query: string, count: number): Promise<string[]> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return [];
  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${Math.min(count, 80)}&orientation=landscape`;
    const res = await fetch(url, {
      headers: { Authorization: key },
      next: { revalidate: 86400 },
    } as RequestInit);
    if (!res.ok) {
      console.error(`[pexels] HTTP ${res.status} for query="${query}"`);
      return [];
    }
    const data = await res.json() as { photos: { src: { original: string } }[] };
    const urls = data.photos.map((p) => p.src.original.split("?")[0]).filter(Boolean);
    console.log(`[pexels] query="${query}" → ${urls.length} results`);
    return urls;
  } catch (err) {
    console.error("[pexels] fetch failed:", err);
    return [];
  }
}

async function fetchPixabayPhotos(query: string, count: number): Promise<string[]> {
  const key = process.env.PIXABAY_API_KEY;
  if (!key) return [];
  try {
    const url = `https://pixabay.com/api/?key=${key}&q=${encodeURIComponent(query)}&per_page=${Math.min(count, 200)}&orientation=horizontal&image_type=photo&safesearch=true`;
    const res = await fetch(url, {
      next: { revalidate: 86400 },
    } as RequestInit);
    if (!res.ok) {
      console.error(`[pixabay] HTTP ${res.status} for query="${query}"`);
      return [];
    }
    const data = await res.json() as { hits: { largeImageURL: string }[] };
    const urls = data.hits.map((h) => h.largeImageURL).filter(Boolean);
    console.log(`[pixabay] query="${query}" → ${urls.length} results`);
    return urls;
  } catch (err) {
    console.error("[pixabay] fetch failed:", err);
    return [];
  }
}

// Try Unsplash first, fall through to Pexels, then Pixabay.
async function fetchPhotos(query: string, count: number): Promise<string[]> {
  const unsplash = await fetchUnsplashPhotos(query, count);
  if (unsplash.length >= count) return unsplash;
  const pexels = await fetchPexelsPhotos(query, count);
  if (pexels.length > 0) return pexels;
  return fetchPixabayPhotos(query, count);
}

// ─── Unsplash photo IDs per category (static fallback) ───────────────────────

const CATEGORY_PHOTOS: Record<string, { hero: string; services: string[] }> = {
  "Restaurant / Cafe": {
    hero: "photo-1414235077428-338989a2e8c0",
    services: ["photo-1565299624946-b28f40a0ae38","photo-1482049016688-2d3e1b311543","photo-1467003909585-2f8a72700288","photo-1504674900247-0877df9cc836","photo-1540189549336-e6e99c3679fe","photo-1498837167922-ddd27525d352"],
  },
  "Bakery": {
    hero: "photo-1509440159596-0249088772ff",
    services: ["photo-1555507036-ab1f4038808a","photo-1586788224331-947f68671cf1","photo-1517433670267-08bbd4be890f","photo-1464305795204-6f5bbfc7fb81","photo-1488477181946-6428a0291777","photo-1549931319-a545dcf3bc73"],
  },
  "Plumbing": {
    hero: "photo-1504328345606-18bbc8c9d7d1",
    services: ["photo-1585771724684-38269d6639fd","photo-1558618666-fcd25c85cd64","photo-1521342726558-9775e1f43946","photo-1504328345606-18bbc8c9d7d1","photo-1558618047-3c8c76ca7d13","photo-1581244277943-fe4a9c777189"],
  },
  "Electrician": {
    hero: "photo-1621905251189-08b45d6a269e",
    services: ["photo-1558618666-fcd25c85cd64","photo-1593941707882-a5bba14938c7","photo-1565008447742-97f6f38c985c","photo-1616763355548-1b606f439f86","photo-1565538810643-b5bdb714032a","photo-1497366811353-6870744d04b2"],
  },
  "Auto Repair": {
    hero: "photo-1487754180451-c456f719a1fc",
    services: ["photo-1530046339160-ce3e530c7d2f","photo-1489824904134-891ab64532f1","photo-1492144534655-ae79c964c9d7","photo-1486262715619-67b85e0b08d3","photo-1599586120429-048bcd2564da","photo-1558618666-fcd25c85cd64"],
  },
  "Cleaning Services": {
    hero: "photo-1581578731548-c64695cc6952",
    services: ["photo-1527515637462-cff94aca55ab","photo-1563453392212-326f5e854473","photo-1558618666-fcd25c85cd64","photo-1484154218962-a197022b5858","photo-1556911220-bff31c812dba","photo-1581578731548-c64695cc6952"],
  },
  "Landscaping": {
    hero: "photo-1416879595882-3373a0480b5b",
    services: ["photo-1558904541-efa843a96f01","photo-1416879595882-3373a0480b5b","photo-1585320806297-9794b3e4edd0","photo-1593756796186-318e7cedc18e","photo-1587049352851-8d4e89133924","photo-1621621698581-fd8a5b6c5c04"],
  },
  "Hair Salon / Barbershop": {
    hero: "photo-1560066984-138daaa938e4",
    services: ["photo-1522337360788-8b13dee7a37e","photo-1562322140-8baeececf3df","photo-1595476108010-b4d1f102b1b1","photo-1605497788044-5a32c7078486","photo-1503951914875-452162b0f3f1","photo-1521590832167-7bcbfaa6381f"],
  },
  "Dental Office": {
    hero: "photo-1606811971618-4486d14f3f99",
    services: ["photo-1588776814546-1ffcf47267a5","photo-1598256989800-fe5f95da9787","photo-1607613009820-a29f7bb81c04","photo-1609840114035-3c981b782dfe","photo-1629909615957-be38d48fbbe4","photo-1559757175-0eb30cd8c063"],
  },
  "Gym / Fitness Studio": {
    hero: "photo-1534438327276-14e5300c3a48",
    services: ["photo-1571019613454-1cb2f99b2d8b","photo-1599058945522-28d584b6f0ff","photo-1517836357463-d25dfeac3438","photo-1549476464-37392f717541","photo-1540497077202-7c8a3999166f","photo-1583454110551-21f2fa2afe61"],
  },
  "Chiropractic": {
    hero: "photo-1544367567-0f2fcb009e0b",
    services: ["photo-1519824145371-296894a0daa9","photo-1568602471122-7832951cc4c5","photo-1576091160550-2173dba999ef","photo-1559757148-5c350d0d3c56","photo-1544367567-0f2fcb009e0b","photo-1588776814546-1ffcf47267a5"],
  },
  "Pet Grooming": {
    hero: "photo-1587300003388-59208cc962cb",
    services: ["photo-1548199973-03cce0bbc87b","photo-1583511655857-d19b40a7a54e","photo-1601758228041-f3b2795255f1","photo-1477884213360-7e9d7dcc1e48","photo-1519052537078-e6302a4968d4","photo-1530281700549-e82e7bf110d6"],
  },
  "Law Firm": {
    hero: "photo-1589829545856-d10d557cf95f",
    services: ["photo-1436564989037-b4ebbbde7e33","photo-1450101499163-c8848c66ca85","photo-1453945619913-79ec89a82c51","photo-1521587760476-6c12a4b040da","photo-1589578527966-fdac0f44566c","photo-1554469384-e58fac16e23a"],
  },
  "Accounting / Tax": {
    hero: "photo-1554224155-8d04cb21cd6c",
    services: ["photo-1460925895917-afdab827c52f","photo-1554224155-8d04cb21cd6c","photo-1450101499163-c8848c66ca85","photo-1521587760476-6c12a4b040da","photo-1600880292203-757bb62b4baf","photo-1434626881859-194d67b2b86f"],
  },
  "Real Estate": {
    hero: "photo-1560518883-ce09059eeffa",
    services: ["photo-1582407947304-fd86f28320c7","photo-1560518883-ce09059eeffa","photo-1570129477492-45c003edd2be","photo-1600596542815-ffad4c1539a9","photo-1600585154340-be6161a56a0c","photo-1512917774080-9991f1c4c750"],
  },
  "Photography": {
    hero: "photo-1542038784456-1ea8e935640e",
    services: ["photo-1516035069371-29a1b244cc32","photo-1542038784456-1ea8e935640e","photo-1519741497674-611481863552","photo-1508214751196-bcfd4ca60f91","photo-1471341971476-ae15ff5dd4ea","photo-1526170375885-4d8ecf77b99f"],
  },
  "Florist": {
    hero: "photo-1487530811015-6780fb4f3df2",
    services: ["photo-1561181286-d3f6a14498e0","photo-1519225421980-715cb0215aed","photo-1467810563316-b5476525c0f9","photo-1490750967868-88df5691cc2d","photo-1416879595882-3373a0480b5b","photo-1487530811015-6780fb4f3df2"],
  },
  "Catering": {
    hero: "photo-1555244162-803834f70033",
    services: ["photo-1565299507177-b0ac66763828","photo-1555244162-803834f70033","photo-1414235077428-338989a2e8c0","photo-1504674900247-0877df9cc836","photo-1547592180-85f173990554","photo-1530648672449-81f6c723e2f1"],
  },
  "Roofing": {
    hero: "photo-1504307651254-35680f356dfd",
    services: ["photo-1504307651254-35680f356dfd","photo-1558618666-fcd25c85cd64","photo-1581578731548-c64695cc6952","photo-1563296021-28f79f5f4b62","photo-1621905252507-b35492cc74b4","photo-1497366811353-6870744d04b2"],
  },
  "HVAC": {
    hero: "photo-1585771724684-38269d6639fd",
    services: ["photo-1558618666-fcd25c85cd64","photo-1581094794329-c8112a89af12","photo-1507089947368-19c1da9775ae","photo-1585771724684-38269d6639fd","photo-1504328345606-18bbc8c9d7d1","photo-1527515637462-cff94aca55ab"],
  },
  "Tutoring": {
    hero: "photo-1503676260728-1c00da094a0b",
    services: ["photo-1523050854058-8df90110c9f1","photo-1503676260728-1c00da094a0b","photo-1434030216411-0b793f4b4173","photo-1456513080510-7bf3a84b82f8","photo-1488190211105-8b0e65b80b4e","photo-1516321318423-f06f85e504b3"],
  },
  "Childcare / Daycare": {
    hero: "photo-1587654780291-39c9404d746b",
    services: ["photo-1587654780291-39c9404d746b","photo-1503454537195-1dcabb73ffb9","photo-1516627145497-ae6968895b74","photo-1488521787991-ed7bbaae773c","photo-1555252333-9f8e92e65df9","photo-1491013516836-7db643ee125a"],
  },
  "Massage Therapy": {
    hero: "photo-1544161515-4ab6ce6db874",
    services: ["photo-1519823551278-64ac92734fb1","photo-1544161515-4ab6ce6db874","photo-1600334089648-b0d9d3028eb2","photo-1515377905703-c4788e51af15","photo-1559757175-0eb30cd8c063","photo-1571019614242-c5c5dee9f50b"],
  },
  "Nail Salon": {
    hero: "photo-1604654894610-df63bc536371",
    services: ["photo-1604654894610-df63bc536371","photo-1604654894610-df63bc536371","photo-1604654894610-df63bc536371","photo-1522337360788-8b13dee7a37e","photo-1487412947147-5cebf100ffc2","photo-1560066984-138daaa938e4"],
  },
  "Accounting": {
    hero: "photo-1554224155-8d04cb21cd6c",
    services: ["photo-1460925895917-afdab827c52f","photo-1554224155-8d04cb21cd6c","photo-1450101499163-c8848c66ca85","photo-1521587760476-6c12a4b040da","photo-1600880292203-757bb62b4baf","photo-1434626881859-194d67b2b86f"],
  },
};

const DEFAULT_PHOTOS = {
  hero: "photo-1497366216548-37526070297c",
  services: [
    "photo-1497366754035-f200968a6e72","photo-1600880292203-757bb62b4baf",
    "photo-1521791136064-7986c2920216","photo-1553877522-43269d4ea984",
    "photo-1560472355-536de3962603","photo-1454165804606-c3d57bc86b40",
  ],
};

// ─── Prompt ───────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an expert local business website copywriter.
You write compelling, professional, SEO-optimized copy for local business websites.
Your copy is specific to the industry, location, and business — never generic.
You always return valid JSON with no extra text, markdown, or code blocks.`;

function getCategoryConfig(category: string) {
  const exact = CATEGORY_LAYOUT[category];
  if (exact) return exact;
  const fuzzy = Object.entries(CATEGORY_LAYOUT).find(([key]) => {
    const cat = category.toLowerCase();
    return key.toLowerCase().split(/[\s/,]+/).some((w) => w.length > 3 && cat.includes(w));
  });
  return fuzzy?.[1] ?? DEFAULT_LAYOUT;
}

function buildMenuGuidance(layout: LayoutVariant, input: BusinessInput): string {
  const hasPricing = !!(input.priceRange || (input.services && /\$|\bprice|\brate|\bfee|\bcost|\bcharge|\bfrom\b|\bper\b/i.test(input.services)));

  if (layout === "hospitality") {
    return `[
    {
      "section": "Starters",
      "items": [
        {"name": "Item name", "description": "Brief description", "price": "$XX"},
        {"name": "Item name", "description": "Brief description", "price": "$XX"},
        {"name": "Item name", "price": "$XX"}
      ]
    },
    {
      "section": "Mains",
      "items": [
        {"name": "Item name", "description": "Brief description", "price": "$XX"},
        {"name": "Item name", "description": "Brief description", "price": "$XX"},
        {"name": "Item name", "description": "Brief description", "price": "$XX"},
        {"name": "Item name", "price": "$XX"}
      ]
    },
    {
      "section": "Desserts & Drinks",
      "items": [
        {"name": "Item name", "price": "$XX"},
        {"name": "Item name", "price": "$XX"}
      ]
    }
  ]
  // Generate 3 sections with realistic items and prices for ${input.category} in ${input.city}. Use actual menu items from Services/Menu field if provided. Use realistic local market prices.`;
  }

  if (layout === "wellness" || layout === "boutique") {
    if (!hasPricing) return `[]  // Return empty array — no pricing info provided`;
    return `[
    {
      "section": "Our Services",
      "items": [
        {"name": "Service name", "description": "Duration or detail (e.g. 60 min)", "price": "$XX"},
        {"name": "Service name", "description": "Duration or detail", "price": "$XX"},
        {"name": "Service name", "description": "Duration or detail", "price": "$XX"},
        {"name": "Service name", "price": "$XX"}
      ]
    }
  ]
  // Generate realistic service pricing based on Services/Menu field and Pricing: ${input.priceRange || "not specified"}. Use local market rates for ${input.city}.`;
  }

  if (layout === "professional") {
    if (!hasPricing) return `[]  // Return empty array — no pricing info provided`;
    return `[
    {
      "section": "Fee Structure",
      "items": [
        {"name": "Service / consultation type", "description": "Brief note", "price": "Free / $XXX / From $XX/hr"},
        {"name": "Service type", "price": "$ range"}
      ]
    }
  ]
  // Generate professional fee structure based on Services/Menu and Pricing: ${input.priceRange || "not specified"}.`;
  }

  if (layout === "creative") {
    if (!hasPricing) return `[]  // Return empty array — no pricing info provided`;
    return `[
    {
      "section": "Classes & Packages",
      "items": [
        {"name": "Class / package name", "description": "Duration or level", "price": "$XX/class or $XX/mo"},
        {"name": "Class / package name", "description": "Detail", "price": "$XX"}
      ]
    }
  ]
  // Generate realistic class pricing based on Services/Menu and Pricing: ${input.priceRange || "not specified"}.`;
  }

  if (layout === "service") {
    if (!hasPricing) return `[]  // Return empty array — no pricing info provided`;
    return `[
    {
      "section": "Pricing Guide",
      "items": [
        {"name": "Service type", "description": "Brief detail", "price": "From $XX / Free estimate"},
        {"name": "Service type", "price": "$XX–$XX"}
      ]
    }
  ]
  // Generate realistic service pricing based on Services/Menu and Pricing: ${input.priceRange || "not specified"}.`;
  }

  return `[]`;
}

function buildPrompt(input: BusinessInput): string {
  const { layout } = getCategoryConfig(input.category);

  const layoutGuidance: Record<LayoutVariant, string> = {
    hospitality:  "Focus on appetite appeal, ambiance, and experience. CTAs should be 'Order Now', 'Reserve a Table', 'View Menu'. Trust points emphasize freshness, local ingredients, family recipes.",
    service:      "Focus on reliability, speed, and expertise. CTAs should be 'Get a Free Quote', 'Call Now', 'Book Online'. Trust points emphasize 24/7 availability, licensed/insured, fast response.",
    wellness:     "Focus on transformation, care, and results. CTAs should be 'Book Now', 'Schedule Appointment', 'Get Started'. Trust points emphasize certified staff, gentle approach, proven results.",
    professional: "Focus on expertise, trust, and outcomes. CTAs should be 'Free Consultation', 'Talk to an Expert', 'Get Started'. Trust points emphasize years of experience, credentials, client outcomes.",
    creative:     "Focus on artistic identity, passion, and visual storytelling. CTAs should be 'Book a Class', 'View Portfolio', 'Schedule a Session'. Trust points emphasize artistic excellence, years of training, community, joy.",
    boutique:     "Focus on luxury, self-care, and personalized attention. CTAs should be 'Book an Appointment', 'Treat Yourself', 'Reserve Your Spot'. Trust points emphasize premium products, expert hands, relaxing environment.",
  };

  const extraContext = [
    input.specialties       && `Specialties/Style: ${input.specialties}`,
    input.priceRange        && `Pricing: ${input.priceRange}`,
    input.yearsInBusiness   && `Years in Business: ${input.yearsInBusiness}`,
    input.teamSize          && `Team Size: ${input.teamSize}`,
    input.certifications    && `Certifications/Licenses: ${input.certifications}`,
    input.paymentMethods    && `Payment Methods: ${input.paymentMethods}`,
    input.parking           && `Parking: ${input.parking}`,
    input.uniqueSellingPoint && `Customer Praise / USP: ${input.uniqueSellingPoint}`,
    input.socialMedia       && `Social Media: ${input.socialMedia}`,
    input.website           && `Existing Website: ${input.website}`,
  ].filter(Boolean).join("\n");

  return `Create complete website copy for this local business. Use ALL the details provided — do NOT invent or guess information that contradicts what's given below.

Business Name: ${input.businessName}
Category: ${input.category}
Location: ${input.city}, ${input.state}
Phone: ${input.phone}
Email: ${input.email}
Address: ${input.address || `${input.city}, ${input.state}`}
Description: ${input.description}
Services/Menu: ${input.services || "Not specified"}
Hours: ${input.hours || "Please call for hours"}${extraContext ? `\n${extraContext}` : ""}
Layout Style: ${layout} — ${layoutGuidance[layout]}

Return ONLY a JSON object (no markdown, no code blocks):
{
  "tagline": "Short punchy tagline (4-7 words, industry-specific)",
  "heroHeadline": "Main headline (6-12 words, includes business name and location)",
  "heroSubheadline": "Supporting sentence (15-25 words, key benefit for this industry)",
  "heroBadge": "Trust badge (3-6 words, e.g. 'Licensed & Insured in ${input.state}' or 'Serving ${input.city} Since 2004')",
  "primaryCta": "Primary button (2-4 words, action verb, industry-appropriate)",
  "secondaryCta": "Secondary button (2-4 words)",
  "aboutTitle": "About heading (5-8 words)",
  "aboutBody": "2-3 sentences (40-60 words, warm, local, personal)",
  "services": [
    {"title": "Service name", "description": "1-2 sentences (20-35 words)", "icon": "one of: wrench, scissors, scale, heart, utensils, car, leaf, home, star, shield, clock, phone"},
    {"title": "...", "description": "...", "icon": "..."},
    {"title": "...", "description": "...", "icon": "..."},
    {"title": "...", "description": "...", "icon": "..."},
    {"title": "...", "description": "...", "icon": "..."},
    {"title": "...", "description": "...", "icon": "..."}
  ],
  "stats": [
    {"value": "Punchy value (e.g. '24/7', '500+', 'Free', '$0 Down')", "label": "2-4 words"},
    {"value": "...", "label": "..."},
    {"value": "...", "label": "..."}
  ],
  "trustPoints": [
    "3-5 word trust phrase (e.g. 'Licensed & Insured')",
    "3-5 word trust phrase",
    "3-5 word trust phrase",
    "3-5 word trust phrase"
  ],
  "menu": ${buildMenuGuidance(layout, input)},
  "ctaHeading": "Action heading (6-10 words)",
  "ctaBody": "Supporting text (20-30 words)",
  "ctaButtonLabel": "Button text (2-4 words)",
  "ctaFormPlaceholder": "Input placeholder (4-8 words)",
  "metaTitle": "SEO title (50-60 chars, includes city + category)",
  "metaDescription": "SEO description (140-160 chars, city + category + key benefit)",
  "phone": "${input.phone}",
  "email": "${input.email}",
  "address": "${input.address || `${input.city}, ${input.state}`}",
  "hours": "${input.hours || "Call for current hours"}"
}

Write specifically for ${input.category} in ${input.city}, ${input.state}.
Use the ${layout} tone throughout. Make every word count.`;
}

// ─── Smart photo query builders ──────────────────────────────────────────────

const STOP_WORDS = new Set([
  "we","our","the","a","an","and","or","in","is","are","to","of","for","with",
  "your","that","this","have","has","been","will","can","all","also","its",
  "from","they","their","them","was","were","be","by","at","on","as","it",
  "not","but","so","if","do","get","use","new","best","great","local","top",
]);

/** Builds a rich hero image query from business details. */
function buildHeroQuery(input: BusinessInput, opts?: { omitCity?: boolean }): string {
  const parts: string[] = [];

  // Specialties/style are the most visually specific signal
  if (input.specialties) {
    const words = input.specialties
      .replace(/[^a-zA-Z\s]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 3 && !STOP_WORDS.has(w.toLowerCase()))
      .slice(0, 4);
    if (words.length) parts.push(words.join(" "));
  }

  // Pull distinctive nouns from the description (skip stop words)
  if (input.description && parts.length < 2) {
    const descWords = input.description
      .replace(/[^a-zA-Z\s]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 4 && !STOP_WORDS.has(w.toLowerCase()))
      .slice(0, 5)
      .join(" ");
    if (descWords) parts.push(descWords);
  }

  // Primary industry term (first segment before "/" or space)
  const industryTerm = input.category.split(/[/,]/)[0].trim();
  if (!parts.join(" ").toLowerCase().includes(industryTerm.toLowerCase().split(/\s/)[0])) {
    parts.unshift(industryTerm);
  }

  if (!opts?.omitCity) parts.push(input.city);

  return parts.join(" ").replace(/\s+/g, " ").slice(0, 80).trim();
}

/** Builds a service-photos query using AI-generated service titles. */
function buildServiceQuery(services: Array<{ title: string }>, input: BusinessInput): string {
  const industryTerm = input.category.split(/[/,]/)[0].trim().toLowerCase();

  // Use top service titles as search terms — much more specific than just the category
  const serviceTerms = services
    .slice(0, 4)
    .map(sv =>
      sv.title
        .toLowerCase()
        .replace(/[^a-z\s]/g, "")
        .split(/\s+/)
        .filter(w => w.length > 3 && !STOP_WORDS.has(w))
        .slice(0, 3)
        .join(" ")
        .trim()
    )
    .filter(t => t.length > 2)
    .join(" ");

  const combined = serviceTerms
    ? `${serviceTerms} ${industryTerm}`
    : input.category;

  return combined.replace(/\s+/g, " ").slice(0, 80).trim();
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function generateSiteContent(input: BusinessInput): Promise<GeneratedSite> {
  const response = await generateText([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: buildPrompt(input) },
  ]);

  const cleaned = response.text
    .replace(/^```(?:json)?\n?/m, "")
    .replace(/\n?```$/m, "")
    .trim();

  let parsed: Omit<GeneratedSite, "layout" | "colorScheme" | "heroPhoto" | "servicePhotos">;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    // Response was likely truncated — retry once with a stricter length hint
    console.warn("[generateSite] JSON parse failed, retrying with brevity hint. Raw:", response.text.slice(0, 200));
    const retryMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      { role: "user" as const, content: buildPrompt(input) + "\n\nIMPORTANT: Keep all string values concise (under 20 words each) to avoid truncation. Return valid complete JSON only." },
    ];
    const retryResponse = await generateText(retryMessages);
    const retryCleaned = retryResponse.text
      .replace(/^```(?:json)?\n?/m, "")
      .replace(/\n?```$/m, "")
      .trim();
    try {
      parsed = JSON.parse(retryCleaned);
    } catch {
      throw new Error("Site generation failed — please try again.");
    }
  }

  if (!parsed.services || parsed.services.length < 3) {
    throw new Error("AI returned insufficient services");
  }

  // Attach layout + color scheme — try exact match first, then fuzzy keyword match
  const exactMatch = CATEGORY_LAYOUT[input.category];
  const fuzzyMatch = exactMatch ? null : Object.entries(CATEGORY_LAYOUT).find(([key]) => {
    const cat = input.category.toLowerCase();
    return key.toLowerCase().split(/[\s/,]+/).some((word) => word.length > 3 && cat.includes(word));
  });
  const { layout, colorScheme } = exactMatch ?? fuzzyMatch?.[1] ?? DEFAULT_LAYOUT;

  // Build smart photo queries from actual business details rather than bare category+city.
  const heroQuery   = buildHeroQuery(input);
  const serviceQuery = buildServiceQuery(parsed.services, input);

  const [heroResults, serviceResults] = await Promise.all([
    fetchPhotos(heroQuery, 1),
    fetchPhotos(serviceQuery, 6),
  ]);

  // Hero fallback: drop city, keep descriptive terms
  const heroFallbackQuery = buildHeroQuery(input, { omitCity: true });
  const heroResultsFinal = heroResults.length > 0
    ? heroResults
    : await fetchPhotos(heroFallbackQuery, 1);

  // Service fallback: if single combined query returned < 3, fetch per-service in parallel
  let serviceResultsFinal = serviceResults;
  if (serviceResults.length < 3) {
    const perServiceResults = await Promise.all(
      parsed.services.slice(0, 6).map(sv =>
        fetchPhotos(`${sv.title} ${input.category.split("/")[0].trim()}`, 1)
      )
    );
    const perService = perServiceResults.map(r => r[0]).filter((u): u is string => !!u);
    if (perService.length > serviceResults.length) serviceResultsFinal = perService;
  }

  console.log(`[photos] hero query="${heroQuery}" → ${heroResults.length} results, fallback=${heroFallbackQuery}`);
  console.log(`[photos] service query="${serviceQuery}" → ${serviceResultsFinal.length} results:`, serviceResultsFinal);

  // Fall back to the static table when the API key is absent or returns nothing
  const exactPhotos = CATEGORY_PHOTOS[input.category];
  const fuzzyPhotos = exactPhotos ? null : Object.entries(CATEGORY_PHOTOS).find(([key]) => {
    const cat = input.category.toLowerCase();
    return key.toLowerCase().split(/[\s/,]+/).some((word) => word.length > 3 && cat.includes(word));
  });
  const staticPhotos = exactPhotos ?? fuzzyPhotos?.[1] ?? DEFAULT_PHOTOS;

  const heroPhoto     = heroResultsFinal[0]  ?? staticPhotos.hero;
  const servicePhotos = serviceResultsFinal.length >= 3
    ? serviceResultsFinal
    : staticPhotos.services;

  const photoSource = heroResultsFinal.length
    ? (heroResultsFinal[0].includes("pexels") ? "pexels" : heroResultsFinal[0].includes("pixabay") ? "pixabay" : "unsplash")
    : "static";
  console.log(`[photos] using: hero=${heroPhoto} source=${photoSource}`);

  const site: GeneratedSite = {
    ...parsed,
    layout,
    colorScheme,
    heroPhoto,
    servicePhotos,
    trustPoints: parsed.trustPoints ?? [],
  };

  console.log(
    `[AI] "${input.businessName}" | layout=${layout} | ` +
    `${response.provider}/${response.model} | ` +
    `$${response.estimatedCost?.toFixed(5)} | ` +
    `${response.inputTokens}in/${response.outputTokens}out`
  );

  return site;
}

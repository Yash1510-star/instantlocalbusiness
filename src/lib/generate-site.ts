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
  description: string;
  services?: string;
  hours?: string;
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
export type LayoutVariant = "hospitality" | "service" | "wellness" | "professional";

export type ColorScheme = {
  primary: string;    // Tailwind bg class e.g. "bg-orange-600"
  primaryHover: string;
  primaryText: string;
  accent: string;     // Tailwind text class
  heroBg: string;     // Tailwind bg for hero
  navBg: string;
  badge: string;      // Tailwind classes for trust badge pill
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
  "Pet Grooming": {
    layout: "wellness",
    colorScheme: {
      primary: "bg-pink-500", primaryHover: "hover:bg-pink-600",
      primaryText: "text-white", accent: "text-pink-400",
      heroBg: "bg-neutral-950", navBg: "bg-neutral-950/90",
      badge: "bg-pink-500/20 text-pink-300 border border-pink-500/30",
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
    layout: "professional",
    colorScheme: {
      primary: "bg-neutral-800", primaryHover: "hover:bg-neutral-900",
      primaryText: "text-white", accent: "text-neutral-300",
      heroBg: "bg-black", navBg: "bg-black/90",
      badge: "bg-neutral-700/50 text-neutral-300 border border-neutral-600",
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

// ─── Unsplash photo IDs per category ─────────────────────────────────────────

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
  "Auto Repair": {
    hero: "photo-1487754180451-c456f719a1fc",
    services: ["photo-1530046339160-ce3e530c7d2f","photo-1489824904134-891ab64532f1","photo-1492144534655-ae79c964c9d7","photo-1486262715619-67b85e0b08d3","photo-1599586120429-048bcd2564da","photo-1558618666-fcd25c85cd64"],
  },
  "Hair Salon / Barbershop": {
    hero: "photo-1560066984-138daaa938e4",
    services: ["photo-1522337360788-8b13dee7a37e","photo-1562322140-8baeececf3df","photo-1595476108010-b4d1f102b1b1","photo-1605497788044-5a32c7078486","photo-1503951914875-452162b0f3f1","photo-1521590832167-7bcbfaa6381f"],
  },
  "Dental Office": {
    hero: "photo-1606811971618-4486d14f3f99",
    services: ["photo-1606811971618-4486d14f3f99","photo-1588776814546-1ffcf47267a5","photo-1598256989800-fe5f95da9787","photo-1607613009820-a29f7bb81c04","photo-1609840114035-3c981b782dfe","photo-1629909615957-be38d48fbbe4"],
  },
  "Gym / Fitness Studio": {
    hero: "photo-1534438327276-14e5300c3a48",
    services: ["photo-1571019613454-1cb2f99b2d8b","photo-1599058945522-28d584b6f0ff","photo-1517836357463-d25dfeac3438","photo-1549476464-37392f717541","photo-1540497077202-7c8a3999166f","photo-1583454110551-21f2fa2afe61"],
  },
  "Law Firm": {
    hero: "photo-1589829545856-d10d557cf95f",
    services: ["photo-1436564989037-b4ebbbde7e33","photo-1450101499163-c8848c66ca85","photo-1453945619913-79ec89a82c51","photo-1521587760476-6c12a4b040da","photo-1589578527966-fdac0f44566c","photo-1554469384-e58fac16e23a"],
  },
  "Landscaping": {
    hero: "photo-1416879595882-3373a0480b5b",
    services: ["photo-1558904541-efa843a96f01","photo-1416879595882-3373a0480b5b","photo-1585320806297-9794b3e4edd0","photo-1593756796186-318e7cedc18e","photo-1587049352851-8d4e89133924","photo-1621621698581-fd8a5b6c5c04"],
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

function buildPrompt(input: BusinessInput): string {
  const { layout } = getCategoryConfig(input.category);

  const layoutGuidance: Record<LayoutVariant, string> = {
    hospitality: "Focus on appetite appeal, ambiance, and experience. CTAs should be 'Order Now', 'Reserve a Table', 'View Menu'. Trust points emphasize freshness, local ingredients, family recipes.",
    service:     "Focus on reliability, speed, and expertise. CTAs should be 'Get a Free Quote', 'Call Now', 'Book Online'. Trust points emphasize 24/7 availability, licensed/insured, fast response.",
    wellness:    "Focus on transformation, care, and results. CTAs should be 'Book Now', 'Schedule Appointment', 'Get Started'. Trust points emphasize certified staff, gentle approach, proven results.",
    professional: "Focus on expertise, trust, and outcomes. CTAs should be 'Free Consultation', 'Talk to an Expert', 'Get Started'. Trust points emphasize years of experience, credentials, client outcomes.",
  };

  return `Create complete website copy for this local business:

Business Name: ${input.businessName}
Category: ${input.category}
Location: ${input.city}, ${input.state}
Phone: ${input.phone}
Email: ${input.email}
Address: ${input.address || `${input.city}, ${input.state}`}
Description: ${input.description}
Services/Menu: ${input.services || "Not specified"}
Hours: ${input.hours || "Please call for hours"}
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
    throw new Error(`AI returned invalid JSON. Raw: ${response.text.slice(0, 300)}`);
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

  const exactPhotos = CATEGORY_PHOTOS[input.category];
  const fuzzyPhotos = exactPhotos ? null : Object.entries(CATEGORY_PHOTOS).find(([key]) => {
    const cat = input.category.toLowerCase();
    return key.toLowerCase().split(/[\s/,]+/).some((word) => word.length > 3 && cat.includes(word));
  });
  const photos = exactPhotos ?? fuzzyPhotos?.[1] ?? DEFAULT_PHOTOS;

  const site: GeneratedSite = {
    ...parsed,
    layout,
    colorScheme,
    heroPhoto: photos.hero,
    servicePhotos: photos.services,
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

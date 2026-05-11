"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Monitor,
  Tablet,
  Smartphone,
  CheckCircle2,
  Edit3,
  Globe,
  Share2,
  ArrowRight,
  Phone,
  MapPin,
  Clock,
  Star,
} from "lucide-react";

const deviceWidths: Record<string, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

// ─── Business template data ──────────────────────────────────────────────────

type BusinessTemplate = {
  name: string;
  tagline: string;
  description: string;
  heroLabel: string;
  primaryCta: string;
  secondaryCta: string;
  phone: string;
  address: string;
  hours: string;
  navLinks: string[];
  services: { title: string; desc: string }[];
  ctaHeading: string;
  ctaBody: string;
  ctaButtonLabel: string;
  ctaInputPlaceholder: string;
  accentBg: string;
  accentText: string;
  accentButton: string;
  accentBadge: string;
  /** Unsplash photo ID for the hero background */
  heroPhoto: string;
  /** Unsplash photo IDs for service cards (at least 3) */
  servicePhotos: string[];
  rating?: { score: string; count: string };
  highlightStats?: { value: string; label: string }[];
};

const TEMPLATES: Record<string, BusinessTemplate> = {
  "marias-tacos": {
    name: "Maria's Tacos",
    tagline: "Authentic Mexican Street Food",
    description:
      "Family recipes passed down for three generations. Fresh tortillas made daily, slow-braised meats, and house-made salsas.",
    heroLabel: "Open for Dine-in & Takeout",
    primaryCta: "View Our Menu",
    secondaryCta: "Order Online",
    phone: "(512) 555-0192",
    address: "2418 S Congress Ave, Austin, TX 78704",
    hours: "Mon–Sat 10am–10pm · Sun 10am–8pm",
    navLinks: ["Menu", "Catering", "About", "Find Us"],
    services: [
      { title: "Street Tacos", desc: "Carne asada, al pastor, barbacoa, or fish — $4 each, 3 for $10." },
      { title: "Breakfast Burritos", desc: "Served daily until noon. Egg, chorizo, potato, and cheese." },
      { title: "Catering", desc: "Taco bars for 20–500 guests. Weddings, corporate events, parties." },
      { title: "Margaritas", desc: "Frozen or on the rocks. Classic, mango, or strawberry." },
      { title: "Family Meals", desc: "Feeds 4–6. Choice of protein, rice, beans, and tortillas." },
      { title: "Vegetarian Options", desc: "Grilled veggie, bean & cheese, and soyrizo tacos available." },
    ],
    ctaHeading: "Hungry? Order now or reserve a table.",
    ctaBody: "Call us or drop in — we save seats for walk-ins. Catering quotes within 2 hours.",
    ctaButtonLabel: "Call to Order",
    ctaInputPlaceholder: "Number of guests",
    accentBg: "bg-orange-50",
    accentText: "text-orange-700",
    accentButton: "bg-orange-600 hover:bg-orange-700 text-white",
    accentBadge: "bg-orange-100 text-orange-700",
    heroPhoto: "photo-1565299585323-38d6b0865b47", // colorful tacos
    servicePhotos: [
      "photo-1552332386-f8dd00dc2f85", // taco close-up
      "photo-1640719028782-8230f1bdc45e", // burrito
      "photo-1514190051997-0f6f39ca5cde", // margarita
      "photo-1565958011703-44f9829ba187", // family food spread
      "photo-1498837167922-ddd27525d352", // fresh veggies
      "photo-1504674900247-0877df9cc836", // food table
    ],
    rating: { score: "4.9", count: "1,204 reviews" },
    highlightStats: [
      { value: "3 gen", label: "Family owned" },
      { value: "Daily", label: "Fresh tortillas" },
      { value: "$4", label: "Starting price" },
    ],
  },

  "lakeside-plumbing": {
    name: "Lakeside Plumbing",
    tagline: "24/7 Emergency Plumbing",
    description:
      "Licensed, insured, and available around the clock. Serving Denver and the greater metro area since 2004.",
    heroLabel: "Available 24/7 — No Extra Charge",
    primaryCta: "Call Now — We Answer 24/7",
    secondaryCta: "Get a Free Quote",
    phone: "(720) 555-0341",
    address: "Serving Denver & Surrounding Areas, CO",
    hours: "24 hours a day, 7 days a week",
    navLinks: ["Services", "Emergency", "Reviews", "Contact"],
    services: [
      { title: "Emergency Repairs", desc: "Burst pipes, leaks, and flooding — we're there in under an hour." },
      { title: "Water Heater Install", desc: "Same-day replacement. Tank and tankless options available." },
      { title: "Drain Cleaning", desc: "Hydro-jetting and snake service for clogs of any size." },
      { title: "Pipe Replacement", desc: "Full repiping with minimal wall damage and a 10-year warranty." },
      { title: "Fixture Installation", desc: "Faucets, toilets, showers, and sinks installed right the first time." },
      { title: "Sewer Line Service", desc: "Camera inspection, repair, and replacement for main sewer lines." },
    ],
    ctaHeading: "Plumbing emergency? Don't wait.",
    ctaBody: "We answer every call — no voicemail, no hold music. Licensed plumbers on standby.",
    ctaButtonLabel: "Call (720) 555-0341",
    ctaInputPlaceholder: "Describe your issue",
    accentBg: "bg-blue-50",
    accentText: "text-blue-700",
    accentButton: "bg-blue-600 hover:bg-blue-700 text-white",
    accentBadge: "bg-blue-100 text-blue-700",
    heroPhoto: "photo-1585771724684-38269d6639fd", // plumber working under sink
    servicePhotos: [
      "photo-1504328345606-18bbc8c9d7d1", // burst pipe
      "photo-1581094794329-c8112a89af12", // water heater
      "photo-1607472586893-edb57bdc0e39", // drain
      "photo-1558618666-fcd25c85cd64", // pipes
      "photo-1556909114-f6e7ad7d3136", // kitchen faucet
      "photo-1504328345606-18bbc8c9d7d1", // sewer
    ],
    rating: { score: "4.8", count: "892 reviews" },
    highlightStats: [
      { value: "<1hr", label: "Response time" },
      { value: "20yr", label: "In business" },
      { value: "100%", label: "Licensed & insured" },
    ],
  },

  "glow-salon": {
    name: "Glow Salon",
    tagline: "Color. Cuts. Confidence.",
    description:
      "Atlanta's premier full-service salon. Expert colorists, precision cuts, and luxury treatments in a welcoming studio.",
    heroLabel: "Now Booking — Same Week Appointments",
    primaryCta: "Book an Appointment",
    secondaryCta: "See Our Work",
    phone: "(404) 555-0287",
    address: "811 N Highland Ave NE, Atlanta, GA 30306",
    hours: "Tue–Sat 9am–7pm · Sun 10am–5pm",
    navLinks: ["Services", "Gallery", "Team", "Book Now"],
    services: [
      { title: "Color & Highlights", desc: "Balayage, ombré, babylights, and full color by certified colorists." },
      { title: "Precision Cuts", desc: "Haircuts for all textures and lengths. Complimentary consultation." },
      { title: "Keratin Treatment", desc: "Smooth, frizz-free results that last 3–5 months." },
      { title: "Blowout", desc: "Sleek or voluminous — ready in 45 minutes." },
      { title: "Bridal Packages", desc: "Full wedding party services with on-site availability." },
      { title: "Deep Conditioning", desc: "Restore shine and health with our signature moisture treatment." },
    ],
    ctaHeading: "Ready for your best hair day?",
    ctaBody: "Book online in seconds or call us. New clients always welcome. Free consultation included.",
    ctaButtonLabel: "Book Online Now",
    ctaInputPlaceholder: "Your preferred date & service",
    accentBg: "bg-pink-50",
    accentText: "text-pink-700",
    accentButton: "bg-pink-600 hover:bg-pink-700 text-white",
    accentBadge: "bg-pink-100 text-pink-700",
    heroPhoto: "photo-1560066984-138dadb4c035", // salon interior with warm lighting
    servicePhotos: [
      "photo-1522337360788-8b13dee7a37e", // hair coloring
      "photo-1595476108010-b4d1f102b1b1", // haircut
      "photo-1527799820374-87f0aa68e2e8", // keratin treatment
      "photo-1487412947147-5cebf100ffc2", // blowout
      "photo-1519741497674-611481863552", // bridal hair
      "photo-1596704017254-9b121068fb31", // conditioning treatment
    ],
    rating: { score: "5.0", count: "2,011 reviews" },
    highlightStats: [
      { value: "12+", label: "Stylists on staff" },
      { value: "Same wk", label: "Appointments" },
      { value: "Free", label: "Consultation" },
    ],
  },

  "whitfield-electric": {
    name: "Whitfield Electric",
    tagline: "Licensed Electrical Contractors",
    description:
      "Residential and commercial electrical services done safely, on time, and on budget. Serving Phoenix since 2008.",
    heroLabel: "Same-Day Service Available",
    primaryCta: "Get a Free Estimate",
    secondaryCta: "Our Services",
    phone: "(602) 555-0156",
    address: "Serving Greater Phoenix, AZ",
    hours: "Mon–Fri 7am–6pm · Sat 8am–4pm",
    navLinks: ["Residential", "Commercial", "Emergency", "Contact"],
    services: [
      { title: "Panel Upgrades", desc: "200A service upgrades to support EV chargers and modern loads." },
      { title: "EV Charger Install", desc: "Level 2 home chargers installed and permitted in one day." },
      { title: "Rewiring", desc: "Knob-and-tube and aluminum wiring replaced to code." },
      { title: "Outlet & Switch Repair", desc: "GFCI, USB, smart switch installs — same day available." },
      { title: "Lighting Design", desc: "Recessed, landscape, and smart lighting throughout your home." },
      { title: "Commercial Build-Out", desc: "Tenant improvements, new construction wiring, inspections." },
    ],
    ctaHeading: "Need an electrician you can trust?",
    ctaBody: "All work fully permitted and warranted. Free estimates on any job. No call-out fee.",
    ctaButtonLabel: "Request Free Estimate",
    ctaInputPlaceholder: "Describe the job",
    accentBg: "bg-yellow-50",
    accentText: "text-yellow-800",
    accentButton: "bg-yellow-500 hover:bg-yellow-600 text-gray-900",
    accentBadge: "bg-yellow-100 text-yellow-800",
    heroPhoto: "photo-1621905251189-08b45d6a269e", // electrician working on panel
    servicePhotos: [
      "photo-1558618666-fcd25c85cd64", // electrical panel
      "photo-1593941707882-a5bba14938c7", // EV charger
      "photo-1565008447742-97f6f38c985c", // wiring
      "photo-1616763355548-1b606f439f86", // outlet repair
      "photo-1565538810643-b5bdb714032a", // recessed lighting
      "photo-1504328345606-18bbc8c9d7d1", // commercial work
    ],
    rating: { score: "4.9", count: "613 reviews" },
    highlightStats: [
      { value: "16yr", label: "In business" },
      { value: "Same day", label: "Available" },
      { value: "Free", label: "Estimates" },
    ],
  },

  "paws-and-play": {
    name: "Paws & Play Grooming",
    tagline: "Spa-Style Grooming for Happy Pets",
    description:
      "Gentle, stress-free grooming for dogs and cats of all breeds. Certified groomers who treat every pet like their own.",
    heroLabel: "Walk-Ins Welcome — Appointments Preferred",
    primaryCta: "Book a Grooming Session",
    secondaryCta: "View Packages",
    phone: "(206) 555-0473",
    address: "3224 Eastlake Ave E, Seattle, WA 98102",
    hours: "Mon–Sat 8am–6pm · Sun 9am–4pm",
    navLinks: ["Services", "Gallery", "Pricing", "Book Now"],
    services: [
      { title: "Bath & Brush", desc: "Full wash, blow-dry, and brush-out for any coat type." },
      { title: "Full Groom", desc: "Breed-specific styling with bath, trim, nails, and ear cleaning." },
      { title: "Nail Trim & File", desc: "Quick 15-minute appointment. No full groom needed." },
      { title: "De-Shedding Treatment", desc: "Reduce shedding by up to 90% with our FURminator treatment." },
      { title: "Cat Grooming", desc: "Specialized handling for cats. Lion cuts and sanitary trims." },
      { title: "Puppy's First Groom", desc: "A gentle intro to grooming — calm environment, lots of treats." },
    ],
    ctaHeading: "Your pet deserves the best.",
    ctaBody: "Book online or call us. We send a photo update when your furry friend is ready.",
    ctaButtonLabel: "Book Online",
    ctaInputPlaceholder: "Your pet's name & breed",
    accentBg: "bg-green-50",
    accentText: "text-green-700",
    accentButton: "bg-green-600 hover:bg-green-700 text-white",
    accentBadge: "bg-green-100 text-green-700",
    heroPhoto: "photo-1587300003388-59208cc962cb", // happy groomed golden retriever
    servicePhotos: [
      "photo-1548199973-03cce0bbc87b", // dogs being bathed
      "photo-1583511655857-d19b40a7a54e", // dog being groomed
      "photo-1601758228041-f3b2795255f1", // dog nail trim
      "photo-1477884213360-7e9d7dcc1e48", // fluffy dog after groom
      "photo-1519052537078-e6302a4968d4", // cat grooming
      "photo-1530281700549-e82e7bf110d6", // puppy
    ],
    rating: { score: "4.9", count: "1,847 reviews" },
    highlightStats: [
      { value: "All breeds", label: "Welcome" },
      { value: "Photo", label: "Updates sent" },
      { value: "Certified", label: "Groomers" },
    ],
  },

  "fuentes-auto": {
    name: "Fuentes Auto Repair",
    tagline: "Honest Auto Repair You Can Count On",
    description:
      "ASE-certified technicians, transparent pricing, and same-day service on most repairs. Family owned since 1997.",
    heroLabel: "Free Diagnostics — No Surprises",
    primaryCta: "Schedule Service",
    secondaryCta: "Get a Quote",
    phone: "(305) 555-0218",
    address: "7801 SW 40th St, Miami, FL 33155",
    hours: "Mon–Fri 7:30am–6pm · Sat 8am–3pm",
    navLinks: ["Services", "Specials", "Reviews", "Schedule"],
    services: [
      { title: "Oil Change & Tune-Up", desc: "Conventional or synthetic oil with multi-point inspection. $29.99+" },
      { title: "Brake Service", desc: "Pads, rotors, and fluid flush. Free brake inspection always." },
      { title: "AC Repair", desc: "Recharge, leak detection, and compressor replacement." },
      { title: "Transmission Service", desc: "Fluid change, rebuild, and replacement with warranty." },
      { title: "Engine Diagnostics", desc: "Check engine light? We find the real cause — not just the code." },
      { title: "Tires & Alignment", desc: "Major brands at competitive prices. Lifetime rotation included." },
    ],
    ctaHeading: "Bring your car in — we'll treat it right.",
    ctaBody: "Free loaner cars on major repairs. Written estimates before any work begins. No surprises.",
    ctaButtonLabel: "Schedule Today",
    ctaInputPlaceholder: "Year, make & model",
    accentBg: "bg-gray-900",
    accentText: "text-gray-100",
    accentButton: "bg-red-600 hover:bg-red-700 text-white",
    accentBadge: "bg-gray-700 text-gray-100",
    heroPhoto: "photo-1625047509248-ec889cbff17f", // mechanic under car hood
    servicePhotos: [
      "photo-1487754180451-c456f719a1fc", // oil change
      "photo-1558618666-fcd25c85cd64", // brakes
      "photo-1460925895917-afdab827c52f", // car AC
      "photo-1609630875171-b1321377ee65", // transmission
      "photo-1476231682828-37e571bc172f", // engine check
      "photo-1558981852-426c048eb903", // tire change
    ],
    rating: { score: "4.8", count: "2,390 reviews" },
    highlightStats: [
      { value: "27yr", label: "Family owned" },
      { value: "ASE", label: "Certified techs" },
      { value: "Free", label: "Diagnostics" },
    ],
  },

  "summit-fitness": {
    name: "Summit Fitness",
    tagline: "Train Smarter. Live Better.",
    description:
      "Personal training, small group classes, and nutrition coaching in a supportive, results-driven community.",
    heroLabel: "Free 7-Day Trial — No Commitment",
    primaryCta: "Start Free Trial",
    secondaryCta: "View Class Schedule",
    phone: "(303) 555-0394",
    address: "1850 30th St, Boulder, CO 80301",
    hours: "Mon–Fri 5am–10pm · Sat–Sun 6am–8pm",
    navLinks: ["Classes", "Personal Training", "Nutrition", "Join"],
    services: [
      { title: "Personal Training", desc: "1-on-1 sessions with certified trainers. Custom programs for your goals." },
      { title: "Group Classes", desc: "HIIT, yoga, spin, strength, and mobility — 40+ classes per week." },
      { title: "Nutrition Coaching", desc: "Personalized meal planning and macros from registered dietitians." },
      { title: "Open Gym", desc: "State-of-the-art equipment, cardio deck, and free weight area." },
      { title: "Body Composition", desc: "Monthly InBody scans to track real progress beyond the scale." },
      { title: "Corporate Wellness", desc: "Group packages for local businesses and remote teams." },
    ],
    ctaHeading: "Your strongest self starts here.",
    ctaBody: "Try 7 days free — no credit card, no commitment. Cancel anytime. Real results, real community.",
    ctaButtonLabel: "Claim Free 7-Day Trial",
    ctaInputPlaceholder: "Your fitness goal",
    accentBg: "bg-purple-50",
    accentText: "text-purple-700",
    accentButton: "bg-purple-600 hover:bg-purple-700 text-white",
    accentBadge: "bg-purple-100 text-purple-700",
    heroPhoto: "photo-1534438327276-14e5300c3a48", // modern gym interior
    servicePhotos: [
      "photo-1571019614242-c5c5dee9f50b", // personal training
      "photo-1518611012118-696072aa579a", // group fitness class
      "photo-1490645935967-10de6ba17061", // nutrition coaching / meal prep
      "photo-1583454110551-21f2fa2afe61", // open gym weights
      "photo-1517836357463-d25dfeac3438", // body composition / fitness
      "photo-1573497620053-ea5300f94f21", // corporate wellness
    ],
    rating: { score: "4.9", count: "3,102 reviews" },
    highlightStats: [
      { value: "40+", label: "Classes/week" },
      { value: "Free", label: "7-day trial" },
      { value: "RD", label: "Nutrition coaching" },
    ],
  },

  "bloom-florist": {
    name: "Bloom Florist",
    tagline: "Fresh Flowers for Every Moment",
    description:
      "Hand-arranged bouquets and installations for weddings, events, sympathy, and everyday gifting. Local delivery available.",
    heroLabel: "Same-Day Local Delivery",
    primaryCta: "Shop Arrangements",
    secondaryCta: "Request Wedding Quote",
    phone: "(615) 555-0561",
    address: "1204 Gallatin Ave, Nashville, TN 37206",
    hours: "Mon–Sat 9am–6pm · Sun 10am–4pm",
    navLinks: ["Shop", "Weddings", "Events", "Delivery"],
    services: [
      { title: "Fresh Bouquets", desc: "Seasonal arrangements starting at $35. Pick up or local delivery." },
      { title: "Wedding Florals", desc: "Bridal bouquets, centerpieces, ceremony arches, and boutonnières." },
      { title: "Event Installations", desc: "Corporate events, galas, and brand activations with floral décor." },
      { title: "Sympathy & Funerals", desc: "Tasteful tributes arranged with care and delivered promptly." },
      { title: "Plants & Gifts", desc: "Potted plants, succulents, and curated gift baskets." },
      { title: "Subscriptions", desc: "Weekly or bi-weekly fresh flower delivery to your home or office." },
    ],
    ctaHeading: "Send flowers someone will actually love.",
    ctaBody:
      "Order by 2pm for same-day delivery. Custom requests welcome. Wedding consultations free.",
    ctaButtonLabel: "Order Flowers Now",
    ctaInputPlaceholder: "Occasion & delivery date",
    accentBg: "bg-rose-50",
    accentText: "text-rose-700",
    accentButton: "bg-rose-500 hover:bg-rose-600 text-white",
    accentBadge: "bg-rose-100 text-rose-700",
    heroPhoto: "photo-1487530811015-6780fb4f3df2", // beautiful colorful flower shop
    servicePhotos: [
      "photo-1561181286-d3f6a14498e0", // bouquet
      "photo-1519225421980-715cb0215aed", // wedding flowers
      "photo-1467810563316-b5476525c0f9", // event floral installation
      "photo-1490750967868-88df5691cc2d", // sympathy arrangement
      "photo-1416879595882-3373a0480b5b", // potted plants
      "photo-1558618666-fcd25c85cd64", // flower subscription
    ],
    rating: { score: "4.9", count: "988 reviews" },
    highlightStats: [
      { value: "Same day", label: "Delivery" },
      { value: "Free", label: "Consultations" },
      { value: "$35+", label: "Starting price" },
    ],
  },

  "park-avenue-dental": {
    name: "Park Avenue Dental",
    tagline: "Comfortable, Comprehensive Dental Care",
    description:
      "Family and cosmetic dentistry in a welcoming, anxiety-free environment. Accepting new patients.",
    heroLabel: "Accepting New Patients — Most Insurance Welcome",
    primaryCta: "Book an Appointment",
    secondaryCta: "New Patient Special",
    phone: "(312) 555-0749",
    address: "875 N Michigan Ave, Suite 400, Chicago, IL 60611",
    hours: "Mon–Thu 8am–5pm · Fri 8am–3pm · Sat by appointment",
    navLinks: ["Services", "Insurance", "New Patients", "Book"],
    services: [
      { title: "Cleanings & X-Rays", desc: "Comprehensive exams and professional cleanings for the whole family." },
      { title: "Teeth Whitening", desc: "In-office or take-home whitening for results that last up to 2 years." },
      { title: "Invisalign", desc: "Clear aligners for straighter teeth. Free consultation and smile preview." },
      { title: "Crowns & Veneers", desc: "Same-day CEREC crowns. Porcelain veneers for a complete smile makeover." },
      { title: "Dental Implants", desc: "Permanent tooth replacement that looks and feels completely natural." },
      { title: "Emergency Dentistry", desc: "Same-day appointments for pain, chips, and dental emergencies." },
    ],
    ctaHeading: "New patients welcome. No wait, no hassle.",
    ctaBody:
      "New patient special: $79 exam, X-rays, and cleaning. Most insurance billed directly. Online booking available.",
    ctaButtonLabel: "Book Your Appointment",
    ctaInputPlaceholder: "Preferred date & time",
    accentBg: "bg-teal-50",
    accentText: "text-teal-700",
    accentButton: "bg-teal-600 hover:bg-teal-700 text-white",
    accentBadge: "bg-teal-100 text-teal-700",
    heroPhoto: "photo-1606811841689-23dfddce3e95", // bright modern dental office
    servicePhotos: [
      "photo-1588776814546-1ffbb20a41e1", // dental cleaning
      "photo-1598256989706-4e17e9ce26ac", // teeth whitening
      "photo-1609840114035-3c981b782dfe", // Invisalign
      "photo-1584515933487-779824d29309", // dental crown
      "photo-1559757148-5c350d0d3c56", // dental implant
      "photo-1580489944761-15a19d654956", // emergency dental
    ],
    rating: { score: "4.9", count: "1,556 reviews" },
    highlightStats: [
      { value: "$79", label: "New patient special" },
      { value: "Same day", label: "Emergency care" },
      { value: "0%", label: "Financing available" },
    ],
  },
};

// Fallback for unknown slugs (e.g. from the /build flow)
function buildFallbackTemplate(slug: string): BusinessTemplate {
  const name = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    name,
    tagline: "Professional Local Services",
    description:
      "Locally owned and operated. Committed to quality service and your complete satisfaction.",
    heroLabel: "Serving our community",
    primaryCta: "Get a Free Quote",
    secondaryCta: "Learn More",
    phone: "(555) 555-5555",
    address: "Your City, Your State",
    hours: "Mon–Fri 9am–6pm",
    navLinks: ["About", "Services", "Contact"],
    services: [
      { title: "Our Core Service", desc: "Professional, high-quality work delivered on time and on budget." },
      { title: "Consultations", desc: "Free consultations for all new clients. No pressure, just answers." },
      { title: "Custom Solutions", desc: "Every project is different. We tailor our approach to fit your needs." },
    ],
    ctaHeading: "Ready to get started?",
    ctaBody: "Contact us today for a free quote. We respond to all inquiries within one business day.",
    ctaButtonLabel: "Contact Us",
    ctaInputPlaceholder: "How can we help?",
    accentBg: "bg-blue-50",
    accentText: "text-blue-700",
    accentButton: "bg-blue-600 hover:bg-blue-700 text-white",
    accentBadge: "bg-blue-100 text-blue-700",
    heroPhoto: "photo-1497366216548-37526070297c",
    servicePhotos: [
      "photo-1497366754035-f200968a6e72",
      "photo-1600880292203-757bb62b4baf",
      "photo-1521791136064-7986c2920216",
    ],
  };
}

// ─── Preview shell ────────────────────────────────────────────────────────────

import type { GeneratedSite } from "@/lib/generate-site";

export function SitePreview({ slug }: { slug: string }) {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [published, setPublished] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [aiSite, setAiSite] = useState<GeneratedSite | null>(null);

  // Static template fallback (for examples/demo pages)
  const staticTemplate = TEMPLATES[slug] ?? buildFallbackTemplate(slug);

  // Load AI-generated content from sessionStorage after hydration
  useEffect(() => {
    const stored = sessionStorage.getItem(`site_${slug}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as GeneratedSite;
        setAiSite(parsed);
        sessionStorage.removeItem(`site_${slug}`);
      } catch {
        // fall back to static template
      }
    }
  }, [slug]);

  // Display name for toolbar
  const displayName = aiSite
    ? slug.replace(/-\d{10,}$/, "").split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : staticTemplate.name;

  const handlePublish = async () => {
    if (!aiSite) return;
    setPublishing(true);
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site: aiSite,
          businessName: displayName,
          businessEmail: aiSite.email,
          city: aiSite.address,
          plan: "starter",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Publish failed");
      setPublishedUrl(data.url);
      setPublished(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Publish failed. Please try again.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-bold text-white">
              InstantLocal<span className="text-blue-400">Business</span>
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-sm text-gray-300 font-medium truncate max-w-[160px]">
              {displayName}
            </span>
            <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
              {aiSite ? "AI Generated" : "Demo"}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-gray-700 rounded-lg p-1">
            {(["desktop", "tablet", "mobile"] as const).map((d) => {
              const Icon =
                d === "desktop" ? Monitor : d === "tablet" ? Tablet : Smartphone;
              return (
                <button
                  key={d}
                  onClick={() => setDevice(d)}
                  className={`p-1.5 rounded transition-colors ${
                    device === d
                      ? "bg-gray-900 text-white"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                  title={d}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white border border-gray-600 hover:border-gray-400 px-3 py-1.5 rounded-lg transition-colors">
              <Edit3 size={13} /> Edit
            </button>
            <button className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white border border-gray-600 hover:border-gray-400 px-3 py-1.5 rounded-lg transition-colors">
              <Share2 size={13} /> Share
            </button>
            {published ? (
              <a
                href={publishedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-green-400 font-semibold bg-green-500/20 border border-green-500/30 px-3 py-1.5 rounded-lg hover:bg-green-500/30 transition-colors"
              >
                <Globe size={13} /> View Live Site
              </a>
            ) : (
              <button
                onClick={handlePublish}
                disabled={publishing || !aiSite}
                className="flex items-center gap-1.5 text-xs text-white font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg transition-colors"
              >
                {publishing ? (
                  <><span className="animate-spin">⏳</span> Publishing...</>
                ) : (
                  <><Globe size={13} /> Publish</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {published && publishedUrl && (
        <div className="bg-green-600 text-white text-center py-3 px-4">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <CheckCircle2 size={18} />
            <span className="font-medium text-sm">
              Live at{" "}
              <a
                href={publishedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline hover:text-green-100"
              >
                instantlocalbusiness.com{publishedUrl}
              </a>
            </span>
            <Link
              href="/pricing"
              className="ml-2 text-xs bg-white text-green-700 font-bold px-3 py-1 rounded-full hover:bg-green-50 transition-colors"
            >
              Add custom domain →
            </Link>
          </div>
        </div>
      )}

      {/* Preview frame */}
      <div className="flex items-start justify-center p-6 pb-24">
        <div
          className="bg-white rounded-xl overflow-hidden transition-all duration-300"
          style={{ width: deviceWidths[device], maxWidth: "100%", minHeight: 600 }}
        >
          {aiSite ? (
            <AISiteRenderer site={aiSite} compact={device === "mobile"} />
          ) : (
            <MockWebsite template={staticTemplate} compact={device === "mobile"} />
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-white font-semibold text-sm">Happy with your site?</p>
            <p className="text-gray-400 text-xs mt-0.5">
              Upgrade to Pro to add a custom domain, booking forms, and more.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/build"
              className="text-xs text-gray-400 hover:text-white border border-gray-600 px-3 py-2 rounded-lg transition-colors"
            >
              Start over
            </Link>
            <Link
              href="/pricing"
              className="flex items-center gap-1.5 text-xs text-white font-semibold bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              Upgrade to Pro <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Unsplash helper ─────────────────────────────────────────────────────────

function unsplash(photoId: string, w: number, h: number) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
}

// ─── Per-business rendered website ───────────────────────────────────────────

// ─── AI Site Renderer ─────────────────────────────────────────────────────────
// Renders fully AI-generated sites with industry-specific layouts

const ICON_MAP: Record<string, React.ReactNode> = {
  wrench: <span className="text-lg">🔧</span>,
  scissors: <span className="text-lg">✂️</span>,
  scale: <span className="text-lg">⚖️</span>,
  heart: <span className="text-lg">❤️</span>,
  utensils: <span className="text-lg">🍽️</span>,
  car: <span className="text-lg">🚗</span>,
  leaf: <span className="text-lg">🌿</span>,
  home: <span className="text-lg">🏠</span>,
  star: <span className="text-lg">⭐</span>,
  shield: <span className="text-lg">🛡️</span>,
  clock: <span className="text-lg">⏰</span>,
  phone: <span className="text-lg">📞</span>,
};

// ─── Shared nav used by all layout renderers ────────────────────────────────
function SiteNav({ site, cs, isLight, compact }: {
  site: GeneratedSite; cs: GeneratedSite["colorScheme"]; isLight: boolean; compact: boolean;
}) {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const navText = isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-300 hover:text-white";
  const businessName = site.heroHeadline.split(":")[0] || "Business";
  return (
    <nav className={`flex items-center justify-between px-6 py-4 border-b ${isLight ? "border-gray-100 bg-white/95" : "border-white/10 " + cs.navBg} backdrop-blur-sm sticky top-0 z-10`}>
      <div>
        <span className={`font-extrabold text-base ${isLight ? "text-gray-900" : "text-white"}`}>{businessName}</span>
        <p className={`text-xs mt-0.5 ${isLight ? "text-gray-400" : "text-gray-400"}`}>{site.tagline}</p>
      </div>
      {!compact && (
        <div className="flex items-center gap-6 text-sm font-medium">
          {[{label:"About",id:"about"},{label:"Services",id:"services"},{label:"Contact",id:"contact"}].map(({label,id}) => (
            <button key={id} onClick={() => scrollTo(id)} className={`transition-colors ${navText}`}>{label}</button>
          ))}
        </div>
      )}
      <button className={`text-xs font-semibold px-4 py-2 rounded-lg ${cs.primary} ${cs.primaryHover} ${cs.primaryText} transition-colors`}>
        {compact ? "Call" : site.primaryCta}
      </button>
    </nav>
  );
}

// ─── HOSPITALITY layout (Restaurants, Cafes, Bakeries, Bars) ────────────────
// Full-bleed food photography, menu-card services, warm atmosphere
function HospitalityLayout({ site, cs, compact }: { site: GeneratedSite; cs: GeneratedSite["colorScheme"]; compact: boolean }) {
  return (
    <div className="font-sans bg-gray-950 text-white">
      <SiteNav site={site} cs={cs} isLight={false} compact={compact} />

      {/* Split hero: full photo left, bold text right */}
      <div className={`grid ${compact ? "grid-cols-1" : "grid-cols-2"} min-h-[420px]`}>
        <div className="relative" style={{ minHeight: compact ? 260 : 420 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={unsplash(site.heroPhoto, 800, 600)} alt="hero" className="w-full h-full object-cover absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-950/80" />
        </div>
        <div className="flex flex-col justify-center px-8 py-10 bg-gray-950">
          <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-5 ${cs.badge} w-fit`}>{site.heroBadge}</span>
          <h1 className="text-3xl font-extrabold text-white leading-tight mb-4">{site.heroHeadline}</h1>
          <p className="text-sm text-gray-300 leading-relaxed mb-6">{site.heroSubheadline}</p>
          <div className="flex gap-3 flex-wrap">
            <button className={`font-bold px-6 py-3 rounded-xl text-sm ${cs.primary} ${cs.primaryText} ${cs.primaryHover}`}>{site.primaryCta}</button>
            <button className="font-semibold px-6 py-3 rounded-xl text-sm border border-white/20 text-white/80 hover:border-white/40">{site.secondaryCta}</button>
          </div>
          {/* Stats inline */}
          <div className="flex gap-6 mt-8">
            {site.stats.map(s => (
              <div key={s.label}>
                <div className={`text-xl font-extrabold ${cs.accent}`}>{s.value}</div>
                <div className="text-xs text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust ticker */}
      <div className={`${cs.primary} ${cs.primaryText} py-2 px-6 flex items-center justify-center gap-6 text-xs font-bold flex-wrap`}>
        {site.trustPoints.map(p => <span key={p} className="flex items-center gap-1"><CheckCircle2 size={11}/> {p}</span>)}
      </div>

      {/* Menu-style service grid */}
      <div id="services" className="px-6 py-12 bg-gray-900">
        <h2 className="text-2xl font-extrabold text-white text-center mb-2">Our Menu</h2>
        <p className="text-sm text-gray-400 text-center mb-8">{site.aboutTitle}</p>
        <div className={`grid gap-4 ${compact ? "grid-cols-1" : "grid-cols-2"}`}>
          {site.services.map((s, i) => (
            <div key={s.title} className="flex gap-4 bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={unsplash(site.servicePhotos[i] ?? site.servicePhotos[0], 160, 160)} alt={s.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white mb-1">{s.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About — atmospheric quote style */}
      <div id="about" className="relative py-16 px-8 text-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={unsplash(site.servicePhotos[2] ?? site.heroPhoto, 1200, 400)} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative max-w-2xl mx-auto">
          <p className={`text-4xl font-serif mb-4 ${cs.accent}`}>&ldquo;</p>
          <h2 className="text-xl font-bold text-white mb-3">{site.aboutTitle}</h2>
          <p className="text-sm text-gray-300 leading-relaxed">{site.aboutBody}</p>
        </div>
      </div>

      {/* Contact + Hours */}
      <div id="contact" className={`grid ${compact ? "grid-cols-1" : "grid-cols-3"} bg-gray-900 divide-y md:divide-y-0 md:divide-x divide-gray-700`}>
        {[{icon:Phone,label:"Reservations",value:site.phone},{icon:MapPin,label:"Find Us",value:site.address},{icon:Clock,label:"Hours",value:site.hours}].map(({icon:Icon,label,value}) => (
          <div key={label} className="flex items-start gap-3 px-6 py-5">
            <Icon size={16} className={`mt-0.5 shrink-0 ${cs.accent}`}/>
            <div><p className="text-xs font-bold text-white">{label}</p><p className="text-xs text-gray-400 mt-0.5">{value}</p></div>
          </div>
        ))}
      </div>

      {/* CTA — booking form */}
      <div className={`px-8 py-12 ${cs.primary} text-center`}>
        <h2 className={`text-xl font-extrabold mb-2 ${cs.primaryText}`}>{site.ctaHeading}</h2>
        <p className={`text-sm mb-6 opacity-80 ${cs.primaryText}`}>{site.ctaBody}</p>
        <div className="max-w-sm mx-auto space-y-3">
          <input placeholder="Your name" className="w-full px-4 py-2.5 rounded-lg text-sm text-gray-800 bg-white" readOnly />
          <input placeholder={site.ctaFormPlaceholder} className="w-full px-4 py-2.5 rounded-lg text-sm text-gray-800 bg-white" readOnly />
          <button className="w-full font-bold py-3 rounded-lg text-sm bg-gray-900 text-white hover:bg-gray-800">{site.ctaButtonLabel}</button>
        </div>
      </div>

      <div className="px-6 py-6 bg-gray-950 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} {site.heroHeadline.split(":")[0]}. All rights reserved. <span className="text-gray-700">· Powered by InstantLocalBusiness.com</span>
      </div>
    </div>
  );
}

// ─── SERVICE layout (Plumbers, Electricians, Auto, Cleaning) ────────────────
// Huge phone number, emergency badge, trust-forward, quote form prominent
function ServiceLayout({ site, cs, compact }: { site: GeneratedSite; cs: GeneratedSite["colorScheme"]; compact: boolean }) {
  return (
    <div className="font-sans bg-white text-gray-900">
      {/* Emergency top bar */}
      <div className={`${cs.primary} ${cs.primaryText} py-2 px-6 flex items-center justify-center gap-4 text-xs font-bold`}>
        <Phone size={12}/> <span>Call Now: {site.phone}</span>
        <span className="hidden sm:block">·</span>
        <span className="hidden sm:block">{site.trustPoints[0]}</span>
      </div>
      <SiteNav site={site} cs={cs} isLight={true} compact={compact} />

      {/* Hero with huge CTA */}
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={unsplash(site.heroPhoto, 1200, 520)} alt="hero" className="w-full object-cover" style={{height: compact ? 260 : 420}}/>
        <div className="absolute inset-0 bg-black/65"/>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 ${cs.badge}`}>{site.heroBadge}</span>
          <h1 className="text-3xl font-extrabold text-white mb-3 leading-tight">{site.heroHeadline}</h1>
          <p className="text-sm text-white/80 mb-6 max-w-lg">{site.heroSubheadline}</p>
          {/* Big phone CTA */}
          <div className={`inline-flex items-center gap-3 ${cs.primary} ${cs.primaryText} font-extrabold text-xl px-8 py-4 rounded-2xl mb-3`}>
            <Phone size={20}/> {site.phone}
          </div>
          <p className="text-xs text-white/60">{site.secondaryCta} — Free estimates</p>
        </div>
      </div>

      {/* Trust badges row */}
      <div className="bg-gray-900 py-4 px-6">
        <div className="flex flex-wrap items-center justify-center gap-6">
          {site.trustPoints.map(p => (
            <div key={p} className="flex items-center gap-2 text-xs font-semibold text-white">
              <CheckCircle2 size={14} className={cs.accent}/> {p}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 border-b border-gray-100">
        {site.stats.map(s => (
          <div key={s.label} className="py-6 text-center border-r last:border-r-0 border-gray-100">
            <div className={`text-2xl font-extrabold ${cs.accent}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Services — list with icons */}
      <div id="services" className="px-6 py-12 bg-gray-50">
        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-2">Our Services</h2>
        <p className="text-sm text-gray-500 text-center mb-8">{site.aboutTitle}</p>
        <div className={`grid gap-4 ${compact ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
          {site.services.map((s, i) => (
            <div key={s.title} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-200 hover:shadow-sm transition-all">
              <div className="flex items-start gap-4">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={unsplash(site.servicePhotos[i] ?? site.servicePhotos[0], 100, 100)} alt={s.title} className="w-full h-full object-cover"/>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {ICON_MAP[s.icon ?? ""] ?? null}
                    <h3 className="font-bold text-sm text-gray-900">{s.title}</h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About + quote form side by side */}
      <div id="about" className={`grid ${compact ? "grid-cols-1" : "grid-cols-2"} gap-0`}>
        <div className="px-8 py-12 bg-gray-900 text-white">
          <h2 className="text-xl font-extrabold mb-4 text-white">{site.aboutTitle}</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-6">{site.aboutBody}</p>
          <div id="contact" className="space-y-3">
            {[{icon:Phone,v:site.phone},{icon:MapPin,v:site.address},{icon:Clock,v:site.hours}].map(({icon:Icon,v}) => (
              <div key={v} className="flex items-center gap-2 text-sm text-gray-300">
                <Icon size={14} className={cs.accent}/> {v}
              </div>
            ))}
          </div>
        </div>
        <div className={`px-8 py-12 ${cs.primary}`}>
          <h3 className={`text-lg font-extrabold mb-4 ${cs.primaryText}`}>{site.ctaHeading}</h3>
          <p className={`text-xs mb-5 opacity-80 ${cs.primaryText}`}>{site.ctaBody}</p>
          <div className="space-y-3">
            <input placeholder="Your name" className="w-full px-4 py-2.5 rounded-lg text-sm text-gray-800 bg-white" readOnly />
            <input placeholder="Phone number" className="w-full px-4 py-2.5 rounded-lg text-sm text-gray-800 bg-white" readOnly />
            <input placeholder={site.ctaFormPlaceholder} className="w-full px-4 py-2.5 rounded-lg text-sm text-gray-800 bg-white" readOnly />
            <button className="w-full font-bold py-3 rounded-lg text-sm bg-gray-900 text-white">{site.ctaButtonLabel}</button>
          </div>
        </div>
      </div>

      <div className="px-6 py-5 bg-gray-900 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} {site.heroHeadline.split(":")[0]}. All rights reserved. · Powered by InstantLocalBusiness.com
      </div>
    </div>
  );
}

// ─── WELLNESS layout (Salons, Dental, Gym, Spa, Pet Grooming) ────────────────
// Clean white, calming, booking-first, before/after, soft colors
function WellnessLayout({ site, cs, compact }: { site: GeneratedSite; cs: GeneratedSite["colorScheme"]; compact: boolean }) {
  const isLight = cs.heroBg.includes("slate-50") || cs.heroBg.includes("white");
  return (
    <div className="font-sans bg-white text-gray-900">
      <SiteNav site={site} cs={cs} isLight={true} compact={compact} />

      {/* Hero — centered with soft overlay */}
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={unsplash(site.heroPhoto, 1200, 520)} alt="hero" className="w-full object-cover" style={{height: compact ? 260 : 440}}/>
        <div className="absolute inset-0 bg-black/40"/>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 bg-white/90 text-gray-800">{site.heroBadge}</span>
          <h1 className="text-3xl font-extrabold text-white leading-tight mb-3 max-w-2xl">{site.heroHeadline}</h1>
          <p className="text-sm text-white/85 mb-6 max-w-lg">{site.heroSubheadline}</p>
          <div className="flex gap-3 flex-wrap justify-center">
            <button className={`font-bold px-8 py-3.5 rounded-full text-sm ${cs.primary} ${cs.primaryText} ${cs.primaryHover}`}>{site.primaryCta}</button>
            <button className="font-semibold px-8 py-3.5 rounded-full text-sm bg-white/20 text-white border border-white/30 hover:bg-white/30">{site.secondaryCta}</button>
          </div>
        </div>
      </div>

      {/* Trust strip — pill badges */}
      <div className="py-5 px-6 bg-white border-b border-gray-100 flex flex-wrap justify-center gap-3">
        {site.trustPoints.map(p => (
          <span key={p} className={`text-xs font-semibold px-3 py-1.5 rounded-full ${cs.badge}`}>{p}</span>
        ))}
      </div>

      {/* Stats — card row */}
      <div className={`grid grid-cols-3 gap-4 px-6 py-8 bg-gray-50`}>
        {site.stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
            <div className={`text-2xl font-extrabold ${cs.accent}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Services — portrait cards, booking focused */}
      <div id="services" className="px-6 py-10">
        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-2">What We Offer</h2>
        <p className="text-sm text-gray-500 text-center mb-8">{site.aboutTitle}</p>
        <div className={`grid gap-5 ${compact ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
          {site.services.map((s, i) => (
            <div key={s.title} className="group rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
              <div className="relative h-40 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={unsplash(site.servicePhotos[i] ?? site.servicePhotos[0], 400, 240)} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm text-gray-900 mb-1">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{s.description}</p>
                <button className={`text-xs font-semibold px-3 py-1.5 rounded-full ${cs.badge}`}>Book Now →</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About — split with photo */}
      <div id="about" className={`grid ${compact ? "grid-cols-1" : "grid-cols-2"} bg-gray-50`}>
        <div className="relative" style={{minHeight: 280}}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={unsplash(site.servicePhotos[1] ?? site.heroPhoto, 600, 400)} alt="about" className="absolute inset-0 w-full h-full object-cover"/>
        </div>
        <div className="px-8 py-10 flex flex-col justify-center">
          <h2 className="text-xl font-extrabold text-gray-900 mb-4">{site.aboutTitle}</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-6">{site.aboutBody}</p>
          <div id="contact" className="space-y-2">
            {[{icon:Phone,v:site.phone},{icon:MapPin,v:site.address},{icon:Clock,v:site.hours}].map(({icon:Icon,v}) => (
              <div key={v} className="flex items-center gap-2 text-sm text-gray-500">
                <Icon size={14} className={cs.accent}/> {v}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA — booking banner */}
      <div className={`px-8 py-12 text-center ${cs.primary}`}>
        <h2 className={`text-xl font-extrabold mb-2 ${cs.primaryText}`}>{site.ctaHeading}</h2>
        <p className={`text-sm opacity-80 mb-6 ${cs.primaryText}`}>{site.ctaBody}</p>
        <div className="max-w-sm mx-auto flex gap-3">
          <input placeholder="Your name or number" className="flex-1 px-4 py-3 rounded-xl text-sm text-gray-800 bg-white" readOnly/>
          <button className="font-bold px-5 py-3 rounded-xl text-sm bg-white text-gray-900 hover:bg-gray-100 whitespace-nowrap">{site.ctaButtonLabel}</button>
        </div>
      </div>

      <div className="px-6 py-5 bg-gray-900 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} {site.heroHeadline.split(":")[0]}. All rights reserved. · Powered by InstantLocalBusiness.com
      </div>
    </div>
  );
}

// ─── PROFESSIONAL layout (Law, Accounting, Real Estate, Photography) ─────────
// Clean white with dark navy accents, authority-forward, minimal, credential-heavy
function ProfessionalLayout({ site, cs, compact }: { site: GeneratedSite; cs: GeneratedSite["colorScheme"]; compact: boolean }) {
  return (
    <div className="font-sans bg-white text-gray-900">
      <SiteNav site={site} cs={cs} isLight={true} compact={compact} />

      {/* Hero — text-dominant, photo as accent */}
      <div className={`grid ${compact ? "grid-cols-1" : "grid-cols-5"} min-h-[380px]`}>
        <div className="col-span-3 flex flex-col justify-center px-10 py-14 bg-slate-900">
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded bg-slate-700 text-slate-300 mb-6 w-fit">{site.heroBadge}</span>
          <h1 className="text-3xl font-extrabold text-white leading-tight mb-4">{site.heroHeadline}</h1>
          <p className="text-sm text-slate-300 leading-relaxed mb-8">{site.heroSubheadline}</p>
          <div className="flex gap-3 flex-wrap">
            <button className={`font-bold px-6 py-3 rounded-lg text-sm ${cs.primary} ${cs.primaryText} ${cs.primaryHover}`}>{site.primaryCta}</button>
            <button className="font-semibold px-6 py-3 rounded-lg text-sm border border-slate-600 text-slate-300 hover:border-slate-400">{site.secondaryCta}</button>
          </div>
        </div>
        {!compact && (
          <div className="col-span-2 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={unsplash(site.heroPhoto, 600, 500)} alt="hero" className="absolute inset-0 w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-slate-900/30"/>
          </div>
        )}
      </div>

      {/* Credential bar */}
      <div className="bg-slate-800 py-3 px-6 flex flex-wrap justify-center gap-8">
        {site.trustPoints.map(p => (
          <span key={p} className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <CheckCircle2 size={13} className={cs.accent}/> {p}
          </span>
        ))}
      </div>

      {/* Stats — large numbers */}
      <div className="grid grid-cols-3 py-10 border-b border-gray-100">
        {site.stats.map(s => (
          <div key={s.label} className="text-center border-r last:border-r-0 border-gray-100">
            <div className="text-3xl font-extrabold text-slate-900">{s.value}</div>
            <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Services — clean text list with numbering */}
      <div id="services" className="px-10 py-14">
        <div className={`grid ${compact ? "grid-cols-1" : "grid-cols-2"} gap-12`}>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Practice Areas</h2>
            <p className="text-sm text-gray-500 mb-8">{site.aboutTitle}</p>
            <div className="space-y-5">
              {site.services.slice(0,3).map((s, i) => (
                <div key={s.title} className="flex gap-4 items-start pb-5 border-b border-gray-100 last:border-0">
                  <span className="text-2xl font-extrabold text-gray-100 leading-none shrink-0">{String(i+1).padStart(2,"0")}</span>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 mb-1">{s.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="space-y-5 mt-14">
              {site.services.slice(3).map((s, i) => (
                <div key={s.title} className="flex gap-4 items-start pb-5 border-b border-gray-100 last:border-0">
                  <span className="text-2xl font-extrabold text-gray-100 leading-none shrink-0">{String(i+4).padStart(2,"0")}</span>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 mb-1">{s.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* About + photo */}
      <div id="about" className={`grid ${compact ? "grid-cols-1" : "grid-cols-2"} bg-slate-900`}>
        <div className="relative" style={{minHeight:280}}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={unsplash(site.servicePhotos[0] ?? site.heroPhoto, 600, 400)} alt="about" className="absolute inset-0 w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-slate-900/40"/>
        </div>
        <div className="px-10 py-12 flex flex-col justify-center">
          <h2 className="text-xl font-extrabold text-white mb-4">{site.aboutTitle}</h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">{site.aboutBody}</p>
          <div id="contact" className="space-y-2">
            {[{icon:Phone,v:site.phone},{icon:MapPin,v:site.address},{icon:Clock,v:site.hours}].map(({icon:Icon,v}) => (
              <div key={v} className="flex items-center gap-2 text-sm text-slate-400">
                <Icon size={14} className="text-slate-300"/> {v}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA — consultation form */}
      <div className="px-8 py-14 bg-white text-center">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">{site.ctaHeading}</h2>
        <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">{site.ctaBody}</p>
        <div className="max-w-md mx-auto bg-slate-900 rounded-2xl p-6 text-left space-y-3">
          <input placeholder="Full name" className="w-full px-4 py-2.5 rounded-lg text-sm text-gray-800 bg-white" readOnly />
          <input placeholder="Email or phone" className="w-full px-4 py-2.5 rounded-lg text-sm text-gray-800 bg-white" readOnly />
          <input placeholder={site.ctaFormPlaceholder} className="w-full px-4 py-2.5 rounded-lg text-sm text-gray-800 bg-white" readOnly />
          <button className={`w-full font-bold py-3 rounded-lg text-sm ${cs.primary} ${cs.primaryText}`}>{site.ctaButtonLabel}</button>
        </div>
      </div>

      <div className="px-6 py-5 bg-slate-900 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {site.heroHeadline.split(":")[0]}. All rights reserved. · Powered by InstantLocalBusiness.com
      </div>
    </div>
  );
}

// ─── Main dispatcher ─────────────────────────────────────────────────────────
function AISiteRenderer({ site, compact }: { site: GeneratedSite; compact: boolean }) {
  const cs = site.colorScheme;
  const isLight = cs.heroBg.includes("slate-50") || cs.heroBg.includes("white") || cs.heroBg === "bg-white";

  switch (site.layout) {
    case "hospitality":  return <HospitalityLayout site={site} cs={cs} compact={compact} />;
    case "service":      return <ServiceLayout site={site} cs={cs} compact={compact} />;
    case "wellness":     return <WellnessLayout site={site} cs={cs} compact={compact} />;
    case "professional": return <ProfessionalLayout site={site} cs={cs} compact={compact} />;
    default:             return <WellnessLayout site={site} cs={cs} compact={compact} />;
  }
}

// ─── Static template MockWebsite (used for demo/examples pages) ──────────────

function MockWebsite({
  template,
  compact,
}: {
  template: BusinessTemplate;
  compact: boolean;
}) {
  const isDark = template.accentBg === "bg-gray-900";

  return (
    <div className={`font-sans text-gray-900 ${isDark ? "bg-gray-900 text-white" : ""}`}>
      {/* Nav */}
      <nav
        className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark ? "border-gray-700 bg-gray-900" : "border-gray-100 bg-white"
        }`}
      >
        <div>
          <span className={`font-extrabold text-base ${isDark ? "text-white" : "text-gray-900"}`}>
            {template.name}
          </span>
          <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {template.tagline}
          </p>
        </div>
        {!compact && (
          <div className={`flex items-center gap-5 text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            {[{label:"About",id:"mock-about"},{label:"Services",id:"mock-services"},{label:"Contact",id:"mock-contact"}].map(({label,id}) => (
              <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({behavior:"smooth"})}
                className="hover:opacity-70 transition-opacity">{label}</button>
            ))}
          </div>
        )}
        <button className={`text-xs font-semibold px-4 py-2 rounded-lg ${template.accentButton}`}>
          {compact ? "Call" : template.primaryCta}
        </button>
      </nav>

      {/* Hero — full-bleed photo with overlay */}
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={unsplash(template.heroPhoto, 1200, 600)}
          alt={template.name}
          className="w-full object-cover"
          style={{ height: compact ? 260 : 420 }}
        />
        {/* Dark scrim */}
        <div className="absolute inset-0 bg-black/55" />
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <div className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 bg-white/20 text-white border border-white/30 backdrop-blur-sm">
            {template.heroLabel}
          </div>
          <h1 className="text-3xl font-extrabold text-white leading-tight mb-3 drop-shadow-md">
            {template.name}
          </h1>
          <p className="text-sm text-white/85 max-w-lg leading-relaxed mb-6 drop-shadow-sm">
            {template.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className={`font-semibold px-6 py-3 rounded-xl text-sm ${template.accentButton}`}>
              {template.primaryCta}
            </button>
            <button className="font-semibold px-6 py-3 rounded-xl text-sm border border-white/50 text-white hover:bg-white/10 transition-colors">
              {template.secondaryCta}
            </button>
          </div>
          {template.rating && (
            <div className="mt-5 flex items-center justify-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={13} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-xs font-semibold text-white">{template.rating.score}</span>
              <span className="text-xs text-white/60">{template.rating.count}</span>
            </div>
          )}
        </div>
      </div>

      {/* Highlight stats */}
      {template.highlightStats && (
        <div
          className={`grid grid-cols-3 divide-x ${
            isDark ? "divide-gray-700 bg-gray-800" : "divide-gray-100 bg-gray-50"
          }`}
        >
          {template.highlightStats.map((s) => (
            <div key={s.label} className="px-4 py-5 text-center">
              <div className={`text-xl font-extrabold ${isDark ? "text-red-400" : template.accentText}`}>
                {s.value}
              </div>
              <div className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Services — photo cards */}
      <div id="mock-services" className={`px-6 py-14 ${isDark ? "bg-gray-900" : "bg-white"}`}>
        <h2 className={`text-xl font-bold text-center mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
          Our Services
        </h2>
        <p className={`text-sm text-center mb-8 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Everything you need, all in one place.
        </p>
        <div className={`grid gap-5 ${compact ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
          {template.services.map((s, i) => (
            <div
              key={s.title}
              className={`rounded-xl overflow-hidden border ${
                isDark ? "border-gray-700" : "border-gray-100"
              }`}
            >
              {/* Service photo */}
              <div className="relative h-32 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={unsplash(template.servicePhotos[i] ?? template.servicePhotos[0], 400, 200)}
                  alt={s.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>
              <div className={`p-4 ${isDark ? "bg-gray-800" : "bg-white"}`}>
                <h3 className={`font-semibold text-sm mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                  {s.title}
                </h3>
                <p className={`text-xs leading-relaxed ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact info strip */}
      <div
        id="mock-contact"
        className={`grid ${compact ? "grid-cols-1" : "sm:grid-cols-3"} divide-y sm:divide-y-0 sm:divide-x ${
          isDark ? "divide-gray-700 bg-gray-800" : "divide-gray-100 bg-gray-50"
        }`}
      >
        {[
          { icon: Phone, label: "Phone", value: template.phone },
          { icon: MapPin, label: "Location", value: template.address },
          { icon: Clock, label: "Hours", value: template.hours },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3 px-6 py-5">
            <Icon
              size={16}
              className={`mt-0.5 flex-shrink-0 ${isDark ? "text-red-400" : template.accentText}`}
            />
            <div>
              <p className={`text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>{label}</p>
              <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA section — photo background */}
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={unsplash(template.heroPhoto, 1200, 500)}
          alt="background"
          className="w-full object-cover"
          style={{ height: compact ? 480 : 420 }}
        />
        <div className={`absolute inset-0 ${isDark ? "bg-black/80" : "bg-black/65"}`} />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-12 text-center">
          <h2 className="text-xl font-bold text-white mb-2">{template.ctaHeading}</h2>
          <p className="text-sm text-white/80 mb-6 max-w-md">{template.ctaBody}</p>
          <div className="w-full max-w-md bg-white rounded-xl p-5 text-left space-y-3">
            <input
              placeholder="Your name"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50"
              readOnly
            />
            <input
              placeholder="Your phone or email"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50"
              readOnly
            />
            <input
              placeholder={template.ctaInputPlaceholder}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50"
              readOnly
            />
            <button className={`w-full font-semibold py-3 rounded-lg text-sm ${template.accentButton}`}>
              {template.ctaButtonLabel}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-8 text-center text-xs bg-gray-950 text-gray-500">
        © {new Date().getFullYear()} {template.name}. All rights reserved.
        <span className="ml-2 text-gray-700">Powered by InstantLocalBusiness.com</span>
      </div>
    </div>
  );
}

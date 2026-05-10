import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

function unsplash(id: string, w: number, h: number) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
}

export const metadata: Metadata = {
  title: "Website Examples — InstantLocalBusiness.com",
  description: "See real websites built with InstantLocalBusiness.com for local businesses.",
};

const examples = [
  {
    name: "Maria's Tacos",
    category: "Restaurant",
    location: "Austin, TX",
    slug: "marias-tacos",
    tagline: "Authentic Mexican Street Food",
    cta: "View Menu",
    accent: "text-orange-100",
    buttonBg: "bg-orange-600",
    photo: "photo-1565299585323-38d6b0865b47",
  },
  {
    name: "Lakeside Plumbing",
    category: "Plumbing",
    location: "Denver, CO",
    slug: "lakeside-plumbing",
    tagline: "24/7 Emergency Plumbing — No Extra Charge",
    cta: "Call Now",
    accent: "text-blue-100",
    buttonBg: "bg-blue-600",
    photo: "photo-1585771724684-38269d6639fd",
  },
  {
    name: "Glow Salon",
    category: "Hair Salon",
    location: "Atlanta, GA",
    slug: "glow-salon",
    tagline: "Color. Cuts. Confidence.",
    cta: "Book Now",
    accent: "text-pink-100",
    buttonBg: "bg-pink-600",
    photo: "photo-1560066984-138dadb4c035",
  },
  {
    name: "Whitfield Electric",
    category: "Electrician",
    location: "Phoenix, AZ",
    slug: "whitfield-electric",
    tagline: "Licensed Contractors — Same-Day Service",
    cta: "Free Estimate",
    accent: "text-yellow-100",
    buttonBg: "bg-yellow-500",
    photo: "photo-1621905251189-08b45d6a269e",
  },
  {
    name: "Paws & Play Grooming",
    category: "Pet Grooming",
    location: "Seattle, WA",
    slug: "paws-and-play",
    tagline: "Spa-Style Grooming for Happy Pets",
    cta: "Book a Groom",
    accent: "text-green-100",
    buttonBg: "bg-green-600",
    photo: "photo-1587300003388-59208cc962cb",
  },
  {
    name: "Fuentes Auto Repair",
    category: "Auto Repair",
    location: "Miami, FL",
    slug: "fuentes-auto",
    tagline: "Honest Repairs — Free Diagnostics",
    cta: "Schedule Service",
    accent: "text-gray-100",
    buttonBg: "bg-red-600",
    photo: "photo-1625047509248-ec889cbff17f",
  },
  {
    name: "Summit Fitness",
    category: "Gym",
    location: "Boulder, CO",
    slug: "summit-fitness",
    tagline: "Train Smarter. Live Better.",
    cta: "Free Trial",
    accent: "text-purple-100",
    buttonBg: "bg-purple-600",
    photo: "photo-1534438327276-14e5300c3a48",
  },
  {
    name: "Bloom Florist",
    category: "Florist",
    location: "Nashville, TN",
    slug: "bloom-florist",
    tagline: "Fresh Flowers — Same-Day Delivery",
    cta: "Shop Now",
    accent: "text-rose-100",
    buttonBg: "bg-rose-500",
    photo: "photo-1487754180451-c456f719a1fc",
  },
  {
    name: "Park Avenue Dental",
    category: "Dentist",
    location: "Chicago, IL",
    slug: "park-avenue-dental",
    tagline: "Comfortable Care — Accepting New Patients",
    cta: "Book Appointment",
    accent: "text-teal-100",
    buttonBg: "bg-teal-600",
    photo: "photo-1606811841689-23dfddce3e95",
  },
];

export default function ExamplesPage() {
  return (
    <>
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
          Real websites, built instantly
        </h1>
        <p className="mt-4 text-xl text-gray-500 max-w-xl mx-auto">
          Browse examples from real local businesses built with InstantLocalBusiness.com.
        </p>
        <Link
          href="/build"
          className="mt-8 inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Build Mine Now
          <ArrowRight size={16} />
        </Link>
      </section>

      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {examples.map((ex) => (
            <Link
              key={ex.slug}
              href={`/preview/${ex.slug}`}
              className="group block rounded-2xl border border-gray-200 bg-white overflow-hidden hover:border-blue-200 transition-all"
            >
              {/* Photo thumbnail with overlay */}
              <div className="relative h-48 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={unsplash(ex.photo, 600, 300)}
                  alt={ex.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />

                {/* Overlay content */}
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <span className={`text-xs font-semibold ${ex.accent} mb-1`}>
                    {ex.category} — {ex.location}
                  </span>
                  <h3 className="font-extrabold text-white text-base leading-tight">
                    {ex.name}
                  </h3>
                  <p className="text-xs text-white/70 mt-1 line-clamp-1">{ex.tagline}</p>
                </div>

                {/* CTA pill top-right */}
                <div className="absolute top-3 right-3">
                  <span className={`text-[10px] font-bold text-white px-2.5 py-1 rounded-full ${ex.buttonBg}`}>
                    {ex.cta}
                  </span>
                </div>
              </div>

              {/* Card footer */}
              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">Click to preview full site</span>
                <ExternalLink
                  size={14}
                  className="text-gray-300 group-hover:text-blue-500 transition-colors"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-extrabold text-gray-900">
          Your business could be next.
        </h2>
        <p className="mt-3 text-gray-500 text-sm">
          Takes less than 2 minutes to fill out. Website live in 60 seconds.
        </p>
        <Link
          href="/build"
          className="mt-6 inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Build My Website Free
          <ArrowRight size={16} />
        </Link>
      </section>
    </>
  );
}

"use client";

import { Phone, MapPin, Clock, CheckCircle2, Menu, X } from "lucide-react";
import { useState } from "react";
import type { GeneratedSite } from "@/lib/generate-site";

function unsplash(id: string, w: number, h: number) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
}

const ICON_MAP: Record<string, string> = {
  wrench: "🔧", scissors: "✂️", scale: "⚖️", heart: "❤️",
  utensils: "🍽️", car: "🚗", leaf: "🌿", home: "🏠",
  star: "⭐", shield: "🛡️", clock: "⏰", phone: "📞",
};

export function PublicSite({ site, businessName }: { site: GeneratedSite; businessName: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formState, setFormState] = useState({ name: "", contact: "", note: "", submitted: false });
  const cs = site.colorScheme;
  const isDark = cs.heroBg.includes("950") || cs.heroBg.includes("900") || cs.heroBg === "bg-black";

  const textBase = isDark ? "text-white" : "text-gray-900";
  const textMuted = isDark ? "text-gray-400" : "text-gray-500";
  const sectionBg = isDark ? "bg-gray-900" : "bg-white";
  const altBg = isDark ? "bg-gray-800" : "bg-gray-50";
  const borderColor = isDark ? "border-gray-700" : "border-gray-100";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState((s) => ({ ...s, submitted: true }));
  };

  return (
    <div className={`font-sans ${sectionBg} ${textBase} min-h-screen`}>

      {/* ── Nav ── */}
      <nav className={`sticky top-0 z-50 border-b ${borderColor} ${cs.navBg} backdrop-blur-sm`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <span className={`font-extrabold text-lg ${textBase}`}>{businessName}</span>
            <p className={`text-xs ${textMuted} hidden sm:block`}>{site.tagline}</p>
          </div>
          {/* Desktop nav */}
          <div className={`hidden md:flex items-center gap-6 text-sm ${textMuted}`}>
            {["About", "Services", "Contact"].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="hover:opacity-70 transition-opacity">{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href={`tel:${site.phone}`}
              className={`hidden sm:flex items-center gap-1.5 text-sm font-semibold ${cs.accent}`}>
              <Phone size={14} /> {site.phone}
            </a>
            <a href="#contact"
              className={`text-sm font-semibold px-4 py-2 rounded-lg ${cs.primary} ${cs.primaryHover} ${cs.primaryText} transition-colors`}>
              {site.primaryCta}
            </a>
            <button className={`md:hidden ${textMuted}`} onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {menuOpen && (
          <div className={`md:hidden border-t ${borderColor} ${isDark ? "bg-gray-900" : "bg-white"} px-6 py-4 space-y-3`}>
            {["About", "Services", "Contact"].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className={`block text-sm font-medium ${textBase} hover:opacity-70`}>{l}</a>
            ))}
            <a href={`tel:${site.phone}`} className={`block text-sm font-semibold ${cs.accent}`}>
              📞 {site.phone}
            </a>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={unsplash(site.heroPhoto, 1600, 800)}
          alt={businessName}
          className="w-full object-cover"
          style={{ height: "min(600px, 70vh)" }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <div className={`inline-block text-xs font-semibold px-4 py-1.5 rounded-full mb-5 ${cs.badge} backdrop-blur-sm`}>
            {site.heroBadge}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight mb-4 drop-shadow-md max-w-3xl">
            {site.heroHeadline}
          </h1>
          <p className="text-base sm:text-lg text-white/85 max-w-xl leading-relaxed mb-8 drop-shadow-sm">
            {site.heroSubheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact"
              className={`font-bold px-8 py-4 rounded-xl text-base ${cs.primary} ${cs.primaryText} ${cs.primaryHover} transition-colors`}>
              {site.primaryCta}
            </a>
            <a href="#services"
              className="font-bold px-8 py-4 rounded-xl text-base border-2 border-white/60 text-white hover:bg-white/10 transition-colors">
              {site.secondaryCta}
            </a>
          </div>
        </div>
      </section>

      {/* ── Trust strip ── */}
      {site.trustPoints?.length > 0 && (
        <div className={`${cs.primary} ${cs.primaryText} py-4 px-6`}>
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm font-semibold">
            {site.trustPoints.map((p) => (
              <span key={p} className="flex items-center gap-2">
                <CheckCircle2 size={14} /> {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Stats ── */}
      <div className={`${altBg} border-b ${borderColor}`}>
        <div className="max-w-4xl mx-auto grid grid-cols-3 divide-x divide-gray-200">
          {site.stats.map((s) => (
            <div key={s.label} className="px-6 py-8 text-center">
              <div className={`text-3xl font-extrabold ${cs.accent}`}>{s.value}</div>
              <div className={`text-sm mt-1 ${textMuted}`}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── About ── */}
      <section id="about" className={`py-20 px-6 ${sectionBg}`}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className={`text-3xl font-bold mb-4 ${textBase}`}>{site.aboutTitle}</h2>
          <p className={`text-lg leading-relaxed ${textMuted}`}>{site.aboutBody}</p>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className={`py-20 px-6 ${altBg}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-3xl font-bold text-center mb-3 ${textBase}`}>Our Services</h2>
          <p className={`text-center mb-12 ${textMuted}`}>Everything you need, delivered with excellence.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {site.services.map((s, i) => (
              <div key={s.title} className={`rounded-2xl overflow-hidden border ${borderColor} ${isDark ? "bg-gray-900" : "bg-white"}`}>
                <div className="relative h-44 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={unsplash(site.servicePhotos[i] ?? site.servicePhotos[0], 600, 300)}
                    alt={s.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  {s.icon && (
                    <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm rounded-xl px-3 py-1.5 text-lg">
                      {ICON_MAP[s.icon] ?? ""}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className={`font-bold text-base mb-2 ${textBase}`}>{s.title}</h3>
                  <p className={`text-sm leading-relaxed ${textMuted}`}>{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact / CTA ── */}
      <section id="contact" className="relative py-24 px-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={unsplash(site.heroPhoto, 1600, 700)}
          alt="contact background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/72" />
        <div className="relative max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="text-white">
            <h2 className="text-3xl font-extrabold mb-4">{site.ctaHeading}</h2>
            <p className="text-white/80 text-base mb-8">{site.ctaBody}</p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone size={18} className={cs.accent} />
                <a href={`tel:${site.phone}`} className="text-white font-semibold hover:underline">{site.phone}</a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} className={cs.accent} />
                <span className="text-white/80">{site.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} className={cs.accent} />
                <span className="text-white/80">{site.hours}</span>
              </div>
            </div>
          </div>

          {/* Right — contact form */}
          <div className="bg-white rounded-2xl p-8">
            {formState.submitted ? (
              <div className="text-center py-6">
                <CheckCircle2 size={40} className="text-green-500 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 text-lg mb-1">Message received!</h3>
                <p className="text-gray-500 text-sm">We&apos;ll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-bold text-gray-900 text-lg mb-2">{site.ctaButtonLabel}</h3>
                <input
                  required
                  placeholder="Your name"
                  value={formState.name}
                  onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  required
                  placeholder="Phone or email"
                  value={formState.contact}
                  onChange={(e) => setFormState((s) => ({ ...s, contact: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  placeholder={site.ctaFormPlaceholder}
                  value={formState.note}
                  onChange={(e) => setFormState((s) => ({ ...s, note: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className={`w-full font-bold py-3.5 rounded-xl text-sm ${cs.primary} ${cs.primaryText} ${cs.primaryHover} transition-colors`}
                >
                  {site.ctaButtonLabel}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-950 text-gray-500 px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div>
            <span className="font-bold text-white">{businessName}</span>
            <span className="ml-2">{site.tagline}</span>
          </div>
          <div className="text-center">
            © {new Date().getFullYear()} {businessName}. All rights reserved.
          </div>
          <div className="text-xs text-gray-700">
            Powered by{" "}
            <a href="https://instantlocalbusiness.com" className="text-gray-500 hover:text-gray-300 transition-colors">
              InstantLocalBusiness.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

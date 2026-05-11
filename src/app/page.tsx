import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Search,
  Smartphone,
  MapPin,
  MessageSquare,
  RefreshCw,
  CheckCircle2,
  Heart,
  TrendingUp,
  Users,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "AI Copywriting",
    description: "Professional copy written for your specific business, location, and services — in seconds.",
  },
  {
    icon: Search,
    title: "SEO Optimized",
    description: "Built-in meta tags, structured data, and local SEO so customers find you on Google.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Looks great on every device — phone, tablet, or desktop — automatically.",
  },
  {
    icon: MessageSquare,
    title: "Contact & Booking Forms",
    description: "Capture leads and appointment requests the moment your site is live.",
  },
  {
    icon: MapPin,
    title: "Google Maps Integration",
    description: "Automatic location pin, business hours, and directions for your customers.",
  },
  {
    icon: RefreshCw,
    title: "One-Click Updates",
    description: "Describe what you want to change in plain English and the AI updates it instantly.",
  },
];

const industries = [
  "Restaurants", "Hair Salons", "Auto Repair", "Plumbers", "Dentists",
  "Real Estate", "Gyms & Fitness", "Landscaping", "Electricians",
  "Pet Grooming", "Bakeries", "Law Firms", "Photographers",
  "Accountants", "Chiropractors", "Florists",
];

const steps = [
  {
    num: "01",
    title: "Describe your business",
    description: "Tell us your business name, category, location, and services. Takes about 2 minutes.",
  },
  {
    num: "02",
    title: "AI builds your site",
    description: "Our AI writes your copy, selects imagery, and structures a complete, professional website.",
  },
  {
    num: "03",
    title: "Review & go live",
    description: "Preview your site, make any tweaks, then publish. Your website goes live instantly.",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Get online with no cost, ever",
    features: [
      "1-page AI-built website",
      "AI copywriting",
      "Mobile responsive",
      "InstantLocalBusiness subdomain",
      "Contact form",
    ],
    cta: "Start Free",
    href: "/build",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For growing local businesses",
    features: [
      "Up to 10 pages",
      "Custom domain included",
      "Local SEO tools & analytics",
      "Contact & booking forms",
      "Google Maps & business hours",
      "Review collection tool",
      "Priority support",
    ],
    cta: "Start Free Trial",
    href: "/build?plan=pro",
    highlighted: true,
  },
  {
    name: "Business",
    price: "$49",
    period: "/month",
    description: "For established businesses",
    features: [
      "Unlimited pages",
      "Everything in Pro",
      "Multiple locations",
      "Online ordering / e-commerce",
      "Team members",
      "White-glove onboarding",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    href: "/contact",
    highlighted: false,
  },
];

export default function Home() {
  return (
    <div style={{ background: "#0a0a0f", color: "#f0f0ff" }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-24 pb-32">
        {/* Glow blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{
            position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
            width: 900, height: 600,
            background: "radial-gradient(ellipse, rgba(99,102,241,0.18) 0%, transparent 70%)",
          }} />
          <div style={{
            position: "absolute", top: "10%", left: "10%",
            width: 400, height: 400,
            background: "radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)",
          }} />
          <div style={{
            position: "absolute", top: "5%", right: "8%",
            width: 350, height: 350,
            background: "radial-gradient(ellipse, rgba(139,92,246,0.1) 0%, transparent 70%)",
          }} />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }} />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full mb-8 border"
            style={{ background: "rgba(99,102,241,0.12)", borderColor: "rgba(99,102,241,0.3)", color: "#a5b4fc" }}>
            <Sparkles size={12} />
            Built for local businesses, powered by AI
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight"
            style={{ color: "#f8fafc" }}>
            Your local business,
            <br />
            <span style={{
              background: "linear-gradient(135deg, #6366f1 0%, #3b82f6 50%, #06b6d4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              online instantly.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#94a3b8" }}>
            Small businesses deserve the same powerful online presence as the big guys.
            Tell us about your business and AI builds your professional website in 60 seconds —
            no coding, no agency, no waiting.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/build"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold text-base px-8 py-4 rounded-xl transition-all"
              style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)", color: "#fff", boxShadow: "0 0 30px rgba(99,102,241,0.4)" }}>
              Build My Website Now
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/examples"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold text-base px-8 py-4 rounded-xl border transition-all hover:border-indigo-500/50"
              style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)", color: "#e2e8f0" }}>
              See Examples
            </Link>
          </div>

          <p className="mt-4 text-sm" style={{ color: "#475569" }}>
            No credit card required. Free plan available.
          </p>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { value: "60s", label: "To go live" },
              { value: "$0", label: "To start" },
              { value: "16+", label: "Industries" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-extrabold" style={{
                  background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  {stat.value}
                </div>
                <div className="mt-1 text-xs font-medium" style={{ color: "#64748b" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES STRIP ────────────────────────────────────────────── */}
      <section className="py-12 px-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
        <p className="text-center text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#475569" }}>
          Built for every local industry
        </p>
        <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
          {industries.map((industry) => (
            <Link key={industry} href={`/build?category=${encodeURIComponent(industry)}`}
              className="text-xs font-medium px-3 py-1.5 rounded-full transition-all hover:scale-105"
              style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#a5b4fc" }}>
              {industry}
            </Link>
          ))}
        </div>
      </section>

      {/* ── MISSION ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#6366f1" }}>Our mission</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: "#f1f5f9" }}>
              We&apos;re on your side — not chasing profits.
            </h2>
            <p className="mt-5 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "#94a3b8" }}>
              AI is changing everything. Big corporations are using it to move faster, look better, and reach more customers.
              We built Instant Local Business so <strong style={{ color: "#e2e8f0" }}>your neighborhood bakery, plumber, or salon</strong> can
              do the same — without hiring an agency or spending thousands of dollars.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Heart, title: "Customer first, always", body: "We measure success by how many local businesses grow — not by our revenue. Your wins are our wins." },
              { icon: TrendingUp, title: "Grow your local presence", body: "Be discoverable on Google, look professional, and compete with anyone — regardless of your budget." },
              { icon: Users, title: "Built for real people", body: "No tech skills needed. If you can describe your business, you can have a website live today." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="p-6 rounded-2xl transition-all"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4"
                  style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}>
                  <Icon size={20} />
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: "#f1f5f9" }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: "#f1f5f9" }}>
              How it works
            </h2>
            <p className="mt-4 text-base" style={{ color: "#94a3b8" }}>
              Three simple steps. No technical knowledge required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div key={step.num} className="relative p-8 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-6 z-10 text-center" style={{ color: "#334155" }}>→</div>
                )}
                <span className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-5"
                  style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}>
                  Step {step.num}
                </span>
                <h3 className="text-lg font-bold mb-3" style={{ color: "#f1f5f9" }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/build"
              className="inline-flex items-center gap-2 font-semibold px-8 py-4 rounded-xl transition-all"
              style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)", color: "#fff", boxShadow: "0 0 24px rgba(99,102,241,0.35)" }}>
              Start Building Now <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: "#f1f5f9" }}>
              Everything a local business needs
            </h2>
            <p className="mt-4 text-base" style={{ color: "#94a3b8" }}>
              Built-in tools that actually move the needle for small businesses.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="p-6 rounded-2xl transition-all feature-card"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4"
                    style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}>
                    <Icon size={20} />
                  </div>
                  <h3 className="text-base font-semibold mb-2" style={{ color: "#f1f5f9" }}>{feature.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full mb-5 border"
              style={{ background: "rgba(251,191,36,0.1)", borderColor: "rgba(251,191,36,0.25)", color: "#fbbf24" }}>
              🎉 Early adopter pricing — lock your rate for life
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: "#f1f5f9" }}>
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-base" style={{ color: "#94a3b8" }}>
              Start free. Pro at just $19/mo — less than a tank of gas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className="rounded-2xl p-8 transition-all"
                style={plan.highlighted ? {
                  background: "linear-gradient(145deg, rgba(99,102,241,0.25), rgba(59,130,246,0.15))",
                  border: "1px solid rgba(99,102,241,0.5)",
                  boxShadow: "0 0 40px rgba(99,102,241,0.2)",
                } : {
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}>
                {plan.highlighted && (
                  <div className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4"
                    style={{ background: "rgba(99,102,241,0.3)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.4)" }}>
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold" style={{ color: "#f1f5f9" }}>{plan.name}</h3>
                <p className="text-sm mt-1" style={{ color: "#64748b" }}>{plan.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold" style={{ color: "#f1f5f9" }}>{plan.price}</span>
                  <span className="text-sm" style={{ color: "#475569" }}>{plan.period}</span>
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0" style={{ color: plan.highlighted ? "#818cf8" : "#6366f1" }} />
                      <span className="text-sm" style={{ color: "#cbd5e1" }}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.href}
                  className="mt-8 block text-center font-semibold py-3 px-6 rounded-xl transition-all"
                  style={plan.highlighted ? {
                    background: "linear-gradient(135deg, #6366f1, #3b82f6)",
                    color: "#fff",
                    boxShadow: "0 0 20px rgba(99,102,241,0.4)",
                  } : {
                    background: "rgba(99,102,241,0.12)",
                    color: "#a5b4fc",
                    border: "1px solid rgba(99,102,241,0.25)",
                  }}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────────── */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(99,102,241,0.15) 0%, transparent 70%)",
        }} />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: "#f8fafc" }}>
            Your local business deserves to be found.
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed" style={{ color: "#94a3b8" }}>
            The AI world isn&apos;t slowing down — but it doesn&apos;t have to leave you behind.
            Get online today, free, in under a minute.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/build"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold text-base px-8 py-4 rounded-xl transition-all"
              style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)", color: "#fff", boxShadow: "0 0 30px rgba(99,102,241,0.4)" }}>
              Build My Website Now
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold text-base px-8 py-4 rounded-xl border transition-all"
              style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.12)", color: "#e2e8f0" }}>
              Book a Demo
            </Link>
          </div>
          <p className="mt-4 text-sm" style={{ color: "#334155" }}>
            Free plan available. No credit card required.
          </p>
        </div>
      </section>

    </div>
  );
}

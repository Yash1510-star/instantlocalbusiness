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
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "AI Copywriting",
    description:
      "Professional copy written for your specific business, location, and services — in seconds.",
  },
  {
    icon: Search,
    title: "SEO Optimized",
    description:
      "Built-in meta tags, structured data, and local SEO so customers find you on Google.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description:
      "Looks great on every device — phone, tablet, or desktop — automatically.",
  },
  {
    icon: MessageSquare,
    title: "Contact & Booking Forms",
    description:
      "Capture leads and appointment requests the moment your site is live.",
  },
  {
    icon: MapPin,
    title: "Google Maps Integration",
    description:
      "Automatic location pin, business hours, and directions for your customers.",
  },
  {
    icon: RefreshCw,
    title: "One-Click Updates",
    description:
      "Describe what you want to change in plain English and the AI updates it instantly.",
  },
];

const industries = [
  "Restaurants",
  "Hair Salons",
  "Auto Repair",
  "Plumbers",
  "Dentists",
  "Real Estate",
  "Gyms & Fitness",
  "Landscaping",
  "Electricians",
  "Pet Grooming",
  "Bakeries",
  "Law Firms",
  "Photographers",
  "Accountants",
  "Chiropractors",
  "Florists",
];

const steps = [
  {
    num: "01",
    title: "Describe your business",
    description:
      "Tell us your business name, category, location, and services. Takes about 2 minutes.",
  },
  {
    num: "02",
    title: "AI builds your site",
    description:
      "Our AI writes your copy, selects imagery, and structures a complete, professional website.",
  },
  {
    num: "03",
    title: "Review & go live",
    description:
      "Preview your site, make any tweaks, then publish. Your website goes live instantly.",
  },
];


const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for getting started",
    features: [
      "1-page website",
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
    price: "$29",
    period: "/month",
    description: "For growing local businesses",
    features: [
      "Up to 10 pages",
      "Custom domain",
      "SEO tools & analytics",
      "Contact & booking forms",
      "Google Maps & reviews",
      "AI chat widget",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    href: "/build?plan=pro",
    highlighted: true,
  },
  {
    name: "Business",
    price: "$79",
    period: "/month",
    description: "For established businesses",
    features: [
      "Unlimited pages",
      "Everything in Pro",
      "Online ordering / e-commerce",
      "Team members",
      "White-glove onboarding",
      "Dedicated account manager",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    href: "/contact",
    highlighted: false,
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(59,130,246,0.08),transparent)] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-8">
            <Zap size={12} />
            Built for local businesses, powered by AI
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Your local business,
            <br />
            <span className="text-blue-600">online instantly.</span>
          </h1>

          <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Small businesses deserve the same powerful online presence as the big guys.
            Tell us about your business and AI builds your professional website in 60 seconds —
            no coding, no agency, no waiting.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/build"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold text-base px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Build My Website Now
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/examples"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold text-base px-8 py-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              See Examples
            </Link>
          </div>

          <p className="mt-4 text-sm text-gray-400">
            No credit card required. Free plan available.
          </p>

          {/* Stats — only real, verifiable claims */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { value: "60s", label: "Average time to live" },
              { value: "$0", label: "To start today" },
              { value: "16+", label: "Industries supported" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-extrabold text-gray-900">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Our mission</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              We&apos;re on your side — not chasing profits.
            </h2>
            <p className="mt-5 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              AI is changing everything. Big corporations are using it to move faster, look better, and reach more customers.
              We built Instant Local Business so <strong className="text-gray-700">your neighborhood bakery, plumber, or salon</strong> can
              do the same — without hiring an agency or spending thousands of dollars.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Customer first, always",
                body: "We measure success by how many local businesses grow — not by our revenue. Your wins are our wins.",
              },
              {
                icon: TrendingUp,
                title: "Grow your local presence",
                body: "Be discoverable on Google, look professional, and compete with anyone — regardless of your budget.",
              },
              {
                icon: Users,
                title: "Built for real people",
                body: "No tech skills needed. If you can describe your business, you can have a website live today.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="text-center p-6 rounded-2xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl mb-4">
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              How it works
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Three simple steps. No technical knowledge required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.num} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gray-200 z-0" />
                )}
                <div className="relative bg-white rounded-2xl border border-gray-100 p-8">
                  <span className="inline-block text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4">
                    Step {step.num}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/build"
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Start Building Now
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Everything a local business needs
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Built-in tools that actually move the needle for small businesses.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group p-6 rounded-2xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-50 text-blue-600 rounded-xl mb-4">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Built for every local industry
            </h2>
            <p className="mt-3 text-gray-500">
              Don&apos;t see yours? We support any local business category.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {industries.map((industry) => (
              <Link
                key={industry}
                href={`/build?category=${encodeURIComponent(industry)}`}
                className="bg-white border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-full hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-colors"
              >
                {industry}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Start free. Upgrade when you&apos;re ready.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-8 ${
                  plan.highlighted
                    ? "border-blue-500 bg-blue-600 text-white"
                    : "border-gray-200 bg-white"
                }`}
              >
                {plan.highlighted && (
                  <div className="inline-block text-xs font-bold bg-white text-blue-600 px-3 py-1 rounded-full mb-4">
                    Most Popular
                  </div>
                )}
                <h3
                  className={`text-xl font-bold ${
                    plan.highlighted ? "text-white" : "text-gray-900"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm mt-1 ${
                    plan.highlighted ? "text-blue-200" : "text-gray-500"
                  }`}
                >
                  {plan.description}
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span
                    className={`text-4xl font-extrabold ${
                      plan.highlighted ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm ${
                      plan.highlighted ? "text-blue-200" : "text-gray-400"
                    }`}
                  >
                    {plan.period}
                  </span>
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2
                        size={16}
                        className={`mt-0.5 flex-shrink-0 ${
                          plan.highlighted ? "text-blue-200" : "text-blue-500"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          plan.highlighted ? "text-blue-100" : "text-gray-600"
                        }`}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`mt-8 block text-center font-semibold py-3 px-6 rounded-xl transition-colors ${
                    plan.highlighted
                      ? "bg-white text-blue-600 hover:bg-blue-50"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Your local business deserves to be found.
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            The AI world isn&apos;t slowing down — but it doesn&apos;t have to leave you behind.
            Get online today, free, in under a minute.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/build"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold text-base px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Build My Website Now
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold text-base px-8 py-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Book a Demo
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            Free plan available. No credit card required.
          </p>
        </div>
      </section>
    </>
  );
}

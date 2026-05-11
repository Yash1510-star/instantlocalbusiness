import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — InstantLocalBusiness.com",
  description: "Simple, transparent pricing. Start free. Upgrade when you're ready.",
  alternates: { canonical: "/pricing" },
};

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Get your business online today — no card needed",
    features: [
      "1-page AI-built website",
      "AI copywriting, tailored to your business",
      "Mobile responsive design",
      "InstantLocalBusiness subdomain",
      "Contact form",
      "SSL certificate",
      "Publish & go live instantly",
    ],
    notIncluded: [
      "Custom domain",
      "SEO analytics",
      "Booking forms",
      "Google Maps integration",
    ],
    cta: "Start Free",
    href: "/build",
    highlighted: false,
    badge: "",
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    annual: "$15",
    description: "Everything a growing local business needs",
    features: [
      "Up to 10 pages",
      "Custom domain included",
      "Local SEO tools & analytics",
      "Contact & appointment booking forms",
      "Google Maps & business hours",
      "Review collection tool",
      "Priority email support",
      "SSL certificate",
      "99.9% uptime SLA",
      "Early adopter price — locked for life",
    ],
    notIncluded: [],
    cta: "Start 14-Day Free Trial",
    href: "/build?plan=pro",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Business",
    price: "$49",
    period: "/month",
    annual: "$39",
    description: "For established businesses ready to scale",
    features: [
      "Unlimited pages",
      "Everything in Pro",
      "Multiple business locations",
      "Online ordering / e-commerce",
      "Team member accounts",
      "Advanced analytics",
      "White-glove onboarding call",
      "Dedicated account manager",
      "Custom integrations (Zapier, etc.)",
      "Phone & chat support",
    ],
    notIncluded: [],
    cta: "Contact Sales",
    href: "/contact",
    highlighted: false,
    badge: "",
  },
];

const faqs = [
  {
    q: "Do I need a credit card to start?",
    a: "No. The Starter plan is completely free — no credit card required. You only need to add payment information when upgrading to Pro or Business.",
  },
  {
    q: "How long does it take to build my website?",
    a: "Most websites are live in under 60 seconds. Our AI generates your copy, layout, and SEO settings instantly based on your business info.",
  },
  {
    q: "Can I use my own domain name?",
    a: "Yes! Pro and Business plans include a free custom domain connection. You can point any domain you already own, or we'll help you register a new one.",
  },
  {
    q: "What happens if I want to cancel?",
    a: "Cancel anytime with no penalties. If you cancel, your site remains on the Starter plan (1 page, subdomain). Your data is never deleted.",
  },
  {
    q: "Can I upgrade or downgrade later?",
    a: "Absolutely. You can change plans at any time from your dashboard. Upgrades take effect immediately; downgrades apply at the next billing cycle.",
  },
  {
    q: "Do you offer refunds?",
    a: "Yes. We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, contact us and we'll issue a full refund.",
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          🎉 Early adopter pricing — lock your rate for life when you sign up today
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-xl text-gray-500 max-w-xl mx-auto">
          Start free. Upgrade when you&apos;re ready. Cancel anytime.
        </p>
        <p className="mt-3 text-sm text-gray-400">
          Pro at $19/mo — less than a tank of gas. No contracts, no surprises.
        </p>
      </section>

      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-8 ${
                plan.highlighted
                  ? "border-blue-500 bg-blue-600 text-white"
                  : "border-gray-200 bg-white"
              }`}
            >
              {plan.badge && (
                <div className="inline-block text-xs font-bold bg-white text-blue-600 px-3 py-1 rounded-full mb-4">
                  {plan.badge}
                </div>
              )}
              <h2
                className={`text-2xl font-bold ${
                  plan.highlighted ? "text-white" : "text-gray-900"
                }`}
              >
                {plan.name}
              </h2>
              <p
                className={`text-sm mt-1 ${
                  plan.highlighted ? "text-blue-200" : "text-gray-500"
                }`}
              >
                {plan.description}
              </p>
              <div className="mt-5 flex items-baseline gap-1">
                <span
                  className={`text-5xl font-extrabold ${
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
              {plan.annual && (
                <p
                  className={`text-xs mt-1 ${
                    plan.highlighted ? "text-blue-200" : "text-gray-400"
                  }`}
                >
                  {plan.annual}/mo billed annually
                </p>
              )}

              <Link
                href={plan.href}
                className={`mt-6 flex items-center justify-center gap-2 font-semibold py-3 px-6 rounded-xl transition-colors ${
                  plan.highlighted
                    ? "bg-white text-blue-600 hover:bg-blue-50"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {plan.cta}
                <ArrowRight size={16} />
              </Link>

              <div className="mt-8">
                <p
                  className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
                    plan.highlighted ? "text-blue-200" : "text-gray-400"
                  }`}
                >
                  What&apos;s included
                </p>
                <ul className="space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2
                        size={15}
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
                  {plan.notIncluded.map((f) => (
                    <li key={f} className="flex items-start gap-2 opacity-40">
                      <div className="mt-1.5 w-3 h-px bg-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-500">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Ready to get started?
        </h2>
        <p className="mt-3 text-gray-500">
          Free to start. No credit card required.
        </p>
        <Link
          href="/build"
          className="mt-8 inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Build My Free Website
          <ArrowRight size={18} />
        </Link>
      </section>
    </>
  );
}

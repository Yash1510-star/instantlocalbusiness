import Link from "next/link";
import { ArrowRight, MessageSquare, Mail, Phone } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Find answers to common questions about InstantLocalBusiness.com — getting started, pricing, custom domains, and editing your site.",
  alternates: { canonical: "/help" },
};

const faqs = [
  {
    category: "Getting Started",
    items: [
      { q: "How do I build my website?", a: "Click 'Get Started Free' and answer 5 simple questions about your business. Our AI builds your site in under 60 seconds." },
      { q: "Do I need technical skills?", a: "None at all. If you can fill out a form on your phone, you can build a website with us." },
      { q: "What information do I need?", a: "Your business name, type, city, phone number, and a short description. That's it." },
    ],
  },
  {
    category: "Plans & Billing",
    items: [
      { q: "Is the free plan really free?", a: "Yes. No credit card, no time limit. Your site stays live on a *.instantlocalbusiness.com subdomain for free forever." },
      { q: "How do I upgrade to Pro?", a: "Go to your dashboard and click 'Upgrade'. Your site upgrades instantly with no rebuilding required." },
      { q: "Can I cancel anytime?", a: "Yes. Cancel from your dashboard with one click. No cancellation fees. Your site reverts to the free plan." },
      { q: "Do you offer refunds?", a: "Yes — 30-day money-back guarantee on all paid plans. No questions asked." },
    ],
  },
  {
    category: "Custom Domains",
    items: [
      { q: "How do I connect my own domain?", a: "In your dashboard, go to Settings → Domain. Enter your domain and follow the DNS instructions. Usually live within 24 hours." },
      { q: "Do I need to buy a domain separately?", a: "Yes, Pro plan connects a domain you already own. We recommend Namecheap or Google Domains (~$12–15/yr)." },
      { q: "Will I get an SSL certificate?", a: "Yes. SSL is provisioned automatically for all sites, including custom domains. Your site will show https://." },
    ],
  },
  {
    category: "Editing & Updates",
    items: [
      { q: "Can I edit my site after it's built?", a: "Yes. Log in to your dashboard and click 'Edit Site'. You can update text, photos, services, and more anytime." },
      { q: "How do I update my business hours?", a: "Dashboard → Edit Site → Contact & Hours. Changes go live instantly." },
      { q: "Can I add new pages?", a: "Pro and Business plans support multiple pages. Go to Dashboard → Pages → Add Page." },
    ],
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.flatMap((section) =>
    section.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    }))
  ),
};

export default function HelpPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Help Center</h1>
        <p className="mt-4 text-lg text-gray-500">
          Answers to the most common questions.
        </p>
      </section>

      <section className="pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-12">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {section.category}
              </h2>
              <div className="space-y-4">
                {section.items.map((item) => (
                  <div key={item.q} className="bg-gray-50 rounded-xl p-5">
                    <h3 className="font-semibold text-gray-900 mb-1.5">{item.q}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact options */}
      <section className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Still need help?</h2>
          <p className="text-gray-500 mb-8">Our team (and AI) are standing by.</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: MessageSquare, label: "Live Chat", desc: "AI chat, 24/7", href: "/contact" },
              { icon: Mail, label: "Email Support", desc: "hello@instantlocalbusiness.com", href: "mailto:hello@instantlocalbusiness.com" },
              { icon: Phone, label: "Book a Demo", desc: "Free 20-min call", href: "/demo" },
            ].map((c) => {
              const Icon = c.icon;
              return (
                <Link
                  key={c.label}
                  href={c.href}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-200 hover:bg-blue-50/30 transition-colors text-left"
                >
                  <Icon size={20} className="text-blue-600 mb-3" />
                  <p className="font-semibold text-gray-900">{c.label}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{c.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

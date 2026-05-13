import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How InstantLocalBusiness.com collects, uses, and protects your data.",
};

const sections = [
  {
    title: "Information We Collect",
    body: `When you create an account or build a website, we collect your name, email address, business name, phone number, and business location. We also collect usage data such as pages visited, features used, and site performance metrics to improve our service.`,
  },
  {
    title: "How We Use Your Information",
    body: `We use your information to provide, maintain, and improve our services; send transactional emails (account confirmation, billing receipts); send product updates and tips (you can opt out anytime); and generate your AI-powered website content. We do not sell your personal information to third parties.`,
  },
  {
    title: "Data Storage & Security",
    body: `Your data is stored on servers in the United States. We use industry-standard encryption (TLS 1.3) for data in transit and AES-256 for data at rest. We conduct regular security audits and maintain SOC 2-aligned controls.`,
  },
  {
    title: "Cookies",
    body: `We use essential cookies for authentication and session management, and analytics cookies (via Plausible — privacy-friendly, no cross-site tracking) to understand how visitors use our site. We do not use advertising cookies or sell cookie data.`,
  },
  {
    title: "Third-Party Services",
    body: `We use Stripe for payment processing (their privacy policy applies to payment data), Resend for email delivery, Cloudflare for CDN and security, and OpenAI's API for AI content generation. None of these services receive your personal data beyond what's necessary to provide their service.`,
  },
  {
    title: "Your Rights",
    body: `You have the right to access, correct, or delete your personal data at any time. To exercise these rights, email us at privacy@instantlocalbusiness.com. We will respond within 30 days. EU and California residents have additional rights under GDPR and CCPA respectively.`,
  },
  {
    title: "Data Retention",
    body: `We retain your account data for as long as your account is active. If you delete your account, we remove your personal data within 30 days, except where required to retain it for legal or tax purposes (typically 7 years for financial records).`,
  },
  {
    title: "Contact",
    body: `Questions about this policy? Contact our privacy team at privacy@instantlocalbusiness.com or by mail at InstantLocalBusiness.com, Columbus, OH.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-gray-500 mb-12">Last updated: May 1, 2026</p>
      <div className="space-y-10">
        {sections.map((s) => (
          <div key={s.title}>
            <h2 className="text-lg font-bold text-gray-900 mb-3">{s.title}</h2>
            <p className="text-gray-600 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

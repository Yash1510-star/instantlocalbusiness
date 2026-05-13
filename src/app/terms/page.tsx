import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using InstantLocalBusiness.com.",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: `By accessing or using InstantLocalBusiness.com ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service. We may update these terms periodically; continued use after changes constitutes acceptance.`,
  },
  {
    title: "2. Description of Service",
    body: `InstantLocalBusiness.com provides AI-powered website creation tools for local businesses. The Service includes website generation, hosting on our subdomain (*.instantlocalbusiness.com), contact form processing, and related features as described on our pricing page.`,
  },
  {
    title: "3. Account Registration",
    body: `You must provide accurate, complete information when creating an account. You are responsible for maintaining the confidentiality of your password and for all activities under your account. You must be at least 18 years old to use the Service.`,
  },
  {
    title: "4. Acceptable Use",
    body: `You may not use the Service to create websites that violate any law, infringe intellectual property rights, distribute malware, engage in spam, publish false or misleading information, or promote illegal activities. We reserve the right to suspend or terminate accounts that violate these terms.`,
  },
  {
    title: "5. Content Ownership",
    body: `You retain ownership of any content you provide (business name, photos, descriptions). You grant us a license to use that content to provide the Service. AI-generated content produced by the Service based on your inputs is owned by you upon generation.`,
  },
  {
    title: "6. Payment & Billing",
    body: `Paid plans are billed monthly or annually in advance. All fees are non-refundable except as provided in our 30-day money-back guarantee for new subscribers. We reserve the right to change pricing with 30 days' notice. Failure to pay may result in service suspension.`,
  },
  {
    title: "7. Uptime & Service Availability",
    body: `We target 99.9% uptime for paid plans. Scheduled maintenance will be announced 24 hours in advance. We are not liable for downtime caused by third-party services, force majeure events, or customer-side issues.`,
  },
  {
    title: "8. Limitation of Liability",
    body: `To the maximum extent permitted by law, InstantLocalBusiness.com shall not be liable for any indirect, incidental, special, consequential, or punitive damages. Our total liability to you for any claim shall not exceed the amount you paid us in the three months preceding the claim.`,
  },
  {
    title: "9. Termination",
    body: `You may cancel your account at any time from your dashboard. We may terminate or suspend your account immediately for violations of these terms. Upon termination, your website will be taken offline and your data deleted within 30 days.`,
  },
  {
    title: "10. Governing Law",
    body: `These terms are governed by the laws of the State of Ohio, USA. Any disputes shall be resolved through binding arbitration in Columbus, OH, except that either party may seek injunctive relief in court for intellectual property violations.`,
  },
];

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Terms of Service</h1>
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

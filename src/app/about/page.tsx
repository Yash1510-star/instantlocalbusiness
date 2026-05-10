import Link from "next/link";
import { ArrowRight, Zap, Users, Globe, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "InstantLocalBusiness.com is on a mission to put every local business online — beautifully, affordably, and instantly.",
};

const values = [
  {
    icon: Zap,
    title: "Speed is respect",
    body: "Local business owners don't have hours to spend on a website. Our AI delivers in 60 seconds because your time is valuable.",
  },
  {
    icon: Users,
    title: "Built for Main Street",
    body: "We're not building for Silicon Valley startups. We're building for the taco shop, the plumber, the salon owner who just needs to be found online.",
  },
  {
    icon: Globe,
    title: "AI handles the hard part",
    body: "SEO, copywriting, responsive design — the stuff that used to cost $3,000 and 3 weeks. Our AI does it instantly, correctly, every time.",
  },
  {
    icon: TrendingUp,
    title: "Priced for small business reality",
    body: "Starts free. Pro is $29/month — less than most small businesses spend on coffee in a week. No contracts, cancel anytime.",
  },
];

const team = [
  {
    name: "The Founding Team",
    bio: "Built by a team obsessed with making technology accessible to the businesses that power local communities. Previously built tools used by millions of small businesses.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-8">
            Our Mission
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Every local business deserves a
            <span className="text-blue-600"> great website.</span>
          </h1>
          <p className="mt-6 text-xl text-gray-500 leading-relaxed">
            There are 33 million small businesses in the US. Most of them still don&apos;t
            have a professional website. We&apos;re fixing that — one AI-generated site at a time.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { value: "12,400+", label: "Businesses launched" },
            { value: "60 sec", label: "Average build time" },
            { value: "98%", label: "Satisfaction rate" },
            { value: "33M", label: "Businesses still need us" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold text-gray-900">{s.value}</div>
              <div className="mt-1 text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">The problem we&apos;re solving</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              A plumber in Denver spends 30 years mastering his craft. He&apos;s the best in his
              area — customers who find him love him. But 80% of his potential customers start
              their search on Google. And he&apos;s not there.
            </p>
            <p>
              He called a web agency. They quoted $3,500 and a 6-week timeline. He called a
              freelancer. Same story. He tried Wix — spent four hours and gave up. His cousin
              offered to help. That was 8 months ago.
            </p>
            <p>
              Meanwhile, his competitor — who isn&apos;t as good — has a website. Gets the calls.
              Gets the jobs.
            </p>
            <p className="font-semibold text-gray-900">
              We built InstantLocalBusiness.com because that plumber deserves better. Every local
              business does.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            What we believe
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Icon size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{v.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{v.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
          Join 12,400+ businesses already online.
        </h2>
        <p className="text-gray-500 mb-8">Free to start. Live in 60 seconds.</p>
        <Link
          href="/build"
          className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Build My Website Free
          <ArrowRight size={18} />
        </Link>
      </section>
    </>
  );
}

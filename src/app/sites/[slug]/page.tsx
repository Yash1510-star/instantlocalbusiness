import { notFound } from "next/navigation";
import { getSite } from "@/lib/site-store";
import { PublicSite } from "@/components/PublicSite";
import Link from "next/link";
import type { Metadata } from "next";

const FREE_TRIAL_DAYS = 15;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const saved = await getSite(slug);
  if (!saved?.site) return { title: "Site Not Found" };

  return {
    title: saved.site.metaTitle ?? saved.businessName,
    description: saved.site.metaDescription ?? "",
    openGraph: {
      title: saved.site.metaTitle ?? saved.businessName,
      description: saved.site.metaDescription ?? "",
      type: "website",
    },
  };
}

export default async function SitePage({ params }: Props) {
  const { slug } = await params;
  const saved = await getSite(slug);
  if (!saved || !saved.site || saved.status === "suspended") notFound();

  // Free tier expires after 15 days
  if (saved.plan === "starter") {
    const ageMs = Date.now() - new Date(saved.publishedAt).getTime();
    const ageDays = ageMs / (1000 * 60 * 60 * 24);
    if (ageDays > FREE_TRIAL_DAYS) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <span className="text-2xl">⏰</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              {saved.businessName}
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              This free site has expired after {FREE_TRIAL_DAYS} days. Upgrade to Pro
              to keep it live, add a custom domain, and unlock all features.
            </p>
            <Link
              href="/pricing"
              className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-blue-700 transition-colors"
            >
              Upgrade to Pro — $19/mo
            </Link>
            <p className="text-xs text-gray-400 mt-4">
              Your site content is saved. It will go live again immediately after upgrading.
            </p>
          </div>
        </div>
      );
    }
  }

  return <PublicSite site={saved.site} businessName={saved.businessName} plan={saved.plan} publishedAt={saved.publishedAt} />;
}

import { Suspense } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Globe, Plus, ExternalLink, Clock, Sparkles, Rocket, CalendarDays } from "lucide-react";
import { getSitesByUser } from "@/lib/site-store";
import { getSubscription } from "@/lib/subscription-store";
import { SignOutButton } from "@/components/SignOutButton";
import { ManageSubscriptionButton } from "@/components/ManageSubscriptionButton";
import { DashboardBanner } from "@/components/DashboardBanner";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/signin");
  }

  const user = await currentUser();
  const sites = await getSitesByUser(userId);
  const subscription = await getSubscription(userId);
  
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://instantlocalbusiness.com";
  
  // Determine plan display
  const planName = subscription?.status === "active" || subscription?.status === "trialing" 
    ? subscription.plan 
    : "starter";

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Suspense fallback={null}>
        <DashboardBanner />
      </Suspense>

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ""}!
          </h1>
          <p className="text-sm text-gray-500 mt-1">{user?.primaryEmailAddress?.emailAddress}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Plan:</span>
            <span className="text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md">
              {planName}
            </span>
          </div>
          <SignOutButton />
        </div>
      </div>

      {/* Subscription Management */}
      {subscription && (subscription.status === "active" || subscription.status === "trialing") && (
        <div className="mb-8 flex justify-end">
          <ManageSubscriptionButton />
        </div>
      )}

      {/* Quick action — gated at 2 sites */}
      {sites.length >= 1 && planName === "starter" ? (
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-600 rounded-lg text-white shrink-0">
              <Rocket size={18} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">You&apos;ve used your free site</p>
              <p className="text-xs text-gray-500 mt-0.5">Upgrade to Pro or book a demo to publish more</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              href="/pricing"
              className="flex-1 flex items-center justify-center gap-1.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 py-2.5 rounded-xl transition-colors"
            >
              <Rocket size={14} />
              Upgrade to Pro
            </Link>
            <Link
              href="/demo"
              className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-white py-2.5 rounded-xl transition-colors"
            >
              <CalendarDays size={14} />
              Book a demo
            </Link>
          </div>
        </div>
      ) : (
        <Link
          href="/build"
          className="flex items-center gap-4 p-5 border border-blue-100 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors mb-8"
        >
          <div className="p-2 bg-blue-600 rounded-lg text-white shrink-0">
            <Plus size={18} />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Build a new website</p>
            <p className="text-xs text-gray-500 mt-0.5">Launch in 60 seconds with AI</p>
          </div>
        </Link>
      )}

      {/* Sites section */}
      <h2 className="text-lg font-bold text-gray-900 mb-4">Your websites</h2>

      {sites.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-2xl p-10 text-center">
          <Globe size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="font-semibold text-gray-700">No websites yet</p>
          <p className="text-sm text-gray-400 mt-1 mb-5">
            Build your first AI-powered website in under a minute.
          </p>
          <Link
            href="/build"
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Sparkles size={15} />
            Get started free
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sites.map((s) => (
            <div key={s.slug} className="border border-gray-100 rounded-2xl p-5 hover:border-gray-200 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <Globe size={15} className="text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{s.businessName}</p>
                    <p className="text-xs text-gray-400 truncate capitalize">{s.site?.layout ?? "website"}</p>
                  </div>
                </div>
                <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                  s.status === "live" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {s.status}
                </span>
              </div>

              <p className="text-xs text-gray-400 flex items-center gap-1 mb-4">
                <Clock size={11} />
                Published {new Date(s.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>

              <div className="flex gap-2">
                <a
                  href={`${SITE_URL}/sites/${s.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition-colors"
                >
                  <ExternalLink size={12} />
                  Visit site
                </a>
                {planName === "starter" && sites.length >= 1 ? (
                  <Link
                    href="/pricing"
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-indigo-600 border border-indigo-200 hover:bg-indigo-50 py-2 rounded-lg transition-colors"
                  >
                    <Rocket size={12} />
                    Upgrade
                  </Link>
                ) : (
                  <Link
                    href="/build"
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 py-2 rounded-lg transition-colors"
                  >
                    <Plus size={12} />
                    New site
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

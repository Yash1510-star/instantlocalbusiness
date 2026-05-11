"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { Globe, Plus, LogOut, ExternalLink, Clock, Sparkles, Rocket, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import type { SavedSite } from "@/lib/site-store";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [sites, setSites] = useState<SavedSite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    fetch("/api/my-sites")
      .then((r) => r.json())
      .then((data) => {
        if (data.sites) setSites(data.sites);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading…</div>
      </div>
    );
  }

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://instantlocalbusiness.com";

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ""}!
          </h1>
          <p className="text-sm text-gray-500 mt-1">{user?.primaryEmailAddress?.emailAddress}</p>
        </div>
        <button
          onClick={() => signOut({ redirectUrl: "/" })}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>

      {/* Quick action — gated at 2 sites */}
      {!loading && sites.length >= 1 ? (
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
              href="/signup"
              className="flex-1 flex items-center justify-center gap-1.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 py-2.5 rounded-xl transition-colors"
            >
              <Rocket size={14} />
              Sign up for Pro
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

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="border border-gray-100 rounded-2xl p-5 animate-pulse bg-gray-50 h-32" />
          ))}
        </div>
      ) : sites.length === 0 ? (
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
                {sites.length >= 1 ? (
                  <Link
                    href="/signup"
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

"use client";

import type { GeneratedSite } from "@/lib/generate-site";
import { AISiteRenderer } from "@/components/AISiteRenderer";

export function PublicSite({
  site,
  businessName,
  plan = "starter",
  publishedAt,
}: {
  site: GeneratedSite;
  businessName: string;
  plan?: "starter" | "pro" | "business";
  publishedAt?: string;
}) {
  if (!site || !site.colorScheme) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <p>Site data is unavailable. Please try again later.</p>
      </div>
    );
  }

  // Show expiry warning in the last 3 days of a free trial
  const trialBanner = (() => {
    if (plan !== "starter" || !publishedAt) return null;
    const ageDays = (Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60 * 24);
    const daysLeft = Math.ceil(15 - ageDays);
    if (daysLeft > 3 || daysLeft <= 0) return null;
    return daysLeft;
  })();

  return (
    <>
      {trialBanner !== null && (
        <div className="bg-amber-500 text-white text-xs font-semibold px-4 py-2.5 flex items-center justify-center gap-3 text-center">
          <span>
            ⚠️ This free site expires in{" "}
            <strong>{trialBanner} day{trialBanner !== 1 ? "s" : ""}</strong>.
          </span>
          <a href="/pricing" className="underline underline-offset-2 hover:text-white/80 whitespace-nowrap">
            Upgrade to keep it live →
          </a>
        </div>
      )}

      {/* Render the exact same layout the customer saw when building */}
      <AISiteRenderer site={site} compact={false} readonly={true} />
    </>
  );
}

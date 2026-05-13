import { NextRequest, NextResponse } from "next/server";
import { getSite } from "@/lib/site-store";

const RESERVED = new Set([
  "www", "api", "app", "admin", "dashboard", "blog", "help", "support",
  "pricing", "about", "contact", "demo", "preview", "build", "signin",
  "signup", "login", "logout", "terms", "privacy", "sitemap",
]);

function isValidSlug(slug: string): boolean {
  return /^[a-z0-9][a-z0-9-]{1,50}[a-z0-9]$/.test(slug) && !slug.includes("--");
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug")?.toLowerCase().trim() ?? "";

  if (!slug) return NextResponse.json({ available: false, error: "Slug is required" });
  if (RESERVED.has(slug)) return NextResponse.json({ available: false, error: "This name is reserved" });
  if (!isValidSlug(slug)) {
    return NextResponse.json({
      available: false,
      error: "Use only letters, numbers, and hyphens (min 3 chars)",
    });
  }

  const existing = await getSite(slug);
  return NextResponse.json({ available: !existing });
}

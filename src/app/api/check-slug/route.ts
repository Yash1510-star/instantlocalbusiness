import { NextRequest, NextResponse } from "next/server";
import { getSite } from "@/lib/site-store";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { RESERVED_SLUGS, isValidSlug } from "@/lib/slug-rules";

export async function GET(req: NextRequest) {
  const ip = getClientIP(req);
  const rl = await checkRateLimit(ip, "default");
  if (!rl.success) {
    return NextResponse.json({ available: false, error: "Too many requests" }, { status: 429 });
  }

  const slug = req.nextUrl.searchParams.get("slug")?.toLowerCase().trim() ?? "";

  if (!slug) return NextResponse.json({ available: false, error: "Slug is required" });
  if (RESERVED_SLUGS.has(slug)) return NextResponse.json({ available: false, error: "This name is reserved" });
  if (!isValidSlug(slug)) {
    return NextResponse.json({
      available: false,
      error: "Use only letters, numbers, and hyphens (min 3 chars)",
    });
  }

  const existing = await getSite(slug);
  return NextResponse.json({ available: !existing });
}

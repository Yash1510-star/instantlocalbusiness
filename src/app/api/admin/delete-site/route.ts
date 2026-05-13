import { NextRequest, NextResponse } from "next/server";
import { deleteSite, getSite } from "@/lib/site-store";

/**
 * Admin endpoint to delete a published site from Redis.
 *
 * Usage:
 *   curl -X DELETE https://instantlocalbusiness.com/api/admin/delete-site \
 *     -H "Content-Type: application/json" \
 *     -H "x-admin-secret: YOUR_ADMIN_SECRET" \
 *     -d '{"slug":"some-site-slug"}'
 *
 * Set ADMIN_SECRET in Vercel environment variables.
 */
export async function DELETE(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let slug: string;
  try {
    const body = await req.json() as { slug?: string };
    slug = body.slug?.trim() ?? "";
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const existing = await getSite(slug);
  if (!existing) {
    return NextResponse.json({ error: `No site found with slug "${slug}"` }, { status: 404 });
  }

  await deleteSite(slug);

  console.log(`[admin] Deleted site slug="${slug}" businessName="${existing.businessName}"`);

  return NextResponse.json({
    success: true,
    deleted: { slug, businessName: existing.businessName, publishedAt: existing.publishedAt },
  });
}

/**
 * List all sites for a user (useful for finding slugs to delete).
 *
 * Usage:
 *   curl "https://instantlocalbusiness.com/api/admin/delete-site?userId=user_xxx" \
 *     -H "x-admin-secret: YOUR_ADMIN_SECRET"
 */
export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Pass ?slug=... to look up a site" }, { status: 400 });
  }

  const site = await getSite(slug);
  if (!site) {
    return NextResponse.json({ error: `No site found with slug "${slug}"` }, { status: 404 });
  }

  return NextResponse.json({
    slug: site.slug,
    businessName: site.businessName,
    businessEmail: site.businessEmail,
    userId: site.userId,
    plan: site.plan,
    status: site.status,
    publishedAt: site.publishedAt,
  });
}

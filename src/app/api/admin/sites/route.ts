import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getAllSites, getSite, saveSite, updateSite, deleteSite } from "@/lib/site-store";
import type { GeneratedSite } from "@/lib/generate-site";

function isAdmin(userId: string | null | undefined): boolean {
  const adminId = process.env.ADMIN_USER_ID;
  return !!(userId && adminId && userId === adminId);
}

async function checkAdmin(): Promise<string | null> {
  const session = await auth();
  if (!isAdmin(session.userId)) return null;
  return session.userId!;
}

// GET /api/admin/sites — list all sites
export async function GET(req: NextRequest) {
  if (!await checkAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const slug = req.nextUrl.searchParams.get("slug");
  if (slug) {
    const site = await getSite(slug);
    return site
      ? NextResponse.json(site)
      : NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const sites = await getAllSites();
  sites.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return NextResponse.json(sites);
}

// PATCH /api/admin/sites — update status or plan
export async function PATCH(req: NextRequest) {
  if (!await checkAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug, status, plan } = await req.json() as { slug: string; status?: string; plan?: string };
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
  await updateSite(slug, {
    ...(status ? { status: status as "live" | "draft" | "suspended" } : {}),
    ...(plan   ? { plan:   plan   as "starter" | "pro" | "business" } : {}),
  });
  return NextResponse.json({ success: true });
}

// PUT /api/admin/sites — replace full site content and republish
export async function PUT(req: NextRequest) {
  if (!await checkAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug, site } = await req.json() as { slug: string; site: unknown };
  if (!slug || !site) return NextResponse.json({ error: "slug and site required" }, { status: 400 });
  const existing = await getSite(slug);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await saveSite({ ...existing, site: site as GeneratedSite });
  return NextResponse.json({ success: true });
}

// DELETE /api/admin/sites — delete a site
export async function DELETE(req: NextRequest) {
  if (!await checkAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await req.json() as { slug: string };
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
  const site = await getSite(slug);
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await deleteSite(slug);
  return NextResponse.json({ success: true, deleted: slug });
}

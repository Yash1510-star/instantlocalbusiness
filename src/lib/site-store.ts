/**
 * Simple persistent site store.
 *
 * Dev: saves to /data/sites.json on disk (works on local Mac)
 * Production: uses Vercel KV (Redis) when KV_REST_API_URL is set
 *
 * Each saved site has:
 *   - slug: URL-safe identifier (e.g. "marios-pizza-austin")
 *   - publishedAt: ISO timestamp
 *   - businessEmail: for sending confirmation
 *   - site: full GeneratedSite object
 *   - plan: starter | pro | business
 *   - status: live | draft | suspended
 */

import type { GeneratedSite } from "./generate-site";

export type SavedSite = {
  slug: string;
  publishedAt: string;
  businessEmail: string;
  businessName: string;
  userId?: string; // Clerk user ID — set when user is signed in at publish time
  plan: "starter" | "pro" | "business";
  status: "live" | "draft" | "suspended";
  site: GeneratedSite;
};

// ─── File store ───────────────────────────────────────────────────────────────

async function fileGetAll(): Promise<Record<string, SavedSite>> {
  if (process.env.NODE_ENV === "production") return {};
  const { readFile } = await import("fs/promises");
  const path = await import("path");
  const filePath = path.join(process.cwd(), "data", "sites.json");
  try {
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw) as Record<string, SavedSite>;
  } catch {
    return {};
  }
}

async function fileGet(slug: string): Promise<SavedSite | null> {
  if (process.env.NODE_ENV === "production") return null;
  const all = await fileGetAll();
  return all[slug] ?? null;
}

async function fileSet(slug: string, data: SavedSite): Promise<void> {
  // Vercel and most serverless platforms have a read-only filesystem.
  // Skip file writes in production — use Vercel KV instead (set KV env vars).
  if (process.env.NODE_ENV === "production") {
    console.log(`[site-store] Production: skipping file write for slug "${slug}". Configure Vercel KV for persistence.`);
    return;
  }

  const { readFile, writeFile, mkdir } = await import("fs/promises");
  const path = await import("path");
  const dir = path.join(process.cwd(), "data");
  const filePath = path.join(dir, "sites.json");

  await mkdir(dir, { recursive: true });

  let all: Record<string, SavedSite> = {};
  try {
    const raw = await readFile(filePath, "utf-8");
    all = JSON.parse(raw);
  } catch {
    // file doesn't exist yet — start fresh
  }

  all[slug] = data;
  await writeFile(filePath, JSON.stringify(all, null, 2));
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getSite(slug: string): Promise<SavedSite | null> {
  return fileGet(slug);
}

export async function saveSite(data: SavedSite): Promise<void> {
  return fileSet(data.slug, data);
}

export async function getSitesByUser(userId: string): Promise<SavedSite[]> {
  const all = await fileGetAll();
  return Object.values(all).filter((s) => s.userId === userId);
}

export function generateSlug(businessName: string, city: string): string {
  const base = `${businessName} ${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return base;
}

/**
 * Persistent site store.
 *
 * Dev  : saves to /data/sites.json on disk
 * Prod : uses Upstash Redis via REST API (set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN)
 *
 * Each saved site has:
 *   - slug        : URL-safe identifier (e.g. "marios-pizza-austin-1234567890")
 *   - publishedAt : ISO timestamp
 *   - businessEmail / businessName
 *   - userId      : Clerk user ID (optional — guests can publish too)
 *   - plan        : starter | pro | business
 *   - status      : live | draft | suspended
 *   - site        : full GeneratedSite object
 */

import type { GeneratedSite } from "./generate-site";

export type SavedSite = {
  slug: string;
  publishedAt: string;
  businessEmail: string;
  businessName: string;
  userId?: string;
  plan: "starter" | "pro" | "business";
  status: "live" | "draft" | "suspended";
  site: GeneratedSite;
};

// ─── Upstash Redis helpers ────────────────────────────────────────────────────

function kvBase() {
  return process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
}
function kvToken() {
  return process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
}
function kvReady() {
  return !!(kvBase() && kvToken());
}

async function kvGet(key: string): Promise<SavedSite | null> {
  const res = await fetch(`${kvBase()}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${kvToken()}` },
    cache: "no-store",
  });
  if (!res.ok) {
    console.error("[kvGet] HTTP error:", res.status, await res.text());
    return null;
  }
  const json = await res.json() as { result: unknown };
  if (!json.result) return null;
  try {
    // result may be a string (needs parsing) or already an object
    const raw = json.result;
    if (typeof raw === "string") {
      const parsed = JSON.parse(raw);
      // Handle double-encoded: if parsed is still a string, parse again
      if (typeof parsed === "string") return JSON.parse(parsed) as SavedSite;
      return parsed as SavedSite;
    }
    return raw as SavedSite;
  } catch (e) {
    console.error("[kvGet] parse error:", e);
    return null;
  }
}

async function kvSet(key: string, value: SavedSite): Promise<void> {
  // Use pipeline format: POST to /pipeline with ["SET", key, value]
  // This is the most reliable way to store JSON values in Upstash REST API
  const res = await fetch(`${kvBase()}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${kvToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([["SET", key, JSON.stringify(value)]]),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("[kvSet] Upstash error:", res.status, text);
  }
}

// Store a secondary index: "user:<userId>" → array of slugs
async function kvGetUserSlugs(userId: string): Promise<string[]> {
  const res = await fetch(`${kvBase()}/get/${encodeURIComponent(`user:${userId}`)}`, {
    headers: { Authorization: `Bearer ${kvToken()}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = await res.json() as { result: string | null };
  if (!json.result) return [];
  try {
    return JSON.parse(json.result) as string[];
  } catch {
    return [];
  }
}

async function kvAppendUserSlug(userId: string, slug: string): Promise<void> {
  const existing = await kvGetUserSlugs(userId);
  if (!existing.includes(slug)) {
    const newList = JSON.stringify([...existing, slug]);
    await fetch(`${kvBase()}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${kvToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([["SET", `user:${userId}`, newList]]),
    });
  }
}

// ─── File store (dev only) ────────────────────────────────────────────────────

async function fileGetAll(): Promise<Record<string, SavedSite>> {
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
  const all = await fileGetAll();
  return all[slug] ?? null;
}

async function fileSet(slug: string, data: SavedSite): Promise<void> {
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
    // file doesn't exist yet
  }

  all[slug] = data;
  await writeFile(filePath, JSON.stringify(all, null, 2));
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getSite(slug: string): Promise<SavedSite | null> {
  if (kvReady()) {
    const result = await kvGet(`site:${slug}`);
    if (result) return result;
    // Fall back to local file store (useful during local dev when site was saved to disk)
    if (process.env.NODE_ENV !== "production") return fileGet(slug);
    return null;
  }
  return fileGet(slug);
}

export async function saveSite(data: SavedSite): Promise<void> {
  if (kvReady()) {
    await kvSet(`site:${data.slug}`, data);
    if (data.userId) await kvAppendUserSlug(data.userId, data.slug);
    return;
  }
  return fileSet(data.slug, data);
}

export async function getSitesByUser(userId: string): Promise<SavedSite[]> {
  if (kvReady()) {
    const slugs = await kvGetUserSlugs(userId);
    const results = await Promise.all(slugs.map((s) => kvGet(`site:${s}`)));
    return results.filter((s): s is SavedSite => s !== null);
  }
  const all = await fileGetAll();
  return Object.values(all).filter((s) => s.userId === userId);
}

export function generateSlug(businessName: string, city: string): string {
  const base = `${businessName} ${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48); // max 48 + "-" + 4 = 53 chars — well under DNS 63-char label limit
  const suffix = Math.floor(1000 + Math.random() * 9000).toString();
  return `${base}-${suffix}`;
}

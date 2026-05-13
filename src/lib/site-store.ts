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

const FREE_TRIAL_TTL_SECONDS = 15 * 24 * 60 * 60; // 15 days

async function kvSet(key: string, value: SavedSite): Promise<void> {
  // Starter sites auto-expire from Redis after 15 days — no cron needed
  const cmd: unknown[] =
    value.plan === "starter"
      ? ["SET", key, JSON.stringify(value), "EX", FREE_TRIAL_TTL_SECONDS]
      : ["SET", key, JSON.stringify(value)];

  const res = await fetch(`${kvBase()}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${kvToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([cmd]),
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

async function kvScanAllSites(): Promise<SavedSite[]> {
  const keys: string[] = [];
  let cursor = "0";
  do {
    const res = await fetch(
      `${kvBase()}/scan/${cursor}/match/site:*/count/200`,
      { headers: { Authorization: `Bearer ${kvToken()}` }, cache: "no-store" }
    );
    if (!res.ok) break;
    const json = await res.json() as { result: [string, string[]] };
    cursor = json.result[0];
    keys.push(...json.result[1]);
  } while (cursor !== "0");
  const sites = await Promise.all(keys.map(k => kvGet(k)));
  return sites.filter((s): s is SavedSite => s !== null);
}

async function kvDelete(key: string): Promise<void> {
  await fetch(`${kvBase()}/del/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${kvToken()}` },
  });
}

async function kvRemoveUserSlug(userId: string, slug: string): Promise<void> {
  const existing = await kvGetUserSlugs(userId);
  const updated = existing.filter(s => s !== slug);
  await fetch(`${kvBase()}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${kvToken()}`, "Content-Type": "application/json" },
    body: JSON.stringify([["SET", `user:${userId}`, JSON.stringify(updated)]]),
  });
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

export async function getAllSites(): Promise<SavedSite[]> {
  if (kvReady()) return kvScanAllSites();
  const all = await fileGetAll();
  return Object.values(all);
}

export async function updateSite(slug: string, patch: Partial<Pick<SavedSite, "status" | "plan">>): Promise<void> {
  const site = await getSite(slug);
  if (!site) return;
  const updated: SavedSite = { ...site, ...patch };
  if (kvReady()) {
    await kvSet(`site:${slug}`, updated);
    return;
  }
  await fileSet(slug, updated);
}

export async function deleteSite(slug: string): Promise<void> {
  if (kvReady()) {
    const site = await kvGet(`site:${slug}`);
    await kvDelete(`site:${slug}`);
    if (site?.userId) await kvRemoveUserSlug(site.userId, slug);
    return;
  }
  // Dev: remove from file store
  const { readFile, writeFile } = await import("fs/promises");
  const path = await import("path");
  const filePath = path.join(process.cwd(), "data", "sites.json");
  try {
    const raw = await readFile(filePath, "utf-8");
    const all = JSON.parse(raw) as Record<string, SavedSite>;
    delete all[slug];
    await writeFile(filePath, JSON.stringify(all, null, 2));
  } catch { /* file doesn't exist */ }
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

function toSlugPart(text: string, maxLen = 40): string {
  return text
    .toLowerCase()
    .replace(/[^a-z]+/g, "-") // letters only — strip numbers so phone/address don't leak in
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, maxLen);
}

export async function generateSlug(businessName: string, city: string): Promise<string> {
  const namePart = toSlugPart(businessName, 40);
  const cityPart = toSlugPart(city, 20);

  // Preferred: just the business name — cleanest branding
  if (namePart && !(await getSite(namePart))) return namePart;

  // Try: name + city
  if (cityPart) {
    const withCity = `${namePart}-${cityPart}`.slice(0, 53);
    if (!(await getSite(withCity))) return withCity;
  }

  // Try: name + incrementing number (2, 3, …)
  for (let i = 2; i <= 20; i++) {
    const candidate = `${namePart}-${i}`;
    if (!(await getSite(candidate))) return candidate;
  }

  // Last resort: name + 4-digit random
  return `${namePart}-${Math.floor(1000 + Math.random() * 9000)}`;
}

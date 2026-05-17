/**
 * Persistent subscription store.
 *
 * Dev  : saves to /data/subscriptions.json on disk
 * Prod : uses Upstash Redis via REST API (set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN)
 *
 * Each subscription has:
 *   - userId               : Clerk user ID
 *   - plan                 : starter | pro | business
 *   - status               : active | trialing | past_due | canceled | incomplete | incomplete_expired | unpaid | paused
 *   - stripeCustomerId     : Stripe customer ID
 *   - stripeSubscriptionId : Stripe subscription ID
 *   - stripePriceId        : Stripe price ID
 *   - currentPeriodEnd     : ISO timestamp
 *   - cancelAtPeriodEnd    : whether subscription cancels at period end
 *   - trialEnd             : ISO timestamp (optional)
 *   - updatedAt             : ISO timestamp
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "unpaid"
  | "paused";

export type Plan = "starter" | "pro" | "business";

export type UserSubscription = {
  userId: string;
  plan: Plan;
  status: SubscriptionStatus;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
  updatedAt: string;
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

async function kvGet(key: string): Promise<UserSubscription | null> {
  const res = await fetch(`${kvBase()}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${kvToken()}` },
    cache: "no-store",
  });
  if (!res.ok) {
    console.error("[kvGet] HTTP error:", res.status, await res.text());
    return null;
  }
  const json = (await res.json()) as { result: unknown };
  if (!json.result) return null;
  try {
    const raw = json.result;
    if (typeof raw === "string") {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "string")
        return JSON.parse(parsed) as UserSubscription;
      return parsed as UserSubscription;
    }
    return raw as UserSubscription;
  } catch (e) {
    console.error("[kvGet] parse error:", e);
    return null;
  }
}

async function kvSet(key: string, value: UserSubscription): Promise<void> {
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

async function kvDel(key: string): Promise<void> {
  const res = await fetch(`${kvBase()}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${kvToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([["DEL", key]]),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("[kvDel] Upstash error:", res.status, text);
  }
}

// ─── File store (dev only) ────────────────────────────────────────────────────

async function fileGetAll(): Promise<Record<string, UserSubscription>> {
  const { readFile } = await import("fs/promises");
  const path = await import("path");
  const filePath = path.join(process.cwd(), "data", "subscriptions.json");
  try {
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw) as Record<string, UserSubscription>;
  } catch {
    return {};
  }
}

async function fileGet(userId: string): Promise<UserSubscription | null> {
  const all = await fileGetAll();
  return all[userId] ?? null;
}

async function fileSet(userId: string, data: UserSubscription): Promise<void> {
  const { readFile, writeFile, mkdir } = await import("fs/promises");
  const path = await import("path");
  const dir = path.join(process.cwd(), "data");
  const filePath = path.join(dir, "subscriptions.json");

  await mkdir(dir, { recursive: true });

  let all: Record<string, UserSubscription> = {};
  try {
    const raw = await readFile(filePath, "utf-8");
    all = JSON.parse(raw);
  } catch {
    // file doesn't exist yet
  }

  all[userId] = data;
  await writeFile(filePath, JSON.stringify(all, null, 2));
}

async function fileDel(userId: string): Promise<void> {
  const { readFile, writeFile, mkdir } = await import("fs/promises");
  const path = await import("path");
  const dir = path.join(process.cwd(), "data");
  const filePath = path.join(dir, "subscriptions.json");

  await mkdir(dir, { recursive: true });

  let all: Record<string, UserSubscription> = {};
  try {
    const raw = await readFile(filePath, "utf-8");
    all = JSON.parse(raw);
  } catch {
    return;
  }

  delete all[userId];
  await writeFile(filePath, JSON.stringify(all, null, 2));
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Get a user's subscription. Returns null if none exists. */
export async function getSubscription(
  userId: string
): Promise<UserSubscription | null> {
  if (kvReady()) return kvGet(`sub:${userId}`);
  return fileGet(userId);
}

/** Save (upsert) a user's subscription. */
export async function saveSubscription(sub: UserSubscription): Promise<void> {
  if (kvReady()) return kvSet(`sub:${sub.userId}`, sub);
  return fileSet(sub.userId, sub);
}

/** Delete a user's subscription. */
export async function deleteSubscription(userId: string): Promise<void> {
  if (kvReady()) return kvDel(`sub:${userId}`);
  return fileDel(userId);
}

/**
 * Get the effective plan for a user.
 * Returns the subscription plan if status is "active" or "trialing",
 * otherwise falls back to "starter".
 */
export async function getEffectivePlan(userId: string): Promise<Plan> {
  const sub = await getSubscription(userId);
  if (!sub) return "starter";
  if (sub.status === "active" || sub.status === "trialing") return sub.plan;
  return "starter";
}

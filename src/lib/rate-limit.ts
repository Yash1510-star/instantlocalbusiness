/**
 * Rate limiting for AI routes.
 *
 * PRODUCTION: Requires Upstash Redis (persistent across serverless instances).
 *   Sign up free at https://upstash.com — takes 2 min.
 *   Free tier: 10,000 requests/day — more than enough to start.
 *   Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN in Vercel env vars.
 *
 * DEV: Falls back to in-memory (resets on restart — fine for local testing).
 *
 * Limits:
 *   /api/generate  — 3 site builds per IP per day     ($0.009 max cost/IP/day)
 *   /api/publish   — 5 publishes per IP per day
 *   /api/contact   — 5 submissions per IP per hour
 */

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  resetAt: number;
};

type RouteConfig = {
  limit: number;
  windowMs: number;
};

const ROUTE_CONFIGS: Record<string, RouteConfig> = {
  generate: { limit: 10, windowMs: 24 * 60 * 60 * 1000 }, // 10/day per IP (raise to 3 after testing)
  publish:  { limit: 10, windowMs: 24 * 60 * 60 * 1000 }, // 10/day per IP
  contact:  { limit: 5,  windowMs: 60 * 60 * 1000       }, // 5/hour per IP
  default:  { limit: 20, windowMs: 60 * 60 * 1000       },
};

// ─── In-memory fallback (dev only — NOT safe for production) ─────────────────

const memoryStore = new Map<string, { count: number; resetAt: number }>();

function memoryRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const entry = memoryStore.get(key);
  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    memoryStore.set(key, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt };
  }
  if (entry.count >= limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }
  entry.count += 1;
  return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

// ─── Upstash Redis (production) ───────────────────────────────────────────────

async function upstashRateLimit(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
  const { Ratelimit } = await import("@upstash/ratelimit");
  const { Redis } = await import("@upstash/redis");

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${windowMs}ms`),
    prefix: "ilb",
  });

  const result = await ratelimit.limit(key);
  return {
    success: result.success,
    remaining: result.remaining,
    resetAt: result.reset,
  };
}

// ─── Main export ──────────────────────────────────────────────────────────────

const isProduction = process.env.NODE_ENV === "production";

export async function checkRateLimit(
  ip: string,
  route: keyof typeof ROUTE_CONFIGS | "default" = "default"
): Promise<RateLimitResult> {
  const config = ROUTE_CONFIGS[route] ?? ROUTE_CONFIGS.default;
  const key = `rl:${route}:${ip}`;

  // Support both Vercel Upstash integration (KV_*) and direct Upstash keys (UPSTASH_*)
  const redisUrl = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    // Temporarily set for the Upstash client
    process.env.UPSTASH_REDIS_REST_URL = redisUrl;
    process.env.UPSTASH_REDIS_REST_TOKEN = redisToken;
    try {
      return await upstashRateLimit(key, config.limit, config.windowMs);
    } catch (err) {
      console.error("[rate-limit] Upstash error:", err);
      // In production, fail CLOSED (block request) if Redis is down
      // This prevents bypassing limits during an outage
      if (isProduction) {
        return { success: false, remaining: 0, resetAt: Date.now() + 60_000 };
      }
      // In dev, fall through to memory
    }
  }

  if (isProduction) {
    // Production without Upstash configured — warn loudly and allow (don't silently break)
    console.warn(
      "[rate-limit] WARNING: No Upstash configured in production! " +
      "Rate limiting is DISABLED. Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN."
    );
  }

  return memoryRateLimit(key, config.limit, config.windowMs);
}

export function getClientIP(req: Request): string {
  // Vercel sets cf-connecting-ip for Cloudflare, x-forwarded-for otherwise
  const cfIP = req.headers.get("cf-connecting-ip");
  if (cfIP) return cfIP.trim();
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

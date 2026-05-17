import { NextRequest, NextResponse } from "next/server";
import { generateSiteContent, type BusinessInput } from "@/lib/generate-site";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { guardInputs } from "@/lib/input-guard";
import { auth } from "@clerk/nextjs/server";
import { getSitesByUser } from "@/lib/site-store";
import { getEffectivePlan, type Plan } from "@/lib/subscription-store";

const PLAN_SITE_LIMITS: Record<Plan, number> = {
  starter: 1,
  pro: 10,
  business: Infinity,
};

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    // ── Origin check — block requests not from our own domain ──────────────
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_SITE_URL,
      `http://localhost:3000`,
      `http://localhost:3001`,
      host ? `https://${host}` : null,
    ].filter(Boolean);

    if (
      process.env.NODE_ENV === "production" &&
      origin &&
      !allowedOrigins.some((o) => o && origin.startsWith(o))
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ── Rate limit: 3 site generations per IP per day ──────────────────────
    const ip = getClientIP(req);
    const rl = await checkRateLimit(ip, "generate");
    if (!rl.success) {
      const resetMins = Math.ceil((rl.resetAt - Date.now()) / 60000);
      const resetHrs = Math.ceil(resetMins / 60);
      const resetMsg = resetMins < 60
        ? `${resetMins} minute${resetMins === 1 ? "" : "s"}`
        : `${resetHrs} hour${resetHrs === 1 ? "" : "s"}`;
      return NextResponse.json(
        { error: `You can generate again in ${resetMsg}.` },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // ── Per-user site cap (signed-in users only) ───────────────────────────
    try {
      const { userId } = await auth();
      const capDisabled = process.env.DISABLE_SITE_CAP === "true" && process.env.NODE_ENV !== "production";
      if (userId && !capDisabled) {
        const existing = await getSitesByUser(userId);
        const plan = await getEffectivePlan(userId);
        const limit = PLAN_SITE_LIMITS[plan];
        if (existing.length >= limit) {
          return NextResponse.json(
            { error: `Your ${plan} plan is limited to ${limit} websites. Upgrade for more.` },
            { status: 403 }
          );
        }
      }
    } catch {
      // If auth check fails, continue — IP rate-limit is still active
    }

    const body = await req.json() as BusinessInput;

    // ── Input guard: length + injection + junk ─────────────────────────────
    const guard = guardInputs({
      businessName:       body.businessName,
      category:           body.category,
      city:               body.city,
      state:              body.state,
      phone:              body.phone,
      email:              body.email,
      address:            body.address,
      website:            body.website,
      description:        body.description,
      services:           body.services,
      hours:              body.hours,
      specialties:        body.specialties,
      priceRange:         body.priceRange,
      yearsInBusiness:    body.yearsInBusiness,
      teamSize:           body.teamSize,
      certifications:     body.certifications,
      paymentMethods:     body.paymentMethods,
      parking:            body.parking,
      socialMedia:        body.socialMedia,
      uniqueSellingPoint: body.uniqueSellingPoint,
    });
    if (!guard.ok) {
      return NextResponse.json({ error: guard.error }, { status: 400 });
    }

    // ── Required fields ────────────────────────────────────────────────────
    const required: (keyof BusinessInput)[] = [
      "businessName", "category", "city", "state", "phone", "email", "description",
    ];
    for (const field of required) {
      if (!body[field]?.toString().trim()) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // ── AI key check ───────────────────────────────────────────────────────
    const hasKey =
      process.env.OPENAI_API_KEY ||
      process.env.ANTHROPIC_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.DEEPSEEK_API_KEY;

    if (!hasKey) {
      return NextResponse.json(
        { error: "No AI API key configured. Add OPENAI_API_KEY to .env.local" },
        { status: 503 }
      );
    }

    const site = await generateSiteContent(body);
    return NextResponse.json({ success: true, site });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/generate]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { saveSite, getSite, getSitesByUser, generateSlug, type SavedSite } from "@/lib/site-store";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import type { GeneratedSite } from "@/lib/generate-site";
import { RESERVED_SLUGS, isValidSlug } from "@/lib/slug-rules";

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

const FREE_SITE_LIMIT = 1;

export const maxDuration = 15;

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIP(req);
    const rl = await checkRateLimit(ip, "publish");
    if (!rl.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // Require authentication — guests cannot publish
    const session = await auth();
    const userId = session.userId ?? undefined;
    if (!userId) {
      return NextResponse.json(
        { error: "You must be signed in to publish a website." },
        { status: 401 }
      );
    }

    // Enforce per-user site cap
    const capDisabled = process.env.DISABLE_SITE_CAP === "true" && process.env.NODE_ENV !== "production";
    if (!capDisabled) {
      const existing = await getSitesByUser(userId);
      if (existing.length >= FREE_SITE_LIMIT) {
        return NextResponse.json(
          { error: `Free accounts are limited to ${FREE_SITE_LIMIT} websites. Upgrade to Pro for unlimited sites.` },
          { status: 403 }
        );
      }
    }

    const body = await req.json() as {
      site: GeneratedSite;
      businessName: string;
      businessEmail: string;
      city: string;
      customSlug?: string;
    };

    if (!body.site || !body.businessName || !body.businessEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let slug: string;
    if (body.customSlug) {
      const clean = body.customSlug.toLowerCase().trim();
      if (!isValidSlug(clean) || RESERVED_SLUGS.has(clean)) {
        return NextResponse.json({ error: "Invalid or reserved subdomain" }, { status: 400 });
      }
      const existing = await getSite(clean);
      if (existing) {
        return NextResponse.json({ error: "That subdomain is already taken. Please choose another." }, { status: 409 });
      }
      slug = clean;
    } else {
      slug = await generateSlug(body.businessName, body.city ?? "");
    }

    const savedSite: SavedSite = {
      slug,
      publishedAt: new Date().toISOString(),
      businessEmail: body.businessEmail,
      businessName: body.businessName,
      userId,
      plan: "starter", // always server-assigned; never trust client
      status: "live",
      site: body.site,
    };

    await saveSite(savedSite);
    console.log(`[publish] Saved site slug="${slug}" kvReady=${!!((process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) && (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN))}`);

    const rootDomain = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://instantlocalbusiness.com")
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "");
    const siteSubdomain = `https://${slug}.${rootDomain}`;

    // Send confirmation emails via Zoho SMTP (non-fatal if email fails)
    try {
      const { sendEmail } = await import("@/lib/mailer");
      const siteUrl = siteSubdomain;

      await sendEmail({
        to: body.businessEmail,
        subject: `Your website is live — ${body.businessName}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
            <h1 style="font-size:24px;font-weight:800;color:#111;margin:0 0 8px">Your site is live!</h1>
            <p style="color:#6b7280;font-size:15px;margin:0 0 24px">
              ${esc(body.businessName)} is now published and accessible to anyone on the internet.
            </p>
            <a href="${esc(siteUrl)}"
              style="display:inline-block;background:#2563eb;color:#fff;font-weight:700;padding:14px 28px;border-radius:10px;text-decoration:none;font-size:15px">
              View your site →
            </a>
            <p style="margin-top:24px;color:#9ca3af;font-size:13px">
              Your site URL: <a href="${esc(siteUrl)}" style="color:#2563eb">${esc(siteUrl)}</a>
            </p>
            <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb"/>
            <p style="color:#6b7280;font-size:13px">
              Want a custom domain? <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://instantlocalbusiness.com"}/pricing" style="color:#2563eb">Upgrade to Pro →</a>
            </p>
            <p style="color:#9ca3af;font-size:12px;margin-top:16px">— The Instant Local Business team</p>
          </div>
        `,
      });

      await sendEmail({
        to: "hello@instantlocalbusiness.com",
        subject: `New site published: ${body.businessName}`,
        html: `
          <div style="font-family:sans-serif;padding:16px">
            <h2>${esc(body.businessName)}</h2>
            <p>Email: ${esc(body.businessEmail)}</p>
            <p>Plan: ${esc(savedSite.plan)}</p>
            <p>Slug: ${esc(slug)}</p>
            <p>URL: <a href="${esc(siteSubdomain)}">${esc(siteSubdomain)}</a></p>
            <p>Published: ${esc(savedSite.publishedAt)}</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("[publish] Email error:", emailErr);
    }

    return NextResponse.json({
      success: true,
      slug,
      url: siteSubdomain,
    });
  } catch (err) {
    console.error("[/api/publish]", err);
    return NextResponse.json({ error: "Failed to publish site. Please try again." }, { status: 500 });
  }
}

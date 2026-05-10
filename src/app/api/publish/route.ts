import { NextRequest, NextResponse } from "next/server";
import { saveSite, getSite, generateSlug, type SavedSite } from "@/lib/site-store";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import type { GeneratedSite } from "@/lib/generate-site";

export const maxDuration = 15;

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIP(req);
    const rl = await checkRateLimit(ip, "default");
    if (!rl.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json() as {
      site: GeneratedSite;
      businessName: string;
      businessEmail: string;
      city: string;
      plan?: "starter" | "pro" | "business";
    };

    if (!body.site || !body.businessName || !body.businessEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate a clean, unique slug
    let slug = generateSlug(body.businessName, body.city ?? "");
    const existing = await getSite(slug);
    if (existing) {
      // Append timestamp suffix to avoid collision
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const savedSite: SavedSite = {
      slug,
      publishedAt: new Date().toISOString(),
      businessEmail: body.businessEmail,
      businessName: body.businessName,
      plan: body.plan ?? "starter",
      status: "live",
      site: body.site,
    };

    await saveSite(savedSite);

    // Send confirmation email if Resend is configured
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend: ResendClient } = await import("resend");
        const resend = new ResendClient(process.env.RESEND_API_KEY);
        const siteUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://instantlocalbusiness.com"}/sites/${slug}`;

        await resend.emails.send({
          from: "noreply@instantlocalbusiness.com",
          to: body.businessEmail,
          subject: `Your website is live — ${body.businessName}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
              <h1 style="font-size:24px;font-weight:800;color:#111;margin:0 0 8px">
                Your site is live!
              </h1>
              <p style="color:#6b7280;font-size:15px;margin:0 0 24px">
                ${body.businessName} is now published and accessible to anyone on the internet.
              </p>
              <a href="${siteUrl}"
                style="display:inline-block;background:#2563eb;color:#fff;font-weight:700;padding:14px 28px;border-radius:10px;text-decoration:none;font-size:15px">
                View your site →
              </a>
              <p style="margin-top:24px;color:#9ca3af;font-size:13px">
                Your site URL: <a href="${siteUrl}" style="color:#2563eb">${siteUrl}</a>
              </p>
              <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb"/>
              <p style="color:#6b7280;font-size:13px">
                Want a custom domain like <strong>www.${body.businessName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com</strong>?
                <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://instantlocalbusiness.com"}/pricing" style="color:#2563eb">
                  Upgrade to Pro →
                </a>
              </p>
              <p style="color:#9ca3af;font-size:12px;margin-top:16px">
                — The Instant Local Business team
              </p>
            </div>
          `,
        });

        // Notify admin
        await resend.emails.send({
          from: "noreply@instantlocalbusiness.com",
          to: "hello@instantlocalbusiness.com",
          subject: `New site published: ${body.businessName}`,
          html: `
            <div style="font-family:sans-serif;padding:16px">
              <h2>${body.businessName}</h2>
              <p>Email: ${body.businessEmail}</p>
              <p>Plan: ${savedSite.plan}</p>
              <p>Slug: ${slug}</p>
              <p>URL: <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://instantlocalbusiness.com"}/sites/${slug}">View site</a></p>
              <p>Published: ${savedSite.publishedAt}</p>
            </div>
          `,
        });
      } catch (emailErr) {
        // Don't fail the publish if email fails
        console.error("[publish] Email error:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      slug,
      url: `/sites/${slug}`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/publish]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

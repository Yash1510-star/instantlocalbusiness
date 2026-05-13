import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSite } from "@/lib/site-store";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { guardInputs } from "@/lib/input-guard";

const FROM_EMAIL = "noreply@instantlocalbusiness.com";

function esc(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIP(req);
    const rl = await checkRateLimit(ip, "contact");
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    const { slug, name, contact, message } = await req.json() as {
      slug: string;
      name: string;
      contact: string;
      message?: string;
    };

    if (!slug?.trim() || !name?.trim() || !contact?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const guard = guardInputs({ message: message ?? "" });
    if (!guard.ok) {
      return NextResponse.json({ error: guard.error }, { status: 400 });
    }

    const saved = await getSite(slug);
    if (!saved) {
      console.warn("[site-contact] Site not found for slug:", slug);
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    const toEmail = saved.businessEmail;
    const businessName = saved.businessName;
    const siteUrl = `https://${esc(slug)}.instantlocalbusiness.com`;

    if (!process.env.RESEND_API_KEY) {
      console.warn("[site-contact] RESEND_API_KEY not set — lead NOT sent:", {
        businessName, toEmail, slug, name, contact, message,
      });
      // Still return success so the visitor isn't confused, but log clearly
      return NextResponse.json({ success: true });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      replyTo: contact.includes("@") ? contact : undefined,
      subject: `New lead from your website — ${esc(name)}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff">
          <div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:24px">
            <p style="margin:0;font-size:14px;color:#15803d;font-weight:600">
              🎉 New lead from your website!
            </p>
          </div>
          <h2 style="margin:0 0 16px;font-size:20px;color:#111">New Enquiry — ${esc(businessName)}</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr>
              <td style="padding:8px 0;color:#6b7280;width:120px;vertical-align:top">Name</td>
              <td style="padding:8px 0;font-weight:600;color:#111">${esc(name)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b7280;vertical-align:top">Contact</td>
              <td style="padding:8px 0;color:#111">${esc(contact)}</td>
            </tr>
            ${message?.trim() ? `
            <tr>
              <td style="padding:8px 0;color:#6b7280;vertical-align:top">Message</td>
              <td style="padding:8px 0;color:#111">${esc(message)}</td>
            </tr>
            ` : ""}
          </table>
          <div style="margin-top:24px;padding-top:20px;border-top:1px solid #e5e7eb">
            <p style="margin:0 0 12px;font-size:13px;color:#6b7280">
              Submitted via
              <a href="${siteUrl}" style="color:#2563eb;text-decoration:none">${siteUrl}</a>
            </p>
            <a href="${siteUrl}" style="display:inline-block;background:#2563eb;color:#fff;font-size:13px;font-weight:600;padding:10px 20px;border-radius:8px;text-decoration:none">
              View Your Website →
            </a>
          </div>
          <p style="margin-top:24px;font-size:11px;color:#9ca3af">
            Powered by InstantLocalBusiness.com
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("[site-contact] Resend error:", error);
      return NextResponse.json({ error: "Failed to send. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[site-contact] Unexpected error:", err);
    return NextResponse.json({ error: "Failed to send. Please try again." }, { status: 500 });
  }
}

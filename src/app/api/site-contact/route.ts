import { NextRequest, NextResponse } from "next/server";
import { getSite } from "@/lib/site-store";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { guardInputs } from "@/lib/input-guard";
import { sendEmail } from "@/lib/mailer";

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

    const { slug, name, contact, message, mode, date, time, partySize } = await req.json() as {
      slug: string;
      name: string;
      contact: string;
      message?: string;
      mode?: string;
      date?: string;
      time?: string;
      partySize?: string;
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

    const siteUrl = `https://${esc(slug)}.instantlocalbusiness.com`;

    const isBooking = mode === "appointment" || mode === "reservation";
    const subjectLabel = mode === "reservation" ? "New reservation request" :
                         mode === "appointment" ? "New appointment request" :
                         "New lead";

    const bookingRows = isBooking ? `
      ${date ? `<tr>
        <td style="padding:8px 0;color:#6b7280;width:120px;vertical-align:top">Date</td>
        <td style="padding:8px 0;font-weight:600;color:#111">${esc(date)}</td>
      </tr>` : ""}
      ${time ? `<tr>
        <td style="padding:8px 0;color:#6b7280;vertical-align:top">Time</td>
        <td style="padding:8px 0;font-weight:600;color:#111">${esc(time)}</td>
      </tr>` : ""}
      ${mode === "reservation" && partySize ? `<tr>
        <td style="padding:8px 0;color:#6b7280;vertical-align:top">Party size</td>
        <td style="padding:8px 0;font-weight:600;color:#111">${esc(partySize)} ${parseInt(partySize) === 1 ? "guest" : "guests"}</td>
      </tr>` : ""}
    ` : "";

    const headerColor = mode === "reservation" ? "#7c3aed" : mode === "appointment" ? "#0ea5e9" : "#22c55e";
    const headerBg   = mode === "reservation" ? "#f5f3ff" : mode === "appointment" ? "#f0f9ff" : "#f0fdf4";
    const headerText = mode === "reservation" ? "#5b21b6" : mode === "appointment" ? "#0369a1" : "#15803d";
    const emoji      = mode === "reservation" ? "🗓️" : mode === "appointment" ? "📅" : "🎉";

    const { ok, error } = await sendEmail({
      to: saved.businessEmail,
      replyTo: contact.includes("@") ? contact : undefined,
      subject: `${subjectLabel} from your website — ${esc(name)}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff">
          <div style="background:${headerBg};border-left:4px solid ${headerColor};padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:24px">
            <p style="margin:0;font-size:14px;color:${headerText};font-weight:600">
              ${emoji} ${subjectLabel} from your website!
            </p>
          </div>
          <h2 style="margin:0 0 16px;font-size:20px;color:#111">${subjectLabel} — ${esc(saved.businessName)}</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr>
              <td style="padding:8px 0;color:#6b7280;width:120px;vertical-align:top">Name</td>
              <td style="padding:8px 0;font-weight:600;color:#111">${esc(name)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b7280;vertical-align:top">Contact</td>
              <td style="padding:8px 0;color:#111">${esc(contact)}</td>
            </tr>
            ${bookingRows}
            ${message?.trim() ? `
            <tr>
              <td style="padding:8px 0;color:#6b7280;vertical-align:top">Notes</td>
              <td style="padding:8px 0;color:#111">${esc(message)}</td>
            </tr>` : ""}
          </table>
          <div style="margin-top:24px;padding-top:20px;border-top:1px solid #e5e7eb">
            <p style="margin:0 0 12px;font-size:13px;color:#6b7280">
              Submitted via <a href="${siteUrl}" style="color:#2563eb;text-decoration:none">${siteUrl}</a>
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

    if (!ok) {
      console.error("[site-contact] Email failed:", error);
      return NextResponse.json({ error: "Failed to send. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[site-contact] Unexpected error:", err);
    return NextResponse.json({ error: "Failed to send. Please try again." }, { status: 500 });
  }
}

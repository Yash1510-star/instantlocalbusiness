import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/mailer";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";

function esc(s: string) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Build a Google Calendar "Add to Calendar" link */
function googleCalLink(date: string, time: string, name: string, email: string) {
  // date: "2026-05-20", time: "2:00 PM ET"
  const [year, month, day] = date.split("-").map(Number);
  const isPM = time.includes("PM");
  const [hStr, mStr] = time.replace(/\s?(AM|PM)/, "").split(":");
  let hour = parseInt(hStr);
  if (isPM && hour !== 12) hour += 12;
  if (!isPM && hour === 12) hour = 0;

  const pad = (n: number) => String(n).padStart(2, "0");
  // Treat as Eastern — offset by +5 UTC (EST) for calendar start
  const startUTC = `${year}${pad(month)}${pad(day)}T${pad(hour + 5)}${pad(parseInt(mStr ?? "0"))}00Z`;
  const endHour = hour + 5 + 0; // 20-min meeting end
  const endMin = parseInt(mStr ?? "0") + 20;
  const endUTC = `${year}${pad(month)}${pad(day)}T${pad(endHour)}${pad(endMin % 60)}00Z`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Live Demo — InstantLocalBusiness.com",
    dates: `${startUTC}/${endUTC}`,
    details: `Your free 20-minute demo with the InstantLocalBusiness team.\n\nWe'll walk you through building a complete website live in under 60 seconds.\n\nA Google Meet link will be emailed to ${email} before the meeting.`,
    location: "Google Meet (link sent by email)",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIP(req);
    const rl = await checkRateLimit(ip, "contact");
    if (!rl.success) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const { name, email, phone, businessName, date, time } = await req.json() as {
      name: string; email: string; phone?: string;
      businessName?: string; date: string; time: string;
    };

    if (!name?.trim() || !email?.trim() || !date?.trim() || !time?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const calLink = googleCalLink(date, time, name, email);
    const friendlyDate = new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

    // ── Confirmation to the person who booked ─────────────────────────────
    await sendEmail({
      to: email,
      subject: `Your demo is booked — ${friendlyDate} at ${time} ET`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff">
          <div style="background:#eff6ff;border-left:4px solid #2563eb;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:24px">
            <p style="margin:0;font-size:14px;color:#1d4ed8;font-weight:600">
              ✅ Your demo is confirmed!
            </p>
          </div>
          <h2 style="margin:0 0 4px;font-size:22px;color:#111">See you soon, ${esc(name)}!</h2>
          <p style="color:#6b7280;font-size:14px;margin:0 0 24px">
            Here are the details for your free 20-minute demo.
          </p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px">
            <tr>
              <td style="padding:10px 0;color:#6b7280;width:120px;vertical-align:top">📅 Date</td>
              <td style="padding:10px 0;font-weight:600;color:#111">${friendlyDate}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#6b7280;vertical-align:top">🕐 Time</td>
              <td style="padding:10px 0;font-weight:600;color:#111">${esc(time)} Eastern Time</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#6b7280;vertical-align:top">📍 Where</td>
              <td style="padding:10px 0;color:#111">Google Meet — link will be sent before the meeting</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#6b7280;vertical-align:top">⏱ Duration</td>
              <td style="padding:10px 0;color:#111">20 minutes</td>
            </tr>
          </table>
          <a href="${calLink}"
            style="display:inline-block;background:#2563eb;color:#fff;font-weight:600;padding:12px 24px;border-radius:10px;text-decoration:none;font-size:14px;margin-bottom:24px">
            📆 Add to Google Calendar
          </a>
          <div style="background:#f9fafb;border-radius:12px;padding:16px;margin-bottom:24px">
            <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#374151">What to expect:</p>
            <ul style="margin:0;padding-left:18px;font-size:13px;color:#6b7280;line-height:1.8">
              <li>We'll build a complete website for your business live in under 60 seconds</li>
              <li>You'll see all the customization options</li>
              <li>No sales pressure — just a real demo</li>
            </ul>
          </div>
          <p style="font-size:12px;color:#9ca3af">
            Questions? Reply to this email or reach us at
            <a href="mailto:hello@instantlocalbusiness.com" style="color:#2563eb">hello@instantlocalbusiness.com</a>
          </p>
        </div>
      `,
    });

    // ── Notify admin ──────────────────────────────────────────────────────
    await sendEmail({
      to: "hello@instantlocalbusiness.com",
      subject: `New demo booked — ${esc(name)} on ${friendlyDate} at ${time}`,
      html: `
        <div style="font-family:sans-serif;padding:20px;max-width:500px">
          <h2 style="margin:0 0 16px;color:#111">New Demo Booking</h2>
          <table style="font-size:14px;border-collapse:collapse;width:100%">
            <tr><td style="padding:6px 0;color:#6b7280;width:120px">Name</td><td style="padding:6px 0;font-weight:600">${esc(name)}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">Email</td><td style="padding:6px 0"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
            ${phone ? `<tr><td style="padding:6px 0;color:#6b7280">Phone</td><td style="padding:6px 0">${esc(phone)}</td></tr>` : ""}
            ${businessName ? `<tr><td style="padding:6px 0;color:#6b7280">Business</td><td style="padding:6px 0">${esc(businessName)}</td></tr>` : ""}
            <tr><td style="padding:6px 0;color:#6b7280">Date</td><td style="padding:6px 0;font-weight:600">${friendlyDate}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">Time</td><td style="padding:6px 0;font-weight:600">${esc(time)} ET</td></tr>
          </table>
          <p style="margin-top:16px;font-size:13px;color:#6b7280">Remember to send them a Google Meet link before the meeting.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[book-demo]", err);
    return NextResponse.json({ error: "Failed to book demo. Please try again." }, { status: 500 });
  }
}

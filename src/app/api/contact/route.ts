import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { guardInputs } from "@/lib/input-guard";
import { sendEmail } from "@/lib/mailer";

const TO_EMAIL = "hello@instantlocalbusiness.com";

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

    const { name, email, company, subject, message } = await req.json() as {
      name: string; email: string; company?: string; subject?: string; message: string;
    };

    const guard = guardInputs({ message });
    if (!guard.ok) {
      return NextResponse.json({ error: guard.error }, { status: 400 });
    }

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const subjectLabel = subject ? `[${subject.charAt(0).toUpperCase() + subject.slice(1)}] ` : "";

    // Notify you
    await sendEmail({
      to: TO_EMAIL,
      replyTo: email,
      subject: `${subjectLabel}New contact from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="margin:0 0 16px;font-size:20px;color:#111">New Contact Form Submission</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:#666;width:120px">Name</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#2563eb">${email}</a></td></tr>
            ${company ? `<tr><td style="padding:8px 0;color:#666">Company</td><td style="padding:8px 0">${company}</td></tr>` : ""}
            ${subject ? `<tr><td style="padding:8px 0;color:#666">Subject</td><td style="padding:8px 0">${subject}</td></tr>` : ""}
          </table>
          <div style="margin-top:16px;padding:16px;background:#f9fafb;border-radius:8px;font-size:14px;color:#374151;white-space:pre-wrap">${message}</div>
          <p style="margin-top:24px;font-size:12px;color:#9ca3af">Sent from instantlocalbusiness.com/contact</p>
        </div>
      `,
    });

    // Auto-reply to sender
    await sendEmail({
      to: email,
      subject: "We got your message — Instant Local Business",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="margin:0 0 8px;font-size:20px;color:#111">Thanks, ${name}!</h2>
          <p style="color:#6b7280;font-size:14px;margin:0 0 16px">We received your message and will get back to you within 24 hours.</p>
          <div style="padding:16px;background:#f9fafb;border-radius:8px;font-size:14px;color:#374151;white-space:pre-wrap">${message}</div>
          <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb"/>
          <p style="font-size:13px;color:#6b7280">— The Instant Local Business team<br/>
          <a href="https://instantlocalbusiness.com" style="color:#2563eb">instantlocalbusiness.com</a></p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/contact]", err);
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }
}

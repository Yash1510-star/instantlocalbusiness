/**
 * Shared email utility using Zoho SMTP via nodemailer.
 *
 * Required env vars:
 *   ZOHO_EMAIL         — your Zoho email address  e.g. hello@instantlocalbusiness.com
 *   ZOHO_APP_PASSWORD  — Zoho app-specific password (NOT your login password)
 *                        Generate at: accounts.zoho.com → Security → App Passwords
 */

import nodemailer from "nodemailer";

export type MailOptions = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

function createTransport() {
  const user = process.env.ZOHO_EMAIL;
  const pass = process.env.ZOHO_APP_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 587,
    secure: false, // STARTTLS
    auth: { user, pass },
  });
}

export async function sendEmail(opts: MailOptions): Promise<{ ok: boolean; error?: string }> {
  const transport = createTransport();

  if (!transport) {
    console.warn("[mailer] ZOHO_EMAIL or ZOHO_APP_PASSWORD not set — email NOT sent:", opts.subject);
    return { ok: false, error: "Email not configured" };
  }

  try {
    await transport.sendMail({
      from: `InstantLocalBusiness <${process.env.ZOHO_EMAIL}>`,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      replyTo: opts.replyTo,
    });
    return { ok: true };
  } catch (err) {
    console.error("[mailer] Send error:", err);
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtected = createRouteMatcher(["/dashboard(.*)"]);

// Subdomains reserved for infrastructure — never tenant-route these
const RESERVED = new Set(["www", "clerk", "accounts", "clkmail", "clk", "clk2"]);

function getRootDomain(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://instantlocalbusiness.com";
  return siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function getTenantSlug(host: string): string | null {
  const hostname = host.split(":")[0].toLowerCase();
  const root = getRootDomain();
  if (!hostname.endsWith(`.${root}`)) return null;
  const sub = hostname.slice(0, -(root.length + 1));
  if (!sub || RESERVED.has(sub)) return null;
  return sub;
}

export const proxy = clerkMiddleware(async (auth, req) => {
  const host = req.headers.get("host") ?? "";
  const tenantSlug = getTenantSlug(host);

  if (tenantSlug) {
    // Rewrite subdomain requests to /sites/[slug] — the App Router page handles the rest
    const url = req.nextUrl.clone();
    url.pathname = `/sites/${tenantSlug}`;
    return NextResponse.rewrite(url);
  }

  if (isProtected(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

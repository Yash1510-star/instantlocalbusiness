/**
 * Single source of truth for reserved subdomains and slug validation.
 * Used by: proxy.ts (subdomain routing), check-slug API, publish API.
 */

export const RESERVED_SLUGS = new Set([
  // Infrastructure / Clerk
  "www", "clerk", "accounts", "clkmail", "clk", "clk2",
  // Platform pages
  "api", "app", "admin", "dashboard", "blog", "help", "support",
  "pricing", "about", "contact", "demo", "preview", "build",
  "signin", "signup", "login", "logout", "terms", "privacy", "sitemap",
  "status", "docs", "press", "gdpr", "cookies",
]);

/** Slug must be 3–52 chars, alphanumeric + single hyphens, no leading/trailing hyphens. */
export function isValidSlug(slug: string): boolean {
  return (
    /^[a-z0-9][a-z0-9-]{1,50}[a-z0-9]$/.test(slug) &&
    !slug.includes("--")
  );
}

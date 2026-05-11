import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://instantlocalbusiness.com";

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "InstantLocalBusiness.com — AI Websites for Local Businesses",
    template: "%s | InstantLocalBusiness.com",
  },
  description:
    "Get a professional, SEO-ready website for your local business in under 60 seconds. AI-powered, no coding, no waiting. Restaurants, salons, plumbers, dentists, and more.",
  keywords: [
    "local business website",
    "AI website builder",
    "instant website for small business",
    "restaurant website builder",
    "salon website",
    "plumber website",
    "small business website",
    "local SEO website",
  ],
  authors: [{ name: "InstantLocalBusiness.com" }],
  creator: "InstantLocalBusiness.com",
  publisher: "InstantLocalBusiness.com",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "InstantLocalBusiness.com",
    title: "InstantLocalBusiness.com — AI Websites for Local Businesses",
    description:
      "Get a professional website for your local business in 60 seconds. AI-powered, no coding required.",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "InstantLocalBusiness.com — AI Websites for Local Businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InstantLocalBusiness.com — AI Websites for Local Businesses",
    description: "Professional AI-built website for your local business in 60 seconds.",
    images: [`${SITE_URL}/og-image.png`],
    creator: "@instantlocalbiz",
  },
  alternates: {
    canonical: SITE_URL,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" style={{ background: "#0a0a0f" }} suppressHydrationWarning>
        <body className="antialiased" style={{ background: "#0a0a0f", color: "#f0f0ff" }} suppressHydrationWarning>
          <Nav />
          <main>{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}

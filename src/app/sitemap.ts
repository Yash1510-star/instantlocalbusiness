import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://instantlocalbusiness.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: BASE_URL, priority: 1.0, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/pricing`, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/examples`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/build`, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/demo`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/contact`, priority: 0.6, changeFrequency: "yearly" as const },
    { url: `${BASE_URL}/about`, priority: 0.6, changeFrequency: "yearly" as const },
    { url: `${BASE_URL}/signin`, priority: 0.5, changeFrequency: "yearly" as const },
  ];

  const exampleSlugs = [
    "marias-tacos",
    "lakeside-plumbing",
    "glow-salon",
    "whitfield-electric",
    "paws-and-play",
    "fuentes-auto",
    "summit-fitness",
    "bloom-florist",
    "park-avenue-dental",
  ];

  const exampleRoutes = exampleSlugs.map((slug) => ({
    url: `${BASE_URL}/preview/${slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  return [...staticRoutes, ...exampleRoutes].map((r) => ({
    url: r.url,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}

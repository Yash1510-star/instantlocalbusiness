import { notFound } from "next/navigation";
import { getSite } from "@/lib/site-store";
import { PublicSite } from "@/components/PublicSite";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const saved = await getSite(slug);
  if (!saved?.site) return { title: "Site Not Found" };

  return {
    title: saved.site.metaTitle ?? saved.businessName,
    description: saved.site.metaDescription ?? "",
    openGraph: {
      title: saved.site.metaTitle ?? saved.businessName,
      description: saved.site.metaDescription ?? "",
      type: "website",
    },
  };
}

export default async function SitePage({ params }: Props) {
  const { slug } = await params;
  const saved = await getSite(slug);
  if (!saved || !saved.site || saved.status === "suspended") notFound();

  return <PublicSite site={saved.site} businessName={saved.businessName} />;
}

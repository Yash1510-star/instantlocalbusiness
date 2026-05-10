import { SitePreview } from "@/components/SitePreview";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Website Preview — InstantLocalBusiness.com",
};

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <SitePreview slug={slug} />;
}

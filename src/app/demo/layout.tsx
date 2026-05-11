import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Free Demo",
  description: "See how InstantLocalBusiness.com builds a professional website for your local business live in under 60 seconds. Book your free 20-minute demo today.",
  alternates: { canonical: "/demo" },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}

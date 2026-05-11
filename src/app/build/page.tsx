import { BuildFlowWrapper } from "@/components/BuildFlowWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build Your Website — InstantLocalBusiness.com",
  description: "Create your local business website in under 60 seconds.",
};

export default function BuildPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <BuildFlowWrapper />
    </div>
  );
}

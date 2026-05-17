"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export function DashboardBanner() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"success" | "cancelled" | null>(null);

  useEffect(() => {
    const checkout = searchParams.get("checkout");
    if (checkout === "success") setStatus("success");
    if (checkout === "cancelled") setStatus("cancelled");
  }, [searchParams]);

  if (!status) return null;

  return (
    <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 ${
      status === "success" ? "bg-green-50 border border-green-100 text-green-800" : "bg-red-50 border border-red-100 text-red-800"
    }`}>
      {status === "success" ? <CheckCircle2 size={20} className="text-green-600" /> : <XCircle size={20} className="text-red-600" />}
      <p className="text-sm font-medium">
        {status === "success" 
          ? "Subscription updated successfully! Thank you for your purchase." 
          : "Checkout was cancelled. Your subscription has not been changed."}
      </p>
    </div>
  );
}

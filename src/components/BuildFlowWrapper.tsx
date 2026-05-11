"use client";

import dynamic from "next/dynamic";

// Load BuildFlow only on the client — it uses useAuth and useState which
// produce different output on the server vs client, causing hydration errors.
const BuildFlowClient = dynamic(
  () => import("./BuildFlow").then((m) => ({ default: m.BuildFlow })),
  { ssr: false, loading: () => <div className="min-h-[400px]" /> }
);

export function BuildFlowWrapper() {
  return <BuildFlowClient />;
}

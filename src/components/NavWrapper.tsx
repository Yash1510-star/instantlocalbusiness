"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// Render Nav only on the client — zero SSR output.
// This permanently eliminates hydration mismatches caused by browser extensions
// that rewrite className/inject children before React hydrates.
const Nav = dynamic(() => import("./Nav").then((m) => ({ default: m.Nav })), {
  ssr: false,
  loading: () => <header style={{ minHeight: 64 }} />,
});

export function NavWrapper() {
  const pathname = usePathname();
  // Published customer sites are standalone — no platform chrome
  if (pathname.startsWith("/sites/")) return null;
  return <Nav />;
}

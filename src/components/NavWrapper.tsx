"use client";

import dynamic from "next/dynamic";

// Render Nav only on the client — zero SSR output.
// This permanently eliminates hydration mismatches caused by browser extensions
// that rewrite className/inject children before React hydrates.
const Nav = dynamic(() => import("./Nav").then((m) => ({ default: m.Nav })), {
  ssr: false,
  loading: () => <header style={{ minHeight: 64 }} />,
});

export function NavWrapper() {
  return <Nav />;
}

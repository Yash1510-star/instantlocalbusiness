"use client";

import Link from "next/link";
import { useState, Component, type ReactNode } from "react";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { UserButton, useAuth } from "@clerk/nextjs";

const links = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
];

const GuestButtons = ({ mobile }: { mobile?: boolean }) =>
  mobile ? (
    <>
      <Link href="/signin" className="text-center text-sm font-medium py-2 rounded-lg border"
        style={{ color: "#94a3b8", borderColor: "rgba(255,255,255,0.12)" }}>Sign in</Link>
      <Link href="/build" className="text-center text-sm font-semibold py-2 rounded-lg"
        style={{ background: "linear-gradient(135deg,#6366f1,#3b82f6)", color: "#fff" }}>Get Started Free</Link>
    </>
  ) : (
    <>
      <Link href="/signin" className="text-sm font-medium transition-colors"
        style={{ color: "#94a3b8" }}
        onMouseEnter={e => (e.currentTarget.style.color = "#e2e8f0")}
        onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}>Sign in</Link>
      <Link href="/build" className="text-sm font-semibold px-4 py-2 rounded-lg transition-all"
        style={{ background: "linear-gradient(135deg,#6366f1,#3b82f6)", color: "#fff", boxShadow: "0 0 16px rgba(99,102,241,0.35)" }}>
        Get Started Free
      </Link>
    </>
  );

function AuthButtons({ mobile, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const { isSignedIn } = useAuth();
  if (mobile) {
    return isSignedIn ? (
      <>
        <Link href="/dashboard" onClick={onClose} className="text-center text-sm font-medium py-2 border rounded-lg"
          style={{ color: "#94a3b8", borderColor: "rgba(255,255,255,0.12)" }}>Dashboard</Link>
        <div className="flex justify-center"><UserButton /></div>
      </>
    ) : <GuestButtons mobile />;
  }
  return isSignedIn ? (
    <>
      <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-medium transition-colors"
        style={{ color: "#94a3b8" }}>
        <LayoutDashboard size={15} />Dashboard
      </Link>
      <UserButton />
    </>
  ) : <GuestButtons />;
}

class ClerkBoundary extends Component<{ mobile?: boolean; onClose?: () => void; children: ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  render() {
    if (this.state.error) return <GuestButtons mobile={this.props.mobile} />;
    return this.props.children;
  }
}

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50" style={{
      background: "rgba(10,10,15,0.85)",
      borderBottom: "1px solid rgba(255,255,255,0.07)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
    }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight" style={{ color: "#f1f5f9" }}>
              InstantLocal<span style={{ color: "#818cf8" }}>Business</span>
            </span>
            <span className="hidden sm:inline text-xs font-medium rounded px-1.5 py-0.5"
              style={{ color: "#475569", border: "1px solid rgba(255,255,255,0.1)" }}>.com</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link key={l.href} href={l.href}
                className="text-sm font-medium transition-colors"
                style={{ color: "#94a3b8" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#e2e8f0")}
                onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <ClerkBoundary>
              <AuthButtons />
            </ClerkBoundary>
          </div>

          <button className="md:hidden p-2 transition-colors" style={{ color: "#94a3b8" }}
            onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-4 py-4 space-y-3" style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(10,10,15,0.97)",
        }}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block text-sm font-medium py-2" style={{ color: "#94a3b8" }}>{l.label}</Link>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <ClerkBoundary mobile onClose={() => setOpen(false)}>
              <AuthButtons mobile onClose={() => setOpen(false)} />
            </ClerkBoundary>
          </div>
        </div>
      )}
    </header>
  );
}

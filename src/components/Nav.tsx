"use client";

import Link from "next/link";
import { useState, Component, type ReactNode } from "react";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { UserButton, useAuth } from "@clerk/nextjs";

const links = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#testimonials", label: "Testimonials" },
];

const GuestButtons = ({ mobile }: { mobile?: boolean }) =>
  mobile ? (
    <>
      <Link href="/signin" className="nav-link-ghost text-center text-sm font-medium py-2 rounded-lg border">Sign in</Link>
      <Link href="/build" className="nav-btn-primary text-center text-sm font-semibold py-2 rounded-lg">Get Started Free</Link>
    </>
  ) : (
    <>
      <Link href="/signin" className="nav-link text-sm font-medium transition-colors">Sign in</Link>
      <Link href="/build" className="nav-btn-primary text-sm font-semibold px-4 py-2 rounded-lg">Get Started Free</Link>
    </>
  );

function AuthButtons({ mobile, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const { isSignedIn } = useAuth();
  if (mobile) {
    return isSignedIn ? (
      <>
        <Link href="/dashboard" onClick={onClose} className="nav-link-ghost text-center text-sm font-medium py-2 border rounded-lg">Dashboard</Link>
        <div className="flex justify-center"><UserButton /></div>
      </>
    ) : <GuestButtons mobile />;
  }
  return isSignedIn ? (
    <>
      <Link href="/dashboard" className="nav-link flex items-center gap-1.5 text-sm font-medium transition-colors">
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
    <header className="nav-header">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="nav-logo-text text-xl font-bold tracking-tight">
              InstantLocal<span className="nav-logo-accent">Business</span>
            </span>
            <span className="nav-logo-badge hidden sm:inline text-xs font-medium rounded px-1.5 py-0.5">.com</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="nav-link text-sm font-medium transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <ClerkBoundary>
              <AuthButtons />
            </ClerkBoundary>
          </div>

          <button className="nav-hamburger md:hidden p-2 transition-colors"
            onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="nav-drawer md:hidden px-4 py-4 space-y-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="nav-link block text-sm font-medium py-2">{l.label}</Link>
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

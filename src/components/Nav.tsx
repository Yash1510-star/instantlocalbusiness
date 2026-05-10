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
      <Link href="/signin" className="text-center text-sm font-medium text-gray-600 py-2 border border-gray-200 rounded-lg">Sign in</Link>
      <Link href="/build" className="text-center bg-blue-600 text-white text-sm font-semibold py-2 rounded-lg">Get Started Free</Link>
    </>
  ) : (
    <>
      <Link href="/signin" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Sign in</Link>
      <Link href="/build" className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Get Started Free</Link>
    </>
  );

function AuthButtons({ mobile, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const { isSignedIn } = useAuth();
  if (mobile) {
    return isSignedIn ? (
      <>
        <Link href="/dashboard" onClick={onClose} className="text-center text-sm font-medium text-gray-600 py-2 border border-gray-200 rounded-lg">Dashboard</Link>
        <div className="flex justify-center"><UserButton /></div>
      </>
    ) : <GuestButtons mobile />;
  }
  return isSignedIn ? (
    <>
      <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
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
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-gray-900">
              InstantLocal<span className="text-blue-600">Business</span>
            </span>
            <span className="hidden sm:inline text-xs text-gray-400 font-medium border border-gray-200 rounded px-1.5 py-0.5">.com</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">{l.label}</Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <ClerkBoundary>
              <AuthButtons />
            </ClerkBoundary>
          </div>

          <button className="md:hidden p-2 text-gray-600" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-sm font-medium text-gray-700 py-2">{l.label}</Link>
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

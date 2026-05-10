"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Globe, Plus, Settings, LogOut } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading…</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ""}!
          </h1>
          <p className="text-sm text-gray-500 mt-1">{user?.primaryEmailAddress?.emailAddress}</p>
        </div>
        <button
          onClick={() => signOut({ redirectUrl: "/" })}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <Link
          href="/build"
          className="flex items-center gap-4 p-6 border border-blue-100 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors"
        >
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <Plus size={18} />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Build a new website</p>
            <p className="text-xs text-gray-500 mt-0.5">Launch in 60 seconds with AI</p>
          </div>
        </Link>

        <Link
          href="/examples"
          className="flex items-center gap-4 p-6 border border-gray-100 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
        >
          <div className="p-2 bg-gray-700 rounded-lg text-white">
            <Globe size={18} />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Browse examples</p>
            <p className="text-xs text-gray-500 mt-0.5">See what AI can build for you</p>
          </div>
        </Link>
      </div>

      {/* Sites placeholder */}
      <div className="border border-dashed border-gray-200 rounded-2xl p-10 text-center">
        <Globe size={32} className="mx-auto text-gray-300 mb-3" />
        <p className="font-semibold text-gray-700">No websites yet</p>
        <p className="text-sm text-gray-400 mt-1 mb-5">
          Build your first AI-powered website in under a minute.
        </p>
        <Link
          href="/build"
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Plus size={15} />
          Get started free
        </Link>
      </div>
    </div>
  );
}

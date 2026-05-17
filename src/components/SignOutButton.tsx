"use client";

import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const { signOut } = useClerk();
  return (
    <button
      onClick={() => signOut({ redirectUrl: "/" })}
      className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
    >
      <LogOut size={15} />
      Sign out
    </button>
  );
}

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtected = createRouteMatcher(["/dashboard(.*)"]);

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const hasValidKey =
  publishableKey.startsWith("pk_test_") || publishableKey.startsWith("pk_live_");

// If Clerk keys aren't configured, skip auth entirely so the app still works
export default hasValidKey
  ? clerkMiddleware(async (auth, req) => {
      if (isProtected(req)) {
        await auth.protect();
      }
    })
  : () => NextResponse.next();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

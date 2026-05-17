import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { getSubscription } from "@/lib/subscription-store";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const subscription = await getSubscription(userId);
    if (!subscription?.stripeCustomerId) {
      return new NextResponse("No active subscription", { status: 400 });
    }

    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    let returnUrl = `${SITE_URL}/dashboard`;
    try {
      const body = await req.json();
      if (body.returnUrl) returnUrl = body.returnUrl;
    } catch {}

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: returnUrl,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Stripe Portal Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
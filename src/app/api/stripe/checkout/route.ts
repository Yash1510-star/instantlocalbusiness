import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { getSubscription } from "@/lib/subscription-store";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { priceId, plan } = body;

    if (!priceId || !plan) {
      return new NextResponse("Missing priceId or plan", { status: 400 });
    }

    const subscription = await getSubscription(userId);
    let stripeCustomerId = subscription?.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        metadata: { userId },
      });
      stripeCustomerId = customer.id;
    }

    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${SITE_URL}/dashboard?checkout=success`,
      cancel_url: `${SITE_URL}/pricing?checkout=cancelled`,
      subscription_data: plan === "pro" ? { trial_period_days: 14 } : undefined,
      metadata: { userId, plan },
      allow_promotion_codes: true,
    });

    if (!session.url) {
      return new NextResponse("Error creating Stripe session", { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
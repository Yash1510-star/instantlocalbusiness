import { stripe } from "@/lib/stripe";
import {
  saveSubscription,
  getSubscription,
  type Plan,
  type SubscriptionStatus,
} from "@/lib/subscription-store";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing stripe-signature header", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan as Plan | undefined;

        if (!userId || !plan) {
          console.error(
            "Missing userId or plan in checkout session metadata"
          );
          break;
        }

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        await saveSubscription({
          userId,
          plan,
          status: subscription.status as SubscriptionStatus,
          stripeCustomerId: subscription.customer as string,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0]?.price.id ?? "",
          currentPeriodEnd: new Date(
            subscription.items.data[0]?.current_period_end * 1000
          ).toISOString(),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          trialEnd: subscription.trial_end
            ? new Date(subscription.trial_end * 1000).toISOString()
            : undefined,
          updatedAt: new Date().toISOString(),
        });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const customer = await stripe.customers.retrieve(customerId);
        const userId = (customer as Stripe.Customer).metadata?.userId;

        if (!userId) {
          console.error("Missing userId in customer metadata");
          break;
        }

        const existing = await getSubscription(userId);

        await saveSubscription({
          userId,
          plan:
            existing?.plan ??
            (subscription.metadata?.plan as Plan) ??
            "starter",
          status: subscription.status as SubscriptionStatus,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0]?.price.id ?? "",
          currentPeriodEnd: new Date(
            subscription.items.data[0]?.current_period_end * 1000
          ).toISOString(),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          trialEnd: subscription.trial_end
            ? new Date(subscription.trial_end * 1000).toISOString()
            : undefined,
          updatedAt: new Date().toISOString(),
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const customer = await stripe.customers.retrieve(customerId);
        const userId = (customer as Stripe.Customer).metadata?.userId;

        if (!userId) {
          console.error("Missing userId in customer metadata");
          break;
        }

        const existing = await getSubscription(userId);

        await saveSubscription({
          userId,
          plan: existing?.plan ?? "starter",
          status: "canceled",
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
          stripePriceId: existing?.stripePriceId ?? "",
          currentPeriodEnd:
            existing?.currentPeriodEnd ?? new Date().toISOString(),
          cancelAtPeriodEnd: false,
          updatedAt: new Date().toISOString(),
        });
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    return new NextResponse("Webhook handler error", { status: 500 });
  }

  return NextResponse.json({ received: true });
}

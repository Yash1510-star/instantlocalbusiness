import { auth } from "@clerk/nextjs/server";
import { getSubscription } from "@/lib/subscription-store";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const subscription = await getSubscription(userId);
    if (!subscription) {
      return NextResponse.json({ plan: "starter", status: "incomplete" });
    }

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Stripe Subscription Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
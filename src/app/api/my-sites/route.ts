import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSitesByUser } from "@/lib/site-store";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const sites = await getSitesByUser(userId);
    return NextResponse.json({ sites });
  } catch (err) {
    console.error("[/api/my-sites]", err);
    return NextResponse.json({ error: "Failed to load sites." }, { status: 500 });
  }
}

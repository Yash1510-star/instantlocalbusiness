import { NextResponse } from "next/server";

export async function GET() {
  // Never expose Redis internals in production
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return NextResponse.json({ error: "Redis env vars not set" });
  }

  try {
    const writeRes = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([["SET", "debug:test", JSON.stringify({ ok: true, ts: Date.now() })]]),
    });
    const writeJson = await writeRes.json();

    const readRes = await fetch(`${url}/get/debug:test`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const readJson = await readRes.json();

    return NextResponse.json({
      writeStatus: writeRes.status,
      writeResult: writeJson,
      readStatus: readRes.status,
      readResult: readJson,
    });
  } catch (e) {
    return NextResponse.json({ error: "Redis error" }, { status: 500 });
  }
}

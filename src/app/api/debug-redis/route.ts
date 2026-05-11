import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return NextResponse.json({ error: "Redis env vars not set", url: !!url, token: !!token });
  }

  try {
    // Test write
    const writeRes = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([["SET", "debug:test", JSON.stringify({ ok: true, ts: Date.now() })]]),
    });
    const writeJson = await writeRes.json();

    // Test read
    const readRes = await fetch(`${url}/get/debug:test`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const readJson = await readRes.json();

    // List all keys
    const keysRes = await fetch(`${url}/keys/*`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const keysJson = await keysRes.json();

    return NextResponse.json({
      writeStatus: writeRes.status,
      writeResult: writeJson,
      readStatus: readRes.status,
      readResult: readJson,
      allKeys: keysJson,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

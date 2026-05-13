"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AISiteRenderer } from "@/components/AISiteRenderer";
import type { GeneratedSite } from "@/lib/generate-site";
import type { SavedSite } from "@/lib/site-store";
import { ArrowLeft, CheckCircle, Loader2, Save, ExternalLink } from "lucide-react";

export default function AdminEditSite() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const [record, setRecord] = useState<SavedSite | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  // The current (possibly edited) site data flowing back from AISiteRenderer
  const pendingRef = useRef<GeneratedSite | null>(null);

  // ── Load the site ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!slug) return;
    fetch(`/api/admin/sites?slug=${encodeURIComponent(slug)}`)
      .then((r) => {
        if (!r.ok) throw new Error("Unauthorized or not found");
        return r.json() as Promise<SavedSite>;
      })
      .then((data) => {
        setRecord(data);
        pendingRef.current = data.site;
      })
      .catch(() => router.replace("/admin"))
      .finally(() => setLoading(false));
  }, [slug, router]);

  // ── Republish ──────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!pendingRef.current || !slug) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/sites", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, site: pendingRef.current }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
      setToast({ type: "ok", msg: "Changes saved & republished!" });
      setTimeout(() => setToast(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Save failed";
      setToast({ type: "err", msg });
      setTimeout(() => setToast(null), 5000);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-400 w-8 h-8" />
      </div>
    );
  }

  if (!record) return null;

  const liveUrl = `https://${slug}.instantlocalbusiness.com`;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* ── Sticky admin bar ───────────────────────────────────────────────── */}
      <div className="sticky top-0 z-[9999] bg-gray-900 border-b border-gray-700 px-4 py-2 flex items-center gap-3 shadow-lg">
        <button
          onClick={() => router.push("/admin")}
          className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft size={15} />
          Admin
        </button>

        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-white truncate">{record.businessName}</span>
          <span className="ml-2 text-xs text-gray-400">{slug}</span>
        </div>

        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <ExternalLink size={13} />
          Live site
        </a>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white transition-colors"
        >
          {saving ? (
            <><Loader2 size={14} className="animate-spin" /> Saving…</>
          ) : (
            <><Save size={14} /> Save & Republish</>
          )}
        </button>
      </div>

      {/* ── Toast ──────────────────────────────────────────────────────────── */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl text-sm font-medium transition-all ${
            toast.type === "ok"
              ? "bg-emerald-600 text-white"
              : "bg-red-700 text-white"
          }`}
        >
          {toast.type === "ok" && <CheckCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* ── Edit hint banner ───────────────────────────────────────────────── */}
      <div className="bg-indigo-950 border-b border-indigo-800 px-4 py-2 text-center text-xs text-indigo-300">
        Admin edit mode — click any text to edit, use the photo/delete buttons on each service card, then press <strong>Save &amp; Republish</strong>.
      </div>

      {/* ── Visual editor ──────────────────────────────────────────────────── */}
      <div className="flex-1">
        <AISiteRenderer
          site={record.site}
          compact={false}
          onSiteChange={(updated) => { pendingRef.current = updated; }}
        />
      </div>
    </div>
  );
}

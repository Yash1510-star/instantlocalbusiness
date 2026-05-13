"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { SavedSite } from "@/lib/site-store";
import { Trash2, Globe, Ban, CheckCircle, RefreshCw, Search, BarChart2, Pencil } from "lucide-react";

type SiteRow = Omit<SavedSite, "site"> & { siteSize?: number };

export default function AdminDashboard() {
  const router = useRouter();
  const [sites, setSites] = useState<SiteRow[]>([]);
  const [filtered, setFiltered] = useState<SiteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/sites");
    if (res.status === 401) { router.replace("/signin"); return; }
    if (!res.ok) { setError("Failed to load sites"); setLoading(false); return; }
    const data = await res.json() as SavedSite[];
    // strip the large `site` blob from rows to keep state lean
    setSites(data.map(({ site, ...rest }) => ({ ...rest, siteSize: JSON.stringify(site).length })));
    setLoading(false);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(q ? sites.filter(s =>
      s.slug.includes(q) || s.businessName.toLowerCase().includes(q) ||
      s.businessEmail.toLowerCase().includes(q) || (s.userId ?? "").includes(q)
    ) : sites);
  }, [search, sites]);

  async function handleDelete(slug: string) {
    if (confirm !== slug) { setConfirm(slug); return; }
    setBusy(slug); setConfirm(null);
    const res = await fetch("/api/admin/sites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    if (res.ok) setSites(prev => prev.filter(s => s.slug !== slug));
    else alert("Delete failed");
    setBusy(null);
  }

  async function handleToggleStatus(slug: string, current: string) {
    setBusy(slug);
    const next = current === "suspended" ? "live" : "suspended";
    const res = await fetch("/api/admin/sites", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, status: next }),
    });
    if (res.ok) setSites(prev => prev.map(s => s.slug === slug ? { ...s, status: next as SavedSite["status"] } : s));
    else alert("Update failed");
    setBusy(null);
  }

  async function handlePlanChange(slug: string, plan: string) {
    setBusy(slug);
    const res = await fetch("/api/admin/sites", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, plan }),
    });
    if (res.ok) setSites(prev => prev.map(s => s.slug === slug ? { ...s, plan: plan as SavedSite["plan"] } : s));
    else alert("Update failed");
    setBusy(null);
  }

  const stats = {
    total: sites.length,
    live: sites.filter(s => s.status === "live").length,
    suspended: sites.filter(s => s.status === "suspended").length,
    starter: sites.filter(s => s.plan === "starter").length,
    pro: sites.filter(s => s.plan === "pro").length,
    business: sites.filter(s => s.plan === "business").length,
  };

  const rootDomain = process.env.NEXT_PUBLIC_SITE_URL?.replace(/^https?:\/\//, "").replace(/\/$/, "") ?? "instantlocalbusiness.com";

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">Admin Dashboard</h1>
          <p className="text-xs text-gray-400 mt-0.5">InstantLocalBusiness.com</p>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {[
            { label: "Total Sites", value: stats.total, color: "text-blue-400" },
            { label: "Live",        value: stats.live,      color: "text-green-400" },
            { label: "Suspended",   value: stats.suspended, color: "text-red-400" },
            { label: "Starter",     value: stats.starter,   color: "text-gray-400" },
            { label: "Pro",         value: stats.pro,       color: "text-purple-400" },
            { label: "Business",    value: stats.business,  color: "text-amber-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className={`text-2xl font-black ${color}`}>{value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, slug, email, or user ID…"
            className="w-full pl-8 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading sites…</div>
        ) : error ? (
          <div className="text-center py-20 text-red-400">{error}</div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="text-left px-4 py-3">Business</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Email</th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell">Published</th>
                  <th className="text-left px-4 py-3">Plan</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-12 text-gray-600">No sites found</td></tr>
                )}
                {filtered.map(site => (
                  <tr key={site.slug} className={`hover:bg-gray-800/50 transition-colors ${site.status === "suspended" ? "opacity-60" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{site.businessName}</div>
                      <div className="text-xs text-gray-500 font-mono mt-0.5">{site.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 hidden md:table-cell text-xs">{site.businessEmail}</td>
                    <td className="px-4 py-3 text-gray-500 hidden lg:table-cell text-xs">
                      {new Date(site.publishedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={site.plan}
                        disabled={busy === site.slug}
                        onChange={e => handlePlanChange(site.slug, e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white outline-none cursor-pointer"
                      >
                        <option value="starter">Starter</option>
                        <option value="pro">Pro</option>
                        <option value="business">Business</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                        site.status === "live" ? "bg-green-500/15 text-green-400" :
                        site.status === "suspended" ? "bg-red-500/15 text-red-400" :
                        "bg-gray-500/15 text-gray-400"
                      }`}>
                        {site.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        {/* View live site */}
                        <a
                          href={`https://${site.slug}.${rootDomain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View live site"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                        >
                          <Globe size={14} />
                        </a>

                        {/* Edit & republish */}
                        <button
                          onClick={() => router.push(`/admin/edit/${site.slug}`)}
                          title="Edit & republish"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                        >
                          <Pencil size={14} />
                        </button>

                        {/* Suspend / Unsuspend */}
                        <button
                          onClick={() => handleToggleStatus(site.slug, site.status)}
                          disabled={busy === site.slug}
                          title={site.status === "suspended" ? "Restore site" : "Suspend site"}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors disabled:opacity-40"
                        >
                          {site.status === "suspended" ? <CheckCircle size={14} /> : <Ban size={14} />}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(site.slug)}
                          disabled={busy === site.slug}
                          title={confirm === site.slug ? "Click again to confirm" : "Delete site"}
                          className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 ${
                            confirm === site.slug
                              ? "text-white bg-red-600 hover:bg-red-700"
                              : "text-gray-500 hover:text-red-400 hover:bg-red-500/10"
                          }`}
                        >
                          <Trash2 size={14} />
                        </button>

                        {confirm === site.slug && (
                          <button onClick={() => setConfirm(null)} className="text-xs text-gray-500 hover:text-white ml-1">
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="px-4 py-3 border-t border-gray-800 text-xs text-gray-600 flex items-center gap-1">
              <BarChart2 size={11} /> {filtered.length} of {sites.length} sites
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

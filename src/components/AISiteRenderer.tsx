"use client";

/**
 * AISiteRenderer — Modern, industry-specific layouts for AI-generated sites.
 *
 * 6 layout variants:
 *  • hospitality  — restaurants, cafes, bakeries (lifestyle-brand vibes)
 *  • service      — plumbers, electricians, auto (bold, trust-first)
 *  • wellness     — salons, dental, gym, spa (clean, soft, editorial)
 *  • professional — law, accounting, real estate (premium, minimal)
 *  • creative     — dance studios, photography, florists (bold, gallery-forward, dark)
 *  • boutique     — nail salon, massage, pet grooming (light, elegant, luxury feel)
 *
 * Each layout supports:
 *  • Dynamic color palettes (8 curated options)
 *  • Inline text editing (headline, tagline, CTA, service title + description)
 *  • Hero image upload (replace with own photo)
 *  • Per-service photo upload, add new service, delete service
 */

import { useState, useRef, useEffect, createContext, useContext, type ChangeEvent } from "react";
import {
  Phone, MapPin, Clock, CheckCircle2, Upload, Palette,
  ChevronDown, Star, ArrowRight, Zap, Shield, Award,
  Pencil, Trash2, Plus, X, Check,
} from "lucide-react";
import type { GeneratedSite } from "@/lib/generate-site";

// ─── Readonly context — when true, all editing UI is hidden ──────────────────
const ReadonlyCtx = createContext(false);

type ServiceItem = GeneratedSite["services"][number] & { _photo?: string };

// ─── Photo URL helper — handles Unsplash IDs, Unsplash URLs, Pexels, Pixabay, data URLs ─
function photoUrl(ref: string, w: number, h: number) {
  // User-uploaded data URL — use as-is, never transform
  if (ref.startsWith("data:")) return ref;
  if (!ref.startsWith("http")) {
    // Legacy Unsplash photo ID (static fallback table)
    return `https://images.unsplash.com/${ref}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
  }
  if (ref.includes("unsplash.com")) {
    // Preserve ixid/ixlib from stored URL, append sizing
    return `${ref}&auto=format&fit=crop&w=${w}&h=${h}&q=80`;
  }
  if (ref.includes("pexels.com")) {
    return `${ref.split("?")[0]}?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;
  }
  // Pixabay and others — use as-is (no dynamic resize support)
  return ref;
}

// ─── Colour palettes ─────────────────────────────────────────────────────────
export type Palette = {
  id: string;
  name: string;
  primary: string;       // button bg
  primaryText: string;   // button text
  primaryHover: string;
  accent: string;        // stat/highlight text
  badge: string;         // trust pill classes
  hero: string;          // hero overlay gradient
  navBg: string;
  navText: string;       // nav brand/title text color
  navLink: string;       // nav link text + hover
  sectionAlt: string;    // alternating section bg
  sectionBorder: string; // divider color between sections
  tag: string;           // small tag/chip
};

export const PALETTES: Palette[] = [
  {
    id: "amber",    name: "Amber & Dark",
    primary: "bg-amber-500", primaryText: "text-gray-950", primaryHover: "hover:bg-amber-400",
    accent: "text-amber-400", badge: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
    hero: "from-gray-950 via-gray-900/80 to-transparent",
    navBg: "bg-gray-950/90", navText: "text-white", navLink: "text-gray-400 hover:text-white",
    sectionAlt: "bg-gray-900", sectionBorder: "border-white/5",
    tag: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  },
  {
    id: "electric", name: "Electric Blue",
    primary: "bg-blue-500", primaryText: "text-white", primaryHover: "hover:bg-blue-400",
    accent: "text-blue-400", badge: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
    hero: "from-slate-950 via-blue-950/60 to-transparent",
    navBg: "bg-slate-950/90", navText: "text-white", navLink: "text-gray-400 hover:text-white",
    sectionAlt: "bg-slate-900", sectionBorder: "border-white/5",
    tag: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  },
  {
    id: "rose",     name: "Rose & Cream",
    primary: "bg-rose-500", primaryText: "text-white", primaryHover: "hover:bg-rose-400",
    accent: "text-rose-400", badge: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
    hero: "from-neutral-950 via-rose-950/40 to-transparent",
    navBg: "bg-neutral-950/90", navText: "text-white", navLink: "text-gray-400 hover:text-white",
    sectionAlt: "bg-neutral-900", sectionBorder: "border-white/5",
    tag: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  },
  {
    id: "emerald",  name: "Emerald",
    primary: "bg-emerald-500", primaryText: "text-gray-950", primaryHover: "hover:bg-emerald-400",
    accent: "text-emerald-400", badge: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    hero: "from-gray-950 via-emerald-950/50 to-transparent",
    navBg: "bg-gray-950/90", navText: "text-white", navLink: "text-gray-400 hover:text-white",
    sectionAlt: "bg-gray-900", sectionBorder: "border-white/5",
    tag: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  },
  {
    id: "violet",   name: "Violet",
    primary: "bg-violet-500", primaryText: "text-white", primaryHover: "hover:bg-violet-400",
    accent: "text-violet-400", badge: "bg-violet-500/20 text-violet-300 border border-violet-500/30",
    hero: "from-gray-950 via-violet-950/50 to-transparent",
    navBg: "bg-gray-950/90", navText: "text-white", navLink: "text-gray-400 hover:text-white",
    sectionAlt: "bg-gray-900", sectionBorder: "border-white/5",
    tag: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
  },
  {
    id: "sand",     name: "Sand & Stone",
    primary: "bg-stone-700", primaryText: "text-white", primaryHover: "hover:bg-stone-600",
    accent: "text-stone-300", badge: "bg-stone-700/50 text-stone-300 border border-stone-600",
    hero: "from-stone-950 via-stone-900/70 to-transparent",
    navBg: "bg-stone-950/90", navText: "text-white", navLink: "text-stone-400 hover:text-white",
    sectionAlt: "bg-stone-900", sectionBorder: "border-white/5",
    tag: "bg-stone-700/20 text-stone-400 border border-stone-600/30",
  },
  {
    id: "mint",     name: "Mint & White",
    primary: "bg-teal-500", primaryText: "text-white", primaryHover: "hover:bg-teal-400",
    accent: "text-teal-600", badge: "bg-teal-50 text-teal-700 border border-teal-200",
    hero: "from-black/70 via-black/40 to-transparent",
    navBg: "bg-white/95", navText: "text-gray-900", navLink: "text-gray-500 hover:text-gray-900",
    sectionAlt: "bg-gray-50", sectionBorder: "border-gray-100",
    tag: "bg-teal-50 text-teal-700 border border-teal-200",
  },
  {
    id: "noir",     name: "Noir",
    primary: "bg-white", primaryText: "text-gray-950", primaryHover: "hover:bg-gray-100",
    accent: "text-white", badge: "bg-white/10 text-white border border-white/20",
    hero: "from-black via-black/80 to-transparent",
    navBg: "bg-black/95", navText: "text-white", navLink: "text-gray-400 hover:text-white",
    sectionAlt: "bg-zinc-900", sectionBorder: "border-white/5",
    tag: "bg-white/5 text-white/70 border border-white/10",
  },
];

function getPaletteFromScheme(cs: GeneratedSite["colorScheme"]): Palette {
  // Map existing color scheme to closest palette
  if (cs.primary.includes("orange") || cs.primary.includes("amber")) return PALETTES[0];
  if (cs.primary.includes("blue") || cs.primary.includes("cyan")) return PALETTES[1];
  if (cs.primary.includes("rose") || cs.primary.includes("pink")) return PALETTES[2];
  if (cs.primary.includes("green") || cs.primary.includes("emerald") || cs.primary.includes("teal")) return PALETTES[3];
  if (cs.primary.includes("violet") || cs.primary.includes("purple")) return PALETTES[4];
  if (cs.primary.includes("stone") || cs.primary.includes("slate-8") || cs.primary.includes("slate-9")) return PALETTES[5];
  return PALETTES[0];
}

const isLightPalette = (p: Palette) => p.id === "mint";

// ─── Editable text helper ─────────────────────────────────────────────────────
function EditableText({
  value, onChange, className, multiline = false,
}: { value: string; onChange: (v: string) => void; className?: string; multiline?: boolean }) {
  const readonly = useContext(ReadonlyCtx);
  const [editing, setEditing] = useState(false);
  // In readonly (public site) mode — plain text, no editing chrome
  if (readonly) return <span className={className}>{value}</span>;
  if (editing) {
    const sharedClass = `${className} bg-white/10 border border-white/40 rounded px-1 outline-none min-w-[60px]`;
    return multiline
      ? <textarea autoFocus value={value} onChange={e => onChange(e.target.value)} onBlur={() => setEditing(false)}
          className={`${sharedClass} resize-none`} rows={2} />
      : <input autoFocus type="text" value={value} onChange={e => onChange(e.target.value)} onBlur={() => setEditing(false)}
          className={sharedClass} />;
  }
  return (
    <span
      className={`${className} cursor-text group relative`}
      onClick={() => setEditing(true)}
      title="Click to edit"
    >
      {value}
      <span className="absolute -top-5 left-0 text-xs bg-black/70 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        ✏️ Click to edit
      </span>
    </span>
  );
}

// ─── Palette picker panel ─────────────────────────────────────────────────────
function PalettePicker({ current, onSelect }: { current: Palette; onSelect: (p: Palette) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1.5 rounded-lg transition-colors"
      >
        <Palette size={13} />
        {current.name}
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-gray-900 border border-gray-700 rounded-xl p-3 grid grid-cols-4 gap-2 z-50 w-64 shadow-2xl">
          {PALETTES.map(p => (
            <button
              key={p.id}
              onClick={() => { onSelect(p); setOpen(false); }}
              title={p.name}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                p.id === current.id ? "border-white/50 bg-white/10" : "border-transparent hover:bg-white/5"
              }`}
            >
              <div className={`w-7 h-7 rounded-full ${p.primary}`} />
              <span className="text-[10px] text-gray-400 leading-tight text-center">{p.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Image upload helper ──────────────────────────────────────────────────────
function ImageUploadOverlay({ onUpload }: { onUpload: (dataUrl: string) => void }) {
  const readonly = useContext(ReadonlyCtx);
  const ref = useRef<HTMLInputElement>(null);
  if (readonly) return null;
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { if (ev.target?.result) onUpload(ev.target.result as string); };
    reader.readAsDataURL(file);
  };
  return (
    <>
      {/* Fixed position keeps the input outside any overflow-hidden ancestor so .click() always fires */}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ position: "fixed", top: -9999, left: -9999, opacity: 0, pointerEvents: "none" }}
      />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="absolute bottom-3 right-3 flex items-center gap-1.5 text-xs font-semibold bg-black/60 hover:bg-black/80 text-white border border-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm transition-colors z-10"
      >
        <Upload size={12} /> Upload photo
      </button>
    </>
  );
}

// ─── Editable service card ────────────────────────────────────────────────────
type ServiceCardVariant = "dark-row" | "dark-tile" | "light-card" | "light-row";

function EditableServiceCard({
  sv, photo, index, palette: p, variant, onUpdate, onDelete, onPhotoChange,
}: {
  sv: ServiceItem;
  photo: string;
  index: number;
  palette: Palette;
  variant: ServiceCardVariant;
  onUpdate: (i: number, fields: Partial<ServiceItem>) => void;
  onDelete: (i: number) => void;
  onPhotoChange: (i: number, url: string) => void;
}) {
  const readonly = useContext(ReadonlyCtx);
  const [hovering, setHovering] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { if (ev.target?.result) onPhotoChange(index, ev.target.result as string); };
    reader.readAsDataURL(file);
  };

  // Edit bar — inline (not absolutely positioned) so overflow-hidden never blocks clicks
  const editBar = readonly ? null : (
    <div className={`flex items-center gap-1 transition-opacity duration-150 ${hovering ? "opacity-100" : "opacity-50"}`}>
      {/* Fixed position keeps input outside overflow-hidden ancestors */}
      <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto}
        style={{ position: "fixed", top: -9999, left: -9999, opacity: 0, pointerEvents: "none" }} />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        title="Replace photo"
        className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-gray-800 hover:bg-gray-700 text-white transition-colors"
      >
        <Upload size={10} /> Photo
      </button>
      <button
        type="button"
        onClick={() => onDelete(index)}
        title="Remove service"
        className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white transition-colors"
      >
        <Trash2 size={10} /> Delete
      </button>
    </div>
  );

  if (variant === "dark-row") {
    return (
      <div
        className="group bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 hover:border-white/10 transition-all overflow-hidden"
        onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}
      >
        <div className="flex gap-4 p-4">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoUrl(photo, 160, 160)} alt={sv.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">{ICON_MAP[sv.icon ?? ""] ?? "🍽️"}</span>
              {editingTitle
                ? <input autoFocus value={sv.title} onChange={e => onUpdate(index, { title: e.target.value })} onBlur={() => setEditingTitle(false)} className="font-bold text-sm text-white bg-white/10 border border-white/30 rounded px-1 outline-none w-full" />
                : <h3 className="font-bold text-sm text-white cursor-text flex items-center gap-1" onClick={() => setEditingTitle(true)}>{sv.title} <Pencil size={10} className="opacity-0 group-hover:opacity-50 transition-opacity" /></h3>
              }
            </div>
            {editingDesc
              ? <textarea autoFocus value={sv.description} onChange={e => onUpdate(index, { description: e.target.value })} onBlur={() => setEditingDesc(false)} className="text-xs text-gray-300 bg-white/10 border border-white/30 rounded px-1 outline-none w-full resize-none" rows={2} />
              : <p className="text-xs text-gray-400 leading-relaxed cursor-text" onClick={() => setEditingDesc(true)}>{sv.description}</p>
            }
          </div>
        </div>
        <div className="flex justify-end px-3 pb-2">{editBar}</div>
      </div>
    );
  }

  if (variant === "dark-tile") {
    return (
      <div
        className="group rounded-2xl overflow-hidden bg-white/5"
        onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}
      >
        <div className="relative aspect-square">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoUrl(photo, 500, 500)} alt={sv.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />
          <div className="absolute inset-0 flex flex-col justify-end p-4">
            {editingTitle
              ? <input autoFocus value={sv.title} onChange={e => onUpdate(index, { title: e.target.value })} onBlur={() => setEditingTitle(false)} className="font-black text-sm text-white bg-white/10 border border-white/30 rounded px-1 outline-none w-full mb-1" />
              : <h3 className="font-black text-sm text-white mb-1 cursor-text" onClick={() => setEditingTitle(true)}>{sv.title}</h3>
            }
            {editingDesc
              ? <textarea autoFocus value={sv.description} onChange={e => onUpdate(index, { description: e.target.value })} onBlur={() => setEditingDesc(false)} className="text-xs text-white/70 bg-white/10 border border-white/20 rounded px-1 outline-none resize-none w-full" rows={2} />
              : <p className="text-xs text-white/60 leading-snug cursor-text" onClick={() => setEditingDesc(true)}>{sv.description}</p>
            }
          </div>
          <div className="absolute top-3 left-3 text-lg">{ICON_MAP[sv.icon ?? ""] ?? "✦"}</div>
        </div>
        <div className="flex justify-end px-3 py-1.5 bg-black/30">{editBar}</div>
      </div>
    );
  }

  if (variant === "light-card") {
    return (
      <div
        className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100"
        onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}
      >
        <div className="relative h-44 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoUrl(photo, 500, 280)} alt={sv.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{ICON_MAP[sv.icon ?? ""] ?? "✨"}</span>
            {editingTitle
              ? <input autoFocus value={sv.title} onChange={e => onUpdate(index, { title: e.target.value })} onBlur={() => setEditingTitle(false)} className="font-bold text-sm text-gray-900 border border-gray-300 rounded px-1 outline-none w-full" />
              : <h3 className="font-bold text-sm text-gray-900 cursor-text flex items-center gap-1" onClick={() => setEditingTitle(true)}>{sv.title} <Pencil size={10} className="opacity-0 group-hover:opacity-40 transition-opacity text-gray-400" /></h3>
            }
          </div>
          {editingDesc
            ? <textarea autoFocus value={sv.description} onChange={e => onUpdate(index, { description: e.target.value })} onBlur={() => setEditingDesc(false)} className="text-xs text-gray-500 border border-gray-200 rounded px-1 outline-none w-full resize-none" rows={2} />
            : <p className="text-xs text-gray-500 leading-relaxed cursor-text" onClick={() => setEditingDesc(true)}>{sv.description}</p>
          }
          <div className="flex justify-end mt-3 pt-2 border-t border-gray-100">{editBar}</div>
        </div>
      </div>
    );
  }

  // light-row (service layout)
  return (
    <div
      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
      onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}
    >
      <div className="relative h-36 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoUrl(photo, 400, 220)} alt={sv.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className={`absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-lg ${p.primary} ${p.primaryText}`}>
          {ICON_MAP[sv.icon ?? ""] ?? "⚡"}
        </div>
      </div>
      <div className="p-4">
        {editingTitle
          ? <input autoFocus value={sv.title} onChange={e => onUpdate(index, { title: e.target.value })} onBlur={() => setEditingTitle(false)} className="font-bold text-sm text-gray-900 border border-gray-200 rounded px-1 outline-none w-full mb-1" />
          : <h3 className="font-bold text-sm text-gray-900 mb-1 cursor-text flex items-center gap-1" onClick={() => setEditingTitle(true)}>{sv.title} <Pencil size={10} className="opacity-0 group-hover:opacity-40 transition-opacity text-gray-400" /></h3>
        }
        {editingDesc
          ? <textarea autoFocus value={sv.description} onChange={e => onUpdate(index, { description: e.target.value })} onBlur={() => setEditingDesc(false)} className="text-xs text-gray-500 border border-gray-200 rounded px-1 outline-none w-full resize-none" rows={2} />
          : <p className="text-xs text-gray-500 leading-relaxed cursor-text" onClick={() => setEditingDesc(true)}>{sv.description}</p>
        }
        <div className="flex justify-end mt-3 pt-2 border-t border-gray-100">{editBar}</div>
      </div>
    </div>
  );
}

// ─── Contact form (functional on public sites) ────────────────────────────────
function getPublicSlug(): string {
  if (typeof window === "undefined") return "";
  const host = window.location.hostname;
  const parts = host.split(".");
  if (parts.length >= 3 && host.includes("instantlocalbusiness.com")) return parts[0];
  const m = window.location.pathname.match(/^\/sites\/([^/]+)/);
  return m?.[1] ?? "";
}

type ContactMode = "contact" | "appointment" | "reservation";

const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM",
  "1:00 PM",  "2:00 PM",  "3:00 PM", "4:00 PM",
  "5:00 PM",  "6:00 PM",
];

function ContactForm({
  ctaButtonLabel,
  ctaFormPlaceholder,
  dark = false,
  rounded = "rounded-xl",
  buttonClass,
  mode = "contact",
}: {
  ctaButtonLabel: string;
  ctaFormPlaceholder: string;
  dark?: boolean;
  rounded?: string;
  buttonClass?: string;
  mode?: ContactMode;
}) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const [form, setForm] = useState({ name: "", contact: "", message: "", date: "", time: "", partySize: "2" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const isBooking = mode === "appointment" || mode === "reservation";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isBooking && !form.time) return;
    const slug = getPublicSlug();
    setStatus("submitting");
    try {
      const res = await fetch("/api/site-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, mode, ...form }),
      });
      if (!res.ok) throw new Error(((await res.json()) as { error: string }).error ?? "Failed");
      setStatus("success");
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Failed to send");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  }

  const inputBase = `w-full px-4 py-3 ${rounded} text-base font-sans focus:outline-none focus:ring-2`;
  const inputClass = `${inputBase} bg-white text-gray-900 placeholder-gray-400 border border-gray-300 focus:border-blue-400 focus:ring-blue-100`;
  const defaultBtn = `w-full font-bold py-3 ${rounded} text-sm bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors`;

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <CheckCircle2 size={32} className="text-green-400 mx-auto mb-3" />
        <p className="font-semibold text-base text-white">
          {isBooking ? "Request received!" : "Message sent!"}
        </p>
        <p className="text-xs mt-1 text-white/60">
          {isBooking ? "We\u2019ll confirm your appointment shortly." : "We\u2019ll get back to you shortly."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        required
        value={form.name}
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        placeholder="Your name"
        className={inputClass}
      />
      <input
        required
        value={form.contact}
        onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
        placeholder="Phone or email"
        className={inputClass}
      />

      {isBooking && (
        <>
          <input
            required
            type="date"
            min={minDate}
            value={form.date}
            onChange={e => setForm(f => ({ ...f, date: e.target.value, time: "" }))}
            className={inputClass}
          />
          {form.date && (
            <div>
              <p className="text-xs font-semibold mb-2 text-gray-400 uppercase tracking-wide">Pick a time</p>
              <div className="grid grid-cols-3 gap-1.5">
                {TIME_SLOTS.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, time: slot }))}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                      form.time === slot
                        ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}
          {mode === "reservation" && (
            <select
              value={form.partySize}
              onChange={e => setForm(f => ({ ...f, partySize: e.target.value }))}
              className={inputClass}
            >
              {[1,2,3,4,5,6,7,8,10,12].map(n => (
                <option key={n} value={String(n)}>{n} {n === 1 ? "guest" : "guests"}</option>
              ))}
            </select>
          )}
        </>
      )}

      <textarea
        rows={isBooking ? 2 : 3}
        value={form.message}
        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
        placeholder={
          mode === "appointment" ? "Any special requests? (optional)" :
          mode === "reservation" ? "Special occasion or dietary needs? (optional)" :
          ctaFormPlaceholder || "How can we help?"
        }
        className={`${inputClass} resize-none`}
      />

      {status === "error" && <p className="text-red-400 text-xs">{errMsg}</p>}

      <button
        type="submit"
        disabled={status === "submitting" || (isBooking && !!form.date && !form.time)}
        className={buttonClass ?? defaultBtn}
      >
        {status === "submitting" ? "Sending…" : ctaButtonLabel}
      </button>

      {isBooking && form.date && !form.time && (
        <p className="text-xs text-center opacity-50 text-gray-300">Select a time slot above to continue</p>
      )}
    </form>
  );
}

function AddServiceButton({ onAdd, dark }: { onAdd: () => void; dark?: boolean }) {
  const readonly = useContext(ReadonlyCtx);
  if (readonly) return null;
  return (
    <button
      onClick={onAdd}
      className={`flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed text-sm font-semibold transition-all min-h-[80px] ${
        dark
          ? "border-white/20 text-white/40 hover:border-white/50 hover:text-white/70 hover:bg-white/5"
          : "border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/50"
      }`}
    >
      <Plus size={16} /> Add service
    </button>
  );
}

function ServiceEditHint({ dark }: { dark?: boolean }) {
  const readonly = useContext(ReadonlyCtx);
  if (readonly) return null;
  return (
    <p className={`text-xs text-center mb-3 ${dark ? "text-white/30" : "text-gray-400"}`}>
      <Pencil size={10} className="inline mr-1 mb-0.5" />
      Click any title or description to edit · hover a card to replace photo or delete
    </p>
  );
}

// ─── ICON MAP ─────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ReactNode> = {
  wrench: "🔧", scissors: "✂️", scale: "⚖️", heart: "❤️",
  utensils: "🍽️", car: "🚗", leaf: "🌿", home: "🏠",
  star: "⭐", shield: "🛡️", clock: "⏰", phone: "📞",
};

// ═══════════════════════════════════════════════════════════════════════════════
// HOSPITALITY LAYOUT — Restaurants, Cafes, Bakeries
// Lifestyle-brand vibes: full-bleed imagery, editorial typography, warm atmosphere
// ═══════════════════════════════════════════════════════════════════════════════
function HospitalityLayout({ site, p, compact, customHero, setCustomHero, onSiteChange }: LayoutProps) {
  const [s, setS] = useState(site);
  const [svcs, setSvcs] = useState<ServiceItem[]>(site.services);
  const [svcPhotos, setSvcPhotos] = useState<string[]>(site.servicePhotos);
  const updateSvc = (i: number, fields: Partial<ServiceItem>) => setSvcs(prev => prev.map((v, idx) => idx === i ? { ...v, ...fields } : v));
  const deleteSvc = (i: number) => { setSvcs(prev => prev.filter((_, idx) => idx !== i)); setSvcPhotos(prev => prev.filter((_, idx) => idx !== i)); };
  const addSvc = () => { setSvcs(prev => [...prev, { title: "New Service", description: "Describe this service", icon: "" }]); setSvcPhotos(prev => [...prev, svcPhotos[0] ?? ""]); };
  const updateSvcPhoto = (i: number, url: string) => setSvcPhotos(prev => prev.map((v, idx) => idx === i ? url : v));
  const onSiteChangeRef = useRef(onSiteChange);
  useEffect(() => { onSiteChangeRef.current = onSiteChange; });
  useEffect(() => { onSiteChangeRef.current?.({ ...s, services: svcs, servicePhotos: svcPhotos, heroPhoto: customHero ?? s.heroPhoto }); }, [s, svcs, svcPhotos, customHero]);
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const businessName = s.heroHeadline.split(":")[0] || "Business";
  const light = isLightPalette(p);

  return (
    <div className="font-sans bg-gray-950 text-white">
      {/* ── Nav ── */}
      <nav className={`flex items-center justify-between px-6 py-4 ${p.navBg} backdrop-blur-md border-b ${p.sectionBorder} sticky top-0 z-20`}>
        <div>
          <EditableText value={businessName} onChange={v => setS({...s, heroHeadline: v + ": " + s.heroHeadline.split(": ").slice(1).join(": ")})}
            className={`font-extrabold text-base tracking-tight ${p.navText}`} />
          <EditableText value={s.tagline} onChange={v => setS({...s, tagline: v})}
            className={`text-xs mt-0.5 block ${p.navLink.split(" ")[0]}`} />
        </div>
        {!compact && (
          <div className="flex items-center gap-6 text-sm font-medium">
            {[{l:"About",id:"about"},{l:"Menu",id:"services"},{l:"Visit",id:"contact"}].map(({l,id}) => (
              <button key={id} onClick={() => scrollTo(id)} className={`${p.navLink} transition-colors`}>{l}</button>
            ))}
          </div>
        )}
        <button className={`text-xs font-bold px-4 py-2 rounded-full ${p.primary} ${p.primaryText} ${p.primaryHover} transition-colors`}>
          {compact ? "Order" : s.primaryCta}
        </button>
      </nav>

      {/* ── Cinematic hero — full bleed with bottom gradient ── */}
      <div className="relative overflow-hidden" style={{height: compact ? 320 : 560}}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={customHero ?? photoUrl(s.heroPhoto, 1400, 700)} alt="hero"
          className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className={`absolute inset-0 bg-gradient-to-t ${p.hero} opacity-90`} />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-transparent to-transparent" />
        <ImageUploadOverlay onUpload={setCustomHero} />

        {/* Content — bottom-left aligned (editorial style) */}
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-10">
          <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 ${p.badge} backdrop-blur-sm`}>
            {s.heroBadge}
          </span>
          <EditableText value={s.heroHeadline} onChange={v => setS({...s, heroHeadline: v})}
            className="block text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-3 max-w-2xl" multiline />
          <EditableText value={s.heroSubheadline} onChange={v => setS({...s, heroSubheadline: v})}
            className="block text-sm text-white/70 mb-6 max-w-lg" multiline />
          <div className="flex gap-3 flex-wrap">
            <button className={`font-bold px-6 py-3 rounded-full text-sm ${p.primary} ${p.primaryText} ${p.primaryHover} transition-all hover:scale-105`}>
              {s.primaryCta}
            </button>
            <button className="font-semibold px-6 py-3 rounded-full text-sm border border-white/25 text-white/80 hover:border-white/50 hover:bg-white/5 transition-all backdrop-blur-sm">
              {s.secondaryCta}
            </button>
          </div>
        </div>
      </div>

      {/* ── Scrolling trust ticker ── */}
      <div className={`${p.primary} ${p.primaryText} py-2.5 px-6 flex items-center justify-center gap-8 text-xs font-bold overflow-hidden`}>
        {site.trustPoints.map(pt => <span key={pt} className="flex items-center gap-1.5 shrink-0"><CheckCircle2 size={11}/> {pt}</span>)}
      </div>

      {/* ── Stats ── */}
      <div className={`grid grid-cols-3 ${p.sectionAlt} border-b ${p.sectionBorder}`}>
        {s.stats.map(st => (
          <div key={st.label} className={`py-6 text-center border-r ${p.sectionBorder} last:border-r-0`}>
            <div className={`text-2xl font-extrabold ${p.accent}`}>{st.value}</div>
            <div className={`text-xs mt-1 uppercase tracking-wider ${p.navLink.split(" ")[0]}`}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* ── Menu grid ── */}
      <div id="services" className="px-6 py-14 bg-gray-950">
        <div className="text-center mb-10">
          <span className={`text-xs font-bold uppercase tracking-widest ${p.accent} mb-2 block`}>What We Serve</span>
          <h2 className="text-2xl font-extrabold text-white">{s.aboutTitle}</h2>
        </div>
        {!compact && <ServiceEditHint dark />}
        <div className={`grid gap-4 ${compact ? "grid-cols-1" : "grid-cols-2"}`}>
          {svcs.map((sv, i) => (
            <EditableServiceCard key={i} sv={sv} photo={svcPhotos[i] ?? svcPhotos[0] ?? ""} index={i} palette={p} variant="dark-row" onUpdate={updateSvc} onDelete={deleteSvc} onPhotoChange={updateSvcPhoto} />
          ))}
          {!compact && <AddServiceButton onAdd={addSvc} dark />}
        </div>
      </div>

      {/* ── Atmospheric about quote ── */}
      <div id="about" className="relative py-20 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoUrl(s.servicePhotos[2] ?? s.heroPhoto, 1200, 500)} alt="" className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"/>
        <div className="relative max-w-2xl mx-auto px-8 text-center">
          <div className={`text-6xl font-serif leading-none mb-4 ${p.accent}`}>&ldquo;</div>
          <EditableText value={s.aboutBody} onChange={v => setS({...s, aboutBody: v})}
            className="block text-base text-white/90 leading-relaxed italic mb-6" multiline />
          <div className="flex items-center justify-center gap-2">
            <div className={`h-px w-12 ${p.primary.replace("bg-","bg-").replace("500","400")}`}/>
            <span className={`text-xs font-bold uppercase tracking-widest ${p.accent}`}>{businessName}</span>
            <div className={`h-px w-12 ${p.primary.replace("bg-","bg-").replace("500","400")}`}/>
          </div>
        </div>
      </div>

      {/* ── Contact bar ── */}
      <div id="contact" className={`grid ${compact ? "grid-cols-1" : "grid-cols-3"} ${p.sectionAlt} divide-y md:divide-y-0 md:divide-x divide-white/5`}>
        {[{I:Phone,l:"Reservations",v:s.phone},{I:MapPin,l:"Find Us",v:s.address},{I:Clock,l:"Hours",v:s.hours}].map(({I,l,v}) => (
          <div key={l} className="flex items-start gap-3 px-6 py-5">
            <I size={16} className={`mt-0.5 shrink-0 ${p.accent}`}/>
            <div><p className="text-xs font-bold text-white">{l}</p><p className="text-xs text-gray-500 mt-0.5">{v}</p></div>
          </div>
        ))}
      </div>

      {/* ── CTA booking ── */}
      <div className={`px-8 py-14 ${p.primary} text-center`}>
        <EditableText value={s.ctaHeading} onChange={v => setS({...s, ctaHeading: v})}
          className={`block text-xl font-extrabold mb-2 ${p.primaryText}`} />
        <p className={`text-sm mb-6 opacity-75 ${p.primaryText}`}>{s.ctaBody}</p>
        <div className="max-w-sm mx-auto">
          <ContactForm
            ctaButtonLabel={s.ctaButtonLabel}
            ctaFormPlaceholder={s.ctaFormPlaceholder}
            dark
            mode="reservation"
            buttonClass="w-full font-bold py-3 rounded-xl text-sm bg-gray-950 text-white hover:bg-gray-800 disabled:opacity-60 transition-colors"
          />
        </div>
      </div>

      <footer className="px-6 py-6 bg-black text-center text-xs text-gray-600">
        © {new Date().getFullYear()} {businessName}. All rights reserved.
        <span className="ml-2 text-gray-700">· Powered by InstantLocalBusiness.com</span>
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICE LAYOUT — Plumbers, Electricians, Auto, Cleaning, Landscaping
// Bold, trust-first, huge CTA, emergency-ready
// ═══════════════════════════════════════════════════════════════════════════════
function ServiceLayout({ site, p, compact, customHero, setCustomHero, onSiteChange }: LayoutProps) {
  const [s, setS] = useState(site);
  const [svcs, setSvcs] = useState<ServiceItem[]>(site.services);
  const [svcPhotos, setSvcPhotos] = useState<string[]>(site.servicePhotos);
  const updateSvc = (i: number, fields: Partial<ServiceItem>) => setSvcs(prev => prev.map((v, idx) => idx === i ? { ...v, ...fields } : v));
  const deleteSvc = (i: number) => { setSvcs(prev => prev.filter((_, idx) => idx !== i)); setSvcPhotos(prev => prev.filter((_, idx) => idx !== i)); };
  const addSvc = () => { setSvcs(prev => [...prev, { title: "New Service", description: "Describe this service", icon: "" }]); setSvcPhotos(prev => [...prev, svcPhotos[0] ?? ""]); };
  const updateSvcPhoto = (i: number, url: string) => setSvcPhotos(prev => prev.map((v, idx) => idx === i ? url : v));
  const onSiteChangeRef = useRef(onSiteChange);
  useEffect(() => { onSiteChangeRef.current = onSiteChange; });
  useEffect(() => { onSiteChangeRef.current?.({ ...s, services: svcs, servicePhotos: svcPhotos, heroPhoto: customHero ?? s.heroPhoto }); }, [s, svcs, svcPhotos, customHero]);
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const businessName = s.heroHeadline.split(":")[0] || "Business";

  return (
    <div className="font-sans bg-white text-gray-900">
      {/* Emergency top bar */}
      <div className={`${p.primary} ${p.primaryText} py-2 px-6 flex items-center justify-center gap-4 text-xs font-bold`}>
        <Phone size={11}/> <span>{s.phone}</span>
        <span className="hidden sm:inline">·</span>
        <span className="hidden sm:inline">{s.trustPoints[0]}</span>
        <span className="ml-auto hidden sm:inline">{s.heroBadge}</span>
      </div>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-20">
        <div>
          <EditableText value={businessName} onChange={v => setS({...s, heroHeadline: v})}
            className="font-extrabold text-base text-gray-900" />
          <EditableText value={s.tagline} onChange={v => setS({...s, tagline: v})}
            className="text-xs text-gray-400 mt-0.5 block" />
        </div>
        {!compact && (
          <div className="flex items-center gap-6 text-sm font-medium">
            {[{l:"Services",id:"services"},{l:"About",id:"about"},{l:"Contact",id:"contact"}].map(({l,id}) => (
              <button key={id} onClick={() => scrollTo(id)} className="text-gray-500 hover:text-gray-900 transition-colors">{l}</button>
            ))}
          </div>
        )}
        <button className={`text-xs font-bold px-4 py-2 rounded-lg ${p.primary} ${p.primaryText} ${p.primaryHover} transition-colors`}>
          Free Quote
        </button>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{height: compact ? 300 : 480}}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={customHero ?? photoUrl(s.heroPhoto, 1400, 600)} alt="hero"
          className="absolute inset-0 w-full h-full object-cover" />
        <div className={`absolute inset-0 bg-gradient-to-r ${p.hero} opacity-95`}/>
        <ImageUploadOverlay onUpload={setCustomHero} />
        <div className="absolute inset-0 flex flex-col justify-center px-10">
          <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-5 ${p.badge} w-fit`}>{s.heroBadge}</span>
          <EditableText value={s.heroHeadline} onChange={v => setS({...s, heroHeadline: v})}
            className="block text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4 max-w-xl" multiline />
          <EditableText value={s.heroSubheadline} onChange={v => setS({...s, heroSubheadline: v})}
            className="block text-sm text-white/70 mb-8 max-w-md" multiline />
          {/* Giant phone CTA */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <a href={`tel:${s.phone}`} className={`flex items-center gap-3 ${p.primary} ${p.primaryText} font-extrabold text-lg px-7 py-4 rounded-2xl hover:scale-105 transition-transform`}>
              <Phone size={20}/> {s.phone}
            </a>
            <button className="text-sm font-semibold text-white/70 border border-white/20 px-5 py-4 rounded-2xl hover:bg-white/5">
              {s.secondaryCta}
            </button>
          </div>
        </div>
      </div>

      {/* Trust row */}
      <div className="bg-gray-900 py-4 px-6">
        <div className="flex flex-wrap items-center justify-center gap-6">
          {[Shield, Award, Zap, CheckCircle2].map((Icon, i) => (
            s.trustPoints[i] && (
              <div key={i} className="flex items-center gap-2 text-xs font-semibold text-white">
                <Icon size={14} className={p.accent}/> {s.trustPoints[i]}
              </div>
            )
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 border-b border-gray-100">
        {s.stats.map(st => (
          <div key={st.label} className="py-7 text-center border-r last:border-r-0 border-gray-100">
            <div className={`text-2xl font-extrabold ${p.accent}`}>{st.value}</div>
            <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{st.label}</div>
          </div>
        ))}
      </div>

      {/* Services */}
      <div id="services" className="px-6 py-12 bg-gray-50">
        <div className="text-center mb-10">
          <span className={`text-xs font-bold uppercase tracking-widest ${p.accent} mb-2 block`}>What We Do</span>
          <h2 className="text-2xl font-extrabold text-gray-900">Our Services</h2>
        </div>
        {!compact && <ServiceEditHint />}
        <div className={`grid gap-4 ${compact ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
          {svcs.map((sv, i) => (
            <EditableServiceCard key={i} sv={sv} photo={svcPhotos[i] ?? svcPhotos[0] ?? ""} index={i} palette={p} variant="light-row" onUpdate={updateSvc} onDelete={deleteSvc} onPhotoChange={updateSvcPhoto} />
          ))}
          {!compact && <AddServiceButton onAdd={addSvc} />}
        </div>
      </div>

      {/* About + quote form */}
      <div id="about" className={`grid ${compact ? "grid-cols-1" : "grid-cols-2"}`}>
        <div className="px-8 py-12 bg-gray-900 text-white">
          <span className={`text-xs font-bold uppercase tracking-widest ${p.accent} mb-3 block`}>About Us</span>
          <EditableText value={s.aboutTitle} onChange={v => setS({...s, aboutTitle: v})}
            className="block text-xl font-extrabold text-white mb-4" />
          <EditableText value={s.aboutBody} onChange={v => setS({...s, aboutBody: v})}
            className="block text-sm text-gray-300 leading-relaxed mb-6" multiline />
          <div id="contact" className="space-y-3">
            {[{I:Phone,v:s.phone},{I:MapPin,v:s.address},{I:Clock,v:s.hours}].map(({I,v}) => (
              <div key={v} className="flex items-center gap-2 text-sm text-gray-400">
                <I size={14} className={p.accent}/> {v}
              </div>
            ))}
          </div>
        </div>
        <div className={`px-8 py-12 ${p.primary}`}>
          <EditableText value={s.ctaHeading} onChange={v => setS({...s, ctaHeading: v})}
            className={`block text-lg font-extrabold mb-2 ${p.primaryText}`} />
          <p className={`text-xs mb-5 opacity-75 ${p.primaryText}`}>{s.ctaBody}</p>
          <ContactForm
            ctaButtonLabel={s.ctaButtonLabel}
            ctaFormPlaceholder={s.ctaFormPlaceholder}
            dark
          />
        </div>
      </div>

      <footer className="px-6 py-5 bg-gray-900 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} {businessName}. All rights reserved. · Powered by InstantLocalBusiness.com
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// WELLNESS LAYOUT — Salons, Dental, Gym, Spa, Pet Grooming
// Editorial, clean white, booking-first, lifestyle photography
// ═══════════════════════════════════════════════════════════════════════════════
function WellnessLayout({ site, p, compact, customHero, setCustomHero, onSiteChange }: LayoutProps) {
  const [s, setS] = useState(site);
  const [svcs, setSvcs] = useState<ServiceItem[]>(site.services);
  const [svcPhotos, setSvcPhotos] = useState<string[]>(site.servicePhotos);
  const updateSvc = (i: number, fields: Partial<ServiceItem>) => setSvcs(prev => prev.map((v, idx) => idx === i ? { ...v, ...fields } : v));
  const deleteSvc = (i: number) => { setSvcs(prev => prev.filter((_, idx) => idx !== i)); setSvcPhotos(prev => prev.filter((_, idx) => idx !== i)); };
  const addSvc = () => { setSvcs(prev => [...prev, { title: "New Service", description: "Describe this service", icon: "" }]); setSvcPhotos(prev => [...prev, svcPhotos[0] ?? ""]); };
  const updateSvcPhoto = (i: number, url: string) => setSvcPhotos(prev => prev.map((v, idx) => idx === i ? url : v));
  const onSiteChangeRef = useRef(onSiteChange);
  useEffect(() => { onSiteChangeRef.current = onSiteChange; });
  useEffect(() => { onSiteChangeRef.current?.({ ...s, services: svcs, servicePhotos: svcPhotos, heroPhoto: customHero ?? s.heroPhoto }); }, [s, svcs, svcPhotos, customHero]);
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const businessName = s.heroHeadline.split(":")[0] || "Business";

  return (
    <div className="font-sans bg-white text-gray-900">
      {/* Nav — minimal, white */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-20">
        <div>
          <EditableText value={businessName} onChange={v => setS({...s, heroHeadline: v})}
            className="font-extrabold text-base text-gray-900 tracking-tight" />
          <EditableText value={s.tagline} onChange={v => setS({...s, tagline: v})}
            className="text-xs text-gray-400 mt-0.5 block" />
        </div>
        {!compact && (
          <div className="flex items-center gap-6 text-sm font-medium">
            {[{l:"Services",id:"services"},{l:"About",id:"about"},{l:"Book",id:"contact"}].map(({l,id}) => (
              <button key={id} onClick={() => scrollTo(id)} className="text-gray-500 hover:text-gray-900 transition-colors">{l}</button>
            ))}
          </div>
        )}
        <button className={`text-xs font-bold px-5 py-2.5 rounded-full ${p.primary} ${p.primaryText} ${p.primaryHover} transition-all hover:scale-105`}>
          Book Now
        </button>
      </nav>

      {/* Hero — full bleed, soft gradient bottom */}
      <div className="relative overflow-hidden" style={{height: compact ? 320 : 520}}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={customHero ?? photoUrl(s.heroPhoto, 1400, 700)} alt="hero"
          className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"/>
        <ImageUploadOverlay onUpload={setCustomHero} />

        {/* Centered hero content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
          <div className="bg-white/90 backdrop-blur-md text-gray-800 text-xs font-bold px-4 py-1.5 rounded-full mb-5 shadow-sm">
            {s.heroBadge}
          </div>
          <EditableText value={s.heroHeadline} onChange={v => setS({...s, heroHeadline: v})}
            className="block text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-3 max-w-2xl drop-shadow-lg" multiline />
          <EditableText value={s.heroSubheadline} onChange={v => setS({...s, heroSubheadline: v})}
            className="block text-sm text-white/85 mb-7 max-w-lg drop-shadow" multiline />
          <div className="flex gap-3 flex-wrap justify-center">
            <button className={`font-bold px-8 py-3.5 rounded-full text-sm ${p.primary} ${p.primaryText} ${p.primaryHover} transition-all hover:scale-105 shadow-lg`}>
              {s.primaryCta}
            </button>
            <button className="font-semibold px-8 py-3.5 rounded-full text-sm bg-white/20 text-white border border-white/30 hover:bg-white/30 backdrop-blur-sm transition-all">
              {s.secondaryCta}
            </button>
          </div>
        </div>

        {/* Reviews floating badge */}
        {!compact && (
          <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg flex items-center gap-2">
            <div className="flex">{[1,2,3,4,5].map(i => <Star key={i} size={12} className="fill-amber-400 text-amber-400"/>)}</div>
            <span className="text-xs font-bold text-gray-800">5.0 · Loved by customers</span>
          </div>
        )}
      </div>

      {/* Trust pills */}
      <div className="py-4 px-6 bg-white border-b border-gray-100 flex flex-wrap justify-center gap-2">
        {s.trustPoints.map(pt => (
          <span key={pt} className={`text-xs font-semibold px-3 py-1.5 rounded-full ${p.tag}`}>{pt}</span>
        ))}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4 px-6 py-8 bg-gray-50">
        {s.stats.map(st => (
          <div key={st.label} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className={`text-2xl font-extrabold ${p.accent}`}>{st.value}</div>
            <div className="text-xs text-gray-400 mt-1">{st.label}</div>
          </div>
        ))}
      </div>

      {/* Services — portrait card grid */}
      <div id="services" className="px-6 py-12">
        <div className="text-center mb-10">
          <span className={`text-xs font-bold uppercase tracking-widest ${p.accent} mb-2 block`}>What We Offer</span>
          <h2 className="text-2xl font-extrabold text-gray-900">{s.aboutTitle}</h2>
        </div>
        {!compact && <ServiceEditHint />}
        <div className={`grid gap-5 ${compact ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
          {svcs.map((sv, i) => (
            <EditableServiceCard key={i} sv={sv} photo={svcPhotos[i] ?? svcPhotos[0] ?? ""} index={i} palette={p} variant="light-card" onUpdate={updateSvc} onDelete={deleteSvc} onPhotoChange={updateSvcPhoto} />
          ))}
          {!compact && <AddServiceButton onAdd={addSvc} />}
        </div>
      </div>

      {/* About — split photo */}
      <div id="about" className={`grid ${compact ? "grid-cols-1" : "grid-cols-2"} bg-gray-50`}>
        <div className="relative min-h-[280px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoUrl(s.servicePhotos[1] ?? s.heroPhoto, 600, 400)} alt="about"
            className="absolute inset-0 w-full h-full object-cover"/>
        </div>
        <div className="px-8 py-12 flex flex-col justify-center">
          <span className={`text-xs font-bold uppercase tracking-widest ${p.accent} mb-3 block`}>Our Story</span>
          <EditableText value={s.aboutTitle} onChange={v => setS({...s, aboutTitle: v})}
            className="block text-xl font-extrabold text-gray-900 mb-4" />
          <EditableText value={s.aboutBody} onChange={v => setS({...s, aboutBody: v})}
            className="block text-sm text-gray-600 leading-relaxed mb-6" multiline />
          <div id="contact" className="space-y-2.5">
            {[{I:Phone,v:s.phone},{I:MapPin,v:s.address},{I:Clock,v:s.hours}].map(({I,v}) => (
              <div key={v} className="flex items-center gap-2 text-sm text-gray-500">
                <I size={14} className={p.accent}/> {v}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className={`px-8 py-14 ${p.primary} text-center`}>
        <EditableText value={s.ctaHeading} onChange={v => setS({...s, ctaHeading: v})}
          className={`block text-2xl font-extrabold mb-2 ${p.primaryText}`} />
        <p className={`text-sm opacity-75 mb-6 ${p.primaryText}`}>{s.ctaBody}</p>
        <div className="max-w-sm mx-auto">
          <ContactForm
            ctaButtonLabel={s.ctaButtonLabel}
            ctaFormPlaceholder={s.ctaFormPlaceholder}
            dark
            mode="appointment"
            rounded="rounded-full"
            buttonClass="w-full font-bold py-3 rounded-full text-sm bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60 transition-colors"
          />
        </div>
      </div>

      <footer className="px-6 py-5 bg-gray-900 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} {businessName}. All rights reserved. · Powered by InstantLocalBusiness.com
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROFESSIONAL LAYOUT — Law, Accounting, Real Estate, Photography
// Premium, minimal, authority, dark navy + clean white
// ═══════════════════════════════════════════════════════════════════════════════
function ProfessionalLayout({ site, p, compact, customHero, setCustomHero, onSiteChange }: LayoutProps) {
  const [s, setS] = useState(site);
  const [svcs, setSvcs] = useState<ServiceItem[]>(site.services);
  const [svcPhotos, setSvcPhotos] = useState<string[]>(site.servicePhotos);
  const updateSvc = (i: number, fields: Partial<ServiceItem>) => setSvcs(prev => prev.map((v, idx) => idx === i ? { ...v, ...fields } : v));
  const deleteSvc = (i: number) => { setSvcs(prev => prev.filter((_, idx) => idx !== i)); setSvcPhotos(prev => prev.filter((_, idx) => idx !== i)); };
  const addSvc = () => { setSvcs(prev => [...prev, { title: "New Service", description: "Describe this service", icon: "" }]); setSvcPhotos(prev => [...prev, svcPhotos[0] ?? ""]); };
  const updateSvcPhoto = (i: number, url: string) => setSvcPhotos(prev => prev.map((v, idx) => idx === i ? url : v));
  const onSiteChangeRef = useRef(onSiteChange);
  useEffect(() => { onSiteChangeRef.current = onSiteChange; });
  useEffect(() => { onSiteChangeRef.current?.({ ...s, services: svcs, servicePhotos: svcPhotos, heroPhoto: customHero ?? s.heroPhoto }); }, [s, svcs, svcPhotos, customHero]);
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const businessName = s.heroHeadline.split(":")[0] || "Business";

  return (
    <div className="font-sans bg-white text-gray-900">
      <nav className="flex items-center justify-between px-8 py-5 bg-slate-900 sticky top-0 z-20">
        <div>
          <EditableText value={businessName} onChange={v => setS({...s, heroHeadline: v})}
            className="font-extrabold text-base text-white tracking-tight" />
          <EditableText value={s.tagline} onChange={v => setS({...s, tagline: v})}
            className="text-xs text-slate-400 mt-0.5 block" />
        </div>
        {!compact && (
          <div className="flex items-center gap-6 text-sm font-medium">
            {[{l:"Practice Areas",id:"services"},{l:"About",id:"about"},{l:"Contact",id:"contact"}].map(({l,id}) => (
              <button key={id} onClick={() => scrollTo(id)} className="text-slate-400 hover:text-white transition-colors">{l}</button>
            ))}
          </div>
        )}
        <button className={`text-xs font-bold px-5 py-2.5 rounded-lg ${p.primary} ${p.primaryText} ${p.primaryHover} transition-colors`}>
          Free Consultation
        </button>
      </nav>

      {/* Hero — side-by-side: text left, image right */}
      <div className={`grid ${compact ? "grid-cols-1" : "grid-cols-5"} min-h-[400px]`}>
        <div className="col-span-3 flex flex-col justify-center px-10 py-16 bg-slate-900">
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded bg-slate-800 text-slate-300 mb-6 w-fit border border-slate-700">
            {s.heroBadge}
          </span>
          <EditableText value={s.heroHeadline} onChange={v => setS({...s, heroHeadline: v})}
            className="block text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4 max-w-lg" multiline />
          <EditableText value={s.heroSubheadline} onChange={v => setS({...s, heroSubheadline: v})}
            className="block text-sm text-slate-300 leading-relaxed mb-8 max-w-md" multiline />
          <div className="flex gap-3 flex-wrap">
            <button className={`font-bold px-6 py-3.5 rounded-xl text-sm ${p.primary} ${p.primaryText} ${p.primaryHover} transition-all hover:scale-105`}>
              {s.primaryCta}
            </button>
            <button className="font-semibold px-6 py-3.5 rounded-xl text-sm border border-slate-700 text-slate-300 hover:border-slate-500 transition-colors">
              {s.secondaryCta}
            </button>
          </div>
        </div>
        {!compact && (
          <div className="col-span-2 relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={customHero ?? photoUrl(s.heroPhoto, 600, 600)} alt="hero"
              className="absolute inset-0 w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-slate-900/20"/>
            <ImageUploadOverlay onUpload={setCustomHero} />
          </div>
        )}
      </div>

      {/* Credential bar */}
      <div className="bg-slate-800 py-4 px-8">
        <div className="flex flex-wrap items-center justify-center gap-8">
          {s.trustPoints.map(pt => (
            <span key={pt} className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <CheckCircle2 size={13} className={p.accent}/> {pt}
            </span>
          ))}
        </div>
      </div>

      {/* Stats — large */}
      <div className="grid grid-cols-3 py-12 border-b border-gray-100">
        {s.stats.map(st => (
          <div key={st.label} className="text-center border-r last:border-r-0 border-gray-100">
            <div className="text-3xl font-extrabold text-slate-900">{st.value}</div>
            <div className="text-xs text-gray-400 mt-1 uppercase tracking-widest">{st.label}</div>
          </div>
        ))}
      </div>

      {/* Practice areas — numbered */}
      <div id="services" className="px-10 py-14">
        <div className="text-center mb-12">
          <span className={`text-xs font-bold uppercase tracking-widest ${p.accent} mb-2 block`}>Expertise</span>
          <h2 className="text-2xl font-extrabold text-gray-900">Practice Areas</h2>
        </div>
        {!compact && <ServiceEditHint />}
        <div className={`grid ${compact ? "grid-cols-1" : "grid-cols-2"} gap-6`}>
          {svcs.map((sv, i) => (
            <EditableServiceCard key={i} sv={sv} photo={svcPhotos[i] ?? svcPhotos[0] ?? ""} index={i} palette={p} variant="light-card" onUpdate={updateSvc} onDelete={deleteSvc} onPhotoChange={updateSvcPhoto} />
          ))}
          {!compact && <AddServiceButton onAdd={addSvc} />}
        </div>
      </div>

      {/* About — dark panel + light panel */}
      <div id="about" className={`grid ${compact ? "grid-cols-1" : "grid-cols-2"}`}>
        <div className="relative min-h-[300px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoUrl(s.servicePhotos[0] ?? s.heroPhoto, 600, 500)} alt="about"
            className="absolute inset-0 w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-slate-900/50"/>
        </div>
        <div className="px-10 py-12 bg-slate-900 flex flex-col justify-center">
          <span className={`text-xs font-bold uppercase tracking-widest ${p.accent} mb-3 block`}>Who We Are</span>
          <EditableText value={s.aboutTitle} onChange={v => setS({...s, aboutTitle: v})}
            className="block text-xl font-extrabold text-white mb-4" />
          <EditableText value={s.aboutBody} onChange={v => setS({...s, aboutBody: v})}
            className="block text-sm text-slate-300 leading-relaxed mb-6" multiline />
          <div id="contact" className="space-y-3">
            {[{I:Phone,v:s.phone},{I:MapPin,v:s.address},{I:Clock,v:s.hours}].map(({I,v}) => (
              <div key={v} className="flex items-center gap-2 text-sm text-slate-400">
                <I size={14} className="text-slate-300"/> {v}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-8 py-16 bg-white text-center">
        <EditableText value={s.ctaHeading} onChange={v => setS({...s, ctaHeading: v})}
          className="block text-2xl font-extrabold text-gray-900 mb-2" />
        <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">{s.ctaBody}</p>
        <div className="max-w-md mx-auto bg-slate-900 rounded-2xl p-6 text-left">
          <ContactForm
            ctaButtonLabel={s.ctaButtonLabel}
            ctaFormPlaceholder={s.ctaFormPlaceholder}
            dark
            mode="appointment"
            buttonClass={`w-full font-bold py-3.5 rounded-xl text-sm ${p.primary} ${p.primaryText} ${p.primaryHover} disabled:opacity-60 transition-colors`}
          />
        </div>
      </div>

      <footer className="px-6 py-5 bg-slate-900 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {businessName}. All rights reserved. · Powered by InstantLocalBusiness.com
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CREATIVE LAYOUT — Dance Studios, Photography, Florists
// Full-bleed dark hero, bold centered typography, image mosaic gallery
// ═══════════════════════════════════════════════════════════════════════════════
function CreativeLayout({ site, p, compact, customHero, setCustomHero, onSiteChange }: LayoutProps) {
  const [s, setS] = useState(site);
  const [svcs, setSvcs] = useState<ServiceItem[]>(site.services);
  const [svcPhotos, setSvcPhotos] = useState<string[]>(site.servicePhotos);
  const updateSvc = (i: number, fields: Partial<ServiceItem>) => setSvcs(prev => prev.map((v, idx) => idx === i ? { ...v, ...fields } : v));
  const deleteSvc = (i: number) => { setSvcs(prev => prev.filter((_, idx) => idx !== i)); setSvcPhotos(prev => prev.filter((_, idx) => idx !== i)); };
  const addSvc = () => { setSvcs(prev => [...prev, { title: "New Service", description: "Describe this service", icon: "" }]); setSvcPhotos(prev => [...prev, svcPhotos[0] ?? ""]); };
  const updateSvcPhoto = (i: number, url: string) => setSvcPhotos(prev => prev.map((v, idx) => idx === i ? url : v));
  const onSiteChangeRef = useRef(onSiteChange);
  useEffect(() => { onSiteChangeRef.current = onSiteChange; });
  useEffect(() => { onSiteChangeRef.current?.({ ...s, services: svcs, servicePhotos: svcPhotos, heroPhoto: customHero ?? s.heroPhoto }); }, [s, svcs, svcPhotos, customHero]);
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const businessName = s.heroHeadline.split(":")[0] || "Studio";

  return (
    <div className="font-sans bg-black text-white">
      {/* Nav */}
      <nav className={`flex items-center justify-between px-6 py-5 ${p.navBg} backdrop-blur-md sticky top-0 z-20 border-b ${p.sectionBorder}`}>
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${p.primary}`} />
          <EditableText value={businessName} onChange={v => setS({...s, heroHeadline: v + s.heroHeadline.slice(s.heroHeadline.indexOf(":"))})}
            className={`font-black text-sm tracking-tight uppercase ${p.navText}`} />
        </div>
        {!compact && (
          <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-widest">
            {[{l:"Work",id:"services"},{l:"Story",id:"about"},{l:"Contact",id:"contact"}].map(({l,id}) => (
              <button key={id} onClick={() => scrollTo(id)} className={`${p.navLink} transition-colors`}>{l}</button>
            ))}
          </div>
        )}
        <button className={`text-xs font-black uppercase tracking-wider px-5 py-2 rounded-full ${p.primary} ${p.primaryText} ${p.primaryHover} transition-all`}>
          {compact ? "Book" : s.primaryCta}
        </button>
      </nav>

      {/* Full-bleed hero — giant centered text */}
      <div className="relative overflow-hidden" style={{height: compact ? 380 : 620}}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={customHero ?? photoUrl(s.heroPhoto, 1600, 800)} alt="hero"
          className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-black/60" />
        <div className={`absolute inset-0 bg-gradient-to-b ${p.hero} opacity-70`} />
        <ImageUploadOverlay onUpload={setCustomHero} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <div className={`text-xs font-black uppercase tracking-[0.3em] mb-6 ${p.accent}`}>{s.heroBadge}</div>
          <EditableText value={s.heroHeadline} onChange={v => setS({...s, heroHeadline: v})}
            className="block text-4xl sm:text-6xl font-black text-white leading-none mb-5 max-w-3xl tracking-tight" multiline />
          <EditableText value={s.heroSubheadline} onChange={v => setS({...s, heroSubheadline: v})}
            className="block text-sm text-white/60 mb-8 max-w-md" multiline />
          <div className="flex gap-4 justify-center">
            <button className={`font-black uppercase tracking-wider px-8 py-3.5 rounded-full text-xs ${p.primary} ${p.primaryText} ${p.primaryHover} transition-all hover:scale-105`}>
              {s.primaryCta}
            </button>
            <button onClick={() => scrollTo("services")} className="font-bold uppercase tracking-wider px-8 py-3.5 rounded-full text-xs border border-white/30 text-white/80 hover:bg-white/10 transition-all">
              {s.secondaryCta}
            </button>
          </div>
        </div>
        <div className={`absolute bottom-0 left-0 right-0 h-1 ${p.primary} opacity-80`} />
      </div>

      {/* Trust strip */}
      <div className="bg-zinc-950 border-b border-white/5 py-3 px-6 flex items-center justify-center gap-8 overflow-hidden">
        {s.trustPoints.map(pt => (
          <span key={pt} className={`text-xs font-bold uppercase tracking-widest shrink-0 ${p.accent}`}>✦ {pt}</span>
        ))}
      </div>

      {/* Image mosaic */}
      <div id="services" className="bg-zinc-950 px-6 py-14">
        <div className="text-center mb-10">
          <div className={`text-xs font-black uppercase tracking-[0.25em] mb-3 ${p.accent}`}>What We Offer</div>
          <h2 className="text-3xl font-black text-white">{s.aboutTitle}</h2>
        </div>
        {!compact && <ServiceEditHint dark />}
        <div className={`grid gap-3 ${compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}>
          {svcs.map((sv, i) => (
            <EditableServiceCard key={i} sv={sv} photo={svcPhotos[i] ?? svcPhotos[0] ?? ""} index={i} palette={p} variant="dark-tile" onUpdate={updateSvc} onDelete={deleteSvc} onPhotoChange={updateSvcPhoto} />
          ))}
          {!compact && <AddServiceButton onAdd={addSvc} dark />}
        </div>
      </div>

      {/* Stats */}
      <div className={`${p.primary} py-6 px-6 grid grid-cols-3`}>
        {s.stats.map(st => (
          <div key={st.label} className="text-center">
            <div className={`text-2xl font-black ${p.primaryText}`}>{st.value}</div>
            <div className={`text-xs uppercase tracking-widest mt-1 opacity-70 ${p.primaryText}`}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* About */}
      <div id="about" className={`grid ${compact ? "grid-cols-1" : "grid-cols-2"} bg-zinc-950`}>
        <div className="relative overflow-hidden" style={{minHeight: 320}}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoUrl(s.servicePhotos[1] ?? s.heroPhoto, 800, 600)} alt="about"
            className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="flex flex-col justify-center px-8 py-12">
          <div className={`text-xs font-black uppercase tracking-[0.25em] mb-4 ${p.accent}`}>Our Story</div>
          <EditableText value={s.aboutTitle} onChange={v => setS({...s, aboutTitle: v})}
            className="block text-2xl font-black text-white mb-5 leading-tight" />
          <EditableText value={s.aboutBody} onChange={v => setS({...s, aboutBody: v})}
            className="block text-sm text-white/60 leading-relaxed" multiline />
        </div>
      </div>

      {/* Contact */}
      <div id="contact" className="bg-black px-8 py-14 text-center">
        <div className={`text-xs font-black uppercase tracking-[0.25em] mb-4 ${p.accent}`}>Let&apos;s Connect</div>
        <EditableText value={s.ctaHeading} onChange={v => setS({...s, ctaHeading: v})}
          className="block text-3xl font-black text-white mb-3" />
        <p className="text-sm text-white/50 mb-8 max-w-sm mx-auto">{s.ctaBody}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
          {[{I:Phone,v:s.phone},{I:MapPin,v:s.address},{I:Clock,v:s.hours}].map(({I,v}) => (
            <div key={v} className="flex items-center gap-2 text-sm text-white/50">
              <I size={14} className={p.accent}/> {v}
            </div>
          ))}
        </div>
        <div className="max-w-sm mx-auto w-full">
          <ContactForm
            ctaButtonLabel={s.ctaButtonLabel}
            ctaFormPlaceholder={s.ctaFormPlaceholder}
            dark
            mode="appointment"
            rounded="rounded-full"
            buttonClass={`w-full font-black uppercase tracking-wider py-4 rounded-full text-sm ${p.primary} ${p.primaryText} ${p.primaryHover} disabled:opacity-60 hover:scale-105 transition-all`}
          />
        </div>
      </div>

      <footer className="px-6 py-5 bg-zinc-950 border-t border-white/5 text-center text-xs text-white/20">
        © {new Date().getFullYear()} {businessName}. All rights reserved. · Powered by InstantLocalBusiness.com
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BOUTIQUE LAYOUT — Nail Salon, Massage Therapy, Pet Grooming
// Light, elegant, luxury personal-care feel with soft floating cards
// ═══════════════════════════════════════════════════════════════════════════════
function BoutiqueLayout({ site, p, compact, customHero, setCustomHero, onSiteChange }: LayoutProps) {
  const [s, setS] = useState(site);
  const [svcs, setSvcs] = useState<ServiceItem[]>(site.services);
  const [svcPhotos, setSvcPhotos] = useState<string[]>(site.servicePhotos);
  const updateSvc = (i: number, fields: Partial<ServiceItem>) => setSvcs(prev => prev.map((v, idx) => idx === i ? { ...v, ...fields } : v));
  const deleteSvc = (i: number) => { setSvcs(prev => prev.filter((_, idx) => idx !== i)); setSvcPhotos(prev => prev.filter((_, idx) => idx !== i)); };
  const addSvc = () => { setSvcs(prev => [...prev, { title: "New Service", description: "Describe this service", icon: "" }]); setSvcPhotos(prev => [...prev, svcPhotos[0] ?? ""]); };
  const updateSvcPhoto = (i: number, url: string) => setSvcPhotos(prev => prev.map((v, idx) => idx === i ? url : v));
  const onSiteChangeRef = useRef(onSiteChange);
  useEffect(() => { onSiteChangeRef.current = onSiteChange; });
  useEffect(() => { onSiteChangeRef.current?.({ ...s, services: svcs, servicePhotos: svcPhotos, heroPhoto: customHero ?? s.heroPhoto }); }, [s, svcs, svcPhotos, customHero]);
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const businessName = s.heroHeadline.split(":")[0] || "Boutique";

  return (
    <div className="font-sans bg-gray-50 text-gray-900">
      {/* Nav */}
      <nav className={`flex items-center justify-between px-6 py-4 ${p.navBg} backdrop-blur-md border-b ${p.sectionBorder} sticky top-0 z-20`}>
        <div>
          <EditableText value={businessName} onChange={v => setS({...s, heroHeadline: v + s.heroHeadline.slice(s.heroHeadline.indexOf(":"))})}
            className={`font-black text-base tracking-tight ${p.navText}`} />
          <EditableText value={s.tagline} onChange={v => setS({...s, tagline: v})}
            className={`text-xs mt-0.5 block italic ${p.navLink.split(" ")[0]}`} />
        </div>
        {!compact && (
          <div className="flex items-center gap-7 text-sm">
            {[{l:"Services",id:"services"},{l:"About",id:"about"},{l:"Book",id:"contact"}].map(({l,id}) => (
              <button key={id} onClick={() => scrollTo(id)} className={`${p.navLink} transition-colors font-medium`}>{l}</button>
            ))}
          </div>
        )}
        <button className={`text-xs font-bold px-5 py-2 rounded-full ${p.primary} ${p.primaryText} ${p.primaryHover} transition-all shadow-sm`}>
          {compact ? "Book" : "Book Now"}
        </button>
      </nav>

      {/* Split hero */}
      <div className={`grid ${compact ? "grid-cols-1" : "grid-cols-2"}`} style={{minHeight: compact ? 280 : 480}}>
        <div className="relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={customHero ?? photoUrl(s.heroPhoto, 900, 600)} alt="hero"
            className="absolute inset-0 w-full h-full object-cover" />
          <ImageUploadOverlay onUpload={setCustomHero} />
        </div>
        <div className="flex flex-col justify-center px-10 py-12 bg-white">
          <span className={`inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-5 w-fit ${p.badge}`}>{s.heroBadge}</span>
          <EditableText value={s.heroHeadline} onChange={v => setS({...s, heroHeadline: v})}
            className="block text-3xl font-black text-gray-900 leading-tight mb-4 max-w-sm" multiline />
          <EditableText value={s.heroSubheadline} onChange={v => setS({...s, heroSubheadline: v})}
            className="block text-sm text-gray-500 mb-7 max-w-xs leading-relaxed" multiline />
          <div className="flex gap-3 flex-wrap">
            <button className={`font-bold px-6 py-3 rounded-full text-sm ${p.primary} ${p.primaryText} ${p.primaryHover} transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5`}>
              {s.primaryCta}
            </button>
            <button className="font-semibold px-6 py-3 rounded-full text-sm border-2 border-gray-200 text-gray-600 hover:border-gray-400 transition-all">
              {s.secondaryCta}
            </button>
          </div>
        </div>
      </div>

      {/* Trust pills */}
      <div className="bg-white border-y border-gray-100 py-4 px-6 flex items-center justify-center gap-4 flex-wrap">
        {s.trustPoints.map(pt => (
          <span key={pt} className={`text-xs font-semibold px-4 py-1.5 rounded-full ${p.badge}`}>✓ {pt}</span>
        ))}
      </div>

      {/* Service cards */}
      <div id="services" className="px-6 py-14 bg-gray-50">
        <div className="text-center mb-10">
          <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${p.accent}`}>Our Services</div>
          <h2 className="text-2xl font-black text-gray-900">{s.aboutTitle}</h2>
        </div>
        {!compact && <ServiceEditHint />}
        <div className={`grid gap-5 ${compact ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
          {svcs.map((sv, i) => (
            <EditableServiceCard key={i} sv={sv} photo={svcPhotos[i] ?? svcPhotos[0] ?? ""} index={i} palette={p} variant="light-card" onUpdate={updateSvc} onDelete={deleteSvc} onPhotoChange={updateSvcPhoto} />
          ))}
          {!compact && <AddServiceButton onAdd={addSvc} />}
        </div>
      </div>

      {/* Stats */}
      <div className={`${p.primary} grid grid-cols-3 py-8`}>
        {s.stats.map(st => (
          <div key={st.label} className="text-center border-r last:border-r-0 border-white/20">
            <div className={`text-2xl font-black ${p.primaryText}`}>{st.value}</div>
            <div className={`text-xs mt-1 uppercase tracking-wider opacity-75 ${p.primaryText}`}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* About */}
      <div id="about" className="bg-white px-8 py-14 max-w-3xl mx-auto text-center">
        <div className={`text-xs font-bold uppercase tracking-widest mb-3 ${p.accent}`}>Our Philosophy</div>
        <EditableText value={s.aboutTitle} onChange={v => setS({...s, aboutTitle: v})}
          className="block text-2xl font-black text-gray-900 mb-5" />
        <EditableText value={s.aboutBody} onChange={v => setS({...s, aboutBody: v})}
          className="block text-sm text-gray-500 leading-relaxed italic" multiline />
      </div>

      {/* Booking CTA */}
      <div id="contact" className="bg-gray-50 px-8 py-14">
        <div className="max-w-lg mx-auto bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <div className={`text-xs font-bold uppercase tracking-widest mb-3 text-center ${p.accent}`}>Reserve Your Spot</div>
          <EditableText value={s.ctaHeading} onChange={v => setS({...s, ctaHeading: v})}
            className="block text-xl font-black text-gray-900 mb-2 text-center" />
          <p className="text-xs text-gray-400 mb-6 text-center">{s.ctaBody}</p>
          <ContactForm
            ctaButtonLabel={s.ctaButtonLabel}
            ctaFormPlaceholder={s.ctaFormPlaceholder}
            mode="appointment"
            buttonClass={`w-full font-bold py-3.5 rounded-xl text-sm ${p.primary} ${p.primaryText} ${p.primaryHover} disabled:opacity-60 transition-colors shadow-md`}
          />
          <div className="mt-6 flex flex-col gap-2">
            {[{I:Phone,v:s.phone},{I:MapPin,v:s.address},{I:Clock,v:s.hours}].map(({I,v}) => (
              <div key={v} className="flex items-center gap-2 text-xs text-gray-400">
                <I size={13} className={p.accent}/> {v}
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="px-6 py-5 bg-white border-t border-gray-100 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} {businessName}. All rights reserved. · Powered by InstantLocalBusiness.com
      </footer>
    </div>
  );
}

// ─── Shared props type ────────────────────────────────────────────────────────
type LayoutProps = {
  site: GeneratedSite;
  p: Palette;
  compact: boolean;
  customHero: string | null;
  setCustomHero: (url: string) => void;
  onSiteChange?: (updated: GeneratedSite) => void;
};

// ─── Main export — with palette picker + layout dispatcher ────────────────────
export function AISiteRenderer({ site, compact, onSiteChange, readonly = false }: {
  site: GeneratedSite;
  compact: boolean;
  onSiteChange?: (updated: GeneratedSite) => void;
  readonly?: boolean;
}) {
  const [palette, setPalette] = useState<Palette>(() => getPaletteFromScheme(site.colorScheme));
  const [customHero, setCustomHero] = useState<string | null>(null);

  const sharedProps: LayoutProps = { site, p: palette, compact, customHero, setCustomHero, onSiteChange };

  return (
    <ReadonlyCtx.Provider value={readonly}>
      <div className="relative">
        {/* Floating palette picker — only in edit mode */}
        {!compact && !readonly && (
          <div className="absolute top-16 right-3 z-30">
            <PalettePicker current={palette} onSelect={setPalette} />
          </div>
        )}

        {(() => {
          switch (site.layout) {
            case "hospitality":  return <HospitalityLayout {...sharedProps} />;
            case "service":      return <ServiceLayout {...sharedProps} />;
            case "wellness":     return <WellnessLayout {...sharedProps} />;
            case "professional": return <ProfessionalLayout {...sharedProps} />;
            case "creative":     return <CreativeLayout {...sharedProps} />;
            case "boutique":     return <BoutiqueLayout {...sharedProps} />;
            default:             return <WellnessLayout {...sharedProps} />;
          }
        })()}
      </div>
    </ReadonlyCtx.Provider>
  );
}

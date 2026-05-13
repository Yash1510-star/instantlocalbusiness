"use client";

import { useState } from "react";
import { CheckCircle2, Calendar, Clock, Loader2 } from "lucide-react";

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
];

function minDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

function maxDate() {
  const d = new Date();
  d.setDate(d.getDate() + 60);
  return d.toISOString().split("T")[0];
}

export default function DemoPage() {
  const [step, setStep] = useState<"form" | "success">("form");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!selectedDate) e.date = "Please pick a date";
    if (!selectedTime) e.time = "Please select a time";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setApiError("");
    try {
      const res = await fetch("/api/book-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, date: selectedDate, time: selectedTime }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setStep("success");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to book. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (step === "success") {
    const friendly = new Date(`${selectedDate}T12:00:00`).toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric",
    });
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Demo booked!</h1>
          <p className="text-gray-500 mb-2">
            <strong>{friendly}</strong> at <strong>{selectedTime} ET</strong>
          </p>
          <p className="text-gray-500 mb-6">
            A confirmation email with a calendar invite link has been sent to{" "}
            <strong>{form.email}</strong>.
          </p>
          <p className="text-sm text-gray-400">
            We&apos;ll send you a Google Meet link before the meeting. See you soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Book a free demo
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          See how we build your website live in under 60 seconds. No sales pressure —
          just a quick look at what&apos;s possible for your business.
        </p>
      </section>

      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Header */}
          <div className="bg-blue-600 px-8 py-6 text-white">
            <div className="flex items-center gap-3 mb-1">
              <Calendar size={18} />
              <span className="font-semibold">InstantLocalBusiness.com — Live Demo</span>
            </div>
            <div className="flex items-center gap-2 text-blue-200 text-sm">
              <Clock size={14} />
              20 minutes · Google Meet · Free
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {/* Name + Email */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Jane Smith"
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"}`}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="jane@yourbusiness.com"
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"}`}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Phone + Business */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="(555) 555-5555"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business name (optional)</label>
                <input
                  type="text"
                  value={form.businessName}
                  onChange={e => setForm({ ...form, businessName: e.target.value })}
                  placeholder="e.g. Maria's Tacos"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Date picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pick a date *
              </label>
              <input
                type="date"
                value={selectedDate}
                min={minDate()}
                max={maxDate()}
                onChange={e => setSelectedDate(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.date ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"}`}
              />
              {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
            </div>

            {/* Time slots */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pick a time * <span className="text-gray-400 font-normal">(Eastern Time)</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {timeSlots.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTime(t)}
                    className={`text-sm font-medium py-2.5 rounded-lg border transition-colors ${
                      selectedTime === t
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-700 hover:border-blue-200 hover:bg-blue-50/50"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time}</p>}
            </div>

            {apiError && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {apiError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? (
                <><Loader2 size={16} className="animate-spin" /> Booking…</>
              ) : (
                "Book My Free Demo"
              )}
            </button>

            <p className="text-xs text-gray-400 text-center">
              A confirmation email with a Google Calendar link will be sent to you instantly.
            </p>
          </form>
        </div>
      </section>
    </>
  );
}

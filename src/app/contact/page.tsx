"use client";

import { useState } from "react";
import { CheckCircle2, Mail, Phone, MapPin, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to send");
      setSent(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Get in touch
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          Questions about pricing? Need help getting started? We&apos;re here.
        </p>
      </section>

      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12">
          {/* Contact info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-6">Contact info</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-500">hello@instantlocalbusiness.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-500">1-800-ILB-SITE</p>
                    <p className="text-xs text-gray-400">Mon–Fri, 9am–6pm ET</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Headquarters</p>
                    <p className="text-sm text-gray-500">Columbus, OH</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Response time</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">General inquiries</span>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">&lt; 24 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pro support</span>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">&lt; 4 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Business support</span>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">&lt; 1 hour</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            {sent ? (
              <div className="bg-green-50 border border-green-100 rounded-2xl p-12 text-center">
                <CheckCircle2 size={40} className="text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Message sent!</h2>
                <p className="text-gray-500 text-sm">
                  Thanks for reaching out. We&apos;ll get back to you at{" "}
                  <strong>{form.email}</strong> within 24 hours.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white border border-gray-200 rounded-2xl p-8 space-y-5"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.name ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
                      }`}
                      placeholder="Your name"
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.email ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
                      }`}
                      placeholder="you@example.com"
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company (optional)
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your business name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a topic</option>
                      <option value="pricing">Pricing question</option>
                      <option value="sales">Enterprise / Business plan</option>
                      <option value="support">Technical support</option>
                      <option value="billing">Billing issue</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                      errors.message ? "border-red-300 bg-red-50" : "border-gray-200 bg-white text-gray-900"
                    }`}
                    placeholder="How can we help?"
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.message}</p>
                  )}
                </div>

                {submitError && (
                  <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">{submitError}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <><Loader2 size={16} className="animate-spin" /> Sending...</>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

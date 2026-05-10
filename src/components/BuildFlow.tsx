"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const categories = [
  "Restaurant / Cafe",
  "Hair Salon / Barbershop",
  "Auto Repair",
  "Plumbing",
  "Dental Office",
  "Real Estate",
  "Gym / Fitness Studio",
  "Landscaping",
  "Electrician",
  "Pet Grooming",
  "Bakery",
  "Law Firm",
  "Photography",
  "Accounting / Tax",
  "Chiropractic",
  "Florist",
  "Cleaning Services",
  "Other",
];

const usStates = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

type FormData = {
  businessName: string;
  category: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  address: string;
  description: string;
  services: string;
  hours: string;
  plan: string;
};

const initialData: FormData = {
  businessName: "",
  category: "",
  city: "",
  state: "",
  phone: "",
  email: "",
  address: "",
  description: "",
  services: "",
  hours: "",
  plan: "starter",
};

const STEPS = [
  { id: 1, label: "Business Type" },
  { id: 2, label: "Business Info" },
  { id: 3, label: "Location" },
  { id: 4, label: "Details" },
  { id: 5, label: "Plan" },
];

function RateLimitUpgrade({
  resetMessage,
  onBack,
  businessName,
  email,
}: {
  resetMessage: string;
  onBack: () => void;
  businessName: string;
  email: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [inputEmail, setInputEmail] = useState(email);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-10 max-w-md mx-auto text-center">
      {/* Icon */}
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
        <span className="text-3xl">🚀</span>
      </div>

      <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
        Your site is ready to build!
      </h2>
      <p className="text-gray-500 text-sm mb-1">
        You&apos;ve hit the free daily limit.{" "}
        <span className="font-medium text-gray-700">{resetMessage}</span>
      </p>
      <p className="text-gray-400 text-xs mb-8">
        Or unlock unlimited builds right now.
      </p>

      {/* Upgrade card */}
      <div className="bg-blue-600 rounded-2xl p-6 text-left mb-4">
        <div className="inline-block text-xs font-bold bg-white text-blue-600 px-3 py-1 rounded-full mb-3">
          Most Popular
        </div>
        <h3 className="text-white font-bold text-lg mb-1">Pro Plan — $29/mo</h3>
        <p className="text-blue-200 text-sm mb-4">Everything you need to grow online</p>
        <ul className="space-y-2 mb-5">
          {[
            "Unlimited AI site generations",
            "Custom domain (yourbusiness.com)",
            "SEO tools & Google Analytics",
            "Contact & booking forms",
            "AI chat widget",
            "Priority support",
          ].map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-blue-100">
              <CheckCircle2 size={13} className="text-blue-300 flex-shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        <a
          href="/pricing"
          className="block w-full text-center bg-white text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm"
        >
          Start Pro — $29/mo →
        </a>
      </div>

      {/* Email capture for free users */}
      {!submitted ? (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-left">
          <p className="text-sm font-semibold text-gray-800 mb-1">
            Not ready to upgrade?
          </p>
          <p className="text-xs text-gray-500 mb-3">
            We&apos;ll email you when {businessName || "your site"} is ready — plus tips to get more customers online.
          </p>
          <form onSubmit={handleNotify} className="flex gap-2">
            <input
              type="email"
              required
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              Notify me
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-100 rounded-2xl p-5 text-center">
          <CheckCircle2 size={20} className="text-green-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-800">Got it! We&apos;ll be in touch.</p>
          <p className="text-xs text-gray-500 mt-1">Check your inbox for tips on getting online fast.</p>
        </div>
      )}

      <button
        onClick={onBack}
        className="mt-4 text-xs text-gray-400 hover:text-gray-600 transition-colors"
      >
        ← Go back and edit
      </button>
    </div>
  );
}

export function BuildFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialData);
  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState("");
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (step === 1 && !form.category) newErrors.category = "Please select a category.";
    if (step === 2) {
      if (!form.businessName.trim()) newErrors.businessName = "Business name is required.";
      if (!form.phone.trim()) newErrors.phone = "Phone number is required.";
      if (!form.email.trim()) newErrors.email = "Email is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        newErrors.email = "Enter a valid email address.";
    }
    if (step === 3) {
      if (!form.city.trim()) newErrors.city = "City is required.";
      if (!form.state) newErrors.state = "State is required.";
    }
    if (step === 4 && !form.description.trim())
      newErrors.description = "A short description is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    if (step < STEPS.length) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleSubmit();
    }
  };

  const back = () => {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setLoadingError("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: form.businessName,
          category: form.category,
          city: form.city,
          state: form.state,
          phone: form.phone,
          email: form.email,
          address: form.address,
          description: form.description,
          services: form.services,
          hours: form.hours,
        }),
      });

      const data = await res.json();

      if (res.status === 429) {
        throw new Error("RATE_LIMIT:" + (data.error || "Too many requests"));
      }

      if (res.status === 503) {
        throw new Error("SERVICE_ERROR:" + (data.error || "Service unavailable"));
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Generation failed");
      }

      // Use a unique key that never collides with static templates
      const slug = form.businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const uniqueKey = `${slug}-${Date.now()}`;
      sessionStorage.setItem(`site_${uniqueKey}`, JSON.stringify(data.site));
      router.push(`/preview/${uniqueKey}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setLoadingError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    s.id < step
                      ? "bg-blue-600 text-white"
                      : s.id === step
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {s.id < step ? <CheckCircle2 size={16} /> : s.id}
                </div>
                <span
                  className={`mt-1 text-xs hidden sm:block ${
                    s.id === step ? "text-blue-600 font-medium" : "text-gray-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    s.id < step ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        {loading ? (
          <div className="py-20 text-center">
            {loadingError ? (
              <>
                {loadingError.startsWith("RATE_LIMIT:") ? (
                  <RateLimitUpgrade resetMessage={loadingError.replace("RATE_LIMIT:", "")} onBack={() => { setLoading(false); setLoadingError(""); }} businessName={form.businessName} email={form.email} />
                ) : loadingError.startsWith("SERVICE_ERROR:") ? (
                  <>
                    <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🔧</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Service temporarily unavailable</h2>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
                      Our AI service is experiencing high demand. Please try again in a moment.
                    </p>
                    <button
                      onClick={() => { setLoading(false); setLoadingError(""); }}
                      className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm"
                    >
                      Try again
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">⚠️</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">{loadingError}</p>
                    <button
                      onClick={() => { setLoading(false); setLoadingError(""); }}
                      className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm"
                    >
                      Try again
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                <Loader2 size={40} className="text-blue-600 animate-spin mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Building your website...
                </h2>
                <p className="text-gray-500 max-w-sm mx-auto">
                  Our AI is writing your copy, choosing your layout, and setting up
                  your SEO. This takes about 5 seconds.
                </p>
                <div className="mt-8 space-y-2 text-sm text-gray-400 text-left max-w-xs mx-auto">
                  {[
                    "Writing homepage copy...",
                    "Optimizing for local SEO...",
                    "Setting up contact forms...",
                    "Configuring Google Maps...",
                  ].map((task) => (
                    <div key={task} className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-green-500" />
                      {task}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            {step === 1 && (
              <Step1
                value={form.category}
                onChange={(v) => update("category", v)}
                error={errors.category}
              />
            )}
            {step === 2 && (
              <Step2 form={form} update={update} errors={errors} />
            )}
            {step === 3 && (
              <Step3 form={form} update={update} errors={errors} />
            )}
            {step === 4 && (
              <Step4 form={form} update={update} errors={errors} />
            )}
            {step === 5 && (
              <Step5
                selected={form.plan}
                onChange={(v) => update("plan", v)}
              />
            )}

            <div className="mt-8 flex items-center justify-between">
              {step > 1 ? (
                <button
                  onClick={back}
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
              ) : (
                <div />
              )}
              <button
                onClick={next}
                className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
              >
                {step === STEPS.length ? "Build My Website" : "Continue"}
                <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="mt-1 text-xs text-red-500">{error}</p>;
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
}) {
  return (
    <>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
          error ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"
        }`}
      />
      <FieldError error={error} />
    </>
  );
}

function Step1({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">
        What type of business do you have?
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Select the category that best describes your business.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`text-sm font-medium px-3 py-2.5 rounded-lg border text-left transition-colors ${
              value === cat
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 text-gray-700 hover:border-blue-200 hover:bg-blue-50/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <FieldError error={error} />
    </div>
  );
}

function Step2({
  form,
  update,
  errors,
}: {
  form: FormData;
  update: (k: keyof FormData, v: string) => void;
  errors: Partial<FormData>;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">
        Tell us about your business
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Basic info so we can personalize your website.
      </p>
      <div className="space-y-4">
        <div>
          <Label>Business Name *</Label>
          <Input
            value={form.businessName}
            onChange={(v) => update("businessName", v)}
            placeholder="e.g. Maria's Tacos"
            error={errors.businessName}
          />
        </div>
        <div>
          <Label>Phone Number *</Label>
          <Input
            value={form.phone}
            onChange={(v) => update("phone", v)}
            placeholder="(555) 555-5555"
            type="tel"
            error={errors.phone}
          />
        </div>
        <div>
          <Label>Email Address *</Label>
          <Input
            value={form.email}
            onChange={(v) => update("email", v)}
            placeholder="you@yourbusiness.com"
            type="email"
            error={errors.email}
          />
        </div>
      </div>
    </div>
  );
}

function Step3({
  form,
  update,
  errors,
}: {
  form: FormData;
  update: (k: keyof FormData, v: string) => void;
  errors: Partial<FormData>;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">
        Where is your business located?
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        We use this for local SEO and your Google Maps pin.
      </p>
      <div className="space-y-4">
        <div>
          <Label>Street Address</Label>
          <Input
            value={form.address}
            onChange={(v) => update("address", v)}
            placeholder="123 Main Street"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>City *</Label>
            <Input
              value={form.city}
              onChange={(v) => update("city", v)}
              placeholder="Austin"
              error={errors.city}
            />
          </div>
          <div>
            <Label>State *</Label>
            <select
              value={form.state}
              onChange={(e) => update("state", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.state ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"
              }`}
            >
              <option value="">Select state</option>
              {usStates.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <FieldError error={errors.state} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Step4({
  form,
  update,
  errors,
}: {
  form: FormData;
  update: (k: keyof FormData, v: string) => void;
  errors: Partial<FormData>;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">
        Tell us more about what you offer
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        The more you share, the better your AI-generated site will be.
      </p>
      <div className="space-y-4">
        <div>
          <Label>Describe your business *</Label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="e.g. Family-owned Mexican restaurant serving authentic tacos, burritos, and enchiladas. Known for our homemade salsa and fresh tortillas."
            rows={4}
            className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
              errors.description ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"
            }`}
          />
          <FieldError error={errors.description} />
        </div>
        <div>
          <Label>Main services or menu items (optional)</Label>
          <textarea
            value={form.services}
            onChange={(e) => update("services", e.target.value)}
            placeholder="e.g. Street tacos, breakfast burritos, catering, margaritas"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
          />
        </div>
        <div>
          <Label>Business hours (optional)</Label>
          <Input
            value={form.hours}
            onChange={(v) => update("hours", v)}
            placeholder="e.g. Mon–Fri 9am–6pm, Sat 10am–4pm"
          />
        </div>
      </div>
    </div>
  );
}

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "Free",
    period: "",
    features: ["1-page website", "AI copywriting", "Mobile responsive", "Contact form"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "/mo",
    features: ["Up to 10 pages", "Custom domain", "SEO tools", "Booking forms", "Google Maps"],
    badge: "Most Popular",
  },
  {
    id: "business",
    name: "Business",
    price: "$79",
    period: "/mo",
    features: ["Unlimited pages", "E-commerce", "AI chat widget", "Dedicated manager"],
  },
];

function Step5({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Choose your plan</h2>
      <p className="text-gray-500 text-sm mb-6">
        Start free and upgrade anytime. No credit card required for Starter.
      </p>
      <div className="space-y-3">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => onChange(plan.id)}
            className={`w-full text-left p-4 rounded-xl border transition-colors ${
              selected === plan.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selected === plan.id ? "border-blue-600" : "border-gray-300"
                  }`}
                >
                  {selected === plan.id && (
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{plan.name}</span>
                    {plan.badge && (
                      <span className="text-xs font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {plan.features.join(" · ")}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="text-sm text-gray-400">{plan.period}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

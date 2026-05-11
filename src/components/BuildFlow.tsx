"use client";

import { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2, Rocket, CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

const categories = [
  "Restaurant / Cafe",
  "Bakery",
  "Catering",
  "Hair Salon / Barbershop",
  "Nail Salon",
  "Massage Therapy",
  "Gym / Fitness Studio",
  "Chiropractic",
  "Dental Office",
  "Pet Grooming",
  "Auto Repair",
  "Plumbing",
  "Electrician",
  "HVAC",
  "Roofing",
  "Cleaning Services",
  "Landscaping",
  "Law Firm",
  "Accounting / Tax",
  "Real Estate",
  "Photography",
  "Florist",
  "Tutoring",
  "Childcare / Daycare",
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
  website: string;
  description: string;
  services: string;
  hours: string;
  yearsInBusiness: string;
  specialties: string;
  priceRange: string;
  teamSize: string;
  certifications: string;
  paymentMethods: string;
  parking: string;
  socialMedia: string;
  uniqueSellingPoint: string;
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
  website: "",
  description: "",
  services: "",
  hours: "",
  yearsInBusiness: "",
  specialties: "",
  priceRange: "",
  teamSize: "",
  certifications: "",
  paymentMethods: "",
  parking: "",
  socialMedia: "",
  uniqueSellingPoint: "",
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

function SiteCapGate() {
  return (
    <div className="py-10 max-w-md mx-auto text-center">
      <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-5">
        <Rocket size={28} className="text-indigo-600" />
      </div>

      <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
        You&apos;re building a lot!
      </h2>
      <p className="text-gray-500 text-sm mb-8">
        Free accounts include <span className="font-semibold text-gray-800">1 published website</span>.
        Upgrade to Pro for unlimited sites, custom domains, and priority support — or chat with us first.
      </p>

      <div className="space-y-3">
        <a
          href="/signup"
          className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
        >
          <Rocket size={16} />
          Sign up for Pro — unlimited sites
        </a>

        <a
          href="/demo"
          className="flex items-center justify-center gap-2 w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3.5 rounded-xl transition-colors text-sm"
        >
          <CalendarDays size={16} />
          Book a demo — we&apos;ll answer your questions
        </a>
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Already on Pro?{" "}
        <a href="/signin" className="underline hover:text-gray-600">Sign in</a> to continue building.
      </p>
    </div>
  );
}

export function BuildFlow() {
  const router = useRouter();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const [siteCount, setSiteCount] = useState<number | null>(null);
  const [countLoaded, setCountLoaded] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialData);
  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState("");
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    if (!authLoaded) return;
    if (!isSignedIn) {
      setCountLoaded(true);
      return;
    }
    fetch("/api/my-sites")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.sites)) setSiteCount(data.sites.length);
      })
      .catch(() => {})
      .finally(() => setCountLoaded(true));
  }, [authLoaded, isSignedIn]);

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
          website: form.website,
          description: form.description,
          services: form.services,
          hours: form.hours,
          specialties: form.specialties,
          priceRange: form.priceRange,
          yearsInBusiness: form.yearsInBusiness,
          teamSize: form.teamSize,
          certifications: form.certifications,
          paymentMethods: form.paymentMethods,
          parking: form.parking,
          socialMedia: form.socialMedia,
          uniqueSellingPoint: form.uniqueSellingPoint,
        }),
      });

      const data = await res.json();

      if (res.status === 403) {
        throw new Error("SITE_CAP:" + (data.error || "Site limit reached"));
      }

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

  if (!authLoaded || !countLoaded) {
    return (
      <div className="max-w-2xl mx-auto flex items-center justify-center py-20">
        <Loader2 size={32} className="text-blue-600 animate-spin" />
      </div>
    );
  }

  const capDisabled = process.env.NEXT_PUBLIC_DISABLE_SITE_CAP === "true";
  if (!capDisabled && isSignedIn && siteCount !== null && siteCount >= 1) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <SiteCapGate />
        </div>
      </div>
    );
  }

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
                {loadingError.startsWith("SITE_CAP:") ? (
                  <SiteCapGate />
                ) : loadingError.startsWith("RATE_LIMIT:") ? (
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
        <div>
          <Label>Existing website (if any)</Label>
          <Input
            value={form.website}
            onChange={(v) => update("website", v)}
            placeholder="e.g. www.mybusiness.com"
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

// ─── Category-specific question configs ───────────────────────────────────────

type CategoryConfig = {
  descriptionLabel: string;
  descriptionPlaceholder: string;
  servicesLabel: string;
  servicesPh: string;
  specialtiesLabel?: string;
  specialtiesPh?: string;
  priceRangeLabel?: string;
  priceRangePh?: string;
  certLabel?: string;
  certPh?: string;
};

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  "Restaurant / Cafe": {
    descriptionLabel: "Describe your restaurant or cafe *",
    descriptionPlaceholder: "e.g. Family-owned Mexican restaurant serving authentic tacos, burritos, and enchiladas since 1998. Known for our homemade salsa and fresh-pressed tortillas.",
    servicesLabel: "Menu highlights (dishes, drinks, specials)",
    servicesPh: "e.g. Street tacos, breakfast burritos, aguas frescas, Friday fish tacos, weekend brunch",
    specialtiesLabel: "Cuisine type & dining style",
    specialtiesPh: "e.g. Mexican, dine-in & takeout, family-friendly, outdoor patio",
    priceRangeLabel: "Price range",
    priceRangePh: "e.g. $10–$20 per person",
  },
  "Bakery": {
    descriptionLabel: "Tell us about your bakery *",
    descriptionPlaceholder: "e.g. Artisan bakery specializing in sourdough breads, custom cakes, and French pastries. We use only organic flour and locally sourced ingredients.",
    servicesLabel: "What do you bake? (products & specialties)",
    servicesPh: "e.g. Sourdough loaves, croissants, custom wedding cakes, macarons, gluten-free options",
    specialtiesLabel: "Ordering options",
    specialtiesPh: "e.g. Walk-in, pre-order online, custom cakes by request, wholesale to cafes",
    priceRangeLabel: "Price range",
    priceRangePh: "e.g. Bread $8–$15, custom cakes from $75",
  },
  "Catering": {
    descriptionLabel: "Tell us about your catering business *",
    descriptionPlaceholder: "e.g. Full-service catering for weddings, corporate events, and private parties. Specializing in farm-to-table menus with customizable packages.",
    servicesLabel: "Event types & menu options you cater",
    servicesPh: "e.g. Weddings, corporate lunches, birthday parties, BBQ, buffet-style, plated dinners",
    specialtiesLabel: "Min/max guest count & service style",
    specialtiesPh: "e.g. 20–500 guests, full-service with staff, drop-off catering available",
    priceRangeLabel: "Starting price",
    priceRangePh: "e.g. Starting at $35/person, minimum order $500",
  },
  "Hair Salon / Barbershop": {
    descriptionLabel: "Describe your salon or barbershop *",
    descriptionPlaceholder: "e.g. Upscale unisex salon specializing in color, balayage, and precision cuts. A relaxing, judgment-free space for all hair types.",
    servicesLabel: "Services you offer",
    servicesPh: "e.g. Haircuts, balayage, highlights, keratin treatment, blowouts, men's grooming, beard trim",
    specialtiesLabel: "Specialties or techniques",
    specialtiesPh: "e.g. Curly hair expert, extensions, wedding & prom styling, natural hair",
    priceRangeLabel: "Price range",
    priceRangePh: "e.g. Cuts from $45, color from $120",
    certLabel: "Brands & products used",
    certPh: "e.g. Wella, Redken, Olaplex, Kevin Murphy",
  },
  "Nail Salon": {
    descriptionLabel: "Tell us about your nail salon *",
    descriptionPlaceholder: "e.g. Luxury nail salon focused on gel, acrylic, and nail art. We use non-toxic, vegan polishes and sanitize all tools between every client.",
    servicesLabel: "Services offered",
    servicesPh: "e.g. Gel manicure, acrylic full set, dip powder, pedicure, nail art, nail extensions",
    specialtiesLabel: "Specialties or unique offerings",
    specialtiesPh: "e.g. 3D nail art, gel-X, vegan polishes, kids' manicures",
    priceRangeLabel: "Price range",
    priceRangePh: "e.g. Manicure from $35, full set from $55",
  },
  "Massage Therapy": {
    descriptionLabel: "Describe your massage therapy practice *",
    descriptionPlaceholder: "e.g. Licensed massage therapist offering therapeutic and relaxation massage in a peaceful private studio. Specializing in deep tissue and prenatal massage.",
    servicesLabel: "Massage types & services",
    servicesPh: "e.g. Swedish, deep tissue, hot stone, prenatal, sports massage, reflexology, couples massage",
    specialtiesLabel: "Session lengths & booking",
    specialtiesPh: "e.g. 60-min, 90-min, 2-hour sessions; online booking; gift certificates available",
    priceRangeLabel: "Price range",
    priceRangePh: "e.g. 60 min from $85, 90 min from $120",
    certLabel: "Licenses & certifications",
    certPh: "e.g. Licensed Massage Therapist (LMT), NCBTMB certified",
  },
  "Gym / Fitness Studio": {
    descriptionLabel: "Describe your gym or studio *",
    descriptionPlaceholder: "e.g. Boutique CrossFit box with a tight-knit community focus. We offer beginner-friendly onboarding, open gym, and specialty strength classes.",
    servicesLabel: "Classes, programs & memberships",
    servicesPh: "e.g. CrossFit, strength training, yoga, pilates, HIIT, personal training, drop-in classes",
    specialtiesLabel: "Equipment & facilities",
    specialtiesPh: "e.g. 3,000 sq ft, free weights, squat racks, cardio equipment, showers, childcare",
    priceRangeLabel: "Membership pricing",
    priceRangePh: "e.g. Monthly from $75, class packs from $120, free first class",
    certLabel: "Trainer certifications",
    certPh: "e.g. NASM, NSCA, ACE certified trainers",
  },
  "Chiropractic": {
    descriptionLabel: "Tell us about your chiropractic practice *",
    descriptionPlaceholder: "e.g. Family chiropractic clinic helping patients with back pain, neck pain, and sports injuries. We accept most insurance and offer same-day appointments.",
    servicesLabel: "Treatments & services",
    servicesPh: "e.g. Spinal adjustments, decompression therapy, dry needling, sports chiro, prenatal care",
    specialtiesLabel: "Conditions you treat",
    specialtiesPh: "e.g. Back pain, sciatica, herniated discs, headaches, auto accident injuries",
    certLabel: "Insurance & payment",
    certPh: "e.g. Accepts BlueCross, Aetna, Medicare, HSA/FSA, cash",
  },
  "Dental Office": {
    descriptionLabel: "Tell us about your dental practice *",
    descriptionPlaceholder: "e.g. General and cosmetic dental practice serving families for over 20 years. We offer gentle, anxiety-free care with same-day emergency appointments.",
    servicesLabel: "Dental services offered",
    servicesPh: "e.g. Cleanings, fillings, teeth whitening, veneers, Invisalign, dental implants, emergency care",
    specialtiesLabel: "Patient focus & specialties",
    specialtiesPh: "e.g. Family-friendly, sedation dentistry, cosmetic dentistry, pediatric patients welcome",
    certLabel: "Insurance accepted",
    certPh: "e.g. Delta Dental, MetLife, Cigna, most PPO plans, CareCredit financing",
  },
  "Pet Grooming": {
    descriptionLabel: "Tell us about your pet grooming business *",
    descriptionPlaceholder: "e.g. Fear-free certified groomer specializing in dogs and cats of all sizes. We use all-natural, hypoallergenic shampoos in a calm, cage-free environment.",
    servicesLabel: "Grooming services",
    servicesPh: "e.g. Bath & brush, full groom, nail trim, teeth brushing, deshedding, breed-specific cuts",
    specialtiesLabel: "Pets & breeds served",
    specialtiesPh: "e.g. All dog breeds, cats, senior pets, anxious animals, large dogs welcome",
    priceRangeLabel: "Pricing",
    priceRangePh: "e.g. Small dogs from $45, large dogs from $85",
    certLabel: "Certifications",
    certPh: "e.g. Fear Free Certified, NDGAA certified, insured",
  },
  "Plumbing": {
    descriptionLabel: "Tell us about your plumbing business *",
    descriptionPlaceholder: "e.g. Licensed master plumber serving residential and commercial clients. Available 24/7 for emergencies — from leaky faucets to full pipe replacements.",
    servicesLabel: "Services you provide",
    servicesPh: "e.g. Leak repair, drain cleaning, water heater install, pipe replacement, sewer line, remodels",
    specialtiesLabel: "Emergency & service area",
    specialtiesPh: "e.g. 24/7 emergency, same-day service, residential & commercial, 20-mile radius",
    certLabel: "Licenses & insurance",
    certPh: "e.g. State licensed master plumber, bonded & insured, EPA certified",
  },
  "Electrician": {
    descriptionLabel: "Tell us about your electrical business *",
    descriptionPlaceholder: "e.g. Licensed electrician with 15 years of experience. Specializing in panel upgrades, EV charger installation, and smart home wiring.",
    servicesLabel: "Services offered",
    servicesPh: "e.g. Panel upgrades, EV charger install, lighting, outlets, ceiling fans, commercial wiring",
    specialtiesLabel: "Residential, commercial, or both",
    specialtiesPh: "e.g. Residential & light commercial, new construction, renovations, troubleshooting",
    certLabel: "Licenses & certifications",
    certPh: "e.g. Licensed master electrician, NECA member, insured & bonded",
  },
  "HVAC": {
    descriptionLabel: "Tell us about your HVAC business *",
    descriptionPlaceholder: "e.g. NATE-certified HVAC technicians serving the greater Austin area. We install, repair, and maintain all major brands of heating and cooling systems.",
    servicesLabel: "Services you provide",
    servicesPh: "e.g. AC repair, furnace install, duct cleaning, maintenance plans, mini-splits, heat pumps",
    specialtiesLabel: "Brands & service area",
    specialtiesPh: "e.g. Carrier, Trane, Lennox dealer; residential & commercial; 30-mile radius",
    certLabel: "Certifications",
    certPh: "e.g. NATE certified, EPA 608, licensed & insured",
  },
  "Roofing": {
    descriptionLabel: "Tell us about your roofing company *",
    descriptionPlaceholder: "e.g. Family-owned roofing contractor specializing in storm damage repair and full roof replacements. We work with all major insurance companies.",
    servicesLabel: "Roofing services",
    servicesPh: "e.g. Roof replacement, repairs, gutters, skylights, storm damage, insurance claims, inspections",
    specialtiesLabel: "Materials & specialties",
    specialtiesPh: "e.g. Asphalt shingles, metal roofing, flat roofs, GAF certified installer",
    certLabel: "Licenses & warranties",
    certPh: "e.g. State licensed, GAF Master Elite, 10-year workmanship warranty, insured",
  },
  "Cleaning Services": {
    descriptionLabel: "Tell us about your cleaning business *",
    descriptionPlaceholder: "e.g. Eco-friendly residential and office cleaning service. Fully insured, bonded team using non-toxic products. Weekly, bi-weekly, and one-time cleans.",
    servicesLabel: "Types of cleaning you offer",
    servicesPh: "e.g. Regular home cleaning, deep clean, move-in/out, office cleaning, post-construction, Airbnb",
    specialtiesLabel: "Frequency & booking",
    specialtiesPh: "e.g. Weekly, bi-weekly, monthly, one-time, same-day available, online booking",
    priceRangeLabel: "Starting price",
    priceRangePh: "e.g. From $120 for a 2BR home, free estimate",
    certLabel: "Credentials",
    certPh: "e.g. Bonded & insured, background-checked staff, eco-certified products",
  },
  "Landscaping": {
    descriptionLabel: "Tell us about your landscaping business *",
    descriptionPlaceholder: "e.g. Full-service landscaping company handling design, installation, and ongoing maintenance for residential and commercial properties.",
    servicesLabel: "Services you offer",
    servicesPh: "e.g. Lawn mowing, hedge trimming, landscape design, sod install, irrigation, seasonal cleanup",
    specialtiesLabel: "Service frequency & contracts",
    specialtiesPh: "e.g. Weekly lawn care, one-time installs, seasonal contracts, commercial properties",
    certLabel: "Licenses & certifications",
    certPh: "e.g. Licensed irrigator, ISA certified arborist, insured",
  },
  "Auto Repair": {
    descriptionLabel: "Tell us about your auto repair shop *",
    descriptionPlaceholder: "e.g. Full-service auto repair shop for all makes and models. ASE-certified technicians, honest pricing, and a free loaner car with major repairs.",
    servicesLabel: "Services & specialties",
    servicesPh: "e.g. Oil change, brakes, tires, engine repair, AC service, transmission, diagnostics",
    specialtiesLabel: "Makes & models served",
    specialtiesPh: "e.g. All makes & models, European specialty, domestic trucks, fleet service",
    priceRangeLabel: "Free estimates?",
    priceRangePh: "e.g. Free diagnostics, free estimates, price-match guarantee",
    certLabel: "Certifications",
    certPh: "e.g. ASE certified, AAA approved, NAPA AutoCare center",
  },
  "Law Firm": {
    descriptionLabel: "Tell us about your law firm *",
    descriptionPlaceholder: "e.g. Boutique personal injury law firm with a 95% success rate. We offer free consultations and work on contingency — you pay only if we win.",
    servicesLabel: "Practice areas",
    servicesPh: "e.g. Personal injury, car accidents, workers comp, wrongful death, slip & fall",
    specialtiesLabel: "Who you serve",
    specialtiesPh: "e.g. Individuals & families, bilingual Spanish services, no upfront fees",
    certLabel: "Bar admissions & credentials",
    certPh: "e.g. Texas State Bar, Board Certified Personal Injury, AV Preeminent rated",
  },
  "Accounting / Tax": {
    descriptionLabel: "Tell us about your accounting practice *",
    descriptionPlaceholder: "e.g. CPA firm serving small businesses and individuals. Specializing in tax preparation, bookkeeping, and business advisory services.",
    servicesLabel: "Services offered",
    servicesPh: "e.g. Tax prep, bookkeeping, payroll, QuickBooks setup, IRS audit representation, business formation",
    specialtiesLabel: "Client focus",
    specialtiesPh: "e.g. Small businesses, self-employed, real estate investors, restaurants",
    certLabel: "Credentials",
    certPh: "e.g. CPA licensed, QuickBooks ProAdvisor, AICPA member",
  },
  "Real Estate": {
    descriptionLabel: "Tell us about your real estate business *",
    descriptionPlaceholder: "e.g. Top-producing realtor with 12 years in the Austin market. I specialize in first-time buyers and luxury properties in the $500K–$2M range.",
    servicesLabel: "Services & specialties",
    servicesPh: "e.g. Buyer representation, listing & selling, relocation, investment properties, new construction",
    specialtiesLabel: "Market & neighborhoods",
    specialtiesPh: "e.g. Austin metro, South Austin, lakefront properties, luxury homes, condos",
    certLabel: "Credentials & designations",
    certPh: "e.g. Licensed Realtor, ABR, CRS, top 1% producer, Zillow Premier Agent",
  },
  "Photography": {
    descriptionLabel: "Tell us about your photography business *",
    descriptionPlaceholder: "e.g. Portrait and wedding photographer with a clean, timeless style. I deliver fully edited galleries within 3 weeks and offer complimentary engagement sessions.",
    servicesLabel: "Photography packages & types",
    servicesPh: "e.g. Weddings, engagements, family portraits, newborns, headshots, events, product photography",
    specialtiesLabel: "Style & deliverables",
    specialtiesPh: "e.g. Light & airy style, same-day sneak peeks, online gallery, print packages available",
    priceRangeLabel: "Starting price",
    priceRangePh: "e.g. Portraits from $350, weddings from $2,500",
    certLabel: "Equipment & editing",
    certPh: "e.g. Canon R5, Sony A7R, drone licensed, Lightroom/Photoshop editing",
  },
  "Florist": {
    descriptionLabel: "Tell us about your floral shop *",
    descriptionPlaceholder: "e.g. Award-winning floral design studio creating bespoke arrangements for weddings, events, and everyday moments. We source fresh, locally-grown blooms.",
    servicesLabel: "Products & services",
    servicesPh: "e.g. Wedding florals, event design, daily arrangements, sympathy flowers, plant delivery, subscriptions",
    specialtiesLabel: "Ordering options",
    specialtiesPh: "e.g. Walk-in, online ordering, same-day delivery, custom consultations for weddings",
    priceRangeLabel: "Price range",
    priceRangePh: "e.g. Arrangements from $45, wedding packages from $1,500",
  },
  "Tutoring": {
    descriptionLabel: "Tell us about your tutoring services *",
    descriptionPlaceholder: "e.g. Former public school teacher offering 1-on-1 tutoring in math and science for grades 3–12. I specialize in SAT/ACT prep and struggling students.",
    servicesLabel: "Subjects & programs",
    servicesPh: "e.g. Math, algebra, calculus, SAT/ACT prep, reading, writing, science, Spanish, coding",
    specialtiesLabel: "Grade levels & format",
    specialtiesPh: "e.g. K–12, college, in-person & online, group sessions, summer intensive programs",
    priceRangeLabel: "Rates",
    priceRangePh: "e.g. $60/hour for K–8, $80/hour for high school, package discounts available",
    certLabel: "Credentials",
    certPh: "e.g. State certified teacher, 10+ years experience, 99th percentile SAT scorer",
  },
  "Childcare / Daycare": {
    descriptionLabel: "Tell us about your childcare center *",
    descriptionPlaceholder: "e.g. Licensed in-home daycare for children 6 weeks – 5 years. Small group sizes, structured curriculum, and nutritious home-cooked meals daily.",
    servicesLabel: "Programs & age groups",
    servicesPh: "e.g. Infant care, toddler program, preschool, after-school, drop-in care, summer camp",
    specialtiesLabel: "Curriculum & environment",
    specialtiesPh: "e.g. Montessori approach, play-based learning, bilingual English/Spanish, outdoor play",
    certLabel: "Licensing & credentials",
    certPh: "e.g. State licensed, CPR certified, background-checked staff, NAEYC aligned",
  },
};

const DEFAULT_CATEGORY_CONFIG: CategoryConfig = {
  descriptionLabel: "Describe your business *",
  descriptionPlaceholder: "Tell us what makes your business special — what you do, who you serve, and what sets you apart from competitors.",
  servicesLabel: "Main services or offerings",
  servicesPh: "List your key services, products, or menu items",
  specialtiesLabel: "What makes you unique?",
  specialtiesPh: "Awards, specialties, years in business, what customers love about you",
};

function Step4({
  form,
  update,
  errors,
}: {
  form: FormData;
  update: (k: keyof FormData, v: string) => void;
  errors: Partial<FormData>;
}) {
  const cfg = CATEGORY_CONFIG[form.category] ?? DEFAULT_CATEGORY_CONFIG;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">
        Tell us about your {form.category || "business"}
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        The more detail you share, the more accurate and professional your AI-built website will be.
      </p>
      <div className="space-y-5">

        {/* Description */}
        <div>
          <Label>{cfg.descriptionLabel}</Label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder={cfg.descriptionPlaceholder}
            rows={4}
            className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
              errors.description ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"
            }`}
          />
          <FieldError error={errors.description} />
        </div>

        {/* Services / Menu */}
        <div>
          <Label>{cfg.servicesLabel}</Label>
          <textarea
            value={form.services}
            onChange={(e) => update("services", e.target.value)}
            placeholder={cfg.servicesPh}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
          />
        </div>

        {/* Specialties */}
        {cfg.specialtiesLabel && (
          <div>
            <Label>{cfg.specialtiesLabel}</Label>
            <Input
              value={form.specialties}
              onChange={(v) => update("specialties", v)}
              placeholder={cfg.specialtiesPh ?? ""}
            />
          </div>
        )}

        {/* Price range */}
        {cfg.priceRangeLabel && (
          <div>
            <Label>{cfg.priceRangeLabel}</Label>
            <Input
              value={form.priceRange}
              onChange={(v) => update("priceRange", v)}
              placeholder={cfg.priceRangePh ?? ""}
            />
          </div>
        )}

        {/* Certifications / Licenses */}
        {cfg.certLabel && (
          <div>
            <Label>{cfg.certLabel}</Label>
            <Input
              value={form.certifications}
              onChange={(v) => update("certifications", v)}
              placeholder={cfg.certPh ?? ""}
            />
          </div>
        )}

        {/* Business hours */}
        <div>
          <Label>Business hours</Label>
          <Input
            value={form.hours}
            onChange={(v) => update("hours", v)}
            placeholder="e.g. Mon–Fri 9am–6pm, Sat 10am–4pm, Closed Sunday"
          />
        </div>

        {/* Years in business */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Years in business</Label>
            <Input
              value={form.yearsInBusiness}
              onChange={(v) => update("yearsInBusiness", v)}
              placeholder="e.g. 12 years"
            />
          </div>
          <div>
            <Label>Team size</Label>
            <Input
              value={form.teamSize}
              onChange={(v) => update("teamSize", v)}
              placeholder="e.g. 5 employees"
            />
          </div>
        </div>

        {/* Unique selling point */}
        <div>
          <Label>What do your best customers say about you?</Label>
          <Input
            value={form.uniqueSellingPoint}
            onChange={(v) => update("uniqueSellingPoint", v)}
            placeholder="e.g. 'Best tacos in the city', 5-star rated, #1 on Yelp, always on time"
          />
        </div>

        {/* Payment methods */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Payment methods accepted</Label>
            <Input
              value={form.paymentMethods}
              onChange={(v) => update("paymentMethods", v)}
              placeholder="e.g. Cash, card, Venmo, Zelle"
            />
          </div>
          <div>
            <Label>Parking available?</Label>
            <Input
              value={form.parking}
              onChange={(v) => update("parking", v)}
              placeholder="e.g. Free lot, street parking"
            />
          </div>
        </div>

        {/* Social media */}
        <div>
          <Label>Social media handles (optional)</Label>
          <Input
            value={form.socialMedia}
            onChange={(v) => update("socialMedia", v)}
            placeholder="e.g. @marias_tacos on Instagram, Facebook: Maria's Tacos"
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

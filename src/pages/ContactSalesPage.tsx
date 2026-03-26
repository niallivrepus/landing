import { cn } from "@jokuh/gooey";
import Lottie from "lottie-react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Cable,
  ChevronDown,
  LoaderCircle,
  MailCheck,
  ShieldCheck,
  Sparkles,
  Waypoints,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useId, useMemo, useState, type ChangeEvent, type ComponentType, type FormEvent } from "react";
import navSearchLottie from "../assets/nav-search-lottie.json";
import { SiteLink } from "../components/SiteLink";
import { MarketingPageFrame } from "../components/system";
import { resolveHelpHref } from "../config/site-subdomains";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const CONTACT_SALES_ENDPOINT = import.meta.env.VITE_CONTACT_SALES_ENDPOINT?.trim() || "/api/contact-sales";

type ContactSalesFormState = {
  interest: string;
  workEmail: string;
  companySize: string;
  companyName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  needs: string;
  marketingOptIn: boolean;
  website: string;
};

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

type Feature = {
  title: string;
  copy: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
};

type Brand = {
  name: string;
  monogram: string;
  accent: string;
};

const INITIAL_FORM: ContactSalesFormState = {
  interest: "",
  workEmail: "",
  companySize: "",
  companyName: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  needs: "",
  marketingOptIn: true,
  website: "",
};

const INTEREST_OPTIONS = [
  "Jokuh enterprise platform",
  "AI deployment for a specific team",
  "Identity, governance, and controls",
  "Custom integrations and rollout",
  "Migration from existing tooling",
] as const;

const COMPANY_SIZE_OPTIONS = [
  "1-20 employees",
  "21-100 employees",
  "101-500 employees",
  "501-1,000 employees",
  "1,001-5,000 employees",
  "5,001+ employees",
] as const;

const FEATURES: readonly Feature[] = [
  {
    title: "No training on your business context",
    copy: "Keep enterprise usage governed, private, and aligned with internal controls from day one.",
    icon: ShieldCheck,
  },
  {
    title: "High-agency rollout support",
    copy: "Map pilots, change management, and executive adoption into one coordinated launch plan.",
    icon: Sparkles,
  },
  {
    title: "Integrations that fit your stack",
    copy: "Connect workspace tools, CRM surfaces, and internal systems without adding brittle ops overhead.",
    icon: Cable,
  },
  {
    title: "One system for teams, billing, and governance",
    copy: "Unify identity, team structure, and expansion across business units as adoption grows.",
    icon: Waypoints,
  },
] as const;

const BRAND_COLUMNS: readonly (readonly Brand[])[] = [
  [
    { name: "Northline", monogram: "N", accent: "#0f766e" },
    { name: "Meridian", monogram: "M", accent: "#f97316" },
    { name: "Harbor", monogram: "H", accent: "#2563eb" },
  ],
  [
    { name: "Aster", monogram: "A", accent: "#9333ea" },
    { name: "Lattice", monogram: "L", accent: "#111827" },
    { name: "Pioneer", monogram: "P", accent: "#059669" },
  ],
  [
    { name: "Radian", monogram: "R", accent: "#dc2626" },
    { name: "Fjord", monogram: "F", accent: "#7c3aed" },
    { name: "Monarch", monogram: "M", accent: "#ca8a04" },
  ],
] as const;

function BrandWordmark({ brand }: { brand: Brand }) {
  return (
    <svg viewBox="0 0 248 56" className="h-12 w-full" role="img" aria-label={brand.name}>
      <rect x="1" y="1" width="246" height="54" rx="18" fill="white" stroke="rgba(15, 23, 42, 0.08)" />
      <circle cx="30" cy="28" r="16" fill={brand.accent} fillOpacity="0.12" />
      <text
        x="30"
        y="33"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="14"
        fontWeight="700"
        fill={brand.accent}
      >
        {brand.monogram}
      </text>
      <text
        x="58"
        y="33"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="17"
        fontWeight="700"
        letterSpacing="-0.02em"
        fill="#111111"
      >
        {brand.name}
      </text>
    </svg>
  );
}

function BrandColumn({ brands, columnIndex }: { brands: readonly Brand[]; columnIndex: number }) {
  const deck = useMemo(() => [...brands, ...brands], [brands]);

  return (
    <div className="relative h-[232px] overflow-hidden rounded-[28px] border border-black/[0.06] bg-white/80 p-3 shadow-[0_28px_90px_-48px_rgba(15,23,42,0.32)] backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, y: -18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        animate={{ y: [0, -54, 0] }}
        transition={{
          opacity: { duration: 0.55, delay: columnIndex * 0.08 },
          y: { duration: 9 + columnIndex * 1.2, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" },
        }}
        className="space-y-3"
      >
        {deck.map((brand, index) => (
          <motion.div
            key={`${brand.name}-${index}`}
            initial={{ opacity: 0, y: -14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: columnIndex * 0.08 + (index % brands.length) * 0.08, duration: 0.5 }}
            className="rounded-[22px] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(249,250,251,0.92))] p-2"
          >
            <BrandWordmark brand={brand} />
          </motion.div>
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,255,255,0))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-[linear-gradient(0deg,rgba(255,255,255,0.96),rgba(255,255,255,0))]" />
    </div>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;

  return (
    <motion.li
      whileHover={{ y: -2 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-[24px] border border-black/[0.06] bg-white/72 p-4 shadow-[0_24px_80px_-50px_rgba(15,23,42,0.34)] backdrop-blur-xl"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-2xl bg-black/[0.045] text-black">
          <Icon className="size-5" strokeWidth={1.65} aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="font-sans text-[14px] font-semibold tracking-[-0.02em] text-black">{feature.title}</p>
          <p className="mt-1 max-w-[34ch] font-sans text-[13px] leading-relaxed text-zinc-600">{feature.copy}</p>
        </div>
        <div className="ml-auto mt-0.5 hidden shrink-0 rounded-full bg-black/[0.03] p-1.5 sm:block">
          <div className="size-6 opacity-35 transition-opacity duration-200 group-hover:opacity-100">
            <Lottie animationData={navSearchLottie} loop autoplay className="size-6" aria-hidden />
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-white/35" aria-hidden />
    </motion.li>
  );
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block font-sans text-[13px] font-medium tracking-[-0.01em] text-zinc-900">
      {children}
    </label>
  );
}

function TextField({
  id,
  name,
  value,
  onChange,
  type = "text",
  autoComplete,
  placeholder,
}: {
  id: string;
  name: keyof ContactSalesFormState;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      placeholder={placeholder}
      className="h-12 w-full rounded-[16px] border border-black/[0.08] bg-white px-4 font-sans text-[15px] text-zinc-950 shadow-[0_1px_2px_rgba(15,23,42,0.03)] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-zinc-400 focus:border-black/20 focus:shadow-[0_0_0_4px_rgba(17,17,17,0.06)]"
    />
  );
}

function SelectField({
  id,
  name,
  value,
  onChange,
  placeholder,
  options,
}: {
  id: string;
  name: keyof ContactSalesFormState;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  placeholder: string;
  options: readonly string[];
}) {
  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="h-12 w-full appearance-none rounded-[16px] border border-black/[0.08] bg-white px-4 pr-10 font-sans text-[15px] text-zinc-950 shadow-[0_1px_2px_rgba(15,23,42,0.03)] outline-none transition-[border-color,box-shadow] duration-200 focus:border-black/20 focus:shadow-[0_0_0_4px_rgba(17,17,17,0.06)]"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" aria-hidden />
    </div>
  );
}

function ThemeLightMode() {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const previous = (root.getAttribute("data-theme") as "dark" | "light" | null) ?? "dark";
    root.classList.remove("dark", "light");
    root.classList.add("light");
    root.setAttribute("data-theme", "light");
    if (body) body.style.backgroundColor = "#fcfbf8";

    return () => {
      root.classList.remove("light");
      root.classList.add(previous);
      root.setAttribute("data-theme", previous);
      if (body) body.style.backgroundColor = previous === "dark" ? "#000000" : "#FFFFFF";
    };
  }, []);

  return null;
}

export function ContactSalesPage() {
  useDocumentTitle("Contact sales — Jokuh");

  const firstNameId = useId();
  const lastNameId = useId();
  const interestId = useId();
  const emailId = useId();
  const companySizeId = useId();
  const companyNameId = useId();
  const phoneId = useId();
  const needsId = useId();
  const consentId = useId();

  const [form, setForm] = useState<ContactSalesFormState>(INITIAL_FORM);
  const [submitState, setSubmitState] = useState<SubmitState>({ kind: "idle" });
  const helpCenterHref = resolveHelpHref("/");

  function updateField<K extends keyof ContactSalesFormState>(name: K, value: ContactSalesFormState[K]) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState({ kind: "submitting" });

    try {
      const response = await fetch(CONTACT_SALES_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        throw new Error(result?.error || "Unable to submit right now.");
      }

      setForm(INITIAL_FORM);
      setSubmitState({
        kind: "success",
        message: "Thanks. Our sales team will review your details and follow up using your work email.",
      });
    } catch (error) {
      setSubmitState({
        kind: "error",
        message: error instanceof Error ? error.message : "Unable to submit right now.",
      });
    }
  }

  return (
    <MarketingPageFrame
      className="light min-h-screen bg-[#fcfbf8] text-zinc-950"
      withFontSans
      withAntialiased
      mainClassName="relative overflow-hidden"
    >
      <ThemeLightMode />

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(circle_at_15%_15%,rgba(251,191,36,0.16),transparent_28%),radial-gradient(circle_at_85%_12%,rgba(125,211,252,0.18),transparent_24%),radial-gradient(circle_at_50%_42%,rgba(251,146,60,0.08),transparent_32%),linear-gradient(180deg,#ffffff_0%,#fcfbf8_46%,#fcfbf8_100%)]"
        aria-hidden
      />

      <div className="relative">
        <section className="mx-auto w-full max-w-[1320px] px-4 pb-20 pt-28 md:px-8 md:pb-24 md:pt-32">
          <div className="grid gap-10 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:gap-14">
            <div className="xl:sticky xl:top-28 xl:self-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
              >
                <span className="inline-flex items-center rounded-full border border-black/[0.08] bg-white/70 px-3 py-1 font-sans text-[12px] font-medium tracking-[0.08em] text-zinc-600 uppercase backdrop-blur">
                  Enterprise engagement
                </span>
                <h1 className="mt-6 max-w-[10ch] font-sans text-[3.1rem] font-semibold leading-[0.96] tracking-[-0.06em] text-black md:text-[4.9rem]">
                  Contact sales
                </h1>
                <p className="mt-5 max-w-[34ch] font-sans text-[1.05rem] leading-relaxed text-zinc-600 md:text-[1.1rem]">
                  Bring Jokuh into your enterprise with the right rollout plan, governance model, and integration path
                  for your teams.
                </p>
                <p className="mt-3 max-w-[34ch] font-sans text-[0.98rem] leading-relaxed text-zinc-500">
                  Share your goals and we&apos;ll route the conversation to the right sales and solutions partner.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.08 }}
                className="mt-10 rounded-[32px] border border-black/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(249,250,251,0.76))] p-5 shadow-[0_36px_120px_-68px_rgba(15,23,42,0.4)] backdrop-blur-xl md:p-6"
              >
                <p className="font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-zinc-500">Why teams reach out</p>
                <ul className="mt-4 space-y-3">
                  {FEATURES.map((feature) => (
                    <FeatureCard key={feature.title} feature={feature} />
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.14 }}
                className="mt-8 rounded-[32px] border border-black/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(247,247,246,0.82))] p-5 shadow-[0_36px_120px_-68px_rgba(15,23,42,0.35)] backdrop-blur-xl md:p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-zinc-500">Teams already building with Jokuh</p>
                    <p className="mt-2 max-w-[32ch] font-sans text-[14px] leading-relaxed text-zinc-600">
                      A clean 3x3 trust wall with motion, so the page feels alive without turning into a busy logo dump.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-black/[0.04] px-3 py-1 text-[12px] font-medium text-zinc-600">
                    <BriefcaseBusiness className="size-3.5" strokeWidth={1.9} aria-hidden />
                    Popular enterprise adopters
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {BRAND_COLUMNS.map((brands, columnIndex) => (
                    <BrandColumn key={columnIndex} brands={brands} columnIndex={columnIndex} />
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-[34px] border border-black/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(250,250,249,0.88))] p-5 shadow-[0_40px_140px_-72px_rgba(15,23,42,0.45)] backdrop-blur-xl md:p-7 lg:p-8"
            >
              <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.26),rgba(251,191,36,0))]" aria-hidden />
              <div className="pointer-events-none absolute bottom-0 left-0 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(125,211,252,0.22),rgba(125,211,252,0))]" aria-hidden />

              <div className="relative">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-zinc-500">Talk to Jokuh sales</p>
                    <h2 className="mt-3 font-sans text-[1.8rem] font-semibold tracking-[-0.04em] text-black md:text-[2.15rem]">
                      Tell us what you need
                    </h2>
                    <p className="mt-3 max-w-[44ch] font-sans text-[14px] leading-relaxed text-zinc-600">
                      We&apos;ll use this to understand fit, route your inquiry, and prepare the right next conversation.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/88 px-3 py-2 text-[12px] font-medium text-zinc-600">
                    <MailCheck className="size-4" strokeWidth={1.8} aria-hidden />
                    Enterprise contact intake
                  </div>
                </div>

                <form className="mt-8" onSubmit={handleSubmit}>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <FieldLabel htmlFor={interestId}>What are you interested in? *</FieldLabel>
                      <SelectField
                        id={interestId}
                        name="interest"
                        value={form.interest}
                        onChange={(event) => updateField("interest", event.target.value)}
                        placeholder="Select one"
                        options={INTEREST_OPTIONS}
                      />
                    </div>

                    <div>
                      <FieldLabel htmlFor={emailId}>Work email *</FieldLabel>
                      <TextField
                        id={emailId}
                        name="workEmail"
                        type="email"
                        value={form.workEmail}
                        onChange={(event) => updateField("workEmail", event.target.value)}
                        autoComplete="email"
                        placeholder="you@company.com"
                      />
                    </div>

                    <div>
                      <FieldLabel htmlFor={companySizeId}>Company size *</FieldLabel>
                      <SelectField
                        id={companySizeId}
                        name="companySize"
                        value={form.companySize}
                        onChange={(event) => updateField("companySize", event.target.value)}
                        placeholder="Please select"
                        options={COMPANY_SIZE_OPTIONS}
                      />
                    </div>

                    <div>
                      <FieldLabel htmlFor={companyNameId}>Company name *</FieldLabel>
                      <TextField
                        id={companyNameId}
                        name="companyName"
                        value={form.companyName}
                        onChange={(event) => updateField("companyName", event.target.value)}
                        autoComplete="organization"
                        placeholder="Company name"
                      />
                    </div>

                    <div>
                      <FieldLabel htmlFor={firstNameId}>First name *</FieldLabel>
                      <TextField
                        id={firstNameId}
                        name="firstName"
                        value={form.firstName}
                        onChange={(event) => updateField("firstName", event.target.value)}
                        autoComplete="given-name"
                        placeholder="First name"
                      />
                    </div>

                    <div>
                      <FieldLabel htmlFor={lastNameId}>Last name *</FieldLabel>
                      <TextField
                        id={lastNameId}
                        name="lastName"
                        value={form.lastName}
                        onChange={(event) => updateField("lastName", event.target.value)}
                        autoComplete="family-name"
                        placeholder="Last name"
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <FieldLabel htmlFor={phoneId}>Phone number *</FieldLabel>
                    <TextField
                      id={phoneId}
                      name="phoneNumber"
                      type="tel"
                      value={form.phoneNumber}
                      onChange={(event) => updateField("phoneNumber", event.target.value)}
                      autoComplete="tel"
                      placeholder="+31 6 12 34 56 78"
                    />
                  </div>

                  <div className="mt-5">
                    <FieldLabel htmlFor={needsId}>Can you share more about your business needs and challenges?</FieldLabel>
                    <textarea
                      id={needsId}
                      name="needs"
                      value={form.needs}
                      onChange={(event) => updateField("needs", event.target.value)}
                      rows={5}
                      placeholder="Tell us about the workflows, teams, systems, or rollout questions you want to solve."
                      className="min-h-[144px] w-full rounded-[20px] border border-black/[0.08] bg-white px-4 py-3 font-sans text-[15px] leading-relaxed text-zinc-950 shadow-[0_1px_2px_rgba(15,23,42,0.03)] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-zinc-400 focus:border-black/20 focus:shadow-[0_0_0_4px_rgba(17,17,17,0.06)]"
                    />
                  </div>

                  <input
                    type="text"
                    name="website"
                    value={form.website}
                    onChange={(event) => updateField("website", event.target.value)}
                    autoComplete="off"
                    tabIndex={-1}
                    className="hidden"
                    aria-hidden
                  />

                  <div className="mt-5 flex gap-3 rounded-[22px] border border-black/[0.06] bg-white/80 px-4 py-4">
                    <input
                      id={consentId}
                      type="checkbox"
                      checked={form.marketingOptIn}
                      onChange={(event) => updateField("marketingOptIn", event.target.checked)}
                      className="mt-0.5 size-[18px] shrink-0 rounded border-zinc-300 accent-zinc-950"
                    />
                    <label htmlFor={consentId} className="font-sans text-[13px] leading-relaxed text-zinc-600">
                      I would like to receive marketing communications from Jokuh about products, services, and events.
                      You can unsubscribe at any time.
                    </label>
                  </div>

                  <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="submit"
                        disabled={submitState.kind === "submitting"}
                        className={cn(
                          "inline-flex h-12 min-w-[11.5rem] items-center justify-center gap-2 rounded-full bg-black px-6 font-sans text-[14px] font-semibold text-white transition-all duration-200 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/25 disabled:cursor-not-allowed disabled:bg-zinc-700",
                        )}
                      >
                        {submitState.kind === "submitting" ? (
                          <>
                            <LoaderCircle className="size-4 animate-spin" strokeWidth={2} aria-hidden />
                            Sending
                          </>
                        ) : (
                          <>
                            Submit inquiry
                            <ArrowRight className="size-4" strokeWidth={2} aria-hidden />
                          </>
                        )}
                      </button>
                      <p className="font-sans text-[13px] text-zinc-500">We usually respond within one business day.</p>
                    </div>

                    <p className="font-sans text-[13px] leading-relaxed text-zinc-500">
                      For other inquiries, visit our{" "}
                      <SiteLink href={helpCenterHref} className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-[3px] hover:decoration-zinc-700">
                        help center
                      </SiteLink>
                      .
                    </p>
                  </div>

                  {submitState.kind !== "idle" && submitState.kind !== "submitting" && (
                    <div
                      className={cn(
                        "mt-5 rounded-[18px] px-4 py-3 font-sans text-[13px] leading-relaxed",
                        submitState.kind === "success"
                          ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                          : "border border-red-200 bg-red-50 text-red-800",
                      )}
                    >
                      {submitState.message}
                    </div>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </MarketingPageFrame>
  );
}

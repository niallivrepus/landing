import { Button, cn } from "@jokuh/gooey";
import { LoaderCircle, ShieldCheck, Sparkles, Waypoints } from "lucide-react";
import {
  CompanyPageClosingCta,
  CompanyPageLayout,
} from "../components/CompanyPageLayout";
import { FaqSection } from "../components/FaqSection";
import { SiteLink } from "../components/SiteLink";
import {
  CONTENT_READING_MEASURE,
  CONTENT_SHELL_WIDE,
} from "../components/system/shells";
import { resolveHelpHref } from "../config/site-subdomains";
import {
  CONTACT_SALES_COMPANY_SIZE_OPTIONS,
  CONTACT_SALES_INTEREST_OPTIONS,
} from "../data/contact-sales";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useId, useState, type ChangeEvent, type ComponentType, type FormEvent } from "react";

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

type ContactSalesResponse = {
  error?: string;
  message?: string;
};

type Feature = {
  title: string;
  copy: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
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

const FEATURES: readonly Feature[] = [
  {
    title: "Governed deployment",
    copy: "Bring privacy, identity, and oversight into the rollout from the start.",
    icon: ShieldCheck,
  },
  {
    title: "Operational rollout",
    copy: "Map pilots, stakeholders, adoption, and team enablement into one plan.",
    icon: Sparkles,
  },
  {
    title: "Real systems fit",
    copy: "Connect Jokuh to the workflows and tools your teams already depend on.",
    icon: Waypoints,
  },
] as const;

const INPUT_CLASS =
  "h-12 w-full rounded-[16px] border border-light-space/[0.1] bg-white/[0.03] px-4 font-sans text-[15px] text-light-space outline-none transition focus:border-light-space/25 focus:bg-white/[0.05] light:border-zinc-200 light:bg-white light:text-zinc-950 light:focus:border-zinc-400";

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block font-sans text-[13px] font-medium text-light-space light:text-zinc-950">
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
  required = false,
}: {
  id: string;
  name: keyof ContactSalesFormState;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
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
      required={required}
      aria-required={required}
      className={INPUT_CLASS}
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
  required = false,
}: {
  id: string;
  name: keyof ContactSalesFormState;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  placeholder: string;
  options: readonly string[];
  required?: boolean;
}) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      aria-required={required}
      className={cn(INPUT_CLASS, "appearance-none")}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function FeatureRow({ feature }: { feature: Feature }) {
  const Icon = feature.icon;

  return (
    <li className="flex gap-3 rounded-[18px] border border-light-space/[0.08] bg-white/[0.02] p-4 light:border-zinc-200 light:bg-white">
      <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white/[0.06] light:bg-section-grey-light">
        <Icon className="size-4.5" strokeWidth={1.8} aria-hidden />
      </span>
      <div>
        <p className="font-sans text-[14px] font-semibold text-light-space light:text-zinc-950">{feature.title}</p>
        <p className="mt-1 text-[14px] leading-[1.6] text-light-space/60 light:text-zinc-600">{feature.copy}</p>
      </div>
    </li>
  );
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
  const noticeId = useId();

  const [form, setForm] = useState<ContactSalesFormState>(INITIAL_FORM);
  const [submitState, setSubmitState] = useState<SubmitState>({ kind: "idle" });
  const helpCenterHref = resolveHelpHref("/");

  function updateField<K extends keyof ContactSalesFormState>(name: K, value: ContactSalesFormState[K]) {
    setForm((current) => ({ ...current, [name]: value }));
    setSubmitState((current) => (current.kind === "submitting" ? current : { kind: "idle" }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    setSubmitState({ kind: "submitting" });

    try {
      const payload: ContactSalesFormState = {
        interest: form.interest.trim(),
        workEmail: form.workEmail.trim(),
        companySize: form.companySize.trim(),
        companyName: form.companyName.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        needs: form.needs.trim(),
        marketingOptIn: form.marketingOptIn,
        website: form.website.trim(),
      };

      const response = await fetch(CONTACT_SALES_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as ContactSalesResponse | null;

      if (!response.ok) {
        throw new Error(result?.error || "We could not send your inquiry right now.");
      }

      setForm(INITIAL_FORM);
      setSubmitState({
        kind: "success",
        message: result?.message || "Thanks. Your inquiry was sent to Jokuh and our team will follow up by email.",
      });
    } catch (error) {
      setSubmitState({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "We could not send your inquiry right now. Please email hello@jokuh.com directly.",
      });
    }
  }

  return (
    <CompanyPageLayout>
      <>
        <header className={cn(CONTENT_SHELL_WIDE, "pt-28 pb-10 text-center md:pt-32 md:pb-14")}>
          <p className="font-sans text-[13px] font-medium tracking-wide text-white light:text-zinc-950">
            Enterprise
          </p>
          <div className={cn(CONTENT_READING_MEASURE, "text-center")}>
            <h1 className="mt-4 font-sans text-[2.1rem] font-semibold leading-[1.08] tracking-[0em] text-light-space light:text-zinc-950 sm:mt-5 sm:text-5xl md:text-6xl">
              Contact sales
            </h1>
            <p className="mt-6 text-[1.0625rem] font-normal leading-[1.65] text-light-space/60 light:text-zinc-600 md:mt-7 md:text-[1.125rem] md:leading-[1.62]">
              Talk to Jokuh about rollout, governance, integrations, and the practical path to getting teams live.
            </p>
          </div>
        </header>

        <section className="py-20 md:py-28">
          <div className={cn(CONTENT_SHELL_WIDE, "grid items-start gap-12 md:grid-cols-2 md:gap-16")}>
            <div className="order-last md:order-first">
              <div className="max-w-lg">
                <h2 className="font-sans text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.1] tracking-[0em] text-light-space light:text-zinc-950">
                  Start with the context
                </h2>
                <p className="mt-5 text-[1.0625rem] leading-[1.72] text-light-space/60 light:text-zinc-600 md:text-[1.125rem]">
                  Share the team, company size, and business need. We use that to route your note to the right sales or solutions lead and come back with a concrete next step.
                </p>
              </div>

              <ul className="mt-8 space-y-3 max-w-xl pt-6">
                {FEATURES.map((feature) => (
                  <FeatureRow key={feature.title} feature={feature} />
                ))}
              </ul>
            </div>

            <div className="order-first md:order-last rounded-[24px] border border-light-space/[0.08] bg-white/[0.02] p-6 light:border-zinc-200 light:bg-white md:p-8">
              <div className="max-w-xl">
                <h2 className="font-sans text-2xl font-semibold tracking-[0em] text-light-space light:text-zinc-950 md:text-3xl">
                  Tell us what you need
                </h2>
                <p className="mt-3 text-[1rem] leading-[1.7] text-light-space/60 light:text-zinc-600">
                  We’ll use this to understand fit, prepare follow-up, and keep the next step useful.
                </p>
              </div>

              <form className="mt-8" onSubmit={handleSubmit} aria-describedby={submitState.kind !== "idle" ? noticeId : undefined}>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor={interestId}>What are you interested in? *</FieldLabel>
                    <SelectField
                      id={interestId}
                      name="interest"
                      value={form.interest}
                      onChange={(event) => updateField("interest", event.target.value)}
                      placeholder="Select one"
                      options={CONTACT_SALES_INTEREST_OPTIONS}
                      required
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
                      required
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
                      options={CONTACT_SALES_COMPANY_SIZE_OPTIONS}
                      required
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
                      required
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
                      required
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
                      required
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
                    required
                  />
                </div>

                <div className="mt-5">
                  <FieldLabel htmlFor={needsId}>Can you share more about your business needs and challenges?</FieldLabel>
                  <textarea
                    id={needsId}
                    name="needs"
                    value={form.needs}
                    onChange={(event) => updateField("needs", event.target.value)}
                    rows={6}
                    placeholder="Tell us about the workflows, teams, systems, or rollout questions you want to solve."
                    className={cn(INPUT_CLASS, "min-h-[160px] px-4 py-3 h-auto")}
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

                <div className="mt-5 rounded-[18px] border border-light-space/[0.08] p-4 light:border-zinc-200">
                  <label htmlFor={consentId} className="flex gap-3 text-[13px] leading-relaxed text-light-space/60 light:text-zinc-600">
                    <input
                      id={consentId}
                      type="checkbox"
                      checked={form.marketingOptIn}
                      onChange={(event) => updateField("marketingOptIn", event.target.checked)}
                      className="mt-0.5 size-[18px] shrink-0 rounded border-light-space/20 accent-white light:border-zinc-300 light:accent-zinc-950"
                    />
                    <span>
                      I would like to receive marketing communications from Jokuh about products, services, and events.
                      You can unsubscribe at any time.
                    </span>
                  </label>
                </div>

                <div className="mt-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button variant="primary-neutral" size="xl" className="px-8" type="submit" disabled={submitState.kind === "submitting"}>
                      {submitState.kind === "submitting" ? (
                        <>
                          <LoaderCircle className="size-4 animate-spin" strokeWidth={2} aria-hidden />
                          Sending
                        </>
                      ) : (
                        "Submit inquiry"
                      )}
                    </Button>
                    <p className="text-[13px] text-light-space/50 light:text-zinc-500">
                      We aim to respond within one business day.
                    </p>
                  </div>

                  <p className="max-w-[28ch] text-[13px] leading-relaxed text-light-space/50 light:text-zinc-500">
                    For other inquiries, contact{" "}
                    <SiteLink
                      href={helpCenterHref}
                      className="font-medium text-light-space underline decoration-light-space/25 underline-offset-4 hover:decoration-light-space/60 light:text-zinc-950 light:decoration-zinc-300 light:hover:decoration-zinc-700"
                    >
                      support
                    </SiteLink>
                    .
                  </p>
                </div>

                {submitState.kind !== "idle" && submitState.kind !== "submitting" ? (
                  <div
                    id={noticeId}
                    role={submitState.kind === "error" ? "alert" : "status"}
                    aria-live="polite"
                    className={cn(
                      "mt-5 rounded-[18px] px-4 py-3 font-sans text-[13px] leading-relaxed",
                      submitState.kind === "success"
                        ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border border-red-200 bg-red-50 text-red-800",
                    )}
                  >
                    {submitState.message}
                  </div>
                ) : null}
              </form>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className={cn(CONTENT_SHELL_WIDE, "text-center")}>
            <p className="max-w-3xl mx-auto font-sans text-[clamp(1.25rem,3vw,2rem)] font-semibold leading-snug tracking-[0em] text-white light:text-zinc-900">
              Jokuh works best when deployment, governance, and adoption are designed together instead of handed off across separate teams.
            </p>
          </div>
        </section>

        <section className={cn(CONTENT_SHELL_WIDE, "py-20 md:py-28")}>
          <FaqSection
            items={[
              {
                question: "How long does it take to hear back?",
                answer: "One business day for serious inbound: investors, enterprise pilots, ecosystem partners. Set expectations in the first message and you'll get a real human response, not a sequence.",
              },
              {
                question: "What should I prepare for the first call?",
                answer: "A clear sentence on what you're trying to do with Jokuh, who's involved on your side, and the constraint that matters most: timeline, security, integration, scale. The sharper your context, the more value you get from 30 minutes.",
              },
              {
                question: "Is there a minimum company size?",
                answer: "No hard minimum. We work with serious solo operators, teams under 50, and larger orgs with security and procurement requirements. The filter is fit, not headcount.",
              },
              {
                question: "Can I get a demo before committing?",
                answer: "Yes. Every qualified inbound gets a private walkthrough of the live MVP. We don't ship pre-recorded demos; you see the actual product on a real call.",
              },
              {
                question: "I need support, not sales. Where do I go?",
                answer: "Use the Support page. Sales is for partnerships, pilots, investor conversations, and integrations; everything else routes faster through Support.",
              },
            ]}
          />
        </section>

        <CompanyPageClosingCta
          headline="Need support instead of sales?"
          buttonLabel="Contact support"
          buttonHref={helpCenterHref}
        />
      </>
    </CompanyPageLayout>
  );
}

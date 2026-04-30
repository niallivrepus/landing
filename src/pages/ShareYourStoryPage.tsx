import { Button, cn } from "@jokuh/gooey";
import { LoaderCircle } from "lucide-react";
import { useId, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { TertiaryPageChrome } from "../components/system/TertiaryPageChrome";
import { CONTENT_READING_MEASURE, CONTENT_SHELL_WIDE } from "../components/system/shells";
import { getStoryFormProductOptions, STORY_TEXT_MAX } from "../data/share-story-form";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import type { ProductId } from "../data/products";

const STORY_SUBMISSIONS_ENDPOINT = import.meta.env.VITE_STORY_SUBMISSIONS_ENDPOINT?.trim() || "/api/story-submissions";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  state: string;
  aboutWho: "self" | "other" | "";
  bio: string;
  jokuhUsage: string;
  impact: string;
  uniqueness: string;
  links: string;
  consent: boolean;
  website: string;
};

const INITIAL_FORM: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  city: "",
  state: "",
  aboutWho: "",
  bio: "",
  jokuhUsage: "",
  impact: "",
  uniqueness: "",
  links: "",
  consent: false,
  website: "",
};

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

const fieldClass =
  "h-12 w-full rounded-2xl border border-light-space/[0.1] bg-white/[0.03] px-4 font-sans text-[15px] text-light-space outline-none transition focus:border-light-space/[0.22] focus:ring-1 focus:ring-light-space/[0.14] light:border-zinc-200 light:bg-white light:text-zinc-900 light:focus:border-zinc-400 light:focus:ring-zinc-300";
const textAreaClass = cn(
  "min-h-[160px] w-full resize-y rounded-2xl border border-light-space/[0.1] bg-white/[0.03] px-4 py-3 font-sans text-[15px] text-light-space outline-none transition focus:border-light-space/[0.22] focus:ring-1 focus:ring-light-space/[0.14] light:border-zinc-200 light:bg-white light:text-zinc-900 light:focus:border-zinc-400 light:focus:ring-zinc-300",
);
const labelClass = "mb-2 block font-sans text-[13px] font-semibold text-light-space light:text-zinc-900";

function FieldLabel({ htmlFor, children, required }: { htmlFor: string; children: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className={labelClass}>
      {children}
      {required ? " *" : null}
    </label>
  );
}

export function ShareYourStoryPage() {
  useDocumentTitle("Share your story — Jokuh");

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [selectedProducts, setSelectedProducts] = useState<Set<ProductId>>(() => new Set());
  const [submitState, setSubmitState] = useState<SubmitState>({ kind: "idle" });
  const productOptions = getStoryFormProductOptions();

  const firstNameId = useId();
  const lastNameId = useId();
  const emailId = useId();
  const cityId = useId();
  const stateId = useId();
  const aboutSelfId = useId();
  const aboutOtherId = useId();
  const bioId = useId();
  const jokuhUsageId = useId();
  const impactId = useId();
  const uniquenessId = useId();
  const linksId = useId();
  const consentId = useId();

  function updateField<K extends keyof FormState>(name: K, value: FormState[K]) {
    setForm((c) => ({ ...c, [name]: value }));
  }

  function clip(s: string) {
    return s.slice(0, STORY_TEXT_MAX);
  }

  function toggleProduct(id: ProductId) {
    setSelectedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.aboutWho) {
      setSubmitState({ kind: "error", message: "Please select who this story is about." });
      return;
    }
    const productSlugs = Array.from(selectedProducts);
    if (productSlugs.length === 0) {
      setSubmitState({ kind: "error", message: "Select at least one Jokuh product." });
      return;
    }
    setSubmitState({ kind: "submitting" });

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      aboutWho: form.aboutWho,
      bio: clip(form.bio),
      jokuhUsage: clip(form.jokuhUsage),
      impact: clip(form.impact),
      uniqueness: clip(form.uniqueness),
      productSlugs,
      links: form.links.trim(),
      consent: form.consent,
      website: form.website,
    };

    try {
      const response = await fetch(STORY_SUBMISSIONS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => null)) as { error?: string; deferred?: boolean; ok?: boolean } | null;

      if (!response.ok) {
        throw new Error(result?.error || "Unable to submit right now.");
      }

      setForm(INITIAL_FORM);
      setSelectedProducts(new Set());
      const deferred = Boolean((result as { deferred?: boolean; mode?: string })?.deferred || (result as { mode?: string })?.mode === "deferred");
      setSubmitState({
        kind: "success",
        message: deferred
          ? "Thanks—we received your note. We will follow up if your story is a good fit. (Submission is in preview mode until our API is live.)"
          : "Thank you. We received your story and will be in touch if it is a good fit.",
      });
    } catch (e) {
      setSubmitState({
        kind: "error",
        message: e instanceof Error ? e.message : "Unable to submit right now.",
      });
    }
  }

  return (
    <TertiaryPageChrome>
      <header className={cn(CONTENT_SHELL_WIDE, "pt-6 pb-12 text-center md:pt-8 md:pb-16")}>
        <div className={cn(CONTENT_READING_MEASURE, "mx-auto")}>
          <h1 className="font-sans text-[2.25rem] font-semibold leading-[1.1] tracking-[0em] text-light-space light:text-zinc-900 md:text-5xl">Share your story</h1>
          <p className="mt-5 text-[1.0625rem] leading-[1.65] text-light-space/62 light:text-zinc-600 md:mt-6 md:text-[1.125rem]">
            We collect real stories from people using Jokuh—what you are building, learning, or figuring out as you work. The details you share
            help us see where the product fits real life, and they may shape future editorial stories.
          </p>
          <p className="mt-4 text-[1.0625rem] leading-[1.65] text-light-space/62 light:text-zinc-600 md:text-[1.125rem]">
            If that sounds like you (or someone you can speak for with their permission), use the form below. We read every submission.
          </p>
        </div>
      </header>

      <div className={cn(CONTENT_SHELL_WIDE, "pb-24 md:pb-32")}>
        <form
          onSubmit={handleSubmit}
          className={cn(CONTENT_READING_MEASURE, "mx-auto space-y-10 text-left")}
          noValidate
        >
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            <div>
              <FieldLabel htmlFor={firstNameId} required>
                First name
              </FieldLabel>
              <input
                id={firstNameId}
                name="firstName"
                value={form.firstName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => updateField("firstName", e.target.value)}
                autoComplete="given-name"
                className={fieldClass}
                required
              />
            </div>
            <div>
              <FieldLabel htmlFor={lastNameId} required>
                Last name
              </FieldLabel>
              <input
                id={lastNameId}
                name="lastName"
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                autoComplete="family-name"
                className={fieldClass}
                required
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor={emailId} required>
              Email
            </FieldLabel>
            <input
              id={emailId}
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              autoComplete="email"
              className={fieldClass}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            <div>
              <FieldLabel htmlFor={cityId} required>
                City
              </FieldLabel>
              <input
                id={cityId}
                name="city"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                autoComplete="address-level2"
                className={fieldClass}
                required
              />
            </div>
            <div>
              <FieldLabel htmlFor={stateId} required>
                State / region
              </FieldLabel>
              <input
                id={stateId}
                name="state"
                value={form.state}
                onChange={(e) => updateField("state", e.target.value)}
                autoComplete="address-level1"
                className={fieldClass}
                required
              />
            </div>
          </div>

          <fieldset className="space-y-2">
            <legend className={labelClass}>
              Is this story about: *
            </legend>
            <div className="flex flex-col gap-2 pt-1">
              <label className="flex cursor-pointer items-center gap-2 font-sans text-[15px] text-light-space/88 light:text-zinc-800">
                <input
                  id={aboutSelfId}
                  name="aboutWho"
                  type="radio"
                  checked={form.aboutWho === "self"}
                  onChange={() => updateField("aboutWho", "self")}
                  className="size-4 border-light-space/[0.2] text-light-space accent-light-space light:border-zinc-300 light:text-zinc-900 light:accent-zinc-900"
                />
                You
              </label>
              <label className="flex cursor-pointer items-center gap-2 font-sans text-[15px] text-light-space/88 light:text-zinc-800">
                <input
                  id={aboutOtherId}
                  name="aboutWho"
                  type="radio"
                  checked={form.aboutWho === "other"}
                  onChange={() => updateField("aboutWho", "other")}
                  className="size-4 border-light-space/[0.2] text-light-space accent-light-space light:border-zinc-300 light:text-zinc-900 light:accent-zinc-900"
                />
                Someone you know
              </label>
            </div>
          </fieldset>

          <div>
            <FieldLabel htmlFor={bioId} required>
              Tell us about yourself or the person this is about
            </FieldLabel>
            <p className="mb-2 text-[13px] leading-relaxed text-light-space/50 light:text-zinc-500">
              A few sentences about who you are, what you do, or what you are working on, and why it matters to you.
            </p>
            <textarea
              id={bioId}
              name="bio"
              value={form.bio}
              onChange={(e) => updateField("bio", clip(e.target.value))}
              className={textAreaClass}
              required
              maxLength={STORY_TEXT_MAX}
            />
            <p className="mt-1 text-[12px] text-light-space/45 light:text-zinc-500">{form.bio.length} / {STORY_TEXT_MAX} characters max</p>
          </div>

          <div>
            <FieldLabel htmlFor={jokuhUsageId} required>
              How do you/they use Jokuh?
            </FieldLabel>
            <p className="mb-2 text-[13px] text-light-space/50 light:text-zinc-500">For capture, focus, writing, building, learning, or something else?</p>
            <textarea
              id={jokuhUsageId}
              name="jokuhUsage"
              value={form.jokuhUsage}
              onChange={(e) => updateField("jokuhUsage", clip(e.target.value))}
              className={textAreaClass}
              required
              maxLength={STORY_TEXT_MAX}
            />
            <p className="mt-1 text-[12px] text-light-space/45 light:text-zinc-500">{form.jokuhUsage.length} / {STORY_TEXT_MAX} characters max</p>
          </div>

          <div>
            <p className={labelClass}>
              What Jokuh products do you/they use? (Check all that apply) *
            </p>
            <ul className="mt-2 flex flex-col gap-2">
              {productOptions.map((p) => (
                <li key={p.id}>
                  <label className="flex cursor-pointer items-center gap-2 font-sans text-[15px] text-light-space/88 light:text-zinc-800">
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(p.id)}
                      onChange={() => toggleProduct(p.id)}
                      className="size-4 rounded border-light-space/[0.2] accent-light-space light:border-zinc-300 light:accent-zinc-900"
                    />
                    {p.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <FieldLabel htmlFor={impactId} required>
              How has using Jokuh helped you/them?
            </FieldLabel>
            <textarea
              id={impactId}
              name="impact"
              value={form.impact}
              onChange={(e) => updateField("impact", clip(e.target.value))}
              className={textAreaClass}
              required
              maxLength={STORY_TEXT_MAX}
            />
            <p className="mt-1 text-[12px] text-light-space/45 light:text-zinc-500">{form.impact.length} / {STORY_TEXT_MAX} characters max</p>
          </div>

          <div>
            <FieldLabel htmlFor={uniquenessId} required>
              What makes your/their story special?
            </FieldLabel>
            <textarea
              id={uniquenessId}
              name="uniqueness"
              value={form.uniqueness}
              onChange={(e) => updateField("uniqueness", clip(e.target.value))}
              className={textAreaClass}
              required
              maxLength={STORY_TEXT_MAX}
            />
            <p className="mt-1 text-[12px] text-light-space/45 light:text-zinc-500">{form.uniqueness.length} / {STORY_TEXT_MAX} characters max</p>
          </div>

          <div>
            <FieldLabel htmlFor={linksId}>
              Any links you would like to share?
            </FieldLabel>
            <input
              id={linksId}
              name="links"
              value={form.links}
              onChange={(e) => updateField("links", e.target.value)}
              className={fieldClass}
              placeholder="Portfolio, social, company site, …"
            />
          </div>

          <input
            type="text"
            name="website"
            value={form.website}
            onChange={(e) => updateField("website", e.target.value)}
            autoComplete="off"
            tabIndex={-1}
            className="hidden"
            aria-hidden
          />

          <div className="rounded-2xl border border-light-space/[0.1] bg-white/[0.03] p-4 light:border-zinc-200 light:bg-section-grey-light/90">
            <label htmlFor={consentId} className="flex gap-3 text-[13px] leading-relaxed text-light-space/62 light:text-zinc-600">
              <input
                id={consentId}
                type="checkbox"
                checked={form.consent}
                onChange={(e) => updateField("consent", e.target.checked)}
                className="mt-0.5 size-[18px] shrink-0 rounded border-light-space/[0.2] accent-light-space light:border-zinc-300 light:accent-zinc-900"
                required
              />
              <span>
                By submitting this form, you agree that Jokuh may contact you about this submission, and you acknowledge that we will use it in
                line with our{" "}
                <Link
                  to="/privacy"
                  className="font-medium text-light-space underline decoration-light-space/25 underline-offset-2 hover:decoration-light-space/50 light:text-zinc-900 light:decoration-zinc-300 light:hover:decoration-zinc-600"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              type="submit"
              size="lg"
              variant="primary-neutral"
              className="rounded-full bg-zinc-100 px-6 font-sans text-[15px] font-medium text-zinc-900 hover:bg-white dark:bg-[#F5F5F7] dark:hover:bg-white"
              disabled={submitState.kind === "submitting"}
            >
              {submitState.kind === "submitting" ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" strokeWidth={2} aria-hidden />
                  Submitting
                </>
              ) : (
                "Submit"
              )}
            </Button>
            <Link to="/stories" className="text-[14px] font-medium text-light-space/62 underline underline-offset-2 hover:text-light-space light:text-zinc-600 light:hover:text-zinc-900">
              Back to Stories
            </Link>
          </div>

          {submitState.kind === "success" || submitState.kind === "error" ? (
            <p
              className={cn(
                "rounded-2xl px-4 py-3 text-[14px] leading-relaxed",
                submitState.kind === "success"
                  ? "border border-emerald-500/25 bg-emerald-500/10 text-emerald-200 light:border-emerald-200 light:bg-emerald-50 light:text-emerald-900"
                  : "border border-red-500/25 bg-red-500/10 text-red-200 light:border-red-200 light:bg-red-50 light:text-red-800",
              )}
            >
              {submitState.message}
            </p>
          ) : null}
        </form>
      </div>
    </TertiaryPageChrome>
  );
}

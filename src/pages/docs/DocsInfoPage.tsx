import { Link, Navigate } from "react-router-dom";
import { pageHeroEyebrowUppercaseClass } from "../../components/system";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const DOCS_INFO_PAGES = {
  sdk: {
    title: "SDK & API",
    eyebrow: "Reference",
    intro:
      "A compact map of the API surface while Jokuh is still early. Keep this page factual and small until the public contract is final.",
    bullets: [
      "Authenticate with a server-side API key.",
      "Send a request with input, optional instructions, and a response format.",
      "Treat model names and advanced options as private until launch.",
    ],
    next: { label: "Run the quickstart", href: "/developers/docs/quickstart" },
  },
  text: {
    title: "Text generation",
    eyebrow: "Start building",
    intro:
      "Use this starter page for the simplest useful product flow: send text in, receive text out, and render the answer.",
    bullets: [
      "Start with one clear instruction.",
      "Keep user-provided context short and explicit.",
      "Show generated text with room for review before it ships.",
    ],
    next: { label: "View SDK & API", href: "/developers/docs/sdk" },
  },
  "structured-output": {
    title: "Structured output",
    eyebrow: "Start building",
    intro:
      "Use structured output when the response needs to move into product logic instead of being displayed as prose.",
    bullets: [
      "Define the fields your app expects before the request.",
      "Validate the returned JSON before taking action.",
      "Keep schemas narrow until the workflow is proven.",
    ],
    next: { label: "View text generation", href: "/developers/docs/text" },
  },
  audio: {
    title: "Audio basics",
    eyebrow: "Start building",
    intro:
      "Audio docs are intentionally minimal for now. This page exists to frame future call, message, and transcript workflows.",
    bullets: [
      "Capture consent before recording or processing audio.",
      "Attach transcript context to the person or session it belongs to.",
      "Keep summaries reviewable before they become tasks or messages.",
    ],
    next: { label: "View structured output", href: "/developers/docs/structured-output" },
  },
} as const;

export type DocsInfoPageId = keyof typeof DOCS_INFO_PAGES;

export function DocsInfoPage({ pageId }: { pageId: DocsInfoPageId }) {
  const page = DOCS_INFO_PAGES[pageId];

  if (!page) {
    return <Navigate to="/developers/docs" replace />;
  }

  useDocumentTitle(`${page.title} — Jokuh Docs`);

  return (
    <article className="w-full max-w-[770px] pb-16">
      <header>
        <p className={pageHeroEyebrowUppercaseClass}>
          {page.eyebrow}
        </p>
        <h1 className="mt-3 font-sans text-[32px] font-semibold leading-tight tracking-[0em] text-white md:text-[42px] light:text-zinc-950">
          {page.title}
        </h1>
        <p className="mt-4 max-w-[62ch] font-sans text-[15px] leading-7 text-white/56 light:text-zinc-600">
          {page.intro}
        </p>
      </header>

      <section className="mt-10 rounded-xl border border-white/[0.08] bg-white/[0.025] p-5 light:border-black/[0.08] light:bg-black/[0.02] md:p-6">
        <h2 className="font-sans text-[18px] font-semibold tracking-[0em] text-white light:text-zinc-950">
          What to know
        </h2>
        <ul className="mt-4 space-y-3">
          {page.bullets.map((item) => (
            <li key={item} className="flex gap-3 font-sans text-[14px] leading-6 text-white/58 light:text-zinc-600">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-white/35 light:bg-zinc-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <Link
        to={page.next.href}
        className="mt-8 inline-flex h-10 items-center rounded-full border border-white/10 px-4 font-sans text-[13px] font-semibold text-white/78 transition-colors hover:bg-white/[0.05] hover:text-white light:border-black/[0.1] light:text-zinc-700 light:hover:bg-black/[0.04] light:hover:text-zinc-950"
      >
        {page.next.label}
      </Link>
    </article>
  );
}

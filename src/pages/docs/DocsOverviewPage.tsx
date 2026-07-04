import { Code2, FileText, Radio, Rows3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const START_BUILDING_ITEMS = [
  {
    title: "Quickstart",
    body: "Install the SDK, set an API key, and make one first request.",
    href: "/developers/docs/quickstart",
    Icon: Code2,
  },
  {
    title: "SDK & API",
    body: "A short map of the request shape we expect to support first.",
    href: "/developers/docs/sdk",
    Icon: FileText,
  },
  {
    title: "Text generation",
    body: "The simplest useful flow: send input, receive text, show it in-product.",
    href: "/developers/docs/text",
    Icon: Rows3,
  },
  {
    title: "Structured output",
    body: "Return a small JSON shape your app can validate before using.",
    href: "/developers/docs/structured-output",
    Icon: Rows3,
  },
] as const;

const STATUS_ITEMS = [
  "Docs are intentionally small while the platform is early.",
  "Model names, pricing, and advanced guides are not public yet.",
  "Use these pages as stable placeholders for the first developer handoff.",
] as const;

export function DocsOverviewPage() {
  useDocumentTitle("Jokuh Documentation");

  return (
    <article className="w-full max-w-[770px] pb-16">
      <header className="max-w-[700px]">
        <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.12em] text-white/38 light:text-zinc-500">
          Documentation
        </p>
        <h1 className="mt-3 font-sans text-[32px] font-semibold leading-tight tracking-[0em] text-white md:text-[44px] light:text-zinc-950">
          Start small. Build from the first request.
        </h1>
        <p className="mt-4 max-w-[62ch] font-sans text-[15px] leading-7 text-white/56 light:text-zinc-600">
          Jokuh docs are intentionally reduced while the platform is in early access. This page only keeps the
          paths that are useful today: a quickstart, a compact SDK/API overview, and a few starter explanations.
        </p>
      </header>

      <section className="mt-10 overflow-hidden rounded-xl border border-white/10 bg-white/[0.035] light:border-black/[0.08] light:bg-section-grey-light">
        <div className="grid gap-px bg-white/8 light:bg-black/[0.08] md:grid-cols-[0.9fr_1fr]">
          <div className="bg-[#111214] p-6 light:bg-white md:p-8">
            <h2 className="font-sans text-[22px] font-semibold tracking-[0em] text-white light:text-zinc-950">
              Developer quickstart
            </h2>
            <p className="mt-3 max-w-[42ch] font-sans text-[15px] leading-7 text-white/55 light:text-zinc-600">
              Create an API key, install the SDK, and run a single request. Keep this as the source of truth until
              deeper guides are ready.
            </p>
            <Link
              to="/developers/docs/quickstart"
              className="mt-6 inline-flex h-10 items-center rounded-full bg-white px-4 font-sans text-[13px] font-semibold text-black transition-colors hover:bg-white/90 light:bg-black light:text-white light:hover:bg-black/90"
            >
              Open quickstart
            </Link>
          </div>
          <div className="bg-[#111214] p-6 light:bg-white md:p-8">
            <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.12em] text-white/38 light:text-zinc-500">
              Current scope
            </p>
            <ul className="mt-4 space-y-3">
              {STATUS_ITEMS.map((item) => (
                <li key={item} className="flex gap-3 font-sans text-[14px] leading-6 text-white/58 light:text-zinc-600">
                  <Radio className="mt-1 size-3.5 shrink-0 text-white/42 light:text-zinc-400" strokeWidth={2} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-sans text-[24px] font-semibold tracking-[0em] text-white light:text-zinc-950">
          Start building
        </h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {START_BUILDING_ITEMS.map(({ title, body, href, Icon }) => (
            <Link
              key={title}
              to={href}
              className="group rounded-xl border border-white/[0.08] bg-white/[0.025] p-4 transition-colors hover:bg-white/[0.05] light:border-black/[0.08] light:bg-black/[0.02] light:hover:bg-black/[0.04]"
            >
              <span className="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] light:border-black/[0.08] light:bg-black/[0.03]">
                <Icon className="size-4 text-white/72 light:text-zinc-700" strokeWidth={1.9} />
              </span>
              <span className="mt-4 block font-sans text-[15px] font-semibold text-white light:text-zinc-950">
                {title}
              </span>
              <span className="mt-1 block font-sans text-[13px] leading-6 text-white/50 light:text-zinc-600">
                {body}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}

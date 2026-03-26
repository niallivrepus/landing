import { Link } from "react-router-dom";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export function DocsOverviewPage() {
  useDocumentTitle("Documentation — Jokuh");

  return (
    <article>
      <h1 className="font-sans text-[32px] font-semibold leading-tight tracking-tight text-light-space md:text-[40px]">
        Jokuh documentation
      </h1>
      <p className="mt-5 max-w-[52ch] font-sans text-[15px] leading-relaxed text-light-space/60">
        Native docs for integrating with Jokuh—guides, API reference, and examples ship here as we open the platform.
      </p>
      <section id="featured" className="mt-10 scroll-mt-24" aria-labelledby="docs-featured">
        <h2
          id="docs-featured"
          className="font-sans text-[15px] font-semibold uppercase tracking-wide text-light-space/50"
        >
          Featured
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-light-glass-10 bg-light-space/[0.03] p-6 md:p-8">
            <p className="font-sans text-xs font-medium uppercase tracking-wide text-light-space/45">Video</p>
            <h3 className="mt-2 font-sans text-lg font-semibold text-light-space">Platform walkthrough</h3>
            <p className="mt-2 font-sans text-sm leading-relaxed text-light-space/55">
              Placeholder for a hero embed—mirror OpenAI Developers featured tiles.
            </p>
          </div>
          <div className="rounded-xl border border-light-glass-10 bg-light-space/[0.03] p-6 md:p-8">
            <p className="font-sans text-xs font-medium uppercase tracking-wide text-light-space/45">Starter</p>
            <h3 className="mt-2 font-sans text-lg font-semibold text-light-space">Example app</h3>
            <p className="mt-2 font-sans text-sm leading-relaxed text-light-space/55">
              Featured card slot for sample repos or MCP integrations.
            </p>
            <Link
              to="/developers/apps"
              className="mt-5 inline-flex items-center rounded-full border border-light-glass-20 bg-light-space/[0.06] px-4 py-2 font-sans text-[13px] font-medium text-light-space transition-colors hover:bg-light-space/[0.1]"
            >
              Apps platform
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-light-glass-10 bg-light-space/[0.03] p-6 md:p-8">
          <h2 className="font-sans text-lg font-semibold text-light-space">Developer quickstart</h2>
          <p className="mt-2 font-sans text-sm leading-relaxed text-light-space/55">
            Install the SDK, authenticate, and make your first call. More detail is on the way.
          </p>
          <Link
            to="/developers/docs/quickstart"
            className="mt-5 inline-flex items-center rounded-full border border-light-glass-20 bg-light-space/[0.06] px-4 py-2 font-sans text-[13px] font-medium text-light-space transition-colors hover:bg-light-space/[0.1]"
          >
            Open quickstart
          </Link>
        </div>
        <div className="rounded-xl border border-light-glass-10 bg-light-space/[0.03] p-6 md:p-8">
          <h2 className="font-sans text-lg font-semibold text-light-space">Cookbook</h2>
          <p className="mt-2 font-sans text-sm leading-relaxed text-light-space/55">
            Recipes, guides, and notebooks to help you build on Jokuh.
          </p>
          <Link
            to="/developers/docs/cookbook"
            className="mt-5 inline-flex items-center rounded-full border border-light-glass-20 bg-light-space/[0.06] px-4 py-2 font-sans text-[13px] font-medium text-light-space transition-colors hover:bg-light-space/[0.1]"
          >
            Browse cookbook
          </Link>
        </div>
      </div>
    </article>
  );
}

import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { COOKBOOK_RECIPES } from "../../data/docs-cookbook";
import { cn } from "@jokuh/gooey";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export function DocsCookbookPage() {
  useDocumentTitle("Cookbook — Jokuh");

  return (
    <article className="w-full max-w-[1180px]">
      <header className="max-w-[760px]">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-white/38 light:text-zinc-500">Cookbook</p>
        <h1 className="mt-4 font-sans text-[38px] font-semibold tracking-[-0.04em] text-white md:text-[52px] light:text-zinc-950">
          Working patterns.
        </h1>
        <p className="mt-5 max-w-[58ch] font-sans text-[16px] leading-7 text-white/58 light:text-zinc-600">
          The cookbook sits inside the same docs shell, but the content rhythm changes: less onboarding, more reusable
          implementation patterns and sample flows.
        </p>
      </header>

      <section className="mt-10">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 light:border-black/[0.08] light:bg-black/[0.02]">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-white/36 light:text-zinc-500">Featured</p>
            <h2 className="mt-3 font-sans text-[28px] font-semibold tracking-[-0.03em] text-white light:text-zinc-950">
              Sample repo and MCP starter slots belong here.
            </h2>
            <p className="mt-4 font-sans text-[15px] leading-7 text-white/56 light:text-zinc-600">
              This hero block gives the docs app a place for high-signal launches, reference builds, and example
              applications without pushing everything into the homepage grid.
            </p>
            <Link
              to="/developers/apps"
              className="mt-7 inline-flex h-10 items-center rounded-full bg-white px-4 font-sans text-[13px] font-semibold text-black transition-colors hover:bg-white/90"
            >
              Explore apps platform
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 light:border-black/[0.08] light:bg-black/[0.02]">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-white/36 light:text-zinc-500">
                Integration
              </p>
              <p className="mt-3 font-sans text-[16px] leading-7 text-white/68 light:text-zinc-600">
                Connect Jokuh SDK primitives to product surfaces without rebuilding every integration from scratch.
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 light:border-black/[0.08] light:bg-black/[0.02]">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-white/36 light:text-zinc-500">
                Patterns
              </p>
              <p className="mt-3 font-sans text-[16px] leading-7 text-white/68 light:text-zinc-600">
                Capture orchestration, app flows, and prompt composition as reusable reference pages.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-sans text-[28px] font-semibold tracking-[-0.03em] text-white light:text-zinc-950">Recipe index</h2>
            <p className="mt-2 max-w-[50rem] font-sans text-[15px] leading-7 text-white/52 light:text-zinc-600">
              Recipe cards now sit inside the full-width docs template rather than the old narrow marketing scaffold.
            </p>
          </div>
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {COOKBOOK_RECIPES.map((recipe) => {
            const Icon = recipe.icon;
            const inner = (
              <>
                <div
                  className="relative flex h-[164px] items-center justify-center rounded-t-[1.4rem] bg-white/[0.04] light:bg-black/[0.03]"
                >
                  <Icon className="size-10 text-white/95 light:text-zinc-900" strokeWidth={1.5} aria-hidden />
                </div>
                <div className="p-5">
                  <h3 className="font-sans text-[19px] font-semibold tracking-[-0.025em] text-white light:text-zinc-950">
                    {recipe.title}
                  </h3>
                  <p className="mt-3 flex flex-wrap gap-1.5">
                    {recipe.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 font-sans text-[11px] font-medium text-white/54 light:border-black/[0.08] light:bg-black/[0.03] light:text-zinc-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </p>
                  <p className="mt-6 inline-flex items-center gap-1 font-sans text-[13px] font-semibold text-white/76 light:text-zinc-700">
                    {recipe.href ? "Open recipe" : "Coming soon"}
                    {recipe.href ? <ArrowUpRight className="size-4" strokeWidth={1.8} aria-hidden /> : null}
                  </p>
                </div>
              </>
            );

            const cardClass =
              "group block overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.03] text-left transition-colors hover:bg-white/[0.05] light:border-black/[0.08] light:bg-black/[0.02] light:hover:bg-black/[0.04]";

            if (recipe.href) {
              if (recipe.external) {
                return (
                  <li key={recipe.title}>
                    <a href={recipe.href} className={cardClass} target="_blank" rel="noreferrer">
                      {inner}
                    </a>
                  </li>
                );
              }
              return (
                <li key={recipe.title}>
                  <Link to={recipe.href} className={cardClass}>
                    {inner}
                  </Link>
                </li>
              );
            }

            return (
              <li key={recipe.title}>
                <div className={cn(cardClass, "cursor-default")}>{inner}</div>
              </li>
            );
          })}
        </ul>
      </section>
    </article>
  );
}

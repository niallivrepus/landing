import { Link } from "react-router-dom";
import { COOKBOOK_RECIPES } from "../../data/docs-cookbook";
import { cn } from "@jokuh/gooey";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export function DocsCookbookPage() {
  useDocumentTitle("Cookbook — Jokuh");

  return (
    <article>
      <header className="text-center md:mx-auto md:max-w-[640px]">
        <h1 className="font-sans text-[32px] font-semibold leading-tight tracking-tight text-light-space md:text-[40px]">
          Cookbook
        </h1>
        <p className="mx-auto mt-5 max-w-[52ch] font-sans text-[15px] leading-relaxed text-light-space/60">
          Recipes, guides, and notebooks to help you build with OpenAI models.
        </p>
      </header>

      <section className="mt-14" aria-labelledby="cookbook-featured">
        <h2
          id="cookbook-featured"
          className="font-sans text-[13px] font-semibold uppercase tracking-[0.1em] text-light-space/45"
        >
          Featured
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COOKBOOK_RECIPES.map((recipe) => {
            const Icon = recipe.icon;
            const inner = (
              <>
                <div
                  className={cn(
                    "relative flex h-[120px] items-center justify-center bg-gradient-to-br",
                    recipe.gradient,
                  )}
                >
                  <Icon className="size-9 text-white/95" strokeWidth={1.5} aria-hidden />
                </div>
                <div className="p-4">
                  <h3 className="font-sans text-[15px] font-semibold leading-snug text-light-space">{recipe.title}</h3>
                  <p className="mt-2 flex flex-wrap gap-1.5">
                    {recipe.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-light-space/[0.06] px-2 py-0.5 font-sans text-[11px] font-medium text-light-space/55"
                      >
                        {tag}
                      </span>
                    ))}
                  </p>
                  {!recipe.href ? (
                    <p className="mt-3 font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-light-space/35">
                      Coming soon
                    </p>
                  ) : null}
                </div>
              </>
            );

            const cardClass =
              "group block overflow-hidden rounded-xl border border-light-glass-10 bg-light-space/[0.03] text-left transition-colors hover:border-light-glass-20 hover:bg-light-space/[0.05]";

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

      <p className="mt-12 text-center font-sans text-[13px] text-light-space/45">
        Community notebooks and samples will be linked here as we publish them.
      </p>
    </article>
  );
}

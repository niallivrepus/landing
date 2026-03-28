import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@jokuh/gooey";
import { TERTIARY_PAGE_SHELL } from "./TertiaryPageChrome";

export type TertiaryDocSection = {
  id: string;
  title: string;
  body: string[];
  cta?: {
    label: string;
    to?: string;
    href?: string;
  };
};

export function TertiaryDocBody({
  tocItems,
  sections,
  children,
  footer,
  tocLabel = "On this page",
  className,
}: {
  tocItems: { id: string; label: string }[];
  sections?: TertiaryDocSection[];
  children?: ReactNode;
  footer?: ReactNode;
  tocLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn(TERTIARY_PAGE_SHELL, "py-12 md:py-14", className)}>
      <div className="grid gap-10 md:grid-cols-[220px_minmax(0,1fr)] md:gap-12 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="md:sticky md:top-24 md:self-start">
          <nav
            className="rounded-[24px] border border-light-space/[0.08] bg-white/[0.02] p-4 light:border-black/[0.08] light:bg-zinc-50"
            aria-label={tocLabel}
          >
            <p className="text-[11px] font-medium tracking-[0.12em] text-light-space/45 uppercase light:text-zinc-500">
              {tocLabel}
            </p>
            <ul className="mt-3 space-y-2">
              {tocItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-[13px] leading-snug text-light-space/65 transition-colors hover:text-light-space light:text-zinc-600 light:hover:text-zinc-950"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <article className="min-w-0">
          <div className="max-w-[720px]">
            {sections
              ? sections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-24 border-b border-light-space/[0.08] pb-10 last:border-b-0 last:pb-0 light:border-black/[0.08]"
                  >
                    <h2 className="font-sans text-[22px] font-semibold tracking-[-0.03em] text-light-space light:text-zinc-950 md:text-[24px]">
                      {section.title}
                    </h2>
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="mt-4 text-[16px] leading-[1.72] text-light-space/75 light:text-zinc-700">
                        {paragraph}
                      </p>
                    ))}
                    {section.cta ? (
                      <p className="mt-4">
                        {section.cta.to ? (
                          <Link to={section.cta.to} className="text-[14px] text-[var(--color-blue-4)] transition-colors hover:underline">
                            {section.cta.label}
                          </Link>
                        ) : (
                          <a href={section.cta.href ?? "#"} className="text-[14px] text-[var(--color-blue-4)] transition-colors hover:underline">
                            {section.cta.label}
                          </a>
                        )}
                      </p>
                    ) : null}
                  </section>
                ))
              : children}
          </div>
          {footer ? <div className="mt-10">{footer}</div> : null}
        </article>
      </div>
    </div>
  );
}

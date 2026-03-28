import type { ReactNode } from "react";
import { cn } from "@jokuh/gooey";
import { SiteLink } from "../SiteLink";
import { TERTIARY_PAGE_SHELL, TERTIARY_READING_MEASURE } from "./TertiaryPageChrome";

export type TertiaryQuickLink = {
  label: string;
  href: string;
  description?: string;
};

export function TertiaryHubBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn(TERTIARY_PAGE_SHELL, "py-14 md:py-16", className)}>{children}</div>;
}

export function TertiarySection({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border-b border-light-space/[0.08] py-12 last:border-b-0 last:pb-0 light:border-black/[0.08] md:py-14", className)}>
      <div className="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)] md:gap-8">
        <h2 className="font-sans text-[20px] font-semibold tracking-[-0.03em] text-light-space light:text-zinc-950 md:text-[24px]">
          {title}
        </h2>
        <div className={cn(TERTIARY_READING_MEASURE, "space-y-4 text-[16px] leading-[1.72] text-light-space/65 light:text-zinc-600")}>
          {children}
        </div>
      </div>
    </section>
  );
}

export function TertiaryQuickLinksGrid({
  links,
  columns = 2,
  className,
}: {
  links: TertiaryQuickLink[];
  columns?: 2 | 3;
  className?: string;
}) {
  const gridClass = columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2";

  return (
    <div className={cn("grid gap-4", gridClass, className)}>
      {links.map((link) => (
        <SiteLink
          key={`${link.label}-${link.href}`}
          href={link.href}
          className="block rounded-[24px] border border-light-space/[0.08] bg-white/[0.02] px-5 py-5 transition-colors hover:border-light-space/[0.16] hover:bg-white/[0.04] light:border-black/[0.08] light:bg-zinc-50 light:hover:border-black/[0.14] light:hover:bg-zinc-100"
        >
          <div className="font-sans text-[16px] font-semibold tracking-[-0.02em] text-light-space light:text-zinc-950">
            {link.label}
          </div>
          {link.description ? (
            <p className="mt-2 max-w-[46ch] text-[14px] leading-[1.6] text-light-space/55 light:text-zinc-600">
              {link.description}
            </p>
          ) : null}
        </SiteLink>
      ))}
    </div>
  );
}

export function TertiaryClosingCta({
  title,
  label,
  href,
  className,
}: {
  title: string;
  label: string;
  href: string;
  className?: string;
}) {
  return (
    <section className={cn("border-t border-light-space/[0.08] py-14 light:border-black/[0.08] md:py-16", className)}>
      <div className={cn(TERTIARY_PAGE_SHELL, "text-center")}>
        <h2 className="mx-auto max-w-[720px] font-sans text-[28px] font-semibold leading-[1.1] tracking-[-0.04em] text-light-space light:text-zinc-950 md:text-[36px]">
          {title}
        </h2>
        <div className="mt-8 flex justify-center">
          <SiteLink
            href={href}
            className="inline-flex h-11 items-center justify-center rounded-full border border-light-space/[0.12] px-6 text-[14px] font-medium text-light-space transition-colors hover:border-light-space/[0.24] hover:bg-white/[0.04] light:border-black/[0.12] light:text-zinc-950 light:hover:border-black/[0.18] light:hover:bg-zinc-100"
          >
            {label}
          </SiteLink>
        </div>
      </div>
    </section>
  );
}

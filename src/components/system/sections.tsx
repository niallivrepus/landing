import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@jokuh/gooey";

export function MarketingPageSection({
  children,
  className,
  borderedTop,
  id,
}: {
  children: ReactNode;
  className?: string;
  borderedTop?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(borderedTop && "border-t border-light-space/[0.08]", className)}
    >
      {children}
    </section>
  );
}

export function SectionHeaderRow({
  title,
  actionLabel,
  actionTo,
  className,
}: {
  title: string;
  actionLabel: string;
  actionTo: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-10 flex items-baseline justify-between gap-6 md:mb-12", className)}>
      <h2 className="font-sans text-lg font-semibold tracking-tight text-light-space/90 md:text-xl">{title}</h2>
      <Link
        to={actionTo}
        className="shrink-0 font-sans text-sm font-semibold text-light-space transition-colors hover:text-light-space/88 light:text-zinc-950 light:hover:text-zinc-800"
      >
        {actionLabel}
      </Link>
    </div>
  );
}

import type { ReactNode } from "react";
import { cn } from "@jokuh/gooey";
import { TERTIARY_PAGE_SHELL, TERTIARY_READING_MEASURE } from "./TertiaryPageChrome";

export type TertiaryPageHeroProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  actions?: ReactNode;
  className?: string;
};

export function TertiaryPageHero({
  eyebrow,
  title,
  intro,
  actions,
  className,
}: TertiaryPageHeroProps) {
  return (
    <header className={cn("border-b border-light-space/[0.08] py-16 light:border-black/[0.08] md:py-20", className)}>
      <div className={cn(TERTIARY_PAGE_SHELL)}>
        <div className={TERTIARY_READING_MEASURE}>
          {eyebrow ? (
            <p className="font-sans text-[12px] font-medium tracking-[0.12em] text-light-space/45 uppercase light:text-zinc-500">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-3 font-sans text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-light-space light:text-zinc-950">
            {title}
          </h1>
          {intro ? (
            <p className="mt-5 text-[16px] leading-[1.7] text-light-space/62 light:text-zinc-600 md:text-[18px]">
              {intro}
            </p>
          ) : null}
          {actions ? <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div> : null}
        </div>
      </div>
    </header>
  );
}

import type { ReactNode } from "react";
import { cn } from "@jokuh/gooey";
import { pageHeroEyebrowUppercaseClass } from "./typography";
import { TERTIARY_PAGE_SHELL, TERTIARY_READING_MEASURE } from "./TertiaryPageChrome";

export type TertiaryPageHeroProps = {
  eyebrow?: string;
  title: string;
  intro?: string | ReactNode;
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
    <header className={cn("py-16 md:py-20", className)}>
      <div className={cn(TERTIARY_PAGE_SHELL)}>
        <div className={TERTIARY_READING_MEASURE}>
          {eyebrow ? (
            <p className={pageHeroEyebrowUppercaseClass}>
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-3 font-sans text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[0em] text-light-space light:text-zinc-950">
            {title}
          </h1>
          {intro ? (
            <div className="mt-5 space-y-4 text-[16px] leading-[1.7] text-light-space/62 light:text-zinc-600 md:text-[18px]">
              {typeof intro === "string" ? <p className="leading-[1.7]">{intro}</p> : intro}
            </div>
          ) : null}
          {actions ? <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div> : null}
        </div>
      </div>
    </header>
  );
}

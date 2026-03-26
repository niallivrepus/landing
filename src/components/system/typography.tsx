import type { ReactNode } from "react";
import { cn } from "@jokuh/gooey";

export function MarketingEyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "font-sans text-[11px] font-normal tracking-[0.08em] text-light-space/40 uppercase",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** H1 for company / article-style pages (About, Careers hero) */
export function MarketingDisplayTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h1
      className={cn(
        "mt-3 font-sans text-[clamp(2.5rem,6vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-light-space",
        className,
      )}
    >
      {children}
    </h1>
  );
}

/** H1 for stub / simple pages */
export function MarketingSimplePageTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h1
      className={cn(
        "font-sans text-3xl font-semibold tracking-tight text-light-space md:text-4xl",
        className,
      )}
    >
      {children}
    </h1>
  );
}

export function MarketingSectionHeading({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn("font-sans text-xl font-semibold tracking-tight text-light-space md:text-2xl", className)}>
      {children}
    </h2>
  );
}

export function MarketingSectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3
      className={cn(
        "font-sans text-[13px] font-semibold tracking-[0.06em] text-light-space/45 uppercase",
        className,
      )}
    >
      {children}
    </h3>
  );
}

export const proseBodyMutedClass =
  "max-w-[640px] font-sans text-[16px] leading-relaxed text-light-space/50";

export function MarketingProseMuted({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn(proseBodyMutedClass, className)}>{children}</p>;
}

export function MarketingProseLead({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "max-w-[640px] font-sans text-[17px] leading-[1.65] text-light-space/55 md:text-lg",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function MarketingStubDescription({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("mt-4 font-sans text-sm leading-relaxed text-light-space/55", className)}>{children}</p>
  );
}

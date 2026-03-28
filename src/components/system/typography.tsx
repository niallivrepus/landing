import type { ReactNode } from "react";
import { cn } from "@jokuh/gooey";

/* ═══════════════════════════════════════════════════════════════════════════
   Typography Kit — Jokuh Landing
   ─────────────────────────────────────────────────────────────────────────
   Source of truth: gooey design-tokens.css (H1-H8, P, Label, Mono).
   Tailwind utilities registered in app.css @theme block.

   Two layers:
     1. Class-string exports  →  use on any element
     2. Component exports     →  semantic element + default classes
   ═══════════════════════════════════════════════════════════════════════════ */

// ── Shared helpers ─────────────────────────────────────────────────────────

const fg = "text-light-space light:text-zinc-950";
const fgMuted = "text-light-space/50 light:text-zinc-600";
const fgDimmed = "text-light-space/40 light:text-zinc-500";

type TypoProps = { children: ReactNode; className?: string };

// ── 1. Class strings ───────────────────────────────────────────────────────

/** H1 hero — 80 px / weight 500 / tracking −5 px */
export const displayClass =
  `font-sans text-display font-medium leading-[var(--line-height-h1)] tracking-[var(--letter-spacing-h1)] ${fg}`;

/** H2 — 58 px */
export const title1Class =
  `font-sans text-title-1 font-medium leading-[var(--line-height-h2)] tracking-[var(--letter-spacing-h2)] ${fg}`;

/** H3 — 48 px */
export const title2Class =
  `font-sans text-title-2 font-medium leading-[var(--line-height-h3)] ${fg}`;

/** H4 — 40 px */
export const title3Class =
  `font-sans text-title-3 font-normal leading-[var(--line-height-h4)] ${fg}`;

/** H5 — 32 px */
export const headingClass =
  `font-sans text-heading font-normal leading-[var(--line-height-h5)] ${fg}`;

/** H6 — 24 px */
export const subheadingClass =
  `font-sans text-subheading font-normal leading-[var(--line-height-h6)] ${fg}`;

/** Body large — 18 px / 1.52 */
export const bodyLgClass =
  `font-sans text-body-lg leading-[var(--line-height-p-lg)] ${fgMuted}`;

/** Body — 16 px / 1.45 */
export const bodyClass =
  `font-sans text-body leading-[var(--line-height-p-md)] ${fgMuted}`;

/** Body small — 14 px / 1.6 */
export const bodySmClass =
  `font-sans text-body-sm leading-[var(--line-height-p-sm)] ${fgMuted}`;

/** Label — 14 px / tight, semibold */
export const labelClass =
  `font-sans text-label font-semibold leading-[var(--line-height-label)] ${fg}`;

/** Eyebrow — 11 px uppercase tracking wide */
export const eyebrowClass =
  `font-sans text-overline font-normal tracking-[0.08em] uppercase ${fgDimmed}`;

/** Mono eyebrow — 11 px mono, uppercase, wide tracking (metadata lines) */
export const monoEyebrowClass =
  `font-mono text-overline font-medium tracking-[0.2em] uppercase ${fgDimmed}`;

/** Mono — 16 px */
export const monoClass =
  `font-mono text-mono leading-[var(--line-height-mono)] ${fg}`;

/** Mono small — 14 px */
export const monoSmClass =
  `font-mono text-mono-sm leading-[var(--line-height-mono)] ${fg}`;

/** Caption — 12 px */
export const captionClass =
  `font-sans text-caption leading-[1.4] ${fgDimmed}`;

/** Prose body — max-width reading measure, muted (legacy: proseBodyMutedClass) */
export const proseBodyMutedClass =
  `max-w-[640px] font-sans text-body leading-relaxed ${fgMuted}`;

// ── 2. Components ──────────────────────────────────────────────────────────

/** Hero display H1 — 80 px fluid */
export function Display({ children, className }: TypoProps) {
  return <h1 className={cn(displayClass, className)}>{children}</h1>;
}

/** Page title H1 — 58 px, for company / article heroes */
export function Title1({ children, className }: TypoProps) {
  return <h1 className={cn(title1Class, className)}>{children}</h1>;
}

/** Section title H2 — 48 px */
export function Title2({ children, className }: TypoProps) {
  return <h2 className={cn(title2Class, className)}>{children}</h2>;
}

/** Section title H3 — 40 px */
export function Title3({ children, className }: TypoProps) {
  return <h3 className={cn(title3Class, className)}>{children}</h3>;
}

/** Heading H4 — 32 px */
export function Heading({ children, className }: TypoProps) {
  return <h4 className={cn(headingClass, className)}>{children}</h4>;
}

/** Subheading H5 — 24 px */
export function Subheading({ children, className }: TypoProps) {
  return <h5 className={cn(subheadingClass, className)}>{children}</h5>;
}

/** Body large paragraph — 18 px */
export function BodyLarge({ children, className }: TypoProps) {
  return <p className={cn(bodyLgClass, className)}>{children}</p>;
}

/** Body paragraph — 16 px */
export function Body({ children, className }: TypoProps) {
  return <p className={cn(bodyClass, className)}>{children}</p>;
}

/** Body small paragraph — 14 px */
export function BodySmall({ children, className }: TypoProps) {
  return <p className={cn(bodySmClass, className)}>{children}</p>;
}

/** Label — 14 px semibold */
export function Label({ children, className }: TypoProps) {
  return <span className={cn(labelClass, className)}>{children}</span>;
}

/** Eyebrow — 11 px sans uppercase */
export function Eyebrow({ children, className }: TypoProps) {
  return <p className={cn(eyebrowClass, className)}>{children}</p>;
}

/** Mono eyebrow — 11 px mono uppercase (dates, metadata) */
export function MonoEyebrow({ children, className }: TypoProps) {
  return <p className={cn(monoEyebrowClass, className)}>{children}</p>;
}

/** Mono text — 16 px */
export function Mono({ children, className }: TypoProps) {
  return <span className={cn(monoClass, className)}>{children}</span>;
}

/** Mono small text — 14 px */
export function MonoSmall({ children, className }: TypoProps) {
  return <span className={cn(monoSmClass, className)}>{children}</span>;
}

/** Caption — 12 px dimmed */
export function Caption({ children, className }: TypoProps) {
  return <p className={cn(captionClass, className)}>{children}</p>;
}

// ── 3. Backward-compatible aliases ─────────────────────────────────────────
// These map old names → new implementations so existing pages keep working.
// Migrate call-sites at your pace, then remove these.

/** @deprecated Use `Display` or `Title1` */
export function MarketingDisplayTitle({ children, className }: TypoProps) {
  return (
    <h1
      className={cn(
        "mt-3 font-sans text-[clamp(2.5rem,6vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-light-space light:text-zinc-950",
        className,
      )}
    >
      {children}
    </h1>
  );
}

/** @deprecated Use `Display` with smaller className overrides */
export function MarketingSimplePageTitle({ children, className }: TypoProps) {
  return (
    <h1
      className={cn(
        "font-sans text-3xl font-semibold tracking-tight text-light-space light:text-zinc-950 md:text-4xl",
        className,
      )}
    >
      {children}
    </h1>
  );
}

/** @deprecated Use `Title2` or `Subheading` */
export function MarketingSectionHeading({ children, className }: TypoProps) {
  return (
    <h2 className={cn("font-sans text-xl font-semibold tracking-tight text-light-space light:text-zinc-950 md:text-2xl", className)}>
      {children}
    </h2>
  );
}

/** @deprecated Use `Eyebrow` */
export function MarketingEyebrow({ children, className }: TypoProps) {
  return (
    <p
      className={cn(
        "font-sans text-[11px] font-normal tracking-[0.08em] text-light-space/40 uppercase light:text-zinc-500",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** @deprecated Use `MonoEyebrow` or `Label` */
export function MarketingSectionLabel({ children, className }: TypoProps) {
  return (
    <h3
      className={cn(
        "font-sans text-[13px] font-semibold tracking-[0.06em] text-light-space/45 uppercase light:text-zinc-500",
        className,
      )}
    >
      {children}
    </h3>
  );
}

/** @deprecated Use `Body` */
export function MarketingProseMuted({ children, className }: TypoProps) {
  return <p className={cn(proseBodyMutedClass, className)}>{children}</p>;
}

/** @deprecated Use `BodyLarge` */
export function MarketingProseLead({ children, className }: TypoProps) {
  return (
    <p
      className={cn(
        "max-w-[640px] font-sans text-[17px] leading-[1.65] text-light-space/55 light:text-zinc-600 md:text-lg",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** @deprecated Use `BodySmall` */
export function MarketingStubDescription({ children, className }: TypoProps) {
  return (
    <p className={cn("mt-4 font-sans text-sm leading-relaxed text-light-space/55 light:text-zinc-600", className)}>{children}</p>
  );
}

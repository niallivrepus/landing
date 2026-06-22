import * as React from "react";
import { cn } from "../../lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";

/**
 * OnboardingCard — the onboarding flow card shell.
 *
 * Two faithful archetypes from the pattern library onboarding set:
 *  • "action"  — a dark hero zone (320px) over a left-aligned title / subtitle,
 *                a content slot for fields, and a back / next footer. used for
 *                claim identity, password, language, bank info, theme, etc.
 *  • "welcome" — a full-bleed hero that fills the card with a centered title
 *                beneath it. used for the introduction carousel (blurb, calls,
 *                store memories, build identity, bond with oo).
 *
 * the hero zone carries its own near-black radial backdrop so any illustration
 * composes onto a calm surface. pass `hero` (or children) to fill it.
 */

const HERO_BG =
  "radial-gradient(120% 80% at 50% 100%, #1B1B1B 0%, #0E0E0E 50%, #070707 75%, #000000 100%)";

const RIM =
  "none";

type OnboardingLayout = "action" | "welcome";

interface OnboardingCardProps {
  /** archetype — controls hero proportions, title alignment and footer shape. */
  layout?: OnboardingLayout;
  title: React.ReactNode;
  description?: React.ReactNode;

  /** optional `step x/total` pill, top-right of the hero. */
  step?: number;
  totalSteps?: number;

  /** the illustration that lives in the hero zone (alias of `children`). */
  hero?: React.ReactNode;
  /** legacy: a background image painted behind the hero. */
  image?: string;
  /** override the hero backdrop entirely. */
  heroBackground?: React.CSSProperties;
  /** action hero height in px (default 320). welcome ignores this — it fills. */
  heroHeight?: number;

  /** fields / forms rendered between the title and the footer (action layout). */
  contentChildren?: React.ReactNode;
  /** content directly above the footer — e.g. a terms checkbox line. */
  aboveFooter?: React.ReactNode;

  /** footer buttons. supply one for a single action, both for back / next. */
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  primaryDisabled?: boolean;
  /** a fully custom footer — overrides the generated buttons. */
  footer?: React.ReactNode;

  className?: string;
  children?: React.ReactNode;
}

function StepBadge({ step, totalSteps }: { step: number; totalSteps: number }) {
  return (
    <Badge
      label={`step ${step}/${totalSteps}`}
      color="neutral"
      variant="filled"
      className="absolute top-6 right-6 z-10"
    />
  );
}

export function OnboardingCard({
  layout = "action",
  title,
  description,
  step,
  totalSteps,
  hero,
  image,
  heroBackground,
  heroHeight = 320,
  contentChildren,
  aboveFooter,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  primaryDisabled,
  footer,
  className,
  children,
}: OnboardingCardProps) {
  const isWelcome = layout === "welcome";
  const heroContent = hero ?? children;
  const showBadge = typeof step === "number" && typeof totalSteps === "number";

  const heroStyle: React.CSSProperties = heroBackground ?? {
    background: HERO_BG,
    ...(image
      ? { backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" }
      : null),
  };

  const generatedFooter =
    !primaryLabel && !secondaryLabel ? null : (
      <div className={cn("flex w-full gap-2", isWelcome && !secondaryLabel && "flex-col")}>
        {secondaryLabel && (
          <Button
            variant="secondary-neutral"
            size="xl"
            className="flex-1"
            onClick={onSecondary}
          >
            {secondaryLabel}
          </Button>
        )}
        {primaryLabel && (
          <Button
            variant="primary-neutral"
            size="xl"
            className="flex-1"
            onClick={onPrimary}
            disabled={primaryDisabled}
          >
            {primaryLabel}
          </Button>
        )}
      </div>
    );

  return (
    <div
      className={cn(
        "group relative flex w-full max-w-[450px] flex-col overflow-hidden rounded-[40px]",
        "border border-light-glass-20 bg-light-glass-5 backdrop-blur-[25px]",
        "shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1)]",
        className,
      )}
    >
      {/* hero zone */}
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden p-10",
          isWelcome ? "min-h-[420px] flex-1" : "shrink-0",
        )}
        style={{ ...(isWelcome ? null : { height: heroHeight }), ...heroStyle }}
      >
        {showBadge && <StepBadge step={step!} totalSteps={totalSteps!} />}
        {heroContent}
      </div>

      {/* content zone */}
      <div
        className={cn(
          "relative flex flex-col p-6",
          isWelcome ? "items-center gap-6 pb-8 text-center" : "items-start gap-10",
        )}
      >
        <div
          className={cn(
            "flex w-full flex-col",
            isWelcome ? "items-center gap-3" : "items-start gap-2",
          )}
        >
          <h2
            className={cn(
              "w-full font-sans font-bold text-light-space leading-[1.1]",
              isWelcome ? "text-[40px]" : "text-[48px]",
            )}
          >
            {title}
          </h2>
          {description && (
            <p className="w-full font-sans text-[16px] leading-[1.56] text-light-glass-80">
              {description}
            </p>
          )}
        </div>

        {contentChildren}
        {aboveFooter}
        {footer ?? generatedFooter}
      </div>

      {/* rim light */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[40px]"
        style={{ boxShadow: RIM }}
      />
    </div>
  );
}

export type { OnboardingCardProps, OnboardingLayout };

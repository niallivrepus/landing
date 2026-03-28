import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button, cn } from "@jokuh/gooey";
import { useGentleHoverSound } from "../hooks/useGentleHoverSound";
import { MarketingDisplayTitle, MarketingEyebrow, TertiaryPageChrome } from "./system";
import { CONTENT_SHELL_COMPANY } from "./system/shells";

/** Shared content width for company/marketing pages (About, Careers, …). */
export const COMPANY_PAGE_SHELL = CONTENT_SHELL_COMPANY;

export function CompanyPageLayout({ children }: { children: ReactNode }) {
  return <TertiaryPageChrome>{children}</TertiaryPageChrome>;
}

export function CompanyPageHero({
  eyebrow,
  title,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(className)}>
      <MarketingEyebrow>{eyebrow}</MarketingEyebrow>
      <MarketingDisplayTitle>{title}</MarketingDisplayTitle>
      {children}
    </div>
  );
}

export function CompanyPageClosingCta({
  headline,
  buttonLabel,
  buttonTo,
  buttonHref,
  className,
}: {
  headline: string;
  buttonLabel: string;
  /** In-app route, e.g. `/careers` */
  buttonTo?: string;
  /** External or `mailto:` — takes precedence over `buttonTo` when set */
  buttonHref?: string;
  className?: string;
}) {
  const hoverSoundProps = useGentleHoverSound();

  const cta =
    buttonHref != null ? (
      <Button variant="primary-neutral" size="xl" className="px-10" asChild {...hoverSoundProps}>
        <a href={buttonHref}>{buttonLabel}</a>
      </Button>
    ) : (
      <Button variant="primary-neutral" size="xl" className="px-10" asChild {...hoverSoundProps}>
        <Link to={buttonTo ?? "/"}>{buttonLabel}</Link>
      </Button>
    );

  return (
    <section className={cn("border-t border-light-space/[0.08] py-20 light:border-black/[0.08] md:py-28", className)}>
      <div className={cn(COMPANY_PAGE_SHELL, "text-center")}>
        <h2 className="font-sans text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-tight tracking-tight text-light-space light:text-zinc-950">
          {headline}
        </h2>
        <div className="mt-8 flex justify-center">{cta}</div>
      </div>
    </section>
  );
}

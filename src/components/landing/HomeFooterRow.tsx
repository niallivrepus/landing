import { cn } from "@jokuh/gooey";
import { SiteLink } from "../SiteLink";

/** Dispatched to `CookieBanner` (mounted app-wide in `App.tsx`); same event MegaFooter's "Manage cookies" uses. */
const OPEN_COOKIES_EVENT = "jokuh-open-cookies";

const HOME_FOOTER_LINKS = [
  { label: "Download", href: "/download" },
  { label: "Pricing", href: "/pricing" },
  { label: "Shipped", href: "/shipped" },
  { label: "News", href: "/newsroom" },
  { label: "Invest", href: "/invest" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Support", href: "/support" },
] as const;

const itemClass = cn(
  "rounded-sm whitespace-nowrap text-white/45 transition-colors hover:text-white/80",
  "light:text-zinc-500 light:hover:text-zinc-900",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80",
  "light:focus-visible:outline-black/70",
);

/**
 * Dot separator painted inside the gap before every item but the first. Hidden on phones,
 * where the row wraps and a leading dot would hang at the start of each line.
 */
const separatorClass = cn(
  "relative",
  "sm:[&:not(:first-child)]:before:absolute sm:[&:not(:first-child)]:before:top-1/2",
  "sm:[&:not(:first-child)]:before:-left-[7.5px] sm:[&:not(:first-child)]:before:size-[3px]",
  "sm:[&:not(:first-child)]:before:-translate-y-1/2 sm:[&:not(:first-child)]:before:rounded-full",
  "sm:[&:not(:first-child)]:before:bg-current sm:[&:not(:first-child)]:before:content-['']",
  "before:text-white/25 light:before:text-zinc-400",
);

export type HomeFooterRowProps = {
  className?: string;
};

/**
 * **Purpose:** Slim one-line site footer for the one-screen homepage (replaces MegaFooter there).
 * Sized to sit between the bottom corner pills: capped at `100vw - 144px` (231px on a 375px phone,
 * wraps), one line on desktop within 560px.
 * **Connects to:** `LandingImmersiveShell` (bottom-center chrome), `CookieBanner` via `jokuh-open-cookies`.
 */
export function HomeFooterRow({ className }: HomeFooterRowProps) {
  return (
    <nav
      aria-label="Site links"
      className={cn(
        "mx-auto w-full max-w-[min(560px,calc(100vw-144px))] font-sans text-[11px] leading-[1.6]",
        className,
      )}
    >
      <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
        {HOME_FOOTER_LINKS.map((link) => (
          <li key={link.href} className={separatorClass}>
            <SiteLink href={link.href} className={itemClass}>
              {link.label}
            </SiteLink>
          </li>
        ))}
        <li className={separatorClass}>
          <button
            type="button"
            className={cn(itemClass, "cursor-pointer")}
            onClick={() => window.dispatchEvent(new Event(OPEN_COOKIES_EVENT))}
          >
            Cookies
          </button>
        </li>
        <li className={cn(separatorClass, "whitespace-nowrap text-white/45 light:text-zinc-500")}>
          © 2026 Jokuh
        </li>
      </ul>
    </nav>
  );
}

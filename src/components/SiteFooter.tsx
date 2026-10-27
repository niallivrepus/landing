import { useTheme } from "@jokuh/gooey";
import { OPTIONAL_TRACKING_CONFIGURED } from "../lib/cookie-consent";
import { SiteLink } from "./SiteLink";
import "../styles/site-footer.css";

/** The six links the trimmed site keeps (App Store review needs privacy, terms and support reachable). */
const FOOTER_LINKS = [
  { label: "Download", href: "/?get=1" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Security", href: "/security" },
  { label: "Support", href: "/support" },
] as const;

/** Jokuh's real X account (`@J0KUH`, with a zero). */
const X_URL = "https://x.com/J0KUH";

export function SiteThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const options = [
    { value: "auto", label: "Auto" },
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
  ] as const;
  return (
    <div className="gh-sitefoot__theme" role="radiogroup" aria-label="Theme">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={theme === o.value}
          className={theme === o.value ? "is-on" : undefined}
          onClick={() => setTheme?.(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/**
 * **Purpose:** The one footer of the trimmed site (Sean, 2026-10-27): a single centred Gooey slab with Download,
 * Privacy Policy, Terms, Security, Support and Cookies, then "© year Jokuh", X and the theme switch. One line on
 * desktop, wrapping to centred rows on a phone.
 * **Cookies:** opens the consent banner when optional tracking is configured (`jokuh-open-cookies`); otherwise the
 * site sets essential cookies only, so the link goes to the Privacy Policy's cookie section.
 * **Connects to:** `GooeyHome` (inside `.gh`), `MarketingPageFrame` default footer (download and legal pages),
 * `styles/site-footer.css`. The old five-column `MegaFooter` is kept in the tree, unused.
 */
export function SiteFooter({ scheme }: { scheme?: "dark" | "light" }) {
  const { resolvedTheme } = useTheme();
  const s = scheme ?? (resolvedTheme === "light" ? "light" : "dark");
  const year = new Date().getFullYear();

  return (
    <footer className="gh-sitefoot" data-scheme={s} aria-label="Site">
      <div className="gh-sitefoot__slab">
        <nav className="gh-sitefoot__links" aria-label="Footer">
          {FOOTER_LINKS.map((l) => (
            <SiteLink key={l.href} href={l.href} className="gh-sitefoot__link">
              {l.label}
            </SiteLink>
          ))}
          {OPTIONAL_TRACKING_CONFIGURED ? (
            <button
              type="button"
              className="gh-sitefoot__link"
              onClick={() => window.dispatchEvent(new Event("jokuh-open-cookies"))}
            >
              Cookies
            </button>
          ) : (
            <SiteLink href="/privacy#cookies" className="gh-sitefoot__link">
              Cookies
            </SiteLink>
          )}
        </nav>
        <span className="gh-sitefoot__rule" aria-hidden />
        <div className="gh-sitefoot__base">
          <p className="gh-sitefoot__copy">© {year} Jokuh</p>
          <a className="gh-sitefoot__link" href={X_URL} target="_blank" rel="noopener noreferrer" aria-label="Jokuh on X">
            X
          </a>
          <SiteThemeSwitch />
        </div>
      </div>
    </footer>
  );
}

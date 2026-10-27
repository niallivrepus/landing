/**
 * **Purpose:** A plain page as a Jokuh Doc inside the app shell (Sean, 2026-10-27), in the Gooey look of the public
 * meeting recap: `DocSheetFrame` (paper card squircle + rim, goo pebble header Back + Share | Docs | More + Close, goo
 * corner pills, goo Nexus, drifting baby OOs) holding one doc: kicker, title, meta beads, a row of "On this page"
 * beads, then the legal prose. Used by Privacy, Terms, Security and Support, which the App Store reviewer opens.
 * - Corners go to their homepage section (`/#id`, `/#spine`, `/#calls`, `/#text`); Back = previous page or `/`;
 *   Close = `/`; Share copies the link; More = Download Jokuh + the other legal docs.
 * - Hash deep links (`/privacy#cookies`) scroll the doc (`lib/route-scroll.ts` scrolls `[data-doc-scroller]`). The recap has
 *   no contents rail, so contents are the quiet bead row under the title (the same pill as the meeting meta).
 * **Connects to:** `DocSheetFrame`, `GetJokuhSheet`, `SiteFooter`, `styles/doc-sheet.css`.
 */
import { useTheme } from "@jokuh/gooey";
import { useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { openGetJokuh } from "../landing/gooey-home/GetJokuh";
import { SiteFooter } from "../SiteFooter";
import { DocSheetFrame, type DocSheetMenuLink } from "./DocSheetFrame";

export type DocTocItem = { id: string; label: string };

/** The legal docs, linked from each other's More menu. */
export const LEGAL_DOCS: DocSheetMenuLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Security", href: "/security" },
  { label: "Support", href: "/support" },
];

const WORDS_PER_MINUTE = 230;

function ClockIcon() {
  return (
    <svg className="da-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="da-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7 3v3M17 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
    </svg>
  );
}

export function DocAppShell({
  title,
  sharePath,
  updated,
  toc,
  children,
}: {
  /** Doc title (h1), browser tab title and share title. */
  title: string;
  /** Path the Share pill copies. */
  sharePath: string;
  /** Shown as a meta bead, e.g. "Updated October 27, 2026". */
  updated?: string;
  toc: DocTocItem[];
  children: ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  const { pathname } = useLocation();
  const proseRef = useRef<HTMLDivElement>(null);
  const [minutes, setMinutes] = useState<number | null>(null);
  const idsKey = toc.map((t) => t.id).join("|");

  useLayoutEffect(() => {
    const words = proseRef.current?.textContent?.trim().split(/\s+/).length ?? 0;
    setMinutes(Math.max(1, Math.round(words / WORDS_PER_MINUTE)));
  }, [idsKey]);

  const jumpTo = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const target = document.getElementById(id);
    const scroller = target?.closest<HTMLElement>("[data-doc-scroller]");
    if (target && scroller) {
      const top = target.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 16;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      scroller.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
    }
    // Update the address for sharing without a router hash change (that would re-scroll instantly).
    window.history.replaceState(window.history.state, "", `${pathname}#${id}`);
  };

  return (
    <DocSheetFrame
      title={title}
      sharePath={sharePath}
      shareTitle={`${title} · Jokuh`}
      menuActions={[{ label: "Download Jokuh", onSelect: () => openGetJokuh() }]}
      menuLinks={LEGAL_DOCS.filter((d) => d.href !== sharePath)}
    >
      <article className="da-article">
        <header className="da-hero">
          <p className="da-kicker">
            <span className="da-kicker__dot" aria-hidden />
            Jokuh Docs
          </p>
          <h1 className="da-h1">{title}</h1>
          <ul className="da-beads" aria-label="About this document">
            {minutes ? (
              <li className="da-pill">
                <ClockIcon />
                {minutes} min read
              </li>
            ) : null}
            {updated ? (
              <li className="da-pill">
                <CalendarIcon />
                {updated}
              </li>
            ) : null}
          </ul>
          {toc.length > 1 ? (
            <nav className="da-toc" aria-label="Contents">
              <p className="da-toc__label">On this page</p>
              <ul className="da-beads">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a className="da-pill" href={`#${item.id}`} onClick={(e) => jumpTo(e, item.id)}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </header>
        <div ref={proseRef} className="doc-legal">
          {children}
        </div>
        <div className="da-foot">
          <SiteFooter scheme={resolvedTheme === "light" ? "light" : "dark"} />
        </div>
      </article>
    </DocSheetFrame>
  );
}

/**
 * **Purpose:** The Docs sheet as an app surface, not a web page: a React port of the public meeting recap's frame
 * (jokuh-live `frontend/src/components/recap/RecapAppFrame.tsx`, the page behind `/recap/<token>` and the Meet
 * transcripts). Centre: the Docs sheet, a `center-sheet-paper-card--docs` paper card on the exact Figma-50 squircle with
 * its hairline rim (`lib/continuous/paper-card-corners.ts`), the body clipped by the Apple-curve path (56 top / 40 bottom,
 * inset 2), and the header band of `SheetHeaderFlanks` filled with goo pebbles: Back + Share | title | More + Close
 * (inner pills lifted 12, 3 px between, Close red). Round it: the landing's four goo corner pills (each goes to its homepage
 * section), a goo Nexus pill with a dot and the doc's name, and the landing's swarm of real baby OOs drifting behind the sheet
 * (`GooHeroSwarm` with the sheet as its clear zone, the port of `RecapOoField`). No photo, no ConsoleStage, no prompt dock.
 * - Back = previous page or `/`; Close = `/`; Share copies the link (native share sheet on touch); More = actions + links.
 * - The body (`children`) scrolls inside the sheet (`[data-doc-scroller]`); hash deep links scroll it (`lib/route-scroll.ts`).
 * **Connects to:** `DocAppShell`, `GooSheetPills`, `gooey-home/GooCornerFrame` + `GooHeroSwarm`, `GetJokuhSheet`,
 * `styles/doc-sheet.css`. **Not ported 1:1:** the recap's ask-OO dock (no OO chat on the landing); glyphs are plain ink, not
 * the app's embossed ink (`jokuh-icon-emboss.css`).
 */
import { GooeyViewportProvider, useTheme } from "@jokuh/gooey";
import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { continuousCornerPath } from "../../lib/continuous/continuous-corners";
import { bindPaperCardCorners } from "../../lib/continuous/paper-card-corners";
import { GooCornerFrame } from "../landing/gooey-home/GooCornerFrame";
import { GetJokuhSheet } from "../landing/gooey-home/GetJokuh";
import type { GooScheme } from "../landing/gooey-home/goo-kit";
import { swarmFrame, type SwarmFrame } from "../landing/gooey-home/oo-swarm-model";
import { SiteLink } from "../SiteLink";
import {
  DOCS_ICON_BACK,
  DOCS_ICON_CLOSE,
  DOCS_ICON_MORE,
  DOCS_ICON_SHARE,
  DocsHeaderIcon,
  GooNexusPill,
  GooSheetHeaderPill,
} from "./GooSheetPills";
import "../../styles/gooey-home.css";
import "../../styles/doc-sheet.css";

const GooHeroSwarm = lazy(() => import("../landing/gooey-home/GooHeroSwarm"));

/** Header menu link. */
export type DocSheetMenuLink = { label: string; href: string };
/** Header menu action (a button), e.g. "Download Jokuh". */
export type DocSheetMenuAction = { label: string; onSelect: () => void };

/** Homepage section for each corner (the homepage's own corners jump to the same sections). */
const CORNER_HASH: Record<string, string> = { id: "id", spine: "spine", calls: "calls", text: "text" };

/** The swarm's clear zone is the sheet (centred, max 920 px, 68 px under the top, 78 px above the bottom on phones). */
function sheetFrame(w: number, h: number): SwarmFrame {
  const base = swarmFrame(w, h);
  const sheetW = Math.min(920, w - 16);
  const bottom = w >= 1100 ? 32 : 78;
  return { ...base, exHx: sheetW / 2 + 6, exHy: Math.max(40, (h - 68 - bottom) / 2), exDy: (68 - bottom) / 2 };
}

export function DocSheetFrame(props: {
  /** Nexus label: the doc's name. */
  title: string;
  /** Header centre (the app shows "Docs"). */
  headerTitle?: string;
  /** Path the Share pill copies. */
  sharePath: string;
  shareTitle: string;
  menuActions?: DocSheetMenuAction[];
  menuLinks?: DocSheetMenuLink[];
  children: ReactNode;
}) {
  return (
    <GooeyViewportProvider>
      <DocSheetFrameInner {...props} />
    </GooeyViewportProvider>
  );
}

function DocSheetFrameInner({
  title,
  headerTitle = "Docs",
  sharePath,
  shareTitle,
  menuActions = [],
  menuLinks = [],
  children,
}: {
  title: string;
  headerTitle?: string;
  sharePath: string;
  shareTitle: string;
  menuActions?: DocSheetMenuAction[];
  menuLinks?: DocSheetMenuLink[];
  children: ReactNode;
}) {
  useDocumentTitle(`${title} · Jokuh`);
  const { resolvedTheme } = useTheme();
  const scheme: GooScheme = resolvedTheme === "light" ? "light" : "dark";
  const navigate = useNavigate();
  const sheetRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [rim, setRim] = useState<{ w: number; h: number; outer: string; inner: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number | undefined>(undefined);

  // One screen like the app: the doc scrolls inside its sheet, not the page.
  useEffect(() => {
    document.documentElement.classList.add("da-host");
    return () => document.documentElement.classList.remove("da-host");
  }, []);

  // The header floats over the body: tell the body how far the pills reach, so the title never runs under them.
  useLayoutEffect(() => {
    const host = hostRef.current;
    const header = headerRef.current;
    if (!host || !header) return undefined;
    const sync = () => host.style.setProperty("--da-header-h", `${Math.round(header.getBoundingClientRect().height)}px`);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  // Exact squircle paper + rim, and the body clipped by the same continuous path (RecapAppFrame `onMount`).
  useLayoutEffect(() => {
    const sheet = sheetRef.current;
    const body = bodyRef.current;
    if (!sheet || !body) return undefined;
    const unbind = bindPaperCardCorners(sheet);
    const roCard = new ResizeObserver(() => {
      const w = Math.round(sheet.offsetWidth);
      const h = Math.round(sheet.offsetHeight);
      if (w <= 0 || h <= 0) return;
      setRim({
        w,
        h,
        outer: continuousCornerPath(w, h, 50, "figma", { inset: 0.75 }),
        inner: continuousCornerPath(w, h, 50, "figma", { inset: 2.5 }),
      });
    });
    roCard.observe(sheet);
    const roBody = new ResizeObserver(() => {
      const w = Math.round(body.offsetWidth);
      const h = Math.round(body.offsetHeight);
      if (w <= 0 || h <= 0) return;
      const d = continuousCornerPath(w, h, { tl: 56, tr: 56, br: 40, bl: 40 }, "apple", { inset: 2 });
      body.style.clipPath = d ? `path('${d}')` : "";
      if (d) body.setAttribute("data-clipped", "");
    });
    roBody.observe(body);
    return () => {
      unbind();
      roCard.disconnect();
      roBody.disconnect();
    };
  }, []);

  useEffect(() => () => window.clearTimeout(noticeTimer.current), []);

  // The More menu closes on Escape and on a press outside it.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t?.closest(".da-menu") && !t?.closest("[aria-haspopup='menu']")) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [menuOpen]);

  const flash = (message: string) => {
    setNotice(message);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 3200);
  };

  const share = async () => {
    const url = `${window.location.origin}${sharePath}`;
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title: shareTitle, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      flash("Link copied");
    } catch {
      /* dismissed share sheet or blocked clipboard: nothing to do */
    }
  };

  const leave = () => navigate("/");
  const back = () => (window.history.length > 1 ? navigate(-1) : navigate("/"));

  return (
    <section className="da" data-scheme={scheme} aria-label={title}>
      <Suspense fallback={null}>
        <GooHeroSwarm dim={false} frameFor={sheetFrame} />
      </Suspense>

      <GooCornerFrame
        className="da-frame"
        scheme={scheme}
        nexus={null}
        onJump={(target) => navigate(`/#${CORNER_HASH[target] ?? target}`)}
      />

      <div className="da-nexus" role="status" aria-label={`${headerTitle}: ${title}`}>
        <GooNexusPill scheme={scheme}>
          <span className="gcf-nexus__dot" aria-hidden />
          <span className="gcf-nexus__label">{title}</span>
        </GooNexusPill>
      </div>

      <div ref={sheetRef} className="da-sheet" data-scheme={scheme}>
        <div ref={hostRef} className="da-sheet__host">
          <div ref={headerRef} className="da-header">
            <div className="da-flanks">
              <div className="da-flanks__pair">
                <GooSheetHeaderPill side="leading" scheme={scheme} label="Back" icon={<DocsHeaderIcon path={DOCS_ICON_BACK} />} onClick={back} />
                <GooSheetHeaderPill
                  side="leading"
                  lifted
                  scheme={scheme}
                  label="Share"
                  icon={<DocsHeaderIcon path={DOCS_ICON_SHARE} />}
                  onClick={() => void share()}
                />
              </div>
              <div className="da-flanks__center">
                <span className="da-header__title">{headerTitle}</span>
              </div>
              <div className="da-flanks__pair">
                <GooSheetHeaderPill
                  side="trailing"
                  lifted
                  scheme={scheme}
                  label="More"
                  expanded={menuOpen}
                  icon={<DocsHeaderIcon path={DOCS_ICON_MORE} filled />}
                  onClick={() => setMenuOpen((o) => !o)}
                />
                <GooSheetHeaderPill side="trailing" danger scheme={scheme} label="Close" icon={<DocsHeaderIcon path={DOCS_ICON_CLOSE} />} onClick={leave} />
              </div>
            </div>
          </div>

          {menuOpen ? (
            <div className="da-menu" role="menu">
              {menuActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  className="da-menu__item"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    action.onSelect();
                  }}
                >
                  {action.label}
                </button>
              ))}
              {menuActions.length > 0 && menuLinks.length > 0 ? <div className="da-menu__sep" role="separator" /> : null}
              {menuLinks.map((link) => (
                <SiteLink key={link.href} className="da-menu__item" role="menuitem" href={link.href} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </SiteLink>
              ))}
            </div>
          ) : null}
          {notice ? (
            <div className="da-toast" role="status">
              {notice}
            </div>
          ) : null}

          <div ref={bodyRef} className="da-body">
            <div className="da-doc" tabIndex={-1} data-doc-scroller>
              {children}
            </div>
          </div>
        </div>
        {rim ? (
          <svg className="da-sheet__rim" width={rim.w} height={rim.h} viewBox={`0 0 ${rim.w} ${rim.h}`} aria-hidden>
            <path className="da-sheet__rim-inner" d={rim.inner} />
            <path className="da-sheet__rim-outer" d={rim.outer} />
          </svg>
        ) : null}
      </div>

      {/* The Download Jokuh sheet reads the Gooey home tokens, so it sits in a `.gh` host. */}
      <div className="gh gh--host" data-scheme={scheme}>
        <GetJokuhSheet />
      </div>
    </section>
  );
}

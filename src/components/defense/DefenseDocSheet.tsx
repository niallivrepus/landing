import { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { DEFENSE_DOC, DEFENSE_HERO } from "../../data/defense";
import { SiteLink } from "../SiteLink";
import { SquircleBox } from "../system/squircle";

/**
 * **Purpose:** The app's Docs sheet chrome, ported from the web app for `/defense`: the in-column paper card
 * (`.center-sheet-paper-card` — black card, inset paper with the house texture, 50px true squircle) and the
 * `.docs-sheet__header` row of `TextSheetHeaderFlanks` — Back + Share | Docs | More + Close (34×46 rotated liquid
 * capsules; Close in red dismiss glass). Share copies the page link (native share sheet where there is one), More opens
 * the docs menu, Back / Close leave like the sheet would. The body (`children`) is the doc scroller.
 * **Connects to:** `DefenseAppShell`, `DefenseDoc`; styles `defense-app.css`.
 * **Parity:** web app `components/sheets/DocsSheet.tsx`, `TextSheetHeaderFlanks.tsx`, `styles/center-sheet-paper-card.css`,
 * `styles/docs-sheet.css` (read-only source; values copied, not restyled).
 */

/** Glyph paths, verbatim from `DocsSheet.tsx` (`DOCS_ICON_LINK`, `DOCS_ICON_MORE`) and `utils/icons.tsx`. */
const DOCS_ICON_LINK =
  "M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1M14 10a4 4 0 0 0-5.700 0l-3 3A4 4 0 0 0 11 18.700l1-1";
const DOCS_ICON_MORE =
  "M5 10.300a1.700 1.700 0 1 0 0 3.400 1.700 1.700 0 0 0 0-3.400zm7 0a1.700 1.700 0 1 0 0 3.400 1.700 1.700 0 0 0 0-3.400zm7 0a1.700 1.700 0 1 0 0 3.400 1.700 1.700 0 0 0 0-3.400z";

function HeaderIcon({ path, filled }: { path: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
      <path
        d={path}
        fill={filled ? "currentColor" : "none"}
        stroke={filled ? "none" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M15 5L9 12L15 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
      <line x1="6.5" y1="6.5" x2="17.5" y2="17.5" />
      <line x1="17.5" y1="6.5" x2="6.5" y2="17.5" />
    </svg>
  );
}

/** One 34×46 flank capsule (`LiquidCapsulePill`): the capsule tilts, its glyph counter-rotates to stay upright. */
function FlankPill({
  label,
  rotation,
  danger,
  expanded,
  onClick,
  children,
}: {
  label: string;
  rotation: number;
  danger?: boolean;
  expanded?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className="defense-flank-pill"
      aria-label={label}
      aria-expanded={expanded}
      aria-haspopup={expanded === undefined ? undefined : "menu"}
      onClick={onClick}
    >
      <span
        className={danger ? "liquid-capsule liquid-capsule--dismiss-red-glass" : "liquid-capsule"}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <span className="liquid-capsule__glyph" style={{ transform: `rotate(${-rotation}deg)` }}>
          {children}
        </span>
      </span>
    </button>
  );
}

export function DefenseDocSheet({ children, onReplay }: { children: ReactNode; onReplay: () => void }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(noticeTimer.current), []);

  const flash = (message: string) => {
    setNotice(message);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 3200);
  };

  const share = async () => {
    const url = `${window.location.origin}/defense`;
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title: DEFENSE_DOC.name, url });
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
    <SquircleBox
      radius={50}
      className="defense-sheet"
      fillClassName="center-sheet-paper-card defense-sheet__card"
      shadowClassName="defense-sheet__shadow"
    >
      <div className="docs-sheet__header defense-sheet__header">
        <div className="call-sheet-header-flanks defense-flanks">
          <div className="call-sheet-header-flanks__pair">
            <FlankPill label="Back" rotation={-45} onClick={back}>
              <BackIcon />
            </FlankPill>
            <FlankPill label="Share" rotation={-45} onClick={() => void share()}>
              <HeaderIcon path={DOCS_ICON_LINK} />
            </FlankPill>
          </div>
          <div className="defense-flanks__center">
            <span className="docs-sheet__header-title">Docs</span>
          </div>
          <div className="call-sheet-header-flanks__pair">
            <FlankPill label="More" rotation={-135} expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
              <HeaderIcon path={DOCS_ICON_MORE} filled />
            </FlankPill>
            <FlankPill label="Close" rotation={-135} danger onClick={leave}>
              <CloseIcon />
            </FlankPill>
          </div>
        </div>
      </div>

      <div className="center-sheet-paper-card-host__body defense-sheet__body">
        <div
          className="docs-sheet"
          data-view="editor"
          onPointerDown={(event) => {
            if (menuOpen && !(event.target as HTMLElement).closest(".docs-sheet__menu")) setMenuOpen(false);
          }}
        >
          {notice ? (
            <div className="docs-sheet__notice" role="status">
              {notice}
            </div>
          ) : null}
          <div className="docs-sheet__editor">
            <div className="docs-sheet__menu-anchor">
              {menuOpen ? (
                <div className="docs-sheet__menu" role="menu">
                  <SiteLink className="docs-sheet__menu-item" role="menuitem" href={DEFENSE_HERO.primary.href}>
                    {DEFENSE_HERO.primary.label}
                  </SiteLink>
                  <SiteLink className="docs-sheet__menu-item" role="menuitem" href={DEFENSE_HERO.secondary.href}>
                    {DEFENSE_HERO.secondary.label}
                  </SiteLink>
                  <button
                    type="button"
                    className="docs-sheet__menu-item"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      onReplay();
                    }}
                  >
                    Play from the start
                  </button>
                </div>
              ) : null}
            </div>
            <div className="docs-sheet__page">{children}</div>
          </div>
        </div>
      </div>
    </SquircleBox>
  );
}

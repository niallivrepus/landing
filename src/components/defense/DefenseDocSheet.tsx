import { ActionButton, cn } from "@jokuh/gooey";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { DEFENSE_DOC, DEFENSE_HERO } from "../../data/defense";
import { SiteLink } from "../SiteLink";
import { SquircleBox } from "../system/squircle";

/**
 * **Purpose:** The app's Docs sheet chrome, ported from the web app for `/defense`: the in-column paper card
 * (`.center-sheet-paper-card` — black card, inset paper with the house texture, 50px true squircle) and the
 * header row of `TextSheetHeaderFlanks` — Back + Share | Docs | More + Close (34×46 Gooey corner-action pills, −45° /
 * −135°; Close in red dismiss glass). Numbers are the Swift iOS Docs sheet's (`Sources/docs/docs-sheet.swift`,
 * `Sources/sheets/text-sheet.swift`, `wallet-liquid-chrome.swift`, `contact-row.swift`). Share copies the page link (native share sheet where there is one), More opens
 * the docs menu, Back / Close leave like the sheet would. The body (`children`) is the doc scroller.
 * **Connects to:** `DefenseAppShell`, `DefenseDoc`; styles `defense-app.css`.
 * **Parity:** web app `components/sheets/DocsSheet.tsx`, `TextSheetHeaderFlanks.tsx`, `styles/center-sheet-paper-card.css`,
 * `styles/docs-sheet.css` (read-only source; values copied, not restyled).
 */

/**
 * Header glyphs, as the iOS Docs sheet draws them (`docs/docs-sheet.swift` → `TextSheetHeaderFlanks`):
 * Back = `JokuhNavBackChevronIcon` 15, Share = SF `square.and.arrow.up` 14 semibold, More = SF `ellipsis` 14 semibold,
 * Close = `SolarCancelIcon` 15. Back / Share / More are embossed (`jokuhEmbossedIcon`: light #323232, dark E6 → 5A
 * top-to-bottom); Close keeps plain primary ink (`accentCornerIconRest`, 94%).
 */
function EmbossDefs() {
  return (
    <svg width="0" height="0" aria-hidden focusable="false" className="defense-emboss-defs">
      <defs>
        <linearGradient id="defense-emboss" gradientUnits="userSpaceOnUse" x1="0" y1="2" x2="0" y2="22">
          <stop offset="0" className="defense-emboss__top" />
          <stop offset="1" className="defense-emboss__bottom" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Glyph({ size, children, embossed = true }: { size: number; children: ReactNode; embossed?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={embossed ? "url(#defense-emboss)" : "currentColor"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

const BackIcon = () => (
  <Glyph size={15}>
    <path d="M15 5L9 12L15 19" />
  </Glyph>
);

const ShareIcon = () => (
  <Glyph size={14}>
    <path d="M12 3.5v11.5M8 7.5l4-4 4 4M8.5 10.5H7a2 2 0 0 0-2 2v6.5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6.5a2 2 0 0 0-2-2h-1.500" strokeWidth="2" />
  </Glyph>
);

const MoreIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden fill="url(#defense-emboss)">
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
  </svg>
);

const CloseIcon = () => (
  <Glyph size={15} embossed={false}>
    <line x1="6.5" y1="6.5" x2="17.5" y2="17.5" />
    <line x1="17.5" y1="6.5" x2="6.5" y2="17.5" />
  </Glyph>
);

/**
 * One 34×46 flank pill. Same Gooey corner-action pill as the homepage's corner buttons (`@jokuh/gooey`
 * `ActionButton`: GooeyGlass lens, glass border, spring hover/press, counter-rotated glyph), at the header's size
 * (`WalletLiquidPillMetrics` 34×46) and tilt: leading −45° ("right"), trailing −135° (same capsule as +45°, "left").
 * `ActionButton` is a 50×50 control around the pill, so it is centred in a 34×46 slot to keep the row's spacing.
 * The Close pill adds the red dismiss glass (`.defense-flank--dismiss`, `GooeyGlassPalette.dismissCornerAction*`).
 */
function FlankPill({
  label,
  side,
  danger,
  expanded,
  onClick,
  children,
}: {
  label: string;
  side: "leading" | "trailing";
  danger?: boolean;
  expanded?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <span className={cn("defense-flank", danger && "defense-flank--dismiss")} data-side={side}>
      <ActionButton
        aria-label={label}
        aria-expanded={expanded}
        aria-haspopup={expanded === undefined ? undefined : "menu"}
        orientation={side === "leading" ? "right" : "left"}
        pillWidth={34}
        pillHeight={46}
        icon={children}
        onClick={onClick}
      />
    </span>
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
      <EmbossDefs />
      {/* iOS `TextSheetHeaderFlanks`: one row, 6pt apart, 28pt in from the card edge, 16pt down, 2pt (+6 for Docs) below. */}
      <div className="docs-sheet__header defense-sheet__header">
        <div className="defense-flanks">
          <FlankPill label="Back" side="leading" onClick={back}>
            <BackIcon />
          </FlankPill>
          <FlankPill label="Share" side="leading" onClick={() => void share()}>
            <ShareIcon />
          </FlankPill>
          <div className="defense-flanks__center">
            <span className="docs-sheet__header-title">Docs</span>
          </div>
          <FlankPill label="More" side="trailing" expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            <MoreIcon />
          </FlankPill>
          <FlankPill label="Close" side="trailing" danger onClick={leave}>
            <CloseIcon />
          </FlankPill>
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

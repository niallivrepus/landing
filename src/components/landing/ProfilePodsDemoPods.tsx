import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { formatConnectionCountLabel } from "../../lib/public-profile-demo";
import { PROFILE_DEMO_PLACEHOLDER } from "../../lib/profile-demo-identity";
import { SquircleBox } from "../system/squircle";

/**
 * **Purpose:** The pieces of the `/profile` pod demo, copied from the app's real compact pod designs: the profile hero
 * (photo + Network strip), the Gooey tile chrome, and the Music / Gallery / Location / Spine / Blurbs / Bubble / Page
 * faces as they render inside a bento cell. Display only — nothing in here is interactive.
 * **Connects to:** `ProfilePodsDemo.tsx` (board + motion), `styles/landing-profile-pods-demo.css`, `/public/pods-demo/*`.
 * **Parity (web app):** `frontend/src/components/pods/ProfilePodBentoGrid.tsx` (`CellChrome`), `IdPodSquircleShell.tsx`,
 * `IdPodProfilePhotoFrame.tsx`, `ProfileNetworkStrip.tsx`, `MusicPlayerCard.tsx`, `GalleryStrip.tsx`, `LocationCard.tsx`,
 * `SpinePodCard.tsx`, `BlurbsProfilePodCard.tsx`, `BubblePodCard.tsx`, `PagePodCard.tsx`; styles in `profile-pod-bento.css`.
 */

export type PodId = "music" | "gallery" | "location" | "spine" | "blurbs" | "bubble" | "page";
export type PodSize = "small" | "h2" | "h4" | "v2" | "vtall";

const ASSET = "/pods-demo";

/** Tile corner radius — app `CellChrome`: 32 for the horizontal spans, 36 otherwise. */
export function podCornerRadius(size: PodSize): number {
  return size === "h2" || size === "h4" ? 32 : 36;
}

/** Hero shell radius (`ID_POD_SQUIRCLE_CORNER_RADIUS`) and nested photo radius (`ID_POD_PHOTO_CORNER_RADIUS`). */
const HERO_RADIUS = 40;
const PHOTO_RADIUS = 36;

/**
 * Pod-demo squircle: the shared `SquircleBox` with the demo's `ppd-squircle*` class names (styles in
 * `landing-profile-pods-demo.css`).
 */
export function Squircle({
  radius,
  className,
  fillClassName,
  rimClassName,
  style,
  children,
}: {
  radius: number;
  className?: string;
  fillClassName?: string;
  rimClassName?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <SquircleBox
      baseClassName="ppd-squircle"
      radius={radius}
      className={className}
      fillClassName={fillClassName}
      rimClassName={rimClassName}
      style={style}
    >
      {children}
    </SquircleBox>
  );
}

/** Companion tile chrome — app `CellChrome`: near-black OO 4D fill, inner lip, 1.5px rim, stage elevation. */
export function PodTile({ size, children }: { size: PodSize; children: ReactNode }) {
  return (
    <Squircle
      radius={podCornerRadius(size)}
      className="ppd-tile"
      fillClassName="ppd-tile__fill"
      rimClassName="ppd-tile__rim"
    >
      <div className="ppd-tile__body">{children}</div>
    </Squircle>
  );
}

// ─── Profile hero (photo + Network) ─────────────────────────────────────────

type DemoPeer = { id: string; src: string };

const NETWORK_PEERS: DemoPeer[] = [
  { id: "kenji", src: `${ASSET}/peer-01-kenji-sato.jpg` },
  { id: "lekishon", src: `${ASSET}/peer-03-lekishon.jpg` },
  { id: "rowan", src: `${ASSET}/peer-04-rowan-kessler.jpg` },
  { id: "lyra", src: `${ASSET}/peer-05-lyra-bloom.jpg` },
  { id: "june", src: `${ASSET}/peer-06-june-rossi.jpg` },
  { id: "sloane", src: `${ASSET}/peer-07-sloane-marigold.jpg` },
  { id: "malik", src: `${ASSET}/peer-08-malik-al-rashid.jpg` },
];

/** Demo graph size for the slime metric (the strip previews the first few peers, like the app). */
const NETWORK_COUNT = 248;

/** App `ProfileNetworkStrip` (embedded): dimmed 30×41 material-rim capsules on a capsule skin, Network + metric on top. */
function NetworkStrip() {
  return (
    <div className="ppd-network">
      <div className="ppd-network__avatars">
        <div className="ppd-network__row">
          {NETWORK_PEERS.map((peer) => (
            <span key={peer.id} className="ppd-network__frame">
              <span className="ppd-network__photo">
                <img src={peer.src} alt="" width={26} height={37} draggable={false} loading="lazy" decoding="async" />
              </span>
            </span>
          ))}
        </div>
      </div>
      <div className="ppd-network__overlay">
        <span className="ppd-network__title">Network</span>
        <span className="ppd-network__metric">{formatConnectionCountLabel(NETWORK_COUNT)}</span>
      </div>
    </div>
  );
}

/**
 * App profile hero (`IdPodSquircleShell variant="profileHero"`): 4/4/12 padding, 8 gap, 3:4 photo plate in a nested
 * squircle, Network strip under it. `fill` = bento center slot (photo flexes to fit the 2×2 square, like the app's
 * client-pitch hero); otherwise the photo keeps its 3:4 plate (phone stack).
 */
export function ProfileHero({ fill }: { fill: boolean }) {
  return (
    <Squircle
      radius={HERO_RADIUS}
      className={fill ? "ppd-hero ppd-hero--fill" : "ppd-hero"}
      fillClassName="ppd-hero__fill"
      rimClassName="ppd-hero__rim"
    >
      <div className="ppd-hero__photo">
        <Squircle radius={PHOTO_RADIUS} className="ppd-hero__photo-squircle" fillClassName="ppd-hero__well" rimClassName="ppd-hero__photo-rim">
          <img
            src={`${ASSET}/hero-portrait.jpg`}
            alt=""
            className="ppd-hero__img"
            draggable={false}
            decoding="async"
          />
          <span className="ppd-hero__photo-lip" aria-hidden />
        </Squircle>
      </div>
      <NetworkStrip />
      <span className="ppd-hero__lip" aria-hidden />
    </Squircle>
  );
}

/** Display name above the board — app `id-pod-profile-meta`: embossed raised type, 22px / 600, margin 0 0 12px. */
export function ProfileMeta() {
  return (
    <div className="ppd-meta">
      <p className="ppd-meta__name">{PROFILE_DEMO_PLACEHOLDER.displayName}</p>
      <p className="ppd-meta__handle">{PROFILE_DEMO_PLACEHOLDER.handle}</p>
    </div>
  );
}

// ─── Compact pod faces ─────────────────────────────────────────────────────

/** App `MusicPlayerCard` with `bentoFill`: cover + scrim, 15/700 title, 12/700 artist, 28px slime play. */
function MusicPod() {
  return (
    <div className="ppd-music">
      <img className="ppd-music__cover" src={`${ASSET}/music-cover.jpg`} alt="" draggable={false} loading="lazy" decoding="async" />
      <span className="ppd-music__scrim" />
      <span className="ppd-music__body">
        <span className="ppd-music__title">Afterglow</span>
        <span className="ppd-music__artist">Nova Lane</span>
        <span className="ppd-music__play">
          <img src={`${ASSET}/play-slime.svg`} alt="" width={10} height={12} draggable={false} />
        </span>
      </span>
    </div>
  );
}

const GALLERY_SLIDES = [`${ASSET}/gallery-coast.jpg`, `${ASSET}/gallery-walk.jpg`, `${ASSET}/gallery-bungalow.jpg`];
/** App `GalleryStrip` `SLIDESHOW_MS`. */
const GALLERY_SLIDESHOW_MS = 3200;

/** App `GalleryCard`: crossfading slideshow (700 ms fade), bottom scrim, dots, 22/700 stamp title. */
function GalleryPod({ animate }: { animate: boolean }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!animate) return undefined;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setIndex((i) => (i + 1) % GALLERY_SLIDES.length);
    }, GALLERY_SLIDESHOW_MS);
    return () => window.clearInterval(id);
  }, [animate]);

  return (
    <div className="ppd-gallery">
      {GALLERY_SLIDES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          draggable={false}
          loading="lazy"
          decoding="async"
          className={i === index ? "ppd-gallery__img is-active" : "ppd-gallery__img"}
        />
      ))}
      <span className="ppd-gallery__scrim" />
      <span className="ppd-gallery__dots">
        {GALLERY_SLIDES.map((src, i) => (
          <span key={src} className={i === index ? "ppd-gallery__dot is-active" : "ppd-gallery__dot"} />
        ))}
      </span>
      <span className="ppd-gallery__stamp">Tulum</span>
    </div>
  );
}

/** App `LocationCard`: theme-filtered street map + veil, 14px #0075ff pin, 28px label pill. */
function LocationPod() {
  return (
    <div className="ppd-location">
      <span className="ppd-location__map">
        <img className="ppd-location__img" src={`${ASSET}/map-la.jpg`} alt="" draggable={false} loading="lazy" decoding="async" />
        <span className="ppd-location__pin" />
      </span>
      <span className="ppd-location__pill">Los Angeles</span>
    </div>
  );
}

/** App `SPINE_HOUR_CAPSULE_GRADIENT` (empty / passive / memory) and `spineDayHourCapsuleWidthPx`. */
function hourTick(count: number) {
  const tone = count <= 0 ? "empty" : count === 1 ? "passive" : "memory";
  const base = count <= 0 ? 40 : count === 1 ? 50 : count === 2 ? 56 : count <= 4 ? 62 : count <= 6 ? 68 : 76;
  return { tone, width: Math.max(32, base * 0.85) };
}

/** A believable day: quiet night, a morning block, a busy afternoon. */
const SPINE_DEMO_HOURS = [0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 3, 1, 0, 2, 4, 2, 1, 0, 1, 3, 1, 0, 0, 0];

function SpineDayPill({ date, kind, count }: { date: Date; kind: "previous" | "featured" | "next"; count: number }) {
  return (
    <span className={`ppd-spine__pill ppd-spine__pill--${kind}${kind === "featured" ? " is-today" : ""}`}>
      <span className="ppd-spine__weekday">{date.toLocaleDateString("en-US", { weekday: "short" })}</span>
      <span className="ppd-spine__cord" />
      <span className="ppd-spine__num">{date.getDate()}</span>
      {count > 0 && kind !== "next" ? <span className="ppd-spine__count">{count}</span> : null}
    </span>
  );
}

function SpineHourStack({ counts, offset, currentHour }: { counts: number[]; offset: number; currentHour: number }) {
  return (
    <span className="ppd-spine__hours">
      {counts.map((count, i) => {
        const { tone, width } = hourTick(count);
        const current = offset + i === currentHour;
        return (
          <span
            key={offset + i}
            className={`ppd-spine__tick ppd-spine__tick--${tone}${current ? " is-current" : ""}${count > 1 ? " is-dense" : ""}`}
            style={{ width }}
          />
        );
      })}
    </span>
  );
}

/**
 * App `SpinePodCard`. Tall cell (vtall default): yesterday → today pill → AM hour capsules → big slime Book → PM
 * capsules → tomorrow. Small cell: only the Book CTA, exactly as the app's `profile-pod-bento__cell--small` rules.
 */
function SpinePod({ compact }: { compact: boolean }) {
  const today = useMemo(() => new Date(), []);
  if (compact) {
    return (
      <div className="ppd-spine ppd-spine--compact">
        <span className="ppd-spine__scrim" />
        <span className="ppd-spine__cta">Book</span>
      </div>
    );
  }
  const prev = new Date(today);
  prev.setDate(today.getDate() - 1);
  const next = new Date(today);
  next.setDate(today.getDate() + 1);
  const total = SPINE_DEMO_HOURS.reduce((sum, c) => sum + c, 0);
  const currentHour = today.getHours();
  return (
    <div className="ppd-spine">
      <span className="ppd-spine__scrim" />
      <span className="ppd-spine__inner">
        <span className="ppd-spine__title">Spine</span>
        <span className="ppd-spine__composition">
          <SpineDayPill date={prev} kind="previous" count={9} />
          <SpineDayPill date={today} kind="featured" count={total} />
          <span className="ppd-spine__cluster">
            <SpineHourStack counts={SPINE_DEMO_HOURS.slice(0, 12)} offset={0} currentHour={currentHour} />
            <span className="ppd-spine__cta">Book</span>
            <SpineHourStack counts={SPINE_DEMO_HOURS.slice(12)} offset={12} currentHour={currentHour} />
          </span>
          <SpineDayPill date={next} kind="next" count={0} />
        </span>
        <span className="ppd-spine__subtitle">Activity · Book a time</span>
      </span>
    </div>
  );
}

/** App `BlurbsMark` — silhouette throwing a rainbow stream. */
function BlurbsMark() {
  return (
    <span className="ppd-blurbs__mark">
      <svg viewBox="0 0 64 64" aria-hidden focusable="false">
        <defs>
          <linearGradient id="ppd-blurbs-rainbow" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--ppd-rainbow-1)" />
            <stop offset="18%" stopColor="var(--ppd-rainbow-2)" />
            <stop offset="36%" stopColor="var(--ppd-rainbow-3)" />
            <stop offset="52%" stopColor="var(--ppd-rainbow-4)" />
            <stop offset="68%" stopColor="var(--ppd-rainbow-5)" />
            <stop offset="84%" stopColor="var(--ppd-rainbow-6)" />
            <stop offset="100%" stopColor="var(--ppd-rainbow-7)" />
          </linearGradient>
          <radialGradient id="ppd-blurbs-glow" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="var(--ppd-rainbow-5)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill="url(#ppd-blurbs-glow)" />
        <ellipse cx="26" cy="36" rx="11" ry="13" fill="rgba(255,255,255,0.14)" />
        <ellipse cx="26" cy="34" rx="9" ry="10.5" fill="rgba(8,6,16,0.92)" />
        <circle cx="23" cy="32" r="1.35" fill="rgba(255,255,255,0.75)" />
        <circle cx="29" cy="32" r="1.35" fill="rgba(255,255,255,0.75)" />
        <path
          d="M30 38 C36 30, 42 22, 48 12 C50 18, 52 24, 54 28 C48 26, 40 30, 34 38 Z"
          fill="url(#ppd-blurbs-rainbow)"
          opacity="0.95"
        />
        <path
          d="M31 39 C38 28, 46 18, 52 8"
          fill="none"
          stroke="url(#ppd-blurbs-rainbow)"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path d="M44 14 L45.2 16.6 L48 17 L45.2 17.4 L44 20 L42.8 17.4 L40 17 L42.8 16.6 Z" fill="var(--ppd-sparkle)" opacity="0.9" />
        <path d="M50 22 L50.8 23.6 L52.5 24 L50.8 24.4 L50 26 L49.2 24.4 L47.5 24 L49.2 23.6 Z" fill="var(--ppd-rainbow-3)" opacity="0.85" />
        <circle cx="38" cy="24" r="1.1" fill="var(--ppd-sparkle)" opacity="0.7" />
      </svg>
    </span>
  );
}

/** App `BlurbsProfilePodCard` (`bentoCompact` in small cells): rainbow rim, sparkles, mark + title, one peek bubble. */
function BlurbsPod({ compact }: { compact: boolean }) {
  return (
    <div className={compact ? "ppd-blurbs ppd-blurbs--compact" : "ppd-blurbs"}>
      <span className="ppd-blurbs__rim" />
      <span className="ppd-blurbs__sparkles">
        <span className="ppd-blurbs__starburst" />
        <span className="ppd-blurbs__sparkle ppd-blurbs__sparkle--a" />
        <span className="ppd-blurbs__sparkle ppd-blurbs__sparkle--b" />
        <span className="ppd-blurbs__sparkle ppd-blurbs__sparkle--c" />
        <span className="ppd-blurbs__sparkle ppd-blurbs__sparkle--d" />
      </span>
      <span className="ppd-blurbs__title-row">
        <BlurbsMark />
        <span className="ppd-blurbs__title">Blurbs</span>
      </span>
      <span className="ppd-blurbs__bubbles">
        {compact ? null : (
          <>
            <span className="ppd-blurbs__bubble ppd-blurbs__bubble--ghost ppd-blurbs__bubble--out">···</span>
            <span className="ppd-blurbs__bubble ppd-blurbs__bubble--ghost ppd-blurbs__bubble--in">···</span>
          </>
        )}
        <span className="ppd-blurbs__bubble ppd-blurbs__bubble--primary ppd-blurbs__bubble--in">
          gm ☀️ new mix drops Friday
        </span>
      </span>
      <span className="ppd-blurbs__footer">
        <span className="ppd-blurbs__trail" />
        Open Blurbs
      </span>
    </div>
  );
}

const BUBBLE_FACES = [`${ASSET}/peer-06-june-rossi.jpg`, `${ASSET}/peer-01-kenji-sato.jpg`, `${ASSET}/peer-05-lyra-bloom.jpg`];

/** App `BubblePodCard` (`bentoFill` + `bentoCompact`): energy gradient, 72px emoji orb, faces top-trailing, name + count. */
function BubblePod() {
  return (
    <div className="ppd-bubble">
      <span className="ppd-bubble__backdrop" />
      <span className="ppd-bubble__scrim" />
      <span className="ppd-bubble__orb">🌊</span>
      <span className="ppd-bubble__members">
        {BUBBLE_FACES.map((src, i) => (
          <span key={src} className="ppd-bubble__face" style={{ zIndex: 10 - i, marginLeft: i === 0 ? 0 : -8 }}>
            <img src={src} alt="" draggable={false} loading="lazy" decoding="async" />
          </span>
        ))}
        <span className="ppd-bubble__more">+125</span>
      </span>
      <span className="ppd-bubble__body">
        <span className="ppd-bubble__name">Night Swim Club</span>
        <span className="ppd-bubble__meta">128 members</span>
      </span>
    </div>
  );
}

/** App `PagePodCard` (no cover): 15/600 title, 12px excerpt, "Open page" footer. */
function PagePod() {
  return (
    <div className="ppd-page">
      <span className="ppd-page__title">How I build a set</span>
      <span className="ppd-page__excerpt">
        Crates, cue points and the three tracks I always keep in my back pocket for the last hour.
      </span>
      <span className="ppd-page__footer">
        <span aria-hidden>📄</span>
        Open page
      </span>
    </div>
  );
}

/** Face for one pod at a given cell size. `compact` = the app's small-cell rules (Spine Book-only, Blurbs one bubble). */
export function PodFace({ id, size, animate }: { id: PodId; size: PodSize; animate: boolean }) {
  const compact = size === "small";
  switch (id) {
    case "music":
      return <MusicPod />;
    case "gallery":
      return <GalleryPod animate={animate} />;
    case "location":
      return <LocationPod />;
    case "spine":
      return <SpinePod compact={compact} />;
    case "blurbs":
      return <BlurbsPod compact={compact || size === "v2"} />;
    case "bubble":
      return <BubblePod />;
    case "page":
      return <PagePod />;
  }
}

import { cn, useTheme } from "@jokuh/gooey";
import { CalendarCheck, Image as ImageIcon, Link2, MapPin, MessageCircle, Music2, type LucideIcon } from "lucide-react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { PROFILE_DEMO_HERO_AGENT, PROFILE_DEMO_PLACEHOLDER } from "../../lib/profile-demo-identity";
import { IdPodSquircleShell } from "./IdPodSquircleShell";

/**
 * **Purpose:** `/profile` demo of the profile pod system — your ID pod on top, six companion pods that fly in, snap
 * together and keep re-arranging like Lego, so visitors see the bento before they claim a handle.
 * **Connects to:** `ProfileImmersiveShell`, `profile-demo-identity.ts`, `/public/pods-bento/*` art,
 * `styles/landing-profile-pods-demo.css`. App equivalent: profile pod bento (`ProfilePodBentoGrid`).
 * Pauses while hovered/focused or the tab is hidden; static under reduced motion.
 */

type PodId = "gallery" | "music" | "blurbs" | "links" | "location" | "book";
type Cell = { c: number; r: number; w: number; h: number };
type Layout = Record<PodId, Cell>;

/** Three full 4×3 arrangements — every cell covered, so the grid never shows holes mid-shuffle. */
const LAYOUTS: Layout[] = [
  {
    gallery: { c: 1, r: 1, w: 2, h: 2 },
    music: { c: 3, r: 1, w: 2, h: 1 },
    blurbs: { c: 3, r: 2, w: 1, h: 1 },
    links: { c: 4, r: 2, w: 1, h: 1 },
    location: { c: 1, r: 3, w: 2, h: 1 },
    book: { c: 3, r: 3, w: 2, h: 1 },
  },
  {
    music: { c: 1, r: 1, w: 2, h: 1 },
    location: { c: 3, r: 1, w: 2, h: 2 },
    book: { c: 1, r: 2, w: 2, h: 1 },
    gallery: { c: 1, r: 3, w: 1, h: 1 },
    blurbs: { c: 2, r: 3, w: 1, h: 1 },
    links: { c: 3, r: 3, w: 2, h: 1 },
  },
  {
    blurbs: { c: 1, r: 1, w: 2, h: 1 },
    links: { c: 3, r: 1, w: 1, h: 1 },
    music: { c: 4, r: 1, w: 1, h: 1 },
    book: { c: 1, r: 2, w: 2, h: 1 },
    location: { c: 1, r: 3, w: 2, h: 1 },
    gallery: { c: 3, r: 2, w: 2, h: 2 },
  },
];

const POD_ORDER: PodId[] = ["gallery", "music", "blurbs", "links", "location", "book"];
const SHUFFLE_MS = 3200;

const POD_META: Record<PodId, { label: string; icon: LucideIcon }> = {
  gallery: { label: "Gallery", icon: ImageIcon },
  music: { label: "Music", icon: Music2 },
  blurbs: { label: "Blurbs", icon: MessageCircle },
  links: { label: "Links", icon: Link2 },
  location: { label: "Location", icon: MapPin },
  book: { label: "Book", icon: CalendarCheck },
};

/** Where each pod starts before it snaps in — scattered and tilted, like loose bricks. */
const SCATTER: Record<PodId, { x: number; y: number; rotate: number }> = {
  gallery: { x: -90, y: -40, rotate: -10 },
  music: { x: 110, y: -60, rotate: 9 },
  blurbs: { x: 60, y: 30, rotate: -14 },
  links: { x: 140, y: 50, rotate: 12 },
  location: { x: -120, y: 80, rotate: 8 },
  book: { x: 90, y: 110, rotate: -7 },
};

function PodLabel({ id }: { id: PodId }) {
  const { label, icon: Icon } = POD_META[id];
  return (
    <span className="profile-pods-demo__label">
      <Icon className="size-3" strokeWidth={2.2} aria-hidden />
      {label}
    </span>
  );
}

function ArtPod({ src, id }: { src: string; id: PodId }) {
  return (
    <>
      <img src={src} alt="" aria-hidden draggable={false} loading="lazy" className="profile-pods-demo__art" />
      <PodLabel id={id} />
    </>
  );
}

function MusicPod({ wide }: { wide: boolean }) {
  return (
    <div className="profile-pods-demo__music">
      <span className="profile-pods-demo__album" aria-hidden />
      {wide ? (
        <span className="profile-pods-demo__track">
          <span className="profile-pods-demo__track-title">On repeat</span>
          <span className="profile-pods-demo__track-sub">Your top song</span>
        </span>
      ) : null}
      <span className="profile-pods-demo__eq" aria-hidden>
        <i />
        <i />
        <i />
        <i />
      </span>
      <PodLabel id="music" />
    </div>
  );
}

function BlurbsPod({ wide }: { wide: boolean }) {
  return (
    <div className="profile-pods-demo__blurbs">
      <span className="profile-pods-demo__bubble">{wide ? "gm, who's around this weekend?" : "gm ☀️"}</span>
      {wide ? <span className="profile-pods-demo__bubble profile-pods-demo__bubble--reply">I'm in 🙌</span> : null}
      <PodLabel id="blurbs" />
    </div>
  );
}

function BookPod({ wide }: { wide: boolean }) {
  return (
    <div className="profile-pods-demo__book">
      <span className="profile-pods-demo__book-title">{wide ? "Book a session" : "Book"}</span>
      <span className="profile-pods-demo__slots" aria-hidden>
        <span>Thu 3 pm</span>
        {wide ? <span>Fri 10 am</span> : null}
      </span>
      <PodLabel id="book" />
    </div>
  );
}

function PodBody({ id, cell, theme }: { id: PodId; cell: Cell; theme: "light" | "dark" }) {
  const wide = cell.w > 1;
  switch (id) {
    case "gallery":
      return <ArtPod id="gallery" src="/pods-bento/bento-art.png" />;
    case "location":
      return <ArtPod id="location" src="/pods-bento/bento-maps.png" />;
    case "links":
      return (
        <ArtPod
          id="links"
          src={theme === "light" ? "/pods-bento/bento-github.png" : "/pods-bento/bento-github-dark.png"}
        />
      );
    case "music":
      return <MusicPod wide={wide} />;
    case "blurbs":
      return <BlurbsPod wide={wide} />;
    case "book":
      return <BookPod wide={wide} />;
  }
}

function useShuffle(enabled: boolean, paused: boolean) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!enabled || paused) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setIndex((i) => (i + 1) % LAYOUTS.length);
    }, SHUFFLE_MS);
    return () => window.clearInterval(id);
  }, [enabled, paused]);
  return index;
}

export function ProfilePodsDemo({ className, footer }: { className?: string; footer?: ReactNode }) {
  const reduceMotion = useReducedMotion() ?? false;
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";
  const [paused, setPaused] = useState(false);
  const layoutIndex = useShuffle(!reduceMotion, paused);
  const layout = LAYOUTS[layoutIndex];
  const gridRef = useRef<HTMLDivElement>(null);
  const spring = useMemo(() => ({ type: "spring" as const, stiffness: 340, damping: 30, mass: 0.9 }), []);

  return (
    <div className={cn("profile-pods-demo", className)}>
      <IdPodSquircleShell contentClassName="p-[16px]">
        <div className="profile-pods-demo__id">
          <img src={PROFILE_DEMO_HERO_AGENT.avatarPath} alt="Example profile portrait" className="profile-pods-demo__avatar" />
          <div className="min-w-0">
            <p className="profile-pods-demo__name">{PROFILE_DEMO_PLACEHOLDER.displayName}</p>
            <p className="profile-pods-demo__handle">{PROFILE_DEMO_PLACEHOLDER.handle}</p>
          </div>
        </div>
      </IdPodSquircleShell>

      <LayoutGroup>
        <div
          ref={gridRef}
          className="profile-pods-demo__grid"
          role="img"
          aria-label="Profile pods for gallery, music, blurbs, links, location and bookings, rearranging on a grid"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
        >
          {POD_ORDER.map((id, i) => {
            const cell = layout[id];
            const scatter = SCATTER[id];
            return (
              <motion.div
                key={id}
                layout={!reduceMotion}
                className={cn("profile-pods-demo__pod", `profile-pods-demo__pod--${id}`)}
                style={{ gridColumn: `${cell.c} / span ${cell.w}`, gridRow: `${cell.r} / span ${cell.h}` }}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.7, x: scatter.x, y: scatter.y, rotate: scatter.rotate }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
                transition={{ ...spring, delay: reduceMotion ? 0 : 0.15 + i * 0.07, layout: spring }}
              >
                <PodBody id={id} cell={cell} theme={theme} />
              </motion.div>
            );
          })}
        </div>
      </LayoutGroup>

      {footer}
    </div>
  );
}

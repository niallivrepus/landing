import { cn, createSquirclePath, useTheme } from "@jokuh/gooey";
import { CalendarCheck, Image as ImageIcon, Link2, MapPin, MessageCircle, Music2, type LucideIcon } from "lucide-react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ProfilePodPanel } from "./ProfilePodPanel";

/**
 * **Purpose:** `/profile` demo of the profile pod system — the real demo ID pod in the center and six companion pods
 * that fly in, snap around it and keep re-arranging like Lego, so visitors see the bento before they claim a handle.
 * Wide: 3 columns (pods | ID pod | pods), 4 rows, one tall pod per side. Narrow: ID pod on top, pods in a 3×2 grid.
 * **Connects to:** `ProfileImmersiveShell`, `profile-demo-identity.ts`, `/public/pods-bento/*` art,
 * `styles/landing-profile-pods-demo.css`. App equivalent: profile pod bento (`ProfilePodBentoGrid`).
 * Pauses while hovered/focused or the tab is hidden; static under reduced motion.
 */

type PodId = "gallery" | "music" | "blurbs" | "links" | "location" | "book";
type Cell = { c: number; r: number; w: number; h: number };
type Layout = Record<PodId, Cell>;

/** Wide: columns 1 and 3 around the ID pod (column 2, rows 1–4); each side = one 2-row pod + two 1-row pods. */
const WIDE_LAYOUTS: Layout[] = [
  {
    gallery: { c: 1, r: 1, w: 1, h: 2 },
    music: { c: 1, r: 3, w: 1, h: 1 },
    blurbs: { c: 1, r: 4, w: 1, h: 1 },
    book: { c: 3, r: 1, w: 1, h: 1 },
    location: { c: 3, r: 2, w: 1, h: 2 },
    links: { c: 3, r: 4, w: 1, h: 1 },
  },
  {
    music: { c: 1, r: 1, w: 1, h: 1 },
    links: { c: 1, r: 2, w: 1, h: 1 },
    gallery: { c: 1, r: 3, w: 1, h: 2 },
    location: { c: 3, r: 1, w: 1, h: 2 },
    blurbs: { c: 3, r: 3, w: 1, h: 1 },
    book: { c: 3, r: 4, w: 1, h: 1 },
  },
  {
    blurbs: { c: 1, r: 1, w: 1, h: 1 },
    location: { c: 1, r: 2, w: 1, h: 2 },
    book: { c: 1, r: 4, w: 1, h: 1 },
    gallery: { c: 3, r: 1, w: 1, h: 2 },
    music: { c: 3, r: 3, w: 1, h: 1 },
    links: { c: 3, r: 4, w: 1, h: 1 },
  },
];

/** Narrow: ID pod spans row 1; pods swap places in a 3×2 grid on rows 2–3. */
const NARROW_LAYOUTS: Layout[] = [
  {
    gallery: { c: 1, r: 2, w: 1, h: 1 },
    music: { c: 2, r: 2, w: 1, h: 1 },
    blurbs: { c: 3, r: 2, w: 1, h: 1 },
    links: { c: 1, r: 3, w: 1, h: 1 },
    location: { c: 2, r: 3, w: 1, h: 1 },
    book: { c: 3, r: 3, w: 1, h: 1 },
  },
  {
    location: { c: 1, r: 2, w: 1, h: 1 },
    gallery: { c: 2, r: 2, w: 1, h: 1 },
    book: { c: 3, r: 2, w: 1, h: 1 },
    music: { c: 1, r: 3, w: 1, h: 1 },
    links: { c: 2, r: 3, w: 1, h: 1 },
    blurbs: { c: 3, r: 3, w: 1, h: 1 },
  },
  {
    blurbs: { c: 1, r: 2, w: 1, h: 1 },
    links: { c: 2, r: 2, w: 1, h: 1 },
    music: { c: 3, r: 2, w: 1, h: 1 },
    book: { c: 1, r: 3, w: 1, h: 1 },
    gallery: { c: 2, r: 3, w: 1, h: 1 },
    location: { c: 3, r: 3, w: 1, h: 1 },
  },
];

const WIDE_QUERY = "(min-width: 760px)";

function useIsWide() {
  const [wide, setWide] = useState(() => (typeof window === "undefined" ? true : window.matchMedia(WIDE_QUERY).matches));
  useEffect(() => {
    const mq = window.matchMedia(WIDE_QUERY);
    const onChange = () => setWide(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return wide;
}

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

const POD_CORNER_RADIUS = 26;

/**
 * True superellipse for each pod (same `createSquirclePath` the ID pod's `SquircleShell` uses): the path clips the
 * pod's content and a matching SVG stroke draws the rim, so photos and fills get real squircle corners in every
 * browser (CSS `corner-shape` only works in very new Chrome). Re-measures when the shuffle resizes the pod.
 */
function SquirclePod({ children, radius = POD_CORNER_RADIUS }: { children: ReactNode; radius?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const measure = () => setSize({ w: node.offsetWidth, h: node.offsetHeight });
    measure();
    if (typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const path = useMemo(
    () =>
      size.w > 0 && size.h > 0
        ? createSquirclePath({ width: size.w, height: size.h, cornerRadius: Math.min(radius, size.w / 2, size.h / 2), cornerSmoothing: 1 })
        : "",
    [radius, size.h, size.w],
  );

  return (
    <div ref={ref} className="profile-pods-demo__squircle">
      <div className="profile-pods-demo__fill" style={path ? { clipPath: `path('${path}')` } : { borderRadius: radius }}>
        {children}
      </div>
      {path ? (
        <svg className="profile-pods-demo__rim" viewBox={`0 0 ${size.w} ${size.h}`} aria-hidden focusable="false">
          <path d={path} />
        </svg>
      ) : null}
    </div>
  );
}

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

function useShuffle(enabled: boolean, paused: boolean, count: number) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!enabled || paused) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setIndex((i) => (i + 1) % count);
    }, SHUFFLE_MS);
    return () => window.clearInterval(id);
  }, [enabled, paused, count]);
  return index;
}

export function ProfilePodsDemo({ className, footer }: { className?: string; footer?: ReactNode }) {
  const reduceMotion = useReducedMotion() ?? false;
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";
  const wide = useIsWide();
  const layouts = wide ? WIDE_LAYOUTS : NARROW_LAYOUTS;
  const [paused, setPaused] = useState(false);
  const layoutIndex = useShuffle(!reduceMotion, paused, layouts.length);
  const layout = layouts[layoutIndex % layouts.length];
  const spring = useMemo(() => ({ type: "spring" as const, stiffness: 340, damping: 30, mass: 0.9 }), []);

  return (
    <div className={cn("profile-pods-demo", wide ? "profile-pods-demo--wide" : "profile-pods-demo--narrow", className)}>
      <LayoutGroup>
        <div
          className="profile-pods-demo__stage"
          role="group"
          aria-label="Example profile: an ID pod with gallery, music, blurbs, links, location and booking pods rearranging around it"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
        >
          <motion.div
            className="profile-pods-demo__id"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProfilePodPanel showActions={false} />
          </motion.div>

          <div className="profile-pods-demo__pods">
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
                  transition={{ ...spring, delay: reduceMotion ? 0 : 0.35 + i * 0.07, layout: spring }}
                >
                  <SquirclePod>
                    <PodBody id={id} cell={cell} theme={theme} />
                  </SquirclePod>
                </motion.div>
              );
            })}
          </div>
        </div>
      </LayoutGroup>

      {footer}
    </div>
  );
}

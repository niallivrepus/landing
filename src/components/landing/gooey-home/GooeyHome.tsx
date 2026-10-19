import { useTheme } from "@jokuh/gooey";
import { Fingerprint, Lock, ShieldCheck } from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { resolveRigidNavColumns } from "../../../config/site-subdomains";
import { LANDING_HERO_HEADLINE } from "../../../data/landing-hero-copy";
import { RIGID_NAV_COLUMNS } from "../../../data/rigid-sitemap";
import { GetJokuhButton, GetJokuhSheet, PlatformLinks } from "./GetJokuh";
import { GooHero } from "./GooHero";
import { GooScrollMerge } from "./GooScrollMerge";
import { GOO_FEATURES, type GooFeature } from "./gooey-home-content";
import type { GooScheme } from "./goo-kit";
import { JokuhOO } from "../../brand/JokuhOO";
import { SiteLink } from "../../SiteLink";
import "../../../styles/gooey-home.css";

export const GOOEY_HOME_VALUE_LINE =
  "Calls, texts, your memories and your money, in one private app. OO, your own AI, helps with all of it.";

/** Adds `is-in` to `.gh-reveal` children as they enter (one observer for the page). Reduce Motion: shown at once (CSS). */
function useReveal(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    const items = Array.from(el.querySelectorAll<HTMLElement>(".gh-reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  }, [root]);
}

function Shot({ name, alt, eager }: { name: string; alt: string; eager?: boolean }) {
  const loading = eager ? "eager" : "lazy";
  return (
    <figure className="gh-phone">
      {/* Both themes are in the page; CSS shows one, and a hidden lazy image is never fetched. */}
      <img className="gh-phone__img gh-only-dark" src={`/gooey-home/captures/${name}-dark.webp`} alt={alt} width={360} height={780} loading={loading} decoding="async" />
      <img className="gh-phone__img gh-only-light" src={`/gooey-home/captures/${name}-light.webp`} alt={alt} width={360} height={780} loading={loading} decoding="async" />
    </figure>
  );
}

const GooOopolisLive = lazy(() => import("./GooOopolisLive"));

/**
 * The live OOpolis, loaded when the section is within ~600 px of the viewport; until then (and while its chunk loads)
 * the static capture holds the space.
 */
function LiveOopolis({ scheme, name, alt }: { scheme: GooScheme; name: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return undefined;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setNear(true);
        io.disconnect();
      }
    }, { rootMargin: "600px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [near]);
  const still = <Shot name={name} alt={alt} />;
  return (
    <div ref={ref}>
      {near ? (
        <Suspense fallback={still}>
          <GooOopolisLive scheme={scheme} alt={alt} />
        </Suspense>
      ) : (
        still
      )}
    </div>
  );
}

function FeatureSection({ f, index, scheme }: { f: GooFeature; index: number; scheme: GooScheme }) {
  return (
    <section id={f.id} className={`gh-feature ${index % 2 ? "gh-feature--flip" : ""}`} aria-labelledby={`gh-${f.id}-title`} style={{ "--gh-accent": f.accent } as React.CSSProperties}>
      <div className="gh-feature__copy gh-reveal">
        <div className="gh-eyebrow gh-slab gh-slab--pill">
          {f.id === "oo" ? <JokuhOO size={20} /> : <span aria-hidden className="gh-eyebrow__dot" />}
          {f.corner}
        </div>
        <h2 id={`gh-${f.id}-title`} className="gh-feature__title">
          {f.title}
        </h2>
        <p className="gh-feature__body">{f.body}</p>
        <ul className="gh-feature__points">
          {f.points.map((p) => (
            <li key={p} className="gh-slab gh-slab--pill">
              {p}
            </li>
          ))}
        </ul>
        {f.learnMore ? (
          <SiteLink className="gh-link" href={f.learnMore.href}>
            {f.learnMore.label} <span aria-hidden>→</span>
          </SiteLink>
        ) : null}
      </div>
      <div className="gh-feature__media">
        <div className={`gh-feature__shots gh-feature__shots--${f.shots.length}`}>
          {f.shots.map((s, i) => (
            <div key={s.name} className="gh-reveal gh-reveal--squish" style={{ transitionDelay: `${i * 90}ms` }}>
              {f.live === "oopolis" ? <LiveOopolis scheme={scheme} name={s.name} alt={s.alt} /> : <Shot name={s.name} alt={s.alt} />}
            </div>
          ))}
        </div>
        <p className="gh-feature__caption">{f.live ? "Jokuh's Gooey design, animated with demo data." : "Jokuh's Gooey design, shown with demo data."}</p>
      </div>
    </section>
  );
}

const TRUST = [
  {
    icon: <Lock size={20} strokeWidth={1.8} aria-hidden />,
    title: "End-to-end encrypted messages",
    body: "Direct and group chats are sealed from the first message. Only the people in the chat can read them.",
  },
  {
    icon: <Fingerprint size={20} strokeWidth={1.8} aria-hidden />,
    title: "Sign in with a passkey",
    body: "Your face or fingerprint unlocks Jokuh. There's no password to steal or phish.",
  },
  {
    icon: <ShieldCheck size={20} strokeWidth={1.8} aria-hidden />,
    title: "A privacy-first wallet",
    body: "Zcash and Monero come first, and your private balance stays hidden until you choose to see it.",
  },
];

const FOOTER_COLUMNS = resolveRigidNavColumns(RIGID_NAV_COLUMNS, "footer");

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const options = [
    { value: "auto", label: "Auto" },
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
  ] as const;
  return (
    <div className="gh-theme gh-slab gh-slab--pill" role="radiogroup" aria-label="Theme">
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

function GooFooter() {
  const seen = new Set<string>();
  return (
    <footer className="gh-footer" aria-label="Site">
      <div className="gh-footer__inner gh-slab">
        <div className="gh-footer__cols">
          {FOOTER_COLUMNS.map((col) => (
            <nav key={col.id} aria-label={col.heading} className="gh-footer__col">
              <p className="gh-footer__head">{col.heading}</p>
              <ul>
                {col.sections
                  .flatMap((s) => s.links)
                  .filter((l) => {
                    const k = `${col.id}:${l.href}`;
                    if (seen.has(k)) return false;
                    seen.add(k);
                    return true;
                  })
                  .map((l) => (
                    <li key={l.href + l.label}>
                      <SiteLink href={l.href}>{l.label}</SiteLink>
                    </li>
                  ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="gh-footer__base">
          <p>© {new Date().getFullYear()} Jokuh</p>
          <div className="gh-footer__social">
            <a href="https://x.com/jokuh" target="_blank" rel="noopener noreferrer">
              X
            </a>
            <a href="https://www.youtube.com/@jokuh" target="_blank" rel="noopener noreferrer">
              YouTube
            </a>
            <button type="button" className="gh-footer__cookies" onClick={() => window.dispatchEvent(new Event("jokuh-open-cookies"))}>
              Cookies
            </button>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}

/**
 * **Purpose:** The Gooey homepage (`/`): the app's home on the web (goo corner frame, Nexus, frozen Glyph mark,
 * "Ask OO…" with the live signed-out OO chat, Get Jokuh), then one section per pillar with real Gooey screens, an
 * accurate trust strip, a closing CTA and the site footer. Mobile-first; no heavy JS on first paint (goo loops run
 * only while something moves and is on screen; captures are lazy WebP).
 * **Connects to:** `pages/Home.tsx`, `gooey-home-content.ts`, `styles/gooey-home.css`, `GooHero`, `GooScrollMerge`.
 */
export function GooeyHome() {
  const { resolvedTheme } = useTheme();
  const scheme: GooScheme = resolvedTheme === "light" ? "light" : "dark";
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);

  return (
    <div ref={root} className="gh" data-scheme={scheme}>
      <GooHero scheme={scheme} headline={LANDING_HERO_HEADLINE} valueLine={GOOEY_HOME_VALUE_LINE} />

      <GooScrollMerge scheme={scheme} />

      <div className="gh-intro gh-reveal">
        <h2 className="gh-intro__title">Everything you do with your people, in one place.</h2>
        <p className="gh-intro__body">Four corners, one column, like the app. Tap a corner above to jump in.</p>
      </div>

      {GOO_FEATURES.map((f, i) => (
        <FeatureSection key={f.id} f={f} index={i} scheme={scheme} />
      ))}

      <section className="gh-trust" aria-labelledby="gh-trust-title">
        <h2 id="gh-trust-title" className="gh-trust__title gh-reveal">
          Private by design.
        </h2>
        <div className="gh-trust__grid">
          {TRUST.map((t, i) => (
            <article key={t.title} className="gh-trust__card gh-slab gh-reveal gh-reveal--squish" style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="gh-trust__icon gh-bead">{t.icon}</span>
              <h3>{t.title}</h3>
              <p>{t.body}</p>
            </article>
          ))}
        </div>
        <p className="gh-trust__fine gh-reveal">
          End-to-end encryption covers direct and group messages. See exactly what is and isn't covered on our{" "}
          <SiteLink href="/security">security</SiteLink> and <SiteLink href="/privacy">privacy</SiteLink> pages.
        </p>
      </section>

      <GooScrollMerge scheme={scheme} tint="go" />

      <section className="gh-final gh-reveal" aria-labelledby="gh-final-title">
        <JokuhOO size={64} label="OO" />
        <h2 id="gh-final-title" className="gh-final__title">
          Say hi to OO.
        </h2>
                <GetJokuhButton />
        <PlatformLinks />
      </section>

      <GooFooter />
      <GetJokuhSheet />
    </div>
  );
}

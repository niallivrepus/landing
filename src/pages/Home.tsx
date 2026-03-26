import {
  Button,
  InteractivePromptBar,
  PillWheel,
  cn,
} from "@jokuh/gooey";
import { MegaFooter } from "../components/MegaFooter";
import { SiteTopBar } from "../components/SiteTopBar";
import { TopNavAnchor } from "../components/TopNavAnchor";
import { motion, useScroll, useTransform } from "motion/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import { CookieBanner } from "../components/CookieBanner";
import { ExplainerTriad } from "../components/ExplainerTriad";
import { NewsCardArt } from "../components/NewsCardArt";
import { FUNDERS } from "../data/funders";
import { HOME_STORIES } from "../data/home-stories";
import { DEFAULT_NEWS_CARD_GRADIENT, NEWS_ITEMS, formatNewsDate } from "../data/news";
const IDENTITY_WHEEL_FACE =
  "?w=128&h=128&fit=crop&crop=faces&auto=format&q=80";
const IDENTITY_WHEEL_AVATARS = [
  `https://images.unsplash.com/photo-1494790108377-be9c29b29330${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1438761681033-6461ffad8d80${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1544005313-94ddf0286ad2${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1500648767791-00dcc994a43e${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1534528741775-53994a69daeb${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1524504388940-b1c1722653e1${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1506794778202-cad84cf45f1d${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1517841905240-472988babdf9${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1539578708538-e09bc6d2e4b5${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1520813792240-56fc4a3765a7${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1489424731084-a5d8b219a853${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1488426862026-3ee34a7d66df${IDENTITY_WHEEL_FACE}`,
].map((src) => ({ src, alt: "" }));

function ClaimIdentityCta({
  href,
  children = "Claim identity",
  className,
}: {
  href: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex h-[50px] shrink-0 items-center justify-center rounded-full border-2 border-white/25 bg-white px-8 font-sans text-sm font-bold text-black",
        "shadow-[0px_1px_0px_rgba(255,255,255,0.6)_inset,0px_10px_28px_rgba(0,0,0,0.35)]",
        "transition-[transform,box-shadow,background-color,border-color] duration-200 hover:border-white/40 hover:bg-zinc-100 active:scale-[0.98]",
        className,
      )}
    >
      {children}
    </a>
  );
}

function GooeyBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <svg className="absolute h-0 w-0" aria-hidden>
        <defs>
          <filter id="landing-gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>
      <div
        className="absolute left-1/2 top-[8%] h-[min(480px,80vw)] w-[min(480px,80vw)] -translate-x-1/2 opacity-[0.22]"
        style={{ filter: "url(#landing-gooey)" }}
      >
        <motion.div
          className="absolute left-[10%] top-[18%] size-[48%] rounded-full bg-purple-5/45"
          animate={{ x: [0, 20, 0], y: [0, -14, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[6%] top-[30%] size-[44%] rounded-full bg-blue-5/40"
          animate={{ x: [0, -16, 0], y: [0, 18, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[8%] left-[26%] size-[36%] rounded-full bg-pink-5/35"
          animate={{ x: [0, -12, 0], y: [0, 12, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
      <div className="landing-grain absolute inset-0 opacity-[0.04]" aria-hidden />
    </div>
  );
}

const HERO_QUICK_LINKS: { label: string; href: string }[] = [
  { label: "Learn about Jokuh Pods", href: "/pods" },
  { label: "Search with Jokuh", href: "/#prompt" },
  { label: "Talk with Jokuh", href: "/#prompt" },
  { label: "Explore the Spine", href: "/spine" },
  { label: "Research", href: "/research" },
  { label: "V1llains lab", href: "/ecosystem/v1llains" },
  { label: "More", href: "/journal" },
];

/** Single-row pills with horizontal scroll + edge fades (gooey PromptCategories pattern). */
function HeroQuickPills({ items }: { items: { label: string; href: string }[] }) {
  const scrollRef = useRef<HTMLElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [fadePx, setFadePx] = useState(32);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
    const w = el.clientWidth;
    setFadePx(w < 340 ? 56 : w < 400 ? 48 : w < 520 ? 40 : 32);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateScrollState]);

  const f = fadePx;
  const maskImage =
    canScrollLeft && canScrollRight
      ? `linear-gradient(to right, transparent, black ${f}px, black calc(100% - ${f}px), transparent)`
      : canScrollRight
        ? `linear-gradient(to right, black, black calc(100% - ${f}px), transparent)`
        : canScrollLeft
          ? `linear-gradient(to right, transparent, black ${f}px, black)`
          : undefined;

  return (
    <nav
      ref={scrollRef}
      onScroll={updateScrollState}
      aria-label="Quick links"
      className={cn(
        "w-full max-w-[min(calc(100vw-2.5rem),400px)] overflow-x-auto overscroll-x-contain",
        "snap-x snap-mandatory scroll-pl-3 scroll-pr-3 sm:scroll-pl-4 sm:scroll-pr-4",
        "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
      )}
      style={{
        WebkitMaskImage: maskImage,
        maskImage,
      }}
    >
      <div className="flex w-max min-w-full justify-start gap-1.5 px-1 sm:justify-center sm:gap-2 sm:px-0">
        {items.map((item) => (
          <TopNavAnchor
            key={item.label}
            href={item.href}
            className={cn(
              "snap-start shrink-0 rounded-full border border-white/[0.07] bg-light-glass-5 px-3 py-1.5 font-sans text-xs font-medium whitespace-nowrap text-light-space backdrop-blur-[25px] transition-colors",
              "sm:px-4 sm:py-2 sm:text-sm",
              "hover:bg-light-glass-10",
            )}
          >
            {item.label}
          </TopNavAnchor>
        ))}
      </div>
    </nav>
  );
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const heroFade = useTransform(scrollYProgress, [0, 0.5], [1, 0.25]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -16]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col px-4 pt-24 pb-12 md:px-8 md:pt-28 md:pb-16"
    >
      <motion.div
        style={{ opacity: heroFade, y: heroY }}
        className="flex flex-1 flex-col items-center justify-center gap-10 px-1 md:gap-12"
      >
        <h1 className="max-w-[min(94vw,52ch)] text-center font-sans text-[2.75rem] font-light leading-[1.08] tracking-[-0.03em] text-white sm:text-[3.25rem] md:text-[4.5rem] md:leading-[1.05] lg:text-[5.75rem] lg:leading-[1.02]">
          Your thinking is the product.
        </h1>

        <div
          id="prompt"
          className="flex w-full max-w-[min(calc(100vw-2.5rem),400px)] flex-col items-center scroll-mt-32"
        >
          <div className="w-full">
            <InteractivePromptBar
              variant="desktop"
              className="!w-full !max-w-none"
              previewText="Plan my week from every thread I'm connected to"
            />
          </div>
        </div>

        <HeroQuickPills items={HERO_QUICK_LINKS} />
      </motion.div>
    </section>
  );
}

function FundersStrip() {
  return (
    <section
      className="border-t border-white/[0.07] bg-black px-5 py-10 md:px-8 md:py-12"
      aria-label="Backed by"
    >
      <div className="mx-auto max-w-[1380px]">
        <p className="mb-6 text-center font-mono text-[11px] tracking-[0.28em] text-light-space/35 uppercase md:text-left">
          Backed by
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:justify-start">
          {FUNDERS.map((f) => (
            <li key={f.name}>
              <a
                href={f.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm font-medium text-white/60 transition-colors hover:text-white/90 md:text-[15px]"
              >
                {f.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function StoryTileImage({
  primary,
  fallback,
}: {
  primary: string;
  fallback?: string;
}) {
  const [src, setSrc] = useState(primary);
  return (
    <img
      src={src}
      alt=""
      className="size-full object-cover brightness-[0.82] contrast-[1.06] saturate-[0.72] transition-[transform,filter] duration-300 ease-out group-hover:scale-[1.03] group-hover:brightness-[0.88] group-hover:saturate-[0.78]"
      loading="lazy"
      decoding="async"
      onError={() => {
        if (fallback && src !== fallback) setSrc(fallback);
      }}
    />
  );
}

function StoriesSection() {
  return (
    <section
      id="stories"
      className="scroll-mt-24 border-t border-white/[0.07] bg-black px-5 py-16 md:px-8 md:py-20"
    >
      <div className="mx-auto max-w-[1380px]">
        <div className="mb-10 flex items-baseline justify-between gap-6 md:mb-12">
          <h2 className="font-sans text-lg font-normal tracking-tight text-white/90 md:text-xl">Stories</h2>
          <Link
            to="/journal"
            className="shrink-0 font-sans text-sm text-white/50 transition-colors hover:text-white/80"
          >
            View all
          </Link>
        </div>
        <div className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          {HOME_STORIES.map((story) => (
            <TopNavAnchor key={story.title} href={story.href} className="group flex min-w-0 flex-1 flex-col">
              <div
                className={cn(
                  "relative aspect-square w-full shrink-0 overflow-hidden rounded-[2px] bg-zinc-950",
                  "ring-1 ring-white/[0.05] transition-[box-shadow,ring-color] duration-300 ease-out",
                  "group-hover:ring-white/[0.1] group-hover:shadow-[0_24px_48px_-20px_rgba(0,0,0,0.75)]",
                )}
              >
                <StoryTileImage primary={story.image} fallback={story.imageFallback} />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/25"
                  aria-hidden
                />
              </div>
              <p className="mt-3 text-left font-sans text-[13px] font-normal leading-snug tracking-wide text-white/50 md:text-[0.9375rem] md:tracking-normal md:text-white/55">
                {story.title}
              </p>
            </TopNavAnchor>
          ))}
        </div>
      </div>
    </section>
  );
}

type NewsRow = {
  id: string;
  title: string;
  category: string;
  date: string;
  href: string;
  gradient: string;
  image?: string;
};

function RecentNewsBentoCompact({
  row,
  className,
}: {
  row: NewsRow;
  className?: string;
}) {
  return (
    <TopNavAnchor
      href={row.href}
      className={cn(
        "group flex w-full max-w-[320px] flex-col overflow-hidden rounded-xl bg-white/[0.02] backdrop-blur-sm transition-colors hover:bg-white/[0.04] lg:max-w-none",
        className,
      )}
    >
      <div className="aspect-square w-full shrink-0" aria-hidden>
        <NewsCardArt gradient={row.gradient} image={row.image} />
      </div>
      <div className="flex flex-col gap-2 p-4 sm:p-4 sm:pt-3">
        <h3 className="line-clamp-3 font-sans text-[15px] font-semibold leading-snug tracking-tight text-white transition-opacity group-hover:opacity-90 sm:text-[15px]">
          {row.title}
        </h3>
        <p className="font-sans text-[13px] leading-snug">
          <span className="text-white">{row.category}</span>
          <span className="text-white/30"> · </span>
          <span className="text-white/45">{row.date}</span>
        </p>
      </div>
    </TopNavAnchor>
  );
}

function RecentNewsSection() {
  const rows = useMemo(
    () =>
      [...NEWS_ITEMS]
        .sort(
          (a, b) =>
            new Date(b.publishedAt + "T12:00:00").getTime() -
            new Date(a.publishedAt + "T12:00:00").getTime(),
        )
        .slice(0, 6)
        .map((n) => ({
          id: n.id,
          title: n.title,
          category: n.category,
          date: formatNewsDate(n.publishedAt),
          href: n.externalUrl ?? n.internalHref ?? "/journal",
          gradient: n.cardGradient?.trim() || DEFAULT_NEWS_CARD_GRADIENT,
          image: n.cardImage,
        })),
    [],
  );

  const featured = rows[0];
  const rest = rows.slice(1);

  return (
    <section id="journal" className="scroll-mt-24 bg-black px-5 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-[1380px]">
        <div className="mb-10 flex items-end justify-between gap-4">
          <h2 className="font-sans text-lg font-normal tracking-tight text-white md:text-xl">Journal</h2>
          <Link
            to="/journal"
            className="shrink-0 font-sans text-sm font-normal text-white transition-opacity hover:opacity-70"
          >
            View more
          </Link>
        </div>
        {featured ? (
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-6 xl:gap-8">
            <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
              <TopNavAnchor
                href={featured.href}
                className="group flex flex-col overflow-hidden rounded-2xl bg-zinc-950/60 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.9)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                <div className="aspect-square w-full shrink-0" aria-hidden>
                  <NewsCardArt gradient={featured.gradient} image={featured.image} />
                </div>
                <div className="flex flex-col gap-3 p-5 sm:p-6 sm:pt-5">
                  <h3 className="font-sans text-xl font-semibold leading-[1.15] tracking-tight text-white transition-opacity group-hover:opacity-90 sm:text-2xl lg:text-[1.65rem] lg:leading-snug">
                    {featured.title}
                  </h3>
                  <p className="font-sans text-sm leading-snug sm:text-[15px]">
                    <span className="text-white">{featured.category}</span>
                    <span className="text-white/30"> · </span>
                    <span className="text-white/45">{featured.date}</span>
                  </p>
                </div>
              </TopNavAnchor>
            </div>
            <div className="flex flex-col items-center gap-4 sm:gap-4 lg:w-[320px] lg:shrink-0 lg:items-stretch">
              {rest.slice(0, 5).map((row) => (
                <RecentNewsBentoCompact key={row.id} row={row} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function IdentityBlock() {
  return (
    <section
      id="identity"
      className="relative scroll-mt-24 overflow-hidden bg-black px-5 py-20 md:px-8 md:py-28"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      >
        <div className="origin-center scale-[0.58] opacity-[0.88] sm:scale-[0.68] md:scale-[0.82] lg:scale-[0.96]">
          <PillWheel avatars={IDENTITY_WHEEL_AVATARS} animationDuration={95} />
        </div>
        <div
          className="absolute inset-[-28%] bg-[radial-gradient(ellipse_55%_50%_at_50%_50%,transparent_0%,transparent_24%,rgba(0,0,0,0.55)_52%,#000_86%)]"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[min(72vh,560px)] max-w-4xl flex-col items-center justify-center text-center">
        <h2 className="font-sans text-[2.35rem] font-medium leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Own your handle before the next wave.
        </h2>
        <p className="mx-auto mt-5 line-clamp-2 max-w-[min(92vw,36rem)] font-sans text-[15px] leading-snug text-light-space/70 md:text-[17px] md:leading-snug">
          Small batches keep the graph human, claim a pass and go from anonymous to unmistakably you.
        </p>
        <div className="mt-9 flex w-full max-w-sm justify-center md:max-w-none">
          <ClaimIdentityCta href="/platform/identity" className="w-full justify-center md:w-auto" />
        </div>
      </div>
    </section>
  );
}

function Waitlist() {
  return (
    <section id="start" className="scroll-mt-24 px-5 pb-28 pt-8 md:px-8 md:pb-36">
      <motion.div
        className="mx-auto max-w-md border-t border-light-glass-10 pt-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-mono text-[11px] tracking-[0.28em] text-light-space/35 uppercase">
          Waitlist
        </p>
        <h2 className="mt-4 font-sans text-xl font-medium text-light-space md:text-2xl">
          Get a note when the next batch opens—including blurbs and drops tied to what we ship.
        </h2>
        <form
          className="mt-8 flex flex-col gap-3 md:flex-row md:items-stretch"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            required
            placeholder="Email"
            className="h-[50px] flex-1 rounded-full border-2 border-light-glass-20 bg-dark-glass-20 px-5 font-sans text-sm text-light-space placeholder:text-light-space/35 focus:border-light-glass-40 focus:outline-none"
          />
          <Button type="submit" variant="primary-neutral" size="xl" className="shrink-0 px-8">
            Notify me
          </Button>
        </form>
      </motion.div>
    </section>
  );
}

function PreFooterCta() {
  return (
    <section
      className="px-5 pb-6 md:px-8 md:pb-8"
      aria-labelledby="pre-footer-cta-heading"
    >
      <div className="mx-auto flex w-full max-w-[1380px] flex-col items-center justify-center rounded-lg bg-[#1a1a1a] px-5 py-20 md:py-[5rem]">
        <h2
          id="pre-footer-cta-heading"
          className="text-center font-sans text-2xl font-medium text-light-space md:text-3xl"
        >
          Get started with Jokuh
        </h2>
        <Link
          to="/download"
          className="mt-8 inline-flex h-11 min-w-[7.5rem] items-center justify-center rounded-full bg-[#333333] px-8 font-sans text-sm font-normal text-light-space transition-[background-color] duration-200 hover:bg-[#404040]"
        >
          Download
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="landing-cinema min-h-screen bg-black text-light-space">
      <GooeyBackdrop />
      <SiteTopBar />
      <main>
        <Hero />
        <ExplainerTriad />
        <FundersStrip />
        <RecentNewsSection />
        <StoriesSection />
        <IdentityBlock />
        <Waitlist />
      </main>
      <PreFooterCta />
      <MegaFooter />
      <CookieBanner />
    </div>
  );
}

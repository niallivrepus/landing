import { MegaFooter } from "../components/MegaFooter";
import { SiteTopBar } from "../components/SiteTopBar";
import { VortexMindMap } from "../components/VortexMindMap";
import { PRODUCT_PAGES } from "../data/product-pages";
import { PRODUCTS, type ProductId } from "../data/products";
import { PillWheel, cn, sampleAvatar } from "@jokuh/gooey";
import { Play } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

const SHELL = "mx-auto w-full max-w-[1380px] px-5 md:px-8 lg:px-10";

const WHEEL_AVATARS = Array.from({ length: 14 }, (_, i) => ({
  src: sampleAvatar(i + 1).src,
  alt: "",
}));

const accentCardStyles: Record<
  "green" | "blue" | "purple" | "rose",
  { icon: string; glow: string }
> = {
  green: {
    icon: "bg-gradient-to-br from-[#8cff19]/30 to-[#2a4d0a]/40",
    glow: "shadow-[0_0_24px_rgba(140,255,25,0.12)]",
  },
  blue: {
    icon: "bg-gradient-to-br from-sky-400/30 to-blue-900/40",
    glow: "shadow-[0_0_24px_rgba(56,189,248,0.12)]",
  },
  purple: {
    icon: "bg-gradient-to-br from-[#b18cff]/35 to-[#170047]/50",
    glow: "shadow-[0_0_24px_rgba(177,140,255,0.15)]",
  },
  rose: {
    icon: "bg-gradient-to-br from-pink-400/30 to-rose-900/40",
    glow: "shadow-[0_0_24px_rgba(244,114,182,0.12)]",
  },
};

function PurpleCta({ children, to }: { children: ReactNode; to: string }) {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex h-[50px] items-center justify-center rounded-full border-2 border-[#6729ec] bg-[#170047] px-6 font-sans text-base font-bold text-white",
        "shadow-[0_0_6px_rgba(135,40,255,0.6),0_0_25px_rgba(177,140,255,0.15)]",
        "transition-[transform,box-shadow] hover:shadow-[0_0_10px_rgba(135,40,255,0.75),0_0_32px_rgba(177,140,255,0.2)] active:scale-[0.98]",
      )}
    >
      {children}
    </Link>
  );
}

function GreenGlowLink({ children, to }: { children: ReactNode; to: string }) {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex h-[50px] items-center justify-center rounded-full border-2 border-[#8cff19] bg-[#0d1f06] px-5 font-sans text-base font-bold text-white",
        "shadow-[0_0_6px_rgba(140,255,25,0.45),0_0_22px_rgba(167,255,56,0.12)]",
        "transition-[transform,box-shadow] hover:brightness-110 active:scale-[0.98]",
      )}
    >
      {children}
    </Link>
  );
}

function SpotlightDecor({ productId }: { productId: ProductId }) {
  if (productId === "vortex") {
    return (
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 opacity-[0.35]"
        aria-hidden
      >
        <div className="origin-center scale-[0.42] md:scale-[0.5]">
          <PillWheel avatars={WHEEL_AVATARS} animationDuration={110} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="pointer-events-none absolute left-[2%] top-[8%] z-0 h-[min(52%,320px)] w-[22%] max-w-[150px] rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.08] to-black/50 shadow-[0_20px_60px_rgba(0,0,0,0.45)] md:left-[6%] md:max-w-none"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-[4%] top-[6%] z-0 h-[min(48%,300px)] w-[20%] max-w-[140px] rounded-[28px] border border-white/10 bg-gradient-to-b from-emerald-500/10 to-black/60 shadow-[0_20px_60px_rgba(0,0,0,0.45)] md:right-[8%]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[10%] left-[8%] z-0 h-[120px] w-[120px] rounded-[32px] border border-white/10 bg-[#121212] shadow-[0_16px_40px_rgba(0,0,0,0.5)] md:h-[150px] md:w-[150px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[8%] right-[10%] z-0 flex h-[100px] w-[min(72%,420px)] items-center gap-2 rounded-[24px] border border-white/10 bg-black/50 px-3 shadow-[0_16px_40px_rgba(0,0,0,0.45)] md:h-[120px]"
        aria-hidden
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="aspect-square flex-1 overflow-hidden rounded-xl border border-white/10 bg-white/5"
          >
            <img src={sampleAvatar(i + 3).src} alt="" className="size-full object-cover opacity-80" />
          </div>
        ))}
      </div>
      <div
        className="pointer-events-none absolute left-[28%] top-[38%] z-0 hidden h-[88px] w-[88px] rounded-[24px] border border-white/10 bg-gradient-to-br from-violet-500/20 to-black md:block"
        aria-hidden
      />
    </>
  );
}

export function ProductPage({ productId }: { productId: ProductId }) {
  const product = PRODUCTS[productId];
  const page = PRODUCT_PAGES[productId];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hiIdx, setHiIdx] = useState(0);

  useEffect(() => {
    const prev = document.title;
    document.title = `${product.title} — Jokuh`;
    return () => {
      document.title = prev;
    };
  }, [product.title]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.firstElementChild?.clientWidth ?? 360;
      const gap = 20;
      const i = Math.round(el.scrollLeft / (w + gap));
      setHiIdx(Math.min(Math.max(i, 0), page.highlightCards.length - 1));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [page.highlightCards.length]);

  return (
    <div className="landing-cinema min-h-screen bg-black font-sans text-white antialiased">
      <SiteTopBar />

      <main>
        <section className="pt-24 pb-10 md:pt-28 md:pb-16">
          <div className={cn(SHELL, "flex flex-col items-center text-center")}>
            <h1 className="max-w-[min(100%,645px)] text-[clamp(2.25rem,6vw,4.5rem)] font-bold leading-none tracking-[0.02em] text-[#dfdfdf]">
              <span className="block">{page.heroTitle[0]}</span>
              <span className="mt-1 block">{page.heroTitle[1]}</span>
            </h1>
            <p className="mt-8 max-w-[min(100%,645px)] font-sans text-[15px] leading-relaxed tracking-[-0.01em] text-white/40">
              {page.heroSubtitle}
            </p>
            <div className="mt-8">
              <PurpleCta to="/#start">Join Beta</PurpleCta>
            </div>
          </div>

          <div className={cn(SHELL, "mt-14 md:mt-20")}>
            <div className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-black shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
              <div className="relative aspect-[1086/1153] max-h-[70vh] w-full overflow-hidden">
                {productId === "vortex" ? (
                  <VortexMindMap className="h-full min-h-[320px]" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-[#1a1530] via-black to-[#0a1a12]" />
                )}
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(103,41,236,0.18),transparent_55%)]",
                    productId === "vortex" && "opacity-70",
                  )}
                />
                {productId !== "vortex" ? (
                  <div className="pointer-events-none absolute inset-x-[18%] bottom-[8%] top-[14%] rounded-[2.5rem] border border-white/10 bg-black/40 shadow-[0_0_80px_rgba(103,41,236,0.15)] backdrop-blur-sm" />
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06] py-16 md:py-24">
          <div className={SHELL}>
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <h2 className="font-sans text-[clamp(1.75rem,4vw,2.35rem)] font-medium leading-tight tracking-tight text-[#dfdfdf]">
                {page.highlightsTitle}
              </h2>
              <button
                type="button"
                className="inline-flex h-[50px] shrink-0 items-center gap-2 rounded-full border-2 border-white/15 bg-white/[0.06] px-5 font-sans text-[15px] font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/[0.1]"
              >
                <Play className="size-5 fill-white text-white" strokeWidth={0} />
                {page.highlightsAction}
              </button>
            </div>

            <div
              ref={scrollRef}
              className="mt-10 flex gap-5 overflow-x-auto pb-2 [scrollbar-width:thin] snap-x snap-mandatory md:mt-14 md:gap-6"
            >
              {page.highlightCards.map((c) => (
                <article
                  key={c.title}
                  className="min-w-[min(100%,360px)] shrink-0 snap-center rounded-[28px] border border-white/[0.08] bg-[#141414] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.35)] md:min-w-[340px] md:p-10"
                >
                  <p className="font-mono text-[11px] tracking-wider text-white/35 uppercase">{c.kicker}</p>
                  <h3 className="mt-3 font-sans text-xl font-semibold tracking-tight text-white md:text-2xl">
                    {c.title}
                  </h3>
                  <p className="mt-3 font-sans text-[15px] leading-relaxed text-white/45">{c.description}</p>
                </article>
              ))}
            </div>
            <div className="mt-8 flex justify-center gap-2">
              {page.highlightCards.map((c, i) => (
                <button
                  key={c.title}
                  type="button"
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => {
                    const el = scrollRef.current;
                    if (!el) return;
                    const card = el.children[i] as HTMLElement;
                    card?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                  }}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === hiIdx ? "w-8 bg-white" : "w-2 bg-white/25 hover:bg-white/40",
                  )}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className={SHELL}>
            <h2 className="mx-auto max-w-[740px] text-center font-sans text-[clamp(1.5rem,3.5vw,2.15rem)] font-medium leading-snug tracking-tight text-[#dfdfdf] md:text-3xl">
              {page.bentoTitle}
            </h2>

            <div className="mt-14 grid gap-4 lg:mt-20 lg:grid-cols-[minmax(0,420px)_1fr] lg:grid-rows-2">
              <div className="flex flex-col justify-between rounded-[32px] border border-white/[0.08] bg-[#101010] p-10 lg:row-span-2 lg:min-h-[520px] lg:p-14">
                <div>
                  <h3 className="font-sans text-xl font-semibold text-white md:text-2xl">{page.bentoLeft.title}</h3>
                  <p className="mt-4 font-sans text-[15px] leading-relaxed text-white/45">{page.bentoLeft.body}</p>
                </div>
                <div className="mt-10 grid grid-cols-3 gap-2 opacity-90 lg:mt-16">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                    >
                      <img
                        src={sampleAvatar((i % 7) + 1).src}
                        alt=""
                        className="size-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] border border-white/[0.08] bg-[#101010] p-10 lg:p-12">
                <h3 className="font-sans text-lg font-semibold text-white md:text-xl">{page.bentoTopRight.title}</h3>
                <p className="mt-3 font-sans text-[15px] leading-relaxed text-white/45">{page.bentoTopRight.body}</p>
                <div className="mt-8 flex justify-center">
                  <div className="flex h-[50px] w-full max-w-[474px] items-center gap-3 rounded-full border border-white/15 bg-black/40 px-4 backdrop-blur-md">
                    <span className="font-mono text-xs text-white/35">Ask Jokuh…</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] border border-white/[0.08] bg-[#101010] p-10 lg:p-12">
                <h3 className="font-sans text-lg font-semibold text-white md:text-xl">
                  {page.bentoBottomRight.title}
                </h3>
                <p className="mt-3 font-sans text-[15px] leading-relaxed text-white/45">{page.bentoBottomRight.body}</p>
                <div className="mt-8 flex justify-end">
                  <div className="h-32 w-32 rounded-full border border-dashed border-white/15 bg-gradient-to-br from-violet-500/20 to-cyan-500/10 blur-[0.5px]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-24 md:py-32">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(115deg, rgba(20,40,30,0.9) 0%, rgba(10,10,25,0.92) 45%, rgba(15,25,40,0.9) 100%), radial-gradient(circle at 30% 40%, rgba(56,189,248,0.12), transparent 50%)",
            }}
            aria-hidden
          />
          <div className="relative px-5">
            <p className="mx-auto max-w-[900px] text-center font-sans text-[clamp(1.35rem,3vw,2.25rem)] font-medium leading-snug tracking-tight text-white md:text-4xl">
              {page.bannerQuote}
            </p>
          </div>
        </section>

        <section className="border-t border-white/[0.06] py-20 md:py-28">
          <div className={cn(SHELL, "relative min-h-[480px] md:min-h-[560px]")}>
            <SpotlightDecor productId={productId} />
            <div className="relative z-10 mx-auto max-w-[640px] px-2 pt-8 text-center md:pt-16">
              <h2 className="font-sans text-[clamp(2rem,4vw,3rem)] font-medium tracking-tight text-[#dfdfdf]">
                {page.spotlightTitle}
              </h2>
              <p className="mt-6 font-sans text-[15px] leading-relaxed text-white/45 md:text-base">
                {page.spotlightSubtitle}
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06] py-20 md:py-28">
          <div className={SHELL}>
            <h2 className="mx-auto max-w-[720px] text-center font-sans text-[clamp(1.5rem,3.5vw,2.25rem)] font-medium leading-snug tracking-tight text-[#dfdfdf]">
              {page.spineTitle}
            </h2>
            <div className="relative mx-auto mt-16 max-w-md md:mt-24">
              <div
                className="absolute left-[13px] top-2 bottom-8 w-px bg-gradient-to-b from-white/10 via-white/25 to-white/10"
                aria-hidden
              />
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="relative flex gap-5 pb-10 last:pb-0">
                  <div
                    className={cn(
                      "relative z-10 mt-1 size-3 shrink-0 rounded-full border-2 border-black",
                      i === 0 ? "bg-[#8cff19]" : i === 1 ? "bg-amber-300" : i === 2 ? "bg-sky-400" : "bg-violet-400",
                    )}
                  />
                  <div className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-sm">
                    <p className="font-mono text-[10px] text-white/35 uppercase">
                      {["Today", "This week", "This month", "Archive"][i]}
                    </p>
                    <p className="mt-1 font-sans text-sm text-white/70">Activity along your spine</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-12 max-w-xl text-center font-sans text-sm leading-relaxed text-white/40">
              {page.spineSubtitle}
            </p>
          </div>
        </section>

        <section className="border-t border-white/[0.06] py-20 md:py-28">
          <div className={SHELL}>
            <h2 className="text-center font-sans text-[clamp(1.35rem,3vw,2rem)] font-medium tracking-tight text-[#dfdfdf] md:text-3xl">
              {page.privacyTitle}
            </h2>
            <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,478px)_1fr] lg:items-center">
              <div className="aspect-[4/5] w-full overflow-hidden rounded-[32px] border border-white/[0.08] bg-gradient-to-br from-[#1f2937] via-black to-[#0f172a] shadow-[0_30px_80px_rgba(0,0,0,0.45)]" />
              <div>
                <div className="space-y-5 font-sans text-[15px] leading-relaxed text-white/50">
                  {page.privacyBody.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <div className="mt-10 flex gap-3 overflow-x-auto pb-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-40 min-w-[140px] shrink-0 rounded-2xl border border-white/10 bg-[#121212]"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06] py-20 md:py-28">
          <div className={SHELL}>
            <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
              <h2 className="max-w-[807px] font-sans text-[clamp(1.5rem,3.2vw,2.5rem)] font-medium leading-snug tracking-tight text-[#dfdfdf]">
                {page.closingTitle}
              </h2>
              <div className="flex flex-wrap gap-3">
                <GreenGlowLink to="/#start">{page.closingPrimaryCta}</GreenGlowLink>
                <PurpleCta to="/">{page.closingSecondaryCta}</PurpleCta>
              </div>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {page.valueCards.map((card) => {
                const a = accentCardStyles[card.accent];
                return (
                  <article
                    key={card.title}
                    className={cn(
                      "rounded-[24px] border border-white/[0.08] bg-[#111] p-6 md:p-7",
                      a.glow,
                    )}
                  >
                    <div className={cn("mb-5 size-10 rounded-xl", a.icon)} />
                    <h3 className="font-sans text-[17px] font-semibold leading-snug text-white">{card.title}</h3>
                    <p className="mt-3 font-sans text-[13px] leading-relaxed text-white/45">{card.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <div className="border-t border-white/[0.06] px-5 py-10 text-center font-sans text-[13px] text-white/40 md:px-8">
          <Link to={`/#${productId}`} className="underline-offset-4 hover:text-white hover:underline">
            On the home overview
          </Link>
          <span className="text-white/20"> · </span>
          <Link to="/about" className="underline-offset-4 hover:text-white hover:underline">
            What Jokuh is building
          </Link>
        </div>
      </main>

      <MegaFooter />
    </div>
  );
}

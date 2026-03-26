import { InteractivePromptBar, cn } from "@jokuh/gooey";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { HOME_PROMPT_SUGGESTIONS } from "../../data/site-search-suggestions";
import { HeroQuickPills } from "./HeroQuickPills";

export const HERO_QUICK_LINKS: { label: string; href: string }[] = [
  { label: "Learn about Jokuh Pods", href: "/pods" },
  { label: "Search with Jokuh", href: "/#prompt" },
  { label: "Talk with Jokuh", href: "/#prompt" },
  { label: "Explore the Spine", href: "/spine" },
  { label: "Research", href: "/research" },
  { label: "Read the newsroom", href: "/newsroom" },
  { label: "More", href: "/newsroom" },
];

export function LandingHero() {
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
        className="landing-hero-chrome flex min-h-0 w-full flex-1 flex-col px-1"
      >
        <div className="flex min-h-[min(100%,calc(100svh-6rem))] w-full flex-1 flex-col items-center md:min-h-[min(100%,calc(100svh-7rem))]">
          <div className="flex w-full max-w-[min(calc(100vw-2rem),400px)] flex-1 flex-col items-center justify-end pb-6 md:max-w-[min(calc(100vw-4rem),770px)] md:pb-8">
            <h1 className="max-w-[min(94vw,52ch)] text-center font-sans text-[2.75rem] font-semibold leading-[1.08] tracking-[-0.03em] text-light-space sm:text-[3.25rem] md:text-[4.5rem] md:leading-[1.05] lg:text-[5.75rem] lg:leading-[1.02]">
              Your thinking is the product.
            </h1>
          </div>

          <div
            id="prompt"
            className="flex w-full max-w-[min(calc(100vw-2rem),400px)] shrink-0 flex-col items-center scroll-mt-32 md:max-w-[min(calc(100vw-4rem),770px)]"
          >
            <div className="w-full">
              <InteractivePromptBar
                variant="desktop"
                className={cn(
                  "!w-full !max-w-none",
                  "!border !border-solid !border-[#E0E0E0]",
                )}
                previewSuggestions={HOME_PROMPT_SUGGESTIONS}
                heroSendOnly
              />
            </div>
          </div>

          <div className="flex w-full max-w-[min(calc(100vw-2rem),400px)] flex-1 flex-col items-center justify-start pt-6 md:max-w-[min(calc(100vw-4rem),770px)] md:pt-8">
            <HeroQuickPills items={HERO_QUICK_LINKS} />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

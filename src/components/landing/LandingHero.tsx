import { InteractivePromptBar, cn, type GooeyLordiconAssetName } from "@jokuh/gooey";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Download,
  FileText,
  HeartHandshake,
  MessageCircle,
  MoreHorizontal,
  Newspaper,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { buildAppHandoffUrl } from "../../config/site-subdomains";
import { HOME_PROMPT_SUGGESTIONS } from "../../data/site-search-suggestions";
import { HeroQuickPills } from "./HeroQuickPills";
import { LANDING_PROMPT_BORDER_CLASS } from "./promptChrome";

export type HeroQuickLink = {
  label: string;
  href?: string;
  icon: {
    lordicon?: GooeyLordiconAssetName;
    lucide?: LucideIcon;
  };
  action?: "expand";
};

export const HERO_PRIMARY_QUICK_LINKS: HeroQuickLink[] = [
  { label: "Download Jokuh", href: "/download", icon: { lucide: Download, lordicon: "downloadSave" } },
  { label: "Search with Jokuh", href: "/#prompt", icon: { lucide: Search, lordicon: "search" } },
  { label: "Talk with Jokuh", href: buildAppHandoffUrl(""), icon: { lucide: MessageCircle, lordicon: "chatEmpty" } },
  { label: "Read the newsroom", href: "/newsroom", icon: { lucide: Newspaper, lordicon: "newspaper" } },
  { label: "More", action: "expand", icon: { lucide: MoreHorizontal, lordicon: "plus" } },
];

export const HERO_OVERFLOW_QUICK_LINKS: HeroQuickLink[] = [
  { label: "Browse stories", href: "/stories", icon: { lucide: FileText, lordicon: "arrowLongRight" } },
  { label: "Docs soon", href: "/contact", icon: { lucide: BookOpen, lordicon: "downloadSave" } },
  { label: "Meet the team", href: "/about", icon: { lucide: Users, lordicon: "worldGlobeWikis" } },
  { label: "See careers", href: "/careers", icon: { lucide: Sparkles, lordicon: "logSignIn" } },
  { label: "Contact sales", href: "/contact", icon: { lucide: HeartHandshake, lordicon: "arrowLongRight" } },
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
          <div className="flex w-full max-w-[min(calc(100vw-2rem),400px)] flex-1 flex-col items-center justify-end gap-3 pb-6 sm:max-w-[min(calc(100vw-3rem),520px)] md:max-w-[min(calc(100vw-4rem),770px)]">
            <h1 className="max-w-[min(94vw,52ch)] text-center font-sans text-[2rem] font-semibold leading-[1.1] tracking-[0em] text-light-space light:text-zinc-950 sm:text-[2.75rem] md:text-[2.75rem] md:leading-[1.1] lg:text-[3.25rem] lg:leading-[1.08]">
              Your mind. Your math. Your machine.
            </h1>
          </div>

          <div
            id="prompt"
            className="flex w-full max-w-[min(calc(100vw-2rem),400px)] shrink-0 flex-col items-center scroll-mt-32 sm:max-w-[min(calc(100vw-3rem),520px)] md:max-w-[min(calc(100vw-4rem),770px)]"
          >
            <div className="w-full">
              <InteractivePromptBar
                variant="desktop"
                className={cn(
                  "!w-full !max-w-none",
                  LANDING_PROMPT_BORDER_CLASS,
                )}
                previewSuggestions={HOME_PROMPT_SUGGESTIONS}
                heroSendOnly
                onSend={(text: string) => {
                  window.location.assign(buildAppHandoffUrl(text));
                }}
              />
            </div>
          </div>

          <div className="flex w-full max-w-[min(calc(100vw-2rem),400px)] flex-1 flex-col items-center justify-start pt-6 sm:max-w-[min(calc(100vw-3rem),520px)] md:max-w-[min(calc(100vw-4rem),900px)]">
            <HeroQuickPills items={HERO_PRIMARY_QUICK_LINKS} overflowItems={HERO_OVERFLOW_QUICK_LINKS} />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

import { cn } from "@jokuh/gooey";
import { motion, useReducedMotion } from "motion/react";
import { SiteLink } from "../SiteLink";
import { SHIPPED_WEEKS, getShippedHref, isShippedMonthPost } from "../../data/shipped";

/** Newest weekly build log post (month recaps skipped). `SHIPPED_WEEKS` is newest-first. */
const LATEST_WEEKLY_POST = SHIPPED_WEEKS.find((post) => !isShippedMonthPost(post));

export type HomeShippedTickerProps = {
  className?: string;
};

/**
 * **Purpose:** Small "New · {headline}" capsule under the Nexus pill on the one-screen homepage,
 * linking to the newest weekly `/shipped/{slug}` post. Renders nothing if there is no weekly post.
 * **Connects to:** `src/data/shipped.ts`, `ImmersiveAppChrome` `topCenterBelow`, `LandingImmersiveShell`.
 */
export function HomeShippedTicker({ className }: HomeShippedTickerProps) {
  const reduceMotion = useReducedMotion();
  const post = LATEST_WEEKLY_POST;
  if (!post) return null;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={cn("flex justify-center", className)}
    >
      <SiteLink
        href={getShippedHref(post)}
        aria-label={`New on Shipped: ${post.headline}`}
        title={post.headline}
        className={cn(
          "inline-flex h-7 max-w-[200px] items-center gap-1.5 rounded-full border px-3 font-sans text-[12px] font-medium sm:max-w-[260px]",
          "border-white/[0.14] bg-white/[0.08] text-white/80 backdrop-blur-md transition-colors hover:bg-white/[0.14]",
          "light:border-black/10 light:bg-white light:text-zinc-700 light:hover:bg-zinc-50",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80",
          "light:focus-visible:outline-black/70",
        )}
      >
        <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-[rgb(33,220,17)]" />
        <span className="shrink-0">New ·</span>
        <span className="min-w-0 truncate">{post.headline}</span>
      </SiteLink>
    </motion.div>
  );
}

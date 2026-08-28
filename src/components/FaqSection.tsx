import { useId, useState } from "react";
import { cn } from "@jokuh/gooey";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export type FaqEntry = {
  question: string;
  answer: string;
};

/**
 * **Purpose:** One FAQ row — question button + height-animated answer.
 * `overflow-hidden` on the motion wrapper clips the collapse; the inner copy
 * uses `min-w-0` / `break-words` so long answers wrap at 375px instead of clipping.
 * **Connects to:** Support and Contact pages.
 */
export function FaqItem({ question, answer }: FaqEntry) {
  const [open, setOpen] = useState(false);
  const answerId = useId();
  const shouldReduceMotion = useReducedMotion();
  const answerTransition = shouldReduceMotion
    ? { duration: 0.01 }
    : {
        height: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: open ? 0.28 : 0.15, ease: "easeOut" },
      };

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={answerId}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-sans text-[16px] font-semibold leading-snug text-light-space outline-none transition-colors hover:text-light-space/80 focus-visible:ring-2 focus-visible:ring-light-space/35 focus-visible:ring-offset-4 focus-visible:ring-offset-dark-space light:text-zinc-950 light:hover:text-zinc-700 light:focus-visible:ring-zinc-950/30 light:focus-visible:ring-offset-white [&::-webkit-details-marker]:hidden"
      >
        {question}
        <span
          className={cn(
            "shrink-0 text-light-space/50 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] light:text-zinc-400",
            open && "rotate-45",
          )}
          aria-hidden
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="size-4">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={answerId}
            role="region"
            aria-label={question}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={answerTransition}
            className="overflow-hidden"
          >
            <div className="overflow-visible pb-5 pr-1">
              <p className="max-w-[640px] min-w-0 text-pretty break-words font-sans text-[15px] leading-relaxed text-light-space/60 light:text-zinc-600">
                {answer}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/**
 * **Purpose:** Two-column FAQ block (sticky title + wrapping items).
 * The items column is `min-w-0` so the CSS grid does not overflow on narrow viewports.
 * **Connects to:** `SupportPage`, `ContactSalesPage`.
 */
export function FaqSection({
  items,
  title = "FAQs",
  className,
}: {
  items: FaqEntry[];
  title?: string;
  className?: string;
}) {
  return (
    <section id="faqs" className={className ?? "scroll-mt-24"}>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[280px_1fr] md:gap-12 lg:grid-cols-[320px_1fr]">
        <div className="md:sticky md:top-24 md:self-start">
          <h2 className="font-sans text-xl font-semibold tracking-[0em] text-light-space light:text-zinc-950 md:text-2xl">
            {title}
          </h2>
        </div>
        <div className="min-w-0">
          {items.map((item) => (
            <FaqItem key={item.question} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

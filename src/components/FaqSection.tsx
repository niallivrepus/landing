import { useState, useRef } from "react";

export type FaqEntry = {
  question: string;
  answer: string;
};

export function FaqItem({ question, answer }: FaqEntry) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border-b border-light-space/[0.08] light:border-zinc-200">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left font-sans text-[16px] font-semibold text-light-space light:text-zinc-950"
      >
        {question}
        <span
          className="shrink-0 text-light-space/50 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] light:text-zinc-400"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="size-4">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      <div
        className="overflow-hidden transition-[max-height,opacity] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          maxHeight: open ? contentRef.current?.scrollHeight ?? 200 : 0,
          opacity: open ? 1 : 0,
        }}
      >
        <div ref={contentRef} className="pb-5">
          <p className="max-w-[560px] font-sans text-[15px] leading-relaxed text-light-space/55 light:text-zinc-600">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

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
          <h2 className="font-sans text-xl font-semibold tracking-tight text-light-space light:text-zinc-950 md:text-2xl">
            {title}
          </h2>
        </div>
        <div>
          {items.map((item) => (
            <FaqItem key={item.question} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

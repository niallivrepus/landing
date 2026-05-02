export type FaqEntry = {
  question: string;
  answer: string;
};

export function FaqItem({ question, answer }: FaqEntry) {
  return (
    <details className="group">
      <summary
        className="flex w-full cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-sans text-[16px] font-semibold text-light-space outline-none transition-colors hover:text-light-space/80 focus-visible:ring-2 focus-visible:ring-light-space/35 focus-visible:ring-offset-4 focus-visible:ring-offset-dark-space light:text-zinc-950 light:hover:text-zinc-700 light:focus-visible:ring-zinc-950/30 light:focus-visible:ring-offset-white [&::-webkit-details-marker]:hidden"
      >
        {question}
        <span
          className="shrink-0 text-light-space/50 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-open:rotate-45 light:text-zinc-400"
          aria-hidden
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="size-4">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </summary>
      <div className="pb-5">
        <p className="max-w-[640px] font-sans text-[15px] leading-relaxed text-light-space/60 light:text-zinc-600">
          {answer}
        </p>
      </div>
    </details>
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
          <h2 className="font-sans text-xl font-semibold tracking-[0em] text-light-space light:text-zinc-950 md:text-2xl">
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

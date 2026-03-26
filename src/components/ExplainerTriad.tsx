import { cn } from "@jokuh/gooey";
import type { ReactNode } from "react";

type ExplainerItem = {
  fig: string;
  title: string;
  body: string;
  illustration: ReactNode;
};

function IllustrationLayers() {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto h-[min(140px,28vw)] w-full max-w-[200px] text-light-space/35"
      aria-hidden
    >
      <g stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round">
        <path d="M100 28 L148 52 L100 76 L52 52 Z" />
        <path d="M100 52 L148 76 L100 100 L52 76 Z" opacity="0.85" />
        <path d="M100 76 L148 100 L100 124 L52 100 Z" opacity="0.7" />
        <circle cx="100" cy="52" r="10" />
        <path d="M92 52 H108 M100 44 V60" opacity="0.6" />
      </g>
    </svg>
  );
}

function IllustrationCubes() {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto h-[min(140px,28vw)] w-full max-w-[200px] text-light-space/35"
      aria-hidden
    >
      <g stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round">
        <path d="M48 100 L72 88 L72 112 L48 124 Z" />
        <path d="M72 88 L96 76 L96 100 L72 112 Z" />
        <path d="M48 124 L72 112 L96 100 L72 88 L48 100" opacity="0.5" />
        <path d="M88 72 L120 56 L120 88 L88 104 Z" />
        <path d="M120 56 L152 72 L152 104 L120 88 Z" />
        <path d="M88 104 L120 88 L152 104 L120 120 L88 104" opacity="0.5" />
        <path d="M108 40 L140 28 L140 52 L108 64 Z" />
        <path d="M140 28 L168 44 L168 68 L140 52 Z" />
        <path d="M108 64 L140 52 L168 68 L140 84 L108 64" opacity="0.5" />
      </g>
    </svg>
  );
}

function IllustrationStairs() {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto h-[min(140px,28vw)] w-full max-w-[200px] text-light-space/35"
      aria-hidden
    >
      <g stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round">
        <path d="M36 120 L52 112 L52 128 L36 136 Z" />
        <path d="M52 112 L76 100 L76 120 L52 128 Z" />
        <path d="M76 100 L104 86 L104 110 L76 120 Z" />
        <path d="M104 86 L136 70 L136 98 L104 110 Z" />
        <path d="M136 70 L172 52 L172 84 L136 98 Z" />
        <path d="M172 52 L172 120 L36 120" opacity="0.45" />
        <path d="M36 120 L172 52" opacity="0.25" />
      </g>
    </svg>
  );
}

const ITEMS: ExplainerItem[] = [
  {
    fig: "FIG 0.1",
    title: "Built for how you think",
    body: "Jokuh is shaped around capturing and connecting thought—not just files, threads, or tickets.",
    illustration: <IllustrationLayers />,
  },
  {
    fig: "FIG 0.2",
    title: "Humans and agents, one flow",
    body: "From rough notes to structured output, work stays in a single spine you can search, share, and ship from.",
    illustration: <IllustrationCubes />,
  },
  {
    fig: "FIG 0.3",
    title: "Less noise, more momentum",
    body: "Clear surfaces and fast paths so you spend time deciding—not hunting for context.",
    illustration: <IllustrationStairs />,
  },
];

export function ExplainerTriad({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "bg-dark-space px-4 py-16 md:px-8 md:py-20",
        className,
      )}
      aria-labelledby="explainer-triad-heading"
    >
      <h2 id="explainer-triad-heading" className="sr-only">
        Why Jokuh
      </h2>
      <div className="mx-auto grid max-w-[1380px] grid-cols-1 gap-y-12 md:grid-cols-3 md:gap-x-8 md:gap-y-0 lg:gap-x-10">
        {ITEMS.map((item) => (
          <div
            key={item.fig}
            className="flex flex-col md:px-2 lg:px-6"
          >
            <p className="font-mono text-[11px] tracking-[0.12em] text-light-space/40">{item.fig}</p>
            <div className="mt-8 flex min-h-[min(160px,32vw)] flex-1 items-center justify-center md:mt-10">
              {item.illustration}
            </div>
            <h3 className="mt-10 font-sans text-lg font-semibold tracking-tight text-light-space md:mt-12 md:text-xl">
              {item.title}
            </h3>
            <p className="mt-3 max-w-sm font-sans text-[15px] leading-relaxed text-light-space/55 md:text-[15px]">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

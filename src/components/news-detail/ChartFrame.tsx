import type { ReactNode } from "react";

type ChartFrameProps = {
  title: string;
  subtitle?: string;
  legend?: ReactNode;
  footnote?: string;
  children: ReactNode;
};

export function ChartFrame({ title, subtitle, legend, footnote, children }: ChartFrameProps) {
  return (
    <figure className="relative rounded-xl border border-light-space/[0.08] bg-dark-space px-4 pb-4 pt-12 md:px-8 md:pb-6 md:pt-14">
      <div className="pointer-events-none absolute left-1/2 top-3 z-20 -translate-x-1/2 md:top-3.5">
        <img
          src="/jokuh-mask.png"
          alt=""
          className="h-7 w-auto opacity-95 drop-shadow-[0_0_12px_rgba(255,255,255,0.2)] md:h-8"
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <figcaption className="min-w-0 text-left">
          <h3 className="font-sans text-sm font-semibold tracking-tight text-light-space">{title}</h3>
          {subtitle ? (
            <p className="mt-0.5 font-sans text-xs font-medium text-light-space/55">{subtitle}</p>
          ) : null}
        </figcaption>
        {legend ? <div className="flex flex-wrap items-center gap-4 text-xs text-light-space/70">{legend}</div> : null}
      </div>
      <div className="mt-4 h-[260px] w-full sm:h-[300px] md:h-[320px]">{children}</div>
      {footnote ? (
        <p className="mt-4 font-sans text-[13px] italic leading-relaxed text-light-space/45">{footnote}</p>
      ) : null}
    </figure>
  );
}

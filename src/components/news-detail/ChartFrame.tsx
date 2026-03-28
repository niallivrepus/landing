import type { ReactNode } from "react";
import { useCallback, useRef } from "react";
import { Download } from "lucide-react";
import { JokuhMark } from "../legal/JokuhMark";

const markClass = "h-[18px] w-auto text-light-space/90 light:text-zinc-900 md:h-5";

type ChartFrameProps = {
  title: string;
  subtitle?: string;
  legend?: ReactNode;
  footnote?: string;
  /** When set, logo shows download on hover and exports the chart SVG with this filename. */
  downloadFilename?: string;
  children: ReactNode;
};

export function ChartFrame({
  title,
  subtitle,
  legend,
  footnote,
  downloadFilename,
  children,
}: ChartFrameProps) {
  const chartAreaRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(() => {
    if (!downloadFilename) return;
    const root = chartAreaRef.current;
    if (!root) return;
    const svg = root.querySelector("svg.recharts-surface") ?? root.querySelector("svg");
    if (!svg) return;

    const clone = svg.cloneNode(true) as SVGSVGElement;
    if (!clone.getAttribute("xmlns")) {
      clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    }

    const serialized = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([`<?xml version="1.0" encoding="UTF-8"?>${serialized}`], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadFilename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [downloadFilename]);

  return (
    <figure className="relative rounded-xl border border-light-space/[0.08] bg-dark-space px-4 pb-4 pt-12 light:border-black/[0.08] light:bg-white md:px-8 md:pb-6 md:pt-14">
      {downloadFilename ? (
        <div className="absolute left-1/2 top-3 z-20 -translate-x-1/2 md:top-3.5">
          <button
            type="button"
            onClick={handleDownload}
            className="group/chart-logo relative inline-flex items-center justify-center rounded-md p-1 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-light-space/30 light:focus-visible:ring-black/20"
            aria-label={`Download chart as ${downloadFilename}`}
          >
            <JokuhMark
              className={`${markClass} transition-opacity duration-200 group-hover/chart-logo:opacity-25 group-focus-visible/chart-logo:opacity-25`}
            />
            <Download
              className="pointer-events-none absolute size-[18px] text-light-space/90 opacity-0 transition-opacity duration-200 group-hover/chart-logo:opacity-100 group-focus-visible/chart-logo:opacity-100 light:text-zinc-900 md:size-5"
              strokeWidth={2}
              aria-hidden
            />
          </button>
        </div>
      ) : (
        <div className="absolute left-1/2 top-3 z-20 -translate-x-1/2 md:top-3.5" aria-hidden>
          <JokuhMark className={markClass} />
        </div>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <figcaption className="min-w-0 text-left">
          <h3 className="font-sans text-sm font-semibold tracking-tight text-light-space light:text-zinc-950">{title}</h3>
          {subtitle ? (
            <p className="mt-0.5 font-sans text-xs font-medium text-light-space/55 light:text-zinc-500">{subtitle}</p>
          ) : null}
        </figcaption>
        {legend ? <div className="flex flex-wrap items-center gap-4 text-xs text-light-space/70 light:text-zinc-600">{legend}</div> : null}
      </div>
      <div ref={chartAreaRef} className="mt-4 h-[260px] w-full sm:h-[300px] md:h-[320px]">
        {children}
      </div>
      {footnote ? (
        <p className="mt-4 font-sans text-[13px] italic leading-relaxed text-light-space/45 light:text-zinc-500">{footnote}</p>
      ) : null}
    </figure>
  );
}

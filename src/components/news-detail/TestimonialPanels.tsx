import { cn } from "@jokuh/gooey";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TestimonialEntry } from "../../data/news-detail";
import { ChartFrame } from "./ChartFrame";
import { RichParagraph } from "./RichParagraph";
import { useState } from "react";

const tickMuted = { fill: "#a1a1aa", fontSize: 10 };

function MiniTip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded border border-white/10 bg-zinc-950 px-2 py-1.5 text-[11px]">
      {payload.map((p) => (
        <p key={String(p.name)} className="tabular-nums">
          <span style={{ color: p.color }}>{p.name}</span>: {p.value}%
        </p>
      ))}
    </div>
  );
}

export function TestimonialPanels({ entries }: { entries: TestimonialEntry[] }) {
  const [active, setActive] = useState(0);
  const t = entries[active];

  return (
    <div className="space-y-10 md:space-y-12">
      <div
        className="flex flex-wrap gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.03] p-1.5"
        role="tablist"
        aria-label="Customer stories"
      >
        {entries.map((e, i) => (
          <button
            key={e.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={cn(
              "rounded-full px-4 py-2.5 font-sans text-sm transition-colors",
              i === active ? "bg-white/[0.14] text-white" : "text-white/50 hover:text-white/75",
            )}
          >
            {e.company}
          </button>
        ))}
      </div>

      <blockquote className="mx-auto w-full max-w-[min(100%,720px)] text-center">
        <p className="font-sans text-xl font-medium leading-[1.45] tracking-[-0.02em] text-white md:text-2xl md:leading-snug lg:text-[1.65rem]">
          “{t.quote}”
        </p>
        <footer className="mt-6 font-sans text-sm text-white/50 md:text-base">— {t.attribution}</footer>
      </blockquote>

      <div className="mx-auto w-full max-w-[min(100%,720px)]">
        <RichParagraph className="font-sans text-[1.0625rem] leading-[1.75] text-white/72 md:text-lg">
          {t.followUp}
        </RichParagraph>
      </div>

      <ChartFrame title="Pilot rubric pass rate" subtitle={`${t.company} · weekly cohort`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={t.sparkline} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey="step" tick={tickMuted} tickFormatter={(v) => `W${v}`} />
            <YAxis
              tick={tickMuted}
              domain={[48, "auto"]}
              tickFormatter={(v) => `${v}%`}
              width={40}
            />
            <Tooltip content={<MiniTip />} />
            <Line
              type="monotone"
              dataKey="cortex"
              name="Cortex"
              stroke="#7dd3fc"
              strokeWidth={2}
              dot={{ r: 3, fill: "#7dd3fc" }}
            />
            <Line
              type="monotone"
              dataKey="prior"
              name="Prior"
              stroke="#fb923c"
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={{ r: 3, fill: "#fb923c" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartFrame>
    </div>
  );
}

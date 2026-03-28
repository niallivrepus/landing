import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  GDPVAL_BAR_DATA,
  OSWORLD_LINE_DATA,
  SWE_LINE_DATA,
} from "../../data/news-detail";
import { ChartFrame } from "./ChartFrame";

const tickMuted = { fill: "#a1a1aa", fontSize: 11 };

function DarkTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-light-space/10 bg-smoke-2 px-3 py-2 text-xs shadow-xl light:border-black/10 light:bg-white light:shadow-md">
      {label != null ? <p className="mb-1 text-light-space/50 light:text-zinc-500">{label}</p> : null}
      {payload.map((p) => (
        <p key={String(p.name)} className="tabular-nums text-light-space/90 light:text-zinc-900">
          <span style={{ color: p.color }}>{p.name}</span>:{" "}
          {typeof p.value === "number" ? `${p.value}%` : p.value}
        </p>
      ))}
    </div>
  );
}

export function GdpvalStackedChart({ footnote }: { footnote: string }) {
  return (
    <ChartFrame
      title="GDPval"
      subtitle="Knowledge work tasks"
      downloadFilename="jokuh-gdpval-benchmark.svg"
      footnote={footnote}
      legend={
        <>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-sky-400" aria-hidden />
            Wins
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-blue-800 ring-1 ring-sky-500/80" aria-hidden />
            Ties
          </span>
        </>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={GDPVAL_BAR_DATA} margin={{ top: 12, right: 12, left: 4, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis
            dataKey="name"
            tick={tickMuted}
            interval={0}
            angle={-32}
            textAnchor="end"
            height={52}
          />
          <YAxis
            tick={tickMuted}
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            width={44}
            label={{
              value: "Win rate vs industry professional",
              angle: -90,
              position: "insideLeft",
              fill: "#71717a",
              style: { fontSize: 10, textAnchor: "middle" },
            }}
          />
          <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <ReferenceLine
            y={50}
            stroke="#71717a"
            strokeDasharray="5 5"
            strokeOpacity={0.28}
            label={{
              value: "Industry expert baseline",
              fill: "#71717a",
              fontSize: 10,
              position: "insideTopRight",
            }}
          />
          <Bar dataKey="wins" stackId="a" fill="#38bdf8" />
          <Bar dataKey="ties" stackId="a" fill="#1e40af" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function SweBenchLineChart({ footnote }: { footnote: string }) {
  return (
    <ChartFrame
      title="SWE-Bench Pro (public)"
      subtitle="Accuracy vs estimated latency"
      downloadFilename="jokuh-swe-bench-pro-benchmark.svg"
      footnote={footnote}
      legend={
        <>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-sky-400" aria-hidden />
            Cortex
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rotate-45 bg-fuchsia-500" aria-hidden />
            Preview
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-0 border-l-[5px] border-r-[5px] border-b-[8px] border-l-transparent border-r-transparent border-b-orange-400" aria-hidden />
            Baseline
          </span>
        </>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={SWE_LINE_DATA} margin={{ top: 12, right: 16, left: 4, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis
            type="number"
            dataKey="latency"
            tick={tickMuted}
            tickFormatter={(v) => `${v}`}
            domain={[0, "auto"]}
            label={{
              value: "Estimated latency (seconds)",
              position: "insideBottom",
              offset: -2,
              fill: "#71717a",
              style: { fontSize: 10 },
            }}
          />
          <YAxis
            tick={tickMuted}
            domain={[40, 62]}
            tickFormatter={(v) => `${v}%`}
            width={44}
            label={{
              value: "Accuracy",
              angle: -90,
              position: "insideLeft",
              fill: "#71717a",
              style: { fontSize: 10 },
            }}
          />
          <Tooltip content={<DarkTooltip />} />
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
            dataKey="preview"
            name="Preview"
            stroke="#e879f9"
            strokeWidth={2}
            dot={{ r: 3, fill: "#e879f9" }}
          />
          <Line
            type="monotone"
            dataKey="baseline"
            name="Baseline"
            stroke="#fb923c"
            strokeWidth={2}
            dot={{ r: 3, fill: "#fb923c" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function OsworldLineChart({ footnote }: { footnote: string }) {
  return (
    <ChartFrame
      title="PodBench-Verified"
      subtitle="Accuracy vs tool yields"
      downloadFilename="jokuh-podbench-verified-benchmark.svg"
      footnote={footnote}
      legend={
        <>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-sky-400" aria-hidden />
            Cortex
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-0 border-l-[5px] border-r-[5px] border-b-[8px] border-l-transparent border-r-transparent border-b-orange-400" aria-hidden />
            Baseline
          </span>
        </>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={OSWORLD_LINE_DATA} margin={{ top: 12, right: 16, left: 4, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis
            type="number"
            dataKey="yields"
            tick={tickMuted}
            label={{
              value: "Number of tool yields",
              position: "insideBottom",
              offset: -2,
              fill: "#71717a",
              style: { fontSize: 10 },
            }}
          />
          <YAxis
            tick={tickMuted}
            domain={[20, 85]}
            tickFormatter={(v) => `${v}%`}
            width={44}
            label={{
              value: "Accuracy",
              angle: -90,
              position: "insideLeft",
              fill: "#71717a",
              style: { fontSize: 10 },
            }}
          />
          <Tooltip content={<DarkTooltip />} />
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
            dataKey="baseline"
            name="Baseline"
            stroke="#fb923c"
            strokeWidth={2}
            dot={{ r: 3, fill: "#fb923c" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

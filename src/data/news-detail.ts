/**
 * Long-form on-site news articles (benchmark tables, charts, testimonials).
 */

export type BenchmarkRow = { label: string; values: [string, string, string] };

export type TestimonialEntry = {
  id: string;
  company: string;
  quote: string;
  attribution: string;
  /** Paragraph after quote; use **term** for bold */
  followUp: string;
  /** Mini line chart: accuracy vs step */
  sparkline: { step: number; cortex: number; prior: number }[];
};

export type NewsDetailDocument = {
  slug: string;
  metaLine: string;
  title: string;
  subtitle: string;
  /** Plain text for Web Speech API */
  speechText: string;
  introParagraphs: string[];
  benchmarkTable: {
    columns: [string, string, string, string];
    rows: BenchmarkRow[];
    footnote: string;
  };
  knowledgeWork: {
    title: string;
    paragraphs: string[];
  };
  chartFootnotes: {
    gdpval: string;
    swe: string;
    osworld: string;
  };
  testimonials: TestimonialEntry[];
};

export const NEWS_DETAIL_BY_SLUG: Record<string, NewsDetailDocument> = {
  "introducing-jokuh-cortex": {
    slug: "introducing-jokuh-cortex",
    metaLine: "March 5, 2026 · Product · Release",
    title: "Introducing Jokuh Cortex",
    subtitle: "Designed for professional work.",
    speechText: [
      "Introducing Jokuh Cortex, designed for professional work.",
      "Cortex is our new reasoning and tool-use stack for pods and blurbs.",
      "On PodBench Verified, Cortex reaches seventy eight point four percent, up from sixty one point two on the prior generation.",
      "On Threadathlon, it scores fifty two point one percent versus forty four point eight.",
      "BrowseComp for deep research improves to seventy nine percent.",
      "Knowledge work tasks show Cortex winning or tying on eighty three percent of GDPval scenarios against practicing professionals.",
      "Teams at Northline, Harbor, and Signal Desk report faster turnaround on long horizon deliverables.",
      "Cortex runs with lower median latency than frontier baselines at matched accuracy on SWE Bench style tasks.",
    ].join(" "),
    introParagraphs: [
      "**Jokuh Cortex** is our next-generation assistant stack for pods, blurbs, and API workloads—tuned for **long-horizon professional work**: research memos, product specs, incident timelines, and multi-step tool use without losing the thread.",
      "It improves on **Cortex Preview** across coding, browsing, and knowledge benchmarks while staying calmer under parallel tool calls. **Cortex Pro** adds higher reasoning depth for the heaviest workflows.",
    ],
    benchmarkTable: {
      columns: ["Benchmark", "Cortex", "Cortex Preview", "Baseline"],
      rows: [
        { label: "GDPval (wins or ties)", values: ["83.0%", "70.9%", "62.4%"] },
        { label: "SWE-Bench Pro (public)", values: ["57.7%", "52.1%", "48.9%"] },
        { label: "PodBench-Verified", values: ["78.4%", "74.0%*", "61.2%"] },
        { label: "Threadathlon", values: ["52.1%", "48.6%", "44.8%"] },
        { label: "BrowseComp", values: ["79.0%", "71.2%", "58.5%"] },
      ],
      footnote:
        "* PodBench-Verified score for Cortex Preview measured on the January 2026 harness revision; all other cells on the March 2026 suite.",
    },
    knowledgeWork: {
      title: "Knowledge work",
      paragraphs: [
        "On **GDPval**, Cortex now **wins or ties** professionals on **83.0%** of blind-reviewed tasks, up from **70.9%** for Preview. The gains concentrate in synthesis, stakeholder-ready writing, and constraint-heavy planning where small mistakes are costly.",
        "The chart below breaks out **win rate vs industry professionals** across representative bundles—**wins** in light blue, **ties** in deep blue—so you can see where the model is decisive versus merely acceptable.",
      ],
    },
    chartFootnotes: {
      gdpval:
        "GDPval tasks are sampled from anonymized pod transcripts and reviewed by domain leads. “Tie” means both outputs met rubric without a clear preference.",
      swe: "Points are Pareto-optimal configurations from internal latency sweeps; latency is end-to-end wall clock on standard hardware.",
      osworld:
        "A tool yield is when the assistant yields to await tool responses. Parallel tool batches count as one yield. Yields proxy latency better than raw call counts.",
    },
    testimonials: [
      {
        id: "northline",
        company: "Northline",
        quote:
          "Cortex is the best stack we've shipped against internally. It's at the top of our Apex Agents board for professional services-style work—long decks, diligence packs, and legal first drafts—with lower median latency than the models we replaced.",
        attribution: "Morgan Ellis, VP Eng at Northline",
        followUp:
          "Their Apex suite now reports a mean **87.3%** pass rate on rubric checks, with **68.0%** of runs needing no human rewrite on first submission.",
        sparkline: [
          { step: 1, cortex: 62, prior: 54 },
          { step: 2, cortex: 71, prior: 58 },
          { step: 3, cortex: 78, prior: 61 },
          { step: 4, cortex: 84, prior: 63 },
          { step: 5, cortex: 87, prior: 65 },
        ],
      },
      {
        id: "harbor",
        company: "Harbor",
        quote:
          "We stress multi-tab research and CRM writes. Cortex holds context across twelve-plus tool yields without spiraling. That's the difference between 'demo good' and 'Monday morning good.'",
        attribution: "Riley Park, Platform Lead at Harbor",
        followUp:
          "Harbor's pilot cut median research-to-memo time by **34%** while keeping human sign-off on every external send.",
        sparkline: [
          { step: 1, cortex: 55, prior: 52 },
          { step: 2, cortex: 64, prior: 53 },
          { step: 3, cortex: 72, prior: 55 },
          { step: 4, cortex: 79, prior: 56 },
          { step: 5, cortex: 83, prior: 57 },
        ],
      },
      {
        id: "signal-desk",
        company: "Signal Desk",
        quote:
          "We wanted fewer 'almost right' answers in compliance-heavy threads. Cortex Pro's depth mode is the first time our reviewers voluntarily asked to keep a model in the loop.",
        attribution: "Ava Nguyen, Risk Product at Signal Desk",
        followUp:
          "Escalations to secondary review dropped **21%** quarter over quarter in the Cortex arm of the trial.",
        sparkline: [
          { step: 1, cortex: 58, prior: 56 },
          { step: 2, cortex: 66, prior: 57 },
          { step: 3, cortex: 74, prior: 59 },
          { step: 4, cortex: 81, prior: 60 },
          { step: 5, cortex: 86, prior: 61 },
        ],
      },
    ],
  },
};

export function getNewsDetail(slug: string | undefined): NewsDetailDocument | undefined {
  if (!slug) return undefined;
  return NEWS_DETAIL_BY_SLUG[slug];
}

/** ~160 words/min for TTS pacing */
export function estimateSpeechDurationLabel(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const seconds = Math.max(60, Math.round((words / 160) * 60));
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export const GDPVAL_BAR_DATA = [
  { name: "Cortex Pro", wins: 74, ties: 14 },
  { name: "Cortex", wins: 68, ties: 18 },
  { name: "Preview Pro", wins: 61, ties: 12 },
  { name: "Preview", wins: 55, ties: 10 },
];

export const SWE_LINE_DATA = [
  { latency: 280, cortex: 54.2, preview: 52.1, baseline: 47.8 },
  { latency: 520, cortex: 55.8, preview: 53.4, baseline: 49.1 },
  { latency: 880, cortex: 56.9, preview: 54.2, baseline: 50.2 },
  { latency: 1200, cortex: 57.7, preview: 54.8, baseline: 51.0 },
  { latency: 1680, cortex: 58.1, preview: 55.1, baseline: 51.4 },
];

export const OSWORLD_LINE_DATA = [
  { yields: 9, cortex: 41, baseline: 28 },
  { yields: 12, cortex: 58, baseline: 35 },
  { yields: 15, cortex: 72, baseline: 42 },
  { yields: 18, cortex: 76, baseline: 44 },
  { yields: 22, cortex: 78, baseline: 46 },
];

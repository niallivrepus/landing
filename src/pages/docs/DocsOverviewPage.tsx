import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  AudioLines,
  Bot,
  Braces,
  ChevronRight,
  CircleHelp,
  Check,
  Copy,
  Eye,
  Image,
  MessagesSquare,
  NotebookText,
  Radio,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const MODELS = [
  {
    title: "jokuh-1",
    href: "/developers/sdk",
    body: "Best intelligence at scale for agentic workflows and production-grade coding tasks.",
    gradient: "from-[#d4e1ff] via-[#f8c0bf] to-[#f6b2e1]",
    badge: "New",
  },
  {
    title: "jokuh-1-mini",
    href: "/developers/sdk",
    body: "Fast multimodal model for coding, tool use, and subagent orchestration.",
    gradient: "from-[#f7cfb5] via-[#f4a1ce] to-[#a7c6ff]",
    badge: "New",
  },
  {
    title: "jokuh-1-nano",
    href: "/developers/sdk",
    body: "Our cheapest model for simple, high-volume tasks with strong baseline quality.",
    gradient: "from-[#bdd4ff] via-[#f3b1cb] to-[#f0a3dc]",
    badge: "New",
  },
] as const;

const START_BUILDING_ITEMS: ReadonlyArray<{
  title: string;
  body: string;
  href: string;
  Icon: LucideIcon;
}> = [
  {
    title: "Read and generate text",
    body: "Use the API to prompt a model and generate text.",
    href: "/developers/docs/quickstart",
    Icon: MessagesSquare,
  },
  {
    title: "Generate images as output",
    body: "Create images with the responses API and image tools.",
    href: "/developers/docs/cookbook",
    Icon: Image,
  },
  {
    title: "Build agentic applications",
    body: "Use tools, memory, and orchestration flows to ship apps.",
    href: "/developers/apps",
    Icon: Bot,
  },
  {
    title: "Get structured data from models",
    body: "Constrain outputs to a strict JSON shape for automation.",
    href: "/developers/sdk",
    Icon: Braces,
  },
  {
    title: "Use a model's vision capabilities",
    body: "Analyze screenshots and images directly in your product.",
    href: "/developers/docs/cookbook",
    Icon: Eye,
  },
  {
    title: "Build apps with audio",
    body: "Analyze, transcribe, and generate audio in one flow.",
    href: "/developers/sdk",
    Icon: AudioLines,
  },
  {
    title: "Achieve complex tasks with reasoning",
    body: "Use reasoning-optimized models for multi-step tasks.",
    href: "/developers/sdk",
    Icon: Sparkles,
  },
  {
    title: "Tailor to your use case",
    body: "Tune models with evals and distillation workflows.",
    href: "/developers/docs/cookbook",
    Icon: SlidersHorizontal,
  },
];

const SUPPORT_LINKS: ReadonlyArray<{
  title: string;
  body: string;
  href: string;
  Icon: LucideIcon;
}> = [
  {
    title: "Help center",
    body: "Frequently asked account and billing questions.",
    href: "/support",
    Icon: CircleHelp,
  },
  {
    title: "Developer forum",
    body: "Discuss topics with other developers.",
    href: "/developers/docs",
    Icon: MessagesSquare,
  },
  {
    title: "Cookbook",
    body: "Open-source examples and implementation guides.",
    href: "/developers/docs/cookbook",
    Icon: NotebookText,
  },
  {
    title: "Status",
    body: "Check the status of Jokuh services.",
    href: "/system-status",
    Icon: Radio,
  },
];

const kw = "text-[#DF3079]";
const fn = "text-[#2E95D3]";
const str = "text-[#05A57E]";
const id = "text-[#E9950D]";
const w = "text-white/90 light:text-zinc-900";
const op = "text-white/70 light:text-zinc-700";
const cm = "text-white/42 light:text-zinc-400";

function ModelCard({
  title,
  href,
  body,
  gradient,
  badge,
}: {
  title: string;
  href: string;
  body: string;
  gradient: string;
  badge: string;
}) {
  return (
    <Link to={href} className="group">
      <div className={`h-36 rounded-lg bg-gradient-to-r ${gradient} transition-opacity group-hover:opacity-90`} />
      <h3 className="mt-4 flex items-center gap-2 font-sans text-[36px] leading-none font-semibold tracking-[-0.02em] text-white md:text-[40px] light:text-zinc-950">
        <span className="text-[34px] md:text-[38px]">gpt</span>
        <span className="text-[30px] md:text-[34px]">·</span>
        <span className="text-[34px] md:text-[38px]">{title.replace("jokuh-", "")}</span>
      </h3>
      <p className="mt-2 line-clamp-2 max-w-[36ch] font-sans text-[15px] leading-6 text-white/54 light:text-zinc-600">{body}</p>
      <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/24 bg-emerald-300/10 px-2 py-1 font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-emerald-200/95 light:border-emerald-600/18 light:bg-emerald-500/10 light:text-emerald-700">
        {badge}
      </span>
    </Link>
  );
}

const overviewRawCode = `import OpenAI from "openai";

const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.4",
  input: "Write a short bedtime story about a unicorn.",
});

console.log(response.output_text);`;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      if (timer.current !== null) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => setCopied(false), 1800);
    });
  }, [text]);
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 font-sans text-[12px] font-medium text-white/42 transition-colors hover:text-white/72 light:text-zinc-500 light:hover:text-zinc-800"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function DocsOverviewPage() {
  useDocumentTitle("Documentation — Jokuh");

  return (
    <article className="w-full max-w-[1220px]">
      <header className="max-w-[760px]">
        <h1 className="font-sans text-[28px] font-semibold tracking-[-0.02em] text-white md:text-[32px] light:text-zinc-950">API Platform</h1>
      </header>

      <section className="mt-8 overflow-hidden rounded-lg border border-white/10 bg-[#111214] light:border-black/[0.08] light:bg-zinc-50">
        <div className="grid lg:grid-cols-[0.85fr_1fr]">
          <div className="flex flex-col justify-between p-6 md:p-8">
            <div>
              <p className="font-sans text-[18px] font-semibold tracking-[-0.01em] text-white md:text-[20px] light:text-zinc-950">Developer quickstart</p>
              <p className="mt-3 max-w-[36ch] font-sans text-[15px] leading-[1.5] font-normal text-white/55 md:text-[16px] light:text-zinc-600">
                Make your first API request in minutes. Learn the basics of the Jokuh platform.
              </p>
            </div>
            <Link
              to="/developers/docs/quickstart"
              className="mt-6 inline-flex h-10 w-fit items-center rounded-full bg-white px-4 font-sans text-[13px] font-semibold text-black transition-colors hover:bg-white/90"
            >
              Get started
            </Link>
          </div>
          <div className="border-t border-white/8 lg:border-t-0 lg:border-l light:border-black/[0.08]">
            <header className="flex items-center justify-between px-5 py-3">
              <span className="font-sans text-[12px] font-medium text-white/42 light:text-zinc-500">javascript</span>
              <CopyButton text={overviewRawCode} />
            </header>
            <pre className="overflow-x-auto px-5 py-4 font-mono text-[13px] leading-7">
              <code>
                <table className="border-collapse">
                  <tbody>
                    <tr><td className={`${cm} select-none pr-4 text-right`}>1</td><td><span className={kw}>import</span> <span className={w}>OpenAI</span> <span className={kw}>from</span> <span className={str}>"openai"</span><span className={op}>;</span></td></tr>
                    <tr><td className={`${cm} select-none pr-4 text-right`}>2</td><td><span className={kw}>const</span> <span className={w}>client</span> <span className={op}>=</span> <span className={kw}>new</span> <span className={fn}>OpenAI</span><span className={op}>();</span></td></tr>
                    <tr><td className={`${cm} select-none pr-4 text-right`}>3</td><td> </td></tr>
                    <tr><td className={`${cm} select-none pr-4 text-right`}>4</td><td><span className={kw}>const</span> <span className={w}>response</span> <span className={op}>=</span> <span className={kw}>await</span> <span className={w}>client</span><span className={op}>.</span><span className={w}>responses</span><span className={op}>.</span><span className={fn}>create</span><span className={op}>({"{"}</span></td></tr>
                    <tr><td className={`${cm} select-none pr-4 text-right`}>5</td><td>{"  "}<span className={w}>model</span><span className={op}>:</span> <span className={str}>"gpt-5.4"</span><span className={op}>,</span></td></tr>
                    <tr><td className={`${cm} select-none pr-4 text-right`}>6</td><td>{"  "}<span className={w}>input</span><span className={op}>:</span> <span className={str}>"Write a short bedtime story about a unicorn."</span><span className={op}>,</span></td></tr>
                    <tr><td className={`${cm} select-none pr-4 text-right`}>7</td><td><span className={op}>{"}"});</span></td></tr>
                    <tr><td className={`${cm} select-none pr-4 text-right`}>8</td><td> </td></tr>
                    <tr><td className={`${cm} select-none pr-4 text-right`}>9</td><td><span className={id}>console</span><span className={op}>.</span><span className={fn}>log</span><span className={op}>(</span><span className={w}>response</span><span className={op}>.</span><span className={w}>output_text</span><span className={op}>);</span></td></tr>
                  </tbody>
                </table>
              </code>
            </pre>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <header className="flex items-end justify-between gap-4">
          <h2 className="font-sans text-[28px] font-semibold tracking-[-0.02em] text-white md:text-[32px] light:text-zinc-950">Models</h2>
          <Link
            to="/developers/docs/models"
            className="inline-flex items-center gap-1 font-sans text-[14px] font-medium text-white/65 transition-colors hover:text-white light:text-zinc-600 light:hover:text-zinc-950"
          >
            View all
            <ChevronRight className="size-4" strokeWidth={1.8} />
          </Link>
        </header>
        <p className="mt-2 max-w-[84ch] font-sans text-[15px] leading-6 text-white/58 light:text-zinc-600">
          Start with jokuh-1 for complex reasoning and coding, or choose jokuh-1-mini and jokuh-1-nano for
          lower-latency, lower-cost workloads.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {MODELS.map((model) => (
            <ModelCard key={model.title} {...model} />
          ))}
        </div>
      </section>

      <section className="mt-16 border-t border-white/8 pt-10 light:border-black/[0.08]">
        <h2 className="font-sans text-[28px] font-semibold tracking-[-0.02em] text-white light:text-zinc-950">Start building</h2>
        <ul className="mt-6 grid gap-x-8 gap-y-4 lg:grid-cols-2">
          {START_BUILDING_ITEMS.map(({ title, body, href, Icon }) => (
            <li key={title}>
              <Link
                to={href}
                className="group flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-white/[0.03] light:hover:bg-black/[0.03]"
              >
                <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] light:border-black/[0.08] light:bg-black/[0.03]">
                  <Icon className="size-4 text-white/74 light:text-zinc-700" strokeWidth={1.9} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="inline-flex items-center gap-1 font-sans text-[14px] leading-[1.2] font-semibold tracking-[-0.01em] text-white light:text-zinc-950">
                    {title}
                    <ChevronRight
                      className="size-4 -translate-y-px text-white/0 transition-colors group-hover:text-white/70 light:group-hover:text-zinc-600"
                      strokeWidth={1.9}
                      aria-hidden
                    />
                  </span>
                  <span className="mt-0.5 block font-sans text-[13px] leading-5 text-white/52 light:text-zinc-600">{body}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <ul className="mt-16 grid gap-8 border-t border-white/8 pt-8 md:grid-cols-2 xl:grid-cols-4 light:border-black/[0.08]">
          {SUPPORT_LINKS.map(({ title, body, href, Icon }) => (
            <li key={title}>
              <Link to={href} className="group block">
                <span className="inline-flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] light:border-black/[0.08] light:bg-black/[0.03]">
                  <Icon className="size-4 text-white/74 light:text-zinc-700" strokeWidth={1.8} aria-hidden />
                </span>
                <p className="mt-3 font-sans text-[20px] font-semibold tracking-[-0.02em] text-white light:text-zinc-950">{title}</p>
                <p className="mt-2 max-w-[26ch] font-sans text-[17px] leading-6 text-white/52 transition-colors group-hover:text-white/62 light:text-zinc-600 light:group-hover:text-zinc-700">
                  {body}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

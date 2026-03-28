import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Copy } from "lucide-react";
import { cn } from "@jokuh/gooey";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const kw = "text-[#DF3079]";
const fn = "text-[#2E95D3]";
const str = "text-[#05A57E]";
const id = "text-[#E9950D]";
const w = "text-white/90 light:text-zinc-900";
const op = "text-white/70 light:text-zinc-700";
const cm = "text-white/32 light:text-zinc-400";

type CodeTab = { label: string; lines: ReactNode; raw: string };

function CodeBlock({ tabs }: { tabs: readonly CodeTab[] }) {
  const [active, setActive] = useState(0);
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
    navigator.clipboard.writeText(tabs[active].raw).then(() => {
      setCopied(true);
      if (timer.current !== null) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => setCopied(false), 1800);
    });
  }, [active, tabs]);

  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-white/[0.07] bg-[#111214] light:border-black/[0.08] light:bg-zinc-50">
      <header className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2 light:border-black/[0.06]">
        <div className="flex gap-1">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "rounded-md px-2.5 py-1 font-sans text-[12px] font-medium transition-colors",
                i === active
                  ? "bg-white/[0.08] text-white light:bg-black/[0.08] light:text-zinc-950"
                  : "text-white/40 hover:text-white/65 light:text-zinc-500 light:hover:text-zinc-800",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 font-sans text-[11px] font-medium text-white/35 transition-colors hover:text-white/65 light:text-zinc-500 light:hover:text-zinc-800"
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </header>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-7">
        <code>
          <table className="border-collapse">
            <tbody>{tabs[active].lines}</tbody>
          </table>
        </code>
      </pre>
    </div>
  );
}

function L({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <tr>
      <td className={`${cm} select-none pr-4 text-right align-top`}>{n}</td>
      <td>{children}</td>
    </tr>
  );
}

function LinkCard({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      to={href}
      className="group flex items-center justify-between rounded-lg border border-white/[0.07] bg-white/[0.02] px-4 py-3 transition-colors hover:bg-white/[0.04] light:border-black/[0.08] light:bg-black/[0.02] light:hover:bg-black/[0.04]"
    >
      <span className="font-sans text-[13px] font-medium text-white/72 group-hover:text-white/90 light:text-zinc-700 light:group-hover:text-zinc-950">{children}</span>
      <ArrowRight className="size-4 text-white/30 transition-colors group-hover:text-white/60 light:text-zinc-400 light:group-hover:text-zinc-700" strokeWidth={1.8} />
    </Link>
  );
}

const apiKeyMac = (
  <>
    <L n={1}><span className={kw}>export</span> <span className={id}>JOKUH_API_KEY</span><span className={op}>=</span><span className={str}>"your_api_key_here"</span></L>
  </>
);

const apiKeyWin = (
  <>
    <L n={1}><span className={id}>setx</span> <span className={id}>JOKUH_API_KEY</span> <span className={str}>"your_api_key_here"</span></L>
  </>
);

const installNpm = (
  <>
    <L n={1}><span className={id}>npm</span> <span className={id}>install</span> <span className={str}>@jokuh/sdk</span></L>
  </>
);

const installPip = (
  <>
    <L n={1}><span className={id}>pip</span> <span className={id}>install</span> <span className={str}>jokuh</span></L>
  </>
);

const firstRequestJs = (
  <>
    <L n={1}><span className={kw}>import</span> <span className={w}>Jokuh</span> <span className={kw}>from</span> <span className={str}>"@jokuh/sdk"</span><span className={op}>;</span></L>
    <L n={2}><span className={kw}>const</span> <span className={w}>client</span> <span className={op}>=</span> <span className={kw}>new</span> <span className={fn}>Jokuh</span><span className={op}>();</span></L>
    <L n={3}> </L>
    <L n={4}><span className={kw}>const</span> <span className={w}>response</span> <span className={op}>=</span> <span className={kw}>await</span> <span className={w}>client</span><span className={op}>.</span><span className={w}>responses</span><span className={op}>.</span><span className={fn}>create</span><span className={op}>({"{"}</span></L>
    <L n={5}>{"  "}<span className={w}>model</span><span className={op}>:</span> <span className={str}>"pods-core"</span><span className={op}>,</span></L>
    <L n={6}>{"  "}<span className={w}>input</span><span className={op}>:</span> <span className={str}>"Summarize these support notes and list blockers."</span><span className={op}>,</span></L>
    <L n={7}><span className={op}>{"}"});</span></L>
    <L n={8}> </L>
    <L n={9}><span className={id}>console</span><span className={op}>.</span><span className={fn}>log</span><span className={op}>(</span><span className={w}>response</span><span className={op}>.</span><span className={w}>output_text</span><span className={op}>);</span></L>
  </>
);

const firstRequestPy = (
  <>
    <L n={1}><span className={kw}>from</span> <span className={w}>jokuh</span> <span className={kw}>import</span> <span className={w}>Jokuh</span></L>
    <L n={2}><span className={w}>client</span> <span className={op}>=</span> <span className={fn}>Jokuh</span><span className={op}>()</span></L>
    <L n={3}> </L>
    <L n={4}><span className={w}>response</span> <span className={op}>=</span> <span className={w}>client</span><span className={op}>.</span><span className={w}>responses</span><span className={op}>.</span><span className={fn}>create</span><span className={op}>(</span></L>
    <L n={5}>{"    "}<span className={w}>model</span><span className={op}>=</span><span className={str}>"pods-core"</span><span className={op}>,</span></L>
    <L n={6}>{"    "}<span className={w}>input</span><span className={op}>=</span><span className={str}>"Summarize these support notes and list blockers."</span></L>
    <L n={7}><span className={op}>)</span></L>
    <L n={8}> </L>
    <L n={9}><span className={fn}>print</span><span className={op}>(</span><span className={w}>response</span><span className={op}>.</span><span className={w}>output_text</span><span className={op}>)</span></L>
  </>
);

export function DocsQuickstartPage() {
  useDocumentTitle("Quickstart — Jokuh");

  return (
    <article className="w-full max-w-[860px] pb-16">
      <header>
        <h1 className="font-sans text-[28px] font-semibold tracking-[-0.02em] text-white md:text-[32px] light:text-zinc-950">
          Quickstart
        </h1>
        <p className="mt-3 max-w-[64ch] font-sans text-[15px] leading-7 text-white/55 light:text-zinc-600">
          The Jokuh API provides a simple interface to state-of-the-art AI models for text generation, natural language
          processing, and more. Get started by creating an API key and running your first call.
        </p>
      </header>

      <section className="mt-10">
        <h2 className="font-sans text-[20px] font-semibold tracking-[-0.01em] text-white light:text-zinc-950">
          Create and export an API key
        </h2>
        <p className="mt-2 max-w-[60ch] font-sans text-[14px] leading-6 text-white/50 light:text-zinc-600">
          Create an API key in the dashboard, then export it as an environment variable so the SDK can find it
          automatically.
        </p>
        <CodeBlock
          tabs={[
            { label: "macOS / Linux", lines: apiKeyMac, raw: 'export JOKUH_API_KEY="your_api_key_here"' },
            { label: "Windows", lines: apiKeyWin, raw: 'setx JOKUH_API_KEY "your_api_key_here"' },
          ]}
        />
        <p className="mt-3 font-sans text-[13px] text-white/40 light:text-zinc-500">
          Jokuh SDKs are configured to automatically read your API key from the system environment.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-sans text-[20px] font-semibold tracking-[-0.01em] text-white light:text-zinc-950">
          Install the SDK and run an API call
        </h2>
        <p className="mt-2 max-w-[60ch] font-sans text-[14px] leading-6 text-white/50 light:text-zinc-600">
          Install the Jokuh package for your language, then make a request against the responses API.
        </p>
        <CodeBlock
          tabs={[
            { label: "npm", lines: installNpm, raw: "npm install @jokuh/sdk" },
            { label: "pip", lines: installPip, raw: "pip install jokuh" },
          ]}
        />
        <CodeBlock
          tabs={[
            { label: "JavaScript", lines: firstRequestJs, raw: 'import Jokuh from "@jokuh/sdk";\n\nconst client = new Jokuh();\n\nconst response = await client.responses.create({\n  model: "pods-core",\n  input: "Summarize these support notes and list blockers.",\n});\n\nconsole.log(response.output_text);' },
            { label: "Python", lines: firstRequestPy, raw: 'from jokuh import Jokuh\nclient = Jokuh()\n\nresponse = client.responses.create(\n    model="pods-core",\n    input="Summarize these support notes and list blockers."\n)\n\nprint(response.output_text)' },
          ]}
        />
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          <LinkCard href="/developers/docs/cookbook">
            Start building with the Responses API
          </LinkCard>
          <LinkCard href="/developers/docs/cookbook">
            Learn more about prompting and message roles
          </LinkCard>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-sans text-[20px] font-semibold tracking-[-0.01em] text-white light:text-zinc-950">
          Extend the model with tools
        </h2>
        <p className="mt-2 max-w-[60ch] font-sans text-[14px] leading-6 text-white/50 light:text-zinc-600">
          Give the model access to external data and functions by attaching tools. Use built-in tools like web search or
          define your own for calling APIs and integrating with third-party systems.
        </p>
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          <LinkCard href="/developers/sdk">
            Learn about built-in tools like web search and file search
          </LinkCard>
          <LinkCard href="/developers/sdk">
            Enable the model to call your own custom functions
          </LinkCard>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-sans text-[20px] font-semibold tracking-[-0.01em] text-white light:text-zinc-950">
          Build agents
        </h2>
        <p className="mt-2 max-w-[60ch] font-sans text-[14px] leading-6 text-white/50 light:text-zinc-600">
          Use the Jokuh platform to build agents capable of taking action on behalf of your users. Orchestrate
          multi-step workflows with the Pods runtime and the Agents SDK.
        </p>
        <div className="mt-4 grid gap-2">
          <LinkCard href="/pods">
            Learn how to use the Jokuh platform to build powerful AI agents
          </LinkCard>
        </div>
      </section>
    </article>
  );
}

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Check, Copy } from "lucide-react";
import { cn } from "@jokuh/gooey";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const kw = "text-[#DF3079] light:text-[#C01961]";
const str = "text-[#05A57E] light:text-[#087F63]";
const id = "text-[#E9950D] light:text-[#A76700]";
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
    <div className="mt-4 min-w-0 overflow-hidden rounded-lg border border-white/[0.07] bg-[#111214] light:border-black/[0.08] light:bg-section-grey-light">
      <header className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 sm:px-4">
        <div className="flex min-w-0 flex-wrap gap-1">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "rounded-md px-2.5 py-1 font-sans text-[12px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 light:focus-visible:outline-black/70",
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
          className="inline-flex h-8 shrink-0 items-center gap-1 rounded-md px-2 font-sans text-[11px] font-medium text-white/35 transition-colors hover:bg-white/[0.04] hover:text-white/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 light:text-zinc-500 light:hover:bg-black/[0.04] light:hover:text-zinc-800 light:focus-visible:outline-black/70"
          aria-label={`Copy ${tabs[active].label} code`}
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </header>
      <pre className="overflow-x-auto overscroll-x-contain px-3 py-4 font-mono text-[12px] leading-7 sm:px-4 sm:text-[13px]">
        <code>
          <table className="min-w-max border-collapse">
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
      <td className="whitespace-pre">{children}</td>
    </tr>
  );
}

function LinkCard({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      to={href}
      className="group flex min-h-11 min-w-0 items-center rounded-lg border border-white/[0.07] bg-white/[0.02] px-4 py-3 transition-colors hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 light:border-black/[0.08] light:bg-section-grey-light light:hover:bg-zinc-200 light:focus-visible:outline-black/70"
    >
      <span className="min-w-0 font-sans text-[13px] font-medium leading-5 text-white/72 group-hover:text-white/90 light:text-zinc-700 light:group-hover:text-zinc-950">{children}</span>
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

export function DocsQuickstartPage() {
  useDocumentTitle("Jokuh Quickstart");

  return (
    <article className="w-full max-w-[770px] pb-16">
      <header>
        <h1 className="font-sans text-[28px] font-semibold tracking-[0em] text-white md:text-[32px] light:text-zinc-950">
          Quickstart
        </h1>
        <p className="mt-3 max-w-[64ch] font-sans text-[15px] leading-7 text-white/55 light:text-zinc-600">
          The Jokuh API is still early, so this quickstart stays intentionally narrow. Create an API key, install the
          SDK, and run one simple request.
        </p>
      </header>

      <section className="mt-10">
        <h2 className="font-sans text-[20px] font-semibold tracking-[0em] text-white light:text-zinc-950">
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
        <h2 className="font-sans text-[20px] font-semibold tracking-[0em] text-white light:text-zinc-950">
          Install the SDK
        </h2>
        <p className="mt-2 max-w-[60ch] font-sans text-[14px] leading-6 text-white/50 light:text-zinc-600">
          SDK package names, registry access, and install commands are private during early access. We provide
          the correct language package and version after onboarding.
        </p>
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          <LinkCard href="/developers/docs/text">
            Start building with the Responses API
          </LinkCard>
          <LinkCard href="/developers/docs/structured-output">
            Learn about structured output
          </LinkCard>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-sans text-[20px] font-semibold tracking-[0em] text-white light:text-zinc-950">
          Extend the model with tools
        </h2>
        <p className="mt-2 max-w-[60ch] font-sans text-[14px] leading-6 text-white/50 light:text-zinc-600">
          Give the model access to external data and functions by attaching supported tools when they are enabled
          for your workspace.
        </p>
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          <LinkCard href="/developers/docs/sdk">
            Learn about the SDK surface
          </LinkCard>
          <LinkCard href="/developers/docs/audio">
            Prepare audio and transcript flows
          </LinkCard>
        </div>
      </section>
    </article>
  );
}

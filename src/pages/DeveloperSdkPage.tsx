import { cn } from "@jokuh/gooey";
import { SiteLink } from "../components/SiteLink";
import {
  TertiaryBreadcrumb,
  TertiaryClosingCta,
  TertiaryHubBody,
  TertiaryPageChrome,
  TertiaryPageHero,
  TertiaryQuickLinksGrid,
  TertiarySection,
} from "../components/system";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const SDK_LINKS = [
  {
    label: "Responses API",
    href: "/developers/docs/quickstart",
    description: "Use one request surface for text generation, tool use, and structured output.",
  },
  {
    label: "Streaming",
    href: "/developers/docs/quickstart",
    description: "Move tokens into the product as they happen without adding a second client contract.",
  },
  {
    label: "Function calling",
    href: "/developers/docs/cookbook",
    description: "Attach your own tools when the model needs to read or act outside its context window.",
  },
  {
    label: "Structured output",
    href: "/developers/docs/cookbook",
    description: "Constrain model output so it lands cleanly inside automation and product logic.",
  },
  {
    label: "Reasoning",
    href: "/developers/docs/models",
    description: "Choose the heavier runtime only when the task actually needs deeper chain depth.",
  },
  {
    label: "Audio",
    href: "/developers/docs/cookbook",
    description: "Use one SDK surface for transcription, speech generation, and multimodal flows.",
  },
] as const;

const SDK_PILLARS = [
  {
    title: "One runtime path",
    body: "The SDK keeps requests, tools, and output shaping on one surface so product teams do not wire three incompatible flows.",
  },
  {
    title: "Production-readable defaults",
    body: "Auth, request shape, and response parsing stay explicit so engineers can audit behavior without reading framework glue first.",
  },
  {
    title: "Reference close to shipping work",
    body: "Quickstart, cookbook, and model guidance stay adjacent so the route from example to implementation stays short.",
  },
] as const;

function SdkCodeBlock({
  label,
  code,
}: {
  label: string;
  code: string;
}) {
  return (
    <div className="rounded-[28px] border border-light-space/[0.08] bg-white/[0.03] p-5 light:border-black/[0.08] light:bg-zinc-50 md:p-6">
      <p className="font-sans text-[12px] font-medium tracking-[0.12em] text-light-space/45 uppercase light:text-zinc-500">
        {label}
      </p>
      <pre className="mt-4 overflow-x-auto font-mono text-[13px] leading-7 text-light-space/85 light:text-zinc-800">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function DeveloperSdkPage() {
  useDocumentTitle("SDK & API — Jokuh Developers");

  return (
    <TertiaryPageChrome
      breadcrumb={
        <TertiaryBreadcrumb
          items={[
            { label: "Jokuh", to: "/" },
            { label: "Developers", to: "/developers/docs" },
            { label: "SDK & API" },
          ]}
        />
      }
    >
      <TertiaryPageHero
        eyebrow="Developers"
        title="Ship one clean SDK surface into production."
        intro="Jokuh SDK is built for the real path from first request to product logic: responses, tools, structured output, streaming, and reasoning without separate glue layers for every capability."
        actions={
          <>
            <SiteLink
              href="/developers/docs/quickstart"
              className="inline-flex h-11 items-center justify-center rounded-full border border-light-space/[0.12] px-5 text-[14px] font-medium text-light-space transition-colors hover:border-light-space/[0.22] hover:bg-white/[0.04] light:border-black/[0.12] light:text-zinc-950 light:hover:border-black/[0.18] light:hover:bg-zinc-100"
            >
              Open quickstart
            </SiteLink>
            <SiteLink
              href="/developers/docs/cookbook"
              className="inline-flex h-11 items-center justify-center rounded-full border border-light-space/[0.08] px-5 text-[14px] font-medium text-light-space/72 transition-colors hover:border-light-space/[0.18] hover:text-light-space light:border-black/[0.08] light:text-zinc-600 light:hover:border-black/[0.16] light:hover:text-zinc-950"
            >
              Browse cookbook
            </SiteLink>
          </>
        }
      />

      <TertiaryHubBody>
        <section className="border-b border-light-space/[0.08] py-12 light:border-black/[0.08] md:py-14">
          <div className="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)] md:gap-8">
            <h2 className="font-sans text-[20px] font-semibold tracking-[-0.03em] text-light-space light:text-zinc-950 md:text-[24px]">
              Start in minutes
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              <SdkCodeBlock label="Install" code={`npm install @jokuh/sdk\n\nexport JOKUH_API_KEY=\"your_api_key_here\"`} />
              <SdkCodeBlock
                label="First request"
                code={`import Jokuh from "@jokuh/sdk"\n\nconst client = new Jokuh()\n\nconst response = await client.responses.create({\n  model: "pods-core",\n  input: "Summarize this call and list blockers.",\n})\n\nconsole.log(response.output_text)`}
              />
            </div>
          </div>
        </section>

        <TertiarySection title="What the SDK covers">
          <TertiaryQuickLinksGrid links={[...SDK_LINKS]} columns={3} />
        </TertiarySection>

        <TertiarySection title="Why this page exists">
          <div className="grid gap-4 md:grid-cols-3">
            {SDK_PILLARS.map((pillar) => (
              <article
                key={pillar.title}
                className={cn(
                  "rounded-[28px] border border-light-space/[0.08] bg-white/[0.02] px-5 py-5 light:border-black/[0.08] light:bg-zinc-50",
                )}
              >
                <h3 className="font-sans text-[18px] font-semibold tracking-[-0.03em] text-light-space light:text-zinc-950">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-[14px] leading-[1.7] text-light-space/58 light:text-zinc-600">
                  {pillar.body}
                </p>
              </article>
            ))}
          </div>
        </TertiarySection>

        <TertiarySection title="Reference path">
          <p>
            Use Quickstart when you need the first request. Use Models when you are deciding between speed and reasoning
            depth. Use Cookbook when you are wiring tools, structured output, or production workflows around the core
            request surface.
          </p>
          <p>
            Keep this page as the narrow SDK entry point. It should explain the shape of the surface, not become a
            second docs hierarchy.
          </p>
        </TertiarySection>
      </TertiaryHubBody>

      <TertiaryClosingCta
        title="Move from install to a real request without extra product chrome."
        label="Read quickstart"
        href="/developers/docs/quickstart"
      />
    </TertiaryPageChrome>
  );
}

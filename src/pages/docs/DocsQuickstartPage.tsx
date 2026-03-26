import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export function DocsQuickstartPage() {
  useDocumentTitle("Quickstart — Jokuh");

  return (
    <article>
      <h1 className="font-sans text-[32px] font-semibold leading-tight tracking-tight text-light-space md:text-[40px]">
        Quickstart
      </h1>
      <p className="mt-5 max-w-[52ch] font-sans text-[15px] leading-relaxed text-light-space/60">
        Step-by-step setup, environment variables, and minimal examples will live in this section.
      </p>
      <pre className="mt-8 overflow-x-auto rounded-xl border border-light-glass-10 bg-[#0c0d12] p-4 font-mono text-[12px] leading-relaxed text-light-space/80 md:text-[13px]">
        <code>{`# coming soon
npm install @jokuh/sdk`}</code>
      </pre>
    </article>
  );
}

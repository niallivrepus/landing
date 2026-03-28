import { FUNDERS } from "../../data/funders";
import { CONTENT_SHELL_WIDE } from "../system/shells";

export function FundersStrip() {
  return (
    <section
      className="border-t border-light-space/[0.07] bg-dark-space px-4 py-10 light:border-black/[0.08] light:bg-white md:px-8 md:py-12"
      aria-label="Backed by"
    >
      <div className={CONTENT_SHELL_WIDE}>
        <p className="mb-6 text-center font-mono text-[11px] tracking-[0.28em] text-light-space/35 uppercase light:text-zinc-500 md:text-left">
          Backed by
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:justify-start">
          {FUNDERS.map((f) => (
            <li key={f.name}>
              <a
                href={f.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm font-medium text-light-space/60 transition-colors hover:text-light-space/90 light:text-zinc-600 light:hover:text-zinc-900 md:text-[15px]"
              >
                {f.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

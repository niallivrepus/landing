import { cn } from "@jokuh/gooey";
import { Check, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  DEFAULT_SITE_LANGUAGE,
  SITE_LANGUAGES,
  getActiveTranslateCode,
  matchesLanguageQuery,
} from "../data/site-languages";
import { applySiteLanguage, JOKUH_LANG_STORAGE_KEY } from "../lib/google-translate";

function currentSelectionKey(): string {
  try {
    const k = localStorage.getItem(JOKUH_LANG_STORAGE_KEY);
    if (k) return k;
  } catch {
    /* ignore */
  }
  const code = getActiveTranslateCode();
  if (!code) return DEFAULT_SITE_LANGUAGE.key;
  return SITE_LANGUAGES.find((l) => l.translateCode === code)?.key ?? DEFAULT_SITE_LANGUAGE.key;
}

export function LanguageSelectModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const selectedKey = useMemo(() => (open ? currentSelectionKey() : ""), [open]);

  useEffect(() => {
    if (!open) {
      setQ("");
      return;
    }
    const id = requestAnimationFrame(() => {
      searchRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const filtered = useMemo(() => SITE_LANGUAGES.filter((l) => matchesLanguageQuery(l, q)), [q]);

  if (!open) return null;

  return createPortal(
    <>
      <button
        type="button"
        className="fixed inset-0 z-[240] cursor-default bg-black/40 backdrop-blur-[3px] light:bg-black/25"
        aria-label="Close language menu"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="jokuh-lang-title"
        className={cn(
          "fixed z-[250] flex max-h-[min(88vh,720px)] w-[min(100vw-1.25rem,360px)] flex-col overflow-hidden rounded-2xl border border-light-space/10 bg-[#111214] text-light-space shadow-[0_20px_60px_rgba(0,0,0,0.4)] light:border-zinc-300/90 light:bg-zinc-200 light:text-zinc-950 light:shadow-[0_20px_60px_rgba(0,0,0,0.22)]",
          "bottom-4 right-3 md:bottom-auto md:top-1/2 md:right-5 md:-translate-y-1/2",
        )}
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-light-space/10 px-4 py-3.5 light:border-zinc-300/80">
          <h2 id="jokuh-lang-title" className="font-sans text-[17px] font-semibold tracking-tight">
            Select language
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-full text-light-space/55 transition-colors hover:bg-white/[0.08] hover:text-light-space light:text-zinc-600 light:hover:bg-zinc-300/60 light:hover:text-zinc-950"
            aria-label="Close"
          >
            <X className="size-[18px]" strokeWidth={2} />
          </button>
        </header>

        <ul
          className="min-h-0 flex-1 list-none overflow-y-auto overscroll-contain px-2 py-2"
          role="listbox"
          aria-label="Languages"
        >
          {filtered.map((lang) => {
            const selected = lang.key === selectedKey;
            const sub = lang.region ? `${lang.english} · ${lang.region}` : lang.english;
            return (
              <li key={lang.key} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => applySiteLanguage(lang)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                    selected
                      ? "bg-white/[0.08] light:bg-white/70"
                      : "hover:bg-white/[0.04] light:hover:bg-white/50",
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-sans text-[15px] font-semibold leading-snug">{lang.native}</span>
                    <span className="mt-0.5 block font-sans text-[13px] leading-snug text-light-space/55 light:text-zinc-600">{sub}</span>
                  </span>
                  {selected ? (
                    <Check className="mt-0.5 size-[18px] shrink-0 text-light-space light:text-zinc-900" strokeWidth={2.25} aria-hidden />
                  ) : (
                    <span className="size-[18px] shrink-0" aria-hidden />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="shrink-0 border-t border-light-space/10 p-3 light:border-zinc-300/80">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 size-[17px] -translate-y-1/2 text-light-space/45 light:text-zinc-500"
              strokeWidth={1.75}
              aria-hidden
            />
            <input
              ref={searchRef}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              autoComplete="off"
              className="w-full rounded-full border border-light-space/10 bg-white/[0.05] py-2.5 pr-3 pl-10 font-sans text-[14px] text-light-space placeholder:text-light-space/35 outline-none ring-white/20 focus:border-light-space/20 focus:ring-2 light:border-zinc-300/80 light:bg-zinc-100 light:text-zinc-900 light:placeholder:text-zinc-500 light:ring-zinc-400/40 light:focus:border-zinc-400"
            />
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}

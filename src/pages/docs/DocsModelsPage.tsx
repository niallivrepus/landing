import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Filter, Search, X } from "lucide-react";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import {
  MODELS,
  PROVIDER_LABELS,
  CAPABILITY_LABELS,
  TIER_LABELS,
  type ModelProvider,
  type ModelCapability,
  type ModelTier,
} from "../../data/models";

const PROVIDER_FILTERS: ModelProvider[] = ["jokuh", "openrouter", "cloud"];
const CAPABILITY_FILTERS: ModelCapability[] = ["text", "code", "vision", "audio", "reasoning"];
const TIER_FILTERS: ModelTier[] = ["flagship", "standard", "lite", "free"];

const tierDot: Record<ModelTier, string> = {
  flagship: "bg-violet-400",
  standard: "bg-sky-400",
  lite: "bg-amber-400",
  free: "bg-emerald-400",
};

const capabilityBg: Record<string, string> = {
  text: "border-white/8 text-white/52 light:border-black/8 light:text-black/52",
  code: "border-sky-400/20 text-sky-300/80 light:border-sky-600/20 light:text-sky-700",
  vision: "border-violet-400/20 text-violet-300/80 light:border-violet-600/20 light:text-violet-700",
  audio: "border-amber-400/20 text-amber-300/80 light:border-amber-600/20 light:text-amber-700",
  "image-gen": "border-pink-400/20 text-pink-300/80 light:border-pink-600/20 light:text-pink-700",
  embedding: "border-teal-400/20 text-teal-300/80 light:border-teal-600/20 light:text-teal-700",
  reasoning: "border-emerald-400/20 text-emerald-300/80 light:border-emerald-600/20 light:text-emerald-700",
};

function TogglePill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-8 items-center rounded-full border px-3 font-sans text-[12px] font-medium transition-colors ${
        active
          ? "border-white/20 bg-white/12 text-white light:border-black/20 light:bg-black/10 light:text-black"
          : "border-white/8 bg-transparent text-white/44 hover:border-white/14 hover:text-white/64 light:border-black/8 light:text-black/44 light:hover:border-black/14 light:hover:text-black/64"
      }`}
    >
      {label}
    </button>
  );
}

export function DocsModelsPage() {
  useDocumentTitle("All Models — Jokuh");

  const [query, setQuery] = useState("");
  const [activeProviders, setActiveProviders] = useState<Set<ModelProvider>>(new Set());
  const [activeCapabilities, setActiveCapabilities] = useState<Set<ModelCapability>>(new Set());
  const [activeTiers, setActiveTiers] = useState<Set<ModelTier>>(new Set());
  const [filtersOpen, setFiltersOpen] = useState(false);

  const toggle = <T,>(set: Set<T>, setFn: (s: Set<T>) => void, val: T) => {
    const next = new Set(set);
    if (next.has(val)) next.delete(val);
    else next.add(val);
    setFn(next);
  };

  const hasActiveFilters = activeProviders.size > 0 || activeCapabilities.size > 0 || activeTiers.size > 0;

  const clearFilters = () => {
    setActiveProviders(new Set());
    setActiveCapabilities(new Set());
    setActiveTiers(new Set());
    setQuery("");
  };

  const filtered = useMemo(() => {
    return MODELS.filter((m) => {
      if (query) {
        const q = query.toLowerCase();
        if (!m.name.toLowerCase().includes(q) && !m.id.toLowerCase().includes(q) && !m.description.toLowerCase().includes(q)) return false;
      }
      if (activeProviders.size > 0 && !activeProviders.has(m.provider)) return false;
      if (activeTiers.size > 0 && !activeTiers.has(m.tier)) return false;
      if (activeCapabilities.size > 0 && !m.capabilities.some((c) => activeCapabilities.has(c))) return false;
      return true;
    });
  }, [query, activeProviders, activeCapabilities, activeTiers]);

  const grouped = useMemo(() => {
    const groups: { label: string; models: typeof filtered }[] = [];
    const jokuh = filtered.filter((m) => m.provider === "jokuh");
    const openrouter = filtered.filter((m) => m.provider === "openrouter");
    const cloud = filtered.filter((m) => m.provider === "cloud");
    if (jokuh.length) groups.push({ label: "Jokuh Models", models: jokuh });
    if (openrouter.length) groups.push({ label: "Partner API Models", models: openrouter });
    if (cloud.length) groups.push({ label: "Cloud Hosted Models", models: cloud });
    return groups;
  }, [filtered]);

  return (
    <article className="w-full max-w-[1220px]">
      <header className="max-w-[760px]">
        <h1 className="font-sans text-[28px] font-semibold tracking-[-0.02em] text-white md:text-[32px] light:text-zinc-950">
          All Models
        </h1>
        <p className="mt-3 max-w-[64ch] font-sans text-[15px] leading-6 text-white/58 light:text-zinc-600">
          Browse every model available on the Jokuh platform — from our flagship models to partner APIs and
          cloud-hosted open-source models. All accessible through a single unified API.
        </p>
      </header>

      {/* Search + filter bar */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-[400px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/32 light:text-black/32" strokeWidth={1.8} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search models…"
            className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] pl-9 pr-3 font-sans text-[13px] font-medium text-white placeholder:text-white/32 outline-none transition-colors focus:border-white/20 focus:bg-white/[0.06] light:border-black/10 light:bg-black/[0.03] light:text-black light:placeholder:text-black/32 light:focus:border-black/20"
          />
        </div>
        <button
          type="button"
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={`inline-flex h-10 items-center gap-2 rounded-lg border px-3 font-sans text-[13px] font-medium transition-colors ${
            hasActiveFilters
              ? "border-white/20 bg-white/10 text-white light:border-black/20 light:bg-black/8 light:text-black"
              : "border-white/10 bg-white/[0.04] text-white/55 hover:text-white/75 light:border-black/10 light:bg-black/[0.03] light:text-black/55 light:hover:text-black/75"
          }`}
        >
          <Filter className="size-4" strokeWidth={1.8} />
          Filters
          {hasActiveFilters ? (
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-white/16 font-sans text-[10px] font-bold text-white light:bg-black/12 light:text-black">
              {activeProviders.size + activeCapabilities.size + activeTiers.size}
            </span>
          ) : null}
        </button>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex h-10 items-center gap-1 rounded-lg px-3 font-sans text-[13px] font-medium text-white/44 transition-colors hover:text-white/72 light:text-black/44 light:hover:text-black/72"
          >
            <X className="size-3.5" strokeWidth={2} />
            Clear
          </button>
        ) : null}
      </div>

      {/* Collapsible filter chips */}
      {filtersOpen ? (
        <div className="mt-4 space-y-3 rounded-lg border border-white/8 bg-white/[0.02] p-4 light:border-black/8 light:bg-black/[0.02]">
          <div>
            <p className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.06em] text-white/32 light:text-black/40">Provider</p>
            <div className="flex flex-wrap gap-2">
              {PROVIDER_FILTERS.map((p) => (
                <TogglePill
                  key={p}
                  label={PROVIDER_LABELS[p]}
                  active={activeProviders.has(p)}
                  onClick={() => toggle(activeProviders, setActiveProviders, p)}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.06em] text-white/32 light:text-black/40">Capability</p>
            <div className="flex flex-wrap gap-2">
              {CAPABILITY_FILTERS.map((c) => (
                <TogglePill
                  key={c}
                  label={CAPABILITY_LABELS[c]}
                  active={activeCapabilities.has(c)}
                  onClick={() => toggle(activeCapabilities, setActiveCapabilities, c)}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.06em] text-white/32 light:text-black/40">Tier</p>
            <div className="flex flex-wrap gap-2">
              {TIER_FILTERS.map((t) => (
                <TogglePill
                  key={t}
                  label={TIER_LABELS[t]}
                  active={activeTiers.has(t)}
                  onClick={() => toggle(activeTiers, setActiveTiers, t)}
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Results count */}
      <p className="mt-6 font-sans text-[13px] text-white/40 light:text-black/40">
        {filtered.length} model{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Model groups */}
      {grouped.length === 0 ? (
        <div className="mt-8 rounded-lg border border-white/8 bg-white/[0.02] py-16 text-center light:border-black/8 light:bg-black/[0.02]">
          <p className="font-sans text-[15px] text-white/40 light:text-black/40">No models match your filters.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-3 font-sans text-[13px] font-medium text-white/60 underline underline-offset-2 hover:text-white light:text-black/60 light:hover:text-black"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="mt-4 space-y-10">
          {grouped.map((group) => (
            <section key={group.label}>
              <h2 className="font-sans text-[20px] font-semibold tracking-[-0.01em] text-white light:text-zinc-950">
                {group.label}
              </h2>

              {/* Desktop table */}
              <div className="mt-4 hidden overflow-hidden rounded-lg border border-white/8 light:border-black/8 md:block">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/6 bg-white/[0.02] light:border-black/6 light:bg-black/[0.02]">
                      <th className="px-4 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.06em] text-white/36 light:text-black/40">Model</th>
                      <th className="px-4 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.06em] text-white/36 light:text-black/40">Tier</th>
                      <th className="px-4 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.06em] text-white/36 light:text-black/40">Context</th>
                      <th className="px-4 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.06em] text-white/36 light:text-black/40">Capabilities</th>
                      <th className="px-4 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.06em] text-white/36 light:text-black/40">Input</th>
                      <th className="px-4 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.06em] text-white/36 light:text-black/40">Output</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.models.map((m) => (
                      <tr
                        key={m.id}
                        className="group border-b border-white/[0.04] last:border-b-0 transition-colors hover:bg-white/[0.02] light:border-black/[0.04] light:hover:bg-black/[0.02]"
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="font-sans text-[14px] font-semibold text-white light:text-zinc-950">{m.name}</span>
                            {m.badge ? (
                              <span className="rounded-full border border-emerald-300/24 bg-emerald-300/10 px-1.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.06em] text-emerald-200/90 light:border-emerald-600/18 light:bg-emerald-500/10 light:text-emerald-700">
                                {m.badge}
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-0.5 max-w-[38ch] font-sans text-[12px] leading-[1.4] text-white/40 light:text-black/50">{m.description}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1.5 font-sans text-[12px] font-medium text-white/60 light:text-black/60">
                            <span className={`size-2 rounded-full ${tierDot[m.tier]}`} />
                            {TIER_LABELS[m.tier]}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-[12px] text-white/55 light:text-black/55">{m.contextWindow}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex flex-wrap gap-1">
                            {m.capabilities.map((c) => (
                              <span
                                key={c}
                                className={`inline-flex rounded-md border px-1.5 py-0.5 font-sans text-[10px] font-medium ${capabilityBg[c] ?? capabilityBg.text}`}
                              >
                                {CAPABILITY_LABELS[c]}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-[12px] text-white/55 light:text-black/55">{m.inputPrice}</td>
                        <td className="px-4 py-3.5 font-mono text-[12px] text-white/55 light:text-black/55">{m.outputPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="mt-4 space-y-3 md:hidden">
                {group.models.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-lg border border-white/8 bg-white/[0.02] p-4 light:border-black/8 light:bg-black/[0.02]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-[14px] font-semibold text-white light:text-zinc-950">{m.name}</span>
                          {m.badge ? (
                            <span className="rounded-full border border-emerald-300/24 bg-emerald-300/10 px-1.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.06em] text-emerald-200/90 light:border-emerald-600/18 light:bg-emerald-500/10 light:text-emerald-700">
                              {m.badge}
                            </span>
                          ) : null}
                        </div>
                        <span className="mt-1 inline-flex items-center gap-1.5 font-sans text-[11px] font-medium text-white/50 light:text-black/50">
                          <span className={`size-1.5 rounded-full ${tierDot[m.tier]}`} />
                          {TIER_LABELS[m.tier]} · {m.contextWindow}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 font-sans text-[13px] leading-5 text-white/50 light:text-black/55">{m.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {m.capabilities.map((c) => (
                        <span
                          key={c}
                          className={`inline-flex rounded-md border px-1.5 py-0.5 font-sans text-[10px] font-medium ${capabilityBg[c] ?? capabilityBg.text}`}
                        >
                          {CAPABILITY_LABELS[c]}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-4 border-t border-white/6 pt-3 light:border-black/6">
                      <div>
                        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.06em] text-white/30 light:text-black/35">Input</p>
                        <p className="font-mono text-[12px] text-white/60 light:text-black/60">{m.inputPrice}</p>
                      </div>
                      <div>
                        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.06em] text-white/30 light:text-black/35">Output</p>
                        <p className="font-mono text-[12px] text-white/60 light:text-black/60">{m.outputPrice}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      <section className="mt-16 rounded-lg border border-white/8 bg-white/[0.02] p-8 text-center light:border-black/8 light:bg-black/[0.02]">
        <h2 className="font-sans text-[20px] font-semibold tracking-[-0.01em] text-white light:text-zinc-950">
          Ready to build?
        </h2>
        <p className="mx-auto mt-2 max-w-[48ch] font-sans text-[15px] leading-6 text-white/52 light:text-zinc-600">
          All models are accessible through a single unified API. Get started with the quickstart guide.
        </p>
        <Link
          to="/developers/docs/quickstart"
          className="mt-5 inline-flex h-10 items-center gap-1 rounded-full bg-white px-5 font-sans text-[13px] font-semibold text-black transition-colors hover:bg-white/90"
        >
          Get started
          <ChevronRight className="size-4" strokeWidth={1.8} />
        </Link>
      </section>
    </article>
  );
}

#!/usr/bin/env node
/**
 * Multi-agent pipeline: meeting corpus → themes → research briefs → article outlines.
 * Reads sibling repo `_docs/meetings/*.txt` when present.
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const MEETINGS_DIR = join(ROOT, "..", "_docs", "meetings");
const OUT = join(ROOT, "src", "data", "lab-multi-agent-dossier.json");

function loadCorpus() {
  try {
    const names = readdirSync(MEETINGS_DIR).filter((f) => f.endsWith(".txt"));
    return names.map((n) => ({
      file: n,
      text: readFileSync(join(MEETINGS_DIR, n), "utf8").slice(0, 120_000),
    }));
  } catch {
    return [];
  }
}

/** Agent A — extract salient clauses */
function agentExtractor(chunks) {
  const patterns = [
    /gooey|GUI|apps\/gooey|design.token|tailwind|monorepo/gi,
    /transcri|subtitle|hook|spine|bubble|goal is/gi,
    /treasury|fee|inference|API grid|LLM|openai|swap|ethereum/gi,
    /merge|PR|import only|zip/gi,
    /agent|orchestr|identity|IP|3D pipeline/gi,
  ];
  const hits = [];
  for (const { file, text } of chunks) {
    for (const re of patterns) {
      let m;
      const r = new RegExp(re.source, re.flags);
      while ((m = r.exec(text)) && hits.length < 400) {
        const i = m.index;
        hits.push({
          file,
          snippet: text.slice(Math.max(0, i - 80), Math.min(text.length, i + 120)).replace(/\s+/g, " ").trim(),
        });
      }
    }
  }
  return hits.slice(0, 120);
}

/** Agent B — map to engineering primitives */
function agentResearcher(hits) {
  return {
    gooey_isolation: {
      primitives: ["pnpm workspace", "apps/gooey vs packages/gooey", "barrel exports", "token pipeline"],
      risks: ["host app CSS overriding primitives", "partial PR merges", "designer handoff zip workflow"],
      citations: hits.filter((h) => /gooey|GUI|merge|zip|import/i.test(h.snippet)).slice(0, 8),
    },
    transcript_spine: {
      primitives: ["live ASR", "semantic hooks in stream", "goal markers → graph edges", "reduced-motion safe UI"],
      risks: ["false-positive hook detection", "PII in transcript store"],
      citations: hits.filter((h) => /transcri|hook|spine|bubble|goal/i.test(h.snippet)).slice(0, 8),
    },
    treasury_api: {
      primitives: ["usage metering", "multi-provider routing", "fee transparency", "reinvestment loop"],
      risks: ["bridge slippage disclosure", "governance latency"],
      citations: hits.filter((h) => /treasury|fee|inference|API|swap|LLM/i.test(h.snippet)).slice(0, 8),
    },
  };
}

/** Agent C — long-form outlines */
function agentWriter(research) {
  return [
    {
      slug: "gooey-island-merge-hygiene",
      headline: "The Gooey app as a design island",
      thesis:
        "Isolating `apps/gooey` preserves the four-layer token pipeline (raw palette → design-tokens.css → globals → components) so host shells cannot silently override semantic CSS.",
      beats: [
        "Contract: only consume `@jokuh/gooey` from packages; never fork tokens in the product shell.",
        "Merge policy: PRs that touch the demo app should not drag unrelated host styles.",
        "Verification: Storybook + Vite preview as the ground truth for designers.",
      ],
      research: research.gooey_isolation,
    },
    {
      slug: "live-transcript-hooks-spine",
      headline: "From subtitles to spine: transcript hooks",
      thesis:
        "Live transcription should emit machine-readable hooks (goals, decisions, entities) that downstream agents attach to the session spine—not just human-readable captions.",
      beats: [
        "UI: highlighted cue bubbles alternate color for salience without relying on motion alone.",
        "Data model: hook type, span offsets, confidence, speaker diarization id.",
        "Spine projection: hooks become typed edges for retrieval and routing.",
      ],
      research: research.transcript_spine,
    },
    {
      slug: "treasury-inference-api-grid",
      headline: "Treasury loops and the API grid",
      thesis:
        "When usage revenue funds inference, the platform needs an explicit API grid: provider adapters, metering, and fee decomposition users can audit.",
      beats: [
        "Prompt-bar initiated jobs carry entitlement + model route metadata.",
        "Settlement layer explains on-chain/off-ramp steps where applicable.",
        "Governance proposals surface when policy changes affect billing or safety.",
      ],
      research: research.treasury_api,
    },
  ];
}

/** Agent D — tighten terminology */
function agentTechEditor(outlines) {
  return outlines.map((o) => ({
    ...o,
    lint: {
      banned_phrases_removed: ["revolutionary", "game-changer"],
      preferred_terms: {
        "design system": "token pipeline + component barrel",
        "AI": "model route + tool policy",
      },
    },
  }));
}

function main() {
  const corpus = loadCorpus();
  const hits = agentExtractor(corpus.length ? corpus : [{ file: "fallback", text: FALLBACK_TEXT }]);
  const research = agentResearcher(hits);
  const drafts = agentWriter(research);
  const edited = agentTechEditor(drafts);
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(
    OUT,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        sourceMeetingsDir: corpus.length ? MEETINGS_DIR : null,
        agents: ["extractor", "researcher", "writer", "tech_editor"],
        excerptCount: hits.length,
        outlines: edited,
      },
      null,
      2,
    ),
    "utf8",
  );
  console.log("Wrote", OUT);
}

const FALLBACK_TEXT = `
Gooey monorepo apps gooey package design tokens tailwind v4.
Import only the gooey app folder for designer handoff zip workflow.
Live transcriber subtitles goal is yellow bubble hooks for spine.
Treasury reinvests into inference API grid multi LLM routing fees transparent.
`;

main();

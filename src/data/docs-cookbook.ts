import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  FlaskConical,
  Layers,
  Mic,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

export type CookbookRecipe = {
  title: string;
  tags: string[];
  gradient: string;
  icon: LucideIcon;
  href?: string;
  external?: boolean;
};

export const COOKBOOK_RECIPES: CookbookRecipe[] = [
  {
    title: "End-to-end transcription pipeline",
    tags: ["Multimodal", "API"],
    gradient: "from-[#5b21b6]/95 to-[#1d4ed8]/95",
    icon: Mic,
  },
  {
    title: "Prompt patterns for reliable transcripts",
    tags: ["Guides", "Completions"],
    gradient: "from-[#6d28d9]/95 to-[#2563eb]/95",
    icon: Sparkles,
  },
  {
    title: "Evaluation loop for speech quality",
    tags: ["Evals", "Notebooks"],
    gradient: "from-[#5b21b6]/95 to-[#0ea5e9]/90",
    icon: FlaskConical,
  },
  {
    title: "Batch jobs and async webhooks",
    tags: ["API", "Functions"],
    gradient: "from-[#4c1d95]/95 to-[#1e40af]/95",
    icon: Workflow,
  },
  {
    title: "Guardrails and redaction in production",
    tags: ["Guardrails", "Safety"],
    gradient: "from-[#581c87]/95 to-[#1d4ed8]/95",
    icon: ShieldCheck,
  },
  {
    title: "Notebook: explore the SDK in Colab",
    tags: ["Notebooks", "Quickstart"],
    gradient: "from-[#6d28d9]/95 to-[#0284c7]/90",
    icon: BookOpen,
  },
  {
    title: "Layering models for language and diarization",
    tags: ["Architecture", "Multimodal"],
    gradient: "from-[#5b21b6]/95 to-[#0369a1]/90",
    icon: Layers,
  },
];

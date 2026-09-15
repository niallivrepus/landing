import {
  Bot,
  Brain,
  CircleDot,
  Gamepad2,
  Gauge,
  Image,
  Laptop,
  Layers,
  MessageCircle,
  Palette,
  PenLine,
  Phone,
  Rocket,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

/**
 * **Purpose:** Colour + glyph for a Shipped update, borrowed from the app's Spine hour-capsule tones
 * (`SPINE_HOUR_CAPSULE_GRADIENT` in jokuh-live `frontend/src/utils/spine-day-hour-capsule-visual.ts`).
 * Gradients run bottom → top like the app's capsules.
 */
type SpineTone = "memory" | "task" | "note" | "reminder" | "event" | "file" | "notification";

const TONE_GRADIENT: Record<SpineTone, [string, string]> = {
  memory: ["#7700ff", "#b200ff"],
  task: ["#2fff00", "#ebff00"],
  note: ["#fff500", "#ffc700"],
  reminder: ["#ff4d00", "#ff0970"],
  event: ["#ff4d00", "#ff6b00"],
  file: ["#0075ff", "#00ffff"],
  notification: ["#002fff", "#3d7eff"],
};

/** Bright tones need dark glyphs to stay legible. */
const DARK_INK_TONES = new Set<SpineTone>(["task", "note"]);

const AREA_TONE: Record<string, { tone: SpineTone; icon: LucideIcon }> = {
  Messaging: { tone: "notification", icon: MessageCircle },
  Calls: { tone: "event", icon: Phone },
  Spine: { tone: "memory", icon: Sparkles },
  Blurbs: { tone: "reminder", icon: PenLine },
  OO: { tone: "file", icon: Bot },
  Cortex: { tone: "file", icon: Brain },
  Arcade: { tone: "task", icon: Gamepad2 },
  Wallet: { tone: "task", icon: Wallet },
  Design: { tone: "note", icon: Palette },
  Profile: { tone: "note", icon: UserRound },
  People: { tone: "note", icon: Users },
  Bubbles: { tone: "memory", icon: CircleDot },
  Studio: { tone: "reminder", icon: Image },
  Mac: { tone: "notification", icon: Laptop },
  Performance: { tone: "event", icon: Gauge },
  Privacy: { tone: "file", icon: ShieldCheck },
  Onboarding: { tone: "reminder", icon: Rocket },
  Platform: { tone: "memory", icon: Layers },
};

export function shippedAreaVisual(area: string) {
  const { tone, icon } = AREA_TONE[area] ?? AREA_TONE.Platform;
  const [bottom, top] = TONE_GRADIENT[tone];
  return {
    icon,
    background: `linear-gradient(0deg, ${bottom}, ${top})`,
    ink: DARK_INK_TONES.has(tone) ? "#111111" : "#ffffff",
  };
}

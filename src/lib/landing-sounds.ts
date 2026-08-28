/**
 * **Purpose:** Central tuning for landing hover SFX — James Bond / premium spy palette.
 * **Connects to:** `gentle-hover-sfx.ts`, `useGentleHoverSound.ts`.
 *
 * Design voice: lower pitch, short decay, brushed metal / leather latch — never chirpy or arcade.
 */

/** Shared timing and safety rails for all landing hover sounds. */
export const LANDING_SOUND_GLOBAL = {
  /** Minimum gap between any two hover sounds (prevents chatter). */
  cooldownMs: 150,
  /** Per-element cooldown in the hook (slightly longer than global). */
  localCooldownMs: 220,
  /** Small scheduling offset so the graph is stable before playback. */
  scheduleLeadSec: 0.006,
  /** Pitch wobble — barely perceptible, keeps repeats from feeling robotic. */
  pitchDriftRange: 0.012,
  /** Noise buffer length for transient textures (seconds). */
  noiseBufferSec: 0.08,
  /** Peak noise amplitude inside the buffer (pre-filter). */
  noiseAmplitude: 0.22,
} as const;

/**
 * **gentle** — chrome pills (Nexus, Blurbs) and default nav CTAs.
 * Brushed-metal tick: muted band-pass noise + low sine thump, no upward shimmer.
 */
export const LANDING_SOUND_GENTLE = {
  /** Body tone — quiet latch in low mids. */
  bodyHz: 248,
  bodyEndHz: 210,
  bodyType: "sine" as OscillatorType,
  bodyGain: 0.62,
  bodyAttackSec: 0.004,
  bodyDecaySec: 0.09,
  /** Metallic tick — short filtered noise, not a bright pop. */
  tickGain: 0.36,
  tickAttackSec: 0.002,
  tickDecaySec: 0.055,
  tickBandpassHz: 980,
  tickBandpassQ: 1.6,
  /** Master envelope — clearly audible after branch gains without becoming a UI chirp. */
  masterPeak: 0.052,
  masterAttackSec: 0.003,
  masterReleaseSec: 0.11,
  /** Output low-pass — keeps top end restrained. */
  outputLowpassHz: 1400,
  outputLowpassQ: 0.45,
} as const;

/**
 * **premium** — high-intent CTAs (Get started, Download, product glow buttons).
 * Leather latch: soft mechanical body + restrained click transient, warmer than gentle.
 */
export const LANDING_SOUND_PREMIUM = {
  bodyHz: 312,
  bodyEndHz: 248,
  bodyType: "sine" as OscillatorType,
  bodyGain: 0.58,
  bodyAttackSec: 0.005,
  bodyDecaySec: 0.1,
  /** Quiet latch click at the front of the note. */
  clickGain: 0.34,
  clickAttackSec: 0.001,
  clickDecaySec: 0.028,
  clickHighpassHz: 680,
  clickHighpassQ: 0.7,
  /** Subtle air shift on release — not a cartoon whoosh. */
  airGain: 0.16,
  airAttackSec: 0.012,
  airDecaySec: 0.07,
  airLowpassHz: 620,
  airLowpassQ: 0.55,
  masterPeak: 0.06,
  masterAttackSec: 0.004,
  masterReleaseSec: 0.13,
  outputLowpassHz: 1200,
  outputLowpassQ: 0.4,
} as const;

export type LandingHoverSoundVariant = "gentle" | "premium";

import {
  LANDING_SOUND_GENTLE,
  LANDING_SOUND_GLOBAL,
  LANDING_SOUND_PREMIUM,
} from "./landing-sounds";

type HoverPlayKind = "gentle" | "premium";

let audioContext: AudioContext | null = null;
let unlockListenersBound = false;
let lastHoverAt = 0;
let noiseBuffer: AudioBuffer | null = null;
let pendingHoverPlay: HoverPlayKind | null = null;

function supportsGentleHoverSfx() {
  if (typeof window === "undefined") return false;
  if (typeof window.AudioContext === "undefined") return false;
  if (document.visibilityState !== "visible") return false;
  return true;
}

/** Reduced-motion no longer mutes audio; keep the diagnostic export stable for callers. */
export function isLandingHoverSoundMutedByReducedMotion() {
  return false;
}

function getAudioContext() {
  if (!supportsGentleHoverSfx()) return null;
  if (!audioContext) {
    audioContext = new window.AudioContext({ latencyHint: "interactive" });
  }
  return audioContext;
}

function removeUnlockListeners() {
  if (!unlockListenersBound || typeof window === "undefined") return;
  window.removeEventListener("pointerdown", resumeAudioContext, true);
  window.removeEventListener("mousedown", resumeAudioContext, true);
  window.removeEventListener("click", resumeAudioContext, true);
  window.removeEventListener("touchstart", resumeAudioContext, true);
  window.removeEventListener("keydown", resumeAudioContext, true);
  unlockListenersBound = false;
}

function flushPendingHoverPlay() {
  if (!pendingHoverPlay) return;
  const kind = pendingHoverPlay;
  pendingHoverPlay = null;
  if (kind === "premium") {
    playPremiumHoverSfx();
  } else {
    playGentleHoverSfx();
  }
}

/**
 * **Purpose:** Resume the shared AudioContext inside a trusted user-gesture handler chain.
 * **Connects to:** window unlock listeners, `useGentleHoverSound` pointerdown/click playback.
 * **Side effects:** Flushes one queued hover tick once browser autoplay policy allows audio.
 */
export function resumeLandingAudioContext() {
  const context = getAudioContext();
  if (!context) return;

  if (context.state === "running") {
    removeUnlockListeners();
    flushPendingHoverPlay();
    return;
  }

  void context.resume().then(() => {
    if (context.state === "running") {
      removeUnlockListeners();
      flushPendingHoverPlay();
    }
  }).catch(() => {});
}

function resumeAudioContext() {
  resumeLandingAudioContext();
}

function getNoiseBuffer(context: AudioContext) {
  if (noiseBuffer) return noiseBuffer;

  const length = Math.max(
    1,
    Math.floor(context.sampleRate * LANDING_SOUND_GLOBAL.noiseBufferSec),
  );
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const channel = buffer.getChannelData(0);
  const amp = LANDING_SOUND_GLOBAL.noiseAmplitude;

  for (let i = 0; i < length; i += 1) {
    channel[i] = (Math.random() * 2 - 1) * amp;
  }

  noiseBuffer = buffer;
  return buffer;
}

function pitchDrift() {
  return 1 + (Math.random() - 0.5) * LANDING_SOUND_GLOBAL.pitchDriftRange;
}

function scheduleMasterEnvelope(
  gain: GainNode,
  startAt: number,
  peak: number,
  attackSec: number,
  releaseSec: number,
) {
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.linearRampToValueAtTime(peak, startAt + attackSec);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + releaseSec);
}

function connectOutputChain(
  context: AudioContext,
  source: AudioNode,
  startAt: number,
  lowpassHz: number,
  lowpassQ: number,
) {
  const lowpass = context.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.setValueAtTime(lowpassHz, startAt);
  lowpass.Q.value = lowpassQ;
  source.connect(lowpass);
  lowpass.connect(context.destination);
  return lowpass;
}

function disconnectLater(nodes: AudioNode[], delayMs: number) {
  window.setTimeout(() => {
    nodes.forEach((node) => node.disconnect());
  }, delayMs);
}

function shouldPlayHoverSound(kind: HoverPlayKind) {
  const context = getAudioContext();
  if (!context) return null;

  if (context.state !== "running") {
    pendingHoverPlay = kind;
    primeGentleHoverSfx();
    resumeLandingAudioContext();
    return null;
  }

  const nowMs = performance.now();
  if (nowMs - lastHoverAt < LANDING_SOUND_GLOBAL.cooldownMs) return null;
  lastHoverAt = nowMs;
  return context;
}

/**
 * **Purpose:** Queue a specific hover sound before unlocking audio, so the first click can be audible.
 * **Connects to:** global pointer/click unlock listeners installed by `primeGentleHoverSfx`.
 */
function queueHoverSfxForUnlock(kind: HoverPlayKind) {
  pendingHoverPlay = kind;
  resumeLandingAudioContext();
}

export function primeGentleHoverSfx() {
  if (!supportsGentleHoverSfx() || unlockListenersBound) return;
  if (audioContext?.state === "running") return;

  unlockListenersBound = true;
  window.addEventListener("pointerdown", resumeAudioContext, { capture: true, passive: true });
  window.addEventListener("mousedown", resumeAudioContext, { capture: true, passive: true });
  window.addEventListener("click", resumeAudioContext, { capture: true, passive: true });
  window.addEventListener("touchstart", resumeAudioContext, { capture: true, passive: true });
  window.addEventListener("keydown", resumeAudioContext, { capture: true });
}

/**
 * **Purpose:** Play or queue the gentle chrome tick from element-level pointer handlers.
 * **Connects to:** `useGentleHoverSound` and the shared browser-policy unlock path.
 */
export function playLandingGentleHoverSfxFromGesture() {
  const context = getAudioContext();
  if (context?.state === "running") {
    playGentleHoverSfx();
    return;
  }
  queueHoverSfxForUnlock("gentle");
}

/**
 * **Purpose:** Play or queue the premium CTA latch from element-level pointer handlers.
 * **Connects to:** `useGentleHoverSound` and the shared browser-policy unlock path.
 */
export function playLandingPremiumHoverSfxFromGesture() {
  const context = getAudioContext();
  if (context?.state === "running") {
    playPremiumHoverSfx();
    return;
  }
  queueHoverSfxForUnlock("premium");
}

/**
 * Brushed-metal tick for chrome pills and default nav CTAs — muted, short, no shimmer sweep.
 */
export function playGentleHoverSfx() {
  const context = shouldPlayHoverSound("gentle");
  if (!context) return;

  const cfg = LANDING_SOUND_GENTLE;
  const startAt = context.currentTime + LANDING_SOUND_GLOBAL.scheduleLeadSec;
  const drift = pitchDrift();
  const nodes: AudioNode[] = [];

  const master = context.createGain();
  scheduleMasterEnvelope(
    master,
    startAt,
    cfg.masterPeak,
    cfg.masterAttackSec,
    cfg.masterReleaseSec,
  );
  nodes.push(master);

  const bodyOsc = context.createOscillator();
  const bodyGain = context.createGain();
  bodyOsc.type = cfg.bodyType;
  bodyOsc.frequency.setValueAtTime(cfg.bodyHz * drift, startAt);
  bodyOsc.frequency.exponentialRampToValueAtTime(
    Math.max(40, cfg.bodyEndHz * drift),
    startAt + cfg.bodyDecaySec,
  );
  bodyGain.gain.setValueAtTime(0.0001, startAt);
  bodyGain.gain.linearRampToValueAtTime(cfg.bodyGain, startAt + cfg.bodyAttackSec);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, startAt + cfg.bodyDecaySec);
  bodyOsc.connect(bodyGain);
  bodyGain.connect(master);
  nodes.push(bodyOsc, bodyGain);

  const tickNoise = context.createBufferSource();
  tickNoise.buffer = getNoiseBuffer(context);
  const tickBandpass = context.createBiquadFilter();
  tickBandpass.type = "bandpass";
  tickBandpass.frequency.setValueAtTime(cfg.tickBandpassHz, startAt);
  tickBandpass.Q.value = cfg.tickBandpassQ;
  const tickGain = context.createGain();
  tickGain.gain.setValueAtTime(0.0001, startAt);
  tickGain.gain.linearRampToValueAtTime(cfg.tickGain, startAt + cfg.tickAttackSec);
  tickGain.gain.exponentialRampToValueAtTime(0.0001, startAt + cfg.tickDecaySec);
  tickNoise.connect(tickBandpass);
  tickBandpass.connect(tickGain);
  tickGain.connect(master);
  nodes.push(tickNoise, tickBandpass, tickGain);

  const lowpass = connectOutputChain(
    context,
    master,
    startAt,
    cfg.outputLowpassHz,
    cfg.outputLowpassQ,
  );
  nodes.push(lowpass);

  const endAt = startAt + cfg.masterReleaseSec + 0.02;
  bodyOsc.start(startAt);
  tickNoise.start(startAt);
  bodyOsc.stop(endAt);
  tickNoise.stop(startAt + cfg.tickDecaySec + 0.01);

  disconnectLater(nodes, 220);
}

/**
 * Leather-latch hover for high-intent CTAs — warmer body, restrained mechanical click.
 */
export function playPremiumHoverSfx() {
  const context = shouldPlayHoverSound("premium");
  if (!context) return;

  const cfg = LANDING_SOUND_PREMIUM;
  const startAt = context.currentTime + LANDING_SOUND_GLOBAL.scheduleLeadSec;
  const drift = pitchDrift();
  const nodes: AudioNode[] = [];

  const master = context.createGain();
  scheduleMasterEnvelope(
    master,
    startAt,
    cfg.masterPeak,
    cfg.masterAttackSec,
    cfg.masterReleaseSec,
  );
  nodes.push(master);

  const bodyOsc = context.createOscillator();
  const bodyGain = context.createGain();
  bodyOsc.type = cfg.bodyType;
  bodyOsc.frequency.setValueAtTime(cfg.bodyHz * drift, startAt);
  bodyOsc.frequency.exponentialRampToValueAtTime(
    Math.max(40, cfg.bodyEndHz * drift),
    startAt + cfg.bodyDecaySec,
  );
  bodyGain.gain.setValueAtTime(0.0001, startAt);
  bodyGain.gain.linearRampToValueAtTime(cfg.bodyGain, startAt + cfg.bodyAttackSec);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, startAt + cfg.bodyDecaySec);
  bodyOsc.connect(bodyGain);
  bodyGain.connect(master);
  nodes.push(bodyOsc, bodyGain);

  const clickNoise = context.createBufferSource();
  clickNoise.buffer = getNoiseBuffer(context);
  const clickHighpass = context.createBiquadFilter();
  clickHighpass.type = "highpass";
  clickHighpass.frequency.setValueAtTime(cfg.clickHighpassHz, startAt);
  clickHighpass.Q.value = cfg.clickHighpassQ;
  const clickGain = context.createGain();
  clickGain.gain.setValueAtTime(0.0001, startAt);
  clickGain.gain.linearRampToValueAtTime(cfg.clickGain, startAt + cfg.clickAttackSec);
  clickGain.gain.exponentialRampToValueAtTime(0.0001, startAt + cfg.clickDecaySec);
  clickNoise.connect(clickHighpass);
  clickHighpass.connect(clickGain);
  clickGain.connect(master);
  nodes.push(clickNoise, clickHighpass, clickGain);

  const airNoise = context.createBufferSource();
  airNoise.buffer = getNoiseBuffer(context);
  const airLowpass = context.createBiquadFilter();
  airLowpass.type = "lowpass";
  airLowpass.frequency.setValueAtTime(cfg.airLowpassHz, startAt);
  airLowpass.Q.value = cfg.airLowpassQ;
  const airGain = context.createGain();
  const airStart = startAt + cfg.airAttackSec;
  airGain.gain.setValueAtTime(0.0001, airStart);
  airGain.gain.linearRampToValueAtTime(cfg.airGain, airStart + 0.008);
  airGain.gain.exponentialRampToValueAtTime(0.0001, airStart + cfg.airDecaySec);
  airNoise.connect(airLowpass);
  airLowpass.connect(airGain);
  airGain.connect(master);
  nodes.push(airNoise, airLowpass, airGain);

  const lowpass = connectOutputChain(
    context,
    master,
    startAt,
    cfg.outputLowpassHz,
    cfg.outputLowpassQ,
  );
  nodes.push(lowpass);

  const endAt = startAt + cfg.masterReleaseSec + 0.02;
  bodyOsc.start(startAt);
  clickNoise.start(startAt);
  airNoise.start(airStart);
  bodyOsc.stop(endAt);
  clickNoise.stop(startAt + cfg.clickDecaySec + 0.01);
  airNoise.stop(airStart + cfg.airDecaySec + 0.01);

  disconnectLater(nodes, 240);
}

/** @deprecated Use `playPremiumHoverSfx` — kept for import stability during retune. */
export function playBubblyIdentityHoverSfx() {
  playPremiumHoverSfx();
}

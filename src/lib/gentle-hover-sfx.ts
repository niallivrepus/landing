const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const GLOBAL_HOVER_COOLDOWN_MS = 140;

let audioContext: AudioContext | null = null;
let unlockListenersBound = false;
let lastHoverAt = 0;
let noiseBuffer: AudioBuffer | null = null;

function supportsGentleHoverSfx() {
  if (typeof window === "undefined") return false;
  if (typeof window.AudioContext === "undefined") return false;
  if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return false;
  if (document.visibilityState !== "visible") return false;
  return true;
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
  window.removeEventListener("touchstart", resumeAudioContext, true);
  window.removeEventListener("keydown", resumeAudioContext, true);
  unlockListenersBound = false;
}

function resumeAudioContext() {
  const context = getAudioContext();
  if (!context || context.state === "running") {
    removeUnlockListeners();
    return;
  }

  void context.resume().then(() => {
    if (context.state === "running") {
      removeUnlockListeners();
    }
  }).catch(() => {});
}

function getNoiseBuffer(context: AudioContext) {
  if (noiseBuffer) return noiseBuffer;

  const length = Math.max(1, Math.floor(context.sampleRate * 0.18));
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const channel = buffer.getChannelData(0);

  for (let i = 0; i < length; i += 1) {
    channel[i] = (Math.random() * 2 - 1) * 0.32;
  }

  noiseBuffer = buffer;
  return buffer;
}

export function primeGentleHoverSfx() {
  if (!supportsGentleHoverSfx() || unlockListenersBound) return;
  if (audioContext?.state === "running") return;

  unlockListenersBound = true;
  window.addEventListener("pointerdown", resumeAudioContext, { capture: true, passive: true });
  window.addEventListener("touchstart", resumeAudioContext, { capture: true, passive: true });
  window.addEventListener("keydown", resumeAudioContext, { capture: true });
}

export function playGentleHoverSfx() {
  const context = getAudioContext();
  if (!context || context.state !== "running") {
    primeGentleHoverSfx();
    return;
  }

  const nowMs = performance.now();
  if (nowMs - lastHoverAt < GLOBAL_HOVER_COOLDOWN_MS) return;
  lastHoverAt = nowMs;

  const startAt = context.currentTime + 0.008;
  const drift = 1 + (Math.random() - 0.5) * 0.018;

  const mainOsc = context.createOscillator();
  const shimmerOsc = context.createOscillator();
  const airNoise = context.createBufferSource();
  const mainBlend = context.createGain();
  const shimmerBlend = context.createGain();
  const airBlend = context.createGain();
  const lowpass = context.createBiquadFilter();
  const airLowpass = context.createBiquadFilter();
  const masterGain = context.createGain();

  mainOsc.type = "triangle";
  mainOsc.frequency.setValueAtTime(560 * drift, startAt);
  mainOsc.frequency.exponentialRampToValueAtTime(720 * drift, startAt + 0.24);

  shimmerOsc.type = "sine";
  shimmerOsc.frequency.setValueAtTime(860 * drift, startAt);
  shimmerOsc.frequency.exponentialRampToValueAtTime(1120 * drift, startAt + 0.2);

  airNoise.buffer = getNoiseBuffer(context);

  mainBlend.gain.setValueAtTime(0.96, startAt);
  shimmerBlend.gain.setValueAtTime(0.24, startAt);

  airBlend.gain.setValueAtTime(0.0001, startAt);
  airBlend.gain.linearRampToValueAtTime(0.0065, startAt + 0.012);
  airBlend.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.18);

  lowpass.type = "lowpass";
  lowpass.frequency.setValueAtTime(1850, startAt);
  lowpass.Q.value = 0.35;

  airLowpass.type = "lowpass";
  airLowpass.frequency.setValueAtTime(900, startAt);
  airLowpass.Q.value = 0.5;

  masterGain.gain.setValueAtTime(0.0001, startAt);
  masterGain.gain.linearRampToValueAtTime(0.042, startAt + 0.02);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.36);

  mainOsc.connect(mainBlend);
  mainBlend.connect(masterGain);

  shimmerOsc.connect(shimmerBlend);
  shimmerBlend.connect(masterGain);

  airNoise.connect(airLowpass);
  airLowpass.connect(airBlend);
  airBlend.connect(masterGain);

  masterGain.connect(lowpass);
  lowpass.connect(context.destination);

  mainOsc.start(startAt);
  shimmerOsc.start(startAt);
  airNoise.start(startAt);

  mainOsc.stop(startAt + 0.36);
  shimmerOsc.stop(startAt + 0.3);
  airNoise.stop(startAt + 0.2);

  window.setTimeout(() => {
    mainOsc.disconnect();
    shimmerOsc.disconnect();
    airNoise.disconnect();
    mainBlend.disconnect();
    shimmerBlend.disconnect();
    airBlend.disconnect();
    lowpass.disconnect();
    airLowpass.disconnect();
    masterGain.disconnect();
  }, 500);
}

/**
 * Very soft, airy hover — two quiet sine swells, warm mids, no edge.
 */
export function playBubblyIdentityHoverSfx() {
  const context = getAudioContext();
  if (!context || context.state !== "running") {
    primeGentleHoverSfx();
    return;
  }

  const nowMs = performance.now();
  if (nowMs - lastHoverAt < GLOBAL_HOVER_COOLDOWN_MS) return;
  lastHoverAt = nowMs;

  const startAt = context.currentTime + 0.006;
  const drift = 1 + (Math.random() - 0.5) * 0.018;

  const makeLayer = (
    offset: number,
    f0: number,
    fMid: number,
    gain: number,
  ) => {
    const t0 = startAt + offset;
    const osc = context.createOscillator();
    const g = context.createGain();
    const tint = context.createOscillator();
    const tintG = context.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(f0 * drift, t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(50, fMid * drift), t0 + 0.09);

    /** Breath-light detuned shimmer (+6¢), sine only */
    tint.type = "sine";
    tint.frequency.setValueAtTime(f0 * 1.006 * drift, t0);
    tint.frequency.exponentialRampToValueAtTime(Math.max(50, fMid * 1.006 * drift), t0 + 0.09);

    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.014);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.26);

    tintG.gain.setValueAtTime(0.0001, t0);
    tintG.gain.linearRampToValueAtTime(gain * 0.35, t0 + 0.014);
    tintG.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);

    return { osc, g, tint, tintG, t0, end: t0 + 0.3 };
  };

  const a = makeLayer(0, 360, 620, 0.02);
  const b = makeLayer(0.045, 480, 780, 0.012);

  const perLp = context.createBiquadFilter();
  perLp.type = "lowpass";
  perLp.frequency.setValueAtTime(1100, startAt);
  perLp.frequency.exponentialRampToValueAtTime(3400, startAt + 0.12);
  perLp.Q.value = 0.35;

  const master = context.createGain();
  /** ~4× quieter than previous bubbly preset */
  master.gain.setValueAtTime(0.19, startAt);

  a.osc.connect(a.g);
  a.tint.connect(a.tintG);
  a.g.connect(perLp);
  a.tintG.connect(perLp);

  b.osc.connect(b.g);
  b.tint.connect(b.tintG);
  b.g.connect(perLp);
  b.tintG.connect(perLp);

  perLp.connect(master);
  master.connect(context.destination);

  a.osc.start(a.t0);
  a.tint.start(a.t0);
  b.osc.start(b.t0);
  b.tint.start(b.t0);
  a.osc.stop(a.end);
  a.tint.stop(a.end);
  b.osc.stop(b.end);
  b.tint.stop(b.end);

  window.setTimeout(() => {
    a.osc.disconnect();
    a.g.disconnect();
    a.tint.disconnect();
    a.tintG.disconnect();
    b.osc.disconnect();
    b.g.disconnect();
    b.tint.disconnect();
    b.tintG.disconnect();
    perLp.disconnect();
    master.disconnect();
  }, 400);
}

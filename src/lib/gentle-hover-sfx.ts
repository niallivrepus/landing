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

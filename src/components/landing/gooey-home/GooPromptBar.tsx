import { forwardRef, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { GooFilter } from "./GooFilter";
import { GOO_ENV_PARAMS, GOO_ENV_SPRING, prefersReducedMotion, roleColor, springSettled, springStep, splexSpec, type GooScheme, type Spring } from "./goo-kit";
import { useGooLoop } from "./use-goo-loop";

const H = 60;
const PAD = 22;

/* Glyphs: the app home bar's own paths (jokuh-live `frontend/src/utils/icons.tsx`). */
function AddGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  );
}
function MicGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10.0005 15.8334C12.5634 15.8334 14.766 14.2907 15.7304 12.0834M10.0005 15.8334C7.43755 15.8334 5.23495 14.2907 4.27051 12.0834M10.0005 15.8334V17.7084M10.0005 13.125C8.04444 13.125 6.45878 11.5394 6.45878 9.58335V5.83335C6.45878 3.87735 8.04444 2.29169 10.0005 2.29169C11.9565 2.29169 13.5421 3.87735 13.5421 5.83335V9.58335C13.5421 11.5394 11.9565 13.125 10.0005 13.125Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function SubmitGlyph() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H15" />
      <path d="M14.9351 5.27643L17.3928 7.99539C19.335 10.1441 20.3061 11.2184 19.9143 12.1092C19.5225 13 18.0788 13 15.1915 13H15V14C15 15.4142 15 16.1213 14.5607 16.5607C14.1213 17 13.4142 17 12 17C10.5858 17 9.87868 17 9.43934 16.5607C9 16.1213 9 15.4142 9 14V13H8.80852C5.92117 13 4.47749 13 4.08568 12.1092C3.69387 11.2184 4.66499 10.1441 6.60724 7.99538L9.06495 5.27642C10.4367 3.75881 11.1226 3 12 3C12.8774 3 13.5633 3.75881 14.9351 5.27643Z" />
    </svg>
  );
}

type SpeechCtor = new () => {
  lang: string;
  interimResults: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

/**
 * **Purpose:** The app home's "ask anything" bar in goo: one Splex capsule (drawn by the goo filter, so it squishes
 * when pressed) with a + bead on the left and the mic bead on the right. Type and the mic bead turns into the go-green
 * send bead (Goo Lab "Composer": the mic is swallowed, send comes out). The mic dictates into the field where the
 * browser supports speech recognition; otherwise it focuses the field. No avatar: the app's bar has none.
 * **Parity (jokuh-live):** `frontend/src/components/home/SearchBar.tsx` (home bar: Add01 + composer mic + submit
 * glyphs), Goo Lab Composer (`gooey-labs/goo-lab-demos-messaging.tsx`), `Sources/liquid-search-bar.swift`.
 */
export const GooPromptBar = forwardRef<
  HTMLInputElement,
  {
    scheme: GooScheme;
    value: string;
    onChange: (v: string) => void;
    onSubmit: () => void;
    onPlus: () => void;
    placeholder: string;
    disabled?: boolean;
    busy?: boolean;
  }
>(function GooPromptBar({ scheme, value, onChange, onSubmit, onPlus, placeholder, disabled, busy }, inputRef) {
  const uid = useId().replace(/[:]/g, "");
  const wrapRef = useRef<HTMLFormElement>(null);
  const innerInput = useRef<HTMLInputElement | null>(null);
  const bodyRef = useRef<SVGRectElement>(null);
  const [w, setW] = useState(560);
  const [listening, setListening] = useState(false);
  const recRef = useRef<InstanceType<SpeechCtor> | null>(null);
  const ready = value.trim().length > 0 && !disabled;
  const sq = useRef<Spring>({ x: 1, v: 0 });
  const sqTarget = useRef(1);
  const wRef = useRef(w);
  wRef.current = w;

  const write = () => {
    const body = bodyRef.current;
    if (!body) return;
    const k = sq.current.x; // 1 = rest; < 1 = pressed flat
    const W = wRef.current * (1 + (1 - k) * 0.04);
    const hh = H * k;
    body.setAttribute("x", (PAD + (wRef.current - W) / 2).toFixed(2));
    body.setAttribute("y", (PAD + (H - hh) / 2).toFixed(2));
    body.setAttribute("width", W.toFixed(2));
    body.setAttribute("height", hh.toFixed(2));
    body.setAttribute("rx", (hh / 2).toFixed(2));
  };

  const loop = useGooLoop(wrapRef, (dt) => {
    sq.current = springStep(sq.current, sqTarget.current, GOO_ENV_SPRING, dt);
    write();
    return !springSettled(sq.current, sqTarget.current, 0.002);
  });

  const squish = () => {
    if (prefersReducedMotion()) return;
    sqTarget.current = 0.9;
    loop.wake();
    window.setTimeout(() => {
      sqTarget.current = 1;
      loop.wake();
    }, 120);
  };

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => setW(Math.round(el.getBoundingClientRect().width)));
    ro.observe(el);
    setW(Math.round(el.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    write();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w]);

  useEffect(() => () => recRef.current?.stop(), []);

  const dictate = () => {
    const w8 = window as unknown as { SpeechRecognition?: SpeechCtor; webkitSpeechRecognition?: SpeechCtor };
    const Ctor = w8.SpeechRecognition ?? w8.webkitSpeechRecognition;
    if (!Ctor) {
      innerInput.current?.focus();
      return;
    }
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const rec = new Ctor();
    rec.lang = navigator.language || "en-US";
    rec.interimResults = true;
    rec.onresult = (e) => {
      let text = "";
      for (let i = 0; i < e.results.length; i += 1) text += e.results[i]![0]!.transcript;
      onChange(text);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    rec.start();
  };

  const SW = w + PAD * 2;
  const SH = H + PAD * 2;
  return (
    <form
      ref={wrapRef}
      className="gh-ask"
      data-ready={ready || undefined}
      data-listening={listening || undefined}
      onPointerDown={squish}
      onSubmit={(e) => {
        e.preventDefault();
        if (ready && !busy) onSubmit();
      }}
    >
      <svg className="gh-ask__goo" width={SW} height={SH} viewBox={`0 0 ${SW} ${SH}`} aria-hidden>
        <defs>
          <GooFilter id={`gh-ask-${uid}`} x={0} y={0} width={SW} height={SH} spec={splexSpec(scheme)} params={GOO_ENV_PARAMS} />
        </defs>
        <g filter={`url(#gh-ask-${uid})`}>
          <rect ref={bodyRef} x={PAD} y={PAD} width={w} height={H} rx={H / 2} fill={roleColor(scheme, "base")} />
        </g>
      </svg>
      <button type="button" className="gh-ask__bead gh-ask__bead--plus" aria-label="Attach files in the Jokuh app" onClick={onPlus}>
        <AddGlyph />
      </button>
      <label className="sr-only" htmlFor={`gh-ask-input-${uid}`}>
        Ask OO
      </label>
      <input
        id={`gh-ask-input-${uid}`}
        ref={(el) => {
          innerInput.current = el;
          if (typeof inputRef === "function") inputRef(el);
          else if (inputRef) inputRef.current = el;
        }}
        className="gh-ask__input"
        placeholder={listening ? "Listening…" : placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        enterKeyHint="send"
        maxLength={600}
        disabled={disabled}
      />
      {ready ? (
        <button type="submit" className="gh-ask__bead gh-ask__bead--send" aria-label="Send to OO" disabled={busy}>
          <SubmitGlyph />
        </button>
      ) : (
        <button
          type="button"
          className="gh-ask__bead gh-ask__bead--mic"
          aria-label={listening ? "Stop dictation" : "Dictate"}
          aria-pressed={listening}
          onClick={dictate}
          disabled={disabled}
        >
          <MicGlyph />
        </button>
      )}
    </form>
  );
});

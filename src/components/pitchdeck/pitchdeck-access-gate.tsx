/**
 * @fileoverview Client-side access gate for `/pitchdeck`: requires a shared passphrase before
 * rendering children. Unlock is stored in `sessionStorage` only (clears when the tab closes);
 * this is not cryptographic security—suitable for casual sharing, not secrets.
 *
 * Used by `PitchDeckPage` so the deck and bundled PDF/video stay off casual crawlers
 * while remaining easy to demo after entering the password once per session.
 */
import { useCallback, useEffect, useId, useState, type FormEvent, type ReactNode } from "react";

/** `sessionStorage` key; bump if unlock semantics change. */
const PITCHDECK_ACCESS_STORAGE_KEY = "jokuh.pitchdeck.access.v1";

/** Opaque value written when the user passes the gate (not the password itself). */
const PITCHDECK_UNLOCK_TOKEN = "unlocked";

/** Passphrase required to view the pitch deck (product request; client-visible in bundle). */
const PITCHDECK_PASSWORD = "freedom";

/**
 * Returns true when this browser tab has already unlocked the pitch deck this session.
 */
function readPitchdeckUnlockedFromSession(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    return (
      window.sessionStorage.getItem(PITCHDECK_ACCESS_STORAGE_KEY) ===
      PITCHDECK_UNLOCK_TOKEN
    );
  } catch {
    return false;
  }
}

/**
 * Persists unlock for the remainder of the tab session (best-effort if storage is blocked).
 */
function writePitchdeckUnlockedToSession(): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.sessionStorage.setItem(
      PITCHDECK_ACCESS_STORAGE_KEY,
      PITCHDECK_UNLOCK_TOKEN
    );
  } catch {
    /* private mode / quota — gate still works in-memory via parent state */
  }
}

export type PitchdeckAccessGateProps = {
  /** Deck UI rendered only after a successful unlock for this session. */
  children: ReactNode;
};

/**
 * Renders a passphrase form until the user enters `PITCHDECK_PASSWORD`, then renders `children`.
 * Re-checks session storage on mount so refresh within the same tab does not re-prompt.
 */
export function PitchdeckAccessGate({ children }: PitchdeckAccessGateProps) {
  const labelId = useId();
  const errorId = useId();
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUnlocked(readPitchdeckUnlockedFromSession());
    setHydrated(true);
  }, []);

  const submit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const trimmed = input.trim();
      if (trimmed === PITCHDECK_PASSWORD) {
        writePitchdeckUnlockedToSession();
        setUnlocked(true);
        setError(null);
        setInput("");
        return;
      }
      setError("That passphrase is not correct.");
    },
    [input]
  );

  if (!hydrated) {
    return (
      <div
        className="flex min-h-dvh w-full max-w-[100vw] items-center justify-center text-[#111]"
        style={{
          backgroundColor: "rgb(237, 237, 237)",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
        aria-busy="true"
        aria-live="polite"
      >
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#111] border-t-transparent" />
      </div>
    );
  }

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div
      className="flex min-h-dvh w-full max-w-[100vw] flex-col items-center justify-center gap-6 px-6 text-[#111]"
      style={{
        backgroundColor: "rgb(237, 237, 237)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Pitch deck
        </h1>
        <p className="mt-2 text-sm text-[#555] sm:text-base">
          Enter the passphrase to continue.
        </p>
      </div>
      <form
        onSubmit={submit}
        className="flex w-full max-w-sm flex-col gap-3"
        aria-labelledby={labelId}
      >
        <label
          id={labelId}
          htmlFor="pitchdeck-access-passphrase"
          className="sr-only"
        >
          Passphrase
        </label>
        <input
          id="pitchdeck-access-passphrase"
          type="password"
          name="pitchdeck-passphrase"
          autoComplete="off"
          value={input}
          onChange={(ev) => {
            setInput(ev.target.value);
            if (error) setError(null);
          }}
          className="rounded-lg border border-black/15 bg-white px-4 py-3 text-base text-[#111] shadow-sm outline-none ring-0 transition-[box-shadow] focus:border-[#111] focus:shadow-[0_0_0_2px_rgba(0,0,0,0.08)]"
          placeholder="Passphrase"
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : undefined}
        />
        {error ? (
          <p
            id={errorId}
            className="text-center text-sm text-red-700"
            role="alert"
          >
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          className="rounded-full border border-[#111] bg-[#111] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-black"
        >
          Continue
        </button>
      </form>
    </div>
  );
}

import { useEffect } from "react";
import { initGoogleTranslateIfNeeded } from "../lib/google-translate";

type IdleCallbackHandle = number;
type IdleCallbackDeadline = {
  didTimeout: boolean;
  timeRemaining(): number;
};
type WindowWithIdleCallback = Window & {
  requestIdleCallback?: (
    callback: (deadline: IdleCallbackDeadline) => void,
    options?: { timeout?: number },
  ) => IdleCallbackHandle;
  cancelIdleCallback?: (handle: IdleCallbackHandle) => void;
};

/** Hidden widget + script load when `googtrans` cookie requests translation (set from `LanguageSelectModal`). */
export function GoogleTranslateHost() {
  useEffect(() => {
    const start = () => initGoogleTranslateIfNeeded();
    const win = window as WindowWithIdleCallback;

    if (typeof win.requestIdleCallback === "function" && typeof win.cancelIdleCallback === "function") {
      const idleId = win.requestIdleCallback(start, { timeout: 1200 });
      return () => win.cancelIdleCallback?.(idleId);
    }

    const timeoutId = window.setTimeout(start, 250);
    return () => window.clearTimeout(timeoutId);
  }, []);
  return (
    <div
      id="google_translate_element"
      className="pointer-events-none fixed bottom-0 left-0 z-0 h-0 w-0 overflow-hidden opacity-0"
      aria-hidden
    />
  );
}

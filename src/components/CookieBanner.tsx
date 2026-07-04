import { cn } from "@jokuh/gooey";
import { motion, AnimatePresence } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import {
  hasCookieConsentDecision,
  readCookiePrefsWithDefaults,
  saveCookieConsent,
  type CookiePrefs,
} from "../lib/cookie-consent";

export function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  const syncTogglesFromStorage = useCallback(() => {
    const p = readCookiePrefsWithDefaults();
    setAnalytics(p.analytics);
    setMarketing(p.marketing);
  }, []);

  useEffect(() => {
    if (!hasCookieConsentDecision()) {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    const onManage = () => {
      syncTogglesFromStorage();
      setCustomizing(true);
      setOpen(true);
    };
    window.addEventListener("jokuh-open-cookies", onManage);
    return () => window.removeEventListener("jokuh-open-cookies", onManage);
  }, [syncTogglesFromStorage]);

  const close = (prefs: CookiePrefs) => {
    saveCookieConsent(prefs);
    setOpen(false);
    setCustomizing(false);
  };

  const acceptAll = () => close({ analytics: true, marketing: true });
  const rejectOptional = () => close({ analytics: false, marketing: false });
  const savePrefs = () => close({ analytics, marketing });

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-labelledby="cookie-banner-title"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 bottom-0 z-[200] flex justify-center px-4 pb-4 sm:justify-start sm:px-6 sm:pb-6"
      >
        <div
          className={cn(
            "w-full max-w-[420px] rounded-2xl border border-white/10 bg-black/95 p-5 shadow-[0_16px_48px_rgba(0,0,0,0.6)] backdrop-blur-md",
            "text-light-space light:border-black/10 light:bg-white/95 light:text-zinc-900",
          )}
        >
          <p id="cookie-banner-title" className="font-sans text-[13px] leading-relaxed text-light-space/80 light:text-zinc-700">
            We use cookies for essential site function and, with your consent, analytics and marketing. See our{" "}
            privacy notice for details.
          </p>

          {customizing ? (
            <ul className="mt-4 space-y-3">
              <li className="flex items-center justify-between gap-3">
                <span className="font-sans text-[13px] text-light-space/70 light:text-zinc-600">
                  Analytics
                </span>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="size-[16px] cursor-pointer rounded border-white/25 bg-transparent accent-white light:border-zinc-300 light:accent-zinc-900"
                  aria-label="Analytics cookies"
                />
              </li>
              <li className="flex items-center justify-between gap-3">
                <span className="font-sans text-[13px] text-light-space/70 light:text-zinc-600">
                  Marketing
                </span>
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="size-[16px] cursor-pointer rounded border-white/25 bg-transparent accent-white light:border-zinc-300 light:accent-zinc-900"
                  aria-label="Marketing cookies"
                />
              </li>
            </ul>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            {customizing ? (
              <button
                type="button"
                onClick={savePrefs}
                className="flex h-9 flex-1 items-center justify-center rounded-full bg-white/92 font-sans text-[13px] font-semibold text-black transition-colors hover:bg-white light:bg-zinc-950 light:text-white light:hover:bg-zinc-800"
              >
                Save preferences
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={acceptAll}
                  className="flex h-9 flex-1 items-center justify-center rounded-full bg-white/92 font-sans text-[13px] font-semibold text-black transition-colors hover:bg-white light:bg-zinc-950 light:text-white light:hover:bg-zinc-800"
                >
                  Accept all
                </button>
                <button
                  type="button"
                  onClick={rejectOptional}
                  className="flex h-9 flex-1 items-center justify-center rounded-full border border-white/15 font-sans text-[13px] font-semibold text-light-space/80 transition-colors hover:bg-white/5 light:border-zinc-200 light:text-zinc-700 light:hover:bg-zinc-50"
                >
                  Reject optional
                </button>
                <button
                  type="button"
                  onClick={() => {
                    syncTogglesFromStorage();
                    setCustomizing(true);
                  }}
                  className="flex h-9 w-full items-center justify-center font-sans text-[12px] font-medium text-light-space/55 underline-offset-2 hover:underline light:text-zinc-500"
                >
                  Customize
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

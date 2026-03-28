import { cn } from "@jokuh/gooey";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "jokuh.cookieConsent";
const PREFS_KEY = "jokuh.cookiePreferences";

type Prefs = { analytics: boolean; marketing: boolean };

function readPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<Prefs>;
      return {
        analytics: typeof p.analytics === "boolean" ? p.analytics : true,
        marketing: typeof p.marketing === "boolean" ? p.marketing : true,
      };
    }
    const legacy = localStorage.getItem(STORAGE_KEY);
    if (legacy === "accepted") return { analytics: true, marketing: true };
    if (legacy === "declined") return { analytics: false, marketing: false };
  } catch {
    /* ignore */
  }
  return { analytics: true, marketing: true };
}

export function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  const syncTogglesFromStorage = useCallback(() => {
    const p = readPrefs();
    setAnalytics(p.analytics);
    setMarketing(p.marketing);
  }, []);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    const onManage = () => {
      syncTogglesFromStorage();
      setOpen(true);
    };
    window.addEventListener("jokuh-open-cookies", onManage);
    return () => window.removeEventListener("jokuh-open-cookies", onManage);
  }, [syncTogglesFromStorage]);

  useEffect(() => {
    if (open) syncTogglesFromStorage();
  }, [open, syncTogglesFromStorage]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      try {
        if (localStorage.getItem(STORAGE_KEY)) setOpen(false);
      } catch {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const saveDone = () => {
    const prefs: Prefs = { analytics, marketing };
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
      localStorage.setItem(STORAGE_KEY, "custom");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-preferences-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[32px] light:bg-black/[0.35]"
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "relative z-[1] w-full max-w-[440px] rounded-2xl border border-white/10 bg-[#0f1117] px-8 py-9 shadow-[0_24px_80px_rgba(0,0,0,0.5)] sm:px-10 sm:py-10",
          "text-light-space light:border-black/10 light:bg-white light:text-zinc-900",
        )}
      >
        <h2
          id="cookie-preferences-title"
          className="font-sans text-xl font-semibold leading-tight tracking-tight text-light-space light:text-zinc-950"
        >
          Cookie preferences center
        </h2>

        <p className="mt-4 font-sans text-[13px] leading-relaxed text-light-space/64 light:text-zinc-600">
          We use cookies to run the site, understand usage, and improve your experience. You can change optional
          categories anytime.{" "}
          <Link
            to="/legal/privacy"
            className="font-medium text-light-space underline decoration-light-space/30 underline-offset-[3px] hover:decoration-light-space/65 light:text-zinc-900 light:decoration-zinc-300 light:hover:decoration-zinc-500"
          >
            Learn more
          </Link>
        </p>

        <ul className="mt-8 space-y-0 divide-y divide-white/10 border-t border-white/10 light:divide-zinc-100 light:border-zinc-100">
          <li className="flex gap-3 py-5">
            <input
              type="checkbox"
              checked
              readOnly
              disabled
              tabIndex={-1}
              className="mt-0.5 size-[18px] shrink-0 cursor-not-allowed rounded border border-white/16 bg-white/10 accent-white light:border-zinc-200 light:bg-zinc-100 light:accent-zinc-900"
              aria-label="Strictly necessary cookies, always active"
            />
            <div className="min-w-0">
              <p className="font-sans text-[14px] font-semibold text-light-space light:text-zinc-950">
                Strictly necessary cookies{" "}
                <span className="font-normal text-light-space/55 light:text-zinc-500">(always active)</span>
              </p>
              <p className="mt-1 font-sans text-[12px] leading-relaxed text-light-space/52 light:text-zinc-500">
                Required for security, sign-in, and basic site function. These cannot be turned off.
              </p>
            </div>
          </li>

          <li className="flex gap-3 py-5">
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="mt-0.5 size-[18px] shrink-0 cursor-pointer rounded border-white/25 bg-transparent accent-white light:border-zinc-300 light:accent-zinc-900"
              aria-label="Analytics cookies"
            />
            <div className="min-w-0">
              <p className="font-sans text-[14px] font-semibold text-light-space light:text-zinc-950">Analytics cookies</p>
              <p className="mt-1 font-sans text-[12px] leading-relaxed text-light-space/52 light:text-zinc-500">
                Help us measure traffic and improve performance in aggregate.
              </p>
            </div>
          </li>

          <li className="flex gap-3 py-5">
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="mt-0.5 size-[18px] shrink-0 cursor-pointer rounded border-white/25 bg-transparent accent-white light:border-zinc-300 light:accent-zinc-900"
              aria-label="Marketing and performance cookies"
            />
            <div className="min-w-0">
              <p className="font-sans text-[14px] font-semibold text-light-space light:text-zinc-950">
                Marketing &amp; performance cookies
              </p>
              <p className="mt-1 font-sans text-[12px] leading-relaxed text-light-space/52 light:text-zinc-500">
                Used to deliver relevant content and measure campaigns where we run them.
              </p>
            </div>
          </li>
        </ul>

        <button
          type="button"
          onClick={saveDone}
          className="mt-8 flex h-11 w-full items-center justify-center rounded-full bg-white/92 font-sans text-[14px] font-semibold text-black transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none light:bg-zinc-950 light:text-white light:hover:bg-zinc-800 light:focus-visible:ring-zinc-950/30"
        >
          Done
        </button>
      </motion.div>
    </motion.div>
  );
}

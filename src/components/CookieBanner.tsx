import { cn } from "@jokuh/gooey";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import allowBlob from "../assets/cookie/allow-blob.svg";
import allowCheck from "../assets/cookie/allow-check.svg";
import charPixelA from "../assets/cookie/character-1.svg";
import charPixelB from "../assets/cookie/character-2.svg";
import charAstro from "../assets/cookie/character-astro.svg";
import nahBlob from "../assets/cookie/nah-blob.svg";
import nahX from "../assets/cookie/nah-x.svg";

const STORAGE_KEY = "jokuh.cookieConsent";

export function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [allowHovered, setAllowHovered] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  const save = (value: "accepted" | "declined") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore quota / private mode */
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <motion.div
      role="dialog"
      aria-label="Cookies"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-auto fixed bottom-4 left-4 z-[90] flex max-w-[calc(100vw-2rem)] flex-col items-end md:bottom-8 md:left-8"
    >
      <motion.div
        aria-hidden
        className="relative z-[1] mb-[-22px] w-full shrink-0 pr-6 md:mb-[-30px] md:pr-8"
        animate={
          allowHovered ? { y: 64, opacity: 0 } : { y: 0, opacity: 1 }
        }
        transition={{
          y: { type: "spring", stiffness: 380, damping: 26 },
          opacity: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
        }}
      >
        <div className="flex -translate-y-[calc(1.75rem-24px)] items-end justify-end gap-1 md:-translate-y-[calc(2.5rem-24px)]">
          <img src={charPixelA} alt="" className="h-7 w-auto max-w-none [image-rendering:pixelated]" />
          <img src={charPixelB} alt="" className="h-7 w-auto max-w-none [image-rendering:pixelated]" />
          <img src={charAstro} alt="" className="h-8 w-auto max-w-none md:h-9 [image-rendering:pixelated]" />
        </div>
      </motion.div>

      <div
        className={cn(
          "relative z-[2] flex min-h-[72px] w-full min-w-0 flex-wrap items-center gap-3 rounded-[72px] border border-white/10 py-2 pl-5 pr-2.5 md:gap-3 md:pl-6 md:pr-3",
          "shadow-[0px_10px_20px_rgba(0,0,0,0.1)]",
        )}
        style={{
          background:
            "radial-gradient(ellipse 1150px 140px at 0% 0%, #0a0a0a 0%, #000 100%)",
        }}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[72px]">
          <div
            className="landing-grain absolute inset-0 opacity-[0.12]"
            style={{ mixBlendMode: "color-dodge" }}
          />
        </div>

        <p className="relative z-[1] flex flex-wrap items-baseline gap-x-2 font-sans text-base leading-[1.4] font-bold whitespace-normal md:whitespace-nowrap">
          <span className="text-white/40">They got</span>
          <a
            href="/#journal"
            className="text-white underline decoration-solid [text-decoration-skip-ink:none]"
          >
            cookies
          </a>
          <span className="text-white/40">we shipping brownies</span>
        </p>

        <div className="relative z-[1] flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => save("declined")}
            className="relative flex h-[50px] shrink-0 items-center gap-2.5 rounded-full border-[1.5px] border-white/[0.05] bg-black/40 py-2 pr-3 pl-2 backdrop-blur-[10px]"
          >
            <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_2px_3px_rgba(255,255,255,0.15)]" />
            <span className="relative flex h-9 w-10 shrink-0 items-center justify-center">
              <img src={nahBlob} alt="" className="absolute inset-0 size-full max-w-none object-contain" />
              <img src={nahX} alt="" className="relative z-[1] size-[22px] max-w-none object-contain" />
              <span className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0.9px_0.9px_rgba(255,255,255,0.15)]" />
            </span>
            <span className="font-sans text-base font-bold text-white/40">Nah</span>
          </button>

          <button
            type="button"
            onClick={() => save("accepted")}
            onMouseEnter={() => setAllowHovered(true)}
            onMouseLeave={() => setAllowHovered(false)}
            className="relative flex h-[50px] shrink-0 items-center gap-2.5 rounded-full border-[1.5px] border-white/[0.05] bg-black/40 py-2 pr-4 pl-2 backdrop-blur-[10px]"
          >
            <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_2px_3px_rgba(255,255,255,0.15)]" />
            <motion.span
              className="relative flex h-9 w-10 shrink-0 items-center justify-center"
              style={{
                filter:
                  "drop-shadow(0 0 5.5px rgba(135,40,255,0.6)) drop-shadow(0 0 23px rgba(177,140,255,0.15))",
                transformOrigin: "45% 55%",
              }}
              animate={
                allowHovered
                  ? {
                      scaleX: 1.36,
                      scaleY: 0.8,
                      rotate: [-4, 4.5],
                      x: [0, 2.5, -1.5, 0],
                      y: [0, -1.5, 1, 0],
                    }
                  : {
                      scaleX: 1,
                      scaleY: 1,
                      rotate: 0,
                      x: 0,
                      y: 0,
                    }
              }
              transition={
                allowHovered
                  ? {
                      scaleX: { type: "spring", stiffness: 260, damping: 11 },
                      scaleY: { type: "spring", stiffness: 260, damping: 11 },
                      rotate: {
                        duration: 0.42,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                      },
                      x: {
                        duration: 0.38,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                      },
                      y: {
                        duration: 0.33,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                      },
                    }
                  : { type: "spring", stiffness: 440, damping: 30 }
              }
            >
              <img src={allowBlob} alt="" className="absolute inset-0 size-full max-w-none object-contain" />
              <img src={allowCheck} alt="" className="relative z-[1] size-[14px] max-w-none object-contain" />
            </motion.span>
            <span className="font-sans text-base font-bold text-white/85">Allow</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

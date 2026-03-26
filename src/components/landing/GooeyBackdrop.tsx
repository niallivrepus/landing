import { motion } from "motion/react";

export function GooeyBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <svg className="absolute h-0 w-0" aria-hidden>
        <defs>
          <filter id="landing-gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>
      <div
        className="absolute left-1/2 top-[8%] h-[min(480px,80vw)] w-[min(480px,80vw)] -translate-x-1/2 opacity-[0.22]"
        style={{ filter: "url(#landing-gooey)" }}
      >
        <motion.div
          className="absolute left-[10%] top-[18%] size-[48%] rounded-full bg-purple-5/45"
          animate={{ x: [0, 20, 0], y: [0, -14, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[6%] top-[30%] size-[44%] rounded-full bg-blue-5/40"
          animate={{ x: [0, -16, 0], y: [0, 18, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[8%] left-[26%] size-[36%] rounded-full bg-pink-5/35"
          animate={{ x: [0, -12, 0], y: [0, 12, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black light:from-white light:via-zinc-200/40 light:to-zinc-100" />
      <div className="landing-grain absolute inset-0 opacity-[0.04]" aria-hidden />
    </div>
  );
}

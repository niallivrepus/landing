import { cn } from "@jokuh/gooey";
import { ArrowUp } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export function WaitlistSection() {
  const [email, setEmail] = useState("");
  const hasText = email.trim().length > 0;

  return (
    <section id="start" className="scroll-mt-24 px-4 pb-28 pt-8 md:px-8 md:pb-36">
      <motion.div
        className="mx-auto w-full max-w-[min(calc(100vw-2rem),400px)] text-center md:max-w-[min(calc(100vw-4rem),770px)]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-sans text-xl font-semibold text-light-space md:text-2xl">
          Get a note when the next batch opens.
        </h2>
        <form className="mx-auto mt-8 w-full" onSubmit={(e) => e.preventDefault()}>
          <div
            className={cn(
              "relative flex h-[50px] items-center justify-between rounded-[9999px] border border-solid border-[#E0E0E0] bg-white/5 p-1 py-1 pl-1 pr-[5px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)] backdrop-blur-[25px]",
              "light:bg-white light:shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)]",
            )}
          >
            <input
              type="email"
              required
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-h-0 min-w-0 flex-1 border-none bg-transparent py-0 pr-2 pl-4 font-sans text-base font-normal leading-[1.4] text-light-space outline-none placeholder:text-light-space/50 md:pl-5"
            />
            <button
              type="submit"
              className={cn(
                "inline-flex size-[42px] shrink-0 items-center justify-center rounded-full transition-[background-color,color,opacity] duration-200 focus-visible:outline-none focus-visible:ring-2",
                hasText
                  ? "bg-black text-white hover:opacity-90 focus-visible:ring-white/40 light:bg-black light:text-white light:focus-visible:ring-white/35"
                  : "bg-[#F5F5F5] text-zinc-800 hover:bg-[#EBEBEB] focus-visible:ring-black/20 light:bg-[#F5F5F5] light:text-zinc-800 light:focus-visible:ring-black/25",
              )}
              aria-label="Notify me"
            >
              <ArrowUp className="size-5" strokeWidth={2} aria-hidden />
            </button>
            <div
              className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.15)]"
              aria-hidden
            />
          </div>
        </form>
      </motion.div>
    </section>
  );
}

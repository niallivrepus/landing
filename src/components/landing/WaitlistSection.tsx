import { cn } from "@jokuh/gooey";
import { ArrowUp } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  LANDING_PROMPT_INNER_SHADOW_CLASS,
  LANDING_PROMPT_INPUT_CLASS,
  LANDING_PROMPT_SEND_BUTTON_CLASS,
  LANDING_PROMPT_SHELL_CLASS,
} from "./promptChrome";

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
        <h2 className="font-sans text-xl font-semibold text-light-space light:text-zinc-950 md:text-2xl">
          Get a note when the next batch opens.
        </h2>
        <form className="mx-auto mt-8 w-full" onSubmit={(e) => e.preventDefault()}>
          <div
            className={cn(
              LANDING_PROMPT_SHELL_CLASS,
            )}
          >
            <input
              type="email"
              required
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={LANDING_PROMPT_INPUT_CLASS}
            />
            <button
              type="submit"
              className={cn(
                LANDING_PROMPT_SEND_BUTTON_CLASS,
                !hasText && "opacity-96",
              )}
              aria-label="Notify me"
            >
              <ArrowUp className="size-5" strokeWidth={2} aria-hidden />
            </button>
            <div
              className={LANDING_PROMPT_INNER_SHADOW_CLASS}
              aria-hidden
            />
          </div>
        </form>
      </motion.div>
    </section>
  );
}

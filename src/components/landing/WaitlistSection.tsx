import { cn } from "@jokuh/gooey";
import { ArrowUp, LoaderCircle } from "lucide-react";
import { motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { isValidMarketingEmail } from "../../lib/email-validation";
import {
  LANDING_PROMPT_INNER_SHADOW_CLASS,
  LANDING_PROMPT_INPUT_CLASS,
  LANDING_PROMPT_SEND_BUTTON_CLASS,
  LANDING_PROMPT_SHELL_CLASS,
} from "./promptChrome";

const CONTACT_SALES_ENDPOINT = import.meta.env.VITE_CONTACT_SALES_ENDPOINT?.trim() || "/api/contact-sales";

type WaitlistState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

/**
 * **Purpose:** Homepage email capture — posts to the contact-sales endpoint as a waitlist signup.
 * **Connects to:** `Home.tsx`, `contact-sales-service.ts` (`formKind: waitlist`).
 */
export function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<WaitlistState>({ kind: "idle" });
  const hasText = email.trim().length > 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidMarketingEmail(email)) {
      setState({ kind: "error", message: "Enter a real email, like you@company.com." });
      return;
    }
    setState({ kind: "submitting" });
    try {
      const response = await fetch(CONTACT_SALES_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formKind: "waitlist",
          workEmail: email.trim(),
          marketingOptIn: false,
          website: "",
        }),
      });
      const result = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;
      if (!response.ok) {
        throw new Error(result?.error || "We could not add that email right now.");
      }
      setEmail("");
      setState({
        kind: "success",
        message: result?.message || "You're on the list. We'll email you when the next batch opens.",
      });
    } catch (error) {
      setState({
        kind: "error",
        message: error instanceof Error ? error.message : "We could not add that email right now.",
      });
    }
  }

  return (
    <section id="start" className="scroll-mt-24 px-3 pb-28 pt-8 md:px-8 md:pb-36">
      <motion.div
        className="mx-auto w-full max-w-[min(calc(100vw-1.5rem),400px)] text-center md:max-w-[min(calc(100vw-4rem),770px)]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-sans text-xl font-semibold text-light-space light:text-zinc-950 md:text-2xl">
          Get a note when the next batch opens.
        </h2>
        <form className="mx-auto mt-8 w-full" onSubmit={handleSubmit}>
          <div className={cn(LANDING_PROMPT_SHELL_CLASS)}>
            <input
              type="email"
              required
              placeholder="Email"
              autoComplete="email"
              aria-label="Email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setState({ kind: "idle" });
              }}
              className={LANDING_PROMPT_INPUT_CLASS}
            />
            <button
              type="submit"
              disabled={state.kind === "submitting"}
              className={cn(LANDING_PROMPT_SEND_BUTTON_CLASS, !hasText && "opacity-96")}
              aria-label="Notify me"
            >
              {state.kind === "submitting" ? (
                <LoaderCircle className="size-5 animate-spin" strokeWidth={2} aria-hidden />
              ) : (
                <ArrowUp className="size-5" strokeWidth={2} aria-hidden />
              )}
            </button>
            <div className={LANDING_PROMPT_INNER_SHADOW_CLASS} aria-hidden />
          </div>
        </form>
        {state.kind === "success" || state.kind === "error" ? (
          <p
            role={state.kind === "error" ? "alert" : "status"}
            className={cn(
              "mt-4 font-sans text-[13px] leading-relaxed",
              state.kind === "success" ? "text-emerald-400 light:text-emerald-700" : "text-red-400 light:text-red-700",
            )}
          >
            {state.message}
          </p>
        ) : null}
      </motion.div>
    </section>
  );
}

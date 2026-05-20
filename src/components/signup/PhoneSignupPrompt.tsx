import { cn } from "@jokuh/gooey";
import { ArrowUp, ChevronDown } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  findPhoneCountry,
  formatPhoneE164,
  PHONE_COUNTRY_DIAL_CODES,
  type PhoneCountryCode,
} from "../../data/phone-countries";
import {
  LANDING_PROMPT_INNER_SHADOW_CLASS,
  LANDING_PROMPT_INPUT_CLASS,
  LANDING_PROMPT_SEND_BUTTON_CLASS,
  LANDING_PROMPT_SHELL_CLASS,
} from "../landing/promptChrome";

type PhoneSignupPromptProps = {
  className?: string;
  onSubmit?: (phoneE164: string) => void;
};

export function PhoneSignupPrompt({ className, onSubmit }: PhoneSignupPromptProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const countrySelectId = useId();
  const phoneInputId = useId();
  const [phoneCountry, setPhoneCountry] = useState<PhoneCountryCode>(() => {
    const fromQuery = searchParams.get("country");
    return (PHONE_COUNTRY_DIAL_CODES.some((entry) => entry.code === fromQuery) ? fromQuery : "us") as PhoneCountryCode;
  });
  const [localNumber, setLocalNumber] = useState(() => searchParams.get("phone") ?? "");
  const [status, setStatus] = useState<"idle" | "copied">("idle");
  const country = findPhoneCountry(phoneCountry);
  const hasText = localNumber.replace(/\D/g, "").length > 0;
  const phoneE164 = useMemo(() => formatPhoneE164(phoneCountry, localNumber), [phoneCountry, localNumber]);

  return (
    <form
      className={cn("w-full", className)}
      onSubmit={(event) => {
        event.preventDefault();
        if (!hasText) return;
        if (onSubmit) {
          onSubmit(phoneE164);
          return;
        }

        if (location.pathname !== "/signup" && location.pathname !== "/waitlist") {
          navigate(`/signup?country=${encodeURIComponent(phoneCountry)}&phone=${encodeURIComponent(localNumber)}`);
          return;
        }

        void navigator.clipboard
          .writeText(phoneE164)
          .then(() => setStatus("copied"))
          .catch(() => setStatus("idle"));
      }}
    >
      <div className={cn(LANDING_PROMPT_SHELL_CLASS, "gap-1 pl-1")}>
        <div className="relative flex h-[42px] shrink-0 items-center gap-1 rounded-full border border-solid border-[#3A3A3C] bg-[#1a1a1a]/90 pl-1 pr-2 light:border-[#E0E0E0] light:bg-zinc-100">
          <span
            className="grid size-8 place-items-center rounded-full bg-white/5 font-sans text-[11px] font-semibold uppercase tracking-wide text-light-space/70 light:bg-black/5 light:text-zinc-600"
            aria-hidden
          >
            {country.code}
          </span>
          <ChevronDown className="size-4 shrink-0 text-light-space/50 light:text-zinc-500" strokeWidth={2} aria-hidden />
          <select
            id={countrySelectId}
            className="absolute inset-0 cursor-pointer opacity-0"
            value={phoneCountry}
            onChange={(event) => setPhoneCountry(event.target.value as PhoneCountryCode)}
            aria-label="Country code"
          >
            {PHONE_COUNTRY_DIAL_CODES.map((entry) => (
              <option key={entry.code} value={entry.code}>
                {entry.name} ({entry.dial})
              </option>
            ))}
          </select>
        </div>

        <span className="shrink-0 pl-1 font-sans text-base text-light-space/55 light:text-zinc-500" aria-hidden>
          {country.dial}
        </span>

        <input
          id={phoneInputId}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          required
          placeholder="Phone number"
          value={localNumber}
          onChange={(event) => setLocalNumber(event.target.value)}
          className={cn(LANDING_PROMPT_INPUT_CLASS, "pl-2")}
          aria-label="Phone number"
        />

        <button
          type="submit"
          className={cn(LANDING_PROMPT_SEND_BUTTON_CLASS, !hasText && "opacity-96")}
          aria-label="Sign up"
          disabled={!hasText}
        >
          <ArrowUp className="size-5" strokeWidth={2} aria-hidden />
        </button>

        <div className={LANDING_PROMPT_INNER_SHADOW_CLASS} aria-hidden />
      </div>

      <p className="sr-only" aria-live="polite">
        {status === "copied" ? "Phone number copied to clipboard." : ""}
      </p>
    </form>
  );
}

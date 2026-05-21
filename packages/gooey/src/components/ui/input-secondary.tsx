import * as React from "react";

import { ViewIcon, ViewOffIcon, Alert02Icon, ArrowDown01Icon } from "hugeicons-react";
import { motion } from "motion/react";

import { cn } from "../../lib/utils";
import { SPRING_CONFIGS } from "../../lib/utils/animations";
import {
  getResponsiveWidthClass,
  type GooeyViewportInput,
  useGooeyViewport,
} from "../../lib/viewport";
import { IconOnlyButton } from "./icon-only-button";

type InputSecondaryVariant =
  | "default"
  | "email"
  | "credit-card"
  | "cvc"
  | "month"
  | "phone-number"
  | "verification"
  | "error"
  | "alert"
  | "dropdown"
  | "country";

interface InputSecondaryProps {
  variant?: InputSecondaryVariant;
  viewport?: GooeyViewportInput;
  isDesktop?: boolean;
  value?: string;
  placeholder?: string;
  label?: string;
  onChange?: (value: string) => void;
  errorMessage?: string;
  isPasswordVisible?: boolean;
  onToggleVisibility?: () => void;
  captchaSrc?: string;
  className?: string;
  disabled?: boolean;
  options?: Array<{ value: string; label: string; flag?: string }>;
  selectedValue?: string;
  onSelect?: (value: string) => void;
}

/** Default labels per variant */
const VARIANT_LABELS: Record<InputSecondaryVariant, string> = {
  default: "Email or username",
  email: "Email or username",
  "credit-card": "Credit Card",
  cvc: "CVC",
  month: "Month",
  "phone-number": "Phone Number",
  verification: "Complete Gapcha",
  error: "Email or username",
  alert: "Email or username",
  dropdown: "Select",
  country: "Country",
};

/** Default placeholders per variant */
const VARIANT_PLACEHOLDERS: Record<InputSecondaryVariant, string> = {
  default: "Email or username",
  email: "name@domain.com",
  "credit-card": "Number",
  cvc: "Number",
  month: "March",
  "phone-number": "",
  verification: "Verify Code",
  error: "name@domain.com",
  alert: "name@domain.com",
  dropdown: "Select option",
  country: "Country",
};

const COUNTRY_DIAL_CODES = [
  { code: "us", name: "United States", dial: "+1", flag: "united states" },
  { code: "gb", name: "United Kingdom", dial: "+44", flag: "united kingdom" },
  { code: "nl", name: "Netherlands", dial: "+31", flag: "netherlands" },
  { code: "de", name: "Germany", dial: "+49", flag: "germany" },
  { code: "fr", name: "France", dial: "+33", flag: "france" },
] as const;

/** Glass pill base styles shared across all variants */
const PILL_STYLE: React.CSSProperties = {
  backgroundColor: "var(--color-light-glass-5)",
  border: "2px solid var(--color-light-glass-10)",
  backdropFilter: "blur(25px)",
  WebkitBackdropFilter: "blur(25px)",
  boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
};

function InputSecondary({
  variant = "default",
  viewport,
  isDesktop,
  value = "",
  placeholder,
  label,
  onChange,
  errorMessage,
  isPasswordVisible = true,
  onToggleVisibility,
  captchaSrc = "/images/onboarding/captcha.png",
  className,
  disabled = false,
  options,
  selectedValue,
  onSelect,
}: InputSecondaryProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [phoneCountry, setPhoneCountry] = React.useState("us");
  const resolvedViewport = useGooeyViewport(viewport, isDesktop);
  const widthClass = getResponsiveWidthClass(resolvedViewport, {
    phone: "max-w-[366px]",
    tablet: "max-w-[450px]",
    desktop: "max-w-[450px]",
    wide: "max-w-[520px]",
  });

  const isDropdown = variant === "dropdown";
  const isCountry = variant === "country";
  const isSelectVariant = isDropdown || isCountry;

  const tagLabel = label ?? VARIANT_LABELS[variant];
  const inputPlaceholder = placeholder ?? VARIANT_PLACEHOLDERS[variant];
  const showTag = isSelectVariant ? !!selectedValue : isFocused || value.length > 0;
  const hasEyeToggle = variant === "email" || variant === "month";
  const isError = variant === "error";
  const isAlert = variant === "alert";
  const hasMessage = isError || isAlert;

  const inputType = hasEyeToggle && !isPasswordVisible ? "password" : "text";

  const country = COUNTRY_DIAL_CODES.find((c) => c.code === phoneCountry) ?? COUNTRY_DIAL_CODES[0];

  const selectedOption = isSelectVariant ? options?.find((o) => o.value === selectedValue) : undefined;

  const restingLeft = variant === "phone-number" ? 94
    : variant === "verification" ? 172
    : variant === "credit-card" ? 24
    : isCountry ? 24
    : 16;

  const pill = (
    <div
      className={cn(
        "relative flex h-[50px] items-center rounded-[16px]",
        variant === "phone-number" ? "gap-[12px] pl-[5px] pr-[20px]" :
        variant === "verification" ? "gap-[12px] overflow-clip" :
        variant === "credit-card" ? "justify-between px-[24px]" :
        variant === "cvc" ? "justify-between pl-[16px] pr-[20px]" :
        isDropdown ? "gap-[12px] px-[24px]" :
        isCountry ? "gap-[12px] pl-[5px] pr-[20px]" :
        hasEyeToggle ? "justify-between pl-[16px] pr-[4px]" :
        "gap-[12px] pl-[16px] pr-[24px]",
        "w-full min-w-0",
        !hasMessage && className,
      )}
      style={PILL_STYLE}
    >
      {/* Floating tag label */}
      <motion.div
        className="pointer-events-none absolute top-0 left-0 z-10 flex h-[18px] items-center justify-center gap-[8px] rounded-[999px]"
        initial={false}
        animate={{
          x: showTag ? 16 : restingLeft,
          y: showTag ? -9 : 16,
        }}
        transition={{ type: "spring", ...SPRING_CONFIGS.snappy }}
        style={{
          backgroundColor: showTag ? "var(--color-dark-space)" : "transparent",
          padding: showTag ? "0px 6px" : "0px",
          transformOrigin: "left center",
          transition: "background-color 0.15s, padding 0.15s",
        }}
      >
        <span
          className="whitespace-nowrap text-center font-sans text-[14px] font-normal leading-[0.9]"
          style={{
            color: showTag ? "var(--color-light-space)" : "var(--color-smoke-4)",
            transition: "color 0.15s",
          }}
        >
          {tagLabel}
        </span>
      </motion.div>

      {/* Verification: CAPTCHA image on left */}
      {variant === "verification" && (
        <div className="relative h-[50px] w-[160px] shrink-0 rounded-bl-[16px] rounded-tl-[16px] overflow-clip">
          <img
            src={captchaSrc}
            alt="CAPTCHA"
            className="absolute inset-0 size-full object-cover pointer-events-none"
          />
        </div>
      )}

      {/* Phone Number: country picker on left */}
      {variant === "phone-number" && (
        <div
          className="relative flex h-[42px] shrink-0 items-center gap-[8px] rounded-[999px] pl-[5px] pr-[12px]"
          style={{
            backgroundColor: "var(--color-light-glass-5)",
            border: "1px solid var(--color-light-glass-20)",
            boxShadow: "0px 10px 20px rgba(0,0,0,0.1), inset 0px 2px 4px rgba(255,255,255,0.15)",
          }}
        >
          <img
            src={`/images/flags/${country.flag}.svg`}
            alt={country.name}
            className="size-[32px] rounded-full object-cover"
          />
          <ArrowDown01Icon size={20} strokeWidth={1.8} className="text-light-space" />
          <select
            className="absolute inset-0 cursor-pointer opacity-0"
            value={phoneCountry}
            onChange={(e) => setPhoneCountry(e.target.value)}
          >
            {COUNTRY_DIAL_CODES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.dial})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Dropdown: display text + arrow + native select */}
      {isDropdown && (
        <div className="relative flex min-w-0 flex-1 items-center">
          <span
            className="flex-1 truncate font-sans text-[14px] font-normal leading-[0.9]"
            style={{ color: selectedOption ? "var(--color-light-space)" : "var(--color-smoke-4)" }}
          >
            {selectedOption?.label ?? (showTag ? inputPlaceholder : "")}
          </span>
          <ArrowDown01Icon size={20} strokeWidth={1.8} className="shrink-0 text-light-space" />
          <select
            className="absolute inset-0 cursor-pointer opacity-0"
            value={selectedValue ?? ""}
            onChange={(e) => onSelect?.(e.target.value)}
            disabled={disabled}
          >
            <option value="" disabled>{inputPlaceholder}</option>
            {options?.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Country: flag + arrow + separator + country name + native select */}
      {isCountry && (
        <div className="relative flex min-w-0 flex-1 items-center gap-[8px]">
          <div className="flex shrink-0 items-center gap-[8px]">
            {selectedOption?.flag ? (
              <img
                src={`/images/flags/${selectedOption.flag}.svg`}
                alt={selectedOption.label}
                className="size-[24px] rounded-full object-cover"
              />
            ) : (
              <div className="size-[24px] rounded-full bg-light-glass-10" />
            )}
            <ArrowDown01Icon size={20} strokeWidth={1.8} className="text-light-space" />
          </div>
          <div className="h-[46px] w-[2px] shrink-0 bg-light-glass-10" />
          <span
            className="flex-1 truncate font-sans text-[14px] font-normal leading-[0.9]"
            style={{ color: selectedOption ? "var(--color-light-space)" : "var(--color-smoke-4)" }}
          >
            {selectedOption?.label ?? (showTag ? inputPlaceholder : "")}
          </span>
          <select
            className="absolute inset-0 cursor-pointer opacity-0"
            value={selectedValue ?? ""}
            onChange={(e) => onSelect?.(e.target.value)}
            disabled={disabled}
          >
            <option value="" disabled>{inputPlaceholder}</option>
            {options?.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Text input (not rendered for dropdown/country) */}
      {!isSelectVariant && (
        <input
          type={inputType}
          className="min-w-0 flex-1 border-none bg-transparent font-sans text-[14px] font-normal leading-[0.9] outline-none"
          style={{
            color: "var(--color-light-space)",
            caretColor: "var(--color-light-space)",
          }}
          placeholder={showTag ? inputPlaceholder : ""}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
        />
      )}

      {/* Eye toggle for email / month */}
      {hasEyeToggle && (
        <IconOnlyButton
          size="small"
          className="size-[42px] shrink-0"
          icon={isPasswordVisible ? <ViewOffIcon size={20} strokeWidth={1.8} /> : <ViewIcon size={20} strokeWidth={1.8} />}
          onClick={onToggleVisibility}
        />
      )}

      {/* Credit card brand icons */}
      {variant === "credit-card" && (
        <div className="flex items-center gap-[4px] shrink-0">
          <VisaSvg />
          <MastercardSvg />
          <AmexSvg />
          <DiscoverSvg />
        </div>
      )}

      {/* CVC card icon */}
      {variant === "cvc" && <CardCvcSvg />}

      {/* Inner shadow overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );

  if (!hasMessage) return pill;

  /* Error / Alert wrapper */
  return (
    <div className={cn("flex w-full flex-col items-start gap-[12px]", widthClass, className)}>
      {pill}
      <div className="flex w-full items-center gap-[10px]">
        <Alert02Icon
          size={20}
          strokeWidth={1.8}
          style={{ color: isError ? "var(--color-red-5)" : "var(--color-yellow-5)", flexShrink: 0 }}
        />
        <span
          className="flex-1 font-sans text-[14px] font-normal leading-[0.9]"
          style={{ color: isError ? "var(--color-red-5)" : "var(--color-yellow-5)" }}
        >
          {errorMessage ?? (isError
            ? "This email is invalid. Make sure it\u2019s written like example@email.com"
            : "This address is already linked to an existing account. To continue, Log In.")}
        </span>
      </div>
    </div>
  );
}

/* ─── Inline card brand SVGs (17×12) ─── */

function VisaSvg() {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="17" height="12" rx="2" fill="#1A1F71" />
      <path d="M7.1 8.5L8 3.5H9.2L8.3 8.5H7.1ZM5.6 3.5L4.5 6.8L4.3 5.8L3.7 4.1C3.7 4.1 3.6 3.5 2.9 3.5H1L1 3.6C1 3.6 1.8 3.8 2.7 4.3L3.8 8.5H5.1L7 3.5H5.6ZM14.3 8.5H15.5L14.5 3.5H13.5C13 3.5 12.8 3.9 12.8 3.9L10.9 8.5H12.2L12.4 7.8H14L14.3 8.5ZM12.8 6.8L13.5 4.8L13.9 6.8H12.8ZM11.5 5L11.7 3.7C11.7 3.7 10.9 3.4 10.1 3.4C9.2 3.4 7.3 3.8 7.3 5.4C7.3 6.9 9.4 6.9 9.4 7.7C9.4 8.4 7.5 8.3 6.8 7.7L6.5 9C6.5 9 7.3 9.3 8.4 9.3C9.5 9.3 11.5 8.6 11.5 7.2C11.5 5.7 9.4 5.5 9.4 4.9C9.4 4.3 10.9 4.3 11.5 5Z" fill="white" />
    </svg>
  );
}

function MastercardSvg() {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="17" height="12" rx="2" fill="#252525" />
      <circle cx="6.5" cy="6" r="3.5" fill="#EB001B" />
      <circle cx="10.5" cy="6" r="3.5" fill="#F79E1B" />
      <path d="M8.5 3.2C9.3 3.8 9.8 4.8 9.8 6C9.8 7.2 9.3 8.2 8.5 8.8C7.7 8.2 7.2 7.2 7.2 6C7.2 4.8 7.7 3.8 8.5 3.2Z" fill="#FF5F00" />
    </svg>
  );
}

function AmexSvg() {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="17" height="12" rx="2" fill="#2E77BC" />
      <path d="M2 8.5L4.5 3.5H6L8.5 8.5H6.8L6.3 7.5H4L3.5 8.5H2ZM4.5 6.5H5.8L5.2 5L4.5 6.5ZM8 8.5V3.5H10.2L11.2 6.5L12.2 3.5H14.5V8.5H13V5L11.8 8.5H10.5L9.5 5V8.5H8Z" fill="white" />
    </svg>
  );
}

function DiscoverSvg() {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="17" height="12" rx="2" fill="#F5F5F5" />
      <circle cx="10" cy="6" r="3" fill="#F76B1C" />
      <path d="M1.5 4.5H3C4 4.5 4.5 5.2 4.5 6C4.5 6.8 4 7.5 3 7.5H1.5V4.5ZM2.3 5.2V6.8H3C3.5 6.8 3.7 6.5 3.7 6C3.7 5.5 3.5 5.2 3 5.2H2.3Z" fill="#231F20" />
      <rect x="5" y="4.5" width="1" height="3" fill="#231F20" />
      <path d="M6.5 6.5C6.5 5.4 7.4 4.4 8.5 4.4C9 4.4 9.3 4.5 9.5 4.7L9 5.3C8.9 5.2 8.7 5.1 8.5 5.1C7.9 5.1 7.3 5.7 7.3 6.5C7.3 7.1 7.7 7.6 8.5 7.6C8.7 7.6 8.9 7.5 9 7.4L9.5 8C9.2 8.2 8.9 8.3 8.5 8.3C7.3 8.3 6.5 7.5 6.5 6.5Z" fill="#231F20" />
    </svg>
  );
}

/** CVC card icon (19×14) — detailed card with "135" numbers */
function CardCvcSvg() {
  return (
    <svg width="19" height="14" viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 2H2C0.89543 2 0 2.89543 0 4V12C0 13.1046 0.89543 14 2 14H15C16.1046 14 17 13.1046 17 12V4C17 2.89543 16.1046 2 15 2Z" fill="white" fillOpacity="0.4"/>
      <path d="M14 4H3C2.44772 4 2 4.44772 2 5C2 5.55228 2.44772 6 3 6H14C14.5523 6 15 5.55228 15 5C15 4.44772 14.5523 4 14 4Z" fill="white" fillOpacity="0.4"/>
      <path d="M14.5 9C16.9853 9 19 6.98528 19 4.5C19 2.01472 16.9853 0 14.5 0C12.0147 0 10 2.01472 10 4.5C10 6.98528 12.0147 9 14.5 9Z" fill="white" fillOpacity="0.9"/>
      <path d="M12.5 5.96V3.03H12C11.96 3.36 11.8 3.49 11.42 3.53L11.18 3.54V4.05H11.84V5.95H12.51L12.5 5.96ZM14.11 6C14.76 6 15.18 5.6 15.18 5.13C15.18 4.77 14.98 4.56 14.72 4.46C14.8417 4.40938 14.9451 4.32298 15.0165 4.21226C15.0879 4.10153 15.124 3.97171 15.12 3.84C15.12 3.36 14.74 3 14.13 3C13.5 3 13.11 3.4 13.04 3.92L13.66 3.99C13.7 3.74 13.86 3.56 14.1 3.56C14.33 3.56 14.47 3.69 14.47 3.88C14.47 4.1 14.3 4.2 14.05 4.2H13.79V4.74H14.06C14.33 4.74 14.52 4.84 14.52 5.07C14.52 5.31 14.34 5.44 14.1 5.44C13.85 5.44 13.66 5.28 13.62 4.99L12.97 5.09C13.05 5.69 13.51 6 14.11 6ZM16.64 6C17.24 6 17.71 5.57 17.71 4.98C17.71 4.42 17.35 4 16.76 4C16.56 4 16.39 4.07 16.28 4.16L16.33 3.62H17.53V3.04H15.83L15.69 4.64L16.29 4.71C16.36 4.61 16.49 4.53 16.66 4.53C16.92 4.53 17.08 4.73 17.08 4.99C17.08 5.26 16.88 5.44 16.63 5.44C16.38 5.44 16.21 5.27 16.17 5L15.52 5.1C15.61 5.68 16.04 6 16.64 6Z" fill="black" fillOpacity="0.4"/>
    </svg>
  );
}

InputSecondary.displayName = "InputSecondary";

export { InputSecondary, type InputSecondaryProps, type InputSecondaryVariant };

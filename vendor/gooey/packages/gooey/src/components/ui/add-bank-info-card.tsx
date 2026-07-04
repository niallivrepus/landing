import * as React from "react";

import { useGooeyViewport, type GooeyViewportPreference } from "../../hooks/use-viewport";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { InputSecondary } from "./input-secondary";

const COUNTRY_OPTIONS = [
  { value: "us", label: "United States", flag: "united states" },
  { value: "gb", label: "United Kingdom", flag: "united kingdom" },
  { value: "nl", label: "Netherlands", flag: "netherlands" },
  { value: "de", label: "Germany", flag: "germany" },
  { value: "fr", label: "France", flag: "france" },
] as const;

const STATE_OPTIONS = [
  { value: "ca", label: "California" },
  { value: "ny", label: "New York" },
  { value: "tx", label: "Texas" },
  { value: "fl", label: "Florida" },
  { value: "il", label: "Illinois" },
] as const;

interface AddBankInfoCardProps {
  variant?: "desktop" | "phone";
  viewport?: GooeyViewportPreference;
  isDesktop?: boolean;
  className?: string;
}

export function AddBankInfoCard({
  variant,
  viewport = "auto",
  isDesktop,
  className,
}: AddBankInfoCardProps) {
  const resolvedViewport = useGooeyViewport(
    viewport,
    isDesktop ?? (variant ? variant === "desktop" : undefined),
  );
  const isPhone = resolvedViewport === "phone";
  const isDesktopLayout =
    resolvedViewport === "desktop" || resolvedViewport === "wide";

  const [country, setCountry] = React.useState("us");
  const [state, setState] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [city, setCity] = React.useState("");
  const [zip, setZip] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [creditCard, setCreditCard] = React.useState("");
  const [expiration, setExpiration] = React.useState("");
  const [cvc, setCvc] = React.useState("");

  const sideBySide = "w-auto flex-1";
  const fullWidth = "w-full";

  return (
    <div
      className={cn(
        "group relative w-full overflow-hidden rounded-[40px]",
        "bg-light-glass-5 border border-light-glass-20 backdrop-blur-[25px]",
        "shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1)]",
        resolvedViewport === "wide"
          ? "max-w-[44rem] p-6"
          : resolvedViewport === "desktop"
            ? "max-w-[39rem] p-6"
            : resolvedViewport === "tablet"
              ? "max-w-[34rem] p-6"
              : "max-w-[26rem] px-6 pb-10 pt-6",
        className,
      )}
    >
      <div className={cn("flex flex-col", isDesktopLayout ? "gap-8" : "gap-4")}>
        {/* Title */}
        <h2
          className={cn(
            "font-sans font-bold text-light-space",
            isPhone ? "text-[32px] leading-[1.2]" : "text-[48px] leading-[1.1]",
          )}
        >
          Add Bank Info
        </h2>

        {/* Billing Details */}
        <div className={cn("flex flex-col", isDesktopLayout ? "gap-[32px]" : "gap-[40px]")}>
          <span className="font-sans text-[20px] font-normal text-smoke-5">Billing Details</span>
          <div className="flex flex-col gap-3">
            {isDesktopLayout ? (
              <div className="flex gap-3">
                <InputSecondary
                  variant="country"
                  label="Country"
                  options={[...COUNTRY_OPTIONS]}
                  selectedValue={country}
                  onSelect={setCountry}
                  className={sideBySide}
                />
                <InputSecondary
                  variant="dropdown"
                  label="State / Province"
                  placeholder="March"
                  options={[...STATE_OPTIONS]}
                  selectedValue={state}
                  onSelect={setState}
                  className={sideBySide}
                />
              </div>
            ) : (
              <>
                <InputSecondary
                  variant="country"
                  label="Country"
                  options={[...COUNTRY_OPTIONS]}
                  selectedValue={country}
                  onSelect={setCountry}
                  className={fullWidth}
                />
                <InputSecondary
                  variant="dropdown"
                  label="State / Province"
                  placeholder="March"
                  options={[...STATE_OPTIONS]}
                  selectedValue={state}
                  onSelect={setState}
                  className={fullWidth}
                />
              </>
            )}
            <InputSecondary
              variant="default"
              label="Address"
              placeholder="Fill in your address"
              value={address}
              onChange={setAddress}
              className={fullWidth}
            />
            <div className={cn("gap-3", isPhone ? "flex flex-col" : "flex")}>
              <InputSecondary
                variant="default"
                label="City"
                placeholder="Fill in your city"
                value={city}
                onChange={setCity}
                className={sideBySide}
              />
              <InputSecondary
                variant="default"
                label="ZIP"
                placeholder="Zip / Postal Code"
                value={zip}
                onChange={setZip}
                className={sideBySide}
              />
            </div>
          </div>
        </div>

        {/* Card Details */}
        <div className={cn("flex flex-col", isDesktopLayout ? "gap-[32px]" : "gap-[40px]")}>
          <span className="font-sans text-[20px] font-normal text-smoke-5">Card Details</span>
          <div className="flex flex-col gap-3">
            {isDesktopLayout ? (
              <div className="flex gap-3">
                <InputSecondary
                  variant="default"
                  label="Email or username"
                  placeholder="Email or username"
                  value={email}
                  onChange={setEmail}
                  className={sideBySide}
                />
                <InputSecondary
                  variant="default"
                  label="Name"
                  placeholder="Name on Card"
                  value={name}
                  onChange={setName}
                  className={sideBySide}
                />
              </div>
            ) : (
              <>
                <InputSecondary
                  variant="default"
                  label="Email or username"
                  placeholder="Email or username"
                  value={email}
                  onChange={setEmail}
                  className={fullWidth}
                />
                <InputSecondary
                  variant="default"
                  label="Name"
                  placeholder="Name on Card"
                  value={name}
                  onChange={setName}
                  className={fullWidth}
                />
              </>
            )}
            <InputSecondary
              variant="credit-card"
              value={creditCard}
              onChange={setCreditCard}
              className={fullWidth}
            />
            <div className={cn("gap-3", isPhone ? "flex flex-col" : "flex")}>
              <InputSecondary
                variant="default"
                label="Expiration"
                placeholder="MM / YY"
                value={expiration}
                onChange={setExpiration}
                className={sideBySide}
              />
              <InputSecondary
                variant="cvc"
                value={cvc}
                onChange={setCvc}
                className={sideBySide}
              />
            </div>
          </div>
        </div>

        {/* CTA buttons (desktop only) */}
        {!isPhone && (
          <div className="mx-auto flex w-full max-w-[575px] gap-2">
            <Button variant="secondary-neutral" size="xl" className="flex-1">
              Back
            </Button>
            <Button variant="primary-neutral" size="xl" className="flex-1">
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Inner shadow overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[40px]"
        style={{
          boxShadow: "none",
        }}
      />
    </div>
  );
}

import { useState } from "react";

import { useGooeyViewport, type GooeyViewportPreference } from "../../hooks/use-viewport";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { ValueSlider } from "./value-slider";

const STORAGE_TIERS = [
  { label: "Free", price: 0 },
  { label: "8 GB", price: 8 },
  { label: "24 GB", price: 24 },
  { label: "40 GB", price: 40 },
  { label: "1 TB", price: 2000 },
] as const;

interface StoragePricingCardProps {
  variant?: "desktop" | "phone";
  viewport?: GooeyViewportPreference;
  isDesktop?: boolean;
  className?: string;
}

export function StoragePricingCard({
  variant,
  viewport = "auto",
  isDesktop,
  className,
}: StoragePricingCardProps) {
  const resolvedViewport = useGooeyViewport(
    viewport,
    isDesktop ?? (variant ? variant === "desktop" : undefined),
  );
  const isPhone = resolvedViewport === "phone";
  const showActions = resolvedViewport !== "phone";
  const [billingCycle, setBillingCycle] = useState<"yearly" | "monthly">("yearly");
  const [sliderValue, setSliderValue] = useState(0);

  const tierIndex = Math.round(sliderValue / 0.25);
  const tier = STORAGE_TIERS[tierIndex]!;
  const isFree = tier.price === 0;

  return (
    <div
      className={cn(
        "group relative flex w-full flex-col overflow-hidden rounded-[40px]",
        "bg-light-glass-5 border-2 border-light-glass-20 backdrop-blur-[25px]",
        "shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1)]",
        resolvedViewport === "wide"
          ? "max-w-[44rem] gap-6 p-6"
          : resolvedViewport === "desktop"
            ? "max-w-[39rem] gap-6 p-6"
            : resolvedViewport === "tablet"
              ? "max-w-[34rem] gap-5 p-6"
              : "max-w-[26rem] h-[546px] gap-4 px-6 pb-10 pt-6",
        className,
      )}
    >
      {/* Billing toggle */}
      <div className="flex gap-2">
        <BillingPill
          label="Yearly Billing"
          active={billingCycle === "yearly"}
          onClick={() => setBillingCycle("yearly")}
        />
        <BillingPill
          label="Monthly Billing"
          active={billingCycle === "monthly"}
          onClick={() => setBillingCycle("monthly")}
        />
      </div>

      {/* Wave container */}
      <div
        className="flex-1 rounded-[24px] bg-dark-glass-20 overflow-clip relative"
        style={{
          boxShadow: "0px 0.5px 1px white, 0px -0.5px 1px rgba(0,0,0,0.5)",
          minHeight: showActions ? 200 : 160,
        }}
      >
        <WaveAnimation sliderValue={sliderValue} />
      </div>

      {/* Price section */}
      <div className="flex flex-col gap-3">
        {/* Price row */}
        <div className="flex items-center justify-between rounded-full bg-dark-glass-20 p-3">
          <span
            className={cn(
              "font-sans font-bold text-light-space",
              isPhone ? "text-[32px] leading-none" : "text-[48px] leading-none",
            )}
          >
            {isFree ? "Free" : `$${tier.price}`}
          </span>
          {!isFree && (
            <span
              className="rounded-full bg-dark-glass-20 px-3 py-1.5 font-mono text-[12px] text-light-space/80"
              style={{
                textShadow: "0px 1px 1px rgba(0,0,0,0.5)",
              }}
            >
              per month
            </span>
          )}
        </div>

        {/* Tier labels */}
        <div className="flex justify-between px-3">
          {STORAGE_TIERS.map((t, i) => (
            <span
              key={t.label}
              className={cn(
                "text-light-space transition-opacity duration-300",
                isPhone
                  ? "font-sans font-medium text-[14px]"
                  : "font-sans font-normal text-[16px]",
                i === tierIndex ? "opacity-80" : "opacity-30",
              )}
            >
              {t.label}
            </span>
          ))}
        </div>
      </div>

      {/* Slider */}
      <ValueSlider value={sliderValue} onChange={setSliderValue} step={0.25} />

      {/* Back / Next buttons (desktop only) */}
      {showActions && (
        <div className="flex gap-2">
          <Button variant="secondary-neutral" size="xl" className="flex-1">
            Back
          </Button>
          <Button variant="primary-neutral" size="xl" className="flex-1">
            Next
          </Button>
        </div>
      )}

      {/* Inner shadow overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[40px]"
        style={{
          boxShadow:
            "inset 0px 1px 1px rgba(255,255,255,0.15), inset 0px 2px 3px rgba(255,255,255,0.15)",
        }}
      />
    </div>
  );
}

function BillingPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 h-[50px] rounded-full bg-light-glass-5 backdrop-blur-[25px]",
        "font-sans font-bold text-[14px] cursor-pointer transition-all duration-200",
        active
          ? "border-2 border-light-glass-20 text-light-space"
          : "border-2 border-transparent text-light-space/20",
      )}
      style={{
        boxShadow: active
          ? "inset 0px 1px 1px rgba(255,255,255,0.15)"
          : "inset 0px 2px 4px rgba(0,0,0,0.2)",
      }}
    >
      {label}
    </button>
  );
}

function WaveAnimation({ sliderValue }: { sliderValue: number }) {
  // Waves translate down when slider is low, up when high
  const translateY = (1 - sliderValue) * 100;

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 800 400"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgb(255, 10, 0)" />
          <stop offset="14%" stopColor="rgb(255, 98, 9)" />
          <stop offset="28.5%" stopColor="rgb(255, 184, 0)" />
          <stop offset="100%" stopColor="rgb(0, 209, 8)" />
        </linearGradient>
      </defs>
      <style>{`
        @keyframes wave-scroll-1 { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes wave-scroll-2 { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes wave-scroll-3 { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .wave-1 { animation: wave-scroll-1 8s linear infinite; }
        .wave-2 { animation: wave-scroll-2 6s linear infinite; }
        .wave-3 { animation: wave-scroll-3 4s linear infinite; }
      `}</style>
      <g
        style={{
          transform: `translateY(${translateY}%)`,
          transition: "transform 700ms ease-in-out",
          willChange: "transform",
        }}
      >
        {/* Wave layer 1 (back) — amplitude 8px, opacity 0.4 */}
        <g className="wave-1" opacity="0.4">
          <path
            d="M0,60 C50,52 100,68 200,60 C300,52 350,68 400,60 C450,52 500,68 600,60 C700,52 750,68 800,60
               C850,52 900,68 1000,60 C1100,52 1150,68 1200,60 C1250,52 1300,68 1400,60 C1500,52 1550,68 1600,60
               L1600,400 L0,400 Z"
            fill="url(#wave-gradient)"
          />
        </g>
        {/* Wave layer 2 (mid) — amplitude 12px, opacity 0.6 */}
        <g className="wave-2" opacity="0.6">
          <path
            d="M0,70 C66,58 133,82 266,70 C400,58 466,82 533,70 C600,58 666,82 800,70
               C866,58 933,82 1066,70 C1200,58 1266,82 1333,70 C1400,58 1466,82 1600,70
               L1600,400 L0,400 Z"
            fill="url(#wave-gradient)"
          />
        </g>
        {/* Wave layer 3 (front) — amplitude 6px, opacity 0.9 */}
        <g className="wave-3" opacity="0.9">
          <path
            d="M0,75 C40,69 80,81 160,75 C240,69 280,81 400,75 C520,69 560,81 640,75 C720,69 760,81 800,75
               C840,69 880,81 960,75 C1040,69 1080,81 1200,75 C1320,69 1360,81 1440,75 C1520,69 1560,81 1600,75
               L1600,400 L0,400 Z"
            fill="url(#wave-gradient)"
          />
        </g>
      </g>
    </svg>
  );
}

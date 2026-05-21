import * as React from "react";

import { cn } from "../../lib/utils";

type SpineTagVariant = "time" | "weather" | "value" | "allDay" | "recurring" | "dateRange";

interface SpineTagProps {
  variant: SpineTagVariant;
  className?: string;
  primaryText?: string;
  secondaryText?: string;
  lowTemp?: string;
  highTemp?: string;
  startDay?: string;
  startMonth?: string;
  endDay?: string;
  endMonth?: string;
  icon?: React.ReactNode;
}

const GEIST_MONO = '"Geist Mono", ui-monospace, monospace';

const BLUE_GRADIENT = "linear-gradient(90deg, #002FFF 0%, #3D7EFF 100%)";

function SpineTag({
  variant,
  className,
  primaryText,
  secondaryText,
  lowTemp,
  highTemp,
  startDay,
  startMonth,
  endDay,
  endMonth,
  icon,
}: SpineTagProps) {
  return (
    <div
      className={cn(
        "inline-flex h-[32px] items-center rounded-[999px] border px-2.5 backdrop-blur-[25px] light:bg-white light:border-[#D9DDE5]",
        className,
      )}
      style={{
        backgroundColor: "white",
        borderColor: "rgba(255,255,255,0.08)",
        fontFamily: GEIST_MONO,
        fontSize: 14,
        fontWeight: 400,
        lineHeight: 1,
      }}
    >
      {renderVariant(variant, { primaryText, secondaryText, lowTemp, highTemp, startDay, startMonth, endDay, endMonth, icon })}
    </div>
  );
}

function renderVariant(
  variant: SpineTagVariant,
  props: Omit<SpineTagProps, "variant" | "className">,
) {
  switch (variant) {
    case "time":
      return (
        <div className="flex items-center gap-1">
          <span className="text-black">{props.primaryText}</span>
          <span className="text-black">{props.secondaryText}</span>
        </div>
      );

    case "weather":
      return (
        <div className="flex items-center gap-2">
          <span className="text-black">{props.primaryText}</span>
          <span className="text-black">{props.lowTemp}</span>
          {/* Temperature bar */}
          <div
            className="relative overflow-hidden"
            style={{
              width: 40,
              height: 8,
              borderRadius: 8,
              backgroundColor: "var(--color-smoke-3)",
            }}
          >
            <div
              className="absolute inset-y-0 left-0"
              style={{
                width: "60%",
                borderRadius: 8,
                backgroundImage: BLUE_GRADIENT,
              }}
            />
          </div>
          <span className="text-black">{props.highTemp}</span>
        </div>
      );

    case "value":
      return (
        <div className="flex items-center gap-1">
          <span className="text-black">{props.primaryText}</span>
          <span className="text-black">{props.secondaryText}</span>
        </div>
      );

    case "allDay":
      return <span className="text-black">All Day</span>;

    case "recurring":
      return (
        <div className="flex items-center gap-1">
          <span className="text-black">Recurring</span>
          {props.icon && <span className="flex size-4 items-center justify-center text-black">{props.icon}</span>}
        </div>
      );

    case "dateRange":
      return (
        <div className="flex items-center gap-1">
          <span className="text-black">{props.startDay}</span>
          <span className="text-black">{props.startMonth}</span>
          <span className="text-black">|</span>
          <span className="text-black">{props.endDay}</span>
          <span className="text-black">{props.endMonth}</span>
        </div>
      );
  }
}

export { SpineTag, type SpineTagProps, type SpineTagVariant };

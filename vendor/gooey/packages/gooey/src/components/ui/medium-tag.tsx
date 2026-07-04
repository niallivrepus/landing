import * as React from "react";

import { cn } from "../../lib/utils";
import { GooeyGlass } from "./gooey-glass";

type MediumTagVariant = "default" | "time" | "editRight" | "editLeft" | "file" | "transaction";

interface MediumTagProps {
  variant?: MediumTagVariant;
  label: string;
  secondaryLabel?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  className?: string;
}

const INNER_SHADOW = "none";
const LOGO_SHADOW = "0px 0px 8px rgba(255, 255, 255, 0.6)";

function MediumTag({ variant = "default", label, secondaryLabel, icon, iconRight, className }: MediumTagProps) {
  const styles = getVariantContainerStyles(variant);
  const variantClasses = getVariantContainerClasses(variant);

  return (
    <GooeyGlass
      className={cn(
        "inline-flex h-[40px] items-center rounded-[40px] backdrop-blur-[25px] font-sans text-base font-normal",
        variantClasses,
        className,
      )}
      contentClassName="relative z-0 flex items-center"
      lens={{ width: 160, height: 40, borderRadius: 40, scale: 5, depth: 0.48, chroma: 0.08, glow: 0.1, edgeHighlight: 0.2 }}
      style={{
        ...styles,
      }}
    >
      {renderContent(variant, label, secondaryLabel, icon, iconRight)}
    </GooeyGlass>
  );
}

function getVariantContainerClasses(variant: MediumTagVariant): string {
  switch (variant) {
    case "default":
    case "time":
    case "editRight":
    case "editLeft":
    case "transaction":
      return "light:bg-white light:border-[#D9DDE5] light:text-[var(--color-dark-space)]";
    case "file":
      return "light:bg-white light:border-[#9EA6B4] light:text-[var(--color-dark-space)]";
  }
}

function renderContent(
  variant: MediumTagVariant,
  label: string,
  secondaryLabel?: string,
  icon?: React.ReactNode,
  iconRight?: React.ReactNode,
) {
  switch (variant) {
    case "default":
      return <span className="text-black">{label}</span>;

    case "time":
      return (
        <div className="flex items-center gap-3">
          <span className="text-black">{label}</span>
          {secondaryLabel && <span className="text-black">{secondaryLabel}</span>}
        </div>
      );

    case "editRight":
      return (
        <div className="flex items-center gap-2">
          <span className="text-black">{label}</span>
          {iconRight && <span className="flex size-5 items-center justify-center text-black">{iconRight}</span>}
        </div>
      );

    case "editLeft":
      return (
        <div className="flex items-center gap-2">
          {icon && <span className="flex size-5 items-center justify-center text-black">{icon}</span>}
          <span className="text-black">{label}</span>
        </div>
      );

    case "file":
      return (
        <div className="flex items-center gap-1">
          {icon && <span className="flex size-5 items-center justify-center text-black">{icon}</span>}
          <span className="text-black">{label}</span>
          {secondaryLabel && <span className="text-black">{secondaryLabel}</span>}
          {iconRight && <span className="flex size-5 items-center justify-center text-black">{iconRight}</span>}
        </div>
      );

    case "transaction":
      return (
        <div className="flex items-center gap-2">
          <div
            className="rounded-[1px]"
            style={{
              width: 5,
              height: 5,
              backgroundColor: "#000",
              boxShadow: LOGO_SHADOW,
            }}
          />
          <span className="text-black">{label}</span>
        </div>
      );
  }
}

function getVariantContainerStyles(variant: MediumTagVariant): React.CSSProperties {
  switch (variant) {
    case "default":
      return {
        backgroundColor: "white",
        borderColor: "#D9DDE5",
        borderWidth: 1,
        borderStyle: "solid",
        paddingLeft: 12,
        paddingRight: 16,
      };
    case "time":
      return {
        backgroundColor: "white",
        borderColor: "#D9DDE5",
        borderWidth: 1,
        borderStyle: "solid",
        paddingLeft: 12,
        paddingRight: 16,
      };
    case "editRight":
      return {
        backgroundColor: "white",
        borderColor: "#D9DDE5",
        borderWidth: 1,
        borderStyle: "solid",
        paddingLeft: 16,
        paddingRight: 12,
      };
    case "editLeft":
      return {
        backgroundColor: "white",
        borderColor: "#D9DDE5",
        borderWidth: 1,
        borderStyle: "solid",
        paddingLeft: 12,
        paddingRight: 16,
      };
    case "file":
      return {
        backgroundColor: "white",
        borderColor: "#9EA6B4",
        borderWidth: 1,
        borderStyle: "solid",
        paddingLeft: 12,
        paddingRight: 16,
      };
    case "transaction":
      return {
        backgroundColor: "white",
        borderColor: "#D9DDE5",
        borderWidth: 1,
        borderStyle: "solid",
        paddingLeft: 12,
        paddingRight: 16,
      };
  }
}

export { MediumTag, type MediumTagProps, type MediumTagVariant };

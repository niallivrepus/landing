import * as React from "react";

import { cn } from "../../lib/utils";
import { GooeyGlass } from "./gooey-glass";

type SmallTagVariant = "default" | "hover" | "username" | "companion" | "link" | "pinned" | "today";

interface SmallTagProps {
  variant?: SmallTagVariant;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

const GEIST_MONO = '"Geist Mono", ui-monospace, monospace';

function SmallTag({ variant = "default", label, icon, className }: SmallTagProps) {
  const hasIcon = variant === "companion" || variant === "pinned";

  const variantStyles = getVariantStyles(variant);
  const variantClasses = getVariantClasses(variant);

  return (
    <GooeyGlass
      className={cn(
        "inline-flex h-[32px] items-center border backdrop-blur-[25px]",
        hasIcon ? "gap-1 pl-2 pr-3" : "px-3",
        variantClasses,
        className,
      )}
      contentClassName="relative z-0 flex items-center gap-[inherit]"
      lens={{ width: 96, height: 32, borderRadius: 999, scale: 5, depth: 0.48, chroma: 0.08, glow: 0.1, edgeHighlight: 0.2 }}
      style={{
        fontFamily: GEIST_MONO,
        fontSize: 12,
        fontWeight: 400,
        lineHeight: 1,
        borderWidth: 1,
        borderStyle: "solid",
        ...variantStyles,
      }}
    >
      {hasIcon && icon && (
        <span className="flex size-4 items-center justify-center shrink-0">{icon}</span>
      )}
      {variant === "username" ? (
        <span style={{ color: variantStyles.color }}>{label}</span>
      ) : (
        <span style={{ color: variantStyles.color }}>{label}</span>
      )}
    </GooeyGlass>
  );
}

function getVariantClasses(variant: SmallTagVariant): string {
  switch (variant) {
    case "default":
      return "light:bg-white light:border-[#D9DDE5] light:text-[var(--color-dark-space)]";
    case "hover":
      return "light:bg-[#F3F5F8] light:border-[#CDD3DD] light:text-[var(--color-dark-space)]";
    case "username":
      return "light:bg-[var(--color-green-1)] light:border-[var(--color-green-2)] light:text-[var(--color-green-5)]";
    case "companion":
      return "light:bg-white light:border-[#E3E6EC] light:text-[#D89ACB]";
    case "link":
      return "light:bg-white light:border-[#D9DDE5] light:text-[var(--color-dark-space)]";
    case "pinned":
      return "light:bg-[var(--color-yellow-4)] light:border-[var(--color-yellow-5)] light:text-[var(--color-dark-space)]";
    case "today":
      return "light:border-[rgba(203,11,3,0.28)] light:text-white";
  }
}

function getVariantStyles(variant: SmallTagVariant): React.CSSProperties {
  switch (variant) {
    case "default":
      return {
        backgroundColor: "white",
        borderColor: "#D9DDE5",
        borderRadius: 999,
        color: "#000",
      };
    case "hover":
      return {
        backgroundColor: "white",
        borderColor: "#B9C0CB",
        borderRadius: 999,
        color: "#000",
      };
    case "username":
      return {
        backgroundColor: "var(--color-green-1)",
        borderColor: "var(--color-green-2)",
        borderRadius: 16,
        color: "#000",
      };
    case "companion":
      return {
        backgroundColor: "var(--color-spirit-2)",
        borderColor: "var(--color-spirit-3)",
        borderRadius: 16,
        color: "#000",
      };
    case "link":
      return {
        backgroundColor: "white",
        borderColor: "#D9DDE5",
        borderRadius: 16,
        color: "#000",
      };
    case "pinned":
      return {
        backgroundColor: "var(--color-yellow-4)",
        borderColor: "var(--color-yellow-5)",
        borderRadius: 16,
        color: "#000",
      };
    case "today":
      return {
        backgroundImage: "var(--gradient-fruta)",
        borderColor: "rgba(203, 11, 3, 0.28)",
        borderRadius: 16,
        color: "#000",
      };
  }
}

export { SmallTag, type SmallTagProps, type SmallTagVariant };

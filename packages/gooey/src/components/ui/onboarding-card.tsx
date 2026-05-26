import * as React from "react";
import { useGooeyViewport, type GooeyViewportPreference } from "../../hooks/use-viewport";
import { cn } from "../../lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";

interface OnboardingCardProps {
  step: number;
  totalSteps: number;
  image?: string;
  imageBackground?: React.CSSProperties;
  title: string;
  description: string;
  variant?: "desktop" | "phone";
  viewport?: GooeyViewportPreference;
  isDesktop?: boolean;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  className?: string;
  children?: React.ReactNode;
  contentChildren?: React.ReactNode;
  customActions?: React.ReactNode;
  buttonGap?: number;
}

export function OnboardingCard({
  step,
  totalSteps,
  image,
  imageBackground,
  title,
  description,
  variant,
  viewport = "auto",
  isDesktop,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  className,
  children,
  contentChildren,
  customActions,
  buttonGap,
}: OnboardingCardProps) {
  const resolvedViewport = useGooeyViewport(
    viewport,
    isDesktop ?? (variant ? variant === "desktop" : undefined),
  );
  const isPhone = resolvedViewport === "phone";
  const isCompact = resolvedViewport === "phone" || resolvedViewport === "tablet";

  return (
    <div
      className={cn(
        "group relative w-full overflow-hidden rounded-[40px]",
        resolvedViewport === "wide"
          ? "max-w-[44rem]"
          : resolvedViewport === "desktop"
            ? "max-w-[39rem]"
            : resolvedViewport === "tablet"
              ? "max-w-[34rem]"
              : "max-w-[26rem]",
        "bg-light-glass-5 border-2 border-light-glass-20 backdrop-blur-[25px]",
        "shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1)]",
        className,
      )}
    >
      {/* Image zone */}
      <div
        className={cn(
          "relative overflow-hidden",
          isPhone ? "h-[280px]" : "h-[320px]",
        )}
        style={imageBackground}
      >
        {image && (
          <>
            <img
              src={image}
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </>
        )}
        <Badge
          label={`step ${step}/${totalSteps}`}
          color="neutral"
          variant="outline"
          className="absolute top-4 right-4 h-auto py-0.5 px-1.5"
        />
        {children}
      </div>

      {/* Content zone */}
      <div className={cn("flex flex-col p-6", contentChildren ? "gap-6" : "gap-10")}>
        <div className="flex flex-col gap-4">
          <h2
            className={cn(
              "font-sans text-light-space",
              isPhone
                ? "font-normal text-[32px] leading-[1.2]"
                : "font-medium text-[48px] leading-[1.2]",
            )}
          >
            {title}
          </h2>
          <p
            className={cn(
              "font-sans text-light-space/80",
              isPhone
                ? "font-medium text-[14px] leading-[1.6]"
                : "text-[16px] leading-[1.45]",
            )}
          >
            {description}
          </p>
        </div>

        {contentChildren}

        {customActions}

        {!customActions && (primaryLabel || secondaryLabel) && (
          <div
            className={cn("flex", isCompact && "flex-col")}
            style={{ gap: buttonGap ?? 8 }}
          >
            {primaryLabel && (
              <Button
                variant="primary-neutral"
                size="xl"
                className="flex-1"
                onClick={onPrimary}
              >
                {primaryLabel}
              </Button>
            )}
            {secondaryLabel && (
              <Button
                variant="secondary-neutral"
                size="xl"
                className="flex-1"
                onClick={onSecondary}
              >
                {secondaryLabel}
              </Button>
            )}
          </div>
        )}
      </div>

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

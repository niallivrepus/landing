import { useGooeyViewport, type GooeyViewportPreference } from "../../hooks/use-viewport";
import { cn } from "../../lib/utils";
import { Button } from "./button";

const THEME_OPTIONS = [
  { value: "dark", label: "Dark", image: "/images/cards/theme.png" },
  { value: "light", label: "Light", image: "/images/cards/theme-1.png" },
  { value: "auto", label: "Auto", image: "/images/cards/theme-2.png" },
] as const;

interface ThemeSelectorCardProps {
  variant?: "desktop" | "phone";
  viewport?: GooeyViewportPreference;
  isDesktop?: boolean;
  selectedTheme: "dark" | "light" | "auto";
  onSelectTheme: (theme: "dark" | "light" | "auto") => void;
  onBack?: () => void;
  onNext?: () => void;
  className?: string;
}

export function ThemeSelectorCard({
  variant,
  viewport = "auto",
  isDesktop,
  selectedTheme,
  onSelectTheme,
  onBack,
  onNext,
  className,
}: ThemeSelectorCardProps) {
  const resolvedViewport = useGooeyViewport(
    viewport,
    isDesktop ?? (variant ? variant === "desktop" : undefined),
  );
  const isPhone = resolvedViewport === "phone";
  const showActions = resolvedViewport !== "phone";

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
        "bg-light-glass-5 border border-light-glass-20 backdrop-blur-[25px]",
        "shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1)]",
        className,
      )}
    >
      {/* Title section */}
      <div className="flex flex-col gap-4 p-6 pb-0">
        <h2
          className={cn(
            "font-sans font-bold text-light-space",
            isPhone ? "text-[32px] leading-[1.2]" : "text-[48px] leading-[1.2]",
          )}
        >
          Choose your look
        </h2>
        <p
          className={cn(
            "text-light-space/80",
            isPhone
              ? "font-sans font-medium text-[14px] leading-[1.6]"
              : "font-sans font-normal text-[16px] leading-[1.45]",
          )}
        >
          Choose your appearance. You can change this later in system settings.
        </p>
      </div>

      {/* Theme previews */}
      <div
        className={cn(
          "grid items-start p-6",
          isPhone ? "grid-cols-1 gap-4" : "grid-cols-3 gap-4",
        )}
      >
        {THEME_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelectTheme(option.value)}
            className="flex flex-col items-center gap-2 cursor-pointer flex-1"
          >
            {/* Preview card */}
            <div
              className={cn(
                "rounded-[24px] overflow-hidden w-full",
                isPhone ? "aspect-[1.35/1]" : "h-[184px]",
                selectedTheme === option.value
                  ? "border-[5.474px] border-[#0066FF]"
                  : "border-[5.474px] border-transparent",
              )}
              style={{
                background: "linear-gradient(to top, #E7FCF6, #CCD4E9)",
              }}
            >
              <img
                src={option.image}
                alt={`${option.label} theme preview`}
                className="size-full object-cover"
              />
            </div>

            {/* Glass label badge */}
            <div
              className="relative h-6 px-3 rounded-full flex items-center justify-center bg-light-glass-20 backdrop-blur-[25px]"
              style={{
                boxShadow: "0px 1px 4px 0px rgba(0,0,0,0.1)",
              }}
            >
              <span className="font-mono text-[12px] text-light-space"
                style={{
                  textShadow: "0px -0.5px 1px rgba(0,0,0,0.5), 0px 0.5px 1px white",
                }}
              >
                {option.label}
              </span>
              <div
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  boxShadow: "none",
                }}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Buttons (desktop only) */}
      {showActions && (
        <div className="flex gap-2 px-6 pb-6">
          <Button
            variant="secondary-neutral"
            size="xl"
            className="flex-1"
            onClick={onBack}
          >
            Back
          </Button>
          <Button
            variant="primary-neutral"
            size="xl"
            className="flex-1"
            onClick={onNext}
          >
            Next
          </Button>
        </div>
      )}

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

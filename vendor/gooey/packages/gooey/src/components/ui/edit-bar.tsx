import { cn } from "../../lib/utils";
import {
  LinkIcon,
  MoveIcon,
  SearchIcon,
  UploadIcon,
  SettingsIcon,
  AspectSquareSmall,
  AspectWide,
  AspectTall,
  AspectSquareLarge,
  EditBarDivider,
  ColorDot,
} from "./edit-bar-icons";

/**
 * EditBar - Contextual action bar for editing operations
 *
 * A glass-morphic pill bar with various configurations for different editing contexts.
 *
 * Variants:
 * - input-field: "Paste link" text with link icon
 * - resolution-search: Aspect ratios + move/search icons
 * - color-select: Aspect ratios + color selection dots
 * - upload: Aspect ratios + upload icon
 * - link: Aspect ratios + link icon
 * - resolution: Aspect ratios only
 * - settings: Aspect ratios + settings (gear) icon
 */

type EditBarVariant =
  | "input-field"
  | "resolution-search"
  | "color-select"
  | "upload"
  | "link"
  | "resolution"
  | "settings";

type AspectRatio = "1:1" | "2:1" | "1:2" | "1:1-large";

interface EditBarProps {
  variant?: EditBarVariant;
  /** Colors for color-select variant */
  colors?: string[];
  /** Custom text for input-field variant */
  text?: string;
  /** Click handler for aspect ratio buttons */
  onAspectSelect?: (aspect: AspectRatio) => void;
  /** Aspect ratios that should be disabled (won't fit in grid) */
  disabledAspects?: AspectRatio[];
  /** Click handlers for action icons */
  onMove?: () => void;
  onSearch?: () => void;
  onUpload?: () => void;
  onLink?: () => void;
  onSettings?: () => void;
  onColorSelect?: (color: string) => void;
  className?: string;
}

function EditBar({
  variant = "input-field",
  colors = ["#9327ff", "#21dc11"],
  text = "Paste link",
  onAspectSelect,
  disabledAspects = [],
  onMove,
  onSearch,
  onUpload,
  onLink,
  onSettings,
  onColorSelect,
  className,
}: EditBarProps) {
  const disabledSet = new Set(disabledAspects);
  const showAspectRatios = variant !== "input-field";
  const showDivider = variant !== "input-field" && variant !== "resolution";

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center h-10 w-fit px-4 rounded-full",
        "bg-light-glass-5 border border-light-glass-20",
        "backdrop-blur-[25px]",
        "relative",
        variant === "resolution" ? "" : "gap-3",
        className
      )}
      style={{
        boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Input field variant: text + link icon */}
      {variant === "input-field" && (
        <>
          <span className="text-light-space text-base font-bold leading-[1.4] shrink-0">
            {text}
          </span>
          <LinkIcon size={14} className="text-light-space shrink-0" />
        </>
      )}

      {/* Aspect ratio buttons */}
      {showAspectRatios && (
        <div className="flex items-center gap-2 shrink-0">
          {([
            { aspect: "1:1" as const, Icon: AspectSquareSmall },
            { aspect: "2:1" as const, Icon: AspectWide },
            { aspect: "1:2" as const, Icon: AspectTall },
            { aspect: "1:1-large" as const, Icon: AspectSquareLarge },
          ]).map(({ aspect, Icon }) => {
            const isDisabled = disabledSet.has(aspect);
            return (
              <button
                key={aspect}
                type="button"
                disabled={isDisabled}
                onClick={() => !isDisabled && onAspectSelect?.(aspect)}
                className={cn(
                  "transition-opacity",
                  isDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:opacity-80",
                )}
              >
                <Icon />
              </button>
            );
          })}
        </div>
      )}

      {/* Divider */}
      {showDivider && <EditBarDivider />}

      {/* Resolution + Search variant: move and search icons */}
      {variant === "resolution-search" && (
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onMove}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <MoveIcon size={14} strokeWidth={1.25} className="text-light-space" />
          </button>
          <button
            type="button"
            onClick={onSearch}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <SearchIcon size={14} className="text-light-space" />
          </button>
        </div>
      )}

      {/* Color select variant: color dots */}
      {variant === "color-select" && (
        <div className="flex items-center gap-2 shrink-0">
          {colors.map((color, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onColorSelect?.(color)}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <ColorDot color={color} />
            </button>
          ))}
        </div>
      )}

      {/* Upload variant: upload icon */}
      {variant === "upload" && (
        <button
          type="button"
          onClick={onUpload}
          className="cursor-pointer hover:opacity-80 transition-opacity shrink-0"
        >
          <UploadIcon size={14} className="text-light-space" />
        </button>
      )}

      {/* Link variant: link icon */}
      {variant === "link" && (
        <button
          type="button"
          onClick={onLink}
          className="cursor-pointer hover:opacity-80 transition-opacity shrink-0"
        >
          <LinkIcon size={14} className="text-light-space" />
        </button>
      )}

      {/* Settings variant: gear icon */}
      {variant === "settings" && (
        <button
          type="button"
          onClick={onSettings}
          className="cursor-pointer hover:opacity-80 transition-opacity shrink-0"
        >
          <SettingsIcon size={14} className="text-light-space" />
        </button>
      )}

      {/* Inner highlight effect */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          boxShadow: "none",
        }}
      />
    </div>
  );
}

export { EditBar, type EditBarProps, type EditBarVariant, type AspectRatio };

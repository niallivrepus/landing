import { cn } from "../../lib/utils";

type OriginColor = "fruta" | "flame" | "solar" | "life" | "aether" | "insight" | "spirit";

/** an origin key (gradient border) or any css color string (solid border). */
type HypeTrainColor = OriginColor | (string & {});

type HypeTrainSize = "large" | "medium" | "small";

const HYPE_TRAIN_SIZES: Record<HypeTrainSize, { width: string; height: string; border: number; overlap: number }> = {
  large:  { width: "40px", height: "54px", border: 3, overlap: -33 },
  medium: { width: "30px", height: "40px", border: 3, overlap: -23 },
  small:  { width: "18px", height: "24px", border: 2, overlap: -8 },
};

const ORIGINS_GRADIENTS: Record<OriginColor, { start: string; end: string }> = {
  fruta:   { start: "#CB0B03", end: "#FF0970" },
  flame:   { start: "#FF4D00", end: "#FFB800" },
  solar:   { start: "#FF9D00", end: "#F2FF3D" },
  life:    { start: "#77FF00", end: "#D8FF3D" },
  aether:  { start: "#002FFF", end: "#3D7EFF" },
  insight: { start: "#7700FF", end: "#B200FF" },
  spirit:  { start: "#FF00D9", end: "#FF58B4" },
};

interface AvatarHypeTrainProps {
  /** Exactly 3 avatar image URLs (back → middle → front) */
  avatarSrcs: [string, string, string];
  /**
   * One color per avatar (back → middle → front). An origin key renders a
   * gradient border; any other css color string renders a solid border.
   */
  colors: [HypeTrainColor, HypeTrainColor, HypeTrainColor];
  /** Size variant — "large" (54px), "medium" (40px), or "small" (24px) */
  size?: HypeTrainSize;
  className?: string;
}

/**
 * AvatarHypeTrain — 3 overlapping circular avatars with origin-colored gradient borders.
 *
 * DOM order = back-to-front (last rendered = frontmost).
 * Each avatar gets its own origin gradient border and a negative
 * right margin to create the overlap effect.
 */
function AvatarHypeTrain({ avatarSrcs, colors, size = "large", className }: AvatarHypeTrainProps) {
  const s = HYPE_TRAIN_SIZES[size];

  return (
    <div
      className={cn("flex items-center shrink-0", className)}
      style={{ filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.25))" }}
    >
      {avatarSrcs.map((src, i) => {
        const gradient = ORIGINS_GRADIENTS[colors[i] as OriginColor];
        const border = gradient
          ? `linear-gradient(135deg, ${gradient.start} 0%, ${gradient.end} 100%)`
          : colors[i];
        return (
          <div
            key={i}
            className="rounded-full shrink-0 overflow-hidden"
            style={{
              width: s.width,
              height: s.height,
              padding: s.border,
              background: border,
              boxShadow: s.border <= 2
                ? "none"
                : "none",
              marginRight: i < 2 ? s.overlap : undefined,
              zIndex: i,
              position: "relative",
            }}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        );
      })}
    </div>
  );
}

export { AvatarHypeTrain, type AvatarHypeTrainProps, type OriginColor, type HypeTrainColor, type HypeTrainSize };

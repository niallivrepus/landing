import { cn } from "../../lib/utils";
import { GooeyGlass } from "./gooey-glass";

interface ServerAvatarProps {
  /**
   * Image source for a full-bleed custom server avatar.
   */
  src?: string;
  /**
   * SVG source for a centered logo mark.
   * Rendered as a white mask over the chosen background.
   */
  symbolSrc?: string;
  /**
   * Canvas background for SVG symbol avatars.
   */
  backgroundColor?: string;
  /**
   * Logo scale inside the canvas. 0.5 keeps the mark at 50%.
   */
  symbolScale?: number;
  /**
   * Symbol color. White is stable across dark and light mode.
   */
  symbolColor?: string;
  /**
   * Alt text for the image
   */
  alt?: string;
  /**
   * Diameter in pixels (default 36)
   */
  size?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Click handler
   */
  onClick?: () => void;
}

/**
 * JokuhSymbol - The small Jokuh owl eyes icon
 */
function JokuhSymbol() {
  return (
    <svg
      width={14}
      height={8}
      viewBox="0 0 38 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M27.7824 5.14531C22.5874 6.36044 19.7007 9.48499 19.1325 9.48499C18.5643 9.48499 15.6776 6.36044 10.4827 5.14531C6.70459 4.26162 4.14221 7.69747 6.64694 12.1901C8.19379 15.678 9.77851 17 12.2418 17C14.1937 17 15.4004 15.9752 16.3073 15.3788C16.9965 14.9255 18.035 14.1105 19.1326 14.1105C20.2302 14.1105 21.2686 14.9255 21.958 15.3788C22.8648 15.9752 24.0714 17 26.0234 17C28.4866 17 30.0715 15.678 31.6183 12.1901C33.509 7.50321 31.5608 4.26176 27.7827 5.14546L27.7824 5.14531ZM16.9692 12.4816C16.4843 13.1956 12.9576 15.3082 11.0573 14.0865C9.15706 12.8649 7.37419 8.7448 8.59416 7.85859C9.81413 6.97238 18.1891 10.685 16.9692 12.4816ZM27.2076 14.0865C25.3073 15.3082 21.7807 13.1957 21.2958 12.4816C20.0758 10.685 28.451 6.97223 29.6708 7.85844C30.8906 8.74466 29.1077 12.8649 27.2076 14.0865Z"
        fill="white"
      />
    </svg>
  );
}

/**
 * ServerAvatar - A 36x36px circular avatar for servers/communities
 *
 * Shows a custom image or the default Jokuh symbol on a dark background.
 * Features an inset 2px glass border and rim light.
 */
function ServerAvatar({
  src,
  symbolSrc,
  backgroundColor = "var(--color-dark-space, black)",
  symbolScale = 0.5,
  symbolColor = "white",
  alt = "",
  size = 36,
  className,
  onClick,
}: ServerAvatarProps) {
  const symbolSize = Math.max(0, Math.min(symbolScale, 1)) * 100;

  return (
    <GooeyGlass
      className={cn(
        "relative rounded-full overflow-hidden flex items-center justify-center",
        onClick && "cursor-pointer",
        className
      )}
      contentClassName="absolute inset-0 z-10 flex items-center justify-center"
      filterContent={false}
      lens={{
        width: size,
        height: size,
        borderRadius: 999,
        scale: 6,
        depth: 0.56,
        curvature: 1.45,
        chroma: 0.1,
        glow: 0.12,
        edgeHighlight: 0.24,
      }}
      style={{
        width: size,
        height: size,
        backgroundColor: src ? "transparent" : backgroundColor,
        boxShadow: "none",
      }}
      onClick={onClick}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 size-full object-cover"
        />
      ) : symbolSrc ? (
        <span
          aria-hidden="true"
          className="block object-contain"
          style={{
            width: `${symbolSize}%`,
            height: `${symbolSize}%`,
            backgroundColor: symbolColor,
            maskImage: `url("${symbolSrc}")`,
            maskPosition: "center",
            maskRepeat: "no-repeat",
            maskSize: "contain",
            WebkitMaskImage: `url("${symbolSrc}")`,
            WebkitMaskPosition: "center",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
          }}
        />
      ) : (
        <JokuhSymbol />
      )}
    </GooeyGlass>
  );
}

export { ServerAvatar, type ServerAvatarProps };

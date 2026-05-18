import { cn } from "../../lib/utils";

interface AlbumArtCoverProps {
  /**
   * Size variant of the album art cover
   * @default "large"
   */
  size?: "large" | "medium" | "small";
  /**
   * Image source URL for the album art
   */
  src?: string;
  /**
   * Alt text for the image
   */
  alt?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

const SIZE_CONFIG = {
  large: { dimension: 48, borderRadius: 12, iconSize: 24 },
  medium: { dimension: 32, borderRadius: 8, iconSize: 20 },
  small: { dimension: 24, borderRadius: 6, iconSize: 14 },
} as const;

/** Music note placeholder icon for large size (24x24) */
function MusicNoteLarge() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_dd_large)">
        <path
          d="M9.75 18.75C9.75 20.1307 8.40685 21.25 6.75 21.25C5.09315 21.25 3.75 20.1307 3.75 18.75C3.75 17.3693 5.09315 16.25 6.75 16.25C8.40685 16.25 9.75 17.3693 9.75 18.75ZM9.75 18.75V5.75L20.2522 2.75V15.75M20.2522 15.75C20.2522 17.1307 18.9091 18.25 17.2522 18.25C15.5953 18.25 14.2522 17.1307 14.2522 15.75C14.2522 14.3693 15.5953 13.25 17.2522 13.25C18.9091 13.25 20.2522 14.3693 20.2522 15.75Z"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
          shapeRendering="crispEdges"
        />
      </g>
      <defs>
        <filter
          id="filter0_dd_large"
          x="2"
          y="0.5"
          width="20.0022"
          height="23"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="-0.5" />
          <feGaussianBlur stdDeviation="0.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="0.5" />
          <feGaussianBlur stdDeviation="0.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
          <feBlend mode="overlay" in2="effect1_dropShadow" result="effect2_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}

/** Music note placeholder icon for medium size (20x20) */
function MusicNoteMedium() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_dd_medium)">
        <path
          d="M8.125 15.625C8.125 16.7756 7.00571 17.7083 5.625 17.7083C4.24429 17.7083 3.125 16.7756 3.125 15.625C3.125 14.4744 4.24429 13.5416 5.625 13.5416C7.00571 13.5416 8.125 14.4744 8.125 15.625ZM8.125 15.625V4.79163L16.8768 2.29163V13.125M16.8768 13.125C16.8768 14.2756 15.7575 15.2083 14.3768 15.2083C12.9961 15.2083 11.8768 14.2756 11.8768 13.125C11.8768 11.9744 12.9961 11.0416 14.3768 11.0416C15.7575 11.0416 16.8768 11.9744 16.8768 13.125Z"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
          shapeRendering="crispEdges"
        />
      </g>
      <defs>
        <filter
          id="filter0_dd_medium"
          x="1.54167"
          y="0.291626"
          width="16.9186"
          height="19.4166"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="-0.416667" />
          <feGaussianBlur stdDeviation="0.416667" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="0.416667" />
          <feGaussianBlur stdDeviation="0.416667" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
          <feBlend mode="overlay" in2="effect1_dropShadow" result="effect2_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}

/** Music note placeholder icon for small size (14x14) */
function MusicNoteSmall() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_small)">
        <g filter="url(#filter0_dd_small)">
          <path
            d="M5.6875 10.9375C5.6875 11.7429 4.904 12.3958 3.9375 12.3958C2.971 12.3958 2.1875 11.7429 2.1875 10.9375C2.1875 10.132 2.971 9.47913 3.9375 9.47913C4.904 9.47913 5.6875 10.132 5.6875 10.9375ZM5.6875 10.9375V3.35413L11.8138 1.60413V9.18746M11.8138 9.18746C11.8138 9.99288 11.0303 10.6458 10.0638 10.6458C9.09728 10.6458 8.31378 9.99288 8.31378 9.18746C8.31378 8.38204 9.09728 7.72913 10.0638 7.72913C11.0303 7.72913 11.8138 8.38204 11.8138 9.18746Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinejoin="round"
            shapeRendering="crispEdges"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_dd_small"
          x="0.854167"
          y="-0.0208741"
          width="12.2929"
          height="14.0416"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="-0.291667" />
          <feGaussianBlur stdDeviation="0.291667" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="0.291667" />
          <feGaussianBlur stdDeviation="0.291667" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
          <feBlend mode="overlay" in2="effect1_dropShadow" result="effect2_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow" result="shape" />
        </filter>
        <clipPath id="clip0_small">
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

/** Returns the appropriate music note icon for the given size */
function MusicNotePlaceholder({ size }: { size: "large" | "medium" | "small" }) {
  switch (size) {
    case "large":
      return <MusicNoteLarge />;
    case "medium":
      return <MusicNoteMedium />;
    case "small":
      return <MusicNoteSmall />;
  }
}

/**
 * AlbumArtCover - A rounded image container for album artwork
 *
 * Features:
 * - Three sizes: large (48px), medium (32px), small (24px)
 * - Subtle drop shadow and inner rimlight
 * - Light glass border
 * - Music note placeholder when no image provided
 */
function AlbumArtCover({
  size = "large",
  src,
  alt = "Album art",
  className,
}: AlbumArtCoverProps) {
  const config = SIZE_CONFIG[size];

  return (
    <div
      className={cn("relative overflow-hidden flex items-center justify-center shrink-0", className)}
      style={{
        width: config.dimension,
        height: config.dimension,
        borderRadius: config.borderRadius,
        border: "1px solid rgba(255, 255, 255, 0.05)",
        boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.1)",
        backgroundColor: src ? undefined : "rgba(0, 0, 0, 0.3)",
      }}
      data-slot="album-art-cover"
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 size-full object-cover"
          style={{ borderRadius: config.borderRadius }}
        />
      ) : (
        <MusicNotePlaceholder size={size} />
      )}
      {/* Inner rimlight */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: config.borderRadius,
          boxShadow: "inset 0px 2px 4px 0px rgba(255, 255, 255, 0.15)",
        }}
      />
    </div>
  );
}

export { AlbumArtCover, type AlbumArtCoverProps };

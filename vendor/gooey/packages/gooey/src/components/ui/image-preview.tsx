import { cn } from "../../lib/utils";

interface ImagePreviewProps {
  /**
   * Image source URL
   */
  src: string;
  /**
   * Alt text for accessibility
   */
  alt?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Inline styles for positioning
   */
  style?: React.CSSProperties;
  /**
   * Click handler
   */
  onClick?: () => void;
}

/**
 * ImagePreview - A 40x40px rounded image container with border and shadow
 *
 * Features a subtle border with glass effect and drop shadow.
 */
function ImagePreview({ src, alt = "", className, style, onClick }: ImagePreviewProps) {
  return (
    <div
      className={cn(
        "relative size-9 rounded-[8px] overflow-hidden cursor-pointer",
        className
      )}
      style={{
        border: "1px solid var(--color-light-glass-30)",
        boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.1)",
        ...style,
      }}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 size-full object-cover"
      />
    </div>
  );
}

export { ImagePreview, type ImagePreviewProps };

import { motion } from "motion/react";
import { cn } from "../../lib/utils";
import { ImagePreview } from "./image-preview";

interface ImageStackProps {
  /**
   * Array of image sources (uses first 2)
   */
  images: string[];
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
 * ImageStack - A 50x50px container with two stacked ImagePreview components
 *
 * The back image is rotated 15 degrees, creating a stacked card effect.
 * Animates in with fade and bouncy rotation on the top image.
 */
function ImageStack({ images, className, onClick }: ImageStackProps) {
  const [backImage, frontImage] = images;

  return (
    <motion.div
      className={cn("relative size-[50px] cursor-pointer", className)}
      onClick={onClick}
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      {/* Back image - rotated 15 degrees, fades in, spreads on hover */}
      {backImage && (
        <motion.div
          className="absolute"
          style={{
            left: 5,
            top: 4.5,
            transformOrigin: "center center",
          }}
          initial={{ opacity: 0, rotate: 0, x: 0, y: 0 }}
          animate={{ opacity: 1, rotate: 15, x: 0, y: 0 }}
          variants={{
            rest: { rotate: 15, x: 0, y: 0 },
            hover: { rotate: 22, x: 3, y: -2 },
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
        >
          <ImagePreview src={backImage} />
        </motion.div>
      )}

      {/* Front image - fades in, rotates slightly on hover */}
      {frontImage && (
        <motion.div
          className="absolute"
          style={{
            left: 5,
            top: 4.5,
          }}
          initial={{ opacity: 0, rotate: 0, x: 0, y: 0 }}
          animate={{ opacity: 1, rotate: 0, x: 0, y: 0 }}
          variants={{
            rest: { rotate: 0, x: 0, y: 0 },
            hover: { rotate: -5, x: -2, y: 1 },
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
        >
          <ImagePreview src={frontImage} />
        </motion.div>
      )}
    </motion.div>
  );
}

export { ImageStack, type ImageStackProps };

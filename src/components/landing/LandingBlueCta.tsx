import type { ReactNode } from "react";
import { useGentleHoverSound } from "../../hooks/useGentleHoverSound";
import { SiteLink } from "../SiteLink";
import { jokuhButtonClass } from "../system/JokuhButton";

/**
 * **Purpose:** Gooey-blue accent CTA (`JokuhButton` `accent`) for high-intent conversions like Download.
 * **Connects to:** `LandingImmersiveShell`, Gooey `--color-blue-*` tokens, hover-sound guidelines.
 */
export function LandingBlueCta({
  href,
  children,
  className,
  download,
  target,
  rel,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  download?: boolean;
  target?: string;
  rel?: string;
}) {
  const hoverSoundProps = useGentleHoverSound(true, "premium");

  return (
    <SiteLink
      href={href}
      download={download}
      target={target}
      rel={rel}
      {...hoverSoundProps}
      className={jokuhButtonClass("accent", "lg", className)}
    >
      {children}
    </SiteLink>
  );
}

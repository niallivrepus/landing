import type { ReactNode } from "react";
import { cn } from "@jokuh/gooey";
import { useGentleHoverSound } from "../../hooks/useGentleHoverSound";
import { SiteLink } from "../SiteLink";

/**
 * **Purpose:** Brand-blue pill CTA for high-intent landing conversions (Download, product hero parity).
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
      className={cn(
        "inline-flex h-[50px] shrink-0 items-center justify-center gap-2 rounded-full px-5 font-sans text-sm font-bold text-white no-underline",
        "border border-transparent bg-[var(--color-blue-4)] shadow-[var(--shadow-pill)]",
        "premium-soft-button hover:border-[var(--color-blue-3)] hover:bg-[var(--color-blue-5)] active:translate-y-px active:bg-[var(--color-blue-3)]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-blue-4)]/45",
        "light:bg-[var(--color-blue-4)] light:text-white light:hover:bg-[var(--color-blue-5)]",
        className,
      )}
    >
      {children}
    </SiteLink>
  );
}

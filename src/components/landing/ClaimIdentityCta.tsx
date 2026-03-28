import type { ReactNode } from "react";
import { cn } from "@jokuh/gooey";
import { useGentleHoverSound } from "../../hooks/useGentleHoverSound";
import { CtaLordIcon } from "../CtaLordIcon";

export function ClaimIdentityCta({
  href,
  children = "Claim identity",
  className,
}: {
  href: string;
  children?: ReactNode;
  className?: string;
}) {
  const hoverSoundProps = useGentleHoverSound();

  return (
    <a
      href={href}
      {...hoverSoundProps}
      className={cn(
        "inline-flex h-[50px] shrink-0 items-center justify-center gap-2 rounded-full border-2 border-light-space/25 bg-white px-8 font-sans text-sm font-bold text-black",
        "shadow-[0px_1px_0px_rgba(255,255,255,0.6)_inset,0px_10px_28px_rgba(0,0,0,0.35)]",
        "premium-soft-button hover:border-light-space/36 hover:bg-zinc-100 hover:shadow-[0px_1px_0px_rgba(255,255,255,0.6)_inset,0px_18px_36px_rgba(0,0,0,0.18)] active:translate-y-px",
        "light:border-black/20 light:bg-zinc-900 light:text-white light:shadow-[0px_1px_0px_rgba(255,255,255,0.08)_inset,0px_10px_28px_rgba(0,0,0,0.15)] light:hover:border-black/28 light:hover:bg-zinc-800 light:hover:shadow-[0px_1px_0px_rgba(255,255,255,0.08)_inset,0px_18px_34px_rgba(0,0,0,0.18)]",
        className,
      )}
    >
      <CtaLordIcon icon="domainVerification" size={18} darkColor="#000000" lightColor="#ffffff" />
      {children}
    </a>
  );
}

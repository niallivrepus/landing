import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@jokuh/gooey";
import { useGentleHoverSound } from "../../hooks/useGentleHoverSound";

export function ProductPurpleCta({ children, to }: { children: ReactNode; to: string }) {
  const hoverSoundProps = useGentleHoverSound();

  return (
    <Link
      to={to}
      {...hoverSoundProps}
      className={cn(
        "inline-flex h-[50px] items-center justify-center rounded-full border-2 border-[#6729ec] bg-[#170047] px-6 font-sans text-base font-bold text-white",
        "shadow-[0_0_6px_rgba(135,40,255,0.6),0_0_25px_rgba(177,140,255,0.15)]",
        "premium-soft-button hover:shadow-[0_0_10px_rgba(135,40,255,0.72),0_0_34px_rgba(177,140,255,0.18)] active:translate-y-px",
        "light:border-violet-300 light:bg-violet-50 light:text-violet-950 light:shadow-[0_10px_28px_-20px_rgba(124,58,237,0.35)] light:hover:bg-violet-100 light:hover:shadow-[0_16px_34px_-22px_rgba(124,58,237,0.28)]",
      )}
    >
      {children}
    </Link>
  );
}

export function ProductGreenGlowLink({ children, to }: { children: ReactNode; to: string }) {
  const hoverSoundProps = useGentleHoverSound();

  return (
    <Link
      to={to}
      {...hoverSoundProps}
      className={cn(
        "inline-flex h-[50px] items-center justify-center rounded-full border-2 border-[#8cff19] bg-[#0d1f06] px-5 font-sans text-base font-bold text-white",
        "shadow-[0_0_6px_rgba(140,255,25,0.45),0_0_22px_rgba(167,255,56,0.12)]",
        "premium-soft-button hover:brightness-110 hover:shadow-[0_0_8px_rgba(140,255,25,0.4),0_0_28px_rgba(167,255,56,0.16)] active:translate-y-px",
        "light:border-emerald-300 light:bg-emerald-50 light:text-emerald-950 light:shadow-[0_10px_28px_-20px_rgba(5,150,105,0.28)] light:hover:bg-emerald-100 light:hover:shadow-[0_16px_34px_-22px_rgba(5,150,105,0.24)]",
      )}
    >
      {children}
    </Link>
  );
}

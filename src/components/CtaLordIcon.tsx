import { lordiconAssets, type GooeyLordiconAssetName } from "@jokuh/gooey";
import { Player } from "@lordicon/react";
import { useRef } from "react";

export function CtaLordIcon({
  icon,
  size = 16,
  darkColor = "#000000",
  lightColor = "#ffffff",
  className,
}: {
  icon: GooeyLordiconAssetName;
  size?: number;
  darkColor?: string;
  lightColor?: string;
  className?: string;
}) {
  const darkRef = useRef<any>(null);
  const lightRef = useRef<any>(null);

  const handleMouseEnter = () => {
    darkRef.current?.playFromBeginning();
    lightRef.current?.playFromBeginning();
  };

  return (
    <span onMouseEnter={handleMouseEnter} className={className} aria-hidden>
      <span className="flex items-center justify-center [.light_&]:hidden">
        <Player ref={darkRef} icon={lordiconAssets[icon]} size={size} colorize={darkColor} />
      </span>
      <span className="hidden items-center justify-center [.light_&]:flex">
        <Player ref={lightRef} icon={lordiconAssets[icon]} size={size} colorize={lightColor} />
      </span>
    </span>
  );
}

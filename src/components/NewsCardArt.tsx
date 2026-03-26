import { useState } from "react";
import { cn } from "@jokuh/gooey";

export function NewsCardArt({
  gradient,
  image,
  className,
}: {
  gradient: string;
  image?: string;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  const showImg = image && !broken;

  return (
    <div className={cn("relative size-full overflow-hidden bg-zinc-950", className)}>
      {showImg ? (
        <>
          <img
            src={image}
            alt=""
            className="size-full object-cover brightness-[0.88] contrast-[1.04] saturate-[0.78]"
            loading="lazy"
            decoding="async"
            onError={() => setBroken(true)}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-black/25"
            aria-hidden
          />
        </>
      ) : (
        <div className="size-full" style={{ background: gradient }} />
      )}
    </div>
  );
}

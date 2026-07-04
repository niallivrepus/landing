import { ArrowUpRight } from "lucide-react";
import { cn } from "@jokuh/gooey";

/** Diagonal up-right mark for links that leave the current host (other subdomain or external site). */
export function OffSiteGlyph({ className }: { className?: string }) {
  return (
    <ArrowUpRight
      className={cn("shrink-0 text-current opacity-90", className)}
      size={14}
      strokeWidth={2}
      aria-hidden
    />
  );
}

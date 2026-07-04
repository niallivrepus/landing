import {
  Link01Icon as LinkIcon,
  Drag01Icon as MoveIcon,
  Search01Icon as SearchIcon,
  Upload01Icon as UploadIcon,
  Settings01Icon as SettingsIcon,
} from "hugeicons-react";
import { cn } from "../../lib/utils";

/**
 * Icons for EditBar component
 */

export { LinkIcon, MoveIcon, SearchIcon, UploadIcon, SettingsIcon };

/** Aspect ratio icons with indent shadow effect */

export function AspectSquareSmall({ className }: { className?: string }) {
  return (
    <div
      className={cn("size-[9px] rounded-[3px] border border-white shrink-0", className)}
      style={{
        boxShadow: "0px 0.5px 1px 0px white, 0px -0.5px 1px 0px rgba(0, 0, 0, 0.5)",
      }}
    />
  );
}

export function AspectWide({ className }: { className?: string }) {
  return (
    <div
      className={cn("w-4 h-[9px] rounded-[3px] border border-white shrink-0", className)}
      style={{
        boxShadow: "0px 0.5px 1px 0px white, 0px -0.5px 1px 0px rgba(0, 0, 0, 0.5)",
      }}
    />
  );
}

export function AspectTall({ className }: { className?: string }) {
  return (
    <div
      className={cn("w-[9px] h-4 rounded-[3px] border border-white shrink-0", className)}
      style={{
        boxShadow: "0px 0.5px 1px 0px white, 0px -0.5px 1px 0px rgba(0, 0, 0, 0.5)",
      }}
    />
  );
}

export function AspectSquareLarge({ className }: { className?: string }) {
  return (
    <div
      className={cn("size-4 rounded-[4px] border border-white shrink-0", className)}
      style={{
        boxShadow: "0px 0.5px 1px 0px white, 0px -0.5px 1px 0px rgba(0, 0, 0, 0.5)",
      }}
    />
  );
}

export function EditBarDivider({ className }: { className?: string }) {
  return (
    <div className={cn("w-px h-4 rounded-full bg-smoke-4 shrink-0", className)} />
  );
}

export function ColorDot({ color, className }: { color: string; className?: string }) {
  return (
    <div
      className={cn("size-4 rounded-full shrink-0 relative", className)}
      style={{ backgroundColor: color }}
    >
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ boxShadow: "none" }}
      />
    </div>
  );
}

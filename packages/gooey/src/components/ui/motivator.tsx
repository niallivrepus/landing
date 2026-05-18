import { cn } from "../../lib/utils";

import { Button } from "./button";

export interface MotivatorProps {
  className?: string;
  onUpgrade?: () => void;
}

export function Motivator({ className, onUpgrade }: MotivatorProps) {
  return (
    <div
      className={cn(
        "flex w-full max-w-[474px] flex-col gap-3 rounded-[32px] border-2 border-[var(--color-light-glass-20)] px-4 py-4 backdrop-blur-[25px] sm:h-[58px] sm:flex-row sm:items-center sm:gap-0 sm:rounded-full sm:py-1 sm:pl-6 sm:pr-1",
        className
      )}
      style={{
        background:
          "radial-gradient(ellipse at center, color-mix(in srgb, var(--color-green-4) 40%, transparent) 0%, color-mix(in srgb, var(--color-dark-space) 92%, transparent) 100%)",
        boxShadow:
          "0px 10px 20px 0px rgba(0, 0, 0, 0.10), inset 0px 1px 1px 0px rgba(255, 255, 255, 0.15), inset 0px 2px 3px 0px rgba(255, 255, 255, 0.05)",
      }}
    >
      <p
        className="mr-auto text-sm font-bold text-[var(--color-light-space)]"
        style={{ fontFamily: "Satoshi, sans-serif" }}
      >
        You're out of{" "}
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: "var(--gradient-life)" }}
        >
          free AI messages.
        </span>
      </p>

      <Button variant="primary-neutral" size="xl" className="w-full sm:w-auto" onClick={onUpgrade}>
        Upgrade
      </Button>
    </div>
  );
}

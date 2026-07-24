import { cn, useTheme } from "@jokuh/gooey";
import { Moon, Sun } from "lucide-react";

/**
 * **Purpose:** Footer light/dark theme switch — explicit `light` or `dark` (not system auto).
 * **Connects to:** `ThemeProvider` (`jokuh-landing-theme-v2`), `MegaFooter`.
 */
export function SiteThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div
      role="group"
      aria-label="Color theme"
      className={cn(
        "premium-soft-button inline-flex items-center rounded-full bg-light-space/[0.06] p-0.5 light:bg-section-grey-light",
        className,
      )}
    >
      <button
        type="button"
        aria-pressed={!isDark}
        aria-label="Light mode"
        onClick={() => setTheme?.("light")}
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-full transition-[background-color,color,box-shadow] duration-200",
          !isDark
            ? "bg-light-space/18 text-light-space shadow-[0_8px_20px_-14px_rgba(0,0,0,0.55)] light:bg-white light:text-zinc-900 light:shadow-[0_8px_18px_-14px_rgba(0,0,0,0.18)]"
            : "text-light-space/42 hover:text-light-space/70 light:text-zinc-500 light:hover:text-zinc-800",
        )}
      >
        <Sun className="size-4" strokeWidth={1.75} aria-hidden />
      </button>
      <button
        type="button"
        aria-pressed={isDark}
        aria-label="Dark mode"
        onClick={() => setTheme?.("dark")}
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-full transition-[background-color,color,box-shadow] duration-200",
          isDark
            ? "bg-light-space/18 text-light-space shadow-[0_8px_20px_-14px_rgba(0,0,0,0.55)] light:bg-zinc-900 light:text-white light:shadow-[0_8px_18px_-14px_rgba(0,0,0,0.22)]"
            : "text-light-space/42 hover:text-light-space/70 light:text-zinc-500 light:hover:text-zinc-800",
        )}
      >
        <Moon className="size-4" strokeWidth={1.75} aria-hidden />
      </button>
    </div>
  );
}

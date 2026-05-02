import type { ReactNode } from "react";
import { cn, useTheme } from "@jokuh/gooey";
import { MarketingPageFrame } from "./MarketingPageFrame";
import { CONTENT_SHELL_WIDE } from "./shells";

export const TERTIARY_PAGE_SHELL = CONTENT_SHELL_WIDE;
export const TERTIARY_READING_MEASURE = "w-full max-w-[720px]";

export function TertiaryPageChrome({
  children,
  className,
  theme,
}: {
  children: ReactNode;
  className?: string;
  theme?: "dark" | "light";
}) {
  const { resolvedTheme } = useTheme();
  const pageTheme = theme ?? (resolvedTheme === "light" ? "light" : "dark");

  return (
    <MarketingPageFrame wrapMain={false} withAntialiased withFontSans theme={pageTheme}>
      <div className={cn("pt-14", className)}>
        {children}
      </div>
    </MarketingPageFrame>
  );
}

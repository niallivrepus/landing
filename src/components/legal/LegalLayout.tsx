import type { ReactNode } from "react";
import { TertiaryPageChrome } from "../system";

export const legalLink =
  "rounded-sm text-[var(--color-blue-4)] transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-blue-4)]/30";
export const legalMuted = "text-light-space/66 light:text-zinc-600";

export function LegalLayout({ children }: { children: ReactNode }) {
  return <TertiaryPageChrome>{children}</TertiaryPageChrome>;
}

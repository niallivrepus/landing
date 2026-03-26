import type { ReactNode } from "react";
import { cn } from "@jokuh/gooey";
import { CONTENT_SHELL_NARROW, PAGE_TOP_PAD } from "./shells";

export function SimplePageMain({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn(CONTENT_SHELL_NARROW, PAGE_TOP_PAD, className)}>{children}</div>;
}

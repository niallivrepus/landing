import type { ReactNode } from "react";
import { cn } from "@jokuh/gooey";
import { Link } from "react-router-dom";
import { MarketingPageFrame } from "./MarketingPageFrame";

export const TERTIARY_PAGE_SHELL = "mx-auto w-full max-w-[1120px] px-4 md:px-8";
export const TERTIARY_READING_MEASURE = "w-full max-w-[720px]";

export type TertiaryBreadcrumbItem = {
  label: string;
  to?: string;
};

export function TertiaryPageChrome({
  children,
  breadcrumb,
  className,
  theme = "dark",
}: {
  children: ReactNode;
  breadcrumb?: ReactNode;
  className?: string;
  theme?: "dark" | "light";
}) {
  return (
    <MarketingPageFrame wrapMain={false} withAntialiased withFontSans theme={theme}>
      <div className={cn("pt-14", className)}>
        {breadcrumb}
        {children}
      </div>
    </MarketingPageFrame>
  );
}

export function TertiaryBreadcrumb({
  items,
  className,
}: {
  items: TertiaryBreadcrumbItem[];
  className?: string;
}) {
  return (
    <div className={cn("border-b border-light-space/[0.08] light:border-black/[0.08]", className)}>
      <div className={cn(TERTIARY_PAGE_SHELL, "py-3")}>
        <ol className="flex flex-wrap items-center gap-1 font-sans text-[12px] text-light-space/55 light:text-zinc-600">
          {items.map((item, index) => (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {index > 0 ? <span className="text-light-space/25 light:text-zinc-300">/</span> : null}
              {item.to ? (
                <Link to={item.to} className="transition-colors hover:text-light-space light:hover:text-zinc-950">
                  {item.label}
                </Link>
              ) : (
                <span className="text-light-space light:text-zinc-950">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

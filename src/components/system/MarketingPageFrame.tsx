import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@jokuh/gooey";
import { MegaFooter } from "../MegaFooter";
import { SiteTopBar } from "../SiteTopBar";
import { MARKETING_ROOT_CLASS } from "./shells";

export function MarketingPageFrame({
  beforeChrome,
  children,
  afterMain,
  afterFooter,
  className,
  mainClassName,
  mainProps,
  footer = <MegaFooter />,
  topBar = <SiteTopBar />,
  withAntialiased = false,
  withFontSans = false,
  wrapMain = true,
}: {
  beforeChrome?: ReactNode;
  children: ReactNode;
  afterMain?: ReactNode;
  afterFooter?: ReactNode;
  className?: string;
  mainClassName?: string;
  mainProps?: ComponentPropsWithoutRef<"main">;
  footer?: ReactNode;
  topBar?: ReactNode;
  withAntialiased?: boolean;
  withFontSans?: boolean;
  /** When false, children render after the top bar with no wrapping `<main>` (docs, legal). */
  wrapMain?: boolean;
}) {
  const body = wrapMain ? (
    <main className={mainClassName} {...mainProps}>
      {children}
    </main>
  ) : (
    children
  );

  return (
    <div
      className={cn(
        MARKETING_ROOT_CLASS,
        withFontSans && "font-sans",
        withAntialiased && "antialiased",
        className,
      )}
    >
      {beforeChrome}
      {topBar}
      {body}
      {afterMain}
      {footer}
      {afterFooter}
    </div>
  );
}

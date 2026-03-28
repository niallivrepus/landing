import type { ReactNode } from "react";
import { MarketingPageFrame } from "../MarketingPageFrame";
import { SimplePageMain } from "../SimplePageMain";
import { MarketingSimplePageTitle, MarketingStubDescription } from "../typography";

const DEFAULT_STUB =
  "This page is part of the Jokuh site map. Content is coming soon.";

export function SimpleMarketingPageTemplate({
  title,
  description = DEFAULT_STUB,
  children,
  beforeTitle,
  theme,
  frameClassName,
  mainClassName,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
  /** e.g. hero image above the title */
  beforeTitle?: ReactNode;
  theme?: "dark" | "light";
  frameClassName?: string;
  mainClassName?: string;
}) {
  return (
    <MarketingPageFrame theme={theme} className={frameClassName}>
      <SimplePageMain className={mainClassName}>
        {beforeTitle}
        <MarketingSimplePageTitle>{title}</MarketingSimplePageTitle>
        <MarketingStubDescription>{description}</MarketingStubDescription>
        {children}
      </SimplePageMain>
    </MarketingPageFrame>
  );
}

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
}: {
  title: string;
  description?: string;
  children?: ReactNode;
  /** e.g. hero image above the title */
  beforeTitle?: ReactNode;
}) {
  return (
    <MarketingPageFrame>
      <SimplePageMain>
        {beforeTitle}
        <MarketingSimplePageTitle>{title}</MarketingSimplePageTitle>
        <MarketingStubDescription>{description}</MarketingStubDescription>
        {children}
      </SimplePageMain>
    </MarketingPageFrame>
  );
}

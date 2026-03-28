import type { ReactNode } from "react";
import { cn } from "@jokuh/gooey";
import { ArticleMetaRow } from "../ArticleMetaRow";
import { MarketingPageFrame } from "../MarketingPageFrame";
import { CONTENT_READING_MEASURE, CONTENT_SHELL_WIDE } from "../shells";

export function EditorialArticleTemplate({
  metaLine,
  title,
  subtitle,
  afterMain,
  children,
  mainClassName,
  theme,
}: {
  metaLine: string;
  title: string;
  subtitle: string;
  afterMain?: ReactNode;
  children: ReactNode;
  mainClassName?: string;
  theme?: "dark" | "light";
}) {
  return (
    <MarketingPageFrame
      theme={theme}
      afterMain={afterMain}
      mainClassName={cn("pb-16 md:pb-24", mainClassName)}
    >
      <header className={cn(CONTENT_SHELL_WIDE, "pt-28 pb-10 text-center md:pt-32 md:pb-14")}>
        <ArticleMetaRow metaLine={metaLine} align="center" />
        <div className={cn(CONTENT_READING_MEASURE, "text-center")}>
          <h1 className="mt-4 font-sans text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.03em] text-light-space light:text-zinc-950 sm:mt-5 sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p className="news-detail-reading mt-6 text-[1.0625rem] font-normal leading-[1.65] text-light-space/72 light:text-zinc-600 md:mt-7 md:text-[1.125rem] md:leading-[1.62]">
            {subtitle}
          </p>
        </div>
      </header>

      {children}
    </MarketingPageFrame>
  );
}

export function EditorialArticleMeasure({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={CONTENT_SHELL_WIDE}>
      <div className={cn(CONTENT_READING_MEASURE, className)}>{children}</div>
    </div>
  );
}

export function EditorialArticleShellSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn(CONTENT_SHELL_WIDE, className)}>{children}</div>;
}

export function EditorialArticleProseSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <EditorialArticleMeasure className={cn("space-y-6 py-12 md:space-y-8 md:py-16", className)}>
      {children}
    </EditorialArticleMeasure>
  );
}

export function EditorialArticleHeadingSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <EditorialArticleMeasure className={cn("pb-6", className)}>
      <h2 className="text-left font-sans text-3xl font-semibold tracking-tight text-light-space light:text-zinc-950 md:text-4xl">
        {children}
      </h2>
    </EditorialArticleMeasure>
  );
}

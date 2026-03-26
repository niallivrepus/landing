import type { ReactNode } from "react";
import { cn } from "@jokuh/gooey";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { MarketingPageFrame } from "../MarketingPageFrame";
import { CONTENT_READING_MEASURE, CONTENT_SHELL_WIDE } from "../shells";

export function EditorialArticleTemplate({
  backHref,
  backLabel,
  metaLine,
  title,
  subtitle,
  afterMain,
  children,
  mainClassName,
}: {
  backHref: string;
  backLabel: string;
  metaLine: string;
  title: string;
  subtitle: string;
  afterMain?: ReactNode;
  children: ReactNode;
  mainClassName?: string;
}) {
  return (
    <MarketingPageFrame
      afterMain={afterMain}
      mainClassName={cn("pb-16 md:pb-24", mainClassName)}
    >
      <div className={cn(CONTENT_SHELL_WIDE, "pt-28 pb-6 md:pt-32")}>
        <Link
          to={backHref}
          className="inline-flex items-center gap-2 font-sans text-sm text-light-space/55 transition-colors hover:text-light-space"
        >
          <ArrowLeft className="size-4" aria-hidden />
          {backLabel}
        </Link>
      </div>

      <header className={cn(CONTENT_SHELL_WIDE, "pb-10 text-center md:pb-14")}>
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-light-space/45 md:text-xs">
          {metaLine}
        </p>
        <div className={cn(CONTENT_READING_MEASURE, "text-center")}>
          <h1 className="mt-5 font-sans text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.03em] text-light-space sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p className="news-detail-reading mt-6 text-[1.0625rem] font-normal leading-[1.65] text-light-space/72 md:mt-8 md:text-[1.125rem] md:leading-[1.62]">
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
      <h2 className="text-left font-sans text-3xl font-semibold tracking-tight text-light-space md:text-4xl">
        {children}
      </h2>
    </EditorialArticleMeasure>
  );
}

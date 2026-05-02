import type { ReactNode } from "react";
import { cn } from "@jokuh/gooey";
import { pageHeroEyebrowUppercaseClass } from "../system/typography";
import { CONTENT_SHELL_WIDE } from "../system/shells";

export function ProductStorySection({
  children,
  className,
  shellClassName,
}: {
  children: ReactNode;
  className?: string;
  shellClassName?: string;
}) {
  return (
    <section className={cn("py-20 md:py-28", className)}>
      <div className={cn(CONTENT_SHELL_WIDE, shellClassName)}>{children}</div>
    </section>
  );
}

export function ProductSectionIntro({
  eyebrow,
  title,
  body,
  align = "left",
  tone = "dark",
  className,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}) {
  const centered = align === "center";
  const titleColor =
    tone === "light" ? "text-zinc-950 dark:text-zinc-100" : "text-zinc-950 dark:text-light-space";
  const bodyColor =
    tone === "light" ? "text-zinc-600 dark:text-zinc-400" : "text-zinc-600 dark:text-light-space/55";

  return (
    <div className={cn(centered && "mx-auto text-center", className)}>
      {eyebrow ? (
        <p className={cn(pageHeroEyebrowUppercaseClass, "text-zinc-950 dark:text-zinc-100")}>{eyebrow}</p>
      ) : null}
      <h2
        className={cn(
          "font-sans text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[1.04] tracking-[0em]",
          eyebrow ? "mt-4" : "",
          centered && "mx-auto max-w-[16ch]",
          titleColor,
        )}
      >
        {title}
      </h2>
      {body ? (
        <p
          className={cn(
            "mt-5 max-w-[54ch] font-sans text-[15px] leading-relaxed md:text-[16px]",
            centered && "mx-auto",
            bodyColor,
          )}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}

export function ProductShowcaseSurface({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[32px] border border-zinc-200/80 bg-[#F5F5F7] shadow-[0_24px_80px_rgba(15,23,42,0.05)]",
        "dark:border-white/[0.08] dark:bg-[#1C1C1E] dark:shadow-[0_24px_80px_rgba(0,0,0,0.42)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

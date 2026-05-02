import { cn } from "@jokuh/gooey";
import { CONTENT_SHELL_WIDE } from "./shells";

export function EditorialQuoteBlock({
  text,
  attribution,
  className,
}: {
  text: string;
  attribution: string;
  className?: string;
}) {
  return (
    <div
      className={cn("w-full bg-transparent py-28 text-light-space light:text-zinc-950 md:py-36", className)}
    >
      <div className={cn(CONTENT_SHELL_WIDE, "text-center")}>
        <blockquote className="mx-auto max-w-[min(100%,40rem)]">
          <p className="text-pretty font-sans text-[1.5rem] font-medium leading-[1.38] tracking-[0em] text-light-space antialiased light:text-zinc-950 md:text-[1.875rem] md:leading-[1.3]">
            <span className="text-light-space light:text-zinc-950" aria-hidden="true">
              &ldquo;
            </span>
            {text}
            <span className="text-light-space light:text-zinc-950" aria-hidden="true">
              &rdquo;
            </span>
          </p>
          <footer className="mt-7 font-sans text-[0.875rem] font-normal leading-[1.5] text-light-space/72 light:text-zinc-600 md:mt-8 md:text-sm">
            {attribution}
          </footer>
        </blockquote>
      </div>
    </div>
  );
}

import { cn } from "@jokuh/gooey";

/**
 * **Purpose:** Line-broken editorial poem with stanza spacing for story and Spine memory panels.
 * **Connects to:** `stories-detail.ts` poem sections, `StoryDetailPage`, `SpineJuly4Memory`.
 */
export function StoryPoemBlock({
  stanzas,
  variant = "editorial",
  className,
}: {
  stanzas: string[][];
  variant?: "editorial" | "spine";
  className?: string;
}) {
  const isSpine = variant === "spine";

  return (
    <div className={cn(isSpine ? "space-y-6" : "space-y-10 md:space-y-12", className)}>
      {stanzas.map((stanza, stanzaIndex) => (
        <p
          key={stanzaIndex}
          className={cn(
            "whitespace-pre-line font-sans font-normal text-light-space/82 light:text-zinc-800",
            isSpine
              ? "text-[13px] leading-[1.75] tracking-[0.01em]"
              : "text-[1.12rem] leading-[1.95] tracking-[0.01em] md:text-[1.22rem] md:leading-[2]",
          )}
        >
          {stanza.join("\n")}
        </p>
      ))}
    </div>
  );
}

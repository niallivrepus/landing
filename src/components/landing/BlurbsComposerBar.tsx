import { GooeyGlass, cn } from "@jokuh/gooey";
import { useCallback, useId, useState, type FormEvent, type KeyboardEvent } from "react";
import { useGentleHoverSound } from "../../hooks/useGentleHoverSound";

/** Parity `blurbs.composer.say_something` — `frontend/src/i18n/en.json`. */
const BLURBS_COMPOSER_PLACEHOLDER = "Say something";

const COMPOSER_WIDTH = 450;
const COMPOSER_MIN_HEIGHT = 42;

type BlurbsComposerBarProps = {
  onSubmit?: (text: string) => void;
  className?: string;
};

/**
 * **Purpose:** Bottom-center Blurbs composer — frosted capsule input (parity `BlurbsPage` composer strip).
 * **Connects to:** `BlurbsImmersiveShell`, `ImmersiveAppChrome.bottomCenter`.
 */
export function BlurbsComposerBar({ onSubmit, className }: BlurbsComposerBarProps) {
  const inputId = useId();
  const [draft, setDraft] = useState("");
  const hoverSoundProps = useGentleHoverSound(true, "gentle");

  const submit = useCallback(() => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSubmit?.(trimmed);
    setDraft("");
  }, [draft, onSubmit]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form
      className={cn("landing-blurbs-composer", className)}
      onSubmit={handleSubmit}
      aria-label="Blurbs composer"
      {...hoverSoundProps}
    >
      <GooeyGlass
        className="landing-blurbs-composer__glass landing-gooey-shell"
        contentClassName="relative z-0 flex w-full items-center"
        filterContent={false}
        lens={{
          width: COMPOSER_WIDTH,
          height: COMPOSER_MIN_HEIGHT,
          borderRadius: 999,
          scale: 14,
          depth: 1.3,
          curvature: 2.55,
          splay: 1,
          chroma: 0.16,
          glow: 0.2,
          edgeHighlight: 0.42,
        }}
        style={{
          width:
            "min(calc(100vw - max(144px, env(safe-area-inset-left, 0px) + env(safe-area-inset-right, 0px) + 144px)), 450px)",
          minHeight: COMPOSER_MIN_HEIGHT,
          borderRadius: 999,
        }}
      >
        <label className="landing-blurbs-composer__field" htmlFor={inputId}>
          <textarea
            id={inputId}
            className="landing-blurbs-composer__input"
            rows={1}
            value={draft}
            placeholder={BLURBS_COMPOSER_PLACEHOLDER}
            onChange={(event) => setDraft(event.target.value.slice(0, 4000))}
            onKeyDown={handleKeyDown}
            aria-label={BLURBS_COMPOSER_PLACEHOLDER}
          />
        </label>
      </GooeyGlass>
    </form>
  );
}

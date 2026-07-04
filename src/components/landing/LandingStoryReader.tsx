import { Button } from "@jokuh/gooey";
import type { StoryDetail } from "../../data/stories-detail";
import { HOME_STORIES } from "../../data/home-stories";

/**
 * **Purpose:** Inline story reader inside the Texts immersive shell.
 * **Connects to:** `stories-detail.ts`, `MessagesImmersiveShell`.
 */
export function LandingStoryReader({
  story,
  onBack,
  onReadFull,
}: {
  story: StoryDetail;
  onBack: () => void;
  onReadFull: () => void;
}) {
  const tile = HOME_STORIES.find((entry) => entry.slug === story.slug);
  const heroImage = tile?.image ?? story.heroGallery[0]?.src;
  const proseSection = story.sections.find((section) => section.kind === "prose");
  const excerpt =
    proseSection && proseSection.kind === "prose"
      ? proseSection.paragraphs[0]
      : story.dek;

  return (
    <article className="landing-story-reader">
      <button type="button" onClick={onBack} className="landing-story-reader__back">
        ← Inbox
      </button>

      {heroImage ? (
        <div className="landing-story-reader__hero">
          <img src={heroImage} alt="" className="landing-story-reader__hero-image" />
        </div>
      ) : null}

      <p className="landing-story-reader__meta">{story.metaLine}</p>
      <h2 className="landing-story-reader__title">{story.title}</h2>
      <p className="landing-story-reader__dek">{story.dek}</p>
      <p className="landing-story-reader__excerpt">{excerpt}</p>

      <Button variant="secondary-neutral" size="lg" className="mt-4 w-full" onClick={onReadFull}>
        Read full story in Jokuh
      </Button>
    </article>
  );
}

import { cn } from "@jokuh/gooey";
import { CookieBanner } from "../components/CookieBanner";
import { MegaFooter } from "../components/MegaFooter";
import { EndorsementSeal } from "../components/EndorsementSeal";
import { SiteTopBar } from "../components/SiteTopBar";
import { TopNavAnchor } from "../components/TopNavAnchor";
import { HOME_STORIES } from "../data/home-stories";
import {
  getStoryDetail,
  type StoryDetail,
  type StoryImageCaptioned,
  type StorySection,
} from "../data/stories-detail";
import { Navigate, useParams } from "react-router-dom";

const shell = "mx-auto w-full max-w-[1380px] px-5 md:px-8";

const articleColumn = "mx-auto w-full max-w-[min(100%,36rem)]";

function StoryHero({ story }: { story: StoryDetail }) {
  return (
    <header className={`${shell} pt-28 pb-12 text-center md:pt-32 md:pb-16`}>
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-white/45 md:text-xs">
        {story.metaLine}
      </p>
      <h1 className="mx-auto mt-6 max-w-[min(100%,20ch)] font-sans text-[2.25rem] font-medium leading-[1.08] tracking-[-0.03em] text-white sm:max-w-[min(100%,24ch)] sm:text-5xl md:text-6xl lg:text-[3.5rem] lg:leading-[1.05]">
        {story.title}
      </h1>
      <p
        className={`${articleColumn} mt-8 font-sans text-lg font-normal leading-[1.55] tracking-tight text-white/72 md:mt-10 md:text-xl md:leading-[1.5]`}
      >
        {story.dek}
      </p>
    </header>
  );
}

function StoryGallery({ images }: { images: StoryDetail["heroGallery"] }) {
  return (
    <div className={`${shell} pb-16 md:pb-20`}>
      <div className="flex gap-3 md:gap-4 lg:gap-5">
        {images.map((img) => (
          <div
            key={img.src}
            className="relative min-w-0 flex-1 overflow-hidden rounded-xl"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="aspect-[4/3] w-full object-cover md:aspect-[5/4]"
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProseBlock({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className={`${shell} py-10 md:py-14`}>
      <div className={`${articleColumn} space-y-6`}>
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="font-sans text-[1.0625rem] font-normal leading-[1.75] tracking-[-0.01em] text-white/78 md:text-lg md:leading-[1.72]"
          >
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}

function SubheadBlock({ text }: { text: string }) {
  return (
    <div className={`${shell} pt-4 pb-2 md:pt-8 md:pb-4`}>
      <h2
        className={`${articleColumn} font-sans text-2xl font-medium leading-snug tracking-[-0.02em] text-white md:text-[1.75rem]`}
      >
        {text}
      </h2>
    </div>
  );
}

function AsymmetricImagesBlock({ large, small }: { large: StoryImageCaptioned; small: StoryImageCaptioned }) {
  return (
    <div className={`${shell} py-12 md:py-16`}>
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-6 xl:gap-8">
        <div className="lg:col-span-8">
          <div className="overflow-hidden rounded-xl">
            <img
              src={large.src}
              alt={large.alt}
              className="aspect-[16/10] w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <p className="mt-3 font-sans text-sm leading-snug text-white/55">{large.caption}</p>
        </div>
        <div className="lg:col-span-4">
          <div className="overflow-hidden rounded-xl">
            <img
              src={small.src}
              alt={small.alt}
              className="aspect-square w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <p className="mt-3 font-sans text-sm leading-snug text-white/55">{small.caption}</p>
        </div>
      </div>
    </div>
  );
}

function QuoteBlock({ text, attribution }: { text: string; attribution: string }) {
  return (
    <div className={`${shell} py-16 md:py-24`}>
      <blockquote className="mx-auto max-w-[min(100%,40rem)] text-center">
        <p className="font-sans text-2xl font-medium leading-[1.35] tracking-[-0.02em] text-white md:text-3xl md:leading-[1.3] lg:text-[2.125rem]">
          “{text}”
        </p>
        <footer className="mt-8 font-sans text-sm font-normal text-white/50 md:text-base">
          {attribution}
        </footer>
      </blockquote>
    </div>
  );
}

function CtaBlock({
  title,
  body,
  buttonLabel,
  buttonHref,
}: {
  title: string;
  body: string;
  buttonLabel: string;
  buttonHref: string;
}) {
  return (
    <div className={`${shell} py-12 md:py-16`}>
      <div className="flex flex-col items-center justify-center rounded-2xl bg-[#1a1a1a] px-6 py-16 text-center md:px-12 md:py-20">
        <h2 className="max-w-xl font-sans text-2xl font-medium tracking-tight text-white md:text-3xl">
          {title}
        </h2>
        <p className="mx-auto mt-5 max-w-lg font-sans text-[15px] leading-relaxed text-white/72 md:text-base md:leading-relaxed">
          {body}
        </p>
        <a
          href={buttonHref}
          className={cn(
            "mt-9 inline-flex h-12 min-w-[10rem] items-center justify-center rounded-full bg-white px-8",
            "font-sans text-sm font-medium text-black transition-[transform,background-color] hover:bg-zinc-100 active:scale-[0.98]",
          )}
        >
          {buttonLabel}
        </a>
      </div>
    </div>
  );
}

function MoreStories({ currentSlug }: { currentSlug: string }) {
  const others = HOME_STORIES.filter((s) => s.slug !== currentSlug);
  if (others.length === 0) return null;

  return (
    <section className="border-t border-white/10 bg-black px-5 py-16 md:px-8 md:py-20" aria-labelledby="more-stories-heading">
      <div className="mx-auto max-w-[1380px]">
        <h2 id="more-stories-heading" className="font-sans text-lg font-normal tracking-tight text-white md:text-xl">
          More stories
        </h2>
        <div
          className={cn(
            "mt-10 grid grid-cols-1 gap-12 sm:mt-12 sm:gap-8 md:gap-10 lg:gap-12",
            others.length >= 3 ? "sm:grid-cols-2 md:grid-cols-3" : "sm:grid-cols-2",
          )}
        >
          {others.map((story) => (
            <TopNavAnchor key={story.slug} href={story.href} className="group flex min-w-0 flex-col">
              <div
                className={cn(
                  "relative aspect-square w-full shrink-0 overflow-hidden rounded-[4px] bg-zinc-900",
                  "ring-1 ring-white/[0.08] transition-[box-shadow,ring-color] duration-300",
                  "group-hover:ring-white/[0.14] group-hover:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.55)]",
                )}
              >
                <img
                  src={story.image}
                  alt=""
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p className="mt-3 text-left font-sans text-[0.9375rem] font-medium leading-snug tracking-tight text-white md:text-base">
                {story.title}
              </p>
              <p className="mt-1 text-left font-sans text-sm text-white/45">Jokuh Stories</p>
            </TopNavAnchor>
          ))}
        </div>
      </div>
    </section>
  );
}

function renderSection(section: StorySection, key: number) {
  switch (section.kind) {
    case "prose":
      return <ProseBlock key={key} paragraphs={section.paragraphs} />;
    case "subhead":
      return <SubheadBlock key={key} text={section.text} />;
    case "imagesAsymmetric":
      return <AsymmetricImagesBlock key={key} large={section.large} small={section.small} />;
    case "quote":
      return <QuoteBlock key={key} text={section.text} attribution={section.attribution} />;
    case "cta":
      return (
        <CtaBlock
          key={key}
          title={section.title}
          body={section.body}
          buttonLabel={section.buttonLabel}
          buttonHref={section.buttonHref}
        />
      );
    default:
      return null;
  }
}

export function StoryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const story = getStoryDetail(slug);

  if (!story) {
    return <Navigate to="/journal" replace />;
  }

  return (
    <div className="landing-cinema min-h-screen bg-black text-light-space">
      <SiteTopBar />
      <main>
        <StoryHero story={story} />
        <StoryGallery images={story.heroGallery} />
        {story.sections.map((s, i) => renderSection(s, i))}
        <EndorsementSeal />
        <MoreStories currentSlug={story.slug} />
      </main>
      <MegaFooter />
      <CookieBanner />
    </div>
  );
}

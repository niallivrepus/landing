import { cn } from "@jokuh/gooey";
import { CookieBanner } from "../components/CookieBanner";
import { EDITORIAL_MEDIA_RADIUS_CLASS, MarketingPageFrame } from "../components/system";
import { CONTENT_SHELL_WIDE } from "../components/system/shells";
import { TopNavAnchor } from "../components/TopNavAnchor";
import { HOME_STORIES } from "../data/home-stories";
import {
  getStoryDetail,
  type StoryDetail,
  type StoryImageCaptioned,
  type StorySection,
} from "../data/stories-detail";
import { ArrowLeft } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const articleColumn = "mx-auto w-full max-w-[min(100%,40rem)]";

function StoryNavigator({ currentSlug }: { currentSlug: string }) {
  return (
    <div className={`${CONTENT_SHELL_WIDE} pb-10 md:pb-14`}>
      <div className="border-y border-light-space/[0.08] py-4">
        <div className="flex flex-wrap gap-x-5 gap-y-2 md:gap-x-6">
          {HOME_STORIES.map((story) => {
            const detail = getStoryDetail(story.slug);
            const active = story.slug === currentSlug;

            return (
              <TopNavAnchor
                key={story.slug}
                href={story.href}
                className={cn(
                  "font-sans text-[13px] leading-snug tracking-tight transition-colors md:text-[0.9375rem]",
                  active ? "text-light-space" : "text-light-space/42 hover:text-light-space/72",
                )}
              >
                {detail?.title ?? story.title}
              </TopNavAnchor>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StoryHero({ story }: { story: StoryDetail }) {
  return (
    <header className={`${CONTENT_SHELL_WIDE} pt-28 pb-8 md:pt-32 md:pb-10`}>
      <div className={articleColumn}>
        <Link
          to="/stories"
          className="inline-flex items-center gap-2 font-sans text-sm text-light-space/48 transition-colors hover:text-light-space/75"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Stories
        </Link>
        <p className="mt-8 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-light-space/42 md:text-xs">
          {story.metaLine}
        </p>
        <h1 className="mt-5 max-w-[20ch] font-sans text-[2.3rem] font-semibold leading-[1.06] tracking-[-0.035em] text-light-space sm:text-5xl md:text-6xl lg:text-[4rem] lg:leading-[1.02]">
          {story.title}
        </h1>
        <p className="news-detail-reading mt-7 max-w-[34rem] text-[1.22rem] font-normal leading-[1.56] text-light-space/72 md:mt-8 md:text-[1.34rem] md:leading-[1.54]">
          {story.dek}
        </p>
      </div>
    </header>
  );
}

function StoryGallery({ images }: { images: StoryDetail["heroGallery"] }) {
  const [lead, ...supporting] = images;
  if (!lead) return null;

  return (
    <div className={`${CONTENT_SHELL_WIDE} pb-16 md:pb-20`}>
      <div className="space-y-4 md:space-y-5">
        <div className={cn("overflow-hidden", EDITORIAL_MEDIA_RADIUS_CLASS)}>
          <img
            src={lead.src}
            alt={lead.alt}
            className="aspect-[16/9] w-full object-cover md:aspect-[16/8.5]"
            loading="lazy"
            decoding="async"
          />
        </div>
        {supporting.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            {supporting.map((img) => (
              <div key={img.src} className={cn("overflow-hidden", EDITORIAL_MEDIA_RADIUS_CLASS)}>
                <img
                  src={img.src}
                  alt={img.alt}
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ProseBlock({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className={`${CONTENT_SHELL_WIDE} py-8 md:py-10`}>
      <div className={`${articleColumn} space-y-6 md:space-y-7`}>
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="news-detail-reading text-[1.1rem] font-normal leading-[1.8] tracking-[0.002em] text-light-space/82 md:text-[1.18rem] md:leading-[1.82]"
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
    <div className={`${CONTENT_SHELL_WIDE} pt-8 pb-1 md:pt-10 md:pb-2`}>
      <h2 className={`${articleColumn} font-sans text-[1.55rem] font-semibold leading-[1.18] tracking-[-0.025em] text-light-space md:text-[1.9rem]`}>
        {text}
      </h2>
    </div>
  );
}

function AsymmetricImagesBlock({ large, small }: { large: StoryImageCaptioned; small: StoryImageCaptioned }) {
  return (
    <div className={`${CONTENT_SHELL_WIDE} py-14 md:py-20`}>
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-6 xl:gap-8">
        <div className="lg:col-span-8">
          <div className={cn("overflow-hidden", EDITORIAL_MEDIA_RADIUS_CLASS)}>
            <img
              src={large.src}
              alt={large.alt}
              className="aspect-[16/10] w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <p className="mt-3 max-w-[42rem] font-sans text-[13px] leading-snug text-light-space/48 md:text-sm">
            {large.caption}
          </p>
        </div>
        <div className="lg:col-span-4">
          <div className={cn("overflow-hidden", EDITORIAL_MEDIA_RADIUS_CLASS)}>
            <img
              src={small.src}
              alt={small.alt}
              className="aspect-square w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <p className="mt-3 font-sans text-[13px] leading-snug text-light-space/48 md:text-sm">
            {small.caption}
          </p>
        </div>
      </div>
    </div>
  );
}

function QuoteBlock({ text, attribution }: { text: string; attribution: string }) {
  return (
    <div className={`${CONTENT_SHELL_WIDE} py-14 md:py-20`}>
      <blockquote className={`${articleColumn} border-t border-light-space/[0.1] pt-8 md:pt-10`}>
        <p className="news-detail-reading text-[1.55rem] font-normal leading-[1.5] tracking-[0.002em] text-light-space md:text-[1.9rem] md:leading-[1.48]">
          “{text}”
        </p>
        <footer className="mt-6 font-sans text-[13px] font-medium uppercase tracking-[0.08em] text-light-space/46 md:text-sm">
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
    <div className={`${CONTENT_SHELL_WIDE} py-14 md:py-20`}>
      <div className={`${articleColumn} border-t border-light-space/[0.1] pt-8 md:pt-10`}>
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-light-space/38">
          Further reading
        </p>
        <h2 className="mt-4 max-w-[28rem] font-sans text-[1.55rem] font-semibold leading-[1.16] tracking-[-0.025em] text-light-space md:text-[1.9rem]">
          {title}
        </h2>
        <p className="news-detail-reading mt-5 max-w-[34rem] text-[1.06rem] leading-[1.76] text-light-space/74 md:text-[1.12rem]">
          {body}
        </p>
        <a
          href={buttonHref}
          className={cn(
            "mt-6 inline-flex items-center gap-2 font-sans text-[13px] font-medium uppercase tracking-[0.08em] text-light-space/56 transition-colors hover:text-light-space",
          )}
        >
          {buttonLabel}
          <span aria-hidden>→</span>
        </a>
      </div>
    </div>
  );
}

function MoreStories({ currentSlug }: { currentSlug: string }) {
  const others = HOME_STORIES.filter((s) => s.slug !== currentSlug);
  if (others.length === 0) return null;

  return (
    <section className="border-t border-light-space/10 bg-dark-space px-4 py-16 md:px-8 md:py-20" aria-labelledby="more-stories-heading">
      <div className={CONTENT_SHELL_WIDE}>
        <div className={articleColumn}>
          <h2 id="more-stories-heading" className="font-sans text-[1.35rem] font-semibold tracking-[-0.02em] text-light-space md:text-[1.55rem]">
            More stories
          </h2>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-7 md:mt-10 md:grid-cols-3">
          {others.slice(0, 3).map((story) => {
            const detail = getStoryDetail(story.slug);
            return (
              <TopNavAnchor key={story.slug} href={story.href} className="group flex min-w-0 gap-4 border-t border-light-space/[0.08] pt-5">
                <div className={cn("size-20 shrink-0 overflow-hidden bg-smoke-2 md:size-24", EDITORIAL_MEDIA_RADIUS_CLASS)}>
                  <img src={story.image} alt="" className="size-full object-cover" loading="lazy" decoding="async" />
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-light-space/36">
                    {detail?.metaLine ?? "Jokuh Stories"}
                  </p>
                  <p className="mt-2 font-sans text-[0.98rem] font-medium leading-snug tracking-tight text-light-space transition-colors group-hover:text-light-space/80 md:text-[1.02rem]">
                    {detail?.title ?? story.title}
                  </p>
                </div>
              </TopNavAnchor>
            );
          })}
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
    return <Navigate to="/stories" replace />;
  }

  useDocumentTitle(`${story.title} — Jokuh`);

  return (
    <MarketingPageFrame afterMain={<CookieBanner />}>
      <>
        <StoryHero story={story} />
        <StoryNavigator currentSlug={story.slug} />
        <StoryGallery images={story.heroGallery} />
        {story.sections.map((s, i) => renderSection(s, i))}
        <MoreStories currentSlug={story.slug} />
      </>
    </MarketingPageFrame>
  );
}

import { cn } from "@jokuh/gooey";
import { CookieBanner } from "../components/CookieBanner";
import { EndorsementSeal } from "../components/EndorsementSeal";
import {
  EditorialArticleHeadingSection,
  EditorialArticleProseSection,
  EditorialArticleShellSection,
  EditorialArticleTemplate,
} from "../components/system";
import { CONTENT_READING_MEASURE, CONTENT_SHELL_WIDE } from "../components/system/shells";
import { RichParagraph } from "../components/news-detail/RichParagraph";
import { estimateSpeechDurationLabel, getNewsDetail } from "../data/news-detail";
import { lazy, Suspense } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const NewsFeatureDetailSection = lazy(async () => {
  const mod = await import("../components/news-detail/NewsFeatureDetailSection");
  return { default: mod.NewsFeatureDetailSection };
});

function FeatureDetailFallback() {
  return (
    <div className={CONTENT_SHELL_WIDE}>
      <div className={cn(CONTENT_READING_MEASURE, "space-y-10 py-12 md:space-y-12 md:py-16")}>
        <div className="space-y-4 border-y border-light-space/[0.1] py-5">
          <div className="h-10 w-full max-w-[540px] rounded-full bg-white/6" />
          <div className="h-4 w-40 rounded-full bg-white/5" />
        </div>
        <div className="space-y-4">
          <div className="h-4 w-full rounded-full bg-white/5" />
          <div className="h-4 w-[92%] rounded-full bg-white/5" />
          <div className="h-4 w-[78%] rounded-full bg-white/5" />
        </div>
        <div className="h-[260px] rounded-xl border border-light-space/[0.08] bg-white/[0.04] md:h-[320px]" />
        <div className="space-y-4">
          <div className="h-4 w-full rounded-full bg-white/5" />
          <div className="h-4 w-[88%] rounded-full bg-white/5" />
          <div className="h-4 w-[72%] rounded-full bg-white/5" />
        </div>
        <div className="space-y-4">
          <div className="h-[220px] rounded-[28px] border border-light-space/[0.08] bg-white/[0.04]" />
          <div className="h-[220px] rounded-[28px] border border-light-space/[0.08] bg-white/[0.04]" />
        </div>
      </div>
    </div>
  );
}

export function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const doc = getNewsDetail(slug);

  if (!doc) {
    return <Navigate to="/newsroom" replace />;
  }

  useDocumentTitle(`${doc.title} — Jokuh`);

  if (doc.kind === "brief") {
    return (
      <EditorialArticleTemplate
        metaLine={doc.metaLine}
        title={doc.title}
        subtitle={doc.subtitle}
        afterMain={<CookieBanner />}
      >
        <EditorialArticleProseSection className="py-10 md:py-14">
          {doc.introParagraphs.map((p) => (
            <RichParagraph
              key={p.slice(0, 40)}
              className="news-detail-reading text-[1.0625rem] leading-[1.72] text-light-space/82 md:text-lg md:leading-[1.68]"
            >
              {p}
            </RichParagraph>
          ))}
        </EditorialArticleProseSection>

        <EditorialArticleHeadingSection>{doc.bodyTitle}</EditorialArticleHeadingSection>

        <EditorialArticleProseSection className="pt-0 pb-14 md:pb-20">
          {doc.bodyParagraphs.map((p) => (
            <RichParagraph
              key={p.slice(0, 40)}
              className="news-detail-reading text-[1.0625rem] leading-[1.72] text-light-space/82 md:text-lg md:leading-[1.68]"
            >
              {p}
            </RichParagraph>
          ))}
        </EditorialArticleProseSection>

        <EditorialArticleShellSection>
          <EndorsementSeal className="pb-4 md:pb-6" />
        </EditorialArticleShellSection>
      </EditorialArticleTemplate>
    );
  }

  const durationLabel = estimateSpeechDurationLabel(doc.speechText);

  return (
    <EditorialArticleTemplate
      metaLine={doc.metaLine}
      title={doc.title}
      subtitle={doc.subtitle}
      afterMain={<CookieBanner />}
    >
      <Suspense fallback={<FeatureDetailFallback />}>
        <NewsFeatureDetailSection doc={doc} durationLabel={durationLabel} />
      </Suspense>
    </EditorialArticleTemplate>
  );
}

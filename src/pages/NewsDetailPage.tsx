import { cn } from "@jokuh/gooey";
import {
  EditorialArticleHeadingSection,
  EditorialArticleMeasure,
  EditorialArticleProseSection,
  EditorialArticleTemplate,
} from "../components/system";
import { CONTENT_READING_MEASURE, CONTENT_SHELL_WIDE } from "../components/system/shells";
import { ArticleListenBar } from "../components/news-detail/ArticleListenBar";
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
        <div className="space-y-4 py-5">
          <div className="h-10 w-full max-w-[540px] rounded-full bg-white/6 light:bg-black/[0.06]" />
          <div className="h-4 w-40 rounded-full bg-white/5 light:bg-black/[0.05]" />
        </div>
        <div className="space-y-4">
          <div className="h-4 w-full rounded-full bg-white/5 light:bg-black/[0.05]" />
          <div className="h-4 w-[92%] rounded-full bg-white/5 light:bg-black/[0.05]" />
          <div className="h-4 w-[78%] rounded-full bg-white/5 light:bg-black/[0.05]" />
        </div>
        <div className="h-[260px] rounded-xl border border-light-space/[0.08] bg-white/[0.04] light:border-black/[0.08] light:bg-section-grey-light md:h-[320px]" />
        <div className="space-y-4">
          <div className="h-4 w-full rounded-full bg-white/5 light:bg-black/[0.05]" />
          <div className="h-4 w-[88%] rounded-full bg-white/5 light:bg-black/[0.05]" />
          <div className="h-4 w-[72%] rounded-full bg-white/5 light:bg-black/[0.05]" />
        </div>
        <div className="space-y-4">
          <div className="h-[220px] rounded-[28px] border border-light-space/[0.08] bg-white/[0.04] light:border-black/[0.08] light:bg-section-grey-light" />
          <div className="h-[220px] rounded-[28px] border border-light-space/[0.08] bg-white/[0.04] light:border-black/[0.08] light:bg-section-grey-light" />
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

  useDocumentTitle(`${doc.title} Jokuh`);

  if (doc.kind === "brief") {
    const speechText = [
      doc.title,
      doc.subtitle,
      ...doc.introParagraphs,
      doc.bodyTitle,
      ...doc.bodyParagraphs,
    ].join(" ");
    const durationLabel = estimateSpeechDurationLabel(speechText);

    return (
      <EditorialArticleTemplate
        metaLine={doc.metaLine}
        title={doc.title}
        subtitle={doc.subtitle}
      >
        <EditorialArticleMeasure>
          <ArticleListenBar speechText={speechText} durationLabel={durationLabel} shareTitle={doc.title} />
        </EditorialArticleMeasure>

        <EditorialArticleProseSection className="py-10 md:py-14">
          {doc.introParagraphs.map((p) => (
            <RichParagraph
              key={p.slice(0, 40)}
              className="news-detail-reading text-[1.0625rem] leading-[1.72] text-light-space/82 light:text-zinc-700 md:text-lg md:leading-[1.68]"
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
              className="news-detail-reading text-[1.0625rem] leading-[1.72] text-light-space/82 light:text-zinc-700 md:text-lg md:leading-[1.68]"
            >
              {p}
            </RichParagraph>
          ))}
        </EditorialArticleProseSection>
      </EditorialArticleTemplate>
    );
  }

  const durationLabel = estimateSpeechDurationLabel(doc.speechText);

  return (
    <EditorialArticleTemplate
      metaLine={doc.metaLine}
      title={doc.title}
      subtitle={doc.subtitle}
    >
      <Suspense fallback={<FeatureDetailFallback />}>
        <NewsFeatureDetailSection doc={doc} durationLabel={durationLabel} />
      </Suspense>
    </EditorialArticleTemplate>
  );
}

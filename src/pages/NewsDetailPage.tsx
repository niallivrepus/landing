import { cn } from "@jokuh/gooey";
import { CookieBanner } from "../components/CookieBanner";
import { MegaFooter } from "../components/MegaFooter";
import { EndorsementSeal } from "../components/EndorsementSeal";
import { SiteTopBar } from "../components/SiteTopBar";
import { ArticleListenBar } from "../components/news-detail/ArticleListenBar";
import { BenchmarkTable } from "../components/news-detail/BenchmarkTable";
import {
  GdpvalStackedChart,
  OsworldLineChart,
  SweBenchLineChart,
} from "../components/news-detail/NewsBenchmarkCharts";
import { RichParagraph } from "../components/news-detail/RichParagraph";
import { TestimonialPanels } from "../components/news-detail/TestimonialPanels";
import { estimateSpeechDurationLabel, getNewsDetail } from "../data/news-detail";
import { ArrowLeft } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";

const shell = "mx-auto w-full max-w-[1380px] px-5 md:px-8";

/** ~720px reading measure for letter-style articles */
const read = "mx-auto w-full max-w-[min(100%,720px)]";

export function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const doc = getNewsDetail(slug);

  if (!doc) {
    return <Navigate to="/journal" replace />;
  }

  const durationLabel = estimateSpeechDurationLabel(doc.speechText);

  return (
    <div className="landing-cinema min-h-screen bg-black text-light-space">
      <SiteTopBar />
      <main className="pb-16 md:pb-24">
        <div className={cn(shell, "pt-28 pb-6 md:pt-32")}>
          <Link
            to="/journal"
            className="inline-flex items-center gap-2 font-sans text-sm text-white/55 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" aria-hidden />
            News
          </Link>
        </div>

        <header className={cn(shell, "pb-10 text-center md:pb-14")}>
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-white/45 md:text-xs">
            {doc.metaLine}
          </p>
          <div className={cn(read, "text-center")}>
            <h1 className="mt-5 font-sans text-[2.1rem] font-medium leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl md:text-6xl">
              {doc.title}
            </h1>
            <p className="news-detail-reading mt-6 text-[1.0625rem] font-normal leading-[1.65] text-white/72 md:mt-8 md:text-[1.125rem] md:leading-[1.62]">
              {doc.subtitle}
            </p>
          </div>
        </header>

        <div className={shell}>
          <div className={read}>
            <ArticleListenBar speechText={doc.speechText} durationLabel={durationLabel} shareTitle={doc.title} />
          </div>
        </div>

        <div className={shell}>
          <div className={cn(read, "space-y-6 py-12 md:space-y-8 md:py-16")}>
            {doc.introParagraphs.map((p) => (
              <RichParagraph
                key={p.slice(0, 40)}
                className="news-detail-reading text-[1.0625rem] leading-[1.72] text-white/82 md:text-lg md:leading-[1.68]"
              >
                {p}
              </RichParagraph>
            ))}
          </div>
        </div>

        <div className={cn(shell, "pb-16 md:pb-20")}>
          <div className={read}>
            <BenchmarkTable
              columns={doc.benchmarkTable.columns}
              rows={doc.benchmarkTable.rows}
              footnote={doc.benchmarkTable.footnote}
            />
          </div>
        </div>

        <div className={cn(shell, "pb-6")}>
          <h2 className={cn(read, "text-left font-sans text-3xl font-medium tracking-tight text-white md:text-4xl")}>
            {doc.knowledgeWork.title}
          </h2>
        </div>

        <div className={shell}>
          <div className={cn(read, "space-y-6 pb-14 md:space-y-8 md:pb-20")}>
            {doc.knowledgeWork.paragraphs.map((p) => (
              <RichParagraph
                key={p.slice(0, 40)}
                className="news-detail-reading text-[1.0625rem] leading-[1.72] text-white/82 md:text-lg md:leading-[1.68]"
              >
                {p}
              </RichParagraph>
            ))}
          </div>
        </div>

        <div className={shell}>
          <div className={cn(read, "space-y-16 md:space-y-20")}>
            <GdpvalStackedChart footnote={doc.chartFootnotes.gdpval} />
            <SweBenchLineChart footnote={doc.chartFootnotes.swe} />
            <OsworldLineChart footnote={doc.chartFootnotes.osworld} />
          </div>
        </div>

        <div className={shell}>
          <EndorsementSeal articleMeasure className="pb-4 md:pb-6" />
        </div>

        <div className={shell}>
          <div className={cn(read, "py-20 md:py-28")}>
            <TestimonialPanels entries={doc.testimonials} />
          </div>
        </div>
      </main>
      <MegaFooter />
      <CookieBanner />
    </div>
  );
}

import type { NewsFeatureDetailDocument } from "../../data/news-detail";
import {
  EditorialArticleHeadingSection,
  EditorialArticleMeasure,
  EditorialArticleProseSection,
  EditorialArticleShellSection,
} from "../system";
import { ArticleListenBar } from "./ArticleListenBar";
import { BenchmarkTable } from "./BenchmarkTable";
import {
  GdpvalStackedChart,
  OsworldLineChart,
  SweBenchLineChart,
} from "./NewsBenchmarkCharts";
import { EndorsementSeal } from "../EndorsementSeal";
import { RichParagraph } from "./RichParagraph";
import { TestimonialPanels } from "./TestimonialPanels";

type Props = {
  doc: NewsFeatureDetailDocument;
  durationLabel: string;
};

export function NewsFeatureDetailSection({ doc, durationLabel }: Props) {
  return (
    <>
      <EditorialArticleMeasure>
        <ArticleListenBar speechText={doc.speechText} durationLabel={durationLabel} shareTitle={doc.title} />
      </EditorialArticleMeasure>

      <EditorialArticleProseSection>
        {doc.introParagraphs.map((p) => (
          <RichParagraph
            key={p.slice(0, 40)}
            className="news-detail-reading text-[1.0625rem] leading-[1.72] text-light-space/82 light:text-zinc-700 md:text-lg md:leading-[1.68]"
          >
            {p}
          </RichParagraph>
        ))}
      </EditorialArticleProseSection>

      <EditorialArticleMeasure className="pb-16 md:pb-20">
        <BenchmarkTable
          columns={doc.benchmarkTable.columns}
          rows={doc.benchmarkTable.rows}
          footnote={doc.benchmarkTable.footnote}
        />
      </EditorialArticleMeasure>

      <EditorialArticleHeadingSection>{doc.knowledgeWork.title}</EditorialArticleHeadingSection>

      <EditorialArticleProseSection className="pt-0 pb-14 md:pb-20">
        {doc.knowledgeWork.paragraphs.map((p) => (
          <RichParagraph
            key={p.slice(0, 40)}
            className="news-detail-reading text-[1.0625rem] leading-[1.72] text-light-space/82 light:text-zinc-700 md:text-lg md:leading-[1.68]"
          >
            {p}
          </RichParagraph>
        ))}
      </EditorialArticleProseSection>

      <EditorialArticleMeasure className="space-y-16 md:space-y-20">
        <GdpvalStackedChart footnote={doc.chartFootnotes.gdpval} />
        <SweBenchLineChart footnote={doc.chartFootnotes.swe} />
        <OsworldLineChart footnote={doc.chartFootnotes.osworld} />
      </EditorialArticleMeasure>

      <EditorialArticleShellSection>
        <EndorsementSeal className="pb-4 md:pb-6" />
      </EditorialArticleShellSection>

      <EditorialArticleMeasure className="py-20 md:py-28">
        <TestimonialPanels entries={doc.testimonials} />
      </EditorialArticleMeasure>
    </>
  );
}

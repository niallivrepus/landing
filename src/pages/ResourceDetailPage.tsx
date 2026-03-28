import { CookieBanner } from "../components/CookieBanner";
import {
  EditorialArticleHeadingSection,
  EditorialArticleProseSection,
  EditorialArticleShellSection,
  EditorialArticleTemplate,
} from "../components/system";
import { SiteLink } from "../components/SiteLink";
import { getResourceDetailPage, type ResourcePageId } from "../data/resource-detail-pages";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { Navigate } from "react-router-dom";

function ResourceHighlights({ highlights }: { highlights: string[] }) {
  return (
    <EditorialArticleShellSection className="pb-2 md:pb-4">
      <div className="grid gap-3 md:grid-cols-3 md:gap-4">
        {highlights.map((highlight) => (
          <div
            key={highlight}
            className="rounded-[24px] border border-light-space/[0.08] bg-white/[0.03] px-5 py-5 font-sans text-[0.95rem] leading-[1.55] text-light-space/72 light:border-black/[0.08] light:bg-zinc-100 light:text-zinc-700"
          >
            {highlight}
          </div>
        ))}
      </div>
    </EditorialArticleShellSection>
  );
}

function ResourceCta({
  title,
  body,
  label,
  href,
}: {
  title: string;
  body: string;
  label: string;
  href: string;
}) {
  return (
    <EditorialArticleShellSection className="pb-14 md:pb-20">
      <div className="rounded-[32px] border border-light-space/[0.08] bg-white/[0.03] px-6 py-7 md:px-8 md:py-8 light:border-black/[0.08] light:bg-zinc-100">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-light-space/42 light:text-zinc-500">
          Further reading
        </p>
        <h2 className="mt-4 max-w-[28rem] font-sans text-[1.45rem] font-semibold leading-[1.14] tracking-[-0.03em] text-light-space light:text-zinc-950 md:text-[1.8rem]">
          {title}
        </h2>
        <p className="news-detail-reading mt-4 max-w-[38rem] text-[1rem] leading-[1.72] text-light-space/72 light:text-zinc-700 md:text-[1.05rem]">
          {body}
        </p>
        <SiteLink
          href={href}
          className="mt-6 inline-flex items-center gap-2 font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-light-space/62 transition-colors hover:text-light-space light:text-zinc-700 light:hover:text-zinc-950"
        >
          {label}
        </SiteLink>
      </div>
    </EditorialArticleShellSection>
  );
}

export function ResourceDetailPage({ resourceId }: { resourceId: ResourcePageId }) {
  const doc = getResourceDetailPage(resourceId);

  if (!doc) {
    return <Navigate to="/" replace />;
  }

  useDocumentTitle(`${doc.title} — Jokuh`);

  return (
    <EditorialArticleTemplate
      metaLine={doc.metaLine}
      title={doc.title}
      subtitle={doc.subtitle}
      afterMain={<CookieBanner />}
    >
      <EditorialArticleProseSection className="py-10 md:py-14">
        <p className="news-detail-reading text-[1.0625rem] leading-[1.72] text-light-space/82 light:text-zinc-700 md:text-lg md:leading-[1.68]">
          {doc.subtitle}
        </p>
      </EditorialArticleProseSection>

      <ResourceHighlights highlights={doc.highlights} />

      {doc.sections.map((section, index) => (
        <div key={section.heading}>
          <EditorialArticleHeadingSection className={index === 0 ? "pt-10 md:pt-14" : "pt-12 md:pt-16"}>
            {section.heading}
          </EditorialArticleHeadingSection>
          <EditorialArticleProseSection className="pt-0 pb-0 md:pb-0">
            {section.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="news-detail-reading text-[1.0625rem] leading-[1.72] text-light-space/82 light:text-zinc-700 md:text-lg md:leading-[1.68]"
              >
                {paragraph}
              </p>
            ))}
          </EditorialArticleProseSection>
        </div>
      ))}

      <ResourceCta {...doc.cta} />
    </EditorialArticleTemplate>
  );
}

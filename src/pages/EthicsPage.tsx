import { CookieBanner } from "../components/CookieBanner";
import { EndorsementSeal } from "../components/EndorsementSeal";
import { RichParagraph } from "../components/news-detail/RichParagraph";
import { SiteLink } from "../components/SiteLink";
import {
  EditorialArticleHeadingSection,
  EditorialArticleProseSection,
  EditorialArticleShellSection,
  EditorialArticleTemplate,
} from "../components/system";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const INTRO_PARAGRAPHS = [
  "Jokuh is built for work where **credibility matters**: regulated launches, sensitive internal operations, technical diligence, and decision support that can affect real people. That means ethics and compliance are not marketing layers added after the product feels impressive. They are operating constraints inside the product, the review workflow, and the way we ship.",
  "Our standard is straightforward: **high-agency systems need high-clarity boundaries**. We design for traceability, escalation, least-privilege access, human accountability, and explicit disclosure when confidence is limited or source evidence is incomplete.",
];

const SECTIONS = [
  {
    title: "What we optimize for",
    paragraphs: [
      "We optimize for outputs that are useful **and reviewable**. Fast answers are not enough if a client cannot understand where a claim came from, what assumptions shaped it, or when the system should have stopped and asked for a human decision.",
      "In practice, that means we prefer constrained autonomy over theatrical autonomy. We would rather have a workflow escalate early than improvise through ambiguity in legal, clinical, financial, identity, or security-sensitive contexts.",
    ],
  },
  {
    title: "Operational controls",
    paragraphs: [
      "Our product and internal guidance enforce **permission boundaries**, approval checkpoints for destructive or externally consequential actions, and disclosure rules for inferred intent, generated summaries, and model uncertainty.",
      "We also separate experimentation from production behavior. Lab environments can test broader agent patterns, but promotion into customer-facing surfaces requires tighter controls, narrower scopes, and clearer auditability than an internal prototype needs.",
    ],
  },
  {
    title: "Human review and escalation",
    paragraphs: [
      "Some tasks should never quietly auto-complete. If a workflow touches regulated content, personal data, account access, policy interpretation, or irreversible system state, the product should route toward **human confirmation** instead of hiding the handoff.",
      "Escalation is not failure. It is a product behavior. Good systems know when evidence is thin, when instructions conflict, and when the cost of being slightly wrong is materially higher than the cost of asking for review.",
    ],
  },
  {
    title: "Privacy, security, and evidence",
    paragraphs: [
      "We treat privacy and security as part of model quality. A polished answer is low quality if it relied on the wrong data boundary, accessed information too broadly, or made a claim that cannot be grounded in the available evidence.",
      "That is why our approach emphasizes **data minimization, auditable access paths, source-aware reasoning, and explicit scoping**. The system should make it easier to see what it knows, what it inferred, and what still needs verification.",
    ],
  },
  {
    title: "What this means for clients",
    paragraphs: [
      "For Web3 and biotech teams especially, the bar is simple: the product has to support speed without weakening defensibility. If a team needs a workflow for policy-sensitive research, launch readiness, support operations, or internal knowledge work, we design the handoffs and controls around that reality instead of pretending every task is low risk.",
      "If your team needs a deeper controls review, implementation walkthrough, or procurement-ready answers on responsible use, privacy, or security posture, contact our team and we will route the discussion to the right operators.",
    ],
  },
] as const;

export function EthicsPage() {
  useDocumentTitle("Ethics & compliance — Jokuh");

  return (
    <EditorialArticleTemplate
      metaLine="March 28, 2026 · Trust · Ethics & compliance"
      title="Ethics and compliance are product behaviors, not a policy appendix."
      subtitle="How Jokuh approaches boundaries, escalation, reviewability, and responsible deployment for high-stakes client work."
      afterMain={<CookieBanner />}
    >
      <EditorialArticleProseSection className="py-10 md:py-14">
        {INTRO_PARAGRAPHS.map((paragraph) => (
          <RichParagraph
            key={paragraph.slice(0, 48)}
            className="news-detail-reading text-[1.0625rem] leading-[1.72] text-light-space/82 md:text-lg md:leading-[1.68]"
          >
            {paragraph}
          </RichParagraph>
        ))}
      </EditorialArticleProseSection>

      {SECTIONS.map((section, index) => (
        <div key={section.title}>
          <EditorialArticleHeadingSection className={index === 0 ? "" : "pt-2 md:pt-4"}>
            {section.title}
          </EditorialArticleHeadingSection>
          <EditorialArticleProseSection className="pt-0 pb-12 md:pb-16">
            {section.paragraphs.map((paragraph) => (
              <RichParagraph
                key={paragraph.slice(0, 48)}
                className="news-detail-reading text-[1.0625rem] leading-[1.72] text-light-space/82 md:text-lg md:leading-[1.68]"
              >
                {paragraph}
              </RichParagraph>
            ))}
          </EditorialArticleProseSection>
        </div>
      ))}

      <EditorialArticleShellSection className="pb-14 md:pb-20">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-light-space/[0.08] bg-white/[0.04] p-6 backdrop-blur-md md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-light-space/48">
            Contact
          </p>
          <h2 className="mt-3 font-sans text-2xl font-semibold tracking-[-0.03em] text-light-space md:text-[2rem]">
            Need a controls review for your deployment?
          </h2>
          <p className="mt-4 max-w-2xl text-[1rem] leading-7 text-light-space/72 md:text-[1.0625rem]">
            We can walk through responsible-use constraints, review paths, and implementation expectations for your team.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <SiteLink
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-light-space/[0.14] bg-light-space px-5 text-sm font-semibold text-dark-space transition-colors hover:bg-light-space/90"
            >
              Contact sales
            </SiteLink>
            <SiteLink
              href="/support"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-light-space/[0.12] bg-white/[0.03] px-5 text-sm font-semibold text-light-space transition-colors hover:bg-white/[0.06]"
            >
              Support overview
            </SiteLink>
          </div>
        </div>
      </EditorialArticleShellSection>

      <EditorialArticleShellSection>
        <EndorsementSeal className="pb-4 md:pb-6" />
      </EditorialArticleShellSection>
    </EditorialArticleTemplate>
  );
}

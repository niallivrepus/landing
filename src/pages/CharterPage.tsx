import { cn } from "@jokuh/gooey";
import {
  EditorialArticleTemplate,
  EditorialArticleHeadingSection,
  EditorialArticleProseSection,
} from "../components/system";
import { CONTENT_READING_MEASURE, CONTENT_SHELL_WIDE } from "../components/system/shells";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

type CharterSection = {
  heading: string;
  principle: string;
  paragraphs: string[];
};

const CHARTER_SECTIONS: CharterSection[] = [
  {
    heading: "I. Sovereignty by Design",
    principle: "Privacy is not a feature. It is the precondition for authentic human expression.",
    paragraphs: [
      "We commit to building systems where user data is encrypted with user-held keys, stored in user-controlled infrastructure, and never accessible to the platform. This is not a policy promise. It is a cryptographic guarantee. No employee of JOKUH, no investor in JOKUH, and no government requesting data from JOKUH can access what belongs to the user, because the architecture makes it impossible.",
      "We recognize that true sovereignty requires more than encryption. It requires local compute, user-held identity, and economic systems where the platform cannot extract value without the user's explicit participation. Every architectural decision we make is measured against this standard: does it move sovereignty closer to the user, or further away?",
      "We will never build a system that requires capturing user data for corporate benefit. If our revenue model ever conflicts with user sovereignty, we change the revenue model.",
    ],
  },
  {
    heading: "II. Strength in Service",
    principle: "Power is never an end. It is always a tool for something larger than the one wielding it.",
    paragraphs: [
      "JOKUH will accumulate significant power: over data infrastructure, over AI orchestration, over economic systems that connect human knowledge to agent demand. We commit to using that power exclusively in service of the people who trust us with their thinking.",
      "We measure every use of force by what it serves, not what it destroys. We do not build to conquer markets. We build to protect the people inside them. When we compete, we compete by making sovereignty more accessible, not by making extraction more efficient.",
      "This principle applies internally as well. Leadership at JOKUH serves the team. The team serves the user. The user serves their own purpose. The chain flows one direction: outward.",
    ],
  },
  {
    heading: "III. The Immovable and the Adaptive",
    principle: "We distinguish between what must never change and what must always evolve.",
    paragraphs: [
      "Some things are Rock. They do not bend. They do not negotiate. User ownership of data. Cryptographic guarantees. Intellectual honesty. The commitment that the platform cannot read what it stores. These are non-negotiable regardless of market pressure, investor preference, or competitive convenience.",
      "Some things are Fabric. They must be rewoven constantly. Interfaces. Methods. Partnerships. Go-to-market channels. Technical implementations. Business model details. These adapt to terrain without losing the pattern.",
      "We never confuse the two. We never compromise the former. We never calcify the latter. The ability to tell the difference is the most important judgment call this company makes, and we make it together.",
    ],
  },
  {
    heading: "IV. Earned Access",
    principle: "Trust is granted in layers, never in binaries.",
    paragraphs: [
      "JOKUH's product is built on the principle that people should control who sees what, at what depth, at what time. This applies to our users, and it applies to how we operate as a company.",
      'We do not hide. We curate. The right people get the right depth at the right time. Our code, our architecture, our economic models will be transparent to those who have earned the context to evaluate them. This is not secrecy. This is sovereignty applied to organizational communication.',
      "Internally, this means team members are given full context for their domain and the trust to act on it. We do not hoard information at the top. We distribute it with purpose.",
    ],
  },
  {
    heading: "V. Grace as Protocol",
    principle:
      "We approach every interaction with grace as the default, not because we cannot fight, but because we choose not to lead with the sword.",
    paragraphs: [
      "Grace at JOKUH means choosing gentleness from a position of strength. It means giving users the benefit of the doubt. It means extending patience to team members learning new systems. It means engaging competitors with respect, even when they operate on principles we reject.",
      "The warrior is always underneath. The grace is the interface. People who mistake the grace for weakness will learn about the warrior. But we never lead with force when service will do.",
      "This principle governs our external communications, our internal disagreements, our investor relations, and our product design. The tone of JOKUH is warm, direct, and grounded. Never aggressive. Never submissive. Always clear.",
    ],
  },
  {
    heading: "VI. Intellectual Honesty",
    principle: "We state the counter-arguments before our opponents do.",
    paragraphs: [
      "JOKUH operates in a space where overclaiming is the industry standard. Every AI startup promises transformation. Every crypto project promises revolution. We refuse to participate in this theater.",
      "We will always state clearly what we do not yet know, what we have not yet built, and what might not work. We publish our kill criteria alongside our milestones. We name the strongest case against us in our own strategy documents. If a thesis fails, we say so before the market does.",
      "Overclaiming is a trust issue. Precision matters more than confidence. We would rather be believed on three claims than doubted on ten.",
      "This extends to how we communicate with employees. No one at JOKUH should ever have to wonder whether what leadership said is true. If the answer is uncertain, we say it is uncertain. If the answer is bad, we say it is bad. Clarity is not optional.",
    ],
  },
  {
    heading: "VII. Architecture Before Features",
    principle: "We reduce to the foundation before we build upward.",
    paragraphs: [
      "Features built on unaudited architecture create expensive rebuilds. We learned this early and we codified it: the foundation must be clean before anything is deployed on top of it. This is not caution. This is capital discipline.",
      "Every capability we ship must pass through a clear sequence: observe the current state, orient to what the architecture actually supports, decide what the minimal clean path forward is, and only then act. We do not skip steps because a deadline is close or a demo would look impressive.",
      "This principle protects our investors' capital, our engineers' sanity, and our users' trust. A system that works correctly on day one earns more than a system that demos well on day one and breaks on day thirty.",
    ],
  },
  {
    heading: "VIII. The Cycle Over the Line",
    principle: "We never finish. We complete cycles.",
    paragraphs: [
      "Creation at JOKUH follows a continuous loop: question the standard, act with courage, lead with grace, integrate what the battle taught us, establish the ground, weave it into reality, then question again. This is not a hierarchy or a timeline. It is a wheel.",
      "Every output becomes the input for the next question. Every foundation becomes the ground for the next iteration. Mastery is not arrival. It is the increasing consciousness with which we run the loop.",
      "This means we do not treat launches as endings. We treat them as the completion of one cycle and the beginning of the next. Every user interaction, every team retrospective, every market signal feeds back into the system and makes the next rotation sharper.",
    ],
  },
  {
    heading: "IX. Cooperative Sovereignty",
    principle:
      "Sovereignty does not mean isolation. It means choosing your connections from a position of ownership.",
    paragraphs: [
      "We will actively cooperate with other projects, protocols, and organizations that share our commitment to user-owned data and decentralized infrastructure. We do not need to build everything ourselves. We need to ensure that whatever we integrate honors the same architectural commitments we make.",
      "We are committed to providing public goods that help the broader ecosystem navigate the transition from extraction-based platforms to sovereignty-based systems. This includes publishing research, sharing architectural patterns, and contributing to open standards where doing so does not compromise the security of our users.",
      "We reject the false choice between privacy and interoperability. A sovereign system that cannot connect to other sovereign systems is a prison, not a sanctuary. JOKUH connects. It simply connects on the user's terms.",
    ],
  },
];

const BODY_CLASS =
  "text-[1.0625rem] leading-[1.72] text-light-space/72 light:text-zinc-600 md:text-[1.125rem]";

export function CharterPage() {
  useDocumentTitle("Charter — Jokuh");

  return (
    <EditorialArticleTemplate
      metaLine="The Charter · March 2026"
      title="JOKUH"
      subtitle="The principles that govern how we build, communicate, and operate."
    >
      <div className={CONTENT_SHELL_WIDE}>
        <div className={cn(CONTENT_READING_MEASURE, "space-y-6")}>
          <p className="text-xs uppercase tracking-[0.24em] text-light-space/44 light:text-zinc-500">
            Joining Our Knowledge, Unifying Humanity
          </p>
          <p className="text-sm uppercase tracking-[0.24em] text-light-space/44 light:text-zinc-500">
            Hyke Vlas &amp; Sean Rock · Co-Founders · March 2026
          </p>
        </div>
      </div>

      <EditorialArticleProseSection>
        <p className={BODY_CLASS}>
          This document describes the principles JOKUH uses to execute on its mission. It is written for every
          person who builds with us, invests in us, or uses what we create. The timeline to a world where human
          conversational intelligence is owned, compounding, and tradeable remains uncertain, but this Charter
          will guide us in acting in the best interests of human sovereignty throughout its development.
        </p>
      </EditorialArticleProseSection>

      <div className={CONTENT_SHELL_WIDE}>
        <blockquote
          className={cn(
            CONTENT_READING_MEASURE,
            "border-l border-light-space/[0.12] pl-6 italic text-light-space/72 light:border-zinc-200 light:text-zinc-600",
          )}
        >
          Your data. Your identity. Your freedom.
        </blockquote>
      </div>

      <EditorialArticleProseSection>
        <p className={BODY_CLASS}>
          JOKUH exists because the fundamental bargain of the internet is broken. Users create the value.
          Platforms capture the profit. This is not a bug. It is the business model of every major social and AI
          platform in operation today. We are building the structural opposite: a decentralized AI operating
          system where human conversational intelligence compounds into a queryable, ownable, tradeable asset,
          and where AI agents pay humans for original thought.
        </p>
        <p className={BODY_CLASS}>
          We will attempt to directly build this infrastructure. But we will also consider our mission fulfilled
          if our work aids others to achieve this outcome. To that end, we commit to the following principles:
        </p>
      </EditorialArticleProseSection>

      {CHARTER_SECTIONS.map((section) => (
        <div key={section.heading}>
          <EditorialArticleHeadingSection>{section.heading}</EditorialArticleHeadingSection>
          <EditorialArticleProseSection>
            <p className="font-medium italic text-light-space/84 light:text-zinc-800 md:text-[1.125rem]">
              {section.principle}
            </p>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className={BODY_CLASS}>
                {paragraph}
              </p>
            ))}
          </EditorialArticleProseSection>
        </div>
      ))}

      <EditorialArticleHeadingSection>X. The Covenant</EditorialArticleHeadingSection>
      <EditorialArticleProseSection>
        <p className={BODY_CLASS}>
          In the tradition that shaped both founders' names, a charter is not a marketing document. It is a
          covenant. A declaration of what we will do and what we will not do, spoken publicly so that we can be
          held to it.
        </p>
        <p className={BODY_CLASS}>
          JOKUH was not named casually. Joining Our Knowledge, Unifying Humanity is not a tagline. It is the
          mission. Knowledge that compounds. Humanity that connects. Ownership that persists. This is what we are
          building.
        </p>
        <p className={BODY_CLASS}>The warrior who builds. The builder who fights. The rock that weaves. The weave that endures.</p>
      </EditorialArticleProseSection>

      <div className={CONTENT_SHELL_WIDE}>
        <blockquote
          className={cn(
            CONTENT_READING_MEASURE,
            "border-l border-light-space/[0.12] pl-6 italic text-light-space/72 light:border-zinc-200 light:text-zinc-600",
          )}
        >
          We do not ask users to perform for the algorithm. We make the algorithm work for the user. That is the
          commitment. Everything else follows from it.
        </blockquote>
      </div>

      <div className={CONTENT_SHELL_WIDE}>
        <div className={cn(CONTENT_READING_MEASURE, "border-t border-light-space/[0.08] py-12 light:border-zinc-200")}>
          <p className="text-sm leading-relaxed text-light-space/40 light:text-zinc-500">
            JOKUH Inc. · Cursor for Social Intelligence · March 2026
          </p>
        </div>
      </div>
    </EditorialArticleTemplate>
  );
}

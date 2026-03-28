import {
  TertiaryBreadcrumb,
  TertiaryClosingCta,
  TertiaryHubBody,
  TertiaryPageChrome,
  TertiaryPageHero,
  TertiaryQuickLinksGrid,
  TertiarySection,
} from "../components/system";
import { FaqSection } from "../components/FaqSection";
import { useSiteSearch } from "../context/SiteSearchContext";
import { resolveStatusHref } from "../config/site-subdomains";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const SUPPORT_LINKS = [
  {
    label: "Browse documentation",
    href: "/developers/docs",
    description: "Reference docs, guides, and integration paths for developers and operators.",
  },
  {
    label: "Contact sales",
    href: "/contact",
    description: "Talk to Jokuh about deployment, procurement, or team rollout questions.",
  },
  {
    label: "Account & billing",
    href: "/account",
    description: "Manage access, seats, billing details, and account-level settings.",
  },
  {
    label: "Pods",
    href: "/pods",
    description: "Product details and support paths for Pods.",
  },
  {
    label: "Spine",
    href: "/spine",
    description: "Product details and support paths for Spine.",
  },
  {
    label: "Vortex",
    href: "/vortex",
    description: "Product details and support paths for Vortex.",
  },
  {
    label: "Blurbs",
    href: "/blurbs",
    description: "Product details and support paths for Blurbs.",
  },
  {
    label: "System status",
    href: resolveStatusHref("/"),
    description: "Check uptime, incidents, and current platform availability.",
  },
] as const;

export function SupportPage() {
  useDocumentTitle("Support — Jokuh");
  const { open } = useSiteSearch();

  return (
    <TertiaryPageChrome
      breadcrumb={<TertiaryBreadcrumb items={[{ label: "Jokuh", to: "/" }, { label: "Support" }]} />}
    >
      <TertiaryPageHero
        eyebrow="Support"
        title="Support without a second homepage."
        intro="Use one index for product help, documentation, account tasks, and live system status."
        actions={
          <button
            type="button"
            onClick={() => open()}
            className="inline-flex h-11 items-center justify-center rounded-full border border-light-space/[0.12] px-6 text-[14px] font-medium text-light-space transition-colors hover:border-light-space/[0.24] hover:bg-white/[0.04] light:border-black/[0.12] light:text-zinc-950 light:hover:border-black/[0.18] light:hover:bg-zinc-100"
          >
            Search Jokuh
          </button>
        }
      />

      <TertiaryHubBody>
        <TertiarySection title="Help links">
          <TertiaryQuickLinksGrid links={[...SUPPORT_LINKS]} columns={3} />
        </TertiarySection>

        <div className="pt-12 md:pt-14">
          <FaqSection
            items={[
              {
                question: "How do I reset my password?",
                answer: "Use the sign-in flow and choose “Forgot password” to receive a reset link at your account email address.",
              },
              {
                question: "Where should I go for integration help?",
                answer: "Start with the developer docs. If you need rollout or commercial help, use Contact sales.",
              },
              {
                question: "How do I check whether Jokuh is down?",
                answer: "Use the System status link for live incidents, maintenance windows, and current availability.",
              },
              {
                question: "How do I report a bug?",
                answer: "Use the support channels tied to your account or contact Jokuh with steps to reproduce and the surface where the issue happened.",
              },
            ]}
          />
        </div>

        <TertiaryClosingCta
          title="Still need a human route?"
          label="Contact sales"
          href="/contact"
          className="pt-16"
        />
      </TertiaryHubBody>
    </TertiaryPageChrome>
  );
}

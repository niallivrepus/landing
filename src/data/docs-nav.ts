import { resolveStatusHref } from "../config/site-subdomains";

export type DocsNavItem = { label: string; to: string };

export const DOCS_NAV_SECTIONS: { heading: string; items: DocsNavItem[] }[] = [
  {
    heading: "Get started",
    items: [
      { label: "Overview", to: "/developers/docs" },
      { label: "Quickstart", to: "/developers/docs/quickstart" },
      { label: "Cookbook", to: "/developers/docs/cookbook" },
    ],
  },
  {
    heading: "Explore",
    items: [
      { label: "Latest & digests", to: "/developers/learn" },
      { label: "Developer blog", to: "/developers/blog" },
      { label: "Apps platform", to: "/developers/apps" },
    ],
  },
  {
    heading: "Reference",
    items: [{ label: "SDK & API", to: "/developers/sdk" }],
  },
  {
    heading: "Community & status",
    items: [
      { label: "Forum", to: "/developers/forum" },
      { label: "System status", to: resolveStatusHref("/") },
    ],
  },
];

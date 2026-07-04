import { resolveStatusHref } from "../config/site-subdomains";

export type DocsNavItem = { label: string; to: string };

export const DOCS_NAV_SECTIONS: { heading: string; items: DocsNavItem[] }[] = [
  {
    heading: "Docs",
    items: [
      { label: "Overview", to: "/developers/docs" },
      { label: "Quickstart", to: "/developers/docs/quickstart" },
    ],
  },
  {
    heading: "Build",
    items: [
      { label: "SDK & API", to: "/developers/docs/sdk" },
      { label: "Text generation", to: "/developers/docs/text" },
      { label: "Structured output", to: "/developers/docs/structured-output" },
      { label: "Audio basics", to: "/developers/docs/audio" },
    ],
  },
  {
    heading: "Status",
    items: [{ label: "System status", to: resolveStatusHref("/") }],
  },
];

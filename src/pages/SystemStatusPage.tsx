import { useEffect } from "react";
import { SiteLink } from "../components/SiteLink";
import { SimpleMarketingPageTemplate } from "../components/system";
import { STATUS_PORTAL_ORIGIN, resolveStatusHref } from "../config/site-subdomains";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export function SystemStatusPage() {
  useDocumentTitle("System status — Jokuh");

  useEffect(() => {
    if (!STATUS_PORTAL_ORIGIN || typeof window === "undefined") return;
    window.location.replace(resolveStatusHref("/"));
  }, []);

  if (STATUS_PORTAL_ORIGIN) {
    return (
      <SimpleMarketingPageTemplate
        title="System status"
        description="Redirecting to the live Jokuh status page."
      >
        <p className="mt-6 text-center text-sm text-light-space/60">
          <SiteLink href={resolveStatusHref("/")}>Open status.jokuh.com</SiteLink>
        </p>
      </SimpleMarketingPageTemplate>
    );
  }

  return <SimpleMarketingPageTemplate title="System status" />;
}

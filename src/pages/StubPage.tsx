import { SimpleMarketingPageTemplate } from "../components/system";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export function StubPage({ title }: { title: string }) {
  useDocumentTitle(`${title} — Jokuh`);
  return <SimpleMarketingPageTemplate title={title} />;
}

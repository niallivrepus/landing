import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { DownloadPage } from "./pages/DownloadPage";
import Home from "./pages/Home";
import { LegalHomePage } from "./pages/legal/LegalHomePage";
import { LegalInternetServicesPage } from "./pages/legal/LegalInternetServicesPage";
import { LegalPrivacyDocumentPage } from "./pages/legal/LegalPrivacyDocumentPage";
import { LegalPrivacyPage } from "./pages/legal/LegalPrivacyPage";
import { LegalPrivacySelectPage } from "./pages/legal/LegalPrivacySelectPage";
import { LegalTermsPage } from "./pages/legal/LegalTermsPage";
import { NewsDetailPage } from "./pages/NewsDetailPage";
import { NewsPage } from "./pages/NewsPage";
import { ProductPage } from "./pages/ProductPage";
import { SitemapPage } from "./pages/SitemapPage";
import { StoryDetailPage } from "./pages/StoryDetailPage";
import { PromptBarPage } from "./pages/PromptBarPage";
import { StubPage } from "./pages/StubPage";

function LegacyNewsRedirect() {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/journal/${slug}`} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/download" element={<DownloadPage />} />
      <Route path="/sitemap" element={<SitemapPage />} />

      <Route path="/privacy" element={<LegalPrivacyPage />} />
      <Route path="/terms" element={<LegalTermsPage />} />

      <Route path="/legal" element={<LegalHomePage />} />
      <Route path="/legal/internet-services" element={<LegalInternetServicesPage />} />
      <Route path="/legal/terms" element={<LegalTermsPage />} />
      <Route path="/legal/privacy" element={<LegalPrivacyPage />} />
      <Route path="/legal/privacy/:docKey/read/:locale" element={<LegalPrivacyDocumentPage />} />
      <Route path="/legal/privacy/:docKey" element={<LegalPrivacySelectPage />} />

      <Route path="/journal" element={<NewsPage />} />
      <Route path="/journal/:slug" element={<NewsDetailPage />} />
      <Route path="/news" element={<Navigate to="/journal" replace />} />
      <Route path="/news/:slug" element={<LegacyNewsRedirect />} />

      <Route path="/stories/:slug" element={<StoryDetailPage />} />
      <Route path="/pods" element={<ProductPage productId="pods" />} />
      <Route path="/blurbs" element={<ProductPage productId="blurbs" />} />
      <Route path="/spine" element={<ProductPage productId="spine" />} />
      <Route path="/vortex" element={<ProductPage productId="vortex" />} />

      <Route path="/prompt" element={<PromptBarPage />} />
      <Route path="/platform/identity" element={<StubPage title="Identity" />} />
      <Route path="/platform/gooey" element={<StubPage title="Gooey" />} />
      <Route path="/platform/wallet" element={<StubPage title="Wallet" />} />
      <Route path="/platform/galaxy-nodes" element={<StubPage title="Galaxy Nodes" />} />
      <Route path="/ecosystem/v1llains" element={<StubPage title="V1llains" />} />
      <Route path="/ecosystem/community" element={<StubPage title="Community" />} />
      <Route path="/ecosystem/partnerships" element={<StubPage title="Partnerships" />} />
      <Route path="/waitlist" element={<StubPage title="Waitlist" />} />
      <Route path="/about" element={<StubPage title="About" />} />
      <Route path="/contact" element={<StubPage title="Contact" />} />
      <Route path="/careers" element={<StubPage title="Careers" />} />
      <Route path="/research" element={<StubPage title="Research" />} />
      <Route path="/ethics" element={<StubPage title="Ethics & compliance" />} />
      <Route path="/developers/documentation" element={<StubPage title="Documentation" />} />
      <Route path="/developers/sdk" element={<StubPage title="SDK & API" />} />
      <Route path="/developers/accessibility" element={<StubPage title="Accessibility" />} />
      <Route path="/support" element={<StubPage title="Jokuh Care" />} />
      <Route path="/account" element={<StubPage title="Account" />} />
    </Routes>
  );
}

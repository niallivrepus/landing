import { Route, Routes } from "react-router-dom";
import { DownloadPage } from "./pages/DownloadPage";
import Home from "./pages/Home";
import { LegalHomePage } from "./pages/legal/LegalHomePage";
import { LegalInternetServicesPage } from "./pages/legal/LegalInternetServicesPage";
import { LegalPrivacyDocumentPage } from "./pages/legal/LegalPrivacyDocumentPage";
import { LegalPrivacyPage } from "./pages/legal/LegalPrivacyPage";
import { LegalPrivacySelectPage } from "./pages/legal/LegalPrivacySelectPage";
import { LegalTermsPage } from "./pages/legal/LegalTermsPage";
import { NewsPage } from "./pages/NewsPage";
import { ProductPage } from "./pages/ProductPage";
import { SitemapPage } from "./pages/SitemapPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/download" element={<DownloadPage />} />
      <Route path="/sitemap" element={<SitemapPage />} />
      <Route path="/legal" element={<LegalHomePage />} />
      <Route path="/legal/internet-services" element={<LegalInternetServicesPage />} />
      <Route path="/legal/terms" element={<LegalTermsPage />} />
      <Route path="/legal/privacy" element={<LegalPrivacyPage />} />
      <Route path="/legal/privacy/:docKey/read/:locale" element={<LegalPrivacyDocumentPage />} />
      <Route path="/legal/privacy/:docKey" element={<LegalPrivacySelectPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/pods" element={<ProductPage productId="pods" />} />
      <Route path="/blurbs" element={<ProductPage productId="blurbs" />} />
      <Route path="/spine" element={<ProductPage productId="spine" />} />
      <Route path="/vortex" element={<ProductPage productId="vortex" />} />
    </Routes>
  );
}

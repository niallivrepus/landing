import { Suspense, lazy, type ComponentType, useLayoutEffect } from "react";
import { Navigate, Route, Routes, useLocation, useNavigationType, useParams } from "react-router-dom";
import { GoogleTranslateHost } from "./components/GoogleTranslateHost";

type LazyModule = Record<string, ComponentType<any>>;

function lazyNamed(loader: () => Promise<LazyModule>, exportName: string) {
  return lazy(async () => {
    const mod = await loader();
    return { default: mod[exportName]! };
  });
}

const HomePage = lazy(() => import("./pages/Home"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const CareersPage = lazy(() => import("./pages/CareersPage"));
const ContactSalesPage = lazyNamed(() => import("./pages/ContactSalesPage"), "ContactSalesPage");
const DownloadPage = lazyNamed(() => import("./pages/DownloadPage"), "DownloadPage");
const NewsDetailPage = lazyNamed(() => import("./pages/NewsDetailPage"), "NewsDetailPage");
const NewsPage = lazyNamed(() => import("./pages/NewsPage"), "NewsPage");
const ProductPage = lazyNamed(() => import("./pages/ProductPage"), "ProductPage");
const SitemapPage = lazyNamed(() => import("./pages/SitemapPage"), "SitemapPage");
const StoryDetailPage = lazyNamed(() => import("./pages/StoryDetailPage"), "StoryDetailPage");
const StoriesPage = lazyNamed(() => import("./pages/StoriesPage"), "StoriesPage");
const StubPage = lazyNamed(() => import("./pages/StubPage"), "StubPage");
const SupportPage = lazyNamed(() => import("./pages/SupportPage"), "SupportPage");
const SystemStatusPage = lazyNamed(() => import("./pages/SystemStatusPage"), "SystemStatusPage");
const DocsCookbookPage = lazyNamed(() => import("./pages/docs/DocsCookbookPage"), "DocsCookbookPage");
const DocsLayout = lazyNamed(() => import("./pages/docs/DocsLayout"), "DocsLayout");
const DocsOverviewPage = lazyNamed(() => import("./pages/docs/DocsOverviewPage"), "DocsOverviewPage");
const DocsQuickstartPage = lazyNamed(() => import("./pages/docs/DocsQuickstartPage"), "DocsQuickstartPage");
const LegalHomePage = lazyNamed(() => import("./pages/legal/LegalHomePage"), "LegalHomePage");
const LegalInternetServicesPage = lazyNamed(
  () => import("./pages/legal/LegalInternetServicesPage"),
  "LegalInternetServicesPage",
);
const LegalPrivacyDocumentPage = lazyNamed(
  () => import("./pages/legal/LegalPrivacyDocumentPage"),
  "LegalPrivacyDocumentPage",
);
const LegalPrivacyPage = lazyNamed(() => import("./pages/legal/LegalPrivacyPage"), "LegalPrivacyPage");
const LegalPrivacySelectPage = lazyNamed(
  () => import("./pages/legal/LegalPrivacySelectPage"),
  "LegalPrivacySelectPage",
);
const LegalTermsPage = lazyNamed(() => import("./pages/legal/LegalTermsPage"), "LegalTermsPage");

const PRODUCT_ROUTES = [
  { path: "/pods", productId: "pods" },
  { path: "/blurbs", productId: "blurbs" },
  { path: "/spine", productId: "spine" },
  { path: "/vortex", productId: "vortex" },
] as const;

const STUB_ROUTES = [
  { path: "/platform/identity", title: "Identity" },
  { path: "/platform/gooey", title: "Gooey" },
  { path: "/platform/wallet", title: "Wallet" },
  { path: "/platform/galaxy-nodes", title: "Galaxy Nodes" },
  { path: "/ecosystem/v1llains", title: "V1llains" },
  { path: "/ecosystem/community", title: "Community" },
  { path: "/ecosystem/partnerships", title: "Partnerships" },
  { path: "/waitlist", title: "Waitlist" },
  { path: "/research", title: "Research" },
  { path: "/ethics", title: "Ethics & compliance" },
  { path: "/developers/sdk", title: "SDK & API" },
  { path: "/developers/agents", title: "Agents of chaos" },
  { path: "/developers/open-models", title: "Open models" },
  { path: "/developers/apps", title: "Apps platform" },
  { path: "/developers/learn", title: "Latest & digests" },
  { path: "/developers/blog", title: "Developer blog" },
  { path: "/developers/forum", title: "Developer forum" },
  { path: "/developers/accessibility", title: "Accessibility" },
  { path: "/startups", title: "Jokuh for startups" },
  { path: "/account", title: "Account" },
  { path: "/brand-guidelines", title: "Brand guidelines" },
] as const;

const LEGAL_ROUTES = [
  { path: "/privacy", element: <LegalPrivacyPage /> },
  { path: "/terms", element: <LegalTermsPage /> },
  { path: "/legal", element: <LegalHomePage /> },
  { path: "/legal/internet-services", element: <LegalInternetServicesPage /> },
  { path: "/legal/terms", element: <LegalTermsPage /> },
  { path: "/legal/privacy", element: <LegalPrivacyPage /> },
  { path: "/legal/privacy/:docKey/read/:locale", element: <LegalPrivacyDocumentPage /> },
  { path: "/legal/privacy/:docKey", element: <LegalPrivacySelectPage /> },
] as const;

function LegacyNewsRedirect() {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/newsroom/${slug}`} replace />;
}

function RouteFallback() {
  return <div className="landing-cinema min-h-screen bg-dark-space text-light-space" aria-hidden />;
}

function RouteScrollManager() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    if (navigationType === "POP" || location.hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.hash, location.pathname, location.search, navigationType]);

  return null;
}

export default function App() {
  return (
    <>
      <GoogleTranslateHost />
      <RouteScrollManager />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/download" element={<DownloadPage />} />
          <Route path="/sitemap" element={<SitemapPage />} />

          {LEGAL_ROUTES.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          <Route path="/newsroom" element={<NewsPage />} />
          <Route path="/newsroom/:slug" element={<NewsDetailPage />} />
          <Route path="/journal" element={<Navigate to="/newsroom" replace />} />
          <Route path="/journal/:slug" element={<LegacyNewsRedirect />} />
          <Route path="/news" element={<Navigate to="/newsroom" replace />} />
          <Route path="/news/:slug" element={<LegacyNewsRedirect />} />

          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/stories/:slug" element={<StoryDetailPage />} />
          {PRODUCT_ROUTES.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<ProductPage productId={route.productId} />}
            />
          ))}

          <Route path="/prompt" element={<Navigate to="/#prompt" replace />} />
          <Route path="/contact" element={<ContactSalesPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/system-status" element={<SystemStatusPage />} />
          {STUB_ROUTES.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<StubPage title={route.title} />}
            />
          ))}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/developers/documentation" element={<Navigate to="/developers/docs" replace />} />
          <Route path="/developers/docs" element={<DocsLayout />}>
            <Route index element={<DocsOverviewPage />} />
            <Route path="quickstart" element={<DocsQuickstartPage />} />
            <Route path="cookbook" element={<DocsCookbookPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

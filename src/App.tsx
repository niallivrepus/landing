import { Suspense, lazy, type ComponentType, useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { ConsentManagedScripts } from "./components/ConsentManagedScripts";
import { CookieBanner } from "./components/CookieBanner";
import { GoogleTranslateHost } from "./components/GoogleTranslateHost";
import { RSS_FEED_PATH } from "./config/rss";
import { primeGentleHoverSfx } from "./lib/gentle-hover-sfx";
import {
  installManualScrollRestoration,
  scrollDocumentToTopAfterPaint,
  scrollToHashTargetAfterPaint,
} from "./lib/route-scroll";

type LazyModule = Record<string, ComponentType<any>>;

function lazyNamed(loader: () => Promise<LazyModule>, exportName: string) {
  return lazy(async () => {
    const mod = await loader();
    return { default: mod[exportName]! };
  });
}

const BrandPage = lazyNamed(() => import("./pages/BrandPage"), "BrandPage");
const BusinessOverviewPage = lazyNamed(
  () => import("./pages/BusinessOverviewPage"),
  "BusinessOverviewPage",
);
const InvestPage = lazyNamed(() => import("./pages/InvestPage"), "InvestPage");
const HomePage = lazy(() => import("./pages/Home"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const CareersPage = lazy(() => import("./pages/CareersPage"));
const CareersRolesPage = lazyNamed(() => import("./pages/CareersRolesPage"), "CareersRolesPage");
const CareersRoleDetailPage = lazyNamed(
  () => import("./pages/CareersRoleDetailPage"),
  "CareersRoleDetailPage",
);
const ContactSalesPage = lazyNamed(() => import("./pages/ContactSalesPage"), "ContactSalesPage");
const DownloadPage = lazyNamed(() => import("./pages/DownloadPage"), "DownloadPage");
const LandingDemoPage = lazy(() => import("./pages/LandingDemoPage"));
const ManifestoPage = lazyNamed(() => import("./pages/ManifestoPage"), "ManifestoPage");
const NewsDetailPage = lazyNamed(() => import("./pages/NewsDetailPage"), "NewsDetailPage");
const NewsPage = lazyNamed(() => import("./pages/NewsPage"), "NewsPage");
const ProductPage = lazyNamed(() => import("./pages/ProductPage"), "ProductPage");
const PrivacyPolicyPage = lazyNamed(() => import("./pages/PrivacyPolicyPage"), "PrivacyPolicyPage");
const SupportPage = lazyNamed(() => import("./pages/SupportPage"), "SupportPage");
const TermsOfServicePage = lazyNamed(() => import("./pages/TermsOfServicePage"), "TermsOfServicePage");
const StoryDetailPage = lazyNamed(() => import("./pages/StoryDetailPage"), "StoryDetailPage");
const ShareYourStoryPage = lazyNamed(() => import("./pages/ShareYourStoryPage"), "ShareYourStoryPage");
const StoriesPage = lazyNamed(() => import("./pages/StoriesPage"), "StoriesPage");

const PRODUCT_ROUTES = [
  { path: "/blurbs", productId: "blurbs" },
  { path: "/spine", productId: "spine" },
  { path: "/calls", productId: "calls" },
  { path: "/messages", productId: "messages" },
  { path: "/profile", productId: "profile" },
] as const;

/** Unpublished marketing URLs → home; do not register these paths as public stubs. */
const REDIRECT_HOME_PATHS = [
  "/platform/identity",
  "/platform/gooey",
  "/platform/wallet",
  "/platform/galaxy-nodes",
  "/pods",
  "/pricing",
  "/v1llains",
  "/ecosystem/v1llains",
  "/developers/apps",
  "/developers/agents",
  "/developers/blog",
  "/developers/documentation",
  "/developers/docs",
  "/developers/docs/*",
  "/developers/forum",
  "/developers/learn",
  "/developers/open-models",
  "/developers/sdk",
  "/developers/accessibility",
  "/chatgpt/explore",
  "/chatgpt/business",
  "/chatgpt/enterprise",
  "/chatgpt/education",
] as const;

function LegacyNewsRedirect() {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/newsroom/${slug}`} replace />;
}

function RssRedirect() {
  useEffect(() => {
    window.location.replace(RSS_FEED_PATH);
  }, []);

  return null;
}

function RouteFallback() {
  return <div className="landing-cinema min-h-screen bg-dark-space text-light-space" aria-hidden />;
}

function RouteScrollManager() {
  const location = useLocation();

  useEffect(() => {
    installManualScrollRestoration();
  }, []);

  useEffect(() => {
    if (location.hash) {
      scrollToHashTargetAfterPaint(location.hash);
      return;
    }

    scrollDocumentToTopAfterPaint();
  }, [location.hash, location.pathname, location.search]);

  return null;
}

export default function App() {
  useEffect(() => {
    primeGentleHoverSfx();
  }, []);

  return (
    <>
      <ConsentManagedScripts />
      <GoogleTranslateHost />
      <RouteScrollManager />
      <CookieBanner />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/demo" element={<LandingDemoPage />} />
          <Route path="/download" element={<DownloadPage />} />

          <Route path="/newsroom" element={<NewsPage />} />
          <Route path="/newsroom/:slug" element={<NewsDetailPage />} />
          <Route path="/journal" element={<Navigate to="/newsroom" replace />} />
          <Route path="/journal/:slug" element={<LegacyNewsRedirect />} />
          <Route path="/news" element={<Navigate to="/newsroom" replace />} />
          <Route path="/news/:slug" element={<LegacyNewsRedirect />} />
          <Route path="/rss" element={<RssRedirect />} />

          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/stories/share" element={<ShareYourStoryPage />} />
          <Route path="/stories/a-day-with-jokuh-maren-cote" element={<Navigate to="/stories/made-from-memory" replace />} />
          <Route
            path="/stories/tomas-aldaz-high-plains-coop"
            element={<Navigate to="/stories/tomas-aldaz" replace />}
          />
          <Route path="/stories/:slug" element={<StoryDetailPage />} />
          {PRODUCT_ROUTES.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<ProductPage productId={route.productId} />}
            />
          ))}
          {REDIRECT_HOME_PATHS.map((path) => (
            <Route key={path} path={path} element={<Navigate to="/" replace />} />
          ))}

          <Route path="/prompt" element={<Navigate to="/demo" replace />} />
          <Route path="/research" element={<Navigate to="/about" replace />} />
          <Route path="/contact" element={<ContactSalesPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/legal/privacy-policy.html" element={<Navigate to="/privacy" replace />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/legal/terms-of-service.html" element={<Navigate to="/terms" replace />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/help" element={<Navigate to="/support" replace />} />
          <Route path="/legal/support.html" element={<Navigate to="/support" replace />} />
          <Route path="/brand" element={<BrandPage />} />
          <Route path="/brand-guidelines" element={<Navigate to="/brand" replace />} />
          <Route path="/manifesto" element={<ManifestoPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/business" element={<BusinessOverviewPage />} />
          <Route path="/invest" element={<InvestPage />} />
          <Route path="/charter" element={<Navigate to="/manifesto" replace />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/careers/roles" element={<CareersRolesPage />} />
          <Route path="/careers/roles/:slug" element={<CareersRoleDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

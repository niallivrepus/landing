import { useEffect } from "react";
import {
  COOKIE_CONSENT_UPDATED_EVENT,
  readCookiePrefsWithDefaults,
  type CookiePrefs,
} from "../lib/cookie-consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

const GA_SCRIPT_ID = "jokuh-google-tag";
const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();

function consentState(prefs: CookiePrefs) {
  const analytics = prefs.analytics ? "granted" : "denied";
  const marketing = prefs.marketing ? "granted" : "denied";

  return {
    analytics_storage: analytics,
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
  };
}

function ensureGoogleTagBase() {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
}

function applyGoogleConsent(prefs: CookiePrefs) {
  if (!gaMeasurementId) return;

  ensureGoogleTagBase();
  window[`ga-disable-${gaMeasurementId}`] = !prefs.analytics;
  window.gtag?.("consent", "update", consentState(prefs));
}

function loadGoogleAnalytics(prefs: CookiePrefs) {
  if (!gaMeasurementId || !prefs.analytics) return;

  ensureGoogleTagBase();

  if (!document.getElementById(GA_SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = GA_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaMeasurementId)}`;
    document.head.appendChild(script);

    window.gtag?.("js", new Date());
  }

  window.gtag?.("config", gaMeasurementId);
}

export function ConsentManagedScripts() {
  useEffect(() => {
    if (!gaMeasurementId) return;

    const prefs = readCookiePrefsWithDefaults();
    ensureGoogleTagBase();
    window.gtag?.("consent", "default", consentState(prefs));
    applyGoogleConsent(prefs);
    loadGoogleAnalytics(prefs);

    const onConsentUpdated = (event: Event) => {
      const updatedPrefs = (event as CustomEvent<CookiePrefs>).detail ?? readCookiePrefsWithDefaults();
      applyGoogleConsent(updatedPrefs);
      loadGoogleAnalytics(updatedPrefs);
    };

    window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, onConsentUpdated);
    return () => window.removeEventListener(COOKIE_CONSENT_UPDATED_EVENT, onConsentUpdated);
  }, []);

  return null;
}

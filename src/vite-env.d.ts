/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTACT_SALES_ENDPOINT?: string;
  readonly VITE_ORIGIN_DEVELOPERS?: string;
  /** OO handoff target (web app origin); default https://app.jokuh.com. Local: http://localhost:5173 */
  readonly VITE_OO_HANDOFF_ORIGIN?: string;
  readonly VITE_ORIGIN_HELP?: string;
  readonly VITE_ORIGIN_STATUS?: string;
  readonly VITE_COOKIE_DOMAIN?: string;
  readonly VITE_GA_MEASUREMENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.json" {
  const value: Record<string, unknown>;
  export default value;
}

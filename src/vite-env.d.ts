/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTACT_SALES_ENDPOINT?: string;
  readonly VITE_ORIGIN_DEVELOPERS?: string;
  readonly VITE_ORIGIN_HELP?: string;
  readonly VITE_ORIGIN_STATUS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.json" {
  const value: Record<string, unknown>;
  export default value;
}

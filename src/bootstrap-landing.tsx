/**
 * Production marketing SPA entry (full Jokuh landing site).
 * Loaded by `main.tsx` for local dev and for `pnpm build:landing`
 * (`VITE_SITE_ENTRY=landing`). The filename is not "dev": Vite would
 * otherwise emit `bootstrap-dev-*.js` in the production landing bundle.
 * Contrast with `bootstrap-prod.tsx`, which mounts only the MASK (ProdMaskPage).
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@jokuh/gooey";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { SiteSearchProvider } from "./context/SiteSearchContext";
import "./styles/app.css";

/** Mounts the full marketing SPA (router, theme, search, App). */
export function mount() {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <BrowserRouter>
        <ThemeProvider defaultTheme="auto" storageKey="jokuh-landing-theme-v2">
          <SiteSearchProvider>
            <App />
          </SiteSearchProvider>
        </ThemeProvider>
      </BrowserRouter>
    </StrictMode>,
  );
}

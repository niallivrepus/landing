import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@jokuh/gooey";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { SiteSearchProvider } from "./context/SiteSearchContext";
import "./styles/app.css";

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

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@jokuh/gooey";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/app.css";

export function mount() {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="jokuh-landing-theme">
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </StrictMode>,
  );
}

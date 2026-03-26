import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ProdMaskPage } from "./ProdMaskPage";
import "./prod-mask.css";

export function mount() {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ProdMaskPage />
    </StrictMode>,
  );
}

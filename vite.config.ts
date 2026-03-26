import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function jokuhAsciiLogoBanner() {
  return {
    name: "jokuh-ascii-logo-banner",
    apply: "build" as const,
    buildStart() {
      const p = resolve(__dirname, "public/jokuh-logo-ascii.txt");
      if (!existsSync(p)) return;
      console.log(readFileSync(p, "utf8"));
    },
  };
}

export default defineConfig({
  resolve: {
    alias: {
      "@gooey": resolve(__dirname, "node_modules/@jokuh/gooey/src"),
    },
  },
  plugins: [tailwindcss(), react(), jokuhAsciiLogoBanner()],
  server: {
    host: true,
    port: 5174,
    strictPort: true,
  },
  preview: {
    host: true,
    port: 5174,
    strictPort: true,
  },
});

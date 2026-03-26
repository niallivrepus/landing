import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { createContactSalesMiddleware } from "./contact-sales-middleware";
import { createSiteSearchMiddleware } from "./site-search-middleware";

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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const groqKey = env.GROQ_API_KEY;
  const contactSalesWebhookUrl = env.CONTACT_SALES_WEBHOOK_URL;

  return {
    resolve: {
      alias: {
        "@gooey": resolve(__dirname, "node_modules/@jokuh/gooey/src"),
      },
    },
    plugins: [
      tailwindcss(),
      react(),
      jokuhAsciiLogoBanner(),
      {
        name: "site-apis",
        configureServer(server) {
          server.middlewares.use(createSiteSearchMiddleware(groqKey));
          server.middlewares.use(createContactSalesMiddleware(contactSalesWebhookUrl));
        },
        configurePreviewServer(server) {
          server.middlewares.use(createSiteSearchMiddleware(groqKey));
          server.middlewares.use(createContactSalesMiddleware(contactSalesWebhookUrl));
        },
      },
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules/recharts")) return "recharts";
            if (id.includes("node_modules/three")) return "three";
          },
        },
      },
    },
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
  };
});

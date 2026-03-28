import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));
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
  const gooeyWorkspaceRoot = resolve(__dirname, "../gooey");
  const gooeyPackageRoot = resolve(gooeyWorkspaceRoot, "packages/gooey");
  const gooeySourceRoot = resolve(gooeyPackageRoot, "src");

  return {
    resolve: {
      alias: [
        {
          find: "@jokuh/gooey/styles/globals.css",
          replacement: resolve(gooeySourceRoot, "styles/globals.css"),
        },
        {
          find: "@jokuh/gooey",
          replacement: resolve(gooeySourceRoot, "index.ts"),
        },
        {
          find: "@gooey",
          replacement: gooeySourceRoot,
        },
      ],
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
      fs: {
        allow: [__dirname, gooeyWorkspaceRoot],
      },
      host: true,
      port: 5174,
      strictPort: true,
      open: true,
    },
    preview: {
      host: true,
      port: 5174,
      strictPort: true,
      fs: {
        allow: [__dirname, gooeyWorkspaceRoot],
      },
    },
  };
});

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

/**
 * Resolves the `@jokuh/gooey` package root and its workspace root for Vite `server.fs.allow`.
 * Supports the upstream layout (`../gooey/packages/gooey`) and this monorepo (`../frontend/packages/gooey`).
 * Inputs: `landingRoot` — absolute path to the landing repo root. Outputs: package root (contains `src/`) and workspace root (parent of `packages/`).
 */
function resolveGooeyRoots(landingRoot: string): {
  gooeyWorkspaceRoot: string;
  gooeyPackageRoot: string;
} {
  const candidates = [
    resolve(landingRoot, "../gooey/packages/gooey"),
    resolve(landingRoot, "../frontend/packages/gooey"),
  ];
  for (const gooeyPackageRoot of candidates) {
    if (existsSync(join(gooeyPackageRoot, "src", "index.ts"))) {
      const gooeyWorkspaceRoot = dirname(dirname(gooeyPackageRoot));
      return { gooeyWorkspaceRoot, gooeyPackageRoot };
    }
  }
  const gooeyPackageRoot = candidates[0]!;
  return {
    gooeyWorkspaceRoot: dirname(dirname(gooeyPackageRoot)),
    gooeyPackageRoot,
  };
}
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { createContactSalesMiddleware } from "./contact-sales-middleware";
import { resolveContactSalesEnv } from "./contact-sales-service";
import { createStorySubmissionsMiddleware } from "./story-submissions-middleware";
import { createSiteSearchMiddleware } from "./site-search-middleware";
import { createArticleAudioMiddleware } from "./article-audio-middleware";

/** Tailwind/Vite may resolve url(/pods-bento/*.svg) from scanned classes; ensure files exist for fresh clones. */
function ensurePodsBentoPublicAssets() {
  const assets: Record<string, string> = {
    "pause-icon.svg": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/>
  <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/>
</svg>
`,
    "search-icon.svg": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="2"/>
  <path d="M16 16L20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>
`,
    "star-icon.svg": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M12 3.5L14.2 9.1L20 9.9L15.8 14L17 19.5L12 16.6L7 19.5L8.2 14L4 9.9L9.8 9.1L12 3.5Z" fill="currentColor"/>
</svg>
`,
    "nike-swoosh.svg": `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="24" viewBox="0 0 64 24" fill="none" aria-hidden="true">
  <path fill="currentColor" d="M62 2c-8 4-24 12-38 12C14 14 4 8 2 6c0 0 2 8 18 12 12 3 28-8 42-16z"/>
</svg>
`,
  };

  return {
    name: "ensure-pods-bento-public-assets",
    buildStart() {
      const dir = join(__dirname, "public/pods-bento");
      mkdirSync(dir, { recursive: true });
      for (const [name, body] of Object.entries(assets)) {
        const p = join(dir, name);
        if (!existsSync(p)) writeFileSync(p, body, "utf8");
      }
    },
  };
}

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
  const contactSalesEnv = resolveContactSalesEnv(env);
  const supabaseUrl = env.SUPABASE_URL;
  const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_KEY;
  const storySubmissionsEnv =
    supabaseUrl && supabaseServiceKey
      ? { supabaseUrl, supabaseServiceKey }
      : { supabaseUrl: "", supabaseServiceKey: "" };
  const articleAudioEnv = {
    apiKey: env.ELEVENLABS_API_KEY ?? env.VITE_ELEVENLABS_API_KEY ?? "",
    voiceId: env.VITE_ELEVENLABS_VOICE_ID ?? "tMXujoAjiboschVOhAnk",
    modelId: env.VITE_ELEVENLABS_MODEL_ID ?? "eleven_turbo_v2_5",
    publicDir: resolve(__dirname, "public"),
  };
  const { gooeyWorkspaceRoot, gooeyPackageRoot } = resolveGooeyRoots(__dirname);
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
      ensurePodsBentoPublicAssets(),
      tailwindcss(),
      react(),
      jokuhAsciiLogoBanner(),
      {
        name: "site-apis",
        configureServer(server) {
          server.middlewares.use(createSiteSearchMiddleware(groqKey));
          server.middlewares.use(createContactSalesMiddleware(contactSalesEnv));
          server.middlewares.use(createStorySubmissionsMiddleware(storySubmissionsEnv));
          server.middlewares.use(createArticleAudioMiddleware(articleAudioEnv));
        },
        configurePreviewServer(server) {
          server.middlewares.use(createSiteSearchMiddleware(groqKey));
          server.middlewares.use(createContactSalesMiddleware(contactSalesEnv));
          server.middlewares.use(createStorySubmissionsMiddleware(storySubmissionsEnv));
          server.middlewares.use(createArticleAudioMiddleware(articleAudioEnv));
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

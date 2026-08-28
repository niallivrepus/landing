import { resolveContactSalesEnv } from "../contact-sales-service";
import { resolvePublicBlurbsFeedEnv } from "../public-blurbs-feed-service";
import { resolvePublicPeopleSearchEnv } from "../public-people-search-service";
import { resolvePublicProfileDemoEnv } from "../public-profile-service";

/**
 * Maps Railway / local process env to the same runtime shapes used by Vite middleware.
 */
export function resolveLandingRuntimeEnv(env: NodeJS.ProcessEnv) {
  const supabaseUrl = env.SUPABASE_URL ?? "";
  const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_KEY || "";
  const canonicalHostRaw = (env.LANDING_CANONICAL_HOST ?? "apex").trim().toLowerCase();
  const canonicalHost: "www" | "apex" = canonicalHostRaw === "www" ? "www" : "apex";

  return {
    groqKey: env.GROQ_API_KEY ?? "",
    contactSalesEnv: resolveContactSalesEnv(env),
    storySubmissionsEnv:
      supabaseUrl && supabaseServiceKey
        ? { supabaseUrl, supabaseServiceKey }
        : { supabaseUrl: "", supabaseServiceKey: "" },
    articleAudioEnv: {
      apiKey: env.ELEVENLABS_API_KEY ?? env.VITE_ELEVENLABS_API_KEY ?? "",
      voiceId: env.VITE_ELEVENLABS_VOICE_ID ?? "tMXujoAjiboschVOhAnk",
      modelId: env.VITE_ELEVENLABS_MODEL_ID ?? "eleven_turbo_v2_5",
      publicDir: env.ARTICLE_AUDIO_PUBLIC_DIR ?? "",
    },
    publicBlurbsFeedEnv: resolvePublicBlurbsFeedEnv(env),
    publicPeopleSearchEnv: resolvePublicPeopleSearchEnv(env),
    publicProfileDemoEnv: resolvePublicProfileDemoEnv(env),
    appOrigin: env.VITE_ORIGIN_APP?.trim() || "https://app.jokuh.com",
    staticRoot: env.STATIC_ROOT?.trim() || "",
    port: Number(env.PORT || 3000),
    /** `www` for GoDaddy apex forwarding; `apex` when root CNAME works (e.g. Cloudflare). */
    canonicalHost,
    /** Runtime 302 if `/downloads/Jokuh.dmg` was not baked into the Docker image. */
    macosDmgFallbackUrl: env.MACOS_DMG_FALLBACK_URL?.trim() || "",
  };
}

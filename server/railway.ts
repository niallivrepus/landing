import { createServer } from "node:http";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createArticleAudioMiddleware } from "../article-audio-middleware";
import { createContactSalesMiddleware } from "../contact-sales-middleware";
import { createPublicBlurbsFeedMiddleware } from "../public-blurbs-feed-middleware";
import { createPublicPeopleSearchMiddleware } from "../public-people-search-middleware";
import { createPublicProfileDemoMiddleware } from "../public-profile-demo-middleware";
import { createSiteSearchMiddleware } from "../site-search-middleware";
import { createStorySubmissionsMiddleware } from "../story-submissions-middleware";
import { createConnectStack } from "./connect-stack";
import { resolveLandingRuntimeEnv } from "./resolve-runtime-env";
import { createStaticMiddleware } from "./static-middleware";

const landingRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const runtime = resolveLandingRuntimeEnv(process.env);
const staticRoot = runtime.staticRoot || resolve(landingRoot, "dist");

const articleAudioEnv = {
  ...runtime.articleAudioEnv,
  publicDir: runtime.articleAudioEnv.publicDir || resolve(landingRoot, "public"),
};

const middlewares = [
  createSiteSearchMiddleware(runtime.groqKey),
  createContactSalesMiddleware(runtime.contactSalesEnv),
  createStorySubmissionsMiddleware(runtime.storySubmissionsEnv),
  createArticleAudioMiddleware(articleAudioEnv),
  createPublicBlurbsFeedMiddleware(runtime.publicBlurbsFeedEnv),
  createPublicPeopleSearchMiddleware(runtime.publicPeopleSearchEnv),
  createPublicProfileDemoMiddleware(runtime.publicProfileDemoEnv),
  createStaticMiddleware({
    staticRoot,
    appOrigin: runtime.appOrigin,
  }),
];

const handler = createConnectStack(middlewares, (_req, res) => {
  const resNode = res;
  resNode.statusCode = 404;
  resNode.end("Not found");
});

const server = createServer(handler);

server.listen(runtime.port, () => {
  console.log(
    `[landing] Railway server listening on :${runtime.port} (static=${staticRoot}, app=${runtime.appOrigin})`,
  );
});

/** @deprecated Vercel serverless adapter — production uses `server/railway.ts` on Railway. */
import {
  handlePublicBlurbsFeedRequest,
  resolvePublicBlurbsFeedEnv,
} from "../public-blurbs-feed-service";

export default {
  async fetch(request: Request) {
    return handlePublicBlurbsFeedRequest(request, resolvePublicBlurbsFeedEnv(process.env));
  },
};

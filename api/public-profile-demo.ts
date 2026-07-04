/** @deprecated Vercel serverless adapter — production uses `server/railway.ts` on Railway. */
import {
  handlePublicProfileDemoRequest,
  resolvePublicProfileDemoEnv,
} from "../public-profile-service";

export default {
  async fetch(request: Request) {
    return handlePublicProfileDemoRequest(request, resolvePublicProfileDemoEnv(process.env));
  },
};

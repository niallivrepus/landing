/** @deprecated Vercel serverless adapter — production uses `server/railway.ts` on Railway. */
import {
  handlePublicPeopleSearchRequest,
  resolvePublicPeopleSearchEnv,
} from "../public-people-search-service";

export default {
  async fetch(request: Request) {
    return handlePublicPeopleSearchRequest(request, resolvePublicPeopleSearchEnv(process.env));
  },
};

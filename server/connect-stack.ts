import type { IncomingMessage, ServerResponse } from "node:http";
import type { Connect } from "vite";

/**
 * Runs a Connect-style middleware stack ending in `finalHandler`.
 * **Purpose:** Reuse Vite dev/preview middleware on Railway without Express.
 */
export function createConnectStack(
  middlewares: Connect.NextHandleFunction[],
  finalHandler: Connect.NextHandleFunction,
): (req: IncomingMessage, res: ServerResponse) => void {
  return (req, res) => {
    let index = 0;

    const next: Connect.NextFunction = (err?: unknown) => {
      if (err) {
        finalHandler(req, res, next);
        return;
      }

      const middleware = middlewares[index];
      index += 1;

      if (middleware) {
        middleware(req, res, next);
        return;
      }

      finalHandler(req, res, next);
    };

    next();
  };
}

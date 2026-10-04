import { Link } from "react-router-dom";
import { CompanyPageLayout } from "../components/CompanyPageLayout";
import { jokuhButtonClass } from "../components/system/JokuhButton";
import { CONTENT_READING_MEASURE, CONTENT_SHELL_WIDE } from "../components/system/shells";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

/**
 * **Purpose:** Honest 404 — unknown URLs must not silently render the homepage with HTTP 200.
 * **Connects to:** `App.tsx` splat route, `server/static-middleware.ts` status code.
 */
export function NotFoundPage() {
  useDocumentTitle("Page not found — Jokuh");

  return (
    <CompanyPageLayout>
      <header className={`${CONTENT_SHELL_WIDE} pt-28 pb-10 text-center md:pt-32 md:pb-14`}>
        <p className="font-sans text-[13px] font-medium tracking-wide text-light-space/55 light:text-zinc-500">
          404
        </p>
        <div className={`${CONTENT_READING_MEASURE} text-center`}>
          <h1 className="mt-4 font-sans text-[2.1rem] font-semibold leading-[1.08] tracking-[0em] text-light-space light:text-zinc-950 sm:text-5xl">
            This page is not here.
          </h1>
          <p className="mt-6 text-[1.0625rem] leading-[1.65] text-light-space/60 light:text-zinc-600">
            The link may be old, or the path was never published. Head home, open support, or
            download Jokuh.
          </p>
        </div>
      </header>

      <div className={`${CONTENT_SHELL_WIDE} flex flex-wrap justify-center gap-3 pb-28`}>
        <Link
          to="/"
          className={jokuhButtonClass("primary", "lg")}
        >
          Go home
        </Link>
        <Link
          to="/support"
          className={jokuhButtonClass("secondary", "lg")}
        >
          Support
        </Link>
        <Link
          to="/download"
          className={jokuhButtonClass("secondary", "lg")}
        >
          Download
        </Link>
      </div>
    </CompanyPageLayout>
  );
}

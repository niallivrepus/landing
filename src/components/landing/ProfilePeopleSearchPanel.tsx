import { Avatar, cn, useCurrentGooeyViewport } from "@jokuh/gooey";
import { motion } from "motion/react";
import { useCallback, useState } from "react";
import { useDownloadIntercept } from "../../hooks/useDownloadIntercept";
import { useGentleHoverSound } from "../../hooks/useGentleHoverSound";
import { usePublicPeopleSearch } from "../../hooks/usePublicPeopleSearch";
import type { PublicPeopleSearchItem } from "../../lib/public-people-search";
import { LandingPromptBar } from "./LandingPromptBar";

/** Parity `friends.search.placeholder` — `frontend/src/i18n/en.json`. */
const SEARCH_PLACEHOLDER = "Search people…";

/** Parity `friends.search.hint`. */
const SEARCH_HINT =
  "Type a username or display name to search. Suggested people and requests will appear here.";

/** Parity `friends.search.no_results`. */
const NO_RESULTS_PREFIX = "No results for";

const APP_ORIGIN =
  (import.meta.env.VITE_ORIGIN_APP as string | undefined)?.replace(/\/$/, "") ??
  "https://app.jokuh.com";

type ProfilePeopleSearchPanelProps = {
  className?: string;
  /** `bottomComposer` keeps search in the app-style bottom chrome while results expand upward. */
  variant?: "panel" | "bottomComposer";
};

/**
 * **Purpose:** Live people discovery on the Profile product page — reusable center panel or bottom composer.
 * **Connects to:** `ProfileImmersiveShell`, `/api/public-people-search`, `/download` intercept, `LandingPromptBar`.
 * **Gate:** browsing results and public profile links work unsigned; Connect/Message routes to signup.
 * **Parity:** web `AddFriendSheet.tsx` / Text inbox frosted prompt bar (not blue discovery accent).
 */
export function ProfilePeopleSearchPanel({
  className,
  variant = "panel",
}: ProfilePeopleSearchPanelProps) {
  const viewport = useCurrentGooeyViewport();
  const [query, setQuery] = useState("");
  const { intercept } = useDownloadIntercept("profile-people-search");
  const { items, source, loading, error } = usePublicPeopleSearch(query);
  const hoverSoundProps = useGentleHoverSound(true, "gentle");
  const trimmed = query.trim();
  const isBottomComposer = variant === "bottomComposer";
  const showHint = trimmed.length < 2;
  const showResults = trimmed.length >= 2;
  const showTray = isBottomComposer ? trimmed.length >= 1 || items.length > 0 : true;

  const openPublicProfile = useCallback((item: PublicPeopleSearchItem) => {
    const url = `${APP_ORIGIN}/u/${encodeURIComponent(item.username)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const resultsContent = (
    <>
      {showHint ? (
        <p className="landing-profile-people-search__hint">{SEARCH_HINT}</p>
      ) : null}

      {showResults && loading && items.length === 0 ? (
        <div className="landing-profile-people-search__state" role="status">
          Searching…
        </div>
      ) : null}

      {showResults && !loading && items.length === 0 ? (
        <div className="landing-profile-people-search__state">
          {source === "unavailable"
            ? (error ?? "People search is unavailable right now.")
            : `${NO_RESULTS_PREFIX} "${trimmed}"`}
        </div>
      ) : null}

      {items.length > 0 ? (
        <>
          <ul className="landing-profile-people-search__list" aria-live="polite">
            {items.map((item) => (
              <li key={item.id} className="landing-profile-people-search__row">
                <button
                  type="button"
                  className="landing-profile-people-search__profile-link"
                  onClick={() => openPublicProfile(item)}
                  aria-label={`View ${item.displayName} public profile`}
                >
                  <div className="landing-profile-people-search__avatar" aria-hidden>
                    <Avatar
                      size={36}
                      alt={item.displayName}
                      username={item.username}
                      src={item.avatarUrl ?? undefined}
                      borderStyle="origins"
                      originColor="aether"
                    />
                  </div>
                  <div className="landing-profile-people-search__meta">
                    <p className="landing-profile-people-search__name">{item.displayName}</p>
                    <p className="landing-profile-people-search__handle">@{item.username}</p>
                    {item.biographyText ? (
                      <p className="landing-profile-people-search__bio">{item.biographyText}</p>
                    ) : null}
                  </div>
                </button>
                <div className="landing-profile-people-search__actions">
                  <button
                    type="button"
                    className="landing-profile-people-search__connect"
                    onClick={() => intercept("connect", { ref: item.username })}
                  >
                    Connect
                  </button>
                  <button
                    type="button"
                    className="landing-profile-people-search__message"
                    onClick={() => intercept("send-message", { ref: item.username })}
                  >
                    Message
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="landing-profile-people-search__signup-banner" role="note">
            <p className="landing-profile-people-search__signup-copy">
              Sign up to connect, message, and add people to your network.
            </p>
            <button
              type="button"
              className="landing-profile-people-search__signup-cta"
              onClick={() => intercept("identity")}
            >
              Claim your identity
            </button>
          </div>
        </>
      ) : null}
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "landing-profile-people-search",
        isBottomComposer && "landing-profile-people-search--bottom",
        className,
      )}
      aria-label="Search people on Jokuh"
      {...hoverSoundProps}
    >
      <LandingPromptBar
        variant={viewport === "phone" ? "phone" : "desktop"}
        viewport={viewport}
        previewText={SEARCH_PLACEHOLDER}
        onTextChange={setQuery}
        onSend={(text) => setQuery(text)}
        onPlus={() => intercept("prompt-plus")}
      />

      {showTray ? (
        <div className="landing-profile-people-search__tray">{resultsContent}</div>
      ) : null}
    </motion.div>
  );
}

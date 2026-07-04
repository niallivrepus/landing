import { Avatar, cn } from "@jokuh/gooey";
import { motion } from "motion/react";
import { formatBlurbRelativeTime, type PublicBlurbFeedItem } from "../../lib/public-blurbs-feed";
import { usePublicBlurbsFeed } from "../../hooks/usePublicBlurbsFeed";

const APP_ORIGIN = (import.meta.env.VITE_ORIGIN_APP as string | undefined)?.replace(/\/$/, "") ?? "https://app.jokuh.com";

type PublicBlurbsFeedProps = {
  className?: string;
  limit?: number;
};

/**
 * **Purpose:** Renders one public blurb attachment tile — image, video peek, or audio controls.
 * **Connects to:** `PublicBlurbsFeed`, signed URLs from `/api/public-blurbs-feed`.
 */
function PublicBlurbMedia({ item }: { item: PublicBlurbFeedItem }) {
  if (!item.hasMedia) return null;

  if (item.mediaKind === "video") {
    const previewSrc = item.posterUrl ?? item.mediaUrl;
    if (!previewSrc && !item.mediaUrl) {
      return <p className="landing-public-blurbs-card__media-fallback">Video</p>;
    }
    return (
      <div className="landing-public-blurbs-card__media">
        {item.mediaUrl ? (
          <video
            className="landing-public-blurbs-card__media-video"
            src={item.mediaUrl}
            poster={item.posterUrl ?? undefined}
            controls
            playsInline
            preload="metadata"
          />
        ) : (
          <div className="landing-public-blurbs-card__media-video-peek" aria-hidden="true">
            {previewSrc ? (
              <img className="landing-public-blurbs-card__media-image" src={previewSrc} alt="" loading="lazy" decoding="async" />
            ) : null}
            <span className="landing-public-blurbs-card__media-play" aria-hidden="true">
              ▶
            </span>
          </div>
        )}
      </div>
    );
  }

  if (item.mediaKind === "audio") {
    if (!item.mediaUrl) {
      return <p className="landing-public-blurbs-card__media-fallback">Audio</p>;
    }
    return (
      <div className="landing-public-blurbs-card__media landing-public-blurbs-card__media--audio">
        <audio className="landing-public-blurbs-card__media-audio" src={item.mediaUrl} controls preload="none" />
      </div>
    );
  }

  const imageSrc = item.mediaUrl ?? item.posterUrl;
  if (!imageSrc) {
    return <p className="landing-public-blurbs-card__media-fallback">Photo</p>;
  }

  return (
    <div className="landing-public-blurbs-card__media">
      <img
        className="landing-public-blurbs-card__media-image"
        src={imageSrc}
        alt="Blurb attachment"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

/**
 * **Purpose:** Scrollable public Blurbs column — real posts when anon RPC succeeds, bundled fallback otherwise.
 * **Connects to:** `BlurbsImmersiveShell`, `public-blurbs-feed.ts`.
 */
export function PublicBlurbsFeed({ className, limit = 20 }: PublicBlurbsFeedProps) {
  const { items, source, loading, error } = usePublicBlurbsFeed(limit);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn("landing-public-blurbs-feed", className)}
      aria-busy={loading}
      aria-live="polite"
    >
      {loading ? (
        <div className="landing-public-blurbs-feed__state" role="status">
          Loading public blurbs…
        </div>
      ) : null}

      {!loading && items.length === 0 ? (
        <div className="landing-public-blurbs-feed__state">
          Public blurbs will appear here once the feed is reachable.
        </div>
      ) : null}

      <ul className="landing-public-blurbs-feed__list">
        {items.map((item, index) => (
          <li key={item.id} className="landing-public-blurbs-feed__item">
            <article className="landing-public-blurbs-card">
              <a
                className="landing-public-blurbs-card__avatar-hit"
                href={`${APP_ORIGIN}/u/${encodeURIComponent(item.username)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${item.displayName} profile`}
              >
                <Avatar
                  size="medium"
                  src={item.avatarUrl ?? undefined}
                  alt={item.displayName}
                  username={item.username}
                  borderStyle="origins"
                  originColor="aether"
                />
              </a>

              <div className="landing-public-blurbs-card__bubble">
                <header className="landing-public-blurbs-card__head">
                  <div className="landing-public-blurbs-card__identity">
                    <a
                      className="landing-public-blurbs-card__author"
                      href={`${APP_ORIGIN}/u/${encodeURIComponent(item.username)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.displayName}
                    </a>
                    <span className="landing-public-blurbs-card__handle">@{item.username}</span>
                  </div>
                  <time
                    className="landing-public-blurbs-card__time"
                    dateTime={item.createdAt}
                    title={new Date(item.createdAt).toLocaleString()}
                  >
                    {formatBlurbRelativeTime(item.createdAt)}
                  </time>
                </header>

                <div className="landing-public-blurbs-card__body-wrap">
                  {item.bodyText ? <p className="landing-public-blurbs-card__body">{item.bodyText}</p> : null}
                  <PublicBlurbMedia item={item} />
                </div>

                {source === "live" && item.publicSlug ? (
                  <a
                    className="landing-public-blurbs-card__permalink"
                    href={`${APP_ORIGIN}/u/${encodeURIComponent(item.username)}/b/${item.publicSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in Jokuh
                  </a>
                ) : null}
              </div>
            </article>
            {index < items.length - 1 ? (
              <div className="landing-public-blurbs-feed__gap" aria-hidden />
            ) : null}
          </li>
        ))}
      </ul>

      {!loading && source === "fallback" && error ? (
        <p className="landing-public-blurbs-feed__note" role="note">
          Showing sample blurbs — live feed unavailable ({error}).
        </p>
      ) : null}
    </motion.div>
  );
}

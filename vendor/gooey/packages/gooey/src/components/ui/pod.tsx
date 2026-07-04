import * as React from "react";

import { AlbumArtCover } from "./album-art-cover";
import { cn } from "../../lib/utils";
import { UploadIcon } from "./edit-bar-icons";
import { Squircle } from "./squircle";
import { PlayButton } from "./play-button";
import { VoiceMemoSimulation } from "./voice-memo";

type PodSize = "small" | "medium-tall" | "medium-wide" | "tall" | "wide" | "large";
type PodVariant = "empty" | "profile" | "music";

const POD_SIZES: Record<PodSize, { width: number; height: number }> = {
  small: { width: 150, height: 150 },
  "medium-tall": { width: 150, height: 304 },
  "medium-wide": { width: 304, height: 150 },
  tall: { width: 150, height: 458 },
  wide: { width: 458, height: 150 },
  large: { width: 458, height: 458 },
};

interface BiographyProps {
  bio?: string;
  name?: string;
}

function Biography({ bio, name }: BiographyProps) {
  return (
    <Squircle
      cornerRadius={32}
      cornerSmoothing={1}
      borderWidth={1}
      allowOverflow
      strokeClassName="dark:stroke-[var(--color-light-glass-5)] stroke-[#D4D4D8]"
      className="relative self-start w-full shrink-0 bg-[var(--color-dark-space)] px-[12px] py-[24px] flex flex-col gap-[16px]"
    >
      {bio && (
        <p
          className="text-[14px] font-normal leading-[1.6] w-full text-text-secondary"
          style={{ fontFamily: "'Geist Mono', ui-monospace, monospace" }}
        >
          {bio}
        </p>
      )}
      {name && (
        <div className="flex items-center w-full shrink-0">
          <p
            className="text-[16px] leading-[1.2] text-light-space w-full"
            style={{ fontFamily: "'Rock Salt', cursive" }}
          >
            {name}
          </p>
        </div>
      )}
    </Squircle>
  );
}

interface PodProps extends React.ComponentPropsWithoutRef<"div"> {
  size?: PodSize;
  variant?: PodVariant;
  imageSrc?: string;
  showUploadOverlay?: boolean;
  /** Short bio text shown below the image */
  bio?: string;
  /** Display name shown below the bio */
  bioName?: string;
  /** Track name (music variant) */
  title?: string;
  /** Artist name (music variant) */
  artist?: string;
  /** Band name (music variant) */
  band?: string;
}

function Pod({ size = "small", variant = "empty", imageSrc, showUploadOverlay, bio, bioName, title, artist, band, children, className, style, ...props }: PodProps) {
  const { width, height } = POD_SIZES[size];
  const hasBio = variant === "profile" && (bio || bioName);

  if (variant === "music") {
    const isExpanded = width >= 458 && height >= 458;
    const isTall = !isExpanded && height > width;
    const hasContent = imageSrc || title || artist;

    return (
      <Squircle
        cornerRadius={40}
        cornerSmoothing={1}
        borderWidth={1}
        strokeClassName="stroke-[var(--color-light-glass-5)]"
        className={cn("relative bg-[var(--color-dark-space)]", className)}
        style={{ width, height, ...style }}
        {...props}
      >
        {hasContent && (
          <>
            {/* Album art background + gradient overlay */}
            {imageSrc && (
              <img
                alt=""
                aria-hidden
                className="absolute inset-0 size-full object-cover pointer-events-none"
                src={imageSrc}
              />
            )}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.38) 100%), linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.78) 100%)",
              }}
            />

            {/* Content — compact (small) vs expanded (large) */}
            <div
              className={cn(
                "relative flex flex-col size-full",
                isExpanded
                  ? "justify-between p-[32px]"
                  : isTall
                    ? "justify-end gap-[12px] px-[12px] pb-[12px]"
                    : "justify-center gap-[12px] px-[12px] py-[16px]",
              )}
            >
              {/* Track title */}
              {title && (
                <p
                  className={cn(
                    "w-full whitespace-pre-wrap text-white leading-[1.2]",
                    isExpanded ? "text-[40px] font-medium" : "text-[16px]",
                  )}
                  style={{
                    fontFamily: "'Satoshi', sans-serif",
                    letterSpacing: isExpanded ? "2px" : "0.32px",
                    ...(isExpanded && { textShadow: "0px 4px 15px rgba(0,0,0,0.15)" }),
                  }}
                >
                  {title}
                </p>
              )}

              {/* Bottom group — artist row + controls */}
              <div className={cn("flex flex-col w-full", isExpanded ? "gap-[12px]" : "gap-[12px]")}>
                {/* Artist row */}
                {artist && (
                  <div className="relative flex items-center gap-[4px] overflow-clip w-full">
                    <style>{`@keyframes pod-marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }`}</style>
                    <div className="overflow-hidden w-full">
                      <div
                        className="flex whitespace-nowrap"
                        style={{ gap: 24, animation: "pod-marquee 8s linear infinite" }}
                      >
                        {[0, 1].map((i) => (
                          <div key={i} className="flex items-center gap-[4px] shrink-0">
                            {isExpanded && <AlbumArtCover size="small" src={imageSrc} />}
                            <p
                              className="shrink-0 text-[16px] leading-[1.56] text-white"
                              style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}
                            >
                              {artist}
                            </p>
                            {band && (
                              <>
                                <p
                                  className="shrink-0 text-[16px] leading-[1.56]"
                                  style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 700, color: "var(--color-text-secondary)" }}
                                >
                                  -
                                </p>
                                <p
                                  className="shrink-0 text-[16px] leading-[1.56]"
                                  style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 700, color: "var(--color-text-secondary)" }}
                                >
                                  {band}
                                </p>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Left-edge fade gradient */}
                    <div
                      className="absolute left-0 top-0 h-full w-[25px] z-[1]"
                      style={{ background: "linear-gradient(to left, transparent, rgba(0,0,0,1))" }}
                    />
                    {/* Right-edge fade gradient */}
                    <div
                      className="absolute right-0 top-0 h-full w-[25px] z-[1]"
                      style={{ background: "linear-gradient(to right, transparent, rgba(0,0,0,1))" }}
                    />
                  </div>
                )}

                {/* Play button + waveform */}
                <div className={cn("flex items-start w-full", isExpanded ? "gap-[8px]" : "gap-[2px]")}>
                  <PlayButton origin="life" forceTheme="dark" />
                  <div className="flex-1 min-w-0">
                    <VoiceMemoSimulation
                      theme="dark"
                      barGradient="linear-gradient(0deg, #D8FF3D 0%, #77FF00 100%)"
                      className="!w-full !rounded-[40px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {children}
      </Squircle>
    );
  }

  if (variant === "profile") {
    if (hasBio) {
      return (
        <Squircle
          cornerRadius={40}
          cornerSmoothing={1}
          borderWidth={1}
          strokeClassName="stroke-[var(--color-light-glass-5)]"
          className={cn(
            "bg-[var(--color-dark-space)] flex flex-col items-stretch gap-[4px] p-[4px]",
            className
          )}
          style={{ width, height, ...style }}
          {...props}
        >
          {/* Image area */}
          <Squircle
            cornerRadius={36}
            cornerSmoothing={1}
            borderWidth={1}
            strokeClassName="stroke-[var(--color-light-glass-5)]"
            className="relative w-full flex-1 min-h-0 bg-[var(--color-dark-space)] pointer-events-none"
          >
            {imageSrc && (
              <img
                src={imageSrc}
                alt=""
                className="absolute inset-0 size-full object-cover"
              />
            )}
            {showUploadOverlay && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ backgroundColor: "var(--color-overlay-scrim)" }}
              >
                <UploadIcon size={24} className="text-light-space" />
              </div>
            )}
          </Squircle>
          {/* Bio card */}
          <Biography bio={bio} name={bioName} />
          {children}
        </Squircle>
      );
    }

    return (
      <Squircle
        cornerRadius={40}
        cornerSmoothing={1}
        borderWidth={1}
        strokeClassName="stroke-[var(--color-light-glass-5)]"
        className={cn("bg-[var(--color-dark-space)]", className)}
        style={{ width, height, ...style }}
        {...props}
      >
        <div className="absolute inset-0 p-[4px]">
          <Squircle
            cornerRadius={36}
            cornerSmoothing={1}
            borderWidth={1}
            strokeClassName="stroke-[var(--color-light-glass-5)]"
            className="size-full bg-[var(--color-dark-space)]"
          >
            {imageSrc && (
              <img
                src={imageSrc}
                alt=""
                className="absolute inset-0 size-full object-cover"
              />
            )}
            {showUploadOverlay && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ backgroundColor: "var(--color-overlay-scrim)" }}
              >
                <UploadIcon size={24} className="text-light-space" />
              </div>
            )}
          </Squircle>
        </div>
        {children}
      </Squircle>
    );
  }

  return (
    <Squircle
      cornerRadius={40}
      cornerSmoothing={1}
      borderWidth={1}
      strokeClassName="stroke-[var(--color-light-glass-5)]"
      className={cn("bg-[var(--color-dark-space)]", className)}
      style={{ width, height, ...style }}
      {...props}
    >
      {children}
    </Squircle>
  );
}

export { Pod, Biography, type PodProps, type BiographyProps, type PodSize, type PodVariant };

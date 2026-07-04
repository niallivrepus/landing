import * as React from "react";

import { useGooeyViewport, type GooeyViewportPreference } from "../../hooks/use-viewport";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { PromptBar } from "./prompt-bar";
import {
  InstagramIcon,
  TikTokIcon,
  TwitterIcon,
  TelegramIcon,
  FacebookIcon,
  TwitchIcon,
  DiscordIcon,
  LinkedInIcon,
  SunoIcon,
  SoundCloudIcon,
  GoogleIcon,
} from "./social-icons";

const SOCIAL_PLATFORMS = [
  { key: "instagram", label: "Instagram", icon: <InstagramIcon size={18} /> },
  { key: "tiktok", label: "TikTok", icon: <TikTokIcon size={18} /> },
  { key: "x", label: "X", icon: <TwitterIcon size={18} /> },
  { key: "telegram", label: "Telegram", icon: <TelegramIcon size={18} /> },
  { key: "facebook", label: "Facebook", icon: <FacebookIcon size={18} /> },
  { key: "twitch", label: "Twitch", icon: <TwitchIcon size={18} /> },
  { key: "discord", label: "Discord", icon: <DiscordIcon size={18} /> },
  { key: "linkedin", label: "LinkedIn", icon: <LinkedInIcon size={18} /> },
  { key: "suno", label: "Suno", icon: <SunoIcon size={18} /> },
  { key: "soundcloud", label: "SoundCloud", icon: <SoundCloudIcon size={18} /> },
  { key: "google", label: "Google", icon: <GoogleIcon size={18} /> },
] as const;

interface ConnectSocialsCardProps {
  variant?: "desktop" | "phone";
  viewport?: GooeyViewportPreference;
  isDesktop?: boolean;
  className?: string;
}

export function ConnectSocialsCard({
  variant,
  viewport = "auto",
  isDesktop,
  className,
}: ConnectSocialsCardProps) {
  const resolvedViewport = useGooeyViewport(
    viewport,
    isDesktop ?? (variant ? variant === "desktop" : undefined),
  );
  const isPhone = resolvedViewport === "phone";
  const showActions = resolvedViewport !== "phone";
  const [values, setValues] = React.useState<Record<string, string>>({});

  const handleChange = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div
      className={cn(
        "group relative w-full overflow-hidden rounded-[40px]",
        resolvedViewport === "wide"
          ? "max-w-[44rem] min-h-[593px]"
          : resolvedViewport === "desktop"
            ? "max-w-[39rem] min-h-[593px]"
            : resolvedViewport === "tablet"
              ? "max-w-[34rem] min-h-[580px]"
              : "max-w-[26rem] min-h-[546px]",
        "bg-light-glass-5 border border-light-glass-20 backdrop-blur-[25px]",
        "shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1)]",
        className,
      )}
    >
      {/* Content area */}
      <div className="flex flex-col flex-1 p-6 h-full">
        {/* Title + subtitle */}
        <div className="flex flex-col gap-4 mb-6">
          <h2
            className={cn(
              "font-sans font-bold text-light-space",
              isPhone ? "text-[32px] leading-[1.2]" : "text-[48px] leading-[1.1]",
            )}
          >
            Connect your socials
          </h2>
          <p
            className={cn(
              "text-light-space/80",
              isPhone
                ? "font-sans font-medium text-[14px] leading-[20px]"
                : "font-sans font-normal text-[16px] leading-[1.56]",
            )}
          >
            Link your accounts to build your identity across platforms.
          </p>
        </div>

        {/* Social list */}
        <div
          className={cn(
            "flex flex-1 flex-col gap-2 overflow-y-auto",
            showActions ? "pb-[130px]" : "pb-[70px]",
          )}
        >
          {SOCIAL_PLATFORMS.map((platform) => (
            <PromptBar
              key={platform.key}
              viewport={resolvedViewport}
              variant={isPhone ? "phone" : "desktop"}
              socialPlatform={platform.key}
              socialIcon={platform.icon}
              value={values[platform.key] ?? ""}
              onValueChange={(v) => handleChange(platform.key, v)}
              className="w-full"
            />
          ))}
        </div>
      </div>

      {/* Progressive blur fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0"
        style={{
          height: showActions ? 150 : 90,
          backdropFilter: showActions ? "blur(10px)" : "blur(5px)",
          WebkitBackdropFilter: showActions ? "blur(10px)" : "blur(5px)",
          background: showActions
            ? "linear-gradient(to bottom, transparent, rgba(0,0,0,0.25))"
            : "linear-gradient(to bottom, transparent, rgba(0,0,0,0.15))",
          maskImage: "linear-gradient(to bottom, transparent, black)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black)",
        }}
      />

      {/* CTA buttons (desktop only) */}
      {showActions && (
        <div className="absolute bottom-[22px] left-6 right-6 flex gap-2">
          <Button variant="secondary-neutral" size="xl" className="flex-1">
            Back
          </Button>
          <Button variant="primary-neutral" size="xl" className="flex-1">
            Next
          </Button>
        </div>
      )}

      {/* Inner shadow overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[40px]"
        style={{
          boxShadow: "none",
        }}
      />
    </div>
  );
}

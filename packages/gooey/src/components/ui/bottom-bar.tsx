import type * as React from "react";
import {
  Settings01Icon,
  Add01Icon,
  Link01Icon,
  Image01Icon,
  QuoteUpIcon,
  Location01Icon,
  Share01Icon,
} from "hugeicons-react";

import { cn } from "../../lib/utils";
import {
  isCompactViewport,
  type GooeyViewport,
  type GooeyViewportInput,
  useGooeyViewport,
} from "../../lib/viewport";
import { ActionButton } from "./action-button";
import { Button } from "./button";
import { ColorOnlyButton } from "./color-only-button";
import { IconOnlyButton } from "./icon-only-button";
import { LordiconIcon } from "./lordicon";
import { PromptBar, InteractivePromptBar } from "./prompt-bar";

import accountFilledData from "../../assets/lordicon/filled/account.json";
import accountOutlineData from "../../assets/lordicon/outline/account.json";
import spinnerRainAnimationData from "../../assets/lordicon/filled/spinner-rain.json";
import contactsFilledData from "../../assets/lordicon/filled/contacts.json";
import contactsOutlineData from "../../assets/lordicon/outline/contacts.json";
import forumFilledData from "../../assets/lordicon/filled/forum.json";
import forumOutlineData from "../../assets/lordicon/outline/forum.json";

type BottomBarVariant =
  | "empty"
  | "blurbs"
  | "default"
  | "landing"
  | "blurbs-prompt"
  | "settings"
  | "long-text";

interface BottomBarProps {
  variant?: BottomBarVariant;
  viewport?: GooeyViewportInput;
  isDesktop?: boolean;
  className?: string;
}

type BottomBarPhoneVariant =
  | "default"
  | "landing"
  | "register-login"
  | "reset-save"
  | "back-next"
  | "long-text";

interface BottomBarPhoneProps {
  variant?: BottomBarPhoneVariant;
  viewport?: GooeyViewportInput;
  isDesktop?: boolean;
  /** Called when a message is sent from the built-in prompt bar */
  onSend?: (text: string) => void;
  className?: string;
}

const LIKTIR_FILL =
  "linear-gradient(180deg, var(--color-liktir-1) 0%, var(--color-liktir-2) 16%, var(--color-liktir-3) 32%, var(--color-liktir-4) 51.5%, var(--color-liktir-5) 72%, var(--color-liktir-6) 100%)";

const LONG_TEXT =
  "Hi Timmy\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vulputate ultricies metus, et bibendum justo aliquet ut. Suspendisse suscipit ligula at felis tincidunt, nec facilisis turpis sodales. Mauris accumsan nunc eget lectus convallis, sit amet aliquam erat tincidunt. Ut at orci metus. Phasellus ac hendrerit erat, eget condimentum neque. Aliquam erat volutpat. Sed vestibulum leo id lorem lacinia, in posuere risus ultricies. Donec porttitor velit sit amet facilisis eleifend. Morbi ut libero fermentum, bibendum eros sed, vehicula purus.";

const BAR_CHROME_SCRIM =
  "color-mix(in srgb, var(--color-dark-space) 72%, transparent)";

function BottomBar({
  variant = "empty",
  viewport,
  isDesktop,
  className,
}: BottomBarProps) {
  const resolvedViewport = useGooeyViewport(viewport, isDesktop);

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      {/* Progressive blur fade: 0px blur at top → 10px blur at bottom + color gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          background: `linear-gradient(to bottom, transparent 0%, ${BAR_CHROME_SCRIM} 100%)`,
          maskImage: "linear-gradient(to bottom, transparent 0%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 100%)",
        }}
      />

      {/* Profile action button — bottom-left */}
      <div className="absolute bottom-[12px] left-[12px]">
        <ActionButton
          aria-label="Profile"
          icon={
            <LordiconIcon
              animationData={accountOutlineData}
              hoverAnimationData={accountFilledData}
              size={20}
            />
          }
          orientation="left"
        />
      </div>

      {/* Spine action button — bottom-right */}
      <div className="absolute bottom-[12px] right-[12px]">
        <ActionButton
          aria-label="Spine"
          icon={
            <div style={{ transform: "rotate(90deg)", marginLeft: -5 }}>
              <LordiconIcon
                animationData={spinnerRainAnimationData}
                size={20}
              />
            </div>
          }
          orientation="right"
        />
      </div>

      {/* Center content */}
      <VariantContent variant={variant} viewport={resolvedViewport} />
    </div>
  );
}

/** Renders the center content for each variant */
function VariantContent({
  variant,
  viewport,
}: {
  variant: BottomBarVariant;
  viewport: GooeyViewport;
}) {
  switch (variant) {
    case "empty":
      return <div className="h-[74px]" />;

    case "blurbs":
      return (
        <div className="flex h-[74px] items-center justify-center">
          <ScrollForBlurbsTag />
        </div>
      );

    case "default":
      return (
        <div className="relative h-[74px]">
          <div className="absolute bottom-[12px] left-1/2 -translate-x-1/2">
            <InteractivePromptBar
              viewport={viewport}
              variant={isCompactViewport(viewport) ? "phone" : "desktop"}
            />
          </div>
        </div>
      );

    case "landing":
      return (
        <div className="relative" style={{ minHeight: 108 }}>
          <div className="absolute bottom-[12px] left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="secondary-neutral"
                size="default"
                className={cn(
                  "h-[42px] min-w-[120px]",
                  isCompactViewport(viewport) && "min-w-0 flex-1",
                )}
              >
                Invest
              </Button>
              <Button
                variant="secondary-neutral"
                size="default"
                className={cn(
                  "h-[42px] min-w-[120px]",
                  isCompactViewport(viewport) && "min-w-0 flex-1",
                )}
              >
                Discover
              </Button>
              <Button
                variant="secondary-neutral"
                size="default"
                className={cn(
                  "h-[42px] min-w-[120px]",
                  isCompactViewport(viewport) && "min-w-0 flex-1",
                )}
              >
                Docs
              </Button>
            </div>
            <InteractivePromptBar
              viewport={viewport}
              variant={isCompactViewport(viewport) ? "phone" : "desktop"}
            />
          </div>
        </div>
      );

    case "blurbs-prompt":
      return (
        <div className="relative" style={{ minHeight: 116 }}>
          <div className="absolute bottom-[12px] left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="mb-2">
              <ScrollForBlurbsTag />
            </div>
            <InteractivePromptBar
              viewport={viewport}
              variant={isCompactViewport(viewport) ? "phone" : "desktop"}
            />
          </div>
        </div>
      );

    case "settings":
      return (
        <div className="relative" style={{ minHeight: 124 }}>
          <div className="absolute bottom-[12px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-[12px]">
            <SettingsRow />
            <InteractivePromptBar
              viewport={viewport}
              variant={isCompactViewport(viewport) ? "phone" : "desktop"}
            />
          </div>
        </div>
      );

    case "long-text":
      return (
        <div
          className="flex items-end justify-center pb-[12px]"
          style={{ minHeight: 385 }}
        >
          <PromptBar
            viewport={viewport}
            variant={isCompactViewport(viewport) ? "phone" : "desktop"}
            isTyping
            isExpanded
            value={LONG_TEXT}
          />
        </div>
      );
  }
}

/** Glass pill tag: "Scroll for Blurbs" */
function ScrollForBlurbsTag() {
  return (
    <div
      className="relative inline-flex h-[32px] items-center px-3 rounded-[999px] backdrop-blur-[25px]"
      style={{
        backgroundColor: "var(--color-light-glass-5)",
        border: "1px solid var(--color-light-glass-20)",
        fontFamily: '"Geist Mono", ui-monospace, monospace',
        fontSize: 12,
        color: "var(--color-light-space)",
      }}
    >
      Scroll for Blurbs
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.15)]" />
    </div>
  );
}

/** Row of icon/color buttons used in the "settings" variant */
function SettingsRow() {
  return (
    <div className="flex items-center gap-1">
      <ColorOnlyButton fill="var(--color-life-4)" size="small" />
      <ColorOnlyButton fill={LIKTIR_FILL} size="small" />
      <IconOnlyButton
        size="small"
        className="size-[42px]"
        icon={<Settings01Icon size={20} strokeWidth={1.8} />}
      />
      <IconOnlyButton
        size="small"
        className="size-[42px]"
        icon={<Add01Icon size={20} strokeWidth={1.8} />}
      />
      <IconOnlyButton
        size="small"
        className="size-[42px]"
        icon={<Link01Icon size={20} strokeWidth={1.8} />}
      />
      <IconOnlyButton
        size="small"
        className="size-[42px]"
        icon={<Image01Icon size={20} strokeWidth={1.8} />}
      />
      <IconOnlyButton
        size="small"
        className="size-[42px]"
        icon={<QuoteUpIcon size={20} strokeWidth={1.8} />}
      />
      <IconOnlyButton
        size="small"
        className="size-[42px]"
        icon={<Location01Icon size={20} strokeWidth={1.8} />}
      />
      <IconOnlyButton
        size="small"
        className="size-[42px]"
        icon={<Share01Icon size={20} strokeWidth={1.8} />}
      />
    </div>
  );
}

/** Inline action row for phone: Profile + PromptBar(phone) + Spine, 4px gap */
function PhoneActionRow({
  onSend,
  viewport,
}: {
  onSend?: (text: string) => void;
  viewport: GooeyViewport;
}) {
  return (
    <div className="flex items-center gap-[4px]">
      <ActionButton
        aria-label="Profile"
        icon={
          <LordiconIcon
            animationData={accountOutlineData}
            hoverAnimationData={accountFilledData}
            size={20}
          />
        }
        orientation="left"
      />
      <div className="min-w-0 flex-1">
        <InteractivePromptBar
          viewport={viewport}
          variant={isCompactViewport(viewport) ? "phone" : "desktop"}
          className="w-full"
          onSend={onSend}
        />
      </div>
      <ActionButton
        aria-label="Spine"
        icon={
          <div style={{ transform: "rotate(90deg)", marginLeft: -5 }}>
            <LordiconIcon animationData={spinnerRainAnimationData} size={20} />
          </div>
        }
        orientation="right"
      />
    </div>
  );
}

/** Renders content for each phone variant */
function PhoneVariantContent({
  variant,
  onSend,
  viewport,
}: {
  variant: BottomBarPhoneVariant;
  onSend?: (text: string) => void;
  viewport: GooeyViewport;
}) {
  switch (variant) {
    case "default":
      return (
        <div className="px-[12px] py-[12px]">
          <PhoneActionRow onSend={onSend} viewport={viewport} />
        </div>
      );

    case "landing":
      return (
        <div className="flex flex-col gap-[12px] px-[12px] pb-[12px]">
          <div className="flex items-center gap-[4px]">
            <Button
              variant="secondary-neutral"
              size="default"
              className="h-[40px] flex-1"
            >
              Invest
            </Button>
            <Button
              variant="secondary-neutral"
              size="default"
              className="h-[40px] flex-1"
            >
              Discover
            </Button>
            <Button
              variant="secondary-neutral"
              size="default"
              className="h-[40px] flex-1"
            >
              Docs
            </Button>
          </div>
          <PhoneActionRow onSend={onSend} viewport={viewport} />
        </div>
      );

    case "register-login":
      return (
        <div className="flex flex-col gap-[12px] px-[12px] pb-[12px]">
          <div className="flex items-center gap-[4px]">
            <Button variant="primary-neutral" size="xl" className="flex-1">
              Register
            </Button>
            <Button variant="secondary-neutral" size="xl" className="w-[100px]">
              Login
            </Button>
          </div>
          <PhoneActionRow onSend={onSend} viewport={viewport} />
        </div>
      );

    case "reset-save":
      return (
        <div className="flex flex-col gap-[12px] px-[12px] pb-[12px]">
          <div className="flex items-center gap-[4px]">
            <Button variant="secondary-neutral" size="xl" className="w-[100px]">
              Reset
            </Button>
            <Button variant="primary-neutral" size="xl" className="flex-1">
              Save
            </Button>
          </div>
          <PhoneActionRow onSend={onSend} viewport={viewport} />
        </div>
      );

    case "back-next":
      return (
        <div className="flex flex-col gap-[12px] px-[12px] pb-[12px]">
          <div className="flex items-center gap-[4px]">
            <Button variant="secondary-neutral" size="xl" className="w-[100px]">
              Back
            </Button>
            <Button variant="primary-neutral" size="xl" className="flex-1">
              Next
            </Button>
          </div>
          <PhoneActionRow onSend={onSend} viewport={viewport} />
        </div>
      );

    case "long-text":
      return (
        <div className="p-[12px]">
          <PromptBar
            viewport={viewport}
            variant={isCompactViewport(viewport) ? "phone" : "desktop"}
            isTyping
            isExpanded
            value={LONG_TEXT}
            className="w-full"
          />
        </div>
      );
  }
}

function BottomBarPhone({
  variant = "default",
  viewport,
  isDesktop,
  onSend,
  className,
}: BottomBarPhoneProps) {
  const resolvedViewport = useGooeyViewport(viewport, isDesktop);

  return (
    <div
      className={cn("relative w-full", className)}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {/* Progressive blur fade — same as desktop */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          background: `linear-gradient(to bottom, transparent 0%, ${BAR_CHROME_SCRIM} 100%)`,
          maskImage: "linear-gradient(to bottom, transparent 0%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 100%)",
        }}
      />
      <div className="relative">
        <PhoneVariantContent
          variant={variant}
          onSend={onSend}
          viewport={resolvedViewport}
        />
      </div>
    </div>
  );
}

type TopBarVariant = "empty" | "default" | "oo";

interface TopBarProps {
  /** Preset variant. Overrides leftAction/rightAction/children when set. */
  variant?: TopBarVariant;
  /** Left action button (full ActionButton element) */
  leftAction?: React.ReactNode;
  /** Right action button (full ActionButton element) */
  rightAction?: React.ReactNode;
  /** Called when the contacts action button is clicked (variant "default"/"oo") */
  onContactsClick?: () => void;
  /** Called when the messages action button is clicked (variant "default"/"oo") */
  onMessagesClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

/**
 * TopBar — full-width top bar with smooth gradient overlay.
 * Action buttons left/right, center content (children) — anchored to the top edge.
 *
 * Variants:
 * - "empty": no actions, pass children directly
 * - "default": OO action buttons + idle DynamicIsland (override children to swap island variant)
 * - "oo": OO action buttons + OO DynamicIsland
 */
function TopBar({
  variant,
  leftAction,
  rightAction,
  onContactsClick,
  onMessagesClick,
  children,
  className,
}: TopBarProps) {
  // Apply variant presets (props override variant defaults)
  let resolvedLeft = leftAction;
  let resolvedRight = rightAction;
  let resolvedChildren = children;

  if (variant === "default" || variant === "oo") {
    resolvedLeft = leftAction ?? (
      <ActionButton
        icon={
          <LordiconIcon
            animationData={contactsOutlineData}
            hoverAnimationData={contactsFilledData}
            size={20}
          />
        }
        orientation="right"
        notification={{ color: "green" }}
        onClick={onContactsClick}
      />
    );
    resolvedRight = rightAction ?? (
      <ActionButton
        icon={
          <LordiconIcon
            animationData={forumOutlineData}
            hoverAnimationData={forumFilledData}
            size={20}
          />
        }
        orientation="left"
        notification={{ color: "red", position: "top-right" }}
        onClick={onMessagesClick}
      />
    );
  }

  return (
    <div className={cn("relative w-full", className)}>
      {/* Smooth gradient: 15% dark at top → fully transparent at bottom */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${BAR_CHROME_SCRIM} 0%, transparent 100%)`,
        }}
      />

      {/* Left action(s) */}
      <div className="absolute top-[12px] left-[12px] flex items-center gap-2">
        {resolvedLeft}
      </div>

      {/* Right action(s) */}
      <div className="absolute top-[12px] right-[12px] flex items-center gap-1">
        {resolvedRight}
      </div>

      {/* Center content */}
      <div className="flex min-h-[74px] items-start justify-center pt-[12px]">
        {resolvedChildren}
      </div>
    </div>
  );
}

export {
  BottomBar,
  BottomBarPhone,
  TopBar,
  type BottomBarProps,
  type BottomBarPhoneProps,
  type BottomBarVariant,
  type BottomBarPhoneVariant,
  type TopBarProps,
  type TopBarVariant,
};

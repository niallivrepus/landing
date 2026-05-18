// ─────────────────────────────────────────────────────────────────────────────
// Gooey — barrel export
// ─────────────────────────────────────────────────────────────────────────────

// Utilities
export { cn } from "./lib/utils";
export * from "./lib/utils/animations";
export * from "./lib/design-colors";
export { SAMPLE_AVATARS, sampleAvatar, type SampleAvatar } from "./lib/sample-avatars";
export { lordiconAssets, type GooeyLordiconAssetName } from "./lib/lordicon-assets";

// Hooks
export { ThemeProvider, useTheme } from "./hooks/use-theme";
export { useHaptics } from "./hooks/use-haptics";
export {
  GooeyViewportProvider,
  resolveGooeyViewport,
  useCurrentGooeyViewport,
  useGooeyViewport,
  resolveViewportFromWidth,
  GOOEY_VIEWPORT_BREAKPOINTS,
  type GooeyViewport,
  type GooeyViewportPreference,
} from "./hooks/use-viewport";
export { useReducedMotion, useShouldAnimate } from "./hooks/use-reduced-motion";
export { TrayProvider, useTrayContext } from "./hooks/use-tray-context";
export type { TrayItem } from "./hooks/use-tray-context";

// Components
export * from "./components/ui/action-button";
export * from "./components/ui/action-card-contacts";
export * from "./components/ui/action-card-users";
export * from "./components/ui/action-circle-button";
export * from "./components/ui/active-calls";
export * from "./components/ui/add-bank-info-card";
export * from "./components/ui/album-art";
export * from "./components/ui/album-art-cover";
export * from "./components/ui/avatar";
export * from "./components/ui/avatar-hype-train";
export * from "./components/ui/avatar-wheel";
export * from "./components/ui/bad";
export * from "./components/ui/badge";
export * from "./components/ui/badge-drop-zone";
export * from "./components/ui/bottom-bar";
export * from "./components/ui/button";
export * from "./components/ui/card";
export * from "./components/ui/chat-bubble-button";
export * from "./components/ui/chat-feed";
export * from "./components/ui/checkbox";
export * from "./components/ui/chevron-right";
export * from "./components/ui/claim-identity";
export * from "./components/ui/color-only-button";
export * from "./components/ui/color-swatch";
export * from "./components/ui/component-library-context-menu";
export { ComponentLibraryMetaLayer, MarkComponent } from "./components/ui/component-library-meta-layer";
export * from "./components/ui/context-menu";
export * from "./components/ui/confetti";
export * from "./components/ui/connect-socials-card";
export * from "./components/ui/connection-request-card";
export * from "./components/ui/contact-item";
export * from "./components/ui/corner-dragger";
export * from "./components/ui/crumb";
export * from "./components/ui/custom-cursor";
export * from "./components/ui/direct-message-head";
export * from "./components/ui/document-card";
export * from "./components/ui/dynamic-island";
export * from "./components/ui/edit-bar";
export * from "./components/ui/edit-bar-icons";
export * from "./components/ui/email-avatar";
export * from "./components/ui/fireworks";
export * from "./components/ui/glass-button";
export * from "./components/ui/glass-icon-button";
export * from "./components/ui/human-speech";
export * from "./components/ui/icon-only-button";
export * from "./components/ui/image-preview";
export * from "./components/ui/image-stack";
export * from "./components/ui/input";
export * from "./components/ui/input-secondary";
export * from "./components/ui/library-menu";
export * from "./components/ui/location-point";
export * from "./components/ui/logo";
export * from "./components/ui/lordicon";
export * from "./components/ui/make-it-strong";
export * from "./components/ui/medium-tag";
export * from "./components/ui/menu-context";
export * from "./components/ui/menu-context-icons";
export * from "./components/ui/message-bubble";
export * from "./components/ui/message-preview";
export * from "./components/ui/message-preview-item";
export * from "./components/ui/mineral-effect";
export * from "./components/ui/motivator";
export * from "./components/ui/music-controls";
export * from "./components/ui/music-cover-title";
export * from "./components/ui/music-timer";
export * from "./components/ui/navigation-button";
export * from "./components/ui/nexus-logo";
export * from "./components/ui/notification";
export * from "./components/ui/notification-preview-card";
export * from "./components/ui/numbers";
export * from "./components/ui/onboarding-card";
export * from "./components/ui/oo";
export * from "./components/ui/pass-photo";
export * from "./components/ui/passport-card";
export * from "./components/ui/password-safety";
export * from "./components/ui/payment-method-icon";
export * from "./components/ui/pet";
export * from "./components/ui/play-button";
export { Play, Pause, PlayPause, Backward, Forward, type PauseButtonProps, type PlayPauseProps, type BackwardProps, type ForwardProps } from "./components/ui/play-pause";
export * from "./components/ui/plus";
export * from "./components/ui/pod";
export * from "./components/ui/popover";
export * from "./components/ui/portal-animation";
export * from "./components/ui/portal-context-menu";
export * from "./components/ui/preview-card";
export * from "./components/ui/power-button";
export * from "./components/ui/prompt-bar";
export * from "./components/ui/prompt-categories";
export * from "./components/ui/prompt-suggestion-card";
export * from "./components/ui/radio";
export * from "./components/ui/react";
export * from "./components/ui/reactions";
export * from "./components/ui/record-button";
export * from "./components/ui/right-hand-button";
export * from "./components/ui/ripple-effect";
export * from "./components/ui/search-indication";
export * from "./components/ui/sequin-effect";
export * from "./components/ui/server-avatar";
export * from "./components/ui/shooting-star";
export * from "./components/ui/skeleton";
export * from "./components/ui/slider-point";
export * from "./components/ui/small-tag";
export * from "./components/ui/social-icons";
export * from "./components/ui/soundwave";
export * from "./components/ui/special-button";
export * from "./components/ui/spine-tag";
export * from "./components/ui/squircle";
export * from "./components/ui/star";
export { StepCounter, type StepCounterProps } from "./components/ui/step-counter";
export * from "./components/ui/storage-pricing-card";
export * from "./components/ui/switch";
export * from "./components/ui/theme-selector-card";
export * from "./components/ui/timer";
export * from "./components/ui/tooltip-bubble";
export * from "./components/ui/track-info";
export * from "./components/ui/tray";
export * from "./components/ui/value-slider";
export * from "./components/ui/verified";
export * from "./components/ui/voice-memo";

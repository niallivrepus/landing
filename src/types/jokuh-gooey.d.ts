declare module "@jokuh/gooey" {
  import type { ComponentType } from "react";
  import type { LucideIcon } from "lucide-react";

  export const Button: ComponentType<any>;
  export const ActiveCalls: ComponentType<any>;
  export const Avatar: ComponentType<any>;
  export const AvatarHypeTrain: ComponentType<any>;
  export const Badge: ComponentType<any>;
  export const ChatBubbleButton: ComponentType<any>;
  export const InteractivePromptBar: ComponentType<any>;
  export const IncomingMessageBubble: ComponentType<any>;
  export const GooeyGlass: ComponentType<any>;
  export const NexusLogo: ComponentType<any>;
  export const OO: ComponentType<any>;
  export const Pod: ComponentType<any>;
  export const Biography: ComponentType<any>;
  export const SpineTimeline: ComponentType<any>;
  export type SpineDemoEvent = { id: string; time: string; kind: string };
  export const SAMPLE_SPINE_EVENTS: SpineDemoEvent[];
  export const ClaimIdentity: ComponentType<any>;
  export const OnboardingCard: ComponentType<any>;
  export const Soundwave: ComponentType<any>;
  export const GooeyViewportProvider: ComponentType<any>;
  export const ServerAvatar: ComponentType<any>;
  export function sampleAvatar(n: number): {
    src: string;
    name: string;
    originColor: string;
  };
  export type OriginColor = string;
  export function useCurrentGooeyViewport(): "phone" | "tablet" | "desktop";
  export function useShouldAnimate(): boolean;
  export const Logo: ComponentType<any>;
  export const MessageBubble: ComponentType<any>;
  export const OO: ComponentType<any>;
  export const PillWheel: ComponentType<any>;
  export const PromptBar: ComponentType<any>;
  export const Soundwave: ComponentType<any>;
  export const Squircle: ComponentType<any>;
  export function createSquirclePath(args: {
    cornerRadius?: number;
    cornerSmoothing?: number;
    height: number;
    width: number;
  }): string;
  export const ActionButton: ComponentType<any>;
  export const LordiconIcon: ComponentType<any>;
  export const actionLordicons: Record<
    string,
    { outline: unknown; filled: unknown }
  >;
  export type ActionLordiconName = keyof typeof actionLordicons;
  export const ThemeProvider: ComponentType<any>;
  export const lordiconAssets: {
    arrowLongRight: unknown;
    chatEmpty: unknown;
    domainVerification: unknown;
    downloadSave: unknown;
    logSignIn: unknown;
    newspaper: unknown;
    plus: unknown;
    search: unknown;
    work: unknown;
    worldGlobeWikis: unknown;
  };
  export type GooeyLordiconAssetName = keyof typeof lordiconAssets;

  export function cn(...inputs: any[]): string;
  export function useTheme(): {
    theme?: string;
    resolvedTheme?: string;
    setTheme?: (theme: string) => void;
  };
}

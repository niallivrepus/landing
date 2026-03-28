declare module "@jokuh/gooey" {
  import type { ComponentType } from "react";
  import type { LucideIcon } from "lucide-react";

  export const Button: ComponentType<any>;
  export const InteractivePromptBar: ComponentType<any>;
  export const Logo: ComponentType<any>;
  export const OO: ComponentType<any>;
  export const PillWheel: ComponentType<any>;
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

import * as React from "react";
import { createContext, useContext } from "react";

export interface TrayItem {
  id: string;
  title: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  height?: number | "auto";
  onClose?: () => void;
  canNavigateBack?: boolean;
  theme?: "light" | "dark";
}

interface TrayContextValue {
  trays: TrayItem[];
  openTray: (tray: TrayItem) => void;
  closeTray: (id?: string) => void;
  closeAll: () => void;
  navigateBack: () => void;
}

const TrayContext = createContext<TrayContextValue | undefined>(undefined);

export function TrayProvider({ children }: { children: React.ReactNode }) {
  const [trays, setTrays] = React.useState<TrayItem[]>([]);

  const openTray = React.useCallback((tray: TrayItem) => {
    setTrays((prev) => [...prev, tray]);
  }, []);

  const closeTray = React.useCallback((id?: string) => {
    setTrays((prev) => {
      if (id) {
        const index = prev.findIndex((t) => t.id === id);
        if (index !== -1) {
          const tray = prev[index]!;
          tray.onClose?.();
          return prev.filter((t) => t.id !== id);
        }
      }
      if (prev.length > 0) {
        const lastTray = prev[prev.length - 1]!;
        lastTray.onClose?.();
        return prev.slice(0, -1);
      }
      return prev;
    });
  }, []);

  const closeAll = React.useCallback(() => {
    setTrays((prev) => {
      prev.forEach((tray) => tray.onClose?.());
      return [];
    });
  }, []);

  const navigateBack = React.useCallback(() => {
    setTrays((prev) => {
      if (prev.length > 1) {
        return prev.slice(0, -1);
      }
      return prev;
    });
  }, []);

  return (
    <TrayContext.Provider
      value={{ trays, openTray, closeTray, closeAll, navigateBack }}
    >
      {children}
    </TrayContext.Provider>
  );
}

export function useTrayContext() {
  const context = useContext(TrayContext);
  if (!context) {
    throw new Error("useTrayContext must be used within TrayProvider");
  }
  return context;
}

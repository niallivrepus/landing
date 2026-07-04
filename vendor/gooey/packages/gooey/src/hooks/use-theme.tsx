import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "auto";
type ResolvedTheme = "dark" | "light";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
};

const initialState: ThemeProviderState = {
  theme: "dark",
  resolvedTheme: "dark",
  isDarkMode: true,
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "auto",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  const getSystemTheme = (): ResolvedTheme => {
    if (typeof window === "undefined") return "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const getInitialTheme = (): Theme => {
    if (typeof window === "undefined") return defaultTheme;
    const stored = localStorage.getItem(storageKey);
    if (stored === "dark" || stored === "light" || stored === "auto") {
      return stored as Theme;
    }
    return defaultTheme;
  };

  const getInitialResolvedTheme = (): ResolvedTheme => {
    if (typeof window === "undefined") return "dark";
    const theme = getInitialTheme();
    if (theme === "auto") {
      return getSystemTheme();
    }
    return theme;
  };

  const updateMetaThemeColor = (currentTheme: ResolvedTheme) => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        currentTheme === "dark" ? "#000000" : "#ffffff"
      );
    }
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const initialResolved = getInitialResolvedTheme();
  const [resolvedTheme, setResolvedTheme] =
    useState<ResolvedTheme>(initialResolved);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const root = window.document.documentElement;
    const body = window.document.body;
    root.classList.add(initialResolved);
    root.setAttribute("data-theme", initialResolved);
    updateMetaThemeColor(initialResolved);
    if (body) {
      body.style.backgroundColor =
        initialResolved === "dark" ? "#000000" : "#FFFFFF";
    }
  }, [initialResolved]);

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;

    let resolved: ResolvedTheme;
    if (theme === "auto") {
      resolved = getSystemTheme();
    } else {
      resolved = theme;
    }

    root.classList.remove("light", "dark");
    root.classList.add(resolved);
    root.setAttribute("data-theme", resolved);
    setResolvedTheme(resolved);
    updateMetaThemeColor(resolved);

    if (body) {
      body.style.backgroundColor = resolved === "dark" ? "#000000" : "#FFFFFF";
    }
  }, [theme]);

  useEffect(() => {
    if (theme !== "auto") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const resolved = getSystemTheme();
      const root = window.document.documentElement;
      const body = window.document.body;

      root.classList.remove("light", "dark");
      root.classList.add(resolved);
      root.setAttribute("data-theme", resolved);
      setResolvedTheme(resolved);
      updateMetaThemeColor(resolved);

      if (body) {
        body.style.backgroundColor =
          resolved === "dark" ? "#000000" : "#FFFFFF";
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [theme]);

  const handleSetTheme = React.useCallback(
    (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
    [storageKey]
  );

  const value = {
    theme,
    setTheme: handleSetTheme,
    isDarkMode: resolvedTheme === "dark",
    resolvedTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};

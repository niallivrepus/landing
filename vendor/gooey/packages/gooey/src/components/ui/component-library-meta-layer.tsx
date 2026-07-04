"use client";

import * as React from "react";
import { Link01Icon, Cancel01Icon, Copy01Icon, ArrowLeft01Icon } from "hugeicons-react";
import { PortalContextMenu } from "./portal-context-menu";
import { MenuContextOptionData } from "./menu-context";

// Storage key for navigation history
const NAVIGATION_HISTORY_KEY = "component-library-navigation-history";

// Component metadata registry
export const COMPONENT_REGISTRY = {
  ColorSwatch: {
    id: "color-swatch",
    name: "Color Swatch",
    importPath: "@gooey/components/ui/color-swatch"
  },
  SocialIcons: {
    id: "social-icons",
    name: "Social Icons",
    importPath: "@gooey/components/ui/social-icons"
  },
  Numbers: {
    id: "numbers",
    name: "Numbers",
    importPath: "@gooey/components/ui/numbers"
  },
  MusicTimer: {
    id: "music-timer",
    name: "Music Timer",
    importPath: "@gooey/components/ui/music-timer"
  },
  LocationPoint: {
    id: "location-point",
    name: "Location Point",
    importPath: "@gooey/components/ui/location-point"
  },
  Bad: {
    id: "bad",
    name: "Bad",
    importPath: "@gooey/components/ui/bad"
  },
  SearchIndication: {
    id: "search-indication",
    name: "Search Indication",
    importPath: "@gooey/components/ui/search-indication"
  },
  GlassButton: {
    id: "glass-button",
    name: "Glass Button",
    importPath: "@gooey/components/ui/glass-button"
  },
  Button: {
    id: "button",
    name: "Button",
    importPath: "@gooey/components/ui/button"
  },
  IconOnlyButton: {
    id: "icon-only-button",
    name: "Icon Only Button",
    importPath: "@gooey/components/ui/icon-only-button"
  },
  Input: {
    id: "input",
    name: "Input",
    importPath: "@gooey/components/ui/input"
  },
  Switch: {
    id: "switch",
    name: "Switch",
    importPath: "@gooey/components/ui/switch"
  },
  Skeleton: {
    id: "skeleton",
    name: "Skeleton",
    importPath: "@gooey/components/ui/skeleton"
  },
  Tooltip: {
    id: "tooltip",
    name: "Tooltip",
    importPath: "@gooey/components/ui/tooltip"
  },
  Logo: {
    id: "logo",
    name: "Logo",
    importPath: "@gooey/components/ui/logo"
  },
  OO: {
    id: "oo",
    name: "OO",
    importPath: "@gooey/components/ui/oo"
  },
  Reactions: {
    id: "reactions",
    name: "Reactions",
    importPath: "@gooey/components/ui/reactions"
  },
  Notification: {
    id: "notification",
    name: "Notification",
    importPath: "@gooey/components/ui/notification"
  },
  Crumb: {
    id: "crumb",
    name: "Crumb",
    importPath: "@gooey/components/ui/crumb"
  },
  Soundwave: {
    id: "soundwave",
    name: "Soundwave",
    importPath: "@gooey/components/ui/soundwave"
  },
  AlbumArt: {
    id: "album-art",
    name: "Album Art",
    importPath: "@gooey/components/ui/album-art"
  },
  TrackInfo: {
    id: "track-info",
    name: "Track Info",
    importPath: "@gooey/components/ui/track-info"
  },
  MusicCoverTitle: {
    id: "music-cover-title",
    name: "Music Cover Title",
    importPath: "@gooey/components/ui/music-cover-title"
  },
  MusicControls: {
    id: "music-controls",
    name: "Music Controls",
    importPath: "@gooey/components/ui/music-controls"
  },
  EditBar: {
    id: "edit-bar",
    name: "Edit Bar",
    importPath: "@gooey/components/ui/edit-bar"
  },
  Badge: {
    id: "badge",
    name: "Badge",
    importPath: "@gooey/components/ui/badge"
  },
  ActiveCalls: {
    id: "active-calls",
    name: "Active Calls",
    importPath: "@gooey/components/ui/active-calls"
  },
  RightHandButton: {
    id: "right-hand-button",
    name: "Right Hand Button",
    importPath: "@gooey/components/ui/right-hand-button"
  },
  RightHandMenu: {
    id: "right-hand-menu",
    name: "Right Hand Menu",
    importPath: "@gooey/components/ui/right-hand-menu"
  },
  RecordButton: {
    id: "record-button",
    name: "Record Button",
    importPath: "@gooey/components/ui/record-button"
  },
  ColorOnlyButton: {
    id: "color-only-button",
    name: "Color Only Button",
    importPath: "@gooey/components/ui/color-only-button"
  },
  PlayButton: {
    id: "play-button",
    name: "Play Button",
    importPath: "@gooey/components/ui/play-button"
  },
  ActionCircleButton: {
    id: "action-circle-button",
    name: "Action Circle Button",
    importPath: "@gooey/components/ui/action-circle-button"
  },
} as const;

type ComponentName = keyof typeof COMPONENT_REGISTRY;

interface DetectedComponent {
  name: ComponentName;
  element: HTMLElement;
  isLinked: boolean;
  nestedIn?: ComponentName;
}

// Map data-slot attributes to component names
const SLOT_TO_COMPONENT: Record<string, ComponentName> = {
  "icon-only-button": "IconOnlyButton",
  "reactions": "Reactions",
  "glass-button": "GlassButton",
  "color-swatch": "ColorSwatch",
  "music-timer": "MusicTimer",
  "location-point": "LocationPoint",
  "numbers": "Numbers",
  "bad": "Bad",
  "notification": "Notification",
  "crumb": "Crumb",
  "soundwave": "Soundwave",
  "album-art": "AlbumArt",
  "track-info": "TrackInfo",
  "music-cover-title": "MusicCoverTitle",
  "music-controls": "MusicControls",
  "badge": "Badge",
  "active-calls": "ActiveCalls",
  "right-hand-button": "RightHandButton",
  "right-hand-menu": "RightHandMenu",
  "record-button": "RecordButton",
  "color-only-button": "ColorOnlyButton",
  "play-button": "PlayButton",
};

// Detect which component was clicked by traversing up the DOM
function detectComponent(target: HTMLElement): DetectedComponent | null {
  let current: HTMLElement | null = target;
  let foundComponent: DetectedComponent | null = null;
  let parentComponent: ComponentName | undefined;

  while (current && current !== document.body) {
    // Check for explicit component marking
    const componentName = current.getAttribute("data-component-name");
    const isLinked = current.getAttribute("data-component-linked") === "true";

    if (componentName && componentName in COMPONENT_REGISTRY) {
      if (!foundComponent) {
        foundComponent = {
          name: componentName as ComponentName,
          element: current,
          isLinked,
        };
      } else {
        // This is a parent component
        parentComponent = componentName as ComponentName;
        break;
      }
    }

    // Check for data-slot attribute (used by components)
    const slot = current.getAttribute("data-slot");
    if (slot && SLOT_TO_COMPONENT[slot]) {
      const detectedName = SLOT_TO_COMPONENT[slot];
      if (!foundComponent) {
        foundComponent = {
          name: detectedName,
          element: current,
          isLinked: true,
        };
      } else if (!parentComponent) {
        // This is a parent component
        parentComponent = detectedName;
      }
    }

    current = current.parentElement;
  }

  if (foundComponent && parentComponent) {
    foundComponent.nestedIn = parentComponent;
  }

  return foundComponent;
}

export function ComponentLibraryMetaLayer() {
  const [menuPosition, setMenuPosition] = React.useState<{ x: number; y: number } | null>(null);
  const [detectedComponent, setDetectedComponent] = React.useState<DetectedComponent | null>(null);
  const [hasNavigationHistory, setHasNavigationHistory] = React.useState(false);

  // Check for navigation history on mount and when menu opens
  React.useEffect(() => {
    const checkHistory = () => {
      const history = sessionStorage.getItem(NAVIGATION_HISTORY_KEY);
      setHasNavigationHistory(!!history);
    };

    checkHistory();

    // Also check when storage changes (in case of cross-tab updates)
    window.addEventListener("storage", checkHistory);
    return () => window.removeEventListener("storage", checkHistory);
  }, [menuPosition]);

  React.useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();

      const target = e.target as HTMLElement;
      const component = detectComponent(target);

      setDetectedComponent(component);
      setMenuPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const handleGoToComponent = () => {
    if (!detectedComponent) return;

    const componentMeta = COMPONENT_REGISTRY[detectedComponent.name];
    const elementId = `component-${componentMeta.id}`;

    // Close menu immediately
    setMenuPosition(null);

    // Navigate to components page with hash
    const targetPath = `/components#${elementId}`;
    const currentPath = window.location.pathname + window.location.hash;

    if (currentPath.startsWith("/components")) {
      // Already on components page, just scroll
      // Store current scroll position for back navigation
      const scrollY = window.scrollY;
      sessionStorage.setItem(NAVIGATION_HISTORY_KEY, JSON.stringify({
        path: currentPath,
        scrollY
      }));

      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });

        // Add highlight effect
        element.classList.add("ring-1", "ring-purple-500", "ring-offset-2");
        setTimeout(() => {
          element.classList.remove("ring-1", "ring-purple-500", "ring-offset-2");
        }, 2000);
      }
    } else {
      // Store current location before navigating away
      sessionStorage.setItem(NAVIGATION_HISTORY_KEY, JSON.stringify({
        path: currentPath,
        scrollY: window.scrollY
      }));

      // Navigate to components page, browser will handle hash scroll
      window.location.href = targetPath;
    }
  };

  const handleBack = () => {
    const historyData = sessionStorage.getItem(NAVIGATION_HISTORY_KEY);
    if (!historyData) return;

    try {
      const { path, scrollY } = JSON.parse(historyData);

      // Clear history
      sessionStorage.removeItem(NAVIGATION_HISTORY_KEY);
      setHasNavigationHistory(false);

      // Close menu
      setMenuPosition(null);

      // Navigate back
      if (path.startsWith("/components")) {
        // Same page, just scroll back
        window.location.hash = path.split("#")[1] || "";
        setTimeout(() => {
          window.scrollTo({ top: scrollY, behavior: "smooth" });
        }, 100);
      } else {
        // Different page, navigate back
        window.location.href = path;
      }
    } catch (err) {
      console.error("Failed to parse navigation history:", err);
      sessionStorage.removeItem(NAVIGATION_HISTORY_KEY);
      setHasNavigationHistory(false);
    }
  };

  const handleCopyComponent = async () => {
    if (!detectedComponent) return;

    const componentMeta = COMPONENT_REGISTRY[detectedComponent.name];
    const importStatement = `import { ${detectedComponent.name} } from "${componentMeta.importPath}";`;

    try {
      await navigator.clipboard.writeText(importStatement);
      // You could add a toast notification here if desired
      console.log("Copied import:", importStatement);
    } catch (err) {
      console.error("Failed to copy import:", err);
    }

    setMenuPosition(null);
  };

  const handleClose = () => {
    setMenuPosition(null);
    setDetectedComponent(null);
  };

  // Check if we should show the back button (only on components page with history)
  const showBackButton = hasNavigationHistory && window.location.pathname.startsWith("/components");

  // Build options array based on context
  const options: MenuContextOptionData[] = React.useMemo(() => {
    const opts: MenuContextOptionData[] = [];

    if (detectedComponent) {
      opts.push({
        id: "goto",
        icon: <Link01Icon size={14} />,
        label: "Main component",
        onSelect: handleGoToComponent,
      });
      opts.push({
        id: "copy",
        icon: <Copy01Icon size={14} />,
        label: "Copy component",
        onSelect: handleCopyComponent,
      });
    }

    if (showBackButton) {
      opts.push({
        id: "back",
        icon: <ArrowLeft01Icon size={14} />,
        label: "Back",
        onSelect: handleBack,
      });
    }

    opts.push({
      id: "cancel",
      icon: <Cancel01Icon size={14} />,
      label: "Cancel",
      onSelect: handleClose,
    });

    return opts;
  }, [detectedComponent, showBackButton]);

  return (
    <PortalContextMenu position={menuPosition} onClose={handleClose} options={options} />
  );
}

// Wrapper to mark components for detection
export function MarkComponent({
  children,
  name,
  isLinked = true,
}: {
  children: React.ReactNode;
  name: ComponentName;
  isLinked?: boolean;
}) {
  return (
    <div
      data-component-name={name}
      data-component-linked={isLinked}
      style={{ display: "contents" }}
    >
      {children}
    </div>
  );
}

"use client";

import * as React from "react";
import { Link01Icon, Cancel01Icon } from "hugeicons-react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
} from "./context-menu";

// Component metadata registry - maps component names to their showcase locations
export const COMPONENT_REGISTRY = {
  // Assets
  ColorSwatch: { category: "assets", id: "color-swatch", name: "Color Swatch" },
  SocialIcons: { category: "assets", id: "social-icons", name: "Social Icons" },
  Numbers: { category: "assets", id: "numbers", name: "Numbers" },
  MusicTimer: { category: "assets", id: "music-timer", name: "Music Timer" },
  LocationPoint: { category: "assets", id: "location-point", name: "Location Point" },
  Bad: { category: "assets", id: "bad", name: "Bad" },
  SearchIndication: { category: "assets", id: "search-indication", name: "Search Indication" },

  // Buttons
  GlassButton: { category: "buttons", id: "glass-button", name: "Glass Button" },
  Button: { category: "buttons", id: "button", name: "Button" },

  // Forms
  Input: { category: "forms", id: "input", name: "Input" },
  Switch: { category: "forms", id: "switch", name: "Switch" },

  // Feedback
  Skeleton: { category: "feedback", id: "skeleton", name: "Skeleton" },
  Tooltip: { category: "feedback", id: "tooltip", name: "Tooltip" },

  // Brand
  Logo: { category: "brand", id: "logo", name: "Logo" },
  OO: { category: "brand", id: "oo", name: "OO" },
} as const;

interface ComponentLibraryContextMenuProps {
  children: React.ReactNode;
  componentName?: keyof typeof COMPONENT_REGISTRY;
  isLinked?: boolean;
  customLabel?: string;
}

export function ComponentLibraryContextMenu({
  children,
  componentName,
  isLinked = true,
  customLabel,
}: ComponentLibraryContextMenuProps) {
  const isComponentsPage =
    typeof window !== "undefined" &&
    window.location.pathname === "/components";

  const componentMeta = componentName ? COMPONENT_REGISTRY[componentName] : null;
  const displayName = customLabel || componentMeta?.name || "Component";

  const handleGoToComponent = () => {
    if (!componentMeta) return;

    // Construct the element ID for the component showcase
    const elementId = `component-${componentMeta.id}`;
    const element = document.getElementById(elementId);

    if (element) {
      // Smooth scroll to the component
      element.scrollIntoView({ behavior: "smooth", block: "center" });

      // Add a brief highlight effect
      element.classList.add("ring-2", "ring-purple-500", "ring-offset-2");
      setTimeout(() => {
        element.classList.remove("ring-2", "ring-purple-500", "ring-offset-2");
      }, 2000);
    }
  };

  // Only enable context menu on /components page
  if (!isComponentsPage) {
    return <>{children}</>;
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <span style={{ display: "contents" }}>
          {children}
        </span>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56" style={{ zIndex: 9999 }}>
        <ContextMenuLabel className="flex items-center gap-2">
          {isLinked && <Link01Icon size={14} className="text-purple-500" />}
          <span className="font-medium">{displayName}</span>
        </ContextMenuLabel>
        <ContextMenuLabel className="text-xs text-text-secondary font-normal">
          {isLinked ? "Linked component" : "Standalone component"}
        </ContextMenuLabel>

        {componentMeta && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={handleGoToComponent}>
              <Link01Icon size={16} />
              Go to main component
            </ContextMenuItem>
          </>
        )}

        <ContextMenuSeparator />
        <ContextMenuItem>
          <Cancel01Icon size={16} />
          Cancel
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

// Wrapper component for easy use in component library
export function LibraryComponent({
  children,
  name,
  isLinked = true,
}: {
  children: React.ReactNode;
  name?: keyof typeof COMPONENT_REGISTRY;
  isLinked?: boolean;
}) {
  // Only wrap with context menu if component name is provided
  if (!name) {
    return <>{children}</>;
  }

  return (
    <ComponentLibraryContextMenu componentName={name} isLinked={isLinked}>
      {children}
    </ComponentLibraryContextMenu>
  );
}

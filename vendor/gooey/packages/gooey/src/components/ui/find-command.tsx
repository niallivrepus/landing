"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CalendarDays,
  CircleHelp,
  Cog,
  FileText,
  Image,
  MessageCircle,
  Search,
  Shield,
  Smile,
  User,
  WalletCards,
} from "lucide-react";

import { useShouldAnimate } from "../../hooks/use-reduced-motion";
import { cn } from "../../lib/utils";

export interface FindCommandItem {
  id: string;
  label: string;
  description?: string;
  shortcut?: string;
  keywords?: string[];
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface FindCommandGroup {
  id: string;
  heading: string;
  icon?: React.ComponentType<{ className?: string }>;
  items: FindCommandItem[];
}

export interface FindCommandProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  groups?: FindCommandGroup[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (item: FindCommandItem) => void;
  enableShortcut?: boolean;
  showTrigger?: boolean;
  placeholder?: string;
  emptyLabel?: string;
  triggerLabel?: string;
  shortcutLabel?: string;
  overlayClassName?: string;
  panelClassName?: string;
}

export const FIND_COMMAND_GROUPS: FindCommandGroup[] = [
  {
    id: "suggestions",
    heading: "suggestions",
    icon: ArrowRight,
    items: [
      {
        id: "calendar",
        label: "calendar",
        description: "open schedule and upcoming moments",
        icon: <CalendarDays aria-hidden="true" className="size-4" />,
      },
      {
        id: "search-emoji",
        label: "search emoji",
        description: "find symbols for messages and modules",
        icon: <Smile aria-hidden="true" className="size-4" />,
      },
      {
        id: "calculator",
        label: "calculator",
        description: "run quick math without leaving the surface",
        icon: <Calculator aria-hidden="true" className="size-4" />,
      },
      {
        id: "documents",
        label: "documents",
        description: "jump into saved files and shared notes",
        icon: <FileText aria-hidden="true" className="size-4" />,
      },
      {
        id: "images",
        label: "images",
        description: "search generated and uploaded visuals",
        icon: <Image aria-hidden="true" className="size-4" />,
      },
      {
        id: "messages",
        label: "messages",
        description: "move directly into recent conversations",
        icon: <MessageCircle aria-hidden="true" className="size-4" />,
      },
    ],
  },
  {
    id: "settings",
    heading: "settings",
    icon: Cog,
    items: [
      {
        id: "profile",
        label: "profile",
        description: "edit identity and presence",
        shortcut: "⌘p",
        icon: <User aria-hidden="true" className="size-4" />,
      },
      {
        id: "billing",
        label: "billing",
        description: "manage plan, usage, and payment state",
        shortcut: "⌘b",
        icon: <WalletCards aria-hidden="true" className="size-4" />,
      },
      {
        id: "settings",
        label: "settings",
        description: "adjust platform preferences",
        shortcut: "⌘,",
        icon: <Cog aria-hidden="true" className="size-4" />,
      },
      {
        id: "security",
        label: "security",
        description: "review account protection and sessions",
        shortcut: "⌘t",
        icon: <Shield aria-hidden="true" className="size-4" />,
      },
    ],
  },
  {
    id: "help",
    heading: "help",
    icon: CircleHelp,
    items: [
      {
        id: "help-center",
        label: "help center",
        description: "search practical answers and workflows",
        icon: <CircleHelp aria-hidden="true" className="size-4" />,
      },
      {
        id: "documentation",
        label: "documentation",
        description: "open product and developer references",
        icon: <BookOpen aria-hidden="true" className="size-4" />,
      },
    ],
  },
];

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
}

function itemMatches(item: FindCommandItem, query: string) {
  if (!query) {
    return true;
  }

  const haystack = [item.label, item.description, item.shortcut, ...(item.keywords ?? [])].filter(Boolean).join(" ").toLowerCase();
  return haystack.includes(query);
}

function flattenGroups(groups: FindCommandGroup[]) {
  return groups.flatMap((group) => group.items.filter((item) => !item.disabled));
}

export function FindCommand({
  groups = FIND_COMMAND_GROUPS,
  open,
  defaultOpen = false,
  onOpenChange,
  onSelect,
  enableShortcut = true,
  showTrigger = true,
  placeholder = "find anything",
  emptyLabel = "nothing found",
  triggerLabel = "find",
  shortcutLabel = "⌘k",
  overlayClassName,
  panelClassName,
  className,
  ...props
}: FindCommandProps) {
  const shouldAnimate = useShouldAnimate();
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const isOpen = isControlled ? open : internalOpen;

  const filteredGroups = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => itemMatches(item, normalizedQuery)),
      }))
      .filter((group) => group.items.length > 0);
  }, [groups, query]);

  const visibleItems = React.useMemo(() => flattenGroups(filteredGroups), [filteredGroups]);
  const activeItem = visibleItems[activeIndex] ?? null;
  const panelId = React.useId();

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);

      if (!nextOpen) {
        setQuery("");
        setActiveIndex(0);
      }
    },
    [isControlled, onOpenChange],
  );

  const chooseItem = React.useCallback(
    (item: FindCommandItem | null) => {
      if (!item || item.disabled) {
        return;
      }

      onSelect?.(item);
      setOpen(false);
    },
    [onSelect, setOpen],
  );

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (activeIndex > Math.max(visibleItems.length - 1, 0)) {
      setActiveIndex(0);
    }
  }, [activeIndex, visibleItems.length]);

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [isOpen]);

  React.useEffect(() => {
    if (!enableShortcut) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const isCommandK = event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey);

      if (isCommandK) {
        event.preventDefault();
        setOpen(!isOpen);
        return;
      }

      if (event.key === "Escape" && isOpen) {
        event.preventDefault();
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableShortcut, isOpen, setOpen]);

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((current) => (visibleItems.length ? (current + 1) % visibleItems.length : 0));
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((current) => (visibleItems.length ? (current - 1 + visibleItems.length) % visibleItems.length : 0));
      }

      if (event.key === "Enter" && !isTypingTarget(event.target)) {
        event.preventDefault();
        chooseItem(activeItem);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeItem, chooseItem, isOpen, visibleItems.length]);

  const overlay = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={cn(
            "fixed inset-0 z-[90] flex items-center justify-center bg-black/28 px-4 backdrop-blur-xl dark:bg-black/48",
            overlayClassName,
          )}
          initial={shouldAnimate ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldAnimate ? 0.16 : 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <motion.div
            layoutId="find-command-wrapper"
            role="dialog"
            aria-modal="true"
            aria-label="find"
            className={cn(
              "relative flex max-h-[min(680px,calc(100vh-32px))] w-full max-w-[640px] flex-col overflow-hidden rounded-[24px]",
              "border border-black/10 bg-white/92 text-black shadow-[0_24px_90px_rgba(0,0,0,0.22)] backdrop-blur-2xl",
              "dark:border-white/12 dark:bg-[#090909]/92 dark:text-white dark:shadow-[0_24px_90px_rgba(0,0,0,0.5)]",
              panelClassName,
            )}
            initial={shouldAnimate ? { opacity: 0, y: 16, scale: 0.98 } : false}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
          >
            <div className="flex h-14 items-center gap-3 border-b border-black/8 px-4 dark:border-white/10">
              <motion.span layoutId="find-command-icon" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-black/[0.04] text-black/55 dark:bg-white/[0.07] dark:text-white/60">
                <Search aria-hidden="true" className="size-4" />
              </motion.span>
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    chooseItem(activeItem);
                  }
                }}
                placeholder={placeholder}
                aria-controls={panelId}
                aria-activedescendant={activeItem ? `${panelId}-${activeItem.id}` : undefined}
                className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-black outline-none placeholder:text-black/35 dark:text-white dark:placeholder:text-white/32"
              />
              <kbd className="flex h-7 shrink-0 items-center rounded-md border border-black/10 bg-black/[0.03] px-2 text-xs text-black/45 dark:border-white/12 dark:bg-white/[0.05] dark:text-white/45">
                esc
              </kbd>
            </div>

            <div id={panelId} role="listbox" aria-label="find results" className="max-h-[520px] overflow-y-auto p-2">
              {filteredGroups.length === 0 ? (
                <div className="flex h-32 items-center justify-center text-sm text-black/40 dark:text-white/35">{emptyLabel}</div>
              ) : (
                filteredGroups.map((group) => {
                  const GroupIcon = group.icon;

                  return (
                    <section key={group.id} className="py-2">
                      <div className="flex h-8 items-center gap-2 px-3 text-xs text-black/40 dark:text-white/35">
                        {GroupIcon && <GroupIcon aria-hidden="true" className="size-3.5" />}
                        <span>{group.heading}</span>
                      </div>
                      <div className="space-y-1">
                        {group.items.map((item) => {
                          const itemIndex = visibleItems.findIndex((visibleItem) => visibleItem.id === item.id);
                          const selected = itemIndex === activeIndex;

                          return (
                            <button
                              key={item.id}
                              id={`${panelId}-${item.id}`}
                              type="button"
                              role="option"
                              aria-selected={selected}
                              disabled={item.disabled}
                              onMouseEnter={() => setActiveIndex(itemIndex)}
                              onClick={() => chooseItem(item)}
                              className={cn(
                                "flex min-h-12 w-full items-center gap-3 rounded-2xl px-3 text-left outline-none transition-colors",
                                "disabled:cursor-not-allowed disabled:opacity-40",
                                selected
                                  ? "bg-black/[0.07] text-black dark:bg-white/[0.1] dark:text-white"
                                  : "text-black/72 hover:bg-black/[0.045] dark:text-white/70 dark:hover:bg-white/[0.07]",
                              )}
                            >
                              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-black/[0.045] text-black/55 dark:bg-white/[0.07] dark:text-white/55">
                                {item.icon ?? <ArrowRight aria-hidden="true" className="size-4" />}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm">{item.label}</span>
                                {item.description && <span className="block truncate text-xs text-black/38 dark:text-white/34">{item.description}</span>}
                              </span>
                              {item.shortcut && (
                                <kbd className="flex h-6 shrink-0 items-center rounded-md border border-black/10 px-1.5 text-[11px] text-black/38 dark:border-white/12 dark:text-white/38">
                                  {item.shortcut}
                                </kbd>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  );
                })
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <MotionConfig transition={{ type: "spring", stiffness: 450, damping: 25, mass: 0.1 }}>
      <div className={cn("relative inline-flex", className)} {...props}>
        {showTrigger && (
          <motion.button
            layoutId="find-command-wrapper"
            type="button"
            onClick={() => setOpen(!isOpen)}
            className={cn(
              "group flex h-9 w-[208px] items-center rounded-xl border border-black/10 bg-white/70 text-black/55 shadow-sm backdrop-blur-xl transition-colors",
              "hover:border-black/18 hover:bg-white/85 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20",
              "dark:border-white/12 dark:bg-white/[0.06] dark:text-white/55 dark:hover:border-white/20 dark:hover:bg-white/[0.08] dark:focus-visible:ring-white/22",
            )}
          >
            <span className="flex size-9 items-center justify-center">
              <motion.span layoutId="find-command-icon">
                <Search aria-hidden="true" className="size-4" />
              </motion.span>
            </span>
            <span className="min-w-0 flex-1 truncate text-left text-sm">{triggerLabel}</span>
            <span className="flex h-9 items-center justify-center pr-2">
              <kbd className="flex h-6 items-center rounded-md border border-black/10 px-1.5 text-xs text-black/38 dark:border-white/12 dark:text-white/38">
                {shortcutLabel}
              </kbd>
            </span>
          </motion.button>
        )}
        {mounted ? createPortal(overlay, document.body) : overlay}
      </div>
    </MotionConfig>
  );
}

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight as ArrowRight01Icon,
  Box as CubeIcon,
  Check as Tick01Icon,
  ChevronDown as ArrowDown01Icon,
  CircleHelp as MessageQuestionIcon,
  Clapperboard as ClapperboardIcon,
  File as File01Icon,
  FileText as DocumentAttachmentIcon,
  Globe as GlobeIcon,
  Brain as BrainIcon,
  Image as Image01Icon,
  KeyRound as LockPasswordIcon,
  Library as LibraryIcon,
  Link as Link01Icon,
  MapPin as Location01Icon,
  Mic as Mic01Icon,
  Music2 as MusicIcon,
  PanelTop as BrowserIcon,
  PlugZap as PlugSocketIcon,
  Plus as Add01Icon,
  Quote as QuoteUpIcon,
  Settings as Settings01Icon,
  Share2 as Share01Icon,
  Sparkles as SparklesIcon,
  Target as Target01Icon,
  User as UserIcon,
  WandSparkles as WandSparklesIcon,
  X as Cancel01Icon,
  Zap as ZapIcon,
} from "lucide-react";

import { cn } from "../../lib/utils";
import {
  getResponsiveWidthClass,
  isCompactViewport,
  type GooeyViewportInput,
  useGooeyViewport,
} from "../../lib/viewport";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import { ColorOnlyButton } from "./color-only-button";
import { GooeyGlass } from "./gooey-glass";
import { IconOnlyButton } from "./icon-only-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { PasswordSafety } from "./password-safety";
import { PlayButton } from "./play-button";
import { SocialButton } from "./social-icons";
import { SpecialButton } from "./special-button";
import { Splex } from "./splex";
import { VoiceMemoSimulation } from "./voice-memo";
import { MediumTag } from "./medium-tag";

type UsernameState = "idle" | "typing" | "available" | "taken" | "neutral" | "success";

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"]);

function getFileTypeIcon(extension: string) {
  return IMAGE_EXTENSIONS.has(extension.toLowerCase()) ? Image01Icon : File01Icon;
}

function PromptBarCommandLibraryButton({
  onClick,
  className,
}: {
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconOnlyButton
          size="small"
          className={cn("size-[42px] shrink-0", className)}
          aria-label="command library"
          icon={<LibraryIcon size={20} strokeWidth={1.8} />}
          onClick={onClick}
        />
      </TooltipTrigger>
      <TooltipContent side="left" sideOffset={8}>
        command library
      </TooltipContent>
    </Tooltip>
  );
}

function PromptBarPlusButton({
  onClick,
  open = false,
  className,
}: {
  onClick?: () => void;
  open?: boolean;
  className?: string;
}) {
  return (
    <IconOnlyButton
      size="small"
      className={cn("size-[42px]", className)}
      aria-label={open ? "close attachments" : "add attachment"}
      aria-expanded={open}
      icon={
        <span
          className="inline-flex transition-transform duration-200 ease-out"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          <Add01Icon size={20} strokeWidth={1.8} />
        </span>
      }
      onClick={onClick}
    />
  );
}

/** Lazily-created offscreen canvas for measuring character widths */
let measureCanvas: HTMLCanvasElement | null = null;

function getCharWidths(text: string): number[] {
  if (!text) return [];
  if (!measureCanvas) measureCanvas = document.createElement("canvas");
  const ctx = measureCanvas.getContext("2d")!;
  ctx.font = '400 16px "Satoshi", sans-serif';
  return Array.from(text).map((ch) => ctx.measureText(ch).width);
}

/** Shape config for cycling slime mask variants */
const SLIME_SHAPES = [
  { w: 6, h: 6, radius: "5px" },         // rounded square
  { w: 6, h: 4, radius: "5px" },         // wide pill
  { w: 4, h: 6, radius: "5px" },         // tall pill
  { w: 8, h: 8, radius: undefined },     // triangle (uses clip-path)
  { w: 6, h: 6, radius: "50%" },         // circle
] as const;

const SLIME_GRADIENT = "linear-gradient(82deg, #77FF00, #D8FF3D)";
const SLIME_SHADOW = "none";

function SlimeMask({ value }: { value: string }) {
  const widths = getCharWidths(value);
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center" style={{ zIndex: 1 }}>
      {widths.map((charW, i) => {
        const shape = SLIME_SHAPES[i % 5]!;
        const isTriangle = i % 5 === 3;
        return (
          <div
            key={i}
            className="flex items-center justify-center shrink-0"
            style={{ width: charW }}
          >
            <div
              style={{
                width: shape.w,
                height: shape.h,
                background: SLIME_GRADIENT,
                boxShadow: SLIME_SHADOW,
                borderRadius: isTriangle ? undefined : shape.radius,
                clipPath: isTriangle ? "polygon(50% 0%, 100% 100%, 0% 100%)" : undefined,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

function RotatingPlaceholderSuggestions({ suggestions }: { suggestions: string[] }) {
  const [index, setIndex] = React.useState(0);
  const safe = suggestions.filter(Boolean);
  const text = safe[index] ?? "";

  React.useEffect(() => {
    if (safe.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((n) => (n + 1) % safe.length);
    }, 3600);
    return () => window.clearInterval(id);
  }, [safe.length]);

  return (
    <span
      className="relative block min-h-[1.4em] min-w-0 flex-1 overflow-hidden"
      aria-live="polite"
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={`${index}-${text}`}
          initial={{ y: "75%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-75%", opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 top-0 flex h-[1.4em] items-center truncate font-sans text-base font-normal leading-[1.4] text-light-space"
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

interface PromptBarProps {
  variant?: "desktop" | "phone";
  viewport?: GooeyViewportInput;
  isDesktop?: boolean;
  placeholder?: string;
  /** When set (2+ strings), idle state cycles these vertically instead of static `placeholder`. */
  placeholderSuggestions?: string[];
  isFocused?: boolean;
  isRecording?: boolean;
  isTyping?: boolean;
  isExpanded?: boolean;
  isProcessing?: boolean;
  usernameState?: UsernameState;
  passwordStrength?: 1 | 2 | 3 | 4 | 5;
  editProfile?: boolean;
  socialPlatform?: string;
  socialIcon?: React.ReactNode;
  isPasswordVisible?: boolean;
  onTogglePasswordVisibility?: () => void;
  value?: string;
  onValueChange?: (value: string) => void;
  onLibrary?: () => void;
  onMic?: () => void;
  onPlus?: () => void;
  isSplexOpen?: boolean;
  onSend?: () => void;
  onCancel?: () => void;
  onStop?: () => void;
  deepThinking?: boolean;
  onDeepThinkingChange?: (enabled: boolean) => void;
  phoneCountry?: string;
  onPhoneCountryChange?: (code: string) => void;
  attachedFiles?: Array<{
    id?: string;
    name: string;
    extension: string;
    previewUrl?: string;
  }>;
  selectedMentions?: Array<{
    id?: string;
    name: string;
    avatarSrc?: string;
    originColor?: "fruta" | "flame" | "solar" | "life" | "aether" | "insight" | "spirit";
    showOO?: boolean;
  }>;
  onMentionSelect?: (name: string) => void;
  onAttachmentRemove?: (id: string) => void;
  mentionSuggestions?: PromptTagSuggestion[];
  activeInlineTags?: PromptTagSuggestion[];
  activePromptTools?: PromptToolBadge[];
  onPromptToolToggle?: (toolId: PromptToolBadgeId) => void;
  activeGenerationCommand?: GenerationCommandId;
  generationModel?: GenerationModelOption;
  generationModelOptions?: GenerationModelOption[];
  onGenerationModelChange?: (modelId: string) => void;
  activeLlmModel?: LlmModelOption;
  llmModelOptions?: LlmModelOption[];
  onLlmModelChange?: (modelId: string) => void;
  commandList?: Array<{
    id: string;
    label: string;
    description: string;
    icon: React.ReactNode;
    group?: string;
    meta?: string;
  }>;
  className?: string;
  /** Marketing hero: no mic/plus; 42×42 send control (black / white arrow; inverted in `.light`). */
  heroSendOnly?: boolean;
}

type TranscriptPhase = "idle" | "recording" | "transcribing";
type PromptAttachment = NonNullable<PromptBarProps["attachedFiles"]>[number];
type PromptMention = NonNullable<PromptBarProps["selectedMentions"]>[number];
type PromptCommand = NonNullable<PromptBarProps["commandList"]>[number];
type GenerationCommandId = "imagine" | "animate" | "video";

type PromptTagCategory = "pods" | "apps" | "files";
type PromptToolBadgeId = "web" | "google" | "deepmind" | "llm";
type PromptToolStateMap = Record<PromptToolBadgeId, { present: boolean; active: boolean }>;

interface PromptMentionSuggestion {
  id?: string;
  name: string;
  avatarSrc?: string;
  originColor?: "fruta" | "flame" | "solar" | "life" | "aether" | "insight" | "spirit";
  showOO?: boolean;
}

interface PromptTagSuggestion extends PromptMentionSuggestion {
  category?: PromptTagCategory;
  description?: string;
  icon?: React.ReactNode;
  trigger?: string;
}

interface GenerationModelOption {
  id: string;
  brand: string;
  version: string;
}

interface LlmModelOption {
  id: string;
  brand: string;
  version: string;
}

interface PromptToolBadge {
  id: PromptToolBadgeId;
  label: string;
  description: string;
  active: boolean;
  icon: React.ReactNode;
}

const LIKTIR_FILL =
  "linear-gradient(180deg, var(--color-liktir-1) 0%, var(--color-liktir-2) 16%, var(--color-liktir-3) 32%, var(--color-liktir-4) 51.5%, var(--color-liktir-5) 72%, var(--color-liktir-6) 100%)";

const PROMPT_GLASS_STYLE: React.CSSProperties = {
  backgroundColor: "var(--prompt-glass-surface, var(--color-light-glass-5))",
  border: "var(--prompt-glass-border, 1px solid var(--color-light-glass-20))",
  boxShadow: "var(--prompt-glass-shadow, 0px 1px 4px 0px rgba(0, 0, 0, 0.1))",
};

const PROMPT_GLASS_LENS = {
  width: 450,
  height: 50,
  borderRadius: 999,
  scale: 14,
  depth: 1.3,
  curvature: 2.55,
  splay: 1,
  chroma: 0.16,
  glow: 0.2,
  edgeHighlight: 0.42,
};

const PROMPT_EXPANDED_GLASS_LENS = {
  ...PROMPT_GLASS_LENS,
  height: 156,
  borderRadius: 25,
  scale: 12,
  curvature: 2.42,
  splay: 0.92,
};

// the recording "+→×" spin: a soft, gentle spring that overshoots a touch on
// the way to 45° (and unwinds on exit when the layout is inside AnimatePresence).
const RECORDING_X_SPRING = { type: "spring" as const, stiffness: 360, damping: 14, mass: 0.8 };

function PromptGlassFrame({
  children,
  className,
  contentClassName,
  style,
  lens,
}: {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  style?: React.CSSProperties;
  lens?: Partial<typeof PROMPT_GLASS_LENS>;
}) {
  // the glass lens is generated for a fixed size — when the frame grows (a
  // multi-line draft), measure the real height so the refraction scales with it.
  const frameRef = React.useRef<HTMLDivElement>(null);
  const [measuredHeight, setMeasuredHeight] = React.useState<number | undefined>(undefined);

  React.useLayoutEffect(() => {
    const node = frameRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const update = () => setMeasuredHeight(Math.round(node.getBoundingClientRect().height));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <GooeyGlass
      ref={frameRef}
      data-slot="prompt-frame"
      className={cn(className)}
      contentClassName={cn("relative z-0 flex size-full", contentClassName)}
      filterContent={false}
      lens={{ ...PROMPT_GLASS_LENS, ...lens, ...(measuredHeight ? { height: measuredHeight } : {}) }}
      style={{ ...PROMPT_GLASS_STYLE, ...style }}
    >
      {children}
    </GooeyGlass>
  );
}

function PromptFloatingPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <GooeyGlass
      className={cn(
        "absolute inset-x-0 bottom-[58px] z-40 max-h-[320px] overflow-hidden rounded-[24px] border border-[var(--app-surface-border)] bg-[var(--app-surface)] p-1 shadow-[var(--app-surface-shadow)]",
        className,
      )}
      contentClassName="relative z-0"
      filterContent={false}
      lens={{ width: 450, height: 320, borderRadius: 24, scale: 10, depth: 1.18, curvature: 2.35, chroma: 0.12, glow: 0.18, edgeHighlight: 0.38 }}
    >
      {children}
    </GooeyGlass>
  );
}

function PromptSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pb-1 pt-2 font-sans text-xs font-normal leading-none text-light-space/50">
      {children}
    </div>
  );
}

function GenerationModelSelector({
  command,
  selected,
  options,
  onSelect,
}: {
  command?: GenerationCommandId;
  selected?: GenerationModelOption;
  options?: GenerationModelOption[];
  onSelect?: (modelId: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && rootRef.current?.contains(target)) return;
      setOpen(false);
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  if (!command || !selected || !options?.length) return null;

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-label={`select ${command} model`}
        aria-expanded={open}
        className="flex h-9 max-w-[168px] items-center gap-2 rounded-full border border-[var(--color-light-glass-20)] bg-[var(--color-light-glass-5)] px-3 font-sans text-sm leading-none text-light-space shadow-none transition-colors hover:bg-[var(--color-light-glass-10)] active:bg-[var(--color-light-glass-20)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-light-space"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="min-w-0 truncate font-semibold">{selected.brand}</span>
        <span className="shrink-0 text-light-space/55">{selected.version}</span>
        <ArrowDown01Icon size={16} strokeWidth={1.8} className="shrink-0 text-light-space/65" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-[44px] right-0 z-50 w-[256px]"
          >
            <GooeyGlass
              className="overflow-hidden rounded-[20px] border border-[var(--app-surface-border)] bg-[var(--app-surface)] p-1 shadow-[var(--app-surface-shadow)]"
              contentClassName="relative z-0"
              filterContent={false}
              lens={{ width: 256, height: 320, borderRadius: 20, scale: 10, depth: 1.14, curvature: 2.3, chroma: 0.12, glow: 0.18, edgeHighlight: 0.38 }}
            >
              <div className="px-3 pb-1 pt-2 font-sans text-xs leading-none text-light-space/50">
                {command} model
              </div>
              <div className="max-h-[280px] overflow-y-auto">
                {options.map((option) => {
                  const active = option.id === selected.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={cn(
                        "flex h-10 w-full items-center gap-3 rounded-[16px] px-3 text-left transition-colors hover:bg-light-space/10 active:bg-light-space/15 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-light-space",
                        active && "bg-light-space/10",
                      )}
                      onClick={() => {
                        onSelect?.(option.id);
                        setOpen(false);
                      }}
                    >
                      <span className="min-w-0 flex-1 truncate font-sans text-sm font-semibold leading-none text-light-space">
                        {option.brand}
                      </span>
                      <span className="shrink-0 font-sans text-sm font-normal leading-none text-light-space/55">
                        {option.version}
                      </span>
                    </button>
                  );
                })}
              </div>
            </GooeyGlass>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LlmModelSelector({
  selected,
  options,
  onSelect,
}: {
  selected?: LlmModelOption;
  options?: LlmModelOption[];
  onSelect?: (modelId: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && rootRef.current?.contains(target)) return;
      setOpen(false);
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  if (!selected || !options?.length) return null;

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-label="select llm model"
        aria-expanded={open}
        className="flex h-9 max-w-[176px] items-center gap-2 rounded-full border border-[var(--color-light-glass-20)] bg-[var(--color-light-glass-5)] px-3 font-sans text-sm leading-none text-light-space shadow-none transition-colors hover:bg-[var(--color-light-glass-10)] active:bg-[var(--color-light-glass-20)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-light-space"
        onClick={() => setOpen((current) => !current)}
      >
        <CubeIcon size={16} strokeWidth={1.8} className="shrink-0 text-light-space/70" />
        <span className="min-w-0 truncate font-semibold">{selected.brand}</span>
        <span className="shrink-0 text-light-space/55">{selected.version}</span>
        <ArrowDown01Icon size={16} strokeWidth={1.8} className="shrink-0 text-light-space/65" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-[44px] left-0 z-50 w-[264px]"
          >
            <GooeyGlass
              className="overflow-hidden rounded-[20px] border border-[var(--app-surface-border)] bg-[var(--app-surface)] p-1 shadow-[var(--app-surface-shadow)]"
              contentClassName="relative z-0"
              filterContent={false}
              lens={{ width: 264, height: 280, borderRadius: 20, scale: 10, depth: 1.14, curvature: 2.3, chroma: 0.12, glow: 0.18, edgeHighlight: 0.38 }}
            >
              <div className="px-3 pb-1 pt-2 font-sans text-xs leading-none text-light-space/50">
                llm model
              </div>
              <div className="max-h-[240px] overflow-y-auto">
                {options.map((option) => {
                  const active = option.id === selected.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={cn(
                        "flex h-10 w-full items-center gap-3 rounded-[16px] px-3 text-left transition-colors hover:bg-light-space/10 active:bg-light-space/15 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-light-space",
                        active && "bg-light-space/10",
                      )}
                      onClick={() => {
                        onSelect?.(option.id);
                        setOpen(false);
                      }}
                    >
                      <span className="min-w-0 flex-1 truncate font-sans text-sm font-semibold leading-none text-light-space">
                        {option.brand}
                      </span>
                      <span className="shrink-0 font-sans text-sm font-normal leading-none text-light-space/55">
                        {option.version}
                      </span>
                    </button>
                  );
                })}
              </div>
            </GooeyGlass>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PromptToolBadgeButton({
  tool,
  onToggle,
}: {
  tool: PromptToolBadge;
  onToggle?: (toolId: PromptToolBadgeId) => void;
}) {
  return (
    <motion.button
      layout
      type="button"
      aria-label={`${tool.label} ${tool.active ? "on" : "off"}`}
      aria-pressed={tool.active}
      initial={{ opacity: 0, scale: 0.82, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.82, y: 8 }}
      transition={{ type: "spring", bounce: 0.32, duration: 0.34 }}
      onClick={() => onToggle?.(tool.id)}
      className={cn(
        "group flex h-9 w-fit items-center gap-2 rounded-[14px] border p-1 pr-3 text-light-space shadow-none backdrop-blur-[20px] transition-colors active:scale-[0.98] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-light-space",
        tool.active
          ? "border-[var(--color-blue-3)] bg-[var(--color-blue-4)] text-white hover:text-white focus-visible:outline-[var(--color-blue-4)]"
          : "border-[var(--color-light-glass-20)] bg-[var(--color-light-glass-5)] text-light-space/62 hover:bg-[var(--color-light-glass-10)] hover:text-light-space",
      )}
    >
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-[10px] border transition-colors",
          tool.active
            ? "border-white/15 bg-white/18 text-white"
            : "border-[var(--color-light-glass-20)] bg-[var(--color-dark-glass-5)] text-light-space/62",
        )}
      >
        <motion.span
          className="inline-flex"
          animate={{ rotate: tool.id === "web" && tool.active ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
        >
          {tool.icon}
        </motion.span>
      </span>
      <span className="font-sans text-sm font-semibold leading-none">{tool.label}</span>
      <span className="sr-only">{tool.description}</span>
    </motion.button>
  );
}

function PromptToolBadgeRow({
  tools,
  onToggle,
}: {
  tools?: PromptToolBadge[];
  onToggle?: (toolId: PromptToolBadgeId) => void;
}) {
  if (!tools?.length) return null;
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <AnimatePresence mode="popLayout">
        {tools.map((tool) => (
          <PromptToolBadgeButton key={tool.id} tool={tool} onToggle={onToggle} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function PromptTagIcon({ item }: { item: PromptTagSuggestion }) {
  if (!item.category) {
    return (
      <Avatar
        size="mini"
        src={item.avatarSrc}
        borderStyle="origins"
        originColor={item.originColor ?? "aether"}
        disableNavigation
        showOO={item.showOO}
        ooExpression="default"
      />
    );
  }

  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-light-glass-20)] bg-[var(--color-light-glass-5)] text-light-space">
      {item.icon}
    </span>
  );
}

function PromptTagRow({
  item,
  active,
  onSelect,
}: {
  item: PromptTagSuggestion;
  active?: boolean;
  onSelect?: (name: string) => void;
}) {
  return (
    <button
      key={`${item.category ?? "person"}-${item.name}`}
      type="button"
      className={cn(
        "flex h-10 w-full items-center gap-2 rounded-[16px] px-3 text-left transition-colors hover:bg-light-space/10 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-light-space",
        active && "bg-light-space/10",
      )}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => onSelect?.(item.name)}
    >
      <PromptTagIcon item={item} />
      <span className="min-w-0 flex-1 truncate font-sans text-base font-normal leading-none text-light-space">
        {item.name}
      </span>
      {item.description && (
        <span className="shrink-0 font-sans text-sm font-normal leading-none text-light-space/50">
          {item.description}
        </span>
      )}
    </button>
  );
}

function PromptInlineTagChip({ item, index }: { item: PromptTagSuggestion; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.82, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.82, y: 8 }}
      transition={{ type: "spring", bounce: 0.34, duration: 0.36 }}
      className="flex h-9 w-fit items-center gap-2 rounded-[14px] border border-[var(--color-light-glass-20)] bg-[var(--color-light-glass-5)] p-1 pr-3 text-light-space shadow-none backdrop-blur-[20px]"
    >
      <span className="flex size-7 shrink-0 items-center justify-center rounded-[10px] border border-[var(--color-light-glass-20)] bg-[var(--color-dark-glass-5)] text-light-space">
        {item.icon ?? <UserIcon size={16} strokeWidth={1.8} />}
      </span>
      <span className="font-sans text-sm font-semibold leading-none">{item.name}</span>
      <span className="sr-only">tag {index + 1}</span>
    </motion.div>
  );
}

function MentionChip({ mention }: { mention: PromptMention }) {
  return (
    <span className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full border border-[var(--color-light-glass-20)] bg-[var(--color-dark-glass-5)] pl-1 pr-2 text-sm leading-none text-light-space">
      <Avatar
        size="micro"
        src={mention.avatarSrc}
        borderStyle="origins"
        originColor={mention.originColor ?? "aether"}
        disableNavigation
        showOO={mention.showOO}
        ooExpression="default"
      />
      <span className="max-w-[96px] truncate">@{mention.name}</span>
    </span>
  );
}

function MentionChipRow({ mentions }: { mentions?: PromptMention[] }) {
  if (!mentions?.length) return null;
  return (
    <div className="flex max-w-[45%] shrink-0 items-center gap-1 overflow-x-auto">
      {mentions.map((mention) => (
        <MentionChip key={mention.id ?? mention.name} mention={mention} />
      ))}
    </div>
  );
}

function PromptDraftTextarea({
  value,
  placeholder,
  onValueChange,
  autoFocus = false,
  maxHeight = 112,
  className,
}: {
  value: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
  autoFocus?: boolean;
  maxHeight?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLTextAreaElement>(null);

  const syncHeight = React.useCallback(() => {
    const node = ref.current;
    if (!node) return;

    node.style.height = "0px";
    const nextHeight = Math.min(node.scrollHeight, maxHeight);
    node.style.height = `${Math.max(22, nextHeight)}px`;
    node.style.overflowY = node.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [maxHeight]);

  React.useLayoutEffect(() => {
    syncHeight();
  }, [syncHeight, value]);

  return (
    <textarea
      ref={ref}
      rows={1}
      autoFocus={autoFocus}
      data-prompt-input
      className={cn(
        "block w-full min-w-0 resize-none border-none bg-transparent p-0 font-sans text-base font-normal leading-[1.4] text-light-space outline-none placeholder:text-light-space/45",
        className,
      )}
      style={{ color: "var(--color-light-space)" }}
      placeholder={placeholder}
      value={value}
      onChange={(event) => {
        onValueChange?.(event.target.value);
        window.requestAnimationFrame(syncHeight);
      }}
    />
  );
}

function AttachmentPreview({
  file,
  onRemove,
}: {
  file: PromptAttachment;
  onRemove?: (id: string) => void;
}) {
  const id = file.id ?? `${file.name}${file.extension}`;
  const isImage = !!file.previewUrl || IMAGE_EXTENSIONS.has(file.extension.toLowerCase());
  if (isImage && file.previewUrl) {
    return (
      <div className="group relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-[16px] border border-[var(--color-light-glass-20)] bg-[var(--color-dark-glass-5)]">
        <img src={file.previewUrl} alt={file.name} className="size-full object-cover" />
        <button
          type="button"
          aria-label={`remove ${file.name}`}
          onClick={() => onRemove?.(id)}
          className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full border border-[var(--color-light-glass-20)] bg-light-space text-dark-space shadow-[0px_4px_12px_rgba(0,0,0,0.24)] transition-transform hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-light-space"
        >
          <Cancel01Icon size={16} strokeWidth={1} />
        </button>
      </div>
    );
  }

  const FileIcon = getFileTypeIcon(file.extension);
  return (
    <MediumTag
      key={id}
      variant="file"
      label={file.name}
      secondaryLabel={file.extension}
      icon={<FileIcon size={20} strokeWidth={1.8} />}
      iconRight={<Cancel01Icon size={20} strokeWidth={1.8} />}
    />
  );
}

function PromptAutocompleteBar({
  value,
  placeholder,
  onValueChange,
  onLibrary,
  onMic,
  onPlus,
  isSplexOpen,
  onSend,
  heroSendOnly,
  selectedMentions,
}: Pick<PromptBarProps, "value" | "placeholder" | "onValueChange" | "onLibrary" | "onMic" | "onPlus" | "isSplexOpen" | "onSend" | "heroSendOnly" | "selectedMentions">) {
  return (
    <PromptGlassFrame className="relative flex h-[50px] items-center justify-between rounded-full py-1 pl-1 pr-[5px]">
      <div className="flex flex-1 min-w-0 items-center gap-2">
        <PromptBarCommandLibraryButton onClick={onLibrary} className="shrink-0" />
        <MentionChipRow mentions={selectedMentions} />
        <input
          type="text"
          autoFocus
          className="flex-1 min-w-0 bg-transparent border-none outline-none font-sans font-normal text-base leading-[1.4] text-light-space placeholder:text-light-space/50"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onValueChange?.(e.target.value)}
        />
      </div>
      {heroSendOnly ? (
        <HeroSendSquare onClick={onSend} hasText={(value ?? "").trim().length > 0} />
      ) : (
        <div className="flex items-center gap-[2px]">
          <IconOnlyButton
            size="small"
            className="size-[42px]"
            aria-label="Record audio"
            icon={<Mic01Icon size={20} strokeWidth={1.8} />}
            onClick={onMic}
          />
          <PromptBarPlusButton onClick={onPlus} open={isSplexOpen} />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit]" />
    </PromptGlassFrame>
  );
}

function PromptBar({
  variant = "desktop",
  viewport,
  isDesktop,
  placeholder = "search the universe",
  placeholderSuggestions,
  isFocused = false,
  isRecording = false,
  isTyping = false,
  isExpanded = false,
  isProcessing = false,
  usernameState,
  passwordStrength,
  editProfile,
  socialPlatform,
  socialIcon,
  isPasswordVisible = false,
  onTogglePasswordVisibility,
  value = "",
  onValueChange,
  onLibrary,
  onMic,
  onPlus,
  onSend,
  onCancel,
  onStop,
  phoneCountry,
  onPhoneCountryChange,
  attachedFiles,
  selectedMentions,
  onMentionSelect,
  onAttachmentRemove,
  mentionSuggestions,
  activeInlineTags,
  activePromptTools,
  onPromptToolToggle,
  activeGenerationCommand,
  generationModel,
  generationModelOptions,
  onGenerationModelChange,
  activeLlmModel,
  llmModelOptions,
  onLlmModelChange,
  commandList,
  className,
  heroSendOnly = false,
  isSplexOpen = false,
}: PromptBarProps) {
  const resolvedViewport = useGooeyViewport(viewport, isDesktop);
  const isDesktopLayout = !isCompactViewport(resolvedViewport);
  const promptBarWidthClass = getResponsiveWidthClass(resolvedViewport, {
    phone: "w-full max-w-[366px]",
    tablet: "w-full max-w-[450px]",
    desktop: "w-full max-w-[450px]",
    wide: "w-full max-w-[520px]",
  });

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const handleScroll = React.useCallback(() => {
    if (scrollRef.current) setIsScrolled(scrollRef.current.scrollLeft > 0);
  }, []);
  const hasPromptBadges = (activeInlineTags?.length ?? 0) > 0 || (activePromptTools?.length ?? 0) > 0 || !!activeLlmModel;
  const hasActivePromptTool = activePromptTools?.some((tool) => tool.active) ?? false;
  const hasDraftContent =
    value.trim().length > 0 ||
    (selectedMentions?.length ?? 0) > 0 ||
    (attachedFiles?.length ?? 0) > 0 ||
    hasActivePromptTool ||
    (activeInlineTags?.length ?? 0) > 0;
  const showSendControls = isFocused && hasDraftContent;
  const expandedTextMaxHeight = isDesktopLayout ? 112 : 96;
  const expandedFrameMaxHeight = isDesktopLayout ? 204 : 188;

  if (commandList && commandList.length > 0) {
    const groupedCommands = commandList.reduce<Array<{ group: string; items: PromptCommand[] }>>((groups, command) => {
      const group = command.group ?? "commands";
      const current = groups.find((entry) => entry.group === group);
      if (current) current.items.push(command);
      else groups.push({ group, items: [command] });
      return groups;
    }, []);

    return (
      <div
        className={cn(
          "relative h-[50px]",
          promptBarWidthClass,
          className,
        )}
      >
        <PromptFloatingPanel>
          <div className="max-h-[312px] overflow-y-auto">
            {groupedCommands.map((section) => (
              <div key={section.group}>
                <PromptSectionLabel>{section.group}</PromptSectionLabel>
                <div className="flex flex-col gap-1">
                  {section.items.map((cmd, index) => (
                    <button
                      key={cmd.id}
                      type="button"
                      className={cn(
                        "flex h-10 w-full items-center gap-2 rounded-[16px] px-3 text-left transition-colors hover:bg-light-space/10 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-light-space",
                        index === 0 && "bg-light-space/10",
                      )}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => onValueChange?.(`/${cmd.id} `)}
                    >
                      <span className="flex size-6 shrink-0 items-center justify-center text-light-space/85">
                        {cmd.icon}
                      </span>
                      <span className="min-w-0 flex-1 truncate font-sans text-base font-normal leading-none text-light-space">
                        {cmd.label}
                      </span>
                      <span className="min-w-0 flex-[1.4] truncate font-sans text-sm font-normal leading-none text-light-space/50">
                        {cmd.description}
                      </span>
                      {cmd.meta && (
                        <span className="shrink-0 font-sans text-sm font-normal leading-none text-light-space/50">
                          {cmd.meta}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </PromptFloatingPanel>
        <PromptAutocompleteBar
          value={value}
          placeholder={placeholder}
          onValueChange={onValueChange}
          onLibrary={onLibrary}
          onMic={onMic}
          onPlus={onPlus}
          isSplexOpen={isSplexOpen}
          onSend={onSend}
          heroSendOnly={heroSendOnly}
          selectedMentions={selectedMentions}
        />
      </div>
    );
  }

  if (mentionSuggestions?.length) {
    const people = mentionSuggestions.filter((item) => !item.category);
    const sections = ([
      { category: "pods", items: mentionSuggestions.filter((item) => item.category === "pods") },
      { category: "apps", items: mentionSuggestions.filter((item) => item.category === "apps") },
      { category: "files", items: mentionSuggestions.filter((item) => item.category === "files") },
    ] satisfies Array<{ category: PromptTagCategory; items: PromptTagSuggestion[] }>).filter((section) => section.items.length > 0);

    return (
      <div
        className={cn(
          "relative h-[50px]",
          promptBarWidthClass,
          className,
        )}
      >
        <PromptFloatingPanel>
          <div className="max-h-[312px] overflow-y-auto">
            {people.length > 0 && (
              <div className="flex flex-col gap-1">
                {people.map((item, index) => (
                  <PromptTagRow
                    key={`person-${item.name}`}
                    item={item}
                    active={index === 0}
                    onSelect={onMentionSelect}
                  />
                ))}
              </div>
            )}
            {sections.map((section) => (
              <div key={section.category}>
                <PromptSectionLabel>{section.category}</PromptSectionLabel>
                <div className="flex flex-col gap-1">
                  {section.items.map((item) => (
                    <PromptTagRow key={`${section.category}-${item.name}`} item={item} onSelect={onMentionSelect} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </PromptFloatingPanel>
        <PromptAutocompleteBar
          value={value}
          placeholder={placeholder}
          onValueChange={onValueChange}
          onLibrary={onLibrary}
          onMic={onMic}
          onPlus={onPlus}
          isSplexOpen={isSplexOpen}
          onSend={onSend}
          heroSendOnly={heroSendOnly}
          selectedMentions={selectedMentions}
        />
      </div>
    );
  }

  if (attachedFiles?.length) {
    return (
      <PromptGlassFrame
        className={cn(
          "relative flex w-full flex-col gap-[8px] overflow-clip rounded-[24px] p-[4px]",
          promptBarWidthClass,
          className,
        )}
      >
        {/* File tags row */}
        <div className={cn(
          "flex gap-[4px] items-start",
          isDesktopLayout ? "flex-nowrap overflow-x-auto" : "flex-wrap"
        )}>
          {attachedFiles.map((file) => (
            <AttachmentPreview
              key={file.id ?? `${file.name}${file.extension}`}
              file={file}
              onRemove={onAttachmentRemove}
            />
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex items-center gap-[8px] w-full">
          <div className="flex flex-1 items-center gap-[8px]">
            <PromptBarCommandLibraryButton onClick={onLibrary} className="shrink-0" />
            <MentionChipRow mentions={selectedMentions} />
            <span className="flex-1 min-w-0 font-sans font-normal text-base leading-[1.4] text-light-space">
              {value || placeholder}
            </span>
          </div>
          <div className="flex items-center gap-[2px] shrink-0">
            {heroSendOnly ? (
              <HeroSendSquare onClick={onSend} hasText={value.trim().length > 0} />
            ) : (
              <>
                <IconOnlyButton
                  size="small"
                  className="size-[42px]"
                  aria-label="Record audio"
                  icon={<Mic01Icon size={20} strokeWidth={1.8} />}
                  onClick={onMic}
                />
                <PromptBarPlusButton onClick={onPlus} open={isSplexOpen} />
              </>
            )}
          </div>
        </div>

        {/* Inner shadow overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit]" />
      </PromptGlassFrame>
    );
  }

  if (phoneCountry) {
    const country = COUNTRY_DIAL_CODES.find((c) => c.code === phoneCountry) ?? COUNTRY_DIAL_CODES[0];
    return (
      <PromptGlassFrame
        className={cn(
          "relative flex h-[50px] w-full items-center gap-[8px] rounded-full pl-[4px] pr-[20px] py-[4px]",
          promptBarWidthClass,
          className,
        )}
      >
        {/* Country selector tag */}
        <div
          className="relative flex h-[42px] shrink-0 items-center gap-[8px] rounded-[999px] pl-[5px] pr-[12px]"
          style={{
            backgroundColor: "var(--color-light-glass-5)",
            border: "1px solid var(--color-light-glass-20)",
            boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
          }}
        >
          <img
            src={`/images/flags/${country.flag}.svg`}
            alt={country.name}
            className="size-[32px] rounded-full object-cover"
          />
          <ArrowDown01Icon size={20} strokeWidth={1.8} className="text-light-space" />
          <select
            className="absolute inset-0 cursor-pointer opacity-0"
            value={phoneCountry}
            onChange={(e) => onPhoneCountryChange?.(e.target.value)}
          >
            {COUNTRY_DIAL_CODES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.dial})
              </option>
            ))}
          </select>
        </div>

        {/* Phone input */}
        <div className="flex flex-1 min-w-0 items-center gap-[6px]">
          <span className="shrink-0 font-sans font-normal text-base" style={{ color: "var(--color-light-glass-80)" }}>
            {country.dial}
          </span>
          <input
            type="tel"
            className="flex-1 min-w-0 bg-transparent border-none outline-none font-sans font-normal text-base leading-[1.4] text-light-space placeholder:text-light-glass-80"
            placeholder="000 000 00"
            value={value}
            onChange={(e) => onValueChange?.(e.target.value)}
          />
        </div>

        {/* Inner shadow overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit]" />
      </PromptGlassFrame>
    );
  }

  if (passwordStrength) {
    const isHidden = !isPasswordVisible && !!value;
    return (
      <PromptGlassFrame
        className={cn(
          "relative flex h-[50px] w-full items-center gap-[2px] rounded-full p-1",
          promptBarWidthClass,
          className,
        )}
      >
        {/* Key icon */}
        <IconOnlyButton
          size="small"
          className="size-[42px] shrink-0"
          aria-label="Password"
          icon={<LockPasswordIcon size={20} strokeWidth={1.8} />}
        />

        {/* Input wrapper with slime overlay */}
        <div className="relative flex-1 min-w-0">
          <input
            type="text"
            className="w-full bg-transparent border-none outline-none font-sans font-normal text-base leading-[1.4] placeholder:text-light-space/50"
            style={{
              color: isHidden ? "transparent" : "var(--color-light-space)",
              caretColor: "var(--color-light-space)",
            }}
            placeholder="Enter password"
            value={value}
            onChange={(e) => onValueChange?.(e.target.value)}
          />
          {isHidden && <SlimeMask value={value} />}
        </div>

        {/* Strength indicator + eye toggle */}
        <PasswordSafety
          strength={passwordStrength}
          isVisible={isPasswordVisible}
          onToggleVisibility={onTogglePasswordVisibility ?? (() => {})}
        />

        {/* Inner shadow overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit]" />
      </PromptGlassFrame>
    );
  }

  if (socialPlatform) {
    return (
      <PromptGlassFrame
        className={cn(
          "relative flex h-[50px] w-full items-center gap-2 rounded-full p-1",
          promptBarWidthClass,
          className,
        )}
      >
        {/* Social platform icon */}
        <SocialButton platform={socialPlatform} icon={socialIcon} className="shrink-0" />

        {/* @ handle */}
        <div className="flex flex-1 min-w-0 items-center gap-1">
          <span className="font-sans font-normal text-base leading-[1.4]" style={{ color: "var(--color-smoke-4)" }}>@</span>
          <span className="font-sans font-normal text-base leading-[1.4] text-light-space truncate">{value}</span>
        </div>

        {/* Checkmark — only visible when a value is entered */}
        {value && (
          <IconOnlyButton
            size="small"
            className="size-[42px] shrink-0"
            aria-label="Confirm"
            icon={<Tick01Icon size={20} strokeWidth={1.8} />}
          />
        )}

        {/* Inner shadow overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit]" />
      </PromptGlassFrame>
    );
  }

  if (editProfile) {
    return (
      <PromptGlassFrame
        className={cn(
          "relative flex h-[50px] w-full items-center gap-1 rounded-full p-1",
          promptBarWidthClass,
          className,
        )}
      >
        {/* Left fixed group */}
        <div className="flex items-center gap-1 shrink-0">
          <PlayButton origin="life" icon={<ZapFilledIcon />} className="size-[42px]" />
          <ColorOnlyButton fill={LIKTIR_FILL} size="small" />
          <IconOnlyButton
            size="small"
            className="size-[42px]"
            aria-label="Settings"
            icon={<Settings01Icon size={20} strokeWidth={1.8} />}
          />
          <IconOnlyButton
            size="small"
            className="size-[42px]"
            aria-label="Add"
            icon={<Add01Icon size={20} strokeWidth={1.8} />}
          />
        </div>

        <PromptBarSeparator />

        {/* Scrollable middle */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex flex-1 items-center gap-1 min-w-0 overflow-x-auto"
          style={isScrolled ? {
            maskImage: "linear-gradient(to right, transparent, black 24px, black)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 24px, black)",
          } : undefined}
        >
          <IconOnlyButton
            size="small"
            className="size-[42px] shrink-0"
            aria-label="Insert link"
            icon={<Link01Icon size={20} strokeWidth={1.8} />}
          />
          <IconOnlyButton
            size="small"
            className="size-[42px] shrink-0"
            aria-label="Insert image"
            icon={<Image01Icon size={20} strokeWidth={1.8} />}
          />
          <IconOnlyButton
            size="small"
            className="size-[42px] shrink-0"
            aria-label="Insert quote"
            icon={<QuoteUpIcon size={20} strokeWidth={1.8} />}
          />
          <IconOnlyButton
            size="small"
            className="size-[42px] shrink-0"
            aria-label="Insert location"
            icon={<Location01Icon size={20} strokeWidth={1.8} />}
          />
        </div>

        <PromptBarSeparator />

        {/* Right fixed */}
        <IconOnlyButton
          size="small"
          className="size-[42px] shrink-0"
          aria-label="Share"
          icon={<Share01Icon size={20} strokeWidth={1.8} />}
        />

        {/* Inner shadow overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit]" />
      </PromptGlassFrame>
    );
  }

  if (usernameState) {
    return (
      <UsernamePromptBar
        variant={variant}
        usernameState={usernameState}
        value={value}
        className={className}
      />
    );
  }

  if (isRecording) {
    return (
      <PromptGlassFrame
        className={cn(
          // identical padding rhythm to the default bar (p-[3px] + justify-between)
          // so nothing shifts when entering/leaving recording mode.
          "relative flex h-[50px] w-full items-center justify-between rounded-full p-[3px]",
          promptBarWidthClass,
          className,
        )}
      >
        {isDesktopLayout ? (
          <>
            {/* Library + VoiceMemo share the default left-group rhythm (gap-2). */}
            <div className="flex flex-1 min-w-0 items-center gap-2">
              <PromptBarCommandLibraryButton onClick={onLibrary} className="shrink-0" />
              <div className="flex-1 min-w-0">
                <VoiceMemoSimulation className="h-[42px] w-full" />
              </div>
            </div>

            {/* Send + Cancel — send turns solid white with a black arrow while recording. */}
            <div className="flex items-center gap-[2px]">
              <IconOnlyButton
                size="small"
                className="size-[42px]"
                variant="primary"
                aria-label="Send message"
                icon={<span className="text-black"><SendArrowIcon /></span>}
                style={{ backgroundColor: "#FFFFFF" }}
                onClick={onSend}
              />
              <IconOnlyButton
                size="small"
                className="size-[42px]"
                icon={
                  <motion.span
                    className="inline-flex"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 45 }}
                    exit={{ rotate: 0 }}
                    transition={RECORDING_X_SPRING}
                  >
                    <Add01Icon size={20} strokeWidth={1.8} />
                  </motion.span>
                }
                aria-label="Cancel"
                onClick={onCancel}
              />
            </div>
          </>
        ) : (
          <>
            {/* Cancel (X) */}
            <IconOnlyButton
              size="small"
              className="size-[42px] shrink-0"
              icon={
                <motion.span
                  className="inline-flex"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 45 }}
                  exit={{ rotate: 0 }}
                  transition={RECORDING_X_SPRING}
                >
                  <Add01Icon size={20} strokeWidth={1.8} />
                </motion.span>
              }
              onClick={onCancel}
            />

            {/* VoiceMemo fills center */}
            <div className="mx-1 flex-1 min-w-0">
              <VoiceMemoSimulation className="h-[42px] w-full" />
            </div>

            {/* Send arrow — solid white with a black arrow while recording. */}
            <IconOnlyButton
              size="small"
              className="size-[42px] shrink-0"
              variant="primary"
              aria-label="Send message"
              icon={<span className="text-black"><SendArrowIcon /></span>}
              style={{ backgroundColor: "#FFFFFF" }}
              onClick={onSend}
            />
          </>
        )}

        {/* Inner shadow overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit]" />
      </PromptGlassFrame>
    );
  }

  if (isTyping && isExpanded) {
    return (
      <PromptGlassFrame
        className={cn(
          "relative flex w-full flex-col overflow-hidden rounded-[25px] p-1 transition-[border-radius,height,transform] duration-200 ease-out",
          "light:border-[#E0E0E0] light:bg-white light:shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)]",
          promptBarWidthClass,
          className,
        )}
        style={{
          minHeight: 50,
          maxHeight: expandedFrameMaxHeight,
        }}
        contentClassName="flex-col"
        lens={PROMPT_EXPANDED_GLASS_LENS}
      >
        {isDesktopLayout ? (
          /* Desktop: text on top grows upward, icons pinned bottom */
          <>
            {/* Text content — scrolls when exceeding container */}
            <div className="w-full min-h-0 flex-1 overflow-y-auto px-3 pb-2 pt-3">
              {activeInlineTags?.length ? (
                <div className="mb-2 flex flex-wrap gap-2">
                  <AnimatePresence mode="popLayout">
                    {activeInlineTags.map((item, index) => (
                      <PromptInlineTagChip key={item.trigger ?? item.name} item={item} index={index} />
                    ))}
                  </AnimatePresence>
                </div>
              ) : null}
              <MentionChipRow mentions={selectedMentions} />
              {onValueChange ? (
                <PromptDraftTextarea
                  autoFocus
                  value={value}
                  placeholder={placeholder}
                  onValueChange={onValueChange}
                  maxHeight={expandedTextMaxHeight}
                />
              ) : (
                <p className="font-sans font-normal text-base leading-[1.4] text-light-space whitespace-pre-wrap wrap-break-word">
                  {value}
                </p>
              )}
            </div>

            {((activePromptTools?.length ?? 0) > 0 || activeLlmModel) && (
              <div className="flex w-full shrink-0 items-center justify-between gap-2 px-1 pb-1">
                <PromptToolBadgeRow tools={activePromptTools} onToggle={onPromptToolToggle} />
                <LlmModelSelector
                  selected={activeLlmModel}
                  options={llmModelOptions}
                  onSelect={onLlmModelChange}
                />
              </div>
            )}

            {/* Bottom bar — Library left, Mic + Plus right */}
            <div className="flex h-[42px] w-full shrink-0 items-center justify-between gap-2">
              <PromptBarCommandLibraryButton onClick={onLibrary} className="shrink-0" />
              <GenerationModelSelector
                command={activeGenerationCommand}
                selected={generationModel}
                options={generationModelOptions}
                onSelect={onGenerationModelChange}
              />
              {heroSendOnly ? (
                <HeroSendSquare onClick={onSend} hasText={value.trim().length > 0} />
              ) : hasDraftContent ? (
                <div className="flex items-center gap-[2px] shrink-0">
                  <IconOnlyButton
                    size="small"
                    className="size-[42px]"
                    variant="primary"
                    aria-label="Send message"
                    icon={<SendArrowIcon />}
                    onClick={onSend}
                  />
                  <IconOnlyButton
                    size="small"
                    className="size-[42px]"
                    icon={
                      <span
                        className="inline-flex transition-transform duration-200"
                        style={{ transform: "rotate(45deg)" }}
                      >
                        <Add01Icon size={20} strokeWidth={1.8} />
                      </span>
                    }
                    aria-label="Cancel"
                    onClick={onCancel}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-[2px] shrink-0">
                  <IconOnlyButton
                    size="small"
                    className="size-[42px]"
                    aria-label="Record audio"
                    icon={<Mic01Icon size={20} strokeWidth={1.8} />}
                    onClick={onMic}
                  />
                  <PromptBarPlusButton onClick={onPlus} open={isSplexOpen} />
                </div>
              )}
            </div>
          </>
        ) : (
          /* Phone: column stacked — text on top, icons on bottom */
          <>
            {/* Text content — scrolls when exceeding container */}
            <div className="w-full min-h-0 flex-1 overflow-y-auto px-3 pb-2 pt-3">
              {activeInlineTags?.length ? (
                <div className="mb-2 flex flex-wrap gap-2">
                  <AnimatePresence mode="popLayout">
                    {activeInlineTags.map((item, index) => (
                      <PromptInlineTagChip key={item.trigger ?? item.name} item={item} index={index} />
                    ))}
                  </AnimatePresence>
                </div>
              ) : null}
              <MentionChipRow mentions={selectedMentions} />
              {onValueChange ? (
                <PromptDraftTextarea
                  autoFocus
                  value={value}
                  placeholder={placeholder}
                  onValueChange={onValueChange}
                  maxHeight={expandedTextMaxHeight}
                />
              ) : (
                <p className="font-sans font-normal text-base leading-[1.4] text-light-space whitespace-pre-wrap wrap-break-word">
                  {value}
                </p>
              )}
            </div>

            {((activePromptTools?.length ?? 0) > 0 || activeLlmModel) && (
              <div className="flex w-full shrink-0 items-center justify-between gap-2 px-1 pb-1">
                <PromptToolBadgeRow tools={activePromptTools} onToggle={onPromptToolToggle} />
                <LlmModelSelector
                  selected={activeLlmModel}
                  options={llmModelOptions}
                  onSelect={onLlmModelChange}
                />
              </div>
            )}

            {/* Bottom bar — 8px gap from text, Plus left / Mic right */}
            <div className="mt-auto flex h-[42px] w-full shrink-0 items-center justify-between gap-2">
              {heroSendOnly ? (
                <HeroSendSquare className="ml-auto" onClick={onSend} hasText={value.trim().length > 0} />
              ) : (
                <>
                  {hasDraftContent ? (
                    <IconOnlyButton
                      size="small"
                      className="size-[42px]"
                      icon={
                        <span
                          className="inline-flex transition-transform duration-200"
                          style={{ transform: "rotate(45deg)" }}
                        >
                          <Add01Icon size={20} strokeWidth={1.8} />
                        </span>
                      }
                      aria-label="Cancel"
                      onClick={onCancel}
                    />
                  ) : (
                    <PromptBarPlusButton onClick={onPlus} open={isSplexOpen} />
                  )}
                  <GenerationModelSelector
                    command={activeGenerationCommand}
                    selected={generationModel}
                    options={generationModelOptions}
                    onSelect={onGenerationModelChange}
                  />
                  {hasDraftContent ? (
                    <IconOnlyButton
                      size="small"
                      className="size-[42px]"
                      variant="primary"
                      aria-label="Send message"
                      icon={<SendArrowIcon />}
                      onClick={onSend}
                    />
                  ) : (
                    <IconOnlyButton
                      size="small"
                      className="size-[42px]"
                      aria-label="Record audio"
                      icon={<Mic01Icon size={20} strokeWidth={1.8} />}
                      onClick={onMic}
                    />
                  )}
                </>
              )}
            </div>
          </>
        )}

        {/* Inner shadow overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit]" />
      </PromptGlassFrame>
    );
  }

  if (isTyping) {
    return (
      <PromptGlassFrame
        className={cn(
          "relative flex h-[50px] items-center justify-between rounded-full py-1 pl-1 pr-[5px] transition-all duration-300 ease-out",
          "light:border-[#E0E0E0] light:bg-white light:shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)]",
          isDesktopLayout ? "w-[450px]" : "w-[366px]",
          className,
        )}
      >
        {isDesktopLayout ? (
          <>
            {/* Left group: Library + input */}
            <div className="flex flex-1 min-w-0 items-center gap-2">
              <PromptBarCommandLibraryButton onClick={onLibrary} className="shrink-0" />
              <MentionChipRow mentions={selectedMentions} />
              <PromptDraftTextarea
                className="flex-1"
                placeholder={placeholder}
                value={value}
                onValueChange={onValueChange}
                maxHeight={22}
              />
            </div>
            {/* Trailing controls share one 2px rhythm so the gaps read consistently. */}
            <div className="flex items-center gap-[2px]">
              <GenerationModelSelector
                command={activeGenerationCommand}
                selected={generationModel}
                options={generationModelOptions}
                onSelect={onGenerationModelChange}
              />

              {heroSendOnly ? (
                <HeroSendSquare onClick={onSend} hasText={value.trim().length > 0} />
              ) : (
                <div className="flex items-center gap-[2px]">
                  <IconOnlyButton
                    size="small"
                    className="size-[42px]"
                    variant="primary"
                    aria-label="Send message"
                    icon={<SendArrowIcon />}
                    onClick={onSend}
                  />
                  <IconOnlyButton
                    size="small"
                    className="size-[42px]"
                    icon={
                      <span
                        className="inline-flex transition-transform duration-200"
                        style={{ transform: "rotate(45deg)" }}
                      >
                        <Add01Icon size={20} strokeWidth={1.8} />
                      </span>
                    }
                    aria-label="Cancel"
                    onClick={onCancel}
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Left group: Cancel + input */}
            <div className="flex flex-1 min-w-0 items-center gap-2">
              {!heroSendOnly ? (
                <IconOnlyButton
                  size="small"
                  className="size-[42px] shrink-0"
                  icon={
                    <span
                      className="inline-flex transition-transform duration-200"
                      style={{ transform: "rotate(45deg)" }}
                    >
                      <Add01Icon size={20} strokeWidth={1.8} />
                    </span>
                  }
                  aria-label="Cancel"
                  onClick={onCancel}
                />
              ) : (
                <PromptBarCommandLibraryButton onClick={onLibrary} className="shrink-0" />
              )}
              <MentionChipRow mentions={selectedMentions} />
              <PromptDraftTextarea
                className="flex-1"
                placeholder={placeholder}
                value={value}
                onValueChange={onValueChange}
                maxHeight={22}
              />
            </div>
            <GenerationModelSelector
              command={activeGenerationCommand}
              selected={generationModel}
              options={generationModelOptions}
              onSelect={onGenerationModelChange}
            />

            {/* Right group: Send */}
            {heroSendOnly ? (
              <HeroSendSquare onClick={onSend} hasText={value.trim().length > 0} />
            ) : (
              <IconOnlyButton
                size="small"
                className="size-[42px]"
                variant="primary"
                aria-label="Send message"
                icon={<SendArrowIcon />}
                onClick={onSend}
              />
            )}
          </>
        )}

        {/* Inner shadow overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit]" />
      </PromptGlassFrame>
    );
  }

  if (isProcessing) {
    return (
      <PromptGlassFrame
        className={cn(
          "relative flex h-[50px] items-center justify-between rounded-full p-1",
          isDesktopLayout ? "w-[450px]" : "w-[366px]",
          className,
        )}
      >
        {/* Left group */}
        <div className="flex items-center gap-2">
          <PromptBarCommandLibraryButton onClick={onLibrary} />
          <span className="font-sans font-normal text-base leading-[1.4] text-light-space truncate">
            {placeholder}
          </span>
        </div>

        {/* Stop button */}
        <IconOnlyButton
          size="small"
          className="size-[42px]"
          variant="primary"
          aria-label="Stop"
          icon={<StopFilledIcon />}
          onClick={onStop}
        />

        {/* Inner shadow overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit]" />
      </PromptGlassFrame>
    );
  }

  return (
    <PromptGlassFrame
      className={cn(
        // p-[3px]: the frame has a 1px border (border-box), so 3px padding + 1px border
        // yields a true 4px gap on every side and the 42px button fits the 42px content box exactly.
        // min-h (not fixed h): the frame grows with a multi-line draft, the
        // glass lens tracks the measured height, and the buttons stay centered.
        "relative flex min-h-[50px] items-center justify-between rounded-full p-[3px]",
        "light:border-[#E0E0E0] light:bg-white light:shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)]",
        isDesktopLayout ? "w-[450px]" : "w-[366px]",
        className,
      )}
    >
      {/* Left group */}
      <div className="flex flex-1 min-w-0 items-center gap-2">
        {showSendControls && !isDesktopLayout && !heroSendOnly ? (
          <IconOnlyButton
            size="small"
            className="size-[42px] shrink-0"
            icon={
              <span
                className="inline-flex transition-transform duration-200"
                style={{ transform: "rotate(45deg)" }}
              >
                <Add01Icon size={20} strokeWidth={1.8} />
              </span>
            }
            aria-label="Cancel"
            onClick={onCancel}
          />
        ) : isDesktopLayout || heroSendOnly ? (
          <PromptBarCommandLibraryButton onClick={onLibrary} className="shrink-0" />
        ) : (
          <PromptBarPlusButton onClick={onPlus} open={isSplexOpen} className="shrink-0" />
        )}
        <MentionChipRow mentions={selectedMentions} />
        {isFocused ? (
          <PromptDraftTextarea
            autoFocus
            className="flex-1"
            placeholder={placeholder}
            value={value}
            onValueChange={onValueChange}
            maxHeight={88}
          />
        ) : placeholderSuggestions && placeholderSuggestions.filter(Boolean).length > 0 ? (
          <RotatingPlaceholderSuggestions suggestions={placeholderSuggestions} />
        ) : (
          <span className="min-w-0 flex-1 truncate font-sans font-normal text-base leading-[1.4] text-light-space">
            {placeholder}
          </span>
        )}
      </div>

      {/* Trailing controls — model selector and send/mic cluster share one 2px rhythm. */}
      <div className="flex items-center gap-[2px]">
        <GenerationModelSelector
          command={activeGenerationCommand}
          selected={generationModel}
          options={generationModelOptions}
          onSelect={onGenerationModelChange}
        />

        {heroSendOnly ? (
          <HeroSendSquare onClick={onSend} hasText={value.trim().length > 0} />
        ) : showSendControls ? (
          isDesktopLayout ? (
            <div className="flex items-center gap-[2px]">
              <IconOnlyButton
                size="small"
                className="size-[42px]"
                variant="primary"
                aria-label="Send message"
                icon={<SendArrowIcon />}
                onClick={onSend}
              />
              <IconOnlyButton
                size="small"
                className="size-[42px]"
                icon={
                  <span
                    className="inline-flex transition-transform duration-200"
                    style={{ transform: "rotate(45deg)" }}
                  >
                    <Add01Icon size={20} strokeWidth={1.8} />
                  </span>
                }
                aria-label="Cancel"
                onClick={onCancel}
              />
            </div>
          ) : (
            <IconOnlyButton
              size="small"
              className="size-[42px]"
              variant="primary"
              aria-label="Send message"
              icon={<SendArrowIcon />}
              onClick={onSend}
            />
          )
        ) : isDesktopLayout ? (
          <div className="flex items-center gap-[2px]">
            <IconOnlyButton
              size="small"
              className="size-[42px]"
              aria-label="Record audio"
              icon={<Mic01Icon size={20} strokeWidth={1.8} />}
              onClick={onMic}
            />
            <PromptBarPlusButton onClick={onPlus} open={isSplexOpen} />
          </div>
        ) : (
          <IconOnlyButton
            size="small"
            className="size-[42px]"
            aria-label="Record audio"
            icon={<Mic01Icon size={20} strokeWidth={1.8} />}
            onClick={onMic}
          />
        )}
      </div>

      {/* Inner shadow overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit]" />
    </PromptGlassFrame>
  );
}

/** Username input variant of the PromptBar */
function UsernamePromptBar({
  variant = "desktop",
  viewport,
  isDesktop,
  usernameState,
  value,
  className,
}: {
  variant?: "desktop" | "phone";
  viewport?: GooeyViewportInput;
  isDesktop?: boolean;
  usernameState: UsernameState;
  value: string;
  className?: string;
}) {
  const resolvedViewport = useGooeyViewport(viewport, isDesktop);
  const isDesktopLayout = !isCompactViewport(resolvedViewport);
  const widthClass = getResponsiveWidthClass(resolvedViewport, {
    phone: "w-full max-w-[366px]",
    tablet: "w-full max-w-[450px]",
    desktop: "w-full max-w-[450px]",
    wide: "w-full max-w-[520px]",
  });

  const leftIcon = (() => {
    switch (usernameState) {
      case "idle":
      case "typing":
        return <SparklesIcon size={20} strokeWidth={1.8} />;
      case "available":
      case "success":
        return <Tick01Icon size={20} strokeWidth={1.8} />;
      case "taken":
        return <Cancel01Icon size={20} strokeWidth={1.8} />;
      case "neutral":
        return <UserIcon size={20} strokeWidth={1.8} />;
    }
  })();

  const rightAction = (() => {
    switch (usernameState) {
      case "idle":
        return null;
      case "typing":
        return (
          <IconOnlyButton
            size="small"
            className="size-[42px]"
            aria-label="Submit"
            icon={<ArrowRight01Icon size={20} strokeWidth={1.8} />}
          />
        );
      case "available":
        return (
          <SpecialButton origin="insight" className="h-[42px] px-5 text-sm">
            Claim ID
          </SpecialButton>
        );
      case "taken":
        return (
          <button
            type="button"
            className="inline-flex h-[42px] items-center justify-center rounded-full px-4 font-bold text-sm"
            style={{
              backgroundColor: "var(--color-red-1)",
              border: "1px solid var(--color-red-4)",
              color: "var(--color-red-4)",
              boxShadow: "0px 1px 4px 0px rgba(0,0,0,0.16), inset 0 1px 1px rgba(255,255,255,0.18)",
            }}
          >
            Already Taken
          </button>
        );
      case "neutral":
        return (
          <button
            type="button"
            className="inline-flex h-[42px] items-center justify-center rounded-full px-5 font-bold text-sm text-light-space"
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.3)",
              boxShadow: "0px 1px 4px 0px rgba(0,0,0,0.16), inset 0 1px 1px rgba(255,255,255,0.24)",
            }}
          >
            Claim ID
          </button>
        );
      case "success":
        return (
          <SpecialButton origin="life" className="h-[42px] px-5 text-sm">
            Build Your Universe
          </SpecialButton>
        );
    }
  })();

  return (
    <PromptGlassFrame
      className={cn(
        "relative flex h-[50px] w-full items-center gap-2 rounded-full p-1",
        widthClass,
        className,
      )}
    >
      {/* Left icon */}
      <IconOnlyButton
        size="small"
        className="size-[42px] shrink-0"
        aria-label="Username status"
        icon={leftIcon}
      />

      {/* Center text */}
      <span
        className={cn(
          "flex-1 min-w-0 truncate font-sans font-normal text-base leading-[1.4]",
          usernameState === "idle"
            ? "text-light-space/80"
            : "text-light-space",
        )}
      >
        {usernameState === "idle" ? "Type your username" : value}
      </span>

      {/* Right action */}
      {rightAction}

      {/* Inner shadow overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit]" />
    </PromptGlassFrame>
  );
}

/** 20x20 filled square stop icon */
function StopFilledIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <rect x="4" y="4" width="12" height="12" rx="2" fill="currentColor" />
    </svg>
  );
}

/** 20x20 send arrow icon (arrow pointing up) */
function SendArrowIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <path
        d="M4.79167 8.33335L10 3.12502M10 3.12502L15.2083 8.33335M10 3.12502V16.875"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Send control: flat white in dark mode, flat black in light mode. */
function HeroSendSquare({
  onClick,
  className,
  hasText,
}: {
  onClick?: () => void;
  className?: string;
  hasText: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex size-[42px] shrink-0 items-center justify-center rounded-full bg-white text-black transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 light:bg-black light:text-white light:focus-visible:ring-black/25",
        !hasText && "opacity-60",
        className,
      )}
      aria-label="Send message"
      data-prompt-send-active={hasText ? "true" : "false"}
      onClick={onClick}
    >
      <SendArrowIcon />
    </button>
  );
}

/** 16x16 filled lightning bolt icon for PlayButton */
function ZapFilledIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="currentColor">
      <path d="M9 1L3.5 9H8L7 15L12.5 7H8L9 1Z" />
    </svg>
  );
}

/** 2x16px glass pill separator */
function PromptBarSeparator() {
  return (
    <div
      className="shrink-0 rounded-[99px]"
      style={{
        width: 2,
        height: 16,
        backgroundColor: "var(--color-light-glass-20)",
        boxShadow: "none",
      }}
    />
  );
}

const COUNTRY_DIAL_CODES = [
  { code: "us", name: "United States", dial: "+1", flag: "united states" },
  { code: "gb", name: "United Kingdom", dial: "+44", flag: "united kingdom" },
  { code: "nl", name: "Netherlands", dial: "+31", flag: "netherlands" },
  { code: "de", name: "Germany", dial: "+49", flag: "germany" },
  { code: "fr", name: "France", dial: "+33", flag: "france" },
  { code: "ca", name: "Canada", dial: "+1", flag: "canada" },
  { code: "au", name: "Australia", dial: "+61", flag: "australia" },
  { code: "jp", name: "Japan", dial: "+81", flag: "japan" },
  { code: "in", name: "India", dial: "+91", flag: "india" },
  { code: "br", name: "Brazil", dial: "+55", flag: "brazil" },
  { code: "mx", name: "Mexico", dial: "+52", flag: "mexico" },
  { code: "cn", name: "China", dial: "+86", flag: "china" },
  { code: "kr", name: "South Korea", dial: "+82", flag: "south korea" },
  { code: "it", name: "Italy", dial: "+39", flag: "italy" },
  { code: "es", name: "Spain", dial: "+34", flag: "spain" },
  { code: "ng", name: "Nigeria", dial: "+234", flag: "nigeria" },
  { code: "gh", name: "Ghana", dial: "+233", flag: "ghana" },
  { code: "za", name: "South Africa", dial: "+27", flag: "south africa" },
  { code: "ke", name: "Kenya", dial: "+254", flag: "kenya" },
  { code: "se", name: "Sweden", dial: "+46", flag: "sweden" },
] as const;

/* ─── Interactive PromptBar (stateful wrapper) ──────────────────────── */

type InteractiveState = "idle" | "focused" | "mentions" | "commands" | "recording" | "expanded";

const INTERACTIVE_MENTION_USERS = [
  { name: "Ganja", originColor: "aether" as const, description: "office identity" },
  { name: "Gabs", originColor: "spirit" as const, description: "office identity" },
  { name: "Gabba", originColor: "flame" as const, description: "office identity" },
] satisfies PromptTagSuggestion[];

const INTERACTIVE_TAG_TARGETS: PromptTagSuggestion[] = [
  ...INTERACTIVE_MENTION_USERS,
  {
    name: "launch pod",
    category: "pods" as const,
    description: "workspace pod",
    icon: <CubeIcon size={20} strokeWidth={1.8} />,
    originColor: "life" as const,
  },
  {
    name: "research pod",
    category: "pods" as const,
    description: "knowledge pod",
    icon: <CubeIcon size={20} strokeWidth={1.8} />,
    originColor: "aether" as const,
  },
  {
    name: "browser",
    category: "apps" as const,
    description: "in-app tool",
    icon: <BrowserIcon size={20} strokeWidth={1.8} />,
    originColor: "insight" as const,
  },
  {
    name: "plugins",
    category: "apps" as const,
    description: "connected tools",
    icon: <PlugSocketIcon size={20} strokeWidth={1.8} />,
    originColor: "spirit" as const,
  },
  {
    name: "google search",
    category: "apps" as const,
    description: "search tool",
    trigger: "google",
    icon: <span className="font-sans text-sm font-bold leading-none">g</span>,
    originColor: "insight" as const,
  },
  {
    name: "youtube analyzer",
    category: "apps" as const,
    description: "video tool",
    trigger: "yt",
    icon: <span className="font-sans text-sm font-bold leading-none">yt</span>,
    originColor: "flame" as const,
  },
  {
    name: "notion",
    category: "apps" as const,
    description: "workspace",
    trigger: "notion",
    icon: <span className="font-sans text-sm font-bold leading-none">n</span>,
    originColor: "aether" as const,
  },
  {
    name: "partner brief",
    category: "files" as const,
    description: "document",
    icon: <DocumentAttachmentIcon size={20} strokeWidth={1.8} />,
    originColor: "solar" as const,
  },
  {
    name: "contract redline",
    category: "files" as const,
    description: "file",
    icon: <File01Icon size={20} strokeWidth={1.8} />,
    originColor: "flame" as const,
  },
];

const PROMPT_TOOL_TARGETS = INTERACTIVE_TAG_TARGETS.filter((item) => item.category === "apps" && item.trigger);
const PROMPT_TOOL_TRIGGER_PATTERN = new RegExp(
  `@(${PROMPT_TOOL_TARGETS.map((item) => item.trigger).join("|")})(?=\\s|$)`,
  "gi",
);

function parsePromptToolTags(value: string): PromptTagSuggestion[] {
  if (!value) return [];
  const seen = new Set<string>();
  const tags: PromptTagSuggestion[] = [];

  for (const match of value.matchAll(PROMPT_TOOL_TRIGGER_PATTERN)) {
    const trigger = match[1]?.toLowerCase();
    if (!trigger || seen.has(trigger)) continue;
    const target = PROMPT_TOOL_TARGETS.find((item) => item.trigger === trigger);
    if (!target) continue;
    seen.add(trigger);
    tags.push(target);
  }

  return tags;
}

const GENERATION_COMMAND_IDS = ["imagine", "animate", "video"] as const;

const GENERATION_MODELS: Record<GenerationCommandId, GenerationModelOption[]> = {
  imagine: [
    { id: "nana-banana-pro", brand: "nana banana", version: "pro" },
    { id: "nana-banana-2", brand: "nana banana", version: "2" },
    { id: "recraft-v4-1", brand: "recraft", version: "v4.1" },
    { id: "gpt-image-2", brand: "gpt image", version: "2" },
    { id: "higgsfield-popcorn", brand: "higgsfield", version: "popcorn" },
    { id: "higgsfield-soul-cinema", brand: "higgsfield", version: "soul cinema" },
    { id: "grok-imagine", brand: "grok", version: "imagine" },
    { id: "flux-2", brand: "flux", version: "2" },
    { id: "reve", brand: "reve", version: "image" },
    { id: "z-image", brand: "z-image", version: "base" },
    { id: "topaz", brand: "topaz", version: "upscale" },
  ],
  animate: [
    { id: "higgsfield-animate", brand: "higgsfield", version: "animate" },
    { id: "seedance-motion", brand: "seedance", version: "motion" },
    { id: "kling-3", brand: "kling", version: "3.0" },
    { id: "sora-2", brand: "sora", version: "2" },
    { id: "wan-2-7", brand: "wan", version: "2.7" },
  ],
  video: [
    { id: "higgsfield-dob", brand: "higgsfield", version: "dob" },
    { id: "seedance", brand: "seedance", version: "video" },
    { id: "kling-3", brand: "kling", version: "3.0" },
    { id: "sora-2", brand: "sora", version: "2" },
    { id: "google-veo-3-1", brand: "google veo", version: "3.1" },
    { id: "happy-horse", brand: "happy horse", version: "video" },
    { id: "grok-imagine-video", brand: "grok", version: "imagine" },
    { id: "wan-2-7", brand: "wan", version: "2.7" },
    { id: "minimax-hailuo-2-3", brand: "minimax hailuo", version: "2.3" },
  ],
};

function getGenerationCommandId(value: string): GenerationCommandId | undefined {
  const match = value.toLowerCase().match(/^\/(imagine|animate|video)\s+/);
  return match ? (match[1] as GenerationCommandId) : undefined;
}

const LLM_MODELS: LlmModelOption[] = [
  { id: "gpt-5-5-medium", brand: "gpt", version: "5.5 medium" },
  { id: "gpt-4o", brand: "gpt", version: "4o" },
  { id: "deepmind", brand: "deepmind", version: "reasoning" },
  { id: "claude-sonnet", brand: "claude", version: "sonnet" },
  { id: "gemini-pro", brand: "gemini", version: "pro" },
];

function getSlashToolCommand(value: string): PromptToolBadgeId | undefined {
  const match = value.toLowerCase().match(/^\/(web|search|google|deepmind|deep|think|llm|model)\s$/);
  if (!match) return undefined;

  switch (match[1]) {
    case "web":
    case "search":
      return "web";
    case "google":
      return "google";
    case "deepmind":
    case "deep":
    case "think":
      return "deepmind";
    case "llm":
    case "model":
      return "llm";
    default:
      return undefined;
  }
}

const INTERACTIVE_COMMANDS: PromptCommand[] = [
  {
    id: "imagine",
    label: "imagine",
    description: "create images",
    group: "generation",
    meta: GENERATION_MODELS.imagine[0]?.version,
    icon: <WandSparklesIcon size={20} strokeWidth={1.8} />,
  },
  {
    id: "animate",
    label: "animate",
    description: "animate an image",
    group: "generation",
    meta: GENERATION_MODELS.animate[0]?.version,
    icon: <SparklesIcon size={20} strokeWidth={1.8} />,
  },
  {
    id: "video",
    label: "video",
    description: "create video",
    group: "generation",
    meta: GENERATION_MODELS.video[0]?.version,
    icon: <ClapperboardIcon size={20} strokeWidth={1.8} />,
  },
  {
    id: "music",
    label: "music",
    description: "play a song",
    group: "tools",
    icon: <MusicIcon size={20} strokeWidth={1.8} />,
  },
  {
    id: "web",
    label: "web",
    description: "search the web",
    group: "tools",
    icon: <GlobeIcon size={20} strokeWidth={1.8} />,
  },
  {
    id: "search",
    label: "search",
    description: "search the web",
    group: "tools",
    icon: <GlobeIcon size={20} strokeWidth={1.8} />,
  },
  {
    id: "google",
    label: "google",
    description: "tag google search",
    group: "tools",
    icon: <span className="font-sans text-sm font-bold leading-none">g</span>,
  },
  {
    id: "deepmind",
    label: "deepmind",
    description: "deeper reasoning",
    group: "tools",
    icon: <BrainIcon size={20} strokeWidth={1.8} />,
  },
  {
    id: "llm",
    label: "llm",
    description: "choose model",
    group: "tools",
    meta: LLM_MODELS[0]?.version,
    icon: <CubeIcon size={20} strokeWidth={1.8} />,
  },
  {
    id: "chat",
    label: "chat",
    description: "start a clean thread",
    group: "commands",
    icon: <MessageQuestionIcon size={20} strokeWidth={1.8} />,
  },
  {
    id: "fast",
    label: "fast",
    description: "1.5x speed, increased usage",
    group: "commands",
    icon: <ZapIcon size={20} strokeWidth={1.8} />,
  },
  {
    id: "feedback",
    label: "feedback",
    description: "send feedback about this chat",
    group: "commands",
    icon: <MessageQuestionIcon size={20} strokeWidth={1.8} />,
  },
  {
    id: "goal",
    label: "goal",
    description: "set a goal for sustained work",
    group: "commands",
    icon: <Target01Icon size={20} strokeWidth={1.8} />,
  },
  {
    id: "mcp",
    label: "mcp",
    description: "show connected tool status",
    group: "commands",
    icon: <PlugSocketIcon size={20} strokeWidth={1.8} />,
  },
  {
    id: "model",
    label: "model",
    description: "choose reasoning model",
    group: "commands",
    meta: "gpt-5.5",
    icon: <CubeIcon size={20} strokeWidth={1.8} />,
  },
  {
    id: "browser",
    label: "browser",
    description: "control the in-app browser",
    group: "plugins",
    icon: <BrowserIcon size={20} strokeWidth={1.8} />,
  },
  {
    id: "documents",
    label: "documents",
    description: "create and edit documents",
    group: "plugins",
    icon: <DocumentAttachmentIcon size={20} strokeWidth={1.8} />,
  },
  {
    id: "imagegen",
    label: "imagegen",
    description: "generate or edit images",
    group: "skills",
    icon: <Image01Icon size={20} strokeWidth={1.8} />,
  },
  {
    id: "benchmark",
    label: "benchmark",
    description: "detect performance regressions",
    group: "skills",
    icon: <SparklesIcon size={20} strokeWidth={1.8} />,
  },
];

export interface CapturedPromptText {
  id: number;
  value: string;
}

export interface PromptDraftText {
  id: number;
  value: string;
}

function InteractivePromptBar({
  variant = "desktop",
  viewport,
  isDesktop,
  className,
  onSend: onSendExternal,
  onTextChange,
  onCancel: onCancelExternal,
  onLibrary,
  onPlus,
  autoFocus = false,
  keepFocusedOnSend = false,
  previewText,
  previewSuggestions,
  capturedText,
  draftText,
  heroSendOnly = false,
  transcriptPhase = "idle",
  transcriptText,
  isTranscriptFinal = false,
  autoSendTranscript = true,
}: {
  variant?: "desktop" | "phone";
  viewport?: GooeyViewportInput;
  isDesktop?: boolean;
  className?: string;
  onSend?: (text: string) => void;
  onTextChange?: (text: string) => void;
  onCancel?: () => void;
  onLibrary?: () => void;
  onPlus?: () => void;
  autoFocus?: boolean;
  keepFocusedOnSend?: boolean;
  previewText?: string;
  /** Cycles in the idle prompt bar (vertical). Falls back to `previewText` for input placeholder when focused. */
  previewSuggestions?: string[];
  /** App-shell keystrokes captured while the visible prompt input was not focused. */
  capturedText?: CapturedPromptText | null;
  /** Replaces the current draft, used by app-level edit flows. */
  draftText?: PromptDraftText | null;
  heroSendOnly?: boolean;
  transcriptPhase?: TranscriptPhase;
  transcriptText?: string;
  isTranscriptFinal?: boolean;
  autoSendTranscript?: boolean;
}) {
  const [state, setState] = React.useState<InteractiveState>(autoFocus ? "focused" : "idle");
  const [text, setText] = React.useState("");
  const [selectedMentions, setSelectedMentions] = React.useState<PromptMention[]>([]);
  const [attachedFiles, setAttachedFiles] = React.useState<PromptAttachment[]>([]);
  const [promptToolStates, setPromptToolStates] = React.useState<PromptToolStateMap>({
    web: { present: false, active: false },
    google: { present: false, active: false },
    deepmind: { present: false, active: false },
    llm: { present: false, active: false },
  });
  const [selectedLlmModelId, setSelectedLlmModelId] = React.useState(LLM_MODELS[0]?.id ?? "");
  const [selectedGenerationModels, setSelectedGenerationModels] = React.useState<Record<GenerationCommandId, string>>({
    imagine: GENERATION_MODELS.imagine[0]?.id ?? "",
    animate: GENERATION_MODELS.animate[0]?.id ?? "",
    video: GENERATION_MODELS.video[0]?.id ?? "",
  });
  const [splexOpen, setSplexOpen] = React.useState(false);
  const promptRootRef = React.useRef<HTMLDivElement>(null);
  const splexRef = React.useRef<HTMLDivElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const attachedFilesRef = React.useRef<PromptAttachment[]>([]);
  const lastTranscriptCommitRef = React.useRef<string | null>(null);
  const transcriptActiveRef = React.useRef(false);
  const lastCapturedTextIdRef = React.useRef<number | null>(null);
  const lastDraftTextIdRef = React.useRef<number | null>(null);

  const resolvedViewport = useGooeyViewport(viewport, isDesktop);
  const isDesktopLayout = !isCompactViewport(resolvedViewport);

  /** Check if last char typed triggers @mention (@ preceded by space or at start) */
  const shouldShowMentions = React.useCallback((val: string) => {
    const atIdx = val.lastIndexOf("@");
    if (atIdx === -1) return false;
    return atIdx === 0 || val[atIdx - 1] === " ";
  }, []);

  const activeGenerationCommand = React.useMemo(() => getGenerationCommandId(text), [text]);
  const generationModelOptions = activeGenerationCommand ? GENERATION_MODELS[activeGenerationCommand] : undefined;
  const selectedGenerationModel = activeGenerationCommand
    ? generationModelOptions?.find((model) => model.id === selectedGenerationModels[activeGenerationCommand]) ?? generationModelOptions?.[0]
    : undefined;
  const activeInlineTags = React.useMemo(() => parsePromptToolTags(text), [text]);
  const activePromptTools = React.useMemo<PromptToolBadge[]>(() => {
    const tools: PromptToolBadge[] = [];
    if (promptToolStates.web.present) {
      tools.push({
        id: "web",
        label: "web search",
        description: promptToolStates.web.active ? "included in this prompt" : "excluded from this prompt",
        active: promptToolStates.web.active,
        icon: <GlobeIcon size={16} strokeWidth={1.8} />,
      });
    }
    if (promptToolStates.google.present) {
      tools.push({
        id: "google",
        label: "google",
        description: promptToolStates.google.active ? "included in this prompt" : "excluded from this prompt",
        active: promptToolStates.google.active,
        icon: <span className="font-sans text-sm font-bold leading-none">g</span>,
      });
    }
    if (promptToolStates.deepmind.present) {
      tools.push({
        id: "deepmind",
        label: "deepmind",
        description: promptToolStates.deepmind.active ? "included in this prompt" : "excluded from this prompt",
        active: promptToolStates.deepmind.active,
        icon: <BrainIcon size={16} strokeWidth={1.8} />,
      });
    }
    if (promptToolStates.llm.present) {
      tools.push({
        id: "llm",
        label: "llm",
        description: promptToolStates.llm.active ? "model wrapper included" : "model wrapper excluded",
        active: promptToolStates.llm.active,
        icon: <CubeIcon size={16} strokeWidth={1.8} />,
      });
    }
    return tools;
  }, [promptToolStates]);
  const activeLlmModel = promptToolStates.llm.present
    ? LLM_MODELS.find((model) => model.id === selectedLlmModelId) ?? LLM_MODELS[0]
    : undefined;

  /** Check if value starts with / to trigger commands */
  // the command palette is a picker for the command name only. once the command
  // is committed (a space follows it), close the palette so the consumer's intent
  // preview (e.g. /music "now playing") owns the single expansion window.
  const shouldShowCommands = React.useCallback((val: string) => val.startsWith("/") && !getGenerationCommandId(val) && !/\s/.test(val), []);

  const activeMentionQuery = React.useMemo(() => {
    const atIdx = text.lastIndexOf("@");
    if (atIdx === -1) return "";
    const prefix = text.slice(0, atIdx);
    if (atIdx !== 0 && !prefix.endsWith(" ")) return "";
    const raw = text.slice(atIdx + 1);
    if (/\s/.test(raw)) return "";
    return raw.toLowerCase();
  }, [text]);

  const filteredMentionUsers = React.useMemo(() => {
    if (state !== "mentions") return INTERACTIVE_TAG_TARGETS;
    if (!activeMentionQuery) return INTERACTIVE_TAG_TARGETS;
    return INTERACTIVE_TAG_TARGETS.filter((item) => {
      const query = activeMentionQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query)
      );
    });
  }, [activeMentionQuery, state]);

  /** Filtered command list based on current text after "/" */
  const filteredCommands = React.useMemo(() => {
    if (state !== "commands") return undefined;
    const query = text.slice(1).toLowerCase();
    if (!query) return INTERACTIVE_COMMANDS;
    return INTERACTIVE_COMMANDS.filter((cmd) => cmd.id.startsWith(query) || cmd.label.startsWith(query));
  }, [state, text]);

  const addFiles = React.useCallback((files: FileList | File[]) => {
    const next = Array.from(files).map((file) => {
      const dot = file.name.lastIndexOf(".");
      const extension = dot >= 0 ? file.name.slice(dot) : "";
      const name = dot >= 0 ? file.name.slice(0, dot) : file.name;
      return {
        id: `${file.name}-${file.lastModified}-${file.size}`,
        name,
        extension,
        previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      };
    });
    if (!next.length) return;
    setAttachedFiles((current) => [...current, ...next]);
    setState("expanded");
  }, []);

  const removeAttachment = React.useCallback((id: string) => {
    setAttachedFiles((current) => {
      const target = current.find((file) => (file.id ?? `${file.name}${file.extension}`) === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      const next = current.filter((file) => (file.id ?? `${file.name}${file.extension}`) !== id);
      if (!next.length && text.length === 0) setState("focused");
      return next;
    });
  }, [text.length]);

  React.useEffect(() => {
    attachedFilesRef.current = attachedFiles;
  }, [attachedFiles]);

  React.useEffect(() => {
    return () => {
      attachedFilesRef.current.forEach((file) => {
        if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
      });
    };
  }, []);

  React.useEffect(() => {
    if (!splexOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && splexRef.current?.contains(target)) return;
      if (target instanceof Node && promptRootRef.current?.contains(target)) return;
      setSplexOpen(false);
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [splexOpen]);

  const commitMention = React.useCallback((name: string) => {
    const user = INTERACTIVE_TAG_TARGETS.find((entry) => entry.name === name);
    if (!user) return;
    setSelectedMentions((current) => (
      current.some((mention) => mention.name === user.name)
        ? current
        : [...current, { ...user, id: user.name.toLowerCase() }]
    ));
    setText((current) => {
      const atIdx = current.lastIndexOf("@");
      if (atIdx === -1) return current;
      const before = current.slice(0, atIdx).trimEnd();
      const after = current.slice(atIdx + 1).replace(/^\S*/, "");
      return `${before}${before ? " " : ""}${after}`.trimStart();
    });
    setState("focused");
  }, []);

  const activateSlashTool = React.useCallback((toolId: PromptToolBadgeId) => {
    setPromptToolStates((current) => ({
      ...current,
      [toolId]: { present: true, active: true },
    }));
    setText("");
    onTextChange?.("");
    setState("expanded");
  }, [onTextChange]);

  const togglePromptTool = React.useCallback((toolId: PromptToolBadgeId) => {
    setPromptToolStates((current) => ({
      ...current,
      [toolId]: {
        present: true,
        active: !current[toolId].active,
      },
    }));
  }, []);

  /** Handle text changes and derive state transitions */
  const handleValueChange = React.useCallback(
    (val: string) => {
      const slashTool = getSlashToolCommand(val);
      if (slashTool) {
        activateSlashTool(slashTool);
        return;
      }

      setText(val);
      onTextChange?.(val);

      if (val.length === 0) {
        setState("focused");
        return;
      }

      // Check / commands first (only when starting with /)
      if (shouldShowCommands(val)) {
        setState("commands");
        return;
      }

      if (parsePromptToolTags(val).length > 0) {
        setState("expanded");
        return;
      }

      // Check @mentions
      if (shouldShowMentions(val)) {
        setState("mentions");
        return;
      }

      // Long text stays inline on the single-row input (scrolls horizontally)
      // rather than expanding onto its own row above the buttons.
      // Staying "focused" also keeps the same input node, so fast keystrokes aren't dropped to a remount.
      setState("focused");
    },
    [activateSlashTool, shouldShowCommands, shouldShowMentions, onTextChange],
  );

  const deriveTextState = React.useCallback(
    (val: string): InteractiveState => {
      if (val.length === 0) return "focused";
      if (getSlashToolCommand(val)) return "expanded";
      if (shouldShowCommands(val)) return "commands";
      if (parsePromptToolTags(val).length > 0) return "expanded";
      if (shouldShowMentions(val)) return "mentions";
      // long text stays inline (single row, scrolls) — never expands above the buttons.
      return "focused";
    },
    [shouldShowCommands, shouldShowMentions],
  );

  /** Click to focus from idle (skip if a button was clicked, e.g. mic) */
  const handleBarClick = React.useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    if (state === "idle") {
      setState("focused");
    }
  }, [state]);

  /** Escape → idle, Enter → send */
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setText("");
        onTextChange?.("");
        setPromptToolStates({
          web: { present: false, active: false },
          google: { present: false, active: false },
          deepmind: { present: false, active: false },
          llm: { present: false, active: false },
        });
        onCancelExternal?.();
        setState(autoFocus || keepFocusedOnSend ? "focused" : "idle");
      }
      if (state === "mentions" && (e.key === "Enter" || e.key === "Tab" || e.key === " ")) {
        const first = filteredMentionUsers[0];
        if (first) {
          e.preventDefault();
          commitMention(first.name);
        }
        return;
      }
      if (e.key === "Enter" && !e.shiftKey && text.trim()) {
        e.preventDefault();
        if (text.trim()) onSendExternal?.(text.trim());
        onTextChange?.("");
        setText("");
        setSelectedMentions([]);
        setPromptToolStates({
          web: { present: false, active: false },
          google: { present: false, active: false },
          deepmind: { present: false, active: false },
          llm: { present: false, active: false },
        });
        setAttachedFiles((current) => {
          current.forEach((file) => {
            if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
          });
          return [];
        });
        setState(autoFocus || keepFocusedOnSend ? "focused" : "idle");
      }
    },
    [autoFocus, commitMention, filteredMentionUsers, keepFocusedOnSend, onCancelExternal, onSendExternal, onTextChange, state, text],
  );

  const handleBlur = React.useCallback(() => {
    if (text.length === 0) {
      setState(autoFocus || keepFocusedOnSend ? "focused" : "idle");
    }
  }, [autoFocus, keepFocusedOnSend, text]);

  /** Cancel button → idle */
  const handleCancel = React.useCallback(() => {
    setText("");
    onTextChange?.("");
    setSelectedMentions([]);
    setPromptToolStates({
      web: { present: false, active: false },
      google: { present: false, active: false },
      deepmind: { present: false, active: false },
      llm: { present: false, active: false },
    });
    setAttachedFiles((current) => {
      current.forEach((file) => {
        if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
      });
      return [];
    });
    onCancelExternal?.();
    setState(autoFocus || keepFocusedOnSend ? "focused" : "idle");
  }, [autoFocus, keepFocusedOnSend, onCancelExternal, onTextChange]);

  /** Send button → idle (or focused if keepFocusedOnSend) */
  const handleSend = React.useCallback(() => {
    if (text.trim() || selectedMentions.length || attachedFiles.length || activePromptTools.some((tool) => tool.active)) onSendExternal?.(text.trim());
    setText("");
    onTextChange?.("");
    setSelectedMentions([]);
    setPromptToolStates({
      web: { present: false, active: false },
      google: { present: false, active: false },
      deepmind: { present: false, active: false },
      llm: { present: false, active: false },
    });
    setAttachedFiles((current) => {
      current.forEach((file) => {
        if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
      });
      return [];
    });
    setState(autoFocus || keepFocusedOnSend ? "focused" : "idle");
  }, [activePromptTools, attachedFiles.length, autoFocus, keepFocusedOnSend, onSendExternal, onTextChange, selectedMentions.length, text]);

  /** Mic button → recording */
  const handleMic = React.useCallback(() => {
    setState("recording");
  }, []);

  const handleDrop = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (!e.dataTransfer.files.length) return;
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const handlePaste = React.useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    if (!e.clipboardData.files.length) return;
    addFiles(e.clipboardData.files);
  }, [addFiles]);

  React.useEffect(() => {
    if (!capturedText) return;
    if (lastCapturedTextIdRef.current === capturedText.id) return;
    lastCapturedTextIdRef.current = capturedText.id;

    setText((current) => {
      const next = `${current}${capturedText.value}`;
      setState(deriveTextState(next));
      onTextChange?.(next);
      return next;
    });
  }, [capturedText, deriveTextState, onTextChange]);

  React.useEffect(() => {
    if (!draftText) return;
    if (lastDraftTextIdRef.current === draftText.id) return;
    lastDraftTextIdRef.current = draftText.id;

    setText(draftText.value);
    setState(deriveTextState(draftText.value));
    onTextChange?.(draftText.value);
  }, [deriveTextState, draftText, onTextChange]);

  React.useEffect(() => {
    if (transcriptPhase === "recording") {
      transcriptActiveRef.current = true;
      setState("recording");
      return;
    }

    if (transcriptPhase === "transcribing") {
      const nextText = transcriptText ?? "";
      transcriptActiveRef.current = true;
      setText(nextText);
      setState(nextText.trim().length > 0 ? deriveTextState(nextText) : "focused");
      return;
    }

    if (!transcriptText) {
      if (transcriptActiveRef.current) {
        transcriptActiveRef.current = false;
        lastTranscriptCommitRef.current = null;
        setText("");
        setState(autoFocus || keepFocusedOnSend ? "focused" : "idle");
      }
      return;
    }

    const normalizedTranscript = transcriptText.trim();
    if (!normalizedTranscript) return;

    transcriptActiveRef.current = true;
    setText(normalizedTranscript);

    if (isTranscriptFinal) {
      if (lastTranscriptCommitRef.current === normalizedTranscript) return;
      lastTranscriptCommitRef.current = normalizedTranscript;

      if (autoSendTranscript) {
        onSendExternal?.(normalizedTranscript);
        setText("");
        setState(keepFocusedOnSend ? "focused" : "idle");
        return;
      }
    }

    setState(deriveTextState(normalizedTranscript));
  }, [
    autoFocus,
    autoSendTranscript,
    deriveTextState,
    isTranscriptFinal,
    keepFocusedOnSend,
    onSendExternal,
    transcriptPhase,
    transcriptText,
  ]);

  const filteredSuggestions = (previewSuggestions ?? []).filter(Boolean);
  const suggestions = filteredSuggestions.length > 1 ? filteredSuggestions : undefined;
  const hasPlaceholder = previewText !== undefined || filteredSuggestions.length > 0;
  const placeholder = previewText ?? filteredSuggestions[0] ?? "";

  // Derive PromptBar props from interactive state
  const barProps: PromptBarProps = {
    variant,
    viewport: resolvedViewport,
    className,
    value: text,
    onValueChange: handleValueChange,
    onCancel: handleCancel,
    onSend: handleSend,
    onMic: handleMic,
    onLibrary,
    // desktop owns the splex bloom; phone forwards to the app-level plus sheet.
    onPlus: () => {
      if (!isDesktopLayout) {
        onPlus?.();
        return;
      }

      setSplexOpen((open) => !open);
    },
    isSplexOpen: isDesktopLayout && splexOpen,
    selectedMentions,
    attachedFiles,
    activeInlineTags,
    activePromptTools,
    onPromptToolToggle: togglePromptTool,
    onMentionSelect: commitMention,
    onAttachmentRemove: removeAttachment,
    activeGenerationCommand,
    generationModel: selectedGenerationModel,
    generationModelOptions,
    onGenerationModelChange: (modelId) => {
      if (!activeGenerationCommand) return;
      setSelectedGenerationModels((current) => ({ ...current, [activeGenerationCommand]: modelId }));
    },
    activeLlmModel,
    llmModelOptions: LLM_MODELS,
    onLlmModelChange: setSelectedLlmModelId,
    heroSendOnly,
    ...(hasPlaceholder ? { placeholder } : {}),
    ...(suggestions ? { placeholderSuggestions: suggestions } : {}),
  };

  let content: React.ReactNode;
  switch (state) {
    case "idle":
      content = (
        <div onClick={handleBarClick} className="cursor-pointer">
          <PromptBar {...barProps} />
        </div>
      );
      break;

    case "focused":
      content = (
        <div onKeyDown={handleKeyDown} onBlur={handleBlur}>
          <PromptBar {...barProps} isFocused />
        </div>
      );
      break;

    case "expanded":
      content = (
        <div onKeyDown={handleKeyDown}>
          <PromptBar {...barProps} isTyping isExpanded />
        </div>
      );
      break;

    case "mentions":
      content = (
        <div onKeyDown={handleKeyDown}>
          <PromptBar {...barProps} mentionSuggestions={filteredMentionUsers.length ? filteredMentionUsers : INTERACTIVE_TAG_TARGETS} />
        </div>
      );
      break;

    case "commands":
      content = (
        <div onKeyDown={handleKeyDown}>
          <PromptBar
            {...barProps}
            commandList={filteredCommands?.length ? filteredCommands : INTERACTIVE_COMMANDS}
          />
        </div>
      );
      break;

    case "recording":
      content = <PromptBar {...barProps} isRecording />;
      break;
  }

  return (
    <div
      ref={promptRootRef}
      className="relative"
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes("Files")) e.preventDefault();
      }}
      onDrop={handleDrop}
      onPaste={handlePaste}
    >
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          if (e.target.files) addFiles(e.target.files);
          e.target.value = "";
          setSplexOpen(false);
        }}
      />
      <input
        ref={imageInputRef}
        type="file"
        multiple
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          if (e.target.files) addFiles(e.target.files);
          e.target.value = "";
          setSplexOpen(false);
        }}
      />
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          if (e.target.files) addFiles(e.target.files);
          e.target.value = "";
          setSplexOpen(false);
        }}
      />
      {content}
      {/* the splex sits just off the right edge of the bar and flows cleanly
          camera → image → folder, rather than bursting out of the + — desktop only */}
      {isDesktopLayout && (
        <div
          ref={splexRef}
          className="pointer-events-none absolute z-30"
          style={{ left: "calc(100% - 52px)", top: "50%", transform: "translateY(-50%)" }}
        >
          <Splex
            open={splexOpen}
            onCamera={() => cameraInputRef.current?.click()}
            onImage={() => imageInputRef.current?.click()}
            onFolder={() => fileInputRef.current?.click()}
          />
        </div>
      )}
    </div>
  );
}

export { PromptBar, InteractivePromptBar, type PromptBarProps };

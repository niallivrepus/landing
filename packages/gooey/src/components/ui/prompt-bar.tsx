import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

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
import { IconOnlyButton } from "./icon-only-button";
import { PasswordSafety } from "./password-safety";
import { PlayButton } from "./play-button";
import { SocialButton } from "./social-icons";
import { SpecialButton } from "./special-button";
import { VoiceMemoSimulation } from "./voice-memo";
import { Mic01Icon, Add01Icon, Tick01Icon, Cancel01Icon, UserIcon, SparklesIcon, ArrowRight01Icon, LockPasswordIcon, ArrowDown01Icon, Settings01Icon, Link01Icon, Image01Icon, File01Icon, QuoteUpIcon, Location01Icon, Share01Icon } from "hugeicons-react";
import { MediumTag } from "./medium-tag";
import { OO } from "./oo";

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
    <button
      type="button"
      aria-label="Command library"
      onClick={onClick}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        className,
      )}
    >
      <OO expression="default" className="shrink-0" style={{ width: 42, height: 42 }} />
    </button>
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
const SLIME_SHADOW = "inset 0px 2px 2px rgba(255, 255, 255, 0.15)";

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
  onSend?: () => void;
  onCancel?: () => void;
  onStop?: () => void;
  phoneCountry?: string;
  onPhoneCountryChange?: (code: string) => void;
  attachedFiles?: Array<{
    name: string;
    extension: string;
  }>;
  mentionSuggestions?: Array<{
    name: string;
    avatarSrc?: string;
    originColor?: "fruta" | "flame" | "solar" | "life" | "aether" | "insight" | "spirit";
    showOO?: boolean;
  }>;
  commandList?: string[];
  className?: string;
  /** Marketing hero: no mic/plus; 42×42 send control (black / white arrow; inverted in `.light`). */
  heroSendOnly?: boolean;
}

type TranscriptPhase = "idle" | "recording" | "transcribing";

const LIKTIR_FILL =
  "linear-gradient(180deg, var(--color-liktir-1) 0%, var(--color-liktir-2) 16%, var(--color-liktir-3) 32%, var(--color-liktir-4) 51.5%, var(--color-liktir-5) 72%, var(--color-liktir-6) 100%)";

function PromptBar({
  variant = "desktop",
  viewport,
  isDesktop,
  placeholder = "Search the Universe",
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
  mentionSuggestions,
  commandList,
  className,
  heroSendOnly = false,
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

  if (commandList && commandList.length > 0) {
    return (
      <div
        className={cn(
          "relative flex w-full flex-col gap-2 overflow-clip rounded-[24px] pt-4 pb-1 px-1 backdrop-blur-[25px]",
          promptBarWidthClass,
          className,
        )}
        style={{
          backgroundColor: "var(--color-light-glass-5)",
          border: "2px solid var(--color-light-glass-20)",
          boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Command tags */}
        <div className="flex flex-col gap-1 px-2">
          {commandList.map((cmd) => (
            <div
              key={cmd}
              className="relative inline-flex h-[32px] items-center px-3 rounded-[999px] backdrop-blur-[25px]"
              style={{
                backgroundColor: "var(--color-dark-glass-5)",
                border: "1px solid var(--color-light-glass-10)",
                fontFamily: '"Geist Mono", ui-monospace, monospace',
                fontSize: 12,
                color: "var(--color-light-space)",
              }}
            >
              /{cmd}
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.15)]" />
            </div>
          ))}
        </div>

        {/* Bottom bar — matches default pill layout exactly */}
        <div className="flex h-[42px] items-center justify-between w-full">
          <div className="flex flex-1 min-w-0 items-center gap-2">
            <PromptBarCommandLibraryButton onClick={onLibrary} className="shrink-0" />
            {onValueChange ? (
              <input
                type="text"
                autoFocus
                className="flex-1 min-w-0 bg-transparent border-none outline-none font-sans font-normal text-base leading-[1.4] text-light-space"
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
              />
            ) : (
              <span
                className="font-sans font-normal text-base"
                style={{ color: "var(--color-light-glass-80)" }}
              >
                /
              </span>
            )}
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
                <IconOnlyButton
                  size="small"
                  className="size-[42px]"
                  aria-label="Add attachment"
                  icon={<Add01Icon size={20} strokeWidth={1.8} />}
                  onClick={onPlus}
                />
              </>
            )}
          </div>
        </div>

        {/* Inner shadow overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.15)]" />
      </div>
    );
  }

  if (mentionSuggestions?.length) {
    return (
      <div
        className={cn(
          "relative flex w-full flex-col gap-[8px] overflow-clip rounded-[24px] pt-[16px] pb-[4px] px-[4px] backdrop-blur-[25px]",
          promptBarWidthClass,
          className,
        )}
        style={{
          backgroundColor: "var(--color-light-glass-5)",
          border: "2px solid var(--color-light-glass-20)",
          boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Suggestion stack */}
        <div className="flex flex-col gap-[4px] px-[8px] w-full">
          {mentionSuggestions.map((user) => (
            <div key={user.name} className="flex gap-[2px] items-center">
              <Avatar
                size="mini"
                src={user.avatarSrc}
                borderStyle="origins"
                originColor={user.originColor ?? "aether"}
                disableNavigation
                showOO={user.showOO}
                ooExpression="default"
              />
              <Badge label={user.name} color="neutral" variant="outline" size="tag" />
            </div>
          ))}
        </div>

        {/* Bottom bar — matches default pill layout exactly */}
        <div className="flex h-[42px] items-center justify-between w-full">
          <div className="flex flex-1 min-w-0 items-center gap-2">
            <PromptBarCommandLibraryButton onClick={onLibrary} className="shrink-0" />
            {onValueChange ? (
              <input
                type="text"
                autoFocus
                className="flex-1 min-w-0 bg-transparent border-none outline-none font-sans font-normal text-base leading-[1.4] text-light-space"
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
              />
            ) : (
              <span
                className="font-sans font-normal text-base"
                style={{ color: "var(--color-light-glass-80)" }}
              >
                @
              </span>
            )}
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
                <IconOnlyButton
                  size="small"
                  className="size-[42px]"
                  aria-label="Add attachment"
                  icon={<Add01Icon size={20} strokeWidth={1.8} />}
                  onClick={onPlus}
                />
              </>
            )}
          </div>
        </div>

        {/* Inner shadow overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.15)]" />
      </div>
    );
  }

  if (attachedFiles?.length) {
    return (
      <div
        className={cn(
          "relative flex w-full flex-col gap-[8px] overflow-clip rounded-[24px] pt-[12px] pb-[4px] px-[4px] backdrop-blur-[25px]",
          promptBarWidthClass,
          className,
        )}
        style={{
          backgroundColor: "var(--color-light-glass-5)",
          border: "2px solid var(--color-light-glass-20)",
          boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* File tags row */}
        <div className={cn(
          "flex gap-[4px] items-start px-[8px]",
          isDesktop ? "flex-nowrap overflow-x-auto" : "flex-wrap"
        )}>
          {attachedFiles.map((file) => {
            const FileIcon = getFileTypeIcon(file.extension);
            return (
              <MediumTag
                key={`${file.name}${file.extension}`}
                variant="file"
                label={file.name}
                secondaryLabel={file.extension}
                icon={<FileIcon size={20} strokeWidth={1.8} />}
                iconRight={<Cancel01Icon size={20} strokeWidth={1.8} />}
              />
            );
          })}
        </div>

        {/* Bottom bar */}
        <div className="flex items-center gap-[8px] w-full">
          <div className="flex flex-1 items-center gap-[8px]">
            <PromptBarCommandLibraryButton onClick={onLibrary} className="shrink-0" />
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
                <IconOnlyButton
                  size="small"
                  className="size-[42px]"
                  aria-label="Add attachment"
                  icon={<Add01Icon size={20} strokeWidth={1.8} />}
                  onClick={onPlus}
                />
              </>
            )}
          </div>
        </div>

        {/* Inner shadow overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.15)]" />
      </div>
    );
  }

  if (phoneCountry) {
    const country = COUNTRY_DIAL_CODES.find((c) => c.code === phoneCountry) ?? COUNTRY_DIAL_CODES[0];
    return (
      <div
        className={cn(
          "relative flex h-[50px] w-full items-center gap-[8px] rounded-[9999px] pl-[4px] pr-[20px] py-[4px] backdrop-blur-[25px]",
          promptBarWidthClass,
          className,
        )}
        style={{
          backgroundColor: "var(--color-light-glass-5)",
          border: "2px solid var(--color-light-glass-20)",
          boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Country selector tag */}
        <div
          className="relative flex h-[42px] shrink-0 items-center gap-[8px] rounded-[999px] pl-[5px] pr-[12px]"
          style={{
            backgroundColor: "var(--color-light-glass-5)",
            border: "1px solid var(--color-light-glass-20)",
            boxShadow: "0px 10px 20px rgba(0,0,0,0.1), inset 0px 2px 4px rgba(255,255,255,0.15)",
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
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.15)]" />
      </div>
    );
  }

  if (passwordStrength) {
    const isHidden = !isPasswordVisible && !!value;
    return (
      <div
        className={cn(
          "relative flex h-[50px] w-full items-center gap-[2px] rounded-[9999px] p-1 backdrop-blur-[25px]",
          promptBarWidthClass,
          className,
        )}
        style={{
          backgroundColor: "var(--color-light-glass-5)",
          border: "2px solid var(--color-light-glass-20)",
          boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.1)",
        }}
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
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.15)]" />
      </div>
    );
  }

  if (socialPlatform) {
    return (
      <div
        className={cn(
          "relative flex h-[50px] w-full items-center gap-2 rounded-[9999px] p-1 backdrop-blur-[25px]",
          promptBarWidthClass,
          className,
        )}
        style={{
          backgroundColor: "var(--color-light-glass-5)",
          border: "2px solid var(--color-light-glass-20)",
          boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.1)",
        }}
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
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.15)]" />
      </div>
    );
  }

  if (editProfile) {
    return (
      <div
        className={cn(
          "relative flex h-[50px] w-full items-center gap-1 rounded-[9999px] p-1 backdrop-blur-[25px]",
          promptBarWidthClass,
          className,
        )}
        style={{
          backgroundColor: "var(--color-light-glass-5)",
          border: "2px solid var(--color-light-glass-20)",
          boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.1)",
        }}
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
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.15)]" />
      </div>
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
      <div
        className={cn(
          "relative flex h-[50px] w-full items-center gap-[4px] rounded-[9999px] p-1 backdrop-blur-[25px]",
          promptBarWidthClass,
          className,
        )}
        style={{
          backgroundColor: "var(--color-light-glass-5)",
          border: "2px solid var(--color-light-glass-20)",
          boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.1)",
        }}
      >
        {isDesktopLayout ? (
          <>
            {/* Library */}
            <PromptBarCommandLibraryButton onClick={onLibrary} />

            {/* VoiceMemo fills center */}
            <div className="flex-1 min-w-0">
              <VoiceMemoSimulation className="h-[42px] w-full" />
            </div>

            {/* Send + Cancel */}
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
          </>
        ) : (
          <>
            {/* Cancel (X) */}
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
              onClick={onCancel}
            />

            {/* VoiceMemo fills center */}
            <div className="flex-1 min-w-0">
              <VoiceMemoSimulation className="h-[42px] w-full" />
            </div>

            {/* Send arrow */}
            <IconOnlyButton
              size="small"
              className="size-[42px]"
              variant="primary"
              aria-label="Send message"
              icon={<SendArrowIcon />}
              onClick={onSend}
            />
          </>
        )}

        {/* Inner shadow overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.15)]" />
      </div>
    );
  }

  if (isTyping && isExpanded) {
    return (
      <div
        className={cn(
          "relative flex w-full flex-col rounded-[24px] border-2 border-[var(--color-light-glass-20)] bg-[var(--color-light-glass-5)] pt-4 pb-1 px-1 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)] backdrop-blur-[25px] transition-all duration-300 ease-out",
          "light:border-[#E0E0E0] light:bg-white light:shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)]",
          promptBarWidthClass,
          className,
        )}
        style={{
          maxHeight: "40vh",
        }}
      >
        {isDesktopLayout ? (
          /* Desktop: text on top grows upward, icons pinned bottom */
          <>
            {/* Text content — scrolls when exceeding container */}
            <div className="w-full min-h-0 flex-1 overflow-y-auto px-3 pb-2">
              {onValueChange ? (
                <textarea
                  autoFocus
                  className="w-full bg-transparent border-none outline-none resize-none font-sans font-normal text-base leading-[1.4] text-light-space"
                  value={value}
                  onChange={(e) => onValueChange(e.target.value)}
                  rows={1}
                  ref={(el) => {
                    if (el) {
                      el.style.height = "auto";
                      el.style.height = el.scrollHeight + "px";
                    }
                  }}
                  style={{ maxHeight: "100%", overflow: "hidden" }}
                />
              ) : (
                <p className="font-sans font-normal text-base leading-[1.4] text-light-space whitespace-pre-wrap wrap-break-word">
                  {value}
                </p>
              )}
            </div>

            {/* Bottom bar — Library left, Mic + Plus right */}
            <div className="flex items-center justify-between w-full">
              <PromptBarCommandLibraryButton onClick={onLibrary} className="shrink-0" />
              {heroSendOnly ? (
                <HeroSendSquare onClick={onSend} hasText={value.trim().length > 0} />
              ) : (
                <div className="flex items-center gap-[2px] shrink-0">
                  <IconOnlyButton
                    size="small"
                    className="size-[42px]"
                    aria-label="Record audio"
                    icon={<Mic01Icon size={20} strokeWidth={1.8} />}
                    onClick={onMic}
                  />
                  <IconOnlyButton
                    size="small"
                    className="size-[42px]"
                    aria-label="Add attachment"
                    icon={<Add01Icon size={20} strokeWidth={1.8} />}
                    onClick={onPlus}
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          /* Phone: column stacked — text on top, icons on bottom */
          <>
            {/* Text content — scrolls when exceeding container */}
            <div className="w-full min-h-0 flex-1 overflow-y-auto px-3">
              {onValueChange ? (
                <textarea
                  autoFocus
                  className="w-full bg-transparent border-none outline-none resize-none font-sans font-normal text-base leading-[1.4] text-light-space"
                  value={value}
                  onChange={(e) => onValueChange(e.target.value)}
                  rows={1}
                  ref={(el) => {
                    if (el) {
                      el.style.height = "auto";
                      el.style.height = el.scrollHeight + "px";
                    }
                  }}
                  style={{ maxHeight: "100%", overflow: "hidden" }}
                />
              ) : (
                <p className="font-sans font-normal text-base leading-[1.4] text-light-space whitespace-pre-wrap wrap-break-word">
                  {value}
                </p>
              )}
            </div>

            {/* Bottom bar — 8px gap from text, Plus left / Mic right */}
            <div className="flex items-center justify-between w-full mt-2">
              {heroSendOnly ? (
                <HeroSendSquare className="ml-auto" onClick={onSend} hasText={value.trim().length > 0} />
              ) : (
                <>
                  <IconOnlyButton
                    size="small"
                    className="size-[42px]"
                    aria-label="Add attachment"
                    icon={<Add01Icon size={20} strokeWidth={1.8} />}
                    onClick={onPlus}
                  />
                  <IconOnlyButton
                    size="small"
                    className="size-[42px]"
                    aria-label="Record audio"
                    icon={<Mic01Icon size={20} strokeWidth={1.8} />}
                    onClick={onMic}
                  />
                </>
              )}
            </div>
          </>
        )}

        {/* Inner shadow overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.15)]" />
      </div>
    );
  }

  if (isTyping) {
    return (
      <div
        className={cn(
          "relative flex h-[50px] items-center justify-between rounded-[9999px] border-2 border-[var(--color-light-glass-20)] bg-[var(--color-light-glass-5)] py-1 pl-1 pr-[5px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)] backdrop-blur-[25px] transition-all duration-300 ease-out",
          "light:border-[#E0E0E0] light:bg-white light:shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)]",
          isDesktop ? "w-[450px]" : "w-[366px]",
          className,
        )}
      >
        {isDesktop ? (
          <>
            {/* Left group: Library + input */}
            <div className="flex flex-1 min-w-0 items-center gap-2">
              <PromptBarCommandLibraryButton onClick={onLibrary} className="shrink-0" />
              <input
                type="text"
                className="flex-1 min-w-0 bg-transparent border-none outline-none font-sans font-normal text-base leading-[1.4] text-light-space placeholder:text-light-space/50"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onValueChange?.(e.target.value)}
              />
            </div>

            {/* Right group: Send + Cancel */}
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
              <input
                type="text"
                className="flex-1 min-w-0 bg-transparent border-none outline-none font-sans font-normal text-base leading-[1.4] text-light-space placeholder:text-light-space/50"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onValueChange?.(e.target.value)}
              />
            </div>

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
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.15)]" />
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div
        className={cn(
          "relative flex h-[50px] items-center justify-between rounded-[9999px] p-1 backdrop-blur-[25px]",
          isDesktop ? "w-[450px]" : "w-[366px]",
          className,
        )}
        style={{
          backgroundColor: "var(--color-light-glass-5)",
          border: "2px solid var(--color-light-glass-20)",
          boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.1)",
        }}
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
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.15)]" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex h-[50px] items-center justify-between rounded-[9999px] border-2 border-white/20 bg-white/5 p-1 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)] backdrop-blur-[25px]",
        "light:border-[#E0E0E0] light:bg-white light:shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)]",
        isDesktop ? "w-[450px]" : "w-[366px]",
        className,
      )}
    >
      {/* Left group */}
      <div className="flex flex-1 min-w-0 items-center gap-2">
        {isDesktop || heroSendOnly ? (
          <PromptBarCommandLibraryButton onClick={onLibrary} className="shrink-0" />
        ) : (
          <IconOnlyButton
            size="small"
            className="size-[42px] shrink-0"
            aria-label="Add attachment"
            icon={<Add01Icon size={20} strokeWidth={1.8} />}
            onClick={onPlus}
          />
        )}
        {isFocused ? (
          <input
            type="text"
            autoFocus
            data-prompt-input
            className="flex-1 min-w-0 bg-transparent border-none outline-none font-sans font-normal text-base leading-[1.4] text-light-space"
            style={{ color: "var(--color-light-space)" }}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onValueChange?.(e.target.value)}
          />
        ) : placeholderSuggestions && placeholderSuggestions.filter(Boolean).length > 0 ? (
          <RotatingPlaceholderSuggestions suggestions={placeholderSuggestions} />
        ) : (
          <span className="min-w-0 flex-1 truncate font-sans font-normal text-base leading-[1.4] text-light-space">
            {placeholder}
          </span>
        )}
      </div>

      {/* Right group */}
      {heroSendOnly ? (
        <HeroSendSquare onClick={onSend} hasText={value.trim().length > 0} />
      ) : isDesktop ? (
        <div className="flex items-center gap-[2px]">
          <IconOnlyButton
            size="small"
            className="size-[42px]"
            aria-label="Record audio"
            icon={<Mic01Icon size={20} strokeWidth={1.8} />}
            onClick={onMic}
          />
          <IconOnlyButton
            size="small"
            className="size-[42px]"
            aria-label="Add attachment"
            icon={<Add01Icon size={20} strokeWidth={1.8} />}
            onClick={onPlus}
          />
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

      {/* Inner shadow overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.15)]" />
    </div>
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
              border: "2px solid var(--color-red-4)",
              color: "var(--color-red-4)",
              backdropFilter: "blur(25px)",
              boxShadow:
                "0px 1px 4px 0px rgba(0,0,0,0.1), inset 0px 2px 4px 0px rgba(255,255,255,0.15)",
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
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "2px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(25px)",
              boxShadow:
                "0px 1px 4px 0px rgba(0,0,0,0.1), inset 0px 2px 4px 0px rgba(255,255,255,0.15)",
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
    <div
      className={cn(
        "relative flex h-[50px] w-full items-center gap-2 rounded-[9999px] p-1 backdrop-blur-[25px]",
        widthClass,
        className,
      )}
      style={{
        backgroundColor: "var(--color-light-glass-5)",
        border: "2px solid var(--color-light-glass-20)",
        boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.1)",
      }}
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
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.15)]" />
    </div>
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

/** Homepage hero: 42×42 circle; empty = #F5F5F5 + dark arrow; with text = #3A3A3A + white arrow. */
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
        "inline-flex size-[42px] shrink-0 items-center justify-center rounded-full transition-[background-color,color,opacity] duration-200 focus-visible:outline-none focus-visible:ring-2",
        hasText
          ? "bg-[#3A3A3A] text-white hover:opacity-90 focus-visible:ring-white/40 light:bg-black light:text-white light:focus-visible:ring-white/35"
          : "bg-[#3A3A3A] text-white hover:bg-[#444444] focus-visible:ring-white/40 light:bg-[#F5F5F5] light:text-zinc-800 light:hover:bg-[#EBEBEB] light:focus-visible:ring-black/25",
        className,
      )}
      aria-label="Send message"
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
        boxShadow: "inset 0px 1px 1px rgba(255,255,255,0.15)",
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
  { name: "Ganja", originColor: "aether" as const },
  { name: "Gabs", originColor: "spirit" as const },
  { name: "Gabba", originColor: "flame" as const },
];

const INTERACTIVE_COMMANDS = ["envision", "persona", "location", "gadget", "web"];

/** Width threshold (px) at which text auto-expands to multi-line */
const EXPAND_THRESHOLD_DESKTOP = 280;
const EXPAND_THRESHOLD_PHONE = 240;

function InteractivePromptBar({
  variant = "desktop",
  viewport,
  isDesktop,
  className,
  onSend: onSendExternal,
  autoFocus = false,
  keepFocusedOnSend = false,
  previewText,
  previewSuggestions,
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
  autoFocus?: boolean;
  keepFocusedOnSend?: boolean;
  previewText?: string;
  /** Cycles in the idle prompt bar (vertical). Falls back to `previewText` for input placeholder when focused. */
  previewSuggestions?: string[];
  heroSendOnly?: boolean;
  transcriptPhase?: TranscriptPhase;
  transcriptText?: string;
  isTranscriptFinal?: boolean;
  autoSendTranscript?: boolean;
}) {
  const [state, setState] = React.useState<InteractiveState>(autoFocus ? "focused" : "idle");
  const [text, setText] = React.useState("");
  const lastTranscriptCommitRef = React.useRef<string | null>(null);

  const resolvedViewport = useGooeyViewport(viewport, isDesktop);
  const expandThreshold = isCompactViewport(resolvedViewport)
    ? EXPAND_THRESHOLD_PHONE
    : EXPAND_THRESHOLD_DESKTOP;

  /** Check if text width exceeds the expand threshold */
  const isTextOverflowing = React.useCallback(
    (val: string) => {
      const widths = getCharWidths(val);
      const totalWidth = widths.reduce((sum, w) => sum + w, 0);
      return totalWidth > expandThreshold;
    },
    [expandThreshold],
  );

  /** Check if last char typed triggers @mention (@ preceded by space or at start) */
  const shouldShowMentions = React.useCallback((val: string) => {
    const atIdx = val.lastIndexOf("@");
    if (atIdx === -1) return false;
    return atIdx === 0 || val[atIdx - 1] === " ";
  }, []);

  /** Check if value starts with / to trigger commands */
  const shouldShowCommands = React.useCallback((val: string) => val.startsWith("/"), []);

  /** Filtered command list based on current text after "/" */
  const filteredCommands = React.useMemo(() => {
    if (state !== "commands") return undefined;
    const query = text.slice(1).toLowerCase();
    if (!query) return INTERACTIVE_COMMANDS;
    return INTERACTIVE_COMMANDS.filter((cmd) => cmd.startsWith(query));
  }, [state, text]);

  /** Handle text changes and derive state transitions */
  const handleValueChange = React.useCallback(
    (val: string) => {
      setText(val);

      if (val.length === 0) {
        setState("focused");
        return;
      }

      // Check / commands first (only when starting with /)
      if (shouldShowCommands(val)) {
        setState("commands");
        return;
      }

      // Check @mentions
      if (shouldShowMentions(val)) {
        setState("mentions");
        return;
      }

      // Check overflow for expanded
      if (isTextOverflowing(val)) {
        setState("expanded");
        return;
      }

      // Stay "focused" so PromptBar keeps the same input node (focused → typing used to remount and drop fast keystrokes).
      setState("focused");
    },
    [shouldShowCommands, shouldShowMentions, isTextOverflowing],
  );

  const deriveTextState = React.useCallback(
    (val: string): InteractiveState => {
      if (val.length === 0) return "focused";
      if (shouldShowCommands(val)) return "commands";
      if (shouldShowMentions(val)) return "mentions";
      if (isTextOverflowing(val)) return "expanded";
      return "focused";
    },
    [shouldShowCommands, shouldShowMentions, isTextOverflowing],
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
        setState("idle");
      }
      if (e.key === "Enter" && !e.shiftKey && text.trim()) {
        e.preventDefault();
        if (text.trim()) onSendExternal?.(text.trim());
        setText("");
        setState(keepFocusedOnSend ? "focused" : "idle");
      }
    },
    [text, onSendExternal, keepFocusedOnSend],
  );

  const handleBlur = React.useCallback(() => {
    if (text.length === 0) {
      setState("idle");
    }
  }, [text]);

  /** Cancel button → idle */
  const handleCancel = React.useCallback(() => {
    setText("");
    setState("idle");
  }, []);

  /** Send button → idle (or focused if keepFocusedOnSend) */
  const handleSend = React.useCallback(() => {
    if (text.trim()) onSendExternal?.(text.trim());
    setText("");
    setState(keepFocusedOnSend ? "focused" : "idle");
  }, [text, onSendExternal, keepFocusedOnSend]);

  /** Mic button → recording */
  const handleMic = React.useCallback(() => {
    setState("recording");
  }, []);

  React.useEffect(() => {
    if (transcriptPhase === "recording") {
      setState("recording");
      return;
    }

    if (transcriptPhase === "transcribing") {
      const nextText = transcriptText ?? "";
      setText(nextText);
      setState(nextText.trim().length > 0 ? deriveTextState(nextText) : "focused");
      return;
    }

    if (!transcriptText) return;

    const normalizedTranscript = transcriptText.trim();
    if (!normalizedTranscript) return;

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
  const placeholder = previewText ?? filteredSuggestions[0];

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
    heroSendOnly,
    ...(placeholder ? { placeholder } : {}),
    ...(suggestions ? { placeholderSuggestions: suggestions } : {}),
  };

  switch (state) {
    case "idle":
      return (
        <div onClick={handleBarClick} className="cursor-pointer">
          <PromptBar {...barProps} />
        </div>
      );

    case "focused":
      return (
        <div onKeyDown={handleKeyDown} onBlur={handleBlur}>
          <PromptBar {...barProps} isFocused />
        </div>
      );

    case "expanded":
      return (
        <div onKeyDown={handleKeyDown}>
          <PromptBar {...barProps} isTyping isExpanded />
        </div>
      );

    case "mentions":
      return (
        <div onKeyDown={handleKeyDown}>
          <PromptBar {...barProps} mentionSuggestions={INTERACTIVE_MENTION_USERS} />
        </div>
      );

    case "commands":
      return (
        <div onKeyDown={handleKeyDown}>
          <PromptBar
            {...barProps}
            commandList={filteredCommands?.length ? filteredCommands : INTERACTIVE_COMMANDS}
          />
        </div>
      );

    case "recording":
      return (
        <PromptBar {...barProps} isRecording />
      );
  }
}

export { PromptBar, InteractivePromptBar, type PromptBarProps };

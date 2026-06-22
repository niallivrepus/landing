import type { ComponentType, ReactNode } from "react";
import {
  AiBrain02Icon,
  Alert02Icon,
  AnalyticsUpIcon,
  ApiIcon,
  AppleIcon,
  ArrowReloadHorizontalIcon,
  Beach02Icon,
  BirthdayCakeIcon,
  Bread03Icon,
  BubbleChatIcon,
  Call02Icon,
  CallIncoming01Icon,
  CallOutgoing01Icon,
  Calendar03Icon,
  Cash01Icon,
  CloudAngledRainIcon,
  Coins01Icon,
  ConnectIcon,
  CreditCardPosIcon,
  DeliveryBox01Icon,
  DrinkIcon,
  DropletIcon,
  Dumbbell01Icon,
  FastWindIcon,
  FavouriteCircleIcon,
  FireIcon,
  FlashIcon,
  GiftIcon,
  Hamburger02Icon,
  HourglassIcon,
  Image01Icon,
  Medicine02Icon,
  Message01Icon,
  Money03Icon,
  Moon02Icon,
  News01Icon,
  PencilEdit01Icon,
  PhoneOff01Icon,
  Plant03Icon,
  PlaneIcon,
  Rocket01Icon,
  RunningShoesIcon,
  ShoppingBasket01Icon,
  SmartPhone01Icon,
  SnowIcon,
  SparklesIcon,
  SpotifyIcon,
  StarIcon,
  Sun03Icon,
  Tag01Icon,
  Task01Icon,
  TradeUpIcon,
  Tree03Icon,
  Tv02Icon,
  VoiceIdIcon,
  YoutubeIcon,
} from "hugeicons-react";

import { cn } from "../../lib/utils";
import { sampleAvatar } from "../../lib/sample-avatars";
import { Avatar } from "./avatar";

/**
 * Spine — the vertical timeline of a user's life inside jokuh.
 *
 * Every activity the app witnesses accumulates here as an event: chats,
 * messages, favorites, notes, tasks, connections, blurbs, calls (auto
 * transcribed), plus the wider life-graph — health, food, calendar,
 * finance, crypto, shopping and subscriptions.
 *
 * The system is built from four spine elements that compile upward:
 *   SpineEventIcon → SpineEntryTag → SpineRow → SpineTimeline
 *
 * Every kind routes through the SPINE_KINDS registry, so adding a new
 * vertebra is one entry, never a new branch. Colors are energy-4 tokens
 * that carry meaning and invert with the active theme.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Energies + categories
// ─────────────────────────────────────────────────────────────────────────────

/** Energy hue that fills a spine symbol. "glass" = light-glass chip, "ink" = dark-space chip. */
export type SpineEnergy =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "cyan"
  | "blue"
  | "purple"
  | "pink"
  | "glass"
  | "ink";

/** Semantic family a kind belongs to — drives grouping in docs + filters. */
export type SpineCategory =
  | "comms"
  | "blurbs"
  | "life"
  | "health"
  | "food"
  | "calendar"
  | "finance"
  | "crypto"
  | "shopping"
  | "subscriptions";

// ─────────────────────────────────────────────────────────────────────────────
// Kinds
// ─────────────────────────────────────────────────────────────────────────────

export type SpineEventKind =
  // comms
  | "newChat"
  | "newMessage"
  | "event"
  | "connectedTo"
  | "newConnection"
  | "connected"
  | "disconnected"
  | "declined"
  | "call"
  | "incomingCall"
  | "outgoingCall"
  | "missedCall"
  | "recorded"
  // blurbs
  | "blurbOfTheDay"
  | "topBlurb"
  | "blurb"
  | "fireBlurb"
  | "icedBlurb"
  // life
  | "favorite"
  | "note"
  | "task"
  | "goal"
  | "bubbles"
  | "interests"
  | "treeOfLife"
  // health
  | "hydrate"
  | "boxBreathing"
  | "menstrualCycle"
  | "takeMedicine"
  | "goGym"
  | "stepCounter"
  | "sleep"
  | "wakeUp"
  // food
  | "breakfast"
  | "lunch"
  | "dinner"
  | "waterPlants"
  // calendar
  | "zodiac"
  | "zodiacReading"
  | "birthday"
  | "vacation"
  | "workSeason"
  | "flight"
  | "dayInPast"
  | "dayInFuture"
  | "weather"
  | "forecast"
  | "todaysNews"
  | "groceryReceipt"
  // finance
  | "addedCash"
  | "paymentScheduled"
  | "paymentRequested"
  | "creditCardDue"
  | "priceIncrease"
  | "priceAlert"
  | "trendingStock"
  // crypto
  | "tokenReward"
  | "tokenRewardAvax"
  | "tokenRewardSol"
  | "tokenRewardBat"
  | "tokenRewardXrp"
  | "tokenRewardBtc"
  | "newToken"
  | "swapped"
  | "nftBought"
  // shopping
  | "productBought"
  | "productShipped"
  // subscriptions
  | "electricityBill"
  | "esimBill"
  | "beachClub"
  | "netflixPayment"
  | "youtubePremium"
  | "spotifyPremium"
  | "newSubscription"
  | "recurringSubscription";

export type SpineOrigin = "fruta" | "flame" | "solar" | "life" | "aether" | "insight" | "spirit";

/** A person referenced inside an event tag. */
export interface SpinePerson {
  name: string;
  avatarSrc?: string;
  origin?: SpineOrigin;
  /** Render the OO mascot instead of a photo. */
  showOO?: boolean;
}

/** A small trailing chip (temperature, ticker, delta, "+123"…). */
export type SpineBadge = string | { text: string; tone?: SpineEnergy };

export interface SpineEvent {
  id: string;
  /** "HH:MM" — drives the hour gutter + grouping. */
  time: string;
  kind: SpineEventKind;
  /** Bold label, e.g. "New Message". Falls back to the kind's default label. */
  label?: string;
  /** Content shown inside the trailing glass pill. */
  content?: string;
  /** People shown inside the pill (avatars), e.g. message sender. */
  people?: SpinePerson[];
  /** "+4" style overflow count appended after avatars. */
  overflow?: number;
  /** Zodiac / date-range events: "19 MAR" → "19 APR". */
  dateRange?: { startDay: string; startMonth: string; endDay: string; endMonth: string };
  /** Extra trailing chips — temps, tickers, deltas. */
  badges?: SpineBadge[];
  /** Blurbs / specials get the turbo rainbow ring. */
  highlighted?: boolean;
}

/** How each spine event kind renders its circular energy symbol. */
export interface SpineKindStyle {
  /** 20x20 icon. */
  icon: ReactNode;
  /** Circle fill — energy-4 token, glass or gradient. */
  fill: string;
  /** Icon ink — black for yellow legibility, else white. */
  ink: "white" | "black";
  /** Glass circle instead of a solid energy fill (e.g. new chat). */
  glass?: boolean;
  /** Default bold label when an event omits one. */
  label: string;
  /** Semantic family. */
  category: SpineCategory;
  /** Energy hue (for filters / theming). */
  energy: SpineEnergy;
}

// ─────────────────────────────────────────────────────────────────────────────
// Kind registry — the systematization backbone
// ─────────────────────────────────────────────────────────────────────────────

const ICON = { size: 20, strokeWidth: 1 } as const;
const SPINE_ELEMENT_HEIGHT = 44;
const SPINE_SYMBOL_SIZE = SPINE_ELEMENT_HEIGHT;
/** symbol diameter inside the combined spine tag — matches the detail badge height so the pill reads as one row. */
const SPINE_TAG_SYMBOL = 32;
const SPINE_TAG_HEIGHT = 32;
const SPINE_BADGE_HEIGHT = 24;
const SPINE_PERSON_AVATAR = { width: 18, height: 24 } as const;
const SPINE_OUTLINE = "1px solid var(--color-light-glass-20)";

/** Aries ♈ — zodiac glyph, drawn rather than icon-fonted. */
function AriesGlyph() {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <path
        d="M4 13c-1.5-2-1.5-5 .5-6.6C6.2 5 8.5 5.4 10 8c1.5-2.6 3.8-3 5.5-1.6 2 1.6 2 4.6.5 6.6"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Resolve an energy hue to its symbol fill + legible ink. */
function energyFill(energy: SpineEnergy): { fill: string; ink: "white" | "black"; glass?: boolean } {
  if (energy === "glass") return { fill: "var(--color-light-glass-10)", ink: "white", glass: true };
  if (energy === "ink") return { fill: "var(--color-dark-space)", ink: "white" };
  return { fill: `var(--color-${energy}-4)`, ink: energy === "yellow" ? "black" : "white" };
}

type KindSeed = {
  Icon: ComponentType<{ size?: number; strokeWidth?: number }> | (() => ReactNode);
  energy: SpineEnergy;
  label: string;
  category: SpineCategory;
};

const SEED: Record<SpineEventKind, KindSeed> = {
  // comms
  newChat: { Icon: BubbleChatIcon, energy: "glass", label: "New Chat", category: "comms" },
  newMessage: { Icon: Message01Icon, energy: "green", label: "New Message", category: "comms" },
  event: { Icon: Calendar03Icon, energy: "blue", label: "Event", category: "comms" },
  connectedTo: { Icon: ApiIcon, energy: "purple", label: "Connected To", category: "comms" },
  newConnection: { Icon: ConnectIcon, energy: "green", label: "New Connection", category: "comms" },
  connected: { Icon: ConnectIcon, energy: "green", label: "Connected", category: "comms" },
  disconnected: { Icon: ConnectIcon, energy: "red", label: "Disconnected", category: "comms" },
  declined: { Icon: ConnectIcon, energy: "red", label: "Declined", category: "comms" },
  call: { Icon: Call02Icon, energy: "blue", label: "Call", category: "comms" },
  incomingCall: { Icon: CallIncoming01Icon, energy: "green", label: "Incoming Call", category: "comms" },
  outgoingCall: { Icon: CallOutgoing01Icon, energy: "blue", label: "Outgoing Call", category: "comms" },
  missedCall: { Icon: PhoneOff01Icon, energy: "red", label: "Missed Call", category: "comms" },
  recorded: { Icon: VoiceIdIcon, energy: "red", label: "Recorded", category: "comms" },
  // blurbs
  blurbOfTheDay: { Icon: FireIcon, energy: "ink", label: "Blurb Of The Day", category: "blurbs" },
  topBlurb: { Icon: FireIcon, energy: "ink", label: "Top Blurb", category: "blurbs" },
  blurb: { Icon: FireIcon, energy: "orange", label: "Blurb", category: "blurbs" },
  fireBlurb: { Icon: FireIcon, energy: "orange", label: "Fire Blurb", category: "blurbs" },
  icedBlurb: { Icon: SnowIcon, energy: "cyan", label: "Iced Blurb", category: "blurbs" },
  // life
  favorite: { Icon: StarIcon, energy: "yellow", label: "Favorite", category: "life" },
  note: { Icon: PencilEdit01Icon, energy: "yellow", label: "Note", category: "life" },
  task: { Icon: Task01Icon, energy: "green", label: "Task", category: "life" },
  goal: { Icon: SparklesIcon, energy: "purple", label: "Goal", category: "life" },
  bubbles: { Icon: SparklesIcon, energy: "purple", label: "Bubbles", category: "life" },
  interests: { Icon: FavouriteCircleIcon, energy: "yellow", label: "Interests", category: "life" },
  treeOfLife: { Icon: Tree03Icon, energy: "purple", label: "Tree Of Life", category: "life" },
  // health
  hydrate: { Icon: DrinkIcon, energy: "blue", label: "Hydrate", category: "health" },
  boxBreathing: { Icon: FastWindIcon, energy: "cyan", label: "Box Breathing", category: "health" },
  menstrualCycle: { Icon: DropletIcon, energy: "red", label: "Menstrual Cycle", category: "health" },
  takeMedicine: { Icon: Medicine02Icon, energy: "green", label: "Take Your Medicine", category: "health" },
  goGym: { Icon: Dumbbell01Icon, energy: "red", label: "Go Gym", category: "health" },
  stepCounter: { Icon: RunningShoesIcon, energy: "red", label: "Step Counter", category: "health" },
  sleep: { Icon: Moon02Icon, energy: "purple", label: "Sleep", category: "health" },
  wakeUp: { Icon: Sun03Icon, energy: "blue", label: "Wake Up", category: "health" },
  // food
  breakfast: { Icon: AppleIcon, energy: "green", label: "Breakfast", category: "food" },
  lunch: { Icon: Bread03Icon, energy: "yellow", label: "Lunch", category: "food" },
  dinner: { Icon: Hamburger02Icon, energy: "orange", label: "Dinner", category: "food" },
  waterPlants: { Icon: Plant03Icon, energy: "green", label: "Water Plants", category: "food" },
  // calendar
  zodiac: { Icon: AriesGlyph, energy: "orange", label: "Zodiac", category: "calendar" },
  zodiacReading: { Icon: Moon02Icon, energy: "cyan", label: "Zodiac Reading", category: "calendar" },
  birthday: { Icon: BirthdayCakeIcon, energy: "pink", label: "Birthday", category: "calendar" },
  vacation: { Icon: Tree03Icon, energy: "green", label: "Vacation", category: "calendar" },
  workSeason: { Icon: Rocket01Icon, energy: "orange", label: "Work Season", category: "calendar" },
  flight: { Icon: PlaneIcon, energy: "cyan", label: "Flight", category: "calendar" },
  dayInPast: { Icon: HourglassIcon, energy: "red", label: "A Day In The Past", category: "calendar" },
  dayInFuture: { Icon: HourglassIcon, energy: "cyan", label: "A Day In The Future", category: "calendar" },
  weather: { Icon: CloudAngledRainIcon, energy: "blue", label: "Weather", category: "calendar" },
  forecast: { Icon: AiBrain02Icon, energy: "blue", label: "Forecast", category: "calendar" },
  todaysNews: { Icon: News01Icon, energy: "red", label: "Today’s News", category: "calendar" },
  groceryReceipt: { Icon: ShoppingBasket01Icon, energy: "green", label: "Grocery Receipt", category: "calendar" },
  // finance
  addedCash: { Icon: Cash01Icon, energy: "green", label: "Added New Cash", category: "finance" },
  paymentScheduled: { Icon: Calendar03Icon, energy: "blue", label: "Payment Scheduled", category: "finance" },
  paymentRequested: { Icon: Money03Icon, energy: "orange", label: "Payment Requested", category: "finance" },
  creditCardDue: { Icon: CreditCardPosIcon, energy: "red", label: "Credit Card Due", category: "finance" },
  priceIncrease: { Icon: AnalyticsUpIcon, energy: "green", label: "Price Increase", category: "finance" },
  priceAlert: { Icon: Alert02Icon, energy: "yellow", label: "Price Alert", category: "finance" },
  trendingStock: { Icon: TradeUpIcon, energy: "green", label: "Trending Stock", category: "finance" },
  // crypto
  tokenReward: { Icon: GiftIcon, energy: "pink", label: "Token Reward", category: "crypto" },
  tokenRewardAvax: { Icon: GiftIcon, energy: "pink", label: "Token Reward", category: "crypto" },
  tokenRewardSol: { Icon: GiftIcon, energy: "pink", label: "Token Reward", category: "crypto" },
  tokenRewardBat: { Icon: GiftIcon, energy: "pink", label: "Token Reward", category: "crypto" },
  tokenRewardXrp: { Icon: GiftIcon, energy: "pink", label: "Token Reward", category: "crypto" },
  tokenRewardBtc: { Icon: GiftIcon, energy: "pink", label: "Token Reward", category: "crypto" },
  newToken: { Icon: Coins01Icon, energy: "blue", label: "New Token", category: "crypto" },
  swapped: { Icon: ArrowReloadHorizontalIcon, energy: "orange", label: "Swapped", category: "crypto" },
  nftBought: { Icon: Image01Icon, energy: "purple", label: "NFT Bought", category: "crypto" },
  // shopping
  productBought: { Icon: ShoppingBasket01Icon, energy: "green", label: "Product Bought", category: "shopping" },
  productShipped: { Icon: DeliveryBox01Icon, energy: "blue", label: "Product Shipped", category: "shopping" },
  // subscriptions
  electricityBill: { Icon: FlashIcon, energy: "yellow", label: "Electricity Bill", category: "subscriptions" },
  esimBill: { Icon: SmartPhone01Icon, energy: "blue", label: "eSIM Bill", category: "subscriptions" },
  beachClub: { Icon: Beach02Icon, energy: "cyan", label: "Beach Club", category: "subscriptions" },
  netflixPayment: { Icon: Tv02Icon, energy: "red", label: "Netflix", category: "subscriptions" },
  youtubePremium: { Icon: YoutubeIcon, energy: "red", label: "Youtube Premium", category: "subscriptions" },
  spotifyPremium: { Icon: SpotifyIcon, energy: "green", label: "Spotify Premium", category: "subscriptions" },
  newSubscription: { Icon: Tag01Icon, energy: "purple", label: "New Subscription", category: "subscriptions" },
  recurringSubscription: { Icon: ArrowReloadHorizontalIcon, energy: "blue", label: "Recurring Subscription", category: "subscriptions" },
};

function buildKinds(): Record<SpineEventKind, SpineKindStyle> {
  const out = {} as Record<SpineEventKind, SpineKindStyle>;
  for (const key of Object.keys(SEED) as SpineEventKind[]) {
    const seed = SEED[key];
    const { fill, ink, glass } = energyFill(seed.energy);
    const Icon = seed.Icon as ComponentType<{ size?: number; strokeWidth?: number }>;
    out[key] = {
      icon: <Icon {...ICON} />,
      fill,
      ink,
      glass,
      label: seed.label,
      category: seed.category,
      energy: seed.energy,
    };
  }
  return out;
}

export const SPINE_KINDS: Record<SpineEventKind, SpineKindStyle> = buildKinds();

/** Kinds grouped by category — for docs, pickers and filters. */
export const SPINE_CATEGORIES = (Object.keys(SEED) as SpineEventKind[]).reduce(
  (acc, key) => {
    const cat = SEED[key].category;
    (acc[cat] ??= []).push(key);
    return acc;
  },
  {} as Record<SpineCategory, SpineEventKind[]>,
);

const SPINE_PEOPLE = {
  pepper: { name: "Pepper", origin: "aether", avatarSrc: sampleAvatar(3).src },
  drak: { name: "Drak", origin: "spirit", avatarSrc: sampleAvatar(6).src },
  josh: { name: "Josh", origin: "flame", avatarSrc: sampleAvatar(2).src },
  sean: { name: "Sean", origin: "life", avatarSrc: sampleAvatar(7).src },
} satisfies Record<string, SpinePerson>;

// ─────────────────────────────────────────────────────────────────────────────
// SpineEventIcon — the circular energy symbol that anchors every row
// ─────────────────────────────────────────────────────────────────────────────

export interface SpineEventIconProps {
  kind: SpineEventKind;
  size?: number;
  className?: string;
}

function SpineEventIcon({ kind, size = SPINE_SYMBOL_SIZE, className }: SpineEventIconProps) {
  const style = SPINE_KINDS[kind];

  return (
    <span
      className={cn("flex shrink-0 items-center justify-center rounded-full", className)}
      style={{
        width: size,
        height: size,
        background: style.fill,
        color: style.ink === "black" ? "#000" : "#fff",
        boxShadow: "0px 1px 3px rgba(0,0,0,0.35)",
        border: SPINE_OUTLINE,
      }}
    >
      {style.icon}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SpineEntryTag — the trailing glass pill (content + people + badges)
// ─────────────────────────────────────────────────────────────────────────────

export interface SpineEntryTagProps {
  event: SpineEvent;
  className?: string;
}

function badgeText(b: SpineBadge): string {
  return typeof b === "string" ? b : b.text;
}
function badgeTone(b: SpineBadge): SpineEnergy | undefined {
  return typeof b === "string" ? undefined : b.tone;
}

function SpineEntryTag({ event, className }: SpineEntryTagProps) {
  const { content, people, overflow, dateRange, badges } = event;
  if (!content && !people?.length && !dateRange && !badges?.length) return null;

  return (
    <div
      className={cn(
        "relative inline-flex max-w-full min-w-0 flex-nowrap items-center gap-1 overflow-hidden rounded-[999px] pl-1 pr-1.5",
        className,
      )}
      style={{
        height: SPINE_TAG_HEIGHT,
        backgroundColor: "var(--color-light-glass-5)",
        border: SPINE_OUTLINE,
        boxShadow: "none",
      }}
    >
      {people?.map((p, i) => (
        <span
          key={`${p.name}-${i}`}
          className="relative shrink-0 overflow-hidden rounded-full"
          style={{
            width: SPINE_PERSON_AVATAR.width,
            height: SPINE_PERSON_AVATAR.height,
            marginLeft: i > 0 ? -8 : 0,
            border: SPINE_OUTLINE,
          }}
        >
          {p.avatarSrc ? (
            <img src={p.avatarSrc} alt="" className="h-full w-full object-cover" />
          ) : (
            <Avatar
              size="micro"
              src={p.avatarSrc}
              borderStyle="origins"
              originColor={p.origin ?? "aether"}
              showOO={p.showOO}
              ooExpression="default"
              disableNavigation
            />
          )}
        </span>
      ))}

      {dateRange ? (
        <span
          className="flex min-w-0 max-w-full flex-nowrap items-center gap-x-1 pr-1 font-mono text-xs leading-none"
          style={{ color: "var(--color-orange-4)" }}
        >
          <span>{dateRange.startDay}</span>
          <span>{dateRange.startMonth}</span>
          <span style={{ color: "var(--color-smoke-4)" }}>|</span>
          <span>{dateRange.endDay}</span>
          <span>{dateRange.endMonth}</span>
        </span>
      ) : (
        content && (
          <span className="min-w-0 truncate px-1 font-sans text-sm leading-none text-light-space">
            {content}
            {overflow ? <span style={{ color: "var(--color-smoke-4)" }}> +{overflow}</span> : null}
          </span>
        )
      )}

      {badges?.map((b, i) => (
        <span
          key={`${badgeText(b)}-${i}`}
          className="inline-flex max-w-full shrink-0 items-center truncate rounded-[999px] px-2 font-mono text-xs leading-none"
          style={{
            height: SPINE_BADGE_HEIGHT,
            backgroundColor: "var(--color-light-glass-5)",
            border: SPINE_OUTLINE,
            color: badgeTone(b) ? `var(--color-${badgeTone(b)}-4)` : "var(--color-light-space)",
          }}
        >
          {badgeText(b)}
        </span>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SpineTag — the base spine element: one event = one rounded-full glass pill
// carrying [energy symbol] [label] [detail badge], on the prompt-bar surface.
// ─────────────────────────────────────────────────────────────────────────────

const TURBO_RING =
  "linear-gradient(90deg, var(--color-red-4), var(--color-orange-4), var(--color-yellow-4), var(--color-green-4), var(--color-blue-4), var(--color-purple-4), var(--color-pink-4))";

export interface SpineEventTagProps {
  event: SpineEvent;
  className?: string;
}

function SpineEventTag({ event, className }: SpineEventTagProps) {
  const label = event.label ?? SPINE_KINDS[event.kind].label;

  const pill = (
    <div
      data-spine-tag
      className={cn(
        "inline-flex min-w-0 max-w-full items-center gap-2 rounded-full p-1 backdrop-blur-[20px]",
        className,
      )}
      style={{
        backgroundColor: "var(--color-light-glass-5)",
        border: SPINE_OUTLINE,
        boxShadow: "0px 1px 4px 0px rgba(0,0,0,0.1)",
      }}
    >
      <span className="flex min-w-0 items-center gap-1.5 pr-1">
        <SpineEventIcon kind={event.kind} size={SPINE_TAG_SYMBOL} />
        <span className="min-w-0 truncate px-1 font-sans text-sm font-medium leading-[0.9] text-light-space">
          {label}
        </span>
      </span>
      <SpineEntryTag event={event} />
    </div>
  );

  // blurbs + specials wear the turbo rainbow ring around the whole tag.
  if (event.highlighted) {
    return (
      <div className="inline-flex max-w-full min-w-0 rounded-full p-px" style={{ background: TURBO_RING }}>
        {pill}
      </div>
    );
  }

  return pill;
}

// ─────────────────────────────────────────────────────────────────────────────
// SpineRow — one vertebra: [time gutter] [spine tag]
// ─────────────────────────────────────────────────────────────────────────────

export interface SpineRowProps {
  event: SpineEvent;
  /** Draws the hairline + shows the time in the gutter. */
  startsHour: boolean;
  className?: string;
}

function SpineRow({ event, startsHour, className }: SpineRowProps) {
  return (
    <div className={cn("relative", className)}>
      {startsHour && (
        <div
          className="absolute left-[48px] right-2 top-0 h-px"
          style={{ backgroundColor: "var(--color-light-glass-10)" }}
        />
      )}
      <div className="grid min-h-[48px] min-w-0 grid-cols-[40px_minmax(0,1fr)] items-center gap-2 py-1 sm:grid-cols-[48px_minmax(0,1fr)] sm:gap-3">
        <div className="font-mono text-xs" style={{ color: "var(--color-smoke-4)" }}>
          {startsHour ? event.time : ""}
        </div>
        <div className="flex min-w-0">
          <SpineEventTag event={event} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SpineTimeline — the scrolling vertical record, grouped by the hour
// ─────────────────────────────────────────────────────────────────────────────

export interface SpineTimelineProps {
  events: SpineEvent[];
  className?: string;
}

function SpineTimeline({ events, className }: SpineTimelineProps) {
  let lastHour = "";

  return (
    <div
      className={cn("relative w-full overflow-hidden rounded-[40px] p-3 backdrop-blur-[25px]", className)}
      style={{
        backgroundColor: "var(--color-dark-glass-5)",
        border: SPINE_OUTLINE,
        boxShadow: "0px 1px 4px 0px rgba(0,0,0,0.1)",
      }}
    >
      {events.map((event) => {
        const hour = event.time.slice(0, 2);
        const startsHour = hour !== lastHour;
        lastHour = hour;
        return <SpineRow key={event.id} event={event} startsHour={startsHour} />;
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sample data — a full day across every spine family
// ─────────────────────────────────────────────────────────────────────────────

export const SAMPLE_SPINE_EVENTS: SpineEvent[] = [
  {
    id: "e1",
    time: "01:00",
    kind: "zodiac",
    label: "Aries Season",
    dateRange: { startDay: "19", startMonth: "MAR", endDay: "19", endMonth: "APR" },
  },
  { id: "e2", time: "01:10", kind: "wakeUp" },
  { id: "e3", time: "01:15", kind: "weather", badges: ["15°", "Cloudy", { text: "19°", tone: "orange" }] },
  { id: "e4", time: "01:20", kind: "hydrate", content: "500ml" },
  { id: "e5", time: "01:40", kind: "breakfast", content: "Oats + berries" },

  { id: "e6", time: "02:00", kind: "newChat", content: "How to make new…" },
  {
    id: "e7",
    time: "02:20",
    kind: "newMessage",
    people: [SPINE_PEOPLE.pepper],
    content: "Pepper",
  },
  { id: "e8", time: "02:30", kind: "favorite", content: "apple.com" },
  { id: "e9", time: "02:45", kind: "note", content: "Get new plants" },
  { id: "e10", time: "02:55", kind: "task", content: "Ship the spine system" },
  { id: "e10b", time: "02:58", kind: "event", content: "TBV Ventures" },

  {
    id: "e11",
    time: "03:00",
    kind: "connectedTo",
    people: [SPINE_PEOPLE.pepper],
    content: "Pepper",
  },
  {
    id: "e11b",
    time: "03:10",
    kind: "newConnection",
    people: [SPINE_PEOPLE.pepper],
    content: "Pepper",
  },
  {
    id: "e12",
    time: "03:20",
    kind: "connected",
    people: [
      SPINE_PEOPLE.pepper,
      SPINE_PEOPLE.drak,
    ],
    content: "Pepper",
    overflow: 4,
  },
  { id: "e12b", time: "03:25", kind: "disconnected", people: [SPINE_PEOPLE.pepper], content: "Pepper" },
  { id: "e12c", time: "03:30", kind: "declined", people: [SPINE_PEOPLE.pepper], content: "Pepper" },
  {
    id: "e13",
    time: "03:40",
    kind: "missedCall",
    people: [SPINE_PEOPLE.josh],
    content: "Josh",
  },
  { id: "e14", time: "03:55", kind: "goGym", content: "Push day" },

  { id: "e15", time: "04:00", kind: "incomingCall", people: [SPINE_PEOPLE.pepper], content: "Dad" },
  { id: "e16", time: "04:10", kind: "outgoingCall", people: [SPINE_PEOPLE.josh], content: "Mom" },
  { id: "e17", time: "04:20", kind: "recorded", content: "Voice memo · 0:42" },
  { id: "e18", time: "04:30", kind: "blurbOfTheDay", content: "This is the data of…", highlighted: true },
  { id: "e19", time: "04:40", kind: "fireBlurb", content: "This is the best…" },
  { id: "e20", time: "04:50", kind: "icedBlurb", content: "Deal breaker…" },

  { id: "e21", time: "05:00", kind: "goal", content: "Build muscle" },
  { id: "e22", time: "05:10", kind: "bubbles", content: "Timmy", overflow: 10 },
  {
    id: "e23",
    time: "05:20",
    kind: "call",
    label: "Call · Sean",
    people: [SPINE_PEOPLE.sean],
    content: "“…really great work, let's ship it.”",
  },
  { id: "e24", time: "05:30", kind: "boxBreathing", content: "Timmy", overflow: 10 },
  { id: "e25", time: "05:40", kind: "waterPlants" },
  { id: "e26", time: "05:50", kind: "menstrualCycle" },

  { id: "e27", time: "06:00", kind: "forecast", content: "00 forecast" },
  { id: "e28", time: "06:10", kind: "lunch" },
  { id: "e29", time: "06:20", kind: "dinner" },
  { id: "e30", time: "06:30", kind: "takeMedicine" },
  { id: "e31", time: "06:40", kind: "stepCounter", badges: ["4,000", "Steps"] },
  { id: "e32", time: "06:50", kind: "sleep", label: "Go To Sleep" },

  { id: "e33", time: "07:00", kind: "interests", content: "Updated interests" },
  { id: "e34", time: "07:10", kind: "flight" },
  { id: "e35", time: "07:20", kind: "birthday", content: "Vi", badges: ["All Day"] },
  { id: "e36", time: "07:30", kind: "vacation", content: "Timmy", overflow: 10 },
  { id: "e37", time: "07:40", kind: "workSeason", content: "Nike" },
  { id: "e38", time: "07:50", kind: "treeOfLife" },

  { id: "e39", time: "08:00", kind: "dayInPast" },
  { id: "e40", time: "08:10", kind: "dayInFuture" },
  { id: "e41", time: "08:20", kind: "groceryReceipt", badges: ["123", "$"] },
  { id: "e42", time: "08:30", kind: "todaysNews" },
  { id: "e43", time: "08:40", kind: "zodiacReading", content: "Vi" },

  { id: "e44", time: "09:00", kind: "priceIncrease", badges: ["BTC", "10%"] },
  { id: "e45", time: "09:10", kind: "trendingStock", badges: ["ALWR", "120%"] },
  { id: "e46", time: "09:20", kind: "tokenReward", content: "4 ETH", badges: ["Reward"] },
  { id: "e47", time: "09:30", kind: "tokenRewardAvax", content: "1000 AVAX", badges: ["Reward"] },
  { id: "e48", time: "09:40", kind: "tokenRewardSol", content: "4 SOL", badges: ["Reward"] },
  { id: "e49", time: "09:50", kind: "tokenRewardBat", content: "8 BAT", badges: ["Reward"] },

  { id: "e50", time: "10:00", kind: "tokenRewardXrp", content: "8 XRP", badges: ["Reward"] },
  { id: "e51", time: "10:10", kind: "tokenRewardBtc", content: "1 BTC", badges: ["Reward"] },
  { id: "e52", time: "10:20", kind: "paymentScheduled", content: "4 ETH", badges: ["Cancel"] },
  { id: "e53", time: "10:30", kind: "paymentRequested", content: "4 ETH", badges: ["Cancel"] },
  { id: "e54", time: "10:40", kind: "priceAlert", badges: ["ETH", "3000", "$"] },
  { id: "e55", time: "10:50", kind: "newToken", content: "Super Mario", badges: ["New Token"] },

  { id: "e56", time: "11:00", kind: "swapped", content: "1 BTC → 1 BTC", badges: ["Swapped"] },
  { id: "e57", time: "11:10", kind: "nftBought", content: "4 ETH", badges: ["Bought"] },
  { id: "e58", time: "11:20", kind: "productBought", content: "Jokuh Shirt", badges: ["Bought"] },
  { id: "e59", time: "11:30", kind: "productShipped", content: "Jokuh Relic", badges: ["Track"] },
  { id: "e60", time: "11:40", kind: "netflixPayment", content: "Netflix", badges: ["3", "Days", "Cancel"] },
  { id: "e61", time: "11:50", kind: "electricityBill", content: "Electricity", badges: ["0.000012", "ETH", "Pay"] },

  { id: "e62", time: "12:00", kind: "esimBill", content: "eSIM", badges: ["0.000012", "ETH", "Pay"] },
  { id: "e63", time: "12:10", kind: "beachClub", content: "Beach Club", badges: ["$40", "See"] },
  { id: "e64", time: "12:20", kind: "creditCardDue", content: "Due", badges: ["1,124.124", "$", "See"] },
  { id: "e65", time: "12:30", kind: "addedCash", content: "New Cash", badges: ["1,124.124", "$", "See"] },
  { id: "e66", time: "12:40", kind: "youtubePremium", content: "Youtube Premium", badges: ["Edit"] },
  { id: "e67", time: "12:50", kind: "spotifyPremium", content: "Spotify Premium", badges: ["Edit"] },
  { id: "e68", time: "13:00", kind: "newSubscription", content: "New Subscription", badges: ["Edit"] },
  { id: "e69", time: "13:10", kind: "recurringSubscription", badges: ["15", "$", "Recurring"] },
];

export { SpineEventIcon, SpineEntryTag, SpineEventTag, SpineRow, SpineTimeline };

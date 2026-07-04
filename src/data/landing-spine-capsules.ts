/** **Purpose:** Demo day + hour capsule data for landing Spine and Calls immersive shells. */

export type LandingHourTone =
  | "empty"
  | "memory"
  | "task"
  | "note"
  | "reminder"
  | "call";

export type LandingDayCapsule = {
  id: string;
  year: number;
  monthLabel: string;
  weekday: string;
  day: number;
  isToday?: boolean;
};

export type LandingHourCapsule = {
  id: string;
  hour: number;
  label: string;
  tone: LandingHourTone;
  summary: string;
  detail?: string;
};

export const LANDING_SPINE_YEAR = 2026;

/** **Purpose:** Week strip around today for interactive day pills. */
export const LANDING_SPINE_DAYS: LandingDayCapsule[] = [
  { id: "jul-2", year: 2026, monthLabel: "July", weekday: "Wed", day: 2 },
  { id: "jul-3", year: 2026, monthLabel: "July", weekday: "Thu", day: 3 },
  { id: "jul-4", year: 2026, monthLabel: "July", weekday: "Fri", day: 4, isToday: true },
  { id: "jul-5", year: 2026, monthLabel: "July", weekday: "Sat", day: 5 },
  { id: "jul-6", year: 2026, monthLabel: "July", weekday: "Sun", day: 6 },
];

/** **Purpose:** Hour ticks keyed by day id — mirrors Spine baby hour capsules. */
export const LANDING_SPINE_HOURS_BY_DAY: Record<string, LandingHourCapsule[]> = {
  "jul-4": [
    {
      id: "h-july4-freedom",
      hour: 12,
      label: "12 PM",
      tone: "memory",
      summary: "The Next Version of Freedom",
      detail: "Sean Rock · Independence Day essay on Spine.",
    },
    { id: "h-2", hour: 2, label: "2 AM", tone: "note", summary: "Get new plants", detail: "Sticky note logged after late scroll." },
    { id: "h-3", hour: 3, label: "3 AM", tone: "task", summary: "Ship the spine system", detail: "Planner task still open." },
    { id: "h-4", hour: 4, label: "4 AM", tone: "call", summary: "Incoming call · Dad", detail: "4:00 AM · Pepper · answered on watch." },
    { id: "h-5", hour: 5, label: "5 AM", tone: "memory", summary: "Blurb of the day", detail: "Highlighted memory from yesterday's call." },
    { id: "h-6", hour: 6, label: "6 AM", tone: "reminder", summary: "Take medicine", detail: "Recurring health reminder." },
    { id: "h-9", hour: 9, label: "9 AM", tone: "task", summary: "TBV Ventures", detail: "Calendar block with prep note attached." },
  ],
  "jul-3": [
    { id: "h-10-prev", hour: 10, label: "10 AM", tone: "memory", summary: "Voice memo · 0:42", detail: "Captured idea for Spine hour capsules." },
    { id: "h-15-prev", hour: 15, label: "3 PM", tone: "note", summary: "Oats + berries", detail: "Meal note from breakfast log." },
  ],
  "jul-5": [
    { id: "h-11-next", hour: 11, label: "11 AM", tone: "reminder", summary: "Founders sync", detail: "Scheduled reminder with call link." },
  ],
};

/** **Purpose:** Call-focused hour ticks for the Calls immersive shell. */
export const LANDING_CALLS_HOURS_BY_DAY: Record<string, LandingHourCapsule[]> = {
  "jul-4": [
    { id: "c-h-3", hour: 3, label: "3 AM", tone: "call", summary: "Missed · Josh", detail: "Returned at 4:10 AM." },
    { id: "c-h-4-in", hour: 4, label: "4 AM", tone: "call", summary: "Incoming · Dad", detail: "Sterling close prep — deal room still live." },
    { id: "c-h-4-out", hour: 4, label: "4 AM", tone: "call", summary: "Outgoing · Mom", detail: "Quick check-in before standup." },
    { id: "c-h-5", hour: 5, label: "5 AM", tone: "call", summary: "Deal room · Sean", detail: "“…really great work, let's ship it.”" },
  ],
  "jul-3": [
    { id: "c-h-16", hour: 16, label: "4 PM", tone: "call", summary: "Founders call recap", detail: "Pricing tiers landed — OO has the full recap." },
  ],
};

/** **Purpose:** Default today id for capsule strips. */
export const LANDING_DEFAULT_DAY_ID =
  LANDING_SPINE_DAYS.find((day) => day.isToday)?.id ?? LANDING_SPINE_DAYS[0]!.id;

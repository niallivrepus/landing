/**
 * **Purpose:** The "day in the life" story's script: one beat per moment of a believable day, each with a time-of-day
 * label, one short caption and a duration. Pure data + timeline maths, shared by the auto-play overlay
 * (`DayStoryPlayer`), the scroll-scrubbed section (`DayStoryScroll`) and the stage (`DayStoryStage`). Tiny on
 * purpose: it ships in the main bundle so the scroll section can hold its height and list the captions for screen
 * readers before the stage chunk loads.
 * **Copy rule:** only what Jokuh really does (calls with transcription, Spine memories, ID, profile pods, DMs + OO
 * coach, wallet pay, meetings + recaps, Docs/Spaces, Mail, Ask OO, agents that ask first, Bubbles, Studio, Arcade,
 * Blurbs, Profile Live / the Orb). Data is illustrative.
 */

export type DayBeat = {
  id: string;
  /** Time-of-day label, lower-case am/pm. */
  time: string;
  /** One short caption. */
  caption: string;
  /** Seconds this beat plays for. */
  dur: number;
  /** Desktop app (the morning at your desk) or the phone (the rest of the day). */
  form: "desktop" | "mobile";
  /** Where the beat's still frame sits (fraction of `dur`, default 0.9): Reduce Motion and step-through use it. */
  still?: number;
};

export const DAY_BEATS: readonly DayBeat[] = [
  // At your desk: the desktop app.
  { id: "call", time: "7:58 am", caption: "Maya's calling. It rises out of the Nexus.", dur: 3.4, form: "desktop", still: 0.72 },
  { id: "transcript", time: "7:59 am", caption: "Pick up. Jokuh transcribes the call as you talk.", dur: 4.2, form: "desktop" },
  { id: "spine", time: "8:06 am", caption: "Hang up. The plan lands in your Spine.", dur: 3.4, form: "desktop" },
  { id: "id", time: "8:07 am", caption: "Tap Maya: her ID links your spot and your history.", dur: 3.4, form: "desktop" },
  { id: "profile", time: "8:15 am", caption: "Your own ID builds itself, pod by pod.", dur: 4.2, form: "desktop" },
  // Out the door: the same app on your phone.
  { id: "mobile", time: "8:52 am", caption: "Heading out. Jokuh goes mobile with you.", dur: 3, form: "mobile" },
  { id: "dm", time: "9:12 am", caption: "Text Maya. OO turns “Thursday?” into a meeting.", dur: 3.8, form: "mobile" },
  { id: "wallet", time: "9:13 am", caption: "She asks for last week's coffee. Paid, right in the chat.", dur: 3, form: "mobile" },
  { id: "meet", time: "10:30 am", caption: "Join the 10:30 from the group chat. Its call note lands in your Spine.", dur: 3.8, form: "mobile" },
  { id: "docs", time: "11:20 am", caption: "Turn the note into a Doc, share it to a Space, mail it out.", dur: 3.2, form: "mobile" },
  { id: "ask", time: "12:30 pm", caption: "Ask OO to plan your Thursday.", dur: 3.6, form: "mobile" },
  { id: "agents", time: "12:31 pm", caption: "OO's agents set your reminder and draft a heads-up to Leo and June, then ask before sending.", dur: 4, form: "mobile" },
  { id: "bubble", time: "3:00 pm", caption: "Maya starts a Bubble for the Tulum trip. Everyone drops ideas.", dur: 3.8, form: "mobile" },
  { id: "arcade", time: "5:20 pm", caption: "On the train, Leo challenges you in Arcade. You win.", dur: 2.8, form: "mobile" },
  { id: "blurb", time: "6:40 pm", caption: "Blurb the lake loop. Fire rolls in from your people.", dur: 4.2, form: "mobile" },
  { id: "orb", time: "9:00 pm", caption: "Go live in the Orb. Maya, Leo and the rest pull up a seat.", dur: 5, form: "mobile" },
  { id: "fold", time: "11:40 pm", caption: "The whole day folds into your Spine.", dur: 3.2, form: "mobile" },
  { id: "finale", time: "11:41 pm", caption: "This was your day.", dur: 3.4, form: "mobile" },
];

/** Beat index by id (the stage's JSX refers to beats by name). */
export const DB = Object.fromEntries(DAY_BEATS.map((b, i) => [b.id, i])) as Record<string, number>;

export const DAY_BEAT_COUNT = DAY_BEATS.length;

/** Start second of each beat. */
export const DAY_STARTS: readonly number[] = DAY_BEATS.reduce<number[]>((acc, _b, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1]! + DAY_BEATS[i - 1]!.dur);
  return acc;
}, []);

export const DAY_TOTAL = DAY_STARTS[DAY_BEAT_COUNT - 1]! + DAY_BEATS[DAY_BEAT_COUNT - 1]!.dur;

/** Which beat plays at second `t`. */
export function dayBeatAt(t: number): number {
  if (t <= 0) return 0;
  for (let i = DAY_BEAT_COUNT - 1; i >= 0; i--) if (t >= DAY_STARTS[i]!) return i;
  return 0;
}

/** The beat's still frame (everything in it has arrived, nothing has left): used by Reduce Motion. */
export function dayStillTime(i: number): number {
  const b = DAY_BEATS[i]!;
  return DAY_STARTS[i]! + b.dur * (i === DAY_BEAT_COUNT - 1 ? 0.98 : b.still ?? 0.9);
}

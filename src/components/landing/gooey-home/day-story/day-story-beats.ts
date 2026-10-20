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
};

export const DAY_BEATS: readonly DayBeat[] = [
  { id: "call", time: "7:58 am", caption: "Maya's calling.", dur: 3 },
  { id: "transcript", time: "7:59 am", caption: "Pick up. Jokuh transcribes the call as you talk.", dur: 3.8 },
  { id: "spine", time: "8:06 am", caption: "Hang up. The good part lands in your Spine.", dur: 3.4 },
  { id: "id", time: "8:07 am", caption: "Your ID links it up: who Maya is, where you meet.", dur: 3.4 },
  { id: "profile", time: "8:15 am", caption: "Your profile builds itself, pod by pod.", dur: 4 },
  { id: "dm", time: "9:12 am", caption: "Text Maya. OO turns the plan into a meeting.", dur: 3.8 },
  { id: "wallet", time: "9:13 am", caption: "Pay her back for last week's coffee, right in the chat.", dur: 3 },
  { id: "meet", time: "10:30 am", caption: "Join the 10:30. The call note lands in your Spine.", dur: 3.8 },
  { id: "docs", time: "11:20 am", caption: "Make it a Doc, share it to a Space, mail it out.", dur: 3.2 },
  { id: "ask", time: "12:30 pm", caption: "Ask OO to plan your Thursday.", dur: 3.6 },
  { id: "agents", time: "12:31 pm", caption: "Agents do the legwork, and ask before they act.", dur: 4 },
  { id: "bubble", time: "3:00 pm", caption: "Moodboard the trip with friends in a Bubble.", dur: 3.8 },
  { id: "arcade", time: "5:20 pm", caption: "A quick match in Arcade.", dur: 2.8 },
  { id: "blurb", time: "6:40 pm", caption: "Blurb the lake loop. The Fire rolls in.", dur: 3.2 },
  { id: "orb", time: "9:00 pm", caption: "Go live in the Orb. Your people pull up a seat.", dur: 5 },
  { id: "fold", time: "11:40 pm", caption: "The whole day folds into your Spine.", dur: 3.2 },
  { id: "finale", time: "11:41 pm", caption: "This was your day.", dur: 3.4 },
];

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
  return DAY_STARTS[i]! + b.dur * (i === DAY_BEAT_COUNT - 1 ? 0.98 : 0.9);
}

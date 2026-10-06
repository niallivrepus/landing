import { useEffect, useState } from "react";

/**
 * **Purpose:** PS5-style quiet clock in the top-trailing area (desktop only; CSS hides it below 1024px so it
 * never fights the Spine corner pill). Ticks on the minute boundary, tabular numerals, visitor's locale.
 * **Connects to:** `ConsoleHomeShell`, `.console-clock` in `landing-console-home.css`.
 */
export function ConsoleClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let timer = 0;
    const schedule = () => {
      const current = new Date();
      setNow(current);
      timer = window.setTimeout(schedule, 60_000 - (current.getSeconds() * 1000 + current.getMilliseconds()) + 20);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, []);

  const time = now.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  return (
    <time className="console-clock" dateTime={now.toISOString()} aria-label={`Local time ${time}`}>
      {time}
    </time>
  );
}

import { useEffect, useMemo, useState } from "react";
import { INVEST_TOKEN_RELEASE_AT } from "../../data/invest-overview";

type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  complete: boolean;
};

/**
 * **Purpose:** Live countdown to the published economy token release (August 8, 2026).
 * **Connects to:** `InvestPage`, `invest-overview.ts`, `landing-invest.css` digit styling.
 */
function computeCountdown(targetMs: number, nowMs: number): CountdownParts {
  const remaining = Math.max(0, targetMs - nowMs);
  if (remaining <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, complete: true };
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, complete: false };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function CountdownDigit({ label, value }: { label: string; value: string }) {
  return (
    <div className="landing-invest-countdown__unit" aria-hidden>
      <div className="landing-invest-countdown__digits">
        {value.split("").map((char, index) => (
          <span key={`${label}-${index}`} className="landing-invest-countdown__digit">
            {char}
          </span>
        ))}
      </div>
      <span className="landing-invest-countdown__label">{label}</span>
    </div>
  );
}

export function InvestTokenCountdown() {
  const targetMs = useMemo(() => new Date(INVEST_TOKEN_RELEASE_AT).getTime(), []);
  const [parts, setParts] = useState<CountdownParts>(() =>
    computeCountdown(targetMs, Date.now()),
  );

  useEffect(() => {
    const tick = () => setParts(computeCountdown(targetMs, Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetMs]);

  const ariaLabel = parts.complete
    ? "Economy token release is live"
    : `${parts.days} days, ${parts.hours} hours, ${parts.minutes} minutes, and ${parts.seconds} seconds until economy token release on August 8, 2026`;

  return (
    <div className="landing-invest-countdown" role="timer" aria-live="polite" aria-label={ariaLabel}>
      <div className="landing-invest-countdown__eyebrow">
        <span className="landing-invest-countdown__pulse" aria-hidden />
        Economy token release · August 8, 2026
      </div>

      {parts.complete ? (
        <p className="landing-invest-countdown__live">Release window open — purchase in the Jokuh app.</p>
      ) : (
        <div className="landing-invest-countdown__grid">
          <CountdownDigit label="Days" value={String(parts.days)} />
          <span className="landing-invest-countdown__sep" aria-hidden>
            :
          </span>
          <CountdownDigit label="Hours" value={pad(parts.hours)} />
          <span className="landing-invest-countdown__sep" aria-hidden>
            :
          </span>
          <CountdownDigit label="Min" value={pad(parts.minutes)} />
          <span className="landing-invest-countdown__sep" aria-hidden>
            :
          </span>
          <CountdownDigit label="Sec" value={pad(parts.seconds)} />
        </div>
      )}

      <p className="landing-invest-countdown__fine">
        Noon Eastern · On-platform purchase only · Full vesting calendar publishes before T-zero
      </p>
    </div>
  );
}

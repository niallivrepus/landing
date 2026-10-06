import { useId } from "react";

/**
 * **Purpose:** The official Jokuh mark (172×77 logo glob) behind the homepage prompt bar, the way the app's home
 * vortex shows it behind the search capsule: transparent liquid glass (backdrop blur + a theme-aware veil clipped to
 * the glob); on dark, a soft white glob fill keeps the mark visible.
 * **Parity (web app):** `frontend/src/components/home/HomeLogoGlobGlass.tsx` (`variant="behind"`), placement and glass
 * CSS from `styles/glass-core.css` (`.home-logo-glob-glass*`); Swift `LogoGlobGlassMark`.
 * **Connects to:** `ConsoleHomeShell` (OO prompt row), `.home-logo-glob-glass*` in `landing-console-home.css`.
 */

/** `d` matches the brand SVG / app `LOGO_GLOB_PATH_D`. */
export const LOGO_GLOB_PATH_D =
  'M142.016 0.932403C108.682 8.72952 90.1582 28.7787 86.5124 28.7787C82.8665 28.7787 64.3439 8.72952 31.0094 0.932403C6.76679 -4.73797 -9.67517 17.3088 6.39689 46.1367C16.3225 68.5169 26.4911 77 42.2975 77C54.8221 77 62.5651 70.4241 68.3839 66.5973C72.8064 63.6885 79.4705 58.459 86.5133 58.459C93.5562 58.459 100.219 63.6885 104.643 66.5973C110.462 70.4241 118.204 77 130.729 77C146.535 77 156.704 68.5169 166.63 46.1367C182.762 16.0622 166.261 -4.73702 142.018 0.933353L142.016 0.932403ZM72.6311 48.0068C69.5198 52.5882 46.8904 66.144 34.6969 58.3051C22.5034 50.4662 11.0634 24.0292 18.8915 18.3426C26.7197 12.6561 80.4592 36.4789 72.6311 48.0068ZM138.328 58.3051C126.134 66.144 103.505 52.5891 100.394 48.0068C92.5655 36.4789 146.306 12.6552 154.133 18.3417C161.96 24.0282 150.52 50.4662 138.328 58.3051Z';

/** App `HOME_LOGO_BEHIND_WIDTH_PX`. */
export const HOME_LOGO_BEHIND_WIDTH_PX = 240;

export function HomeLogoGlobGlass({ light, emphasized = false }: { light: boolean; emphasized?: boolean }) {
  const id = useId().replace(/:/g, "");
  const clipId = `${id}-clip`;
  const veilId = `${id}-veil`;
  const specularId = `${id}-specular`;
  const veil = light
    ? [
        ["0", "rgba(255,255,255,0.28)"],
        ["0.45", "rgba(255,255,255,0.12)"],
        ["1", "rgba(255,255,255,0.06)"],
      ]
    : [
        ["0", "rgba(255,255,255,0.34)"],
        ["0.42", "rgba(255,255,255,0.18)"],
        ["1", "rgba(255,255,255,0.10)"],
      ];
  return (
    <svg
      className={`home-logo-glob-glass home-logo-glob-glass--behind${emphasized ? " home-logo-glob-glass--emphasized" : ""}`}
      viewBox="0 0 172 77"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <path d={LOGO_GLOB_PATH_D} />
        </clipPath>
        <linearGradient id={veilId} x1="86" y1="0" x2="86" y2="77" gradientUnits="userSpaceOnUse">
          {veil.map(([offset, color]) => (
            <stop key={offset} offset={offset} stopColor={color} />
          ))}
        </linearGradient>
        <linearGradient id={specularId} x1="0" y1="0" x2="172" y2="77" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="rgba(255,255,255,0)" />
          <stop offset="0.45" stopColor="rgba(255,255,255,0.14)" />
          <stop offset="0.55" stopColor="rgba(255,255,255,0.20)" />
          <stop offset="1" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <g clipPath={`url(#${clipId})`} className="home-logo-glob-glass__glass-stack">
        {light ? null : <path d={LOGO_GLOB_PATH_D} className="home-logo-glob-glass__dark-base" fill="rgba(255,255,255,0.92)" />}
        <rect x="0" y="0" width="172" height="77" fill={`url(#${veilId})`} className="home-logo-glob-glass__veil" />
        <rect x="0" y="0" width="172" height="77" fill={`url(#${specularId})`} className="home-logo-glob-glass__specular" />
      </g>
    </svg>
  );
}

/**
 * Jokuh design colors: hex values per token for dark and light theme.
 * Used by the Color Library page to show accurate hex codes and swatch colors.
 * Source: Jokuh/colors/colors.json
 */

export type DarkLightHex = { dark: string; light: string };

/** Material gradient (precious metals): two stops, each with dark and light hex */
export type MaterialGradientHexes = { dark: [string, string]; light: [string, string] };

/** Multi-stop gradient with percentage stops */
export type GradientStop = { color: string; percent: number };
export type LinearGradient = {
  angle: string; // e.g. "135deg" for bottom-left to top-right
  dark: GradientStop[];
  light: GradientStop[];
};

/** Keyed by CSS var name (e.g. vanadium, crude-copper). JSON uses camelCase; we use kebab. */
const MATERIAL_GRADIENT_KEYS: Record<string, keyof typeof MATERIALS_GRADIENTS_JSON> = {
  vanadium: "vanadium",
  "crude-copper": "crudeCopper",
  copper: "copper",
  bronze: "bronze",
  steel: "steel",
  "rose-gold": "roseGold",
  gold: "gold",
  silver: "silver",
  platinum: "platinum",
  jaskmarr: "jaskmarr",
};

const MATERIALS_GRADIENTS_JSON = {
  vanadium: { dark: ["#0A0A0B", "#202027"], light: ["#0C0C0D", "#33333D"] },
  crudeCopper: { dark: ["#2E221C", "#724E43"], light: ["#4A372D", "#8E6052"] },
  copper: { dark: ["#7E5353", "#D09486"], light: ["#B67878", "#F5AE9F"] },
  bronze: { dark: ["#997468", "#E5AF9E"], light: ["#997468", "#E5AF9E"] },
  steel: { dark: ["#88837B", "#CDCBC8"], light: ["#A09A90", "#E9E7E4"] },
  roseGold: { dark: ["#BA8279", "#F9CEC5"], light: ["#E6A398", "#FFE9E5"] },
  gold: { dark: ["#CCAB88", "#FFF1DA"], light: ["#E7C29B", "#FFF5E4"] },
  silver: { dark: ["#CDD7D0", "#F3F0E4"], light: ["#CDD7D0", "#F3F0E4"] },
  platinum: { dark: ["#CCD4E9", "#E7FCF6"], light: ["#CCD4E9", "#E7FCF6"] },
  jaskmarr: { dark: ["#CCC3FF", "#F8E3FF"], light: ["#CCC3FF", "#F8E3FF"] },
} as const;

/** Materials (fantasy scales). Key = cssName (gronksh, plata, orro, drakzul, slyvir, adamant, mithrill, liktir, amfrill). */
const MATERIALS_JSON: Record<string, Record<string, DarkLightHex>> = {
  gronksh: {
    "1": { dark: "#0D0905", light: "#3E352C" },
    "2": { dark: "#3E3D3C", light: "#7B7977" },
    "3": { dark: "#191817", light: "#585451" },
    "4": { dark: "#2D2924", light: "#665E53" },
    "5": { dark: "#302D2A", light: "#68615B" },
    "6": { dark: "#867266", light: "#C4A796" },
    "7": { dark: "#494242", light: "#8A7C7C" },
  },
  plata: {
    "1": { dark: "#0D0905", light: "#716B64" },
    "2": { dark: "#4B4A49", light: "#848382" },
    "3": { dark: "#232120", light: "#6A6461" },
    "4": { dark: "#534F4A", light: "#8F8981" },
    "5": { dark: "#4B443C", light: "#8E8274" },
    "6": { dark: "#C5B7B7", light: "#EBDBDB" },
  },
  orro: {
    "1": { dark: "#0D0905", light: "#573C21" },
    "2": { dark: "#492203", light: "#794115" },
    "3": { dark: "#1B0D03", light: "#51280A" },
    "4": { dark: "#4A3011", light: "#8A5312" },
    "5": { dark: "#A05F12", light: "#DB7E10" },
    "6": { dark: "#C29245", light: "#E9A02A" },
  },
  drakzul: {
    "1": { dark: "#45000F", light: "#45000F" },
    "2": { dark: "#1B0311", light: "#1B0311" },
    "3": { dark: "#270000", light: "#270000" },
    "4": { dark: "#38000B", light: "#38000B" },
  },
  slyvir: {
    "1": { dark: "#085F3B", light: "#0D794C" },
    "2": { dark: "#022E19", light: "#054828" },
    "3": { dark: "#031B0E", light: "#052C17" },
    "4": { dark: "#00492F", light: "#005738" },
    "5": { dark: "#002D14", light: "#004720" },
    "6": { dark: "#005823", light: "#05632A" },
  },
  adamant: {
    "1": { dark: "#004A1D", light: "#004A1D" },
    "2": { dark: "#0F1412", light: "#0A2C1E" },
    "3": { dark: "#206A3D", light: "#206A3D" },
    "4": { dark: "#02A041", light: "#02A041" },
  },
  mithrill: {
    "1": { dark: "#3E3BC7", light: "#524FEB" },
    "2": { dark: "#2D2C61", light: "#434289" },
    "3": { dark: "#6456C1", light: "#7363D8" },
    "4": { dark: "#9282FD", light: "#A597FF" },
  },
  liktir: {
    "1": { dark: "#1A3B3B", light: "#2D6666" },
    "2": { dark: "#033849", light: "#055873" },
    "3": { dark: "#030F1B", light: "#082440" },
    "4": { dark: "#11484F", light: "#17616B" },
    "5": { dark: "#1297A0", light: "#16AEB8" },
    "6": { dark: "#45C2A4", light: "#4BD4B3" },
  },
  amfrill: {
    "1": { dark: "#0D0506", light: "#0D0506" },
    "2": { dark: "#220349", light: "#220349" },
    "3": { dark: "#0F031B", light: "#0F031B" },
    "4": { dark: "#2C114F", light: "#2C114F" },
    "5": { dark: "#5912A0", light: "#5912A0" },
    "6": { dark: "#8345C2", light: "#8345C2" },
  },
};

/** Mineral linear gradients: bottom-left to top-right (135deg). Key = cssName (rulgor, veltryne, zharuk, kaleidyx). */
const MINERALS_GRADIENTS_JSON: Record<string, LinearGradient> = {
  rulgor: {
    angle: "135deg", // bottom-left to top-right
    dark: [
      { color: "#5F081D", percent: 0 },
      { color: "#2E0208", percent: 16 },
      { color: "#1A0003", percent: 32 },
      { color: "#490009", percent: 56 },
      { color: "#2D0005", percent: 72 },
      { color: "#580000", percent: 100 },
    ],
    light: [
      { color: "#8F0D2C", percent: 0 },
      { color: "#5C0410", percent: 16 },
      { color: "#400108", percent: 32 },
      { color: "#76000E", percent: 56 },
      { color: "#60010B", percent: 72 },
      { color: "#7F0101", percent: 100 },
    ],
  },
  veltryne: {
    angle: "135deg",
    dark: [
      { color: "#085F0C", percent: 0 },
      { color: "#022E09", percent: 16 },
      { color: "#001A0F", percent: 32 },
      { color: "#00490C", percent: 56 },
      { color: "#002D02", percent: 72 },
      { color: "#005809", percent: 100 },
    ],
    light: [
      { color: "#0C7A11", percent: 0 },
      { color: "#035010", percent: 16 },
      { color: "#013E24", percent: 32 },
      { color: "#016611", percent: 56 },
      { color: "#004303", percent: 72 },
      { color: "#00740C", percent: 100 },
    ],
  },
  zharuk: {
    angle: "135deg",
    dark: [
      { color: "#080C5F", percent: 0 },
      { color: "#02072E", percent: 16 },
      { color: "#04001A", percent: 32 },
      { color: "#000349", percent: 56 },
      { color: "#01002D", percent: 72 },
      { color: "#000458", percent: 100 },
    ],
    light: [
      { color: "#0C117D", percent: 0 },
      { color: "#040D52", percent: 16 },
      { color: "#0B0143", percent: 32 },
      { color: "#03076B", percent: 56 },
      { color: "#020055", percent: 72 },
      { color: "#020881", percent: 100 },
    ],
  },
  kaleidyx: {
    angle: "135deg",
    dark: [
      { color: "#B6B1D3", percent: 0 },
      { color: "#BFD8E3", percent: 16 },
      { color: "#EDEDED", percent: 32 },
      { color: "#DFCCD0", percent: 56 },
      { color: "#D3D9CE", percent: 72 },
      { color: "#FFFFFF", percent: 100 }, // Added stop at 100%
    ],
    light: [
      { color: "#EAE7FF", percent: 0 },
      { color: "#E4F7FF", percent: 16 },
      { color: "#FFFFFF", percent: 32 },
      { color: "#FFF4F6", percent: 56 },
      { color: "#F6FFF0", percent: 72 },
      { color: "#FFFFFF", percent: 100 },
    ],
  },
};

/** Minerals. Key = cssName (rulgor, veltryne, zharuk, kaleidyx). */
const MINERALS_JSON: Record<string, Record<string, DarkLightHex>> = {
  rulgor: {
    "1": { dark: "#5F081D", light: "#8F0D2C" },
    "2": { dark: "#2E0208", light: "#5C0410" },
    "3": { dark: "#1A0003", light: "#400108" },
    "4": { dark: "#490009", light: "#76000E" },
    "5": { dark: "#2D0005", light: "#60010B" },
    "6": { dark: "#580000", light: "#7F0101" },
  },
  veltryne: {
    "1": { dark: "#085F0C", light: "#0C7A11" },
    "2": { dark: "#022E09", light: "#035010" },
    "3": { dark: "#001A0F", light: "#013E24" },
    "4": { dark: "#00490C", light: "#016611" },
    "5": { dark: "#002D02", light: "#004303" },
    "6": { dark: "#005809", light: "#00740C" },
  },
  zharuk: {
    "1": { dark: "#080C5F", light: "#0C117D" },
    "2": { dark: "#02072E", light: "#040D52" },
    "3": { dark: "#04001A", light: "#0B0143" },
    "4": { dark: "#000349", light: "#03076B" },
    "5": { dark: "#01002D", light: "#020055" },
    "6": { dark: "#000458", light: "#020881" },
  },
  kaleidyx: {
    "1": { dark: "#B6B1D3", light: "#EAE7FF" },
    "2": { dark: "#BFD8E3", light: "#E4F7FF" },
    "3": { dark: "#EDEDED", light: "#FFFFFF" },
    "4": { dark: "#DFCCD0", light: "#FFF4F6" },
    "5": { dark: "#D3D9CE", light: "#F6FFF0" },
  },
};

/** Factions. Key = short name (nautilus, pica, odin, aladar, eclipse, onyx, omega, epsilon). */
const FACTIONS_JSON: Record<string, { "1": DarkLightHex; "2": DarkLightHex }> = {
  nautilus: { "1": { dark: "#5A1705", light: "#822107" }, "2": { dark: "#A90700", light: "#C40800" } },
  pica: { "1": { dark: "#6B272C", light: "#8B3138" }, "2": { dark: "#D66976", light: "#EE7281" } },
  odin: { "1": { dark: "#733000", light: "#8A3A00" }, "2": { dark: "#FFA337", light: "#FFA337" } },
  aladar: { "1": { dark: "#566311", light: "#768718" }, "2": { dark: "#B6D02B", light: "#D4F235" } },
  eclipse: { "1": { dark: "#06130F", light: "#123F32" }, "2": { dark: "#084B37", light: "#0B8460" } },
  onyx: { "1": { dark: "#090F15", light: "#152535" }, "2": { dark: "#3D2B86", light: "#4933A4" } },
  omega: { "1": { dark: "#8A70F2", light: "#A48EFF" }, "2": { dark: "#B8A7FF", light: "#DAD1FF" } },
  epsilon: { "1": { dark: "#F4E3FF", light: "#FAF3FF" }, "2": { dark: "#FDFAFF", light: "#FFFFFF" } },
};

/** Origins (omni-referenced: same hex in dark and light). Key = name lowercased (fruta, flame, solar, life, aether, insight, spirit). */
const ORIGINS_JSON: Record<string, { "1": string; "2": string }> = {
  fruta: { "1": "#CB0B03", "2": "#FF0970" },
  flame: { "1": "#FF4D00", "2": "#FFB800" },
  solar: { "1": "#FF9D00", "2": "#F2FF3D" },
  life: { "1": "#77FF00", "2": "#D8FF3D" },
  aether: { "1": "#002FFF", "2": "#3D7EFF" },
  insight: { "1": "#7700FF", "2": "#B200FF" },
  spirit: { "1": "#FF00D9", "2": "#FF58B4" },
};

export function getMaterialGradientHexes(cssName: string): MaterialGradientHexes | undefined {
  const key = MATERIAL_GRADIENT_KEYS[cssName];
  if (!key) return undefined;
  const raw = MATERIALS_GRADIENTS_JSON[key];
  return { dark: raw.dark as [string, string], light: raw.light as [string, string] };
}

/** Returns dark and light hex arrays for the given token indices (e.g. [1,2] or [1,2,3,4,5,6,7]). */
export function getMaterialHexes(
  cssName: string,
  tokenIndices: readonly number[]
): { darkHexes: string[]; lightHexes: string[] } | undefined {
  const map = MATERIALS_JSON[cssName];
  if (!map) return undefined;
  const darkHexes = tokenIndices.map((n) => map[String(n)]?.dark ?? "");
  const lightHexes = tokenIndices.map((n) => map[String(n)]?.light ?? "");
  return { darkHexes, lightHexes };
}

export function getMineralHexes(
  cssName: string,
  tokenIndices: readonly number[]
): { darkHexes: string[]; lightHexes: string[] } | undefined {
  const map = MINERALS_JSON[cssName];
  if (!map) return undefined;
  const darkHexes = tokenIndices.map((n) => map[String(n)]?.dark ?? "");
  const lightHexes = tokenIndices.map((n) => map[String(n)]?.light ?? "");
  return { darkHexes, lightHexes };
}

/** shortName = faction key without "faction-" (e.g. nautilus, pica). */
export function getFactionHexes(shortName: string): { "1": DarkLightHex; "2": DarkLightHex } | undefined {
  return FACTIONS_JSON[shortName];
}

/** Origin name lowercased (e.g. fruta, flame). Omni-referenced: same hex in both themes. */
export function getOriginHexes(name: string): { "1": string; "2": string } | undefined {
  return ORIGINS_JSON[name.toLowerCase()];
}

/** Get linear gradient definition for a mineral (rulgor, veltryne, zharuk, kaleidyx). */
export function getMineralGradientLinear(cssName: string): LinearGradient | undefined {
  return MINERALS_GRADIENTS_JSON[cssName];
}

/** Convert a LinearGradient object to a CSS linear-gradient() string. */
export function linearGradientToCss(gradient: LinearGradient, theme: "dark" | "light"): string {
  const stops = gradient[theme];
  const stopsStr = stops.map((s) => `${s.color} ${s.percent}%`).join(", ");
  return `linear-gradient(${gradient.angle}, ${stopsStr})`;
}

/** Get mineral gradient as a CSS string directly (convenience function). */
export function getMineralGradientCss(cssName: string, theme: "dark" | "light"): string | undefined {
  const gradient = MINERALS_GRADIENTS_JSON[cssName];
  if (!gradient) return undefined;
  return linearGradientToCss(gradient, theme);
}

/** Build a multi-stop CSS gradient from a fantasy material scale (gronksh, plata, orro, etc.). */
export function getMaterialGradientCss(
  cssName: string,
  theme: "dark" | "light",
  angle = "180deg",
): string | undefined {
  const map = MATERIALS_JSON[cssName];
  if (!map) return undefined;
  const keys = Object.keys(map).sort((a, b) => Number(a) - Number(b));
  const count = keys.length;
  const pcts =
    count === 6
      ? [0, 16, 32, 56, 72, 100]
      : keys.map((_, i) => Math.round((i / (count - 1)) * 100));
  const stops = keys.map((k, i) => `${map[k]![theme]} ${pcts[i]}%`);
  return `linear-gradient(${angle}, ${stops.join(", ")})`;
}

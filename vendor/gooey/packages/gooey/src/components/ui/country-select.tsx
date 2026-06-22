import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";

import { cn } from "../../lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export type CountryCode = (typeof COUNTRY_CODES)[number];

export interface Country {
  code: CountryCode;
  name: string;
  flagUrl: string;
  flagEmoji: string;
}

export interface CountryFlagProps extends React.HTMLAttributes<HTMLSpanElement> {
  country: Country | CountryCode;
  size?: number;
  imageClassName?: string;
}

export interface CountrySelectButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  country?: Country | null;
  placeholderCode?: CountryCode;
  open?: boolean;
}

export interface CountrySelectPopoverProps {
  countries?: Country[];
  selectedCountry?: Country | null;
  onSelectCountry: (country: Country) => void;
  searchPlaceholder?: string;
  emptyLabel?: string;
  className?: string;
}

export interface CountrySelectProps {
  value?: CountryCode | null;
  defaultValue?: CountryCode | null;
  onValueChange?: (country: Country) => void;
  countries?: Country[];
  placeholderCode?: CountryCode;
  searchPlaceholder?: string;
  emptyLabel?: string;
  buttonClassName?: string;
  popoverClassName?: string;
  disabled?: boolean;
}

export const COUNTRY_CODES = [
  "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AS", "AT", "AU", "AW", "AX", "AZ",
  "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS",
  "BT", "BV", "BW", "BY", "BZ", "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN",
  "CO", "CR", "CU", "CV", "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE",
  "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FK", "FM", "FO", "FR", "GA", "GB", "GD", "GE", "GF",
  "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HM",
  "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR", "IS", "IT", "JE", "JM",
  "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC",
  "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK",
  "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA",
  "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG",
  "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PW", "PY", "QA", "RE", "RO", "RS", "RU", "RW",
  "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS",
  "ST", "SV", "SX", "SY", "SZ", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO",
  "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "UM", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VI",
  "VN", "VU", "WF", "WS", "YE", "YT", "ZA", "ZM", "ZW", "XK",
] as const;

const COUNTRY_NAME_OVERRIDES: Partial<Record<CountryCode, string>> = {
  BQ: "Caribbean Netherlands",
  BV: "Bouvet Island",
  CC: "Cocos Islands",
  CD: "Democratic Republic of the Congo",
  CG: "Republic of the Congo",
  CX: "Christmas Island",
  CZ: "Czechia",
  FK: "Falkland Islands",
  FM: "Micronesia",
  GB: "United Kingdom",
  GS: "South Georgia and the South Sandwich Islands",
  HM: "Heard Island and McDonald Islands",
  IO: "British Indian Ocean Territory",
  IR: "Iran",
  KP: "North Korea",
  KR: "South Korea",
  LA: "Laos",
  MK: "North Macedonia",
  MM: "Myanmar",
  MO: "Macao",
  PN: "Pitcairn Islands",
  PS: "Palestine",
  RU: "Russia",
  SH: "Saint Helena",
  SJ: "Svalbard and Jan Mayen",
  SS: "South Sudan",
  ST: "Sao Tome and Principe",
  SY: "Syria",
  TL: "Timor-Leste",
  TW: "Taiwan",
  TZ: "Tanzania",
  UM: "United States Minor Outlying Islands",
  US: "United States",
  VA: "Vatican City",
  VE: "Venezuela",
  VN: "Vietnam",
  XK: "Kosovo",
};

const FALLBACK_FLAG =
  "data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='32' height='32' rx='16' fill='%23333333'/%3E%3Cpath d='M8 10h16v12H8V10Z' fill='%23666666'/%3E%3C/svg%3E";

function countryName(code: CountryCode) {
  const override = COUNTRY_NAME_OVERRIDES[code];
  if (override) return override;

  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

function countryEmoji(code: CountryCode) {
  if (code === "XK") return "";
  return [...code]
    .map((letter) => 127397 + letter.charCodeAt(0))
    .map((point) => String.fromCodePoint(point))
    .join("");
}

export function getCountryFlagUrl(code: CountryCode) {
  return `https://flagcdn.com/${code.toLowerCase()}.svg`;
}

export const COUNTRIES: Country[] = COUNTRY_CODES
  .map((code) => ({
    code,
    name: countryName(code),
    flagUrl: getCountryFlagUrl(code),
    flagEmoji: countryEmoji(code),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export function findCountry(code: CountryCode | string | null | undefined, countries: Country[] = COUNTRIES) {
  if (!code) return null;
  const normalized = code.toUpperCase();
  return countries.find((country) => country.code === normalized) ?? null;
}

export function getLocaleCountryCode() {
  const locale = typeof navigator === "undefined"
    ? undefined
    : navigator.languages?.[0] ?? navigator.language;
  const region = locale?.match(/[-_]([A-Za-z]{2})\b/)?.[1]?.toUpperCase();
  return COUNTRY_CODES.includes(region as CountryCode) ? (region as CountryCode) : null;
}

export function CountryFlag({
  country,
  size = 24,
  className,
  imageClassName,
  ...props
}: CountryFlagProps) {
  const resolved = typeof country === "string" ? findCountry(country) : country;
  const label = resolved ? `${resolved.name} flag` : "country flag";

  return (
    <span
      className={cn("inline-flex shrink-0 overflow-hidden rounded-full bg-[var(--color-light-glass-10)]", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <img
        src={resolved?.flagUrl ?? FALLBACK_FLAG}
        alt={label}
        loading="lazy"
        referrerPolicy="no-referrer"
        className={cn("size-full object-cover", imageClassName)}
        onError={(event) => {
          event.currentTarget.src = FALLBACK_FLAG;
        }}
      />
    </span>
  );
}

export const CountrySelectButton = React.forwardRef<HTMLButtonElement, CountrySelectButtonProps>(
  ({ country, placeholderCode = "US", open = false, className, disabled, ...props }, ref) => {
    const visibleCountry = country ?? findCountry(placeholderCode);

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        aria-label={visibleCountry ? `select country, current ${visibleCountry.name}` : "select country"}
        className={cn(
          "inline-flex h-10 items-center justify-center gap-1 rounded-full border border-[var(--color-light-glass-10)] bg-[var(--color-light-glass-10)] p-1.5 text-light-space shadow-[var(--shadow-pill-inset)] backdrop-blur-[20px] transition-colors hover:bg-[var(--color-light-glass-20)] active:bg-[var(--color-light-glass-20)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-space disabled:pointer-events-none disabled:opacity-45",
          className,
        )}
        {...props}
      >
        {visibleCountry ? <CountryFlag country={visibleCountry} size={24} /> : null}
        <ChevronDown
          aria-hidden="true"
          className={cn("size-5 transition-transform duration-200", open && "rotate-180")}
          strokeWidth={1.8}
        />
      </button>
    );
  },
);
CountrySelectButton.displayName = "CountrySelectButton";

export function CountrySelectPopover({
  countries = COUNTRIES,
  selectedCountry,
  onSelectCountry,
  searchPlaceholder = "search country or region",
  emptyLabel = "no countries found",
  className,
}: CountrySelectPopoverProps) {
  const [query, setQuery] = React.useState("");
  const filteredCountries = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return countries;
    return countries.filter((country) =>
      country.name.toLowerCase().includes(normalized) ||
      country.code.toLowerCase().includes(normalized)
    );
  }, [countries, query]);

  return (
    <div
      className={cn(
        "flex max-h-[min(700px,calc(100dvh-48px))] w-[min(450px,calc(100vw-24px))] flex-col overflow-hidden rounded-3xl border border-[var(--color-light-glass-10)] bg-[var(--color-smoke-1)] text-light-space shadow-2xl",
        className,
      )}
    >
      <div className="p-5 pb-2">
        <p className="font-sans text-base font-medium leading-6 text-light-space">select your region</p>
        <label className="mt-2 flex h-10 items-center gap-2 rounded-xl border border-[var(--color-light-glass-10)] bg-[var(--color-light-glass-5)] px-3">
          <Search aria-hidden="true" className="size-5 text-light-space/45" strokeWidth={1.5} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent font-sans text-sm leading-none text-light-space outline-none placeholder:text-light-space/38"
          />
        </label>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pb-2">
        {filteredCountries.length === 0 ? (
          <div className="flex min-h-24 items-center justify-center px-5 text-center font-sans text-sm text-light-space/45">
            {emptyLabel}
          </div>
        ) : (
          <ul className="w-full">
            {filteredCountries.map((country) => {
              const selected = selectedCountry?.code === country.code;
              return (
                <li key={country.code}>
                  <button
                    type="button"
                    onClick={() => onSelectCountry(country)}
                    className="relative flex h-14 w-full items-center gap-3 px-5 text-left transition-colors hover:bg-[var(--color-light-glass-5)] active:bg-[var(--color-light-glass-10)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-light-space"
                  >
                    <CountryFlag country={country} size={32} />
                    <span className="min-w-0 flex-1 truncate font-sans text-sm font-medium leading-5 text-light-space">
                      {country.name}
                    </span>
                    <span className="font-mono text-[10px] leading-none text-light-space/35">{country.code}</span>
                    {selected ? <Check aria-hidden="true" className="size-5 text-light-space" strokeWidth={1.8} /> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export function CountrySelect({
  value,
  defaultValue,
  onValueChange,
  countries = COUNTRIES,
  placeholderCode = "US",
  searchPlaceholder,
  emptyLabel,
  buttonClassName,
  popoverClassName,
  disabled = false,
}: CountrySelectProps) {
  const [open, setOpen] = React.useState(false);
  const initialCode = defaultValue ?? getLocaleCountryCode() ?? placeholderCode;
  const [internalCode, setInternalCode] = React.useState<CountryCode | null>(initialCode);
  const selectedCountry = findCountry(value ?? internalCode, countries);

  const handleSelectCountry = (country: Country) => {
    setInternalCode(country.code);
    onValueChange?.(country);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <CountrySelectButton
          country={selectedCountry}
          placeholderCode={placeholderCode}
          open={open}
          disabled={disabled}
          className={buttonClassName}
        />
      </PopoverTrigger>
      <PopoverContent align="center" sideOffset={8} className="border-0 bg-transparent p-0 shadow-none">
        <CountrySelectPopover
          countries={countries}
          selectedCountry={selectedCountry}
          onSelectCountry={handleSelectCountry}
          searchPlaceholder={searchPlaceholder}
          emptyLabel={emptyLabel}
          className={popoverClassName}
        />
      </PopoverContent>
    </Popover>
  );
}

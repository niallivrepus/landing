import { cn } from "@jokuh/gooey";
import { ChevronDown, Search } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { CAREERS_ROLES } from "../data/careers";
import { SiteLink } from "../components/SiteLink";
import { TertiaryPageChrome } from "../components/system";
import { CONTENT_SHELL_COMPANY } from "../components/system/shells";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const ALL = "all" as const;

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  const id = useId();
  return (
    <div className="relative inline-flex items-center gap-1">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer appearance-none bg-transparent pr-5 font-sans text-[13.5px] font-medium text-light-space focus:outline-none light:text-zinc-950"
      >
        <option value={ALL}>{label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-0 size-3.5 text-light-space/55 light:text-zinc-500"
        strokeWidth={2}
        aria-hidden
      />
    </div>
  );
}

export function CareersRolesPage() {
  useDocumentTitle("Open Roles · Jokuh Careers");

  const [query, setQuery] = useState("");
  const [team, setTeam] = useState<string>(ALL);
  const [location, setLocation] = useState<string>(ALL);

  const teams = useMemo(
    () => Array.from(new Set(CAREERS_ROLES.map((r) => r.team))).sort(),
    [],
  );
  const locations = useMemo(
    () => Array.from(new Set(CAREERS_ROLES.map((r) => r.location))).sort(),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CAREERS_ROLES.filter((r) => {
      if (team !== ALL && r.team !== team) return false;
      if (location !== ALL && r.location !== location) return false;
      if (!q) return true;
      return r.title.toLowerCase().includes(q) || r.team.toLowerCase().includes(q);
    });
  }, [query, team, location]);

  return (
    <TertiaryPageChrome>
      <main>
        <section className={cn(CONTENT_SHELL_COMPANY, "pt-20 pb-12 text-center md:pt-24 md:pb-16")}>
          <h1 className="font-sans text-[clamp(2.25rem,5.5vw,3.5rem)] font-semibold leading-[1.04] tracking-[-0.005em] text-light-space light:text-zinc-950">
            Careers at Jokuh
          </h1>
        </section>

        <section className={cn(CONTENT_SHELL_COMPANY, "pb-24 md:pb-32")}>
          <div className="mx-auto max-w-[52rem]">
            {/* Search + filters row */}
            <div className="flex flex-col items-stretch gap-4 border-b border-light-space/[0.08] pb-4 light:border-zinc-200 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <Search
                  className="size-4 shrink-0 text-light-space/55 light:text-zinc-500"
                  strokeWidth={2}
                  aria-hidden
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`${filtered.length} ${filtered.length === 1 ? "job" : "jobs"}`}
                  className="w-full bg-transparent font-sans text-[14px] text-light-space placeholder:text-light-space/45 focus:outline-none light:text-zinc-950 light:placeholder:text-zinc-500 md:w-[20rem]"
                  aria-label="Search open roles"
                />
              </div>
              <div className="flex items-center gap-6">
                <FilterSelect label="All teams" value={team} onChange={setTeam} options={teams} />
                <FilterSelect label="All locations" value={location} onChange={setLocation} options={locations} />
              </div>
            </div>

            <ul className="divide-y divide-light-space/[0.08] light:divide-zinc-200">
              {filtered.map((role) => (
                <li key={role.title}>
                  <SiteLink
                    href={role.href}
                    className="group/role grid grid-cols-1 gap-1 py-6 md:grid-cols-[1fr_auto_auto] md:items-baseline md:gap-x-8"
                  >
                    <span className="font-sans text-[14.5px] leading-snug text-light-space light:text-zinc-950">
                      <span className="font-semibold">{role.title}</span>
                      <span className="ml-2 text-light-space/45 light:text-zinc-500">{role.team}</span>
                    </span>
                    <span className="font-sans text-[13px] text-light-space/55 light:text-zinc-500">{role.location}</span>
                    <span className="inline-flex items-center gap-1 font-sans text-[13.5px] font-medium text-light-space underline-offset-4 transition-colors group-hover/role:text-white group-hover/role:underline light:text-zinc-950 light:group-hover/role:text-black">
                      Apply now
                      <span aria-hidden>↗</span>
                    </span>
                  </SiteLink>
                </li>
              ))}
              {filtered.length === 0 ? (
                <li className="py-16 text-center font-sans text-[14px] text-light-space/55 light:text-zinc-500">
                  No roles match the current filters.
                </li>
              ) : null}
            </ul>
          </div>
        </section>
      </main>
    </TertiaryPageChrome>
  );
}

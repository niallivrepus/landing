import { NavLink, Outlet } from "react-router-dom";
import { SiteLink } from "../../components/SiteLink";
import { MarketingPageFrame } from "../../components/system";
import { DOCS_NAV_SECTIONS } from "../../data/docs-nav";
import { cn } from "@jokuh/gooey";

const sideLink =
  "block rounded-md px-2.5 py-1.5 font-sans text-[13px] font-semibold leading-snug text-light-space/70 transition-colors hover:bg-light-space/[0.06] hover:text-light-space";
const sideLinkActive = "bg-light-space/[0.08] text-light-space";

function isAbsoluteHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function DocsLayout() {
  return (
    <MarketingPageFrame wrapMain={false} withAntialiased>
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-8 px-4 pb-20 pt-20 md:flex-row md:gap-14 md:px-8 md:pt-24 lg:pt-28">
        <nav
          className="flex flex-wrap gap-2 border-b border-light-glass-10 pb-6 md:hidden"
          aria-label="Documentation sections"
        >
          {DOCS_NAV_SECTIONS.flatMap((s) => s.items).map((item) => (
            isAbsoluteHref(item.to) ? (
              <SiteLink
                key={item.to}
                href={item.to}
                className="rounded-full border border-transparent px-3 py-1.5 font-sans text-[12px] font-semibold text-light-space/75 transition-colors hover:bg-light-space/[0.05]"
              >
                {item.label}
              </SiteLink>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/developers/docs"}
                className={({ isActive }) =>
                  cn(
                    "rounded-full border px-3 py-1.5 font-sans text-[12px] font-semibold text-light-space/75 transition-colors",
                    isActive
                      ? "border-light-glass-20 bg-light-space/[0.08] text-light-space"
                      : "border-transparent hover:bg-light-space/[0.05]",
                  )
                }
              >
                {item.label}
              </NavLink>
            )
          ))}
        </nav>
        <aside className="hidden w-[220px] shrink-0 md:block">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-light-space/38">Documentation</p>
          <nav className="mt-6 space-y-8" aria-label="Documentation">
            {DOCS_NAV_SECTIONS.map((sec) => (
              <div key={sec.heading}>
                <p className="font-sans text-[11px] font-normal tracking-[0.06em] text-light-space/40 uppercase">
                  {sec.heading}
                </p>
                <ul className="mt-3 space-y-0.5">
                  {sec.items.map((item) => (
                    <li key={item.to}>
                      {isAbsoluteHref(item.to) ? (
                        <SiteLink href={item.to} className={sideLink}>
                          {item.label}
                        </SiteLink>
                      ) : (
                        <NavLink
                          to={item.to}
                          end={item.to === "/developers/docs"}
                          className={({ isActive }) => cn(sideLink, isActive && sideLinkActive)}
                        >
                          {item.label}
                        </NavLink>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </MarketingPageFrame>
  );
}

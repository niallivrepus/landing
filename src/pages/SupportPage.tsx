import { Box, Download, Headphones, Layers, LifeBuoy, Mail, MessageCircle, Zap } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@jokuh/gooey";
import { SiteLink } from "../components/SiteLink";
import { JokuhMark } from "../components/legal/JokuhMark";
import { MarketingPageFrame } from "../components/system/MarketingPageFrame";
import { MARKETING_ROOT_CLASS } from "../components/system/shells";
import { resolveStatusHref } from "../config/site-subdomains";
import { useSiteSearch } from "../context/SiteSearchContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const softBlue = {
  link: "text-[#0066cc] hover:text-[#0077ed]",
  circle: "bg-[#0071e3]",
  card: "bg-[#f5f7fa]",
  muted: "text-zinc-500",
  heading: "text-zinc-900",
} as const;

const products = [
  { label: "Pods", href: "/pods", icon: Box },
  { label: "Spine", href: "/spine", icon: Layers },
  { label: "Vortex", href: "/vortex", icon: Zap },
  { label: "Blurbs", href: "/blurbs", icon: MessageCircle },
  { label: "Download", href: "/download", icon: Download },
  { label: "System status", href: resolveStatusHref("/"), icon: LifeBuoy },
] as const;

const actions = [
  {
    title: "Contact sales",
    href: "/contact",
    icon: Mail,
    iconClass: "text-[#34c759]",
  },
  {
    title: "Browse documentation",
    href: "/developers/docs",
    icon: MessageCircle,
    iconClass: "text-[#0071e3]",
  },
  {
    title: "Account & billing",
    href: "/account",
    icon: Headphones,
    iconClass: "text-[#ff3b30]",
  },
] as const;

export function SupportPage() {
  useDocumentTitle("Jokuh Care — Jokuh");
  const { open } = useSiteSearch();

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const prev = (root.getAttribute("data-theme") as "dark" | "light" | null) ?? "dark";
    root.classList.remove("dark", "light");
    root.classList.add("light");
    root.setAttribute("data-theme", "light");
    if (body) body.style.backgroundColor = "#FFFFFF";
    return () => {
      root.classList.remove("light");
      root.classList.add(prev);
      root.setAttribute("data-theme", prev);
      if (body) body.style.backgroundColor = prev === "dark" ? "#000000" : "#FFFFFF";
    };
  }, []);

  return (
    <MarketingPageFrame
      className={cn(MARKETING_ROOT_CLASS, "light")}
      withFontSans
      withAntialiased
    >
      <div className="bg-gradient-to-b from-[#eef4fc] via-white to-white pb-16 md:pb-24">
        <div className="mx-auto max-w-[720px] px-4 pt-28 text-center md:max-w-[980px] md:px-8 md:pt-32">
          <div className="mb-6 flex justify-center md:mb-8">
            <div
              className={cn(
                "flex size-[72px] items-center justify-center rounded-full shadow-[0_12px_40px_-12px_rgba(0,113,227,0.45)] md:size-[88px]",
                softBlue.circle,
              )}
              aria-hidden
            >
              <JokuhMark className="h-6 w-auto text-white md:h-7" />
            </div>
          </div>
          <h1
            className={cn(
              "font-sans text-[clamp(2rem,5vw,2.75rem)] font-semibold tracking-tight md:text-[2.75rem]",
              softBlue.heading,
            )}
          >
            Jokuh Care
          </h1>
          <p className={cn("mx-auto mt-3 max-w-md font-sans text-[17px] leading-relaxed md:text-lg", softBlue.muted)}>
            Need help? Start here.
          </p>

          <nav
            className="mx-auto mt-12 flex max-w-[640px] flex-wrap justify-center gap-x-6 gap-y-8 md:mt-14 md:max-w-none md:gap-x-10"
            aria-label="Products and topics"
          >
            {products.map(({ label, href, icon: Icon }) => (
              <SiteLink
                key={href}
                href={href}
                className="flex w-[4.5rem] flex-col items-center gap-2 font-sans text-[12px] font-normal text-zinc-600 transition-colors hover:text-[#0066cc] md:w-[5rem] md:text-[13px]"
              >
                <span className="flex size-14 items-center justify-center rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,113,227,0.08)] ring-1 ring-[#0071e3]/[0.08] md:size-16">
                  <Icon className="size-7 text-[#0071e3]/90 md:size-8" strokeWidth={1.25} aria-hidden />
                </span>
                {label}
              </SiteLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-[980px] px-4 pb-10 md:px-8 md:pb-16">
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
          {actions.map(({ title, href, icon: Icon, iconClass }) => (
            <SiteLink
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center rounded-[20px] px-5 py-8 text-center transition-[box-shadow,transform] duration-200 hover:shadow-[0_8px_28px_-8px_rgba(0,102,204,0.2)] active:scale-[0.99]",
                softBlue.card,
              )}
            >
              <span className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04]">
                <Icon className={cn("size-6", iconClass)} strokeWidth={1.35} aria-hidden />
              </span>
              <span className={cn("font-sans text-[15px] font-normal leading-snug md:text-base", softBlue.link)}>{title}</span>
            </SiteLink>
          ))}
        </div>

        <div className="mt-16 text-center md:mt-20">
          <h2 className={cn("font-sans text-2xl font-semibold tracking-tight md:text-[1.75rem]", softBlue.heading)}>
            Search for more topics
          </h2>
          <p className={cn("mx-auto mt-3 max-w-md font-sans text-[15px] leading-relaxed", softBlue.muted)}>
            Open site search from the header or jump in here.
          </p>
          <button
            type="button"
            onClick={() => open()}
            className={cn(
              "premium-soft-button mt-8 inline-flex h-11 min-w-[12rem] items-center justify-center rounded-full bg-[#0071e3] px-8 font-sans text-sm font-medium text-white shadow-[0_8px_24px_-8px_rgba(0,113,227,0.55)] transition hover:bg-[#0077ed] hover:shadow-[0_12px_32px_-10px_rgba(0,113,227,0.5)]",
            )}
          >
            Search Jokuh
          </button>
        </div>
      </div>
    </MarketingPageFrame>
  );
}

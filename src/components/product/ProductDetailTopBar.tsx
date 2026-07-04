import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { cn } from "@jokuh/gooey";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { scrollToHashTarget } from "../../lib/route-scroll";
import type { ProductDetailSectionLink } from "../../lib/product-detail-sections";
import { SiteTopBar } from "../SiteTopBar";
import { CONTENT_SHELL_WIDE } from "../system/shells";

export type ProductHeroCta = {
  label: string;
  action: string;
};

export function ProductDetailTopBar({
  productTitle,
  cta,
  sectionLinks,
}: {
  productTitle: string;
  cta: ProductHeroCta;
  sectionLinks: ProductDetailSectionLink[];
}) {
  const frameRef = useRef<number | null>(null);
  const [showProductNav, setShowProductNav] = useState(false);
  const [isOverHero, setIsOverHero] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  const handleAnchorClick = (href: string) => (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (!scrollToHashTarget(href)) return;

    event.preventDefault();
    window.history.replaceState(null, "", href);
  };

  useEffect(() => {
    const update = () => {
      frameRef.current = null;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const heroEnd = document.getElementById("product-hero-end");

      setShowProductNav(scrollTop > 24);
      setIsOverHero(!heroEnd || heroEnd.getBoundingClientRect().top > 64);
    };

    const requestUpdate = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <>
      <SiteTopBar transparent hidden={showProductNav} />
      <AnimatePresence initial={false}>
        {showProductNav ? (
          <motion.header
            data-product-detail-nav
            key="product-detail-nav"
            initial={shouldReduceMotion ? { opacity: 0 } : { y: "-100%", opacity: 0 }}
            animate={{
              ...(shouldReduceMotion ? {} : { y: 0 }),
              opacity: 1,
              transition: {
                ...(shouldReduceMotion ? {} : { y: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } }),
                opacity: { duration: shouldReduceMotion ? 0.12 : 0.2, ease: "easeOut" },
              },
            }}
            exit={{
              ...(shouldReduceMotion ? {} : { y: "-100%" }),
              opacity: 0,
              transition: {
                ...(shouldReduceMotion ? {} : { y: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } }),
                opacity: { duration: shouldReduceMotion ? 0.1 : 0.14, ease: "easeOut" },
              },
            }}
            className={cn(
              "fixed inset-x-0 top-0 z-[101] border-b border-white/[0.08] bg-white/[0.05] text-white shadow-none backdrop-blur-[40px]",
              "transition-[background-color,border-color,box-shadow,color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
              !isOverHero &&
                "light:border-black/[0.08] light:bg-white/75 light:text-zinc-950 light:shadow-[0_18px_34px_-28px_rgba(15,23,42,0.18)]",
            )}
          >
            <div className={cn(CONTENT_SHELL_WIDE, "flex h-16 items-center gap-4")}>
              <a
                href="#overview"
                onClick={handleAnchorClick("#overview")}
                className={cn(
                  "min-w-0 shrink-0 font-sans text-[15px] font-semibold tracking-tight transition-colors",
                  "text-white hover:text-white/75",
                  !isOverHero && "light:text-zinc-950 light:hover:text-zinc-600",
                )}
              >
                {productTitle}
              </a>

              <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label={`${productTitle} sections`}>
                {sectionLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={handleAnchorClick(link.href)}
                    className={cn(
                      "rounded-full px-3 py-2 font-sans text-[12px] font-semibold tracking-tight transition-colors",
                      "text-white/58 hover:text-white",
                      !isOverHero && "light:text-zinc-500 light:hover:text-zinc-950",
                    )}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <Link
                to="/download"
                className={cn(
                  "ml-auto inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-blue-500 px-5 font-sans text-[12px] font-semibold tracking-tight text-white transition-colors hover:bg-blue-600 md:ml-2",
                  "active:scale-[0.96] motion-safe:transition-transform",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black light:focus-visible:ring-blue-600/60 light:focus-visible:ring-offset-white",
                )}
                aria-label={`${cta.action} with Jokuh ${productTitle}`}
              >
                {cta.action}
              </Link>
            </div>
          </motion.header>
        ) : null}
      </AnimatePresence>
    </>
  );
}

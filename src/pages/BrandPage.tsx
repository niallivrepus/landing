import { OO, cn } from "@jokuh/gooey";
import { Download04Icon, Copy01Icon, CheckmarkCircle02Icon } from "hugeicons-react";
import { useState, useCallback, type CSSProperties, type ReactNode } from "react";
import { FaqSection } from "../components/FaqSection";
import { LavaLamp } from "../components/LavaLamp";
import {
  CompanyPageLayout,
  CompanyPageHero,
  COMPANY_PAGE_SHELL,
} from "../components/CompanyPageLayout";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

/* ── Logo paths ───────────────────────────────────────────────────────── */

const NEXUS_PATH =
  "M27.7824 5.14531C22.5874 6.36044 19.7007 9.48499 19.1325 9.48499C18.5643 9.48499 15.6776 6.36044 10.4827 5.14531C6.70459 4.26162 4.14221 7.69747 6.64694 12.1901C8.19379 15.678 9.77851 17 12.2418 17C14.1937 17 15.4004 15.9752 16.3073 15.3788C16.9965 14.9255 18.035 14.1105 19.1326 14.1105C20.2302 14.1105 21.2686 14.9255 21.958 15.3788C22.8648 15.9752 24.0714 17 26.0234 17C28.4866 17 30.0715 15.678 31.6183 12.1901C33.509 7.50321 31.5608 4.26176 27.7827 5.14546L27.7824 5.14531ZM16.9692 12.4816C16.4843 13.1956 12.9576 15.3082 11.0573 14.0865C9.15706 12.8649 7.37419 8.7448 8.59416 7.85859C9.81413 6.97238 18.1891 10.685 16.9692 12.4816ZM27.2076 14.0865C25.3073 15.3082 21.7807 13.1957 21.2958 12.4816C20.0758 10.685 28.451 6.97223 29.6708 7.85844C30.8906 8.74466 29.1077 12.8649 27.2076 14.0865Z";

const NEXUS_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 22" fill="none"><path d="${NEXUS_PATH}" fill="currentColor"/></svg>`;

const VORTEX_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 57 26" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M28.0925 0.000217438C12.5774 0.000217438 -6.86646e-05 5.65301 -6.86646e-05 12.6261C-6.86646e-05 19.5992 12.5774 25.252 28.0925 25.252C43.6076 25.252 56.1851 19.5992 56.1851 12.6261C56.1851 5.65301 43.6076 0.000217438 28.0925 0.000217438ZM36.7459 12.3018C31.9394 12.4017 10.1995 12.7144 13.7468 8.27048C17.0259 4.51373 24.4167 1.8941 33.0087 1.8941C44.645 1.8941 54.0781 6.69897 54.0781 12.6261C54.0781 18.5532 44.645 23.3581 33.0087 23.3581C24.4167 23.3581 17.026 20.7385 13.7468 16.9817C10.1993 12.5377 31.9394 12.8504 36.7459 12.9503C36.9136 15.783 39.264 18.0285 42.1388 18.0285C45.1224 18.0285 47.5412 15.6098 47.5412 12.6261C47.5412 9.64242 45.1224 7.22367 42.1388 7.22367C39.264 7.22367 36.9136 9.46913 36.7459 12.3018Z" fill="currentColor"/></svg>`;

/* ── Color palette ────────────────────────────────────────────────────── */

const ENERGY_TRIADS = [
  { name: "Pink", steps: [{ n: 3, hex: "#A20097" }, { n: 4, hex: "#FF00EE" }, { n: 5, hex: "#FF5CF4" }] },
  { name: "Purple", steps: [{ n: 3, hex: "#7516D3" }, { n: 4, hex: "#9327FF" }, { n: 5, hex: "#B56FFF" }] },
  { name: "Blue", steps: [{ n: 3, hex: "#003E9C" }, { n: 4, hex: "#0066FF" }, { n: 5, hex: "#2C81FF" }] },
  { name: "Cyan", steps: [{ n: 3, hex: "#008789" }, { n: 4, hex: "#43FDFF" }, { n: 5, hex: "#BFFEFF" }] },
  { name: "Green", steps: [{ n: 3, hex: "#0A8200" }, { n: 4, hex: "#21DC11" }, { n: 5, hex: "#30FA16" }] },
  { name: "Yellow", steps: [{ n: 3, hex: "#FF9D00" }, { n: 4, hex: "#FFB800" }, { n: 5, hex: "#FFC633" }] },
  { name: "Orange", steps: [{ n: 3, hex: "#BC3800" }, { n: 4, hex: "#FF4D00" }, { n: 5, hex: "#FF6B00" }] },
  { name: "Red", steps: [{ n: 3, hex: "#940900" }, { n: 4, hex: "#FF0700" }, { n: 5, hex: "#FF312B" }] },
];

const ECLIPSE_COLORS = [
  { name: "Dark Space", hex: "#000000", token: "dark-space" },
  { name: "Light Space", hex: "#FFFFFF", token: "light-space" },
  { name: "Smoke 2", hex: "#141414", token: "smoke-2" },
  { name: "Smoke 5", hex: "#737373", token: "smoke-5" },
];

/* ── Typography entries ───────────────────────────────────────────────── */

const TYPEFACES = [
  {
    name: "Satoshi",
    role: "For headlines.",
    preview: "Satoshi",
    fontClass: "font-sans",
    weight: "300–900",
    free: true,
  },
];

/* ── Helpers ──────────────────────────────────────────────────────────── */

function CopyHex({ hex }: { hex: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(hex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  }, [hex]);

  return (
    <button
      type="button"
      onClick={copy}
      className="premium-soft-button flex items-center gap-1.5 font-mono text-[12px] text-light-space/50 transition-colors hover:text-light-space light:text-zinc-500 light:hover:text-zinc-900"
    >
      {copied ? (
        <CheckmarkCircle02Icon size={13} strokeWidth={1.5} />
      ) : (
        <Copy01Icon size={13} strokeWidth={1.5} />
      )}
      {hex}
    </button>
  );
}

function ColorSwatch({ hex, name }: { hex: string; name: string }) {
  return (
    <div className="group flex flex-col gap-2">
      <div
        className="aspect-[4/3] w-full rounded-xl border border-light-space/[0.08] transition-transform group-hover:scale-[1.03] light:border-zinc-200"
        style={{ backgroundColor: hex }}
      />
      <div className="flex items-center justify-between">
        <span className="font-sans text-[13px] font-medium text-light-space/70 light:text-zinc-700">
          {name}
        </span>
        <CopyHex hex={hex} />
      </div>
    </div>
  );
}

function BrandSection({
  id,
  title,
  description,
  children,
}: {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-8 border-b border-light-space/[0.08] pb-4 light:border-zinc-200">
        <h2 className="font-sans text-xl font-semibold tracking-tight text-light-space light:text-zinc-950 md:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-[640px] font-sans text-[15px] leading-relaxed text-light-space/50 light:text-zinc-600">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */

export function BrandPage() {
  useDocumentTitle("Brand — Jokuh");

  return (
    <CompanyPageLayout>
      <>
        {/* ── Hero + Brand Kit Bento ─────────────────────────────── */}
        <section className={cn(COMPANY_PAGE_SHELL, "pt-28 pb-16 md:pt-32 md:pb-20")}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <CompanyPageHero eyebrow="Company" title="Brand" />
            <p className="max-w-[320px] font-sans text-[15px] leading-relaxed text-light-space/50 light:text-zinc-600 sm:text-right">
              Assets, examples and guides.
            </p>
          </div>

          {/* Bento grid */}
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-[1fr_320px]">
            {/* Large logo card with lava lamp */}
            <div className="relative flex min-h-[400px] items-center justify-center overflow-hidden rounded-[20px] bg-[#0a0a0a] md:row-span-2">
              <LavaLamp style="aurora" className="absolute inset-0" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 38 22"
                fill="none"
                className="relative z-10 w-[clamp(100px,20vw,160px)] drop-shadow-[0_4px_24px_rgba(255,255,255,0.15)]"
              >
                <path d={NEXUS_PATH} fill="white" />
              </svg>
            </div>

            {/* Right column — stacked */}
            <div className="flex flex-col gap-4 md:row-span-2">
              {/* Gooey card */}
              <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-[20px] bg-[#0a0a0a] light:bg-zinc-100">
                <span className="select-none font-sans text-[clamp(1.5rem,4vw,2.25rem)] font-semibold tracking-tight text-light-space light:text-zinc-950">
                  G<GooeyEyes />ey.
                </span>
              </div>

              {/* Download brand kit card */}
              <a
                href="/brand/jokuh-logomark-white.svg"
                download="jokuh-brand-kit.svg"
                className="group flex flex-1 flex-col justify-between rounded-[20px] border border-light-space/[0.08] p-6 transition-colors hover:border-light-space/20 hover:bg-white/[0.02] light:border-zinc-200 light:hover:border-zinc-300 light:hover:bg-zinc-50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-sans text-[17px] font-semibold text-light-space light:text-zinc-950">
                      Download Brand Kit
                    </h3>
                    <p className="mt-1 font-sans text-[14px] text-light-space/50 light:text-zinc-500">
                      Logos, illustrations and more.
                    </p>
                  </div>
                  <Download04Icon
                    size={20}
                    strokeWidth={1.5}
                    className="shrink-0 text-light-space/40 transition-colors group-hover:text-light-space light:text-zinc-400 light:group-hover:text-zinc-900"
                  />
                </div>
                <div className="mt-6 flex items-center gap-2">
                  <span className="font-mono text-[12px] font-medium tracking-wider uppercase text-light-space/30 light:text-zinc-400">
                    ZIP
                  </span>
                </div>
              </a>
            </div>
          </div>

        </section>

        {/* ── Sections ─────────────────────────────────────────────── */}
        <div className={cn(COMPANY_PAGE_SHELL, "space-y-20 pb-24")}>
          {/* Logo */}
          <BrandSection
            id="logo"
            title="Logo"
            description="Our definitive mark."
          >
            {/* Large showcase */}
            <div className="flex aspect-[16/9] w-full items-center justify-center rounded-[20px] bg-[#0a0a0a] light:bg-zinc-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 38 22"
                fill="none"
                className="w-[clamp(100px,20vw,180px)] text-white light:text-zinc-900"
              >
                <path d={NEXUS_PATH} fill="currentColor" />
              </svg>
            </div>

            {/* Logomark explanation */}
            <div className="mt-8">
              <h3 className="font-sans text-lg font-semibold text-light-space light:text-zinc-950">
                Logomark
              </h3>
              <p className="mt-3 max-w-[560px] font-sans text-[15px] leading-relaxed text-light-space/55 light:text-zinc-600">
                The Nexus logomark stands at the heart of Jokuh's visual identity, embodying the brand across all platforms. Two mirrored eyes form the mask — representing the duality of human perception and machine understanding. The outer arch is the bridge between them: a single curve of conviction that holds the gaze together. The negative space at center is deliberate — it's where identity lives, in the gap between knowing and feeling.
              </p>
            </div>

          </BrandSection>

          {/* Gooey */}
          <BrandSection
            id="gooey"
            title="Gooey"
            description="The design system and component library for Jokuh."
          >
            <p className="max-w-[640px] font-sans text-[15px] leading-relaxed text-light-space/55 light:text-zinc-600">
              Gooey is not a UI kit. It is the visual language of a platform built to express human identity — where every color carries mood, every shape carries conviction, and every space between them creates the peace that lets people feel something real through a screen.
            </p>
            <p className="mt-8 font-display text-[clamp(1.5rem,4vw,2.5rem)] leading-none text-light-space/30 light:text-zinc-950/25">
              Hyke
            </p>
          </BrandSection>

          {/* Colors */}
          <BrandSection
            id="colors"
            title="Colors"
            description="This primary palette forms the fundamental color scheme of the brand."
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {ENERGY_TRIADS.map((triad) => (
                <EnergyTriadSwatch key={triad.name} name={triad.name} steps={triad.steps} />
              ))}
            </div>

            <h3 className="mb-4 mt-14 font-sans text-[13px] font-semibold tracking-[0.06em] uppercase text-light-space/45 light:text-zinc-500">
              Eclipse &amp; Shades
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {ECLIPSE_COLORS.map((c) => (
                <ColorSwatch key={c.token} hex={c.hex} name={c.name} />
              ))}
            </div>
          </BrandSection>

          {/* Typography */}
          <section id="typography" className="scroll-mt-24">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[280px_1fr] md:gap-12 lg:grid-cols-[320px_1fr]">
              {/* Left — sticky title */}
              <div className="md:sticky md:top-24 md:self-start">
                <div className="border-b border-light-space/[0.08] pb-4 light:border-zinc-200">
                  <h2 className="font-sans text-xl font-semibold tracking-tight text-light-space light:text-zinc-950 md:text-2xl">
                    Typography
                  </h2>
                  <p className="mt-2 font-sans text-[15px] leading-relaxed text-light-space/50 light:text-zinc-600">
                    The three typefaces that define the brand.
                  </p>
                </div>
              </div>

              {/* Right — stacked cards */}
              <div className="space-y-6">
                {TYPEFACES.map((tf) => (
                  <div key={tf.name}>
                    <div className="flex h-[200px] min-w-0 items-center overflow-hidden rounded-[20px] bg-light-space/[0.04] pl-[8%] light:bg-zinc-100/80 md:h-[240px]">
                      <span
                        className={cn(
                          "select-none whitespace-nowrap text-[clamp(5rem,12vw,9rem)] font-medium leading-[0.85] tracking-[-0.05em] text-light-space/[0.1] light:text-zinc-950/[0.1]",
                          tf.fontClass,
                        )}
                      >
                        {tf.preview}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <h3 className="font-sans text-[17px] font-semibold text-light-space light:text-zinc-950">
                        {tf.name}
                      </h3>
                      <span className="font-sans text-[14px] text-light-space/45 light:text-zinc-500">
                        {tf.role}
                      </span>
                      <span className="rounded-full border border-light-space/[0.1] px-2.5 py-0.5 font-mono text-[11px] text-light-space/40 light:border-zinc-200 light:text-zinc-500">
                        {tf.free ? "Free" : "License Required"}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Red Hat Mono */}
                <div>
                  <div className="flex h-[200px] min-w-0 items-center overflow-hidden rounded-[20px] bg-light-space/[0.04] pl-[8%] light:bg-zinc-100/80 md:h-[240px]">
                    <span className="select-none whitespace-nowrap font-mono text-[clamp(5rem,12vw,9rem)] font-medium leading-[0.85] tracking-[-0.05em] text-light-space/[0.1] light:text-zinc-950/[0.1]">
                      uint a = 128;
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <h3 className="font-sans text-[17px] font-semibold text-light-space light:text-zinc-950">
                      Red Hat Mono
                    </h3>
                    <span className="font-sans text-[14px] text-light-space/45 light:text-zinc-500">
                      Used for code.
                    </span>
                    <span className="rounded-full border border-light-space/[0.1] px-2.5 py-0.5 font-mono text-[11px] text-light-space/40 light:border-zinc-200 light:text-zinc-500">
                      Free
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Token & Avatars */}
          <BrandSection
            id="token-avatars"
            title="Token & Avatars"
            description="The logomark inside a circular or square container."
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Circle — Vortex symbol */}
              <div className="group relative flex aspect-[4/3] items-center justify-center rounded-[20px] bg-light-space/[0.04] light:bg-zinc-100/80">
                <div className="flex size-[clamp(80px,16vw,140px)] items-center justify-center rounded-full bg-light-space/[0.08] light:bg-zinc-200">
                  <svg
                    width="57"
                    height="26"
                    viewBox="0 0 57 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-[clamp(40px,8vw,64px)] text-white light:text-zinc-950"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M28.0925 0.000217438C12.5774 0.000217438 -6.86646e-05 5.65301 -6.86646e-05 12.6261C-6.86646e-05 19.5992 12.5774 25.252 28.0925 25.252C43.6076 25.252 56.1851 19.5992 56.1851 12.6261C56.1851 5.65301 43.6076 0.000217438 28.0925 0.000217438ZM36.7459 12.3018C31.9394 12.4017 10.1995 12.7144 13.7468 8.27048C17.0259 4.51373 24.4167 1.8941 33.0087 1.8941C44.645 1.8941 54.0781 6.69897 54.0781 12.6261C54.0781 18.5532 44.645 23.3581 33.0087 23.3581C24.4167 23.3581 17.026 20.7385 13.7468 16.9817C10.1993 12.5377 31.9394 12.8504 36.7459 12.9503C36.9136 15.783 39.264 18.0285 42.1388 18.0285C45.1224 18.0285 47.5412 15.6098 47.5412 12.6261C47.5412 9.64242 45.1224 7.22367 42.1388 7.22367C39.264 7.22367 36.9136 9.46913 36.7459 12.3018Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <CopySvgButton svg={VORTEX_SVG} />
              </div>

              {/* Square — Jokuh logo */}
              <div className="group relative flex aspect-[4/3] items-center justify-center rounded-[20px] bg-light-space/[0.04] light:bg-zinc-100/80">
                <div className="flex size-[clamp(80px,16vw,140px)] items-center justify-center rounded-2xl bg-light-space/[0.08] light:bg-zinc-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 38 22"
                    fill="none"
                    className="w-[clamp(36px,7vw,56px)] text-white light:text-zinc-950"
                  >
                    <path d={NEXUS_PATH} fill="currentColor" />
                  </svg>
                </div>
                <CopySvgButton svg={NEXUS_SVG} />
              </div>
            </div>
          </BrandSection>

          {/* OO Mascot */}
          <BrandSection
            id="oo"
            title="OO"
            description="Reintroducing Jokuh's ubiquitous global icon, OO."
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Row 1 — two side by side */}
              <div className="flex aspect-[4/3] items-center justify-center rounded-[20px] border border-zinc-800 bg-black light:border-zinc-200 light:bg-zinc-100">
                <OO
                  expression="default"
                  backgroundColor="#0066FF"
                  className="!size-[clamp(80px,16vw,140px)] !border-[3px]"
                />
              </div>
              <div className="flex aspect-[4/3] items-center justify-center rounded-[20px] border border-zinc-800 bg-black light:border-zinc-200 light:bg-zinc-100">
                <OO
                  expression="happy"
                  backgroundColor="#21DC11"
                  bodyGradientStart="#7700FF"
                  bodyGradientEnd="#B300FF"
                  className="!size-[clamp(80px,16vw,140px)] !border-[3px]"
                />
              </div>

              {/* Row 2 */}
              <div className="flex aspect-square items-center justify-center rounded-[20px] border border-zinc-800 bg-black light:border-zinc-200 light:bg-zinc-100 sm:aspect-[4/3]">
                <OO
                  expression="rainbow-puke"
                  backgroundColor="#0066FF"
                  className="!size-[clamp(64px,12vw,100px)] !border-[2px]"
                />
              </div>
              <div className="flex aspect-square items-center justify-center rounded-[20px] border border-zinc-800 bg-black light:border-zinc-200 light:bg-zinc-100 sm:aspect-[4/3]">
                <OO
                  expression="default"
                  backgroundColor="#008789"
                  bodyGradientStart="#00667A"
                  bodyGradientEnd="#009BA0"
                  bodyStrokeColor="#83EEE8"
                  className="!size-[clamp(64px,12vw,100px)] !border-[2px]"
                />
              </div>
            </div>
          </BrandSection>


          {/* Best Practices */}
          <BrandSection
            id="best-practices"
            title="Best Practices"
            description="Reference these suggested guidelines when using the Jokuh identity in your projects."
          >
            {/* Suggested usage */}
            <h3 className="mb-5 font-sans text-[15px] font-semibold text-light-space light:text-zinc-950">
              Suggested usage
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <PracticeCard
                good
                label="Use colors with adequate contrast."
                logo={<LogoMark fill="currentColor" className="text-white light:text-zinc-950" />}
                bg="bg-[#0a0a0a] light:bg-zinc-100"
              />
              <PracticeCard
                good
                label="Give the mark enough spacing."
                logo={<LogoMark fill="currentColor" className="text-light-space/30 light:text-zinc-400" />}
                bg="bg-light-space/[0.04] light:bg-zinc-100/80"
                border
              />
              <PracticeCard
                good
                label="Use the logos as provided. Treat them with care."
                logo={<LogoMark fill="currentColor" className="text-light-space/50 light:text-zinc-500" />}
                bg="bg-light-space/[0.04] light:bg-zinc-100/80"
              />
              <PracticeCard
                good
                label="Use the full logo when more brand context is needed."
                logo={<LogoMark fill="currentColor" className="text-light-space/50 light:text-zinc-500" />}
                bg="bg-light-space/[0.04] light:bg-zinc-100/80"
              />
            </div>

            {/* Things to avoid */}
            <h3 className="mb-5 mt-14 font-sans text-[15px] font-semibold text-light-space light:text-zinc-950">
              Things to avoid
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <PracticeCard
                label="Stretching or deforming the mark in a non-uniform way."
                logo={<LogoMark fill="currentColor" className="text-light-space/25 light:text-zinc-300" style={{ transform: "scaleX(1.5) scaleY(0.7)" }} />}
                bg="bg-light-space/[0.04] light:bg-zinc-100/80"
                strikethrough
              />
              <PracticeCard
                label="Rotating the mark or flipping it upside-down awkwardly."
                logo={<LogoMark fill="currentColor" className="text-light-space/25 light:text-zinc-300" style={{ transform: "rotate(180deg)" }} />}
                bg="bg-light-space/[0.04] light:bg-zinc-100/80"
                strikethrough
              />
              <PracticeCard
                label="Presenting the mark with negative emotions."
                logo={<LogoMark fill="currentColor" className="text-light-space/25 light:text-zinc-300" style={{ transform: "scaleY(-1)" }} />}
                bg="bg-light-space/[0.04] light:bg-zinc-100/80"
                strikethrough
              />
              <PracticeCard
                label="Although this looks lit, don't use multiple colors within the mark."
                logo={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 22" fill="none" className="w-[48px]">
                    <path d="M16.9692 12.4816C16.4843 13.1956 12.9576 15.3082 11.0573 14.0865C9.15706 12.8649 7.37419 8.7448 8.59416 7.85859C9.81413 6.97238 18.1891 10.685 16.9692 12.4816Z" fill="#FF0700" />
                    <path d="M27.2076 14.0865C25.3073 15.3082 21.7807 13.1957 21.2958 12.4816C20.0758 10.685 28.451 6.97223 29.6708 7.85844C30.8906 8.74466 29.1077 12.8649 27.2076 14.0865Z" fill="#0066FF" />
                    <path d={NEXUS_PATH} fill="none" stroke="currentColor" strokeWidth="0.5" className="text-light-space/15 light:text-zinc-300" />
                  </svg>
                }
                bg="bg-light-space/[0.04] light:bg-zinc-100/80"
                strikethrough
              />
              <PracticeCard
                label="Cropping the mark. Especially in a creepy way."
                logo={
                  <div className="overflow-hidden" style={{ width: 48, height: 18 }}>
                    <LogoMark fill="currentColor" className="text-light-space/25 light:text-zinc-300" style={{ marginTop: -4 }} />
                  </div>
                }
                bg="bg-light-space/[0.04] light:bg-zinc-100/80"
                strikethrough
              />
              <PracticeCard
                label="Using patterns, gradients or shadows."
                logo={
                  <div className="relative">
                    <LogoMark fill="url(#brand-gradient-bad)" className="text-light-space/20 light:text-zinc-300" />
                    <svg className="absolute h-0 w-0">
                      <defs>
                        <linearGradient id="brand-gradient-bad" x1="0" y1="0" x2="38" y2="22" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#FF0700" stopOpacity="0.4" />
                          <stop offset="1" stopColor="#0066FF" stopOpacity="0.4" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                }
                bg="bg-light-space/[0.04] light:bg-zinc-100/80"
                strikethrough
              />
            </div>
          </BrandSection>

          {/* FAQs */}
          <FaqSection
            items={[
              {
                question: "How do I use the logo?",
                answer: "The Jokuh logo should be used in its original form without any modifications. It should be clearly visible and not distorted. The logo should also maintain a minimum clear space around it to ensure it stands out.",
              },
              {
                question: "Can I use Jokuh brand elements for my own project?",
                answer: "You can use the Jokuh logo on your website or promotional materials, provided your usage doesn't misrepresent the Jokuh brand. Visual assets should not be altered, combined with other logos, or used in a way that misrepresents the Jokuh brand.",
              },
              {
                question: "Can I create my own assets using the Jokuh brand elements?",
                answer: "Yes, we encourage you to stay true to the Jokuh brand while creating your own assets. Start with the logomark and follow the color, typography, and spacing guidelines on this page.",
              },
              {
                question: "What typefaces does Jokuh use?",
                answer: "Jokuh uses three typefaces: Satoshi for headlines and body text, Rock Salt for expressive display moments, and Red Hat Mono for code and agentic workforce representation. All three are free to use.",
              },
              {
                question: "Where can I download brand assets?",
                answer: "You can download the logomark SVGs directly from the top of this page. Both white and black variants are available for immediate download.",
              },
            ]}
          />
        </div>
      </>
    </CompanyPageLayout>
  );
}

/* ── Sub-components ───────────────────────────────────────────────────── */

function CopySvgButton({ svg }: { svg: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(svg).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }, [svg]);

  return (
    <button
      type="button"
      onClick={copy}
      className="group/copy absolute right-4 bottom-4 flex size-9 items-center justify-center rounded-full border border-light-space/[0.1] bg-light-space/[0.05] text-light-space/40 opacity-0 transition-all group-hover:opacity-100 hover:border-light-space/25 hover:bg-light-space/[0.1] hover:text-light-space light:border-zinc-200 light:bg-white light:text-zinc-400 light:hover:border-zinc-300 light:hover:text-zinc-900"
      aria-label="Copy SVG"
    >
      {copied ? (
        <CheckmarkCircle02Icon size={16} strokeWidth={1.5} />
      ) : (
        <Copy01Icon size={16} strokeWidth={1.5} />
      )}
      <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-zinc-900 px-2.5 py-1 font-sans text-[11px] font-medium whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity group-hover/copy:opacity-100 light:bg-zinc-800">
        {copied ? "Copied!" : "Copy SVG"}
      </span>
    </button>
  );
}

function GooeyEyes() {
  const [blinking, setBlinking] = useState(false);

  useState(() => {
    const blink = () => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 180);
    };
    const schedule = () => {
      const delay = 2000 + Math.random() * 3000;
      return window.setTimeout(() => {
        blink();
        timerId = schedule();
      }, delay);
    };
    let timerId = schedule();
    return () => window.clearTimeout(timerId);
  });

  return (
    <span className="relative inline-block" style={{ width: "1.05em" }}>
      <span className="invisible" aria-hidden>oo</span>
      <span className="absolute inset-0 text-center">{blinking ? "--" : "oo"}</span>
    </span>
  );
}


function LogoMark({
  fill,
  className,
  style,
}: {
  fill: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 38 22"
      fill="none"
      className={cn("w-[48px]", className)}
      style={style}
    >
      <path d={NEXUS_PATH} fill={fill} />
    </svg>
  );
}

function PracticeCard({
  good,
  label,
  logo,
  bg,
  border,
  strikethrough,
}: {
  good?: boolean;
  label: string;
  logo: ReactNode;
  bg: string;
  border?: boolean;
  strikethrough?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <div
        className={cn(
          "relative flex aspect-square items-center justify-center overflow-hidden rounded-[16px]",
          bg,
          border && "border-2 border-dashed border-light-space/[0.08] light:border-zinc-200",
        )}
      >
        {logo}
        {strikethrough && (
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute left-[-10%] top-1/2 h-[2px] w-[120%] origin-center -rotate-[32deg] bg-red-4/70"
            />
          </div>
        )}
      </div>
      <p className={cn(
        "font-sans text-[13px] leading-snug",
        good
          ? "text-light-space/55 light:text-zinc-600"
          : "text-light-space/40 light:text-zinc-500",
      )}>
        {label}
      </p>
    </div>
  );
}

function EnergyTriadSwatch({
  name,
  steps,
}: {
  name: string;
  steps: { n: number; hex: string }[];
}) {
  return (
    <div className="group flex flex-col gap-2.5">
      <div className="flex h-[100px] w-full overflow-hidden rounded-xl border border-light-space/[0.08] light:border-zinc-200">
        {steps.map((s) => (
          <div
            key={s.n}
            className="flex-1 transition-transform group-hover:scale-y-[1.02]"
            style={{ backgroundColor: s.hex }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="font-sans text-[13px] font-medium text-light-space/70 light:text-zinc-700">
          {name}
        </span>
        <CopyHex hex={steps[1].hex} />
      </div>
    </div>
  );
}

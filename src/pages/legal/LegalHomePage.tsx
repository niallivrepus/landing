import type { ReactNode } from "react";
import { AppWindow, Cloud, Headphones, Lock, Scale, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import { LegalLayout, legalLink } from "../../components/legal/LegalLayout";
import { JokuhMark } from "../../components/legal/JokuhMark";

const cta = `inline-flex items-center gap-0.5 font-sans text-[14px] font-normal ${legalLink}`;

function SectionIcon({ children }: { children: ReactNode }) {
  return (
    <div className="mb-5 text-light-space [&_svg]:size-10 [&_svg]:stroke-[1.1] md:[&_svg]:size-[52px]">{children}</div>
  );
}

export function LegalHomePage() {
  return (
    <LegalLayout>
      <section className="relative overflow-hidden border-b border-light-glass-10 bg-gradient-to-b from-[#0a1628] via-[#050a12] to-black">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(ellipse 90% 60% at 50% -20%, rgba(33,220,17,0.12), transparent 50%), radial-gradient(ellipse 70% 50% at 100% 50%, rgba(100,180,255,0.08), transparent 45%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-[1024px] px-4 py-20 text-center md:px-6 md:py-28">
          <div className="mb-6 flex justify-center">
            <JokuhMark className="h-10 w-[68px] text-light-space" />
          </div>
          <h1 className="font-sans text-[40px] font-semibold leading-[1.05] tracking-tight text-light-space md:text-[56px]">
            Jokuh Legal
          </h1>
          <p className="mx-auto mt-4 max-w-[540px] font-sans text-[17px] leading-relaxed text-light-space/70 md:text-[19px]">
            Find legal information and resources for Jokuh products and services.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1024px] px-4 py-16 md:px-6 md:py-20">
        <div className="grid gap-16 md:grid-cols-2 md:gap-x-12 md:gap-y-20">
          <section id="hardware">
            <SectionIcon>
              <div className="flex gap-3">
                <Smartphone strokeWidth={1.25} />
                <AppWindow strokeWidth={1.25} />
              </div>
            </SectionIcon>
            <h2 className="font-sans text-[24px] font-semibold tracking-tight text-light-space md:text-[28px]">
              Hardware
            </h2>
            <p className="mt-3 font-sans text-[17px] leading-relaxed text-light-space/70">
              Terms, limited warranties, and service programs for Jokuh-certified devices and accessories sold
              through our store and partners.
            </p>
            <Link to="/legal#hardware" className={`${cta} mt-5`}>
              Hardware overview <span aria-hidden>›</span>
            </Link>
          </section>

          <section id="software">
            <SectionIcon>
              <div className="flex gap-2">
                <div className="flex size-11 items-center justify-center rounded-full border border-light-glass-30 font-sans text-[11px] font-semibold text-light-space">
                  OS
                </div>
                <div className="flex size-11 items-center justify-center rounded-full border border-light-glass-30 font-sans text-[11px] font-semibold text-light-space">
                  App
                </div>
              </div>
            </SectionIcon>
            <h2 className="font-sans text-[24px] font-semibold tracking-tight text-light-space md:text-[28px]">
              Software
            </h2>
            <p className="mt-3 font-sans text-[17px] leading-relaxed text-light-space/70">
              License agreements and usage terms for Jokuh apps, Pods, Spine, Vortex, and platform services
              delivered over the air.
            </p>
            <Link to="/legal#software" className={`${cta} mt-5`}>
              Software licenses <span aria-hidden>›</span>
            </Link>
          </section>
        </div>

        <section id="ethics" className="mt-20 border-t border-light-glass-10 pt-20 text-center md:mt-24 md:pt-24">
          <SectionIcon>
            <div className="mx-auto flex w-fit flex-wrap justify-center gap-4">
              <JokuhMark className="h-8 w-[52px] text-light-space" />
              <Scale strokeWidth={1.25} />
            </div>
          </SectionIcon>
          <h2 className="font-sans text-[28px] font-semibold tracking-tight text-light-space md:text-[32px]">
            Ethics & Compliance
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] font-sans text-[17px] leading-relaxed text-light-space/70">
            Jokuh conducts business ethically, honestly, and in full compliance with applicable law. Our program
            covers training, reporting channels, and vendor standards.
          </p>
          <a href="mailto:compliance@jokuh.com" className={`${cta} mt-6`}>
            Contact compliance <span aria-hidden>›</span>
          </a>
        </section>

        <section
          id="internet-services"
          className="mt-20 border-t border-light-glass-10 pt-20 text-center md:mt-24 md:pt-24 md:text-left"
        >
          <SectionIcon>
            <Cloud className="mx-auto md:mx-0" strokeWidth={1.25} />
          </SectionIcon>
          <h2 className="font-sans text-[28px] font-semibold tracking-tight text-light-space md:text-[32px]">
            Internet Services
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] font-sans text-[17px] leading-relaxed text-light-space/70 md:mx-0">
            Website terms, privacy policies, and disclosures for Jokuh online properties — aligned with the structure
            used on{" "}
            <a
              href="https://www.apple.com/legal/internet-services/terms/site.html"
              className={legalLink}
              target="_blank"
              rel="noreferrer"
            >
              Apple’s website terms
            </a>{" "}
            and{" "}
            <a href="https://www.apple.com/legal/privacy/" className={legalLink} target="_blank" rel="noreferrer">
              privacy hub
            </a>
            .
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 md:justify-start">
            <Link to="/legal/internet-services" className={cta}>
              Internet Services legal <span aria-hidden>›</span>
            </Link>
            <Link to="/legal/terms" className={cta}>
              Website Terms of Use <span aria-hidden>›</span>
            </Link>
          </div>
        </section>

        <section className="mt-20 grid gap-16 border-t border-light-glass-10 pt-20 md:mt-24 md:grid-cols-2 md:gap-12 md:pt-24">
          <div className="text-center md:text-left">
            <SectionIcon>
              <Lock className="mx-auto size-12 md:mx-0" strokeWidth={1.25} />
            </SectionIcon>
            <h2 className="font-sans text-[24px] font-semibold tracking-tight text-light-space md:text-[28px]">
              Privacy Policy
            </h2>
            <p className="mt-3 font-sans text-[17px] leading-relaxed text-light-space/70">
              How we collect, use, and protect personal data across Jokuh services — including region- and
              language-specific disclosures.
            </p>
            <Link to="/legal/privacy" className={`${cta} mt-5`}>
              Jokuh Customer Privacy Policy <span aria-hidden>›</span>
            </Link>
          </div>
          <div className="text-center md:text-left">
            <SectionIcon>
              <Headphones className="mx-auto size-12 md:mx-0" strokeWidth={1.25} />
            </SectionIcon>
            <h2 className="font-sans text-[24px] font-semibold tracking-tight text-light-space md:text-[28px]">
              Sales & Support
            </h2>
            <p className="mt-3 font-sans text-[17px] leading-relaxed text-light-space/70">
              Purchase terms, refunds where applicable, and policies for support, repairs, and subscriptions.
            </p>
            <Link to="/#start" className={`${cta} mt-5`}>
              Explore support <span aria-hidden>›</span>
            </Link>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}

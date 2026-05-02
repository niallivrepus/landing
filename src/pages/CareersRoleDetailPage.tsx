import { cn } from "@jokuh/gooey";
import { ArrowLeft } from "lucide-react";
import { Navigate, useParams } from "react-router-dom";
import { CAREERS_TEAM_INTROS, getCareersRoleBySlug, type CareersRole } from "../data/careers";
import { SiteLink } from "../components/SiteLink";
import { PillLink, TertiaryPageChrome, pageHeroEyebrowClass, proseBodyMutedClass } from "../components/system";
import { CONTENT_SHELL_COMPANY } from "../components/system/shells";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

function ApplyPill({ role }: { role: CareersRole }) {
  return <PillLink href={role.applyHref}>Apply now ↗</PillLink>;
}

function SectionHeading({ children }: { children: string }) {
  return (
    <h2 className="font-sans text-[15px] font-semibold tracking-[0em] text-light-space light:text-zinc-950">
      {children}
    </h2>
  );
}

export function CareersRoleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const role = slug ? getCareersRoleBySlug(slug) : undefined;

  useDocumentTitle(role ? `${role.title} · Jokuh Careers` : "Open Roles · Jokuh Careers");

  if (!role) {
    return <Navigate to="/careers/roles" replace />;
  }

  const teamIntro = CAREERS_TEAM_INTROS[role.team];

  return (
    <TertiaryPageChrome>
      <main>
        {/* Back to all roles */}
        <div className={cn(CONTENT_SHELL_COMPANY, "pt-16 md:pt-20")}>
          <SiteLink
            href="/careers/roles"
            className="inline-flex items-center gap-2 font-sans text-[13px] font-medium text-light-space/60 transition-colors hover:text-light-space light:text-zinc-500 light:hover:text-zinc-950"
          >
            <ArrowLeft className="size-3.5" strokeWidth={2.2} aria-hidden />
            Open roles
          </SiteLink>
        </div>

        {/* Hero */}
        <section className={cn(CONTENT_SHELL_COMPANY, "pt-6 pb-12 text-center md:pt-8 md:pb-16")}>
          <p className={pageHeroEyebrowClass}>Careers</p>
          <h1 className="mx-auto mt-5 max-w-[20ch] font-sans text-[clamp(2.25rem,6vw,4rem)] font-semibold leading-[1.02] tracking-[-0.005em] text-light-space light:text-zinc-950">
            {role.title}
          </h1>
          <p className="mx-auto mt-5 font-sans text-[14.5px] text-light-space/64 light:text-zinc-600 md:text-[15px]">
            {role.team}
            <span className="mx-2 text-light-space/30 light:text-zinc-300" aria-hidden>·</span>
            {role.location}
          </p>
          <div className="mt-7 flex justify-center">
            <ApplyPill role={role} />
          </div>
        </section>

        {/* Body */}
        <section className={cn(CONTENT_SHELL_COMPANY, "pb-16 md:pb-20")}>
          <div className="mx-auto max-w-[640px] space-y-10">
            <div className="space-y-4">
              <SectionHeading>About the Team</SectionHeading>
              {teamIntro.map((p, i) => (
                <p key={i} className={cn(proseBodyMutedClass, "max-w-none leading-[1.65]")}>
                  {p}
                </p>
              ))}
            </div>

            <div className="space-y-4">
              <SectionHeading>About the Role</SectionHeading>
              {role.roleCopy.map((p, i) => (
                <p key={i} className={cn(proseBodyMutedClass, "max-w-none leading-[1.65]")}>
                  {p}
                </p>
              ))}
            </div>

            <div className="space-y-4">
              <SectionHeading>Key Responsibilities</SectionHeading>
              <ul className="list-disc space-y-2.5 pl-5 marker:text-light-space/40 light:marker:text-zinc-400">
                {role.responsibilities.map((item) => (
                  <li key={item} className={cn(proseBodyMutedClass, "max-w-none leading-[1.6]")}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <SectionHeading>Compensation</SectionHeading>
              <p className={cn(proseBodyMutedClass, "max-w-none leading-[1.65]")}>{role.compensation}</p>
            </div>

            <div className="space-y-4">
              <SectionHeading>Equal opportunity</SectionHeading>
              <p className={cn(proseBodyMutedClass, "max-w-none leading-[1.65]")}>
                Jokuh is an equal opportunity employer. We are committed to providing reasonable accommodations to
                applicants with disabilities; requests can be made via{" "}
                <SiteLink href={role.applyHref} className="underline underline-offset-4">
                  this email
                </SiteLink>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Closing apply CTA */}
        <section className={cn(CONTENT_SHELL_COMPANY, "pb-24 text-center md:pb-32")}>
          <ApplyPill role={role} />
        </section>
      </main>
    </TertiaryPageChrome>
  );
}

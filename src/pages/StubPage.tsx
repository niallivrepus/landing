import { MegaFooter } from "../components/MegaFooter";
import { SiteTopBar } from "../components/SiteTopBar";

export function StubPage({ title }: { title: string }) {
  return (
    <div className="landing-cinema min-h-screen bg-black text-light-space">
      <SiteTopBar />
      <main className="mx-auto max-w-[720px] px-5 pt-28 pb-20 md:px-8 md:pt-32">
        <h1 className="font-sans text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h1>
        <p className="mt-4 font-sans text-sm leading-relaxed text-light-space/55">
          This page is part of the Jokuh site map. Content is coming soon.
        </p>
      </main>
      <MegaFooter />
    </div>
  );
}

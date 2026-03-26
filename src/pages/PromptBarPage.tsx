import { MegaFooter } from "../components/MegaFooter";
import { SiteTopBar } from "../components/SiteTopBar";

export function PromptBarPage() {
  return (
    <div className="landing-cinema min-h-screen bg-black text-light-space">
      <SiteTopBar />
      <main className="mx-auto max-w-[720px] px-5 pt-28 pb-20 md:px-8 md:pt-32">
        <div className="mb-10 flex justify-center md:mb-12">
          <img
            src="/prompt-bar-iphone.png"
            alt="Jokuh prompt bar on iPhone: search field and minimal controls on a dark interface"
            className="h-auto w-full max-w-[min(100%,320px)] select-none rounded-2xl object-contain shadow-[0_0_80px_rgba(255,255,255,0.06)] md:max-w-[360px]"
            width={963}
            height={1024}
            decoding="async"
          />
        </div>
        <h1 className="font-sans text-3xl font-semibold tracking-tight text-white md:text-4xl">Prompt bar</h1>
        <p className="mt-4 font-sans text-sm leading-relaxed text-light-space/55">
          This page is part of the Jokuh site map. Content is coming soon.
        </p>
      </main>
      <MegaFooter />
    </div>
  );
}

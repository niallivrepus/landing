import { useMemo } from "react";
import { PillWheel } from "@jokuh/gooey";
import { useClaimIdentityFlowContext } from "../../context/ClaimIdentityFlowContext";
import { ClaimIdentityCta } from "./ClaimIdentityCta";

const ALIEN_COUNT = 152;
const WHEEL_SIZE = 72;

const ALL_ALIEN_AVATARS = Array.from({ length: ALIEN_COUNT }, (_, i) => ({
  src: `/aliens/alien-${String(i + 1).padStart(4, "0")}.jpg`,
  alt: "Person",
}));

function shuffleUnique<T>(items: readonly T[], count: number): T[] {
  const pool = items.slice();
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j]!, pool[i]!];
  }
  return pool.slice(0, count);
}

export function IdentityBlock() {
  const claimFlow = useClaimIdentityFlowContext();
  const wheelAvatars = useMemo(
    () => shuffleUnique(ALL_ALIEN_AVATARS, WHEEL_SIZE),
    [],
  );

  return (
    <section id="identity" className="landing-cv relative scroll-mt-24 overflow-hidden bg-transparent px-3 py-[120px] md:px-8">
      <style>{`
        #identity .avatar-border {
          background: linear-gradient(135deg, #121212 0%, #0A0A0A 100%) !important;
          box-shadow: inset 0px 1px 1px 0px rgba(255,255,255,0.15) !important;
        }
        :root.light #identity .avatar-border,
        .light #identity .avatar-border {
          background: linear-gradient(135deg, #FFFFFF 0%, #F2F2F2 100%) !important;
          box-shadow: inset 0px 1px 1px 0px rgba(0,0,0,0.06) !important;
        }
      `}</style>
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      >
        <div className="origin-center scale-[0.7] opacity-90 sm:scale-[0.82] md:scale-[0.98] lg:scale-[1.15]">
          <PillWheel avatars={wheelAvatars} animationDuration={95} />
        </div>
      </div>

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      >
        <div className="relative h-[20rem] w-[20rem] sm:h-[24rem] sm:w-[24rem] md:h-[29rem] md:w-[29rem]">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(8,8,8,0.92)_0%,rgba(5,5,5,0.72)_34%,rgba(0,0,0,0.28)_58%,rgba(0,0,0,0)_76%)] blur-2xl light:bg-[radial-gradient(circle,rgba(245,245,247,0.86)_0%,rgba(244,244,245,0.66)_34%,rgba(255,255,255,0.22)_58%,rgba(255,255,255,0)_76%)]" />
          <div className="absolute left-1/2 top-1/2 h-[56%] w-[56%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(10,10,10,0.88)_0%,rgba(5,5,5,0.58)_48%,rgba(0,0,0,0)_100%)] blur-xl light:bg-[radial-gradient(circle,rgba(250,250,250,0.72)_0%,rgba(245,245,247,0.46)_48%,rgba(255,255,255,0)_100%)]" />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[min(85vh,720px)] max-w-4xl flex-col items-center justify-center text-center">
        <h2 className="max-w-[min(94vw,52ch)] font-sans text-[3rem] font-semibold leading-[1.05] tracking-[0em] text-light-space light:text-zinc-950 sm:text-[3.75rem] md:text-[5rem] lg:text-[6.25rem]">
          Own your
          <br />
          next move.
        </h2>
        <p className="mt-5 max-w-[34ch] font-sans text-[15px] leading-relaxed text-light-space/60 light:text-zinc-600">
          Claim identity to keep memory, privacy, and Bubbles with you.
        </p>
        <div className="mt-10 flex w-full max-w-sm justify-center md:mt-12 md:max-w-none">
          <ClaimIdentityCta
            href="/download?intent=identity"
            onActivate={() => claimFlow.openFrom("identity-block")}
            className="justify-center"
          >
            Claim identity
          </ClaimIdentityCta>
        </div>
      </div>
    </section>
  );
}

import { PillWheel } from "@jokuh/gooey";
import { ClaimIdentityCta } from "./ClaimIdentityCta";

const IDENTITY_WHEEL_FACE =
  "?w=128&h=128&fit=crop&crop=faces&auto=format&q=80";

const REAL_AVATARS = [
  `https://images.unsplash.com/photo-1494790108377-be9c29b29330${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1438761681033-6461ffad8d80${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1544005313-94ddf0286ad2${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1500648767791-00dcc994a43e${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1534528741775-53994a69daeb${IDENTITY_WHEEL_FACE}`,
].map((src) => ({ src, alt: "Real person" }));

const VILLAIN_AVATARS = [
  "/villains/villain-0003.png",
  "/villains/villain-0012.png",
  "/villains/villain-0027.png",
  "/villains/villain-0041.png",
  "/villains/villain-0058.png",
  "/villains/villain-0076.png",
  "/villains/villain-0099.png",
].map((src) => ({ src, alt: "V1llains NFT" }));

const IDENTITY_WHEEL_AVATARS = REAL_AVATARS.flatMap((real, i) => [
  real,
  ...(VILLAIN_AVATARS[i] ? [VILLAIN_AVATARS[i]] : []),
]);

export function IdentityBlock() {
  return (
    <section id="identity" className="relative scroll-mt-24 overflow-hidden bg-transparent px-4 py-[120px] md:px-8">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      >
        <div className="origin-center scale-[0.7] opacity-90 sm:scale-[0.82] md:scale-[0.98] lg:scale-[1.15]">
          <PillWheel avatars={IDENTITY_WHEEL_AVATARS} animationDuration={95} />
        </div>
      </div>

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      >
        <div className="relative h-[20rem] w-[20rem] sm:h-[24rem] sm:w-[24rem] md:h-[29rem] md:w-[29rem]">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(8,8,8,0.92)_0%,rgba(5,5,5,0.72)_34%,rgba(0,0,0,0.28)_58%,rgba(0,0,0,0)_76%)] blur-2xl light:bg-[radial-gradient(circle,rgba(255,255,255,0.78)_0%,rgba(255,255,255,0.56)_34%,rgba(255,255,255,0.24)_58%,rgba(255,255,255,0)_76%)]" />
          <div className="absolute left-1/2 top-1/2 h-[56%] w-[56%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(10,10,10,0.88)_0%,rgba(5,5,5,0.58)_48%,rgba(0,0,0,0)_100%)] blur-xl light:bg-[radial-gradient(circle,rgba(255,255,255,0.88)_0%,rgba(255,255,255,0.52)_48%,rgba(255,255,255,0)_100%)]" />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[min(85vh,720px)] max-w-4xl flex-col items-center justify-center text-center">
        <h2 className="max-w-[min(94vw,52ch)] font-sans text-[3rem] font-semibold leading-[1.05] tracking-[-0.035em] text-light-space light:text-zinc-950 sm:text-[3.75rem] md:text-[5rem] lg:text-[6.25rem]">
          Own your next move.
        </h2>
        <div className="mt-10 flex w-full max-w-sm justify-center md:mt-12 md:max-w-none">
          <ClaimIdentityCta href="/waitlist" className="justify-center">
            Claim identity
          </ClaimIdentityCta>
        </div>
      </div>
    </section>
  );
}

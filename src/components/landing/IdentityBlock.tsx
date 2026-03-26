import { PillWheel } from "@jokuh/gooey";
import { ClaimIdentityCta } from "./ClaimIdentityCta";

const IDENTITY_WHEEL_FACE =
  "?w=128&h=128&fit=crop&crop=faces&auto=format&q=80";
const IDENTITY_WHEEL_AVATARS = [
  `https://images.unsplash.com/photo-1494790108377-be9c29b29330${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1438761681033-6461ffad8d80${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1544005313-94ddf0286ad2${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1500648767791-00dcc994a43e${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1534528741775-53994a69daeb${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1524504388940-b1c1722653e1${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1506794778202-cad84cf45f1d${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1517841905240-472988babdf9${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1539578708538-e09bc6d2e4b5${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1520813792240-56fc4a3765a7${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1489424731084-a5d8b219a853${IDENTITY_WHEEL_FACE}`,
  `https://images.unsplash.com/photo-1488426862026-3ee34a7d66df${IDENTITY_WHEEL_FACE}`,
].map((src) => ({ src, alt: "" }));

export function IdentityBlock() {
  return (
    <section id="identity" className="relative scroll-mt-24 bg-transparent px-4 py-20 md:px-8 md:py-28">
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
          <div className="absolute inset-0 rounded-full bg-white/72 blur-2xl light:bg-white/78" />
          <div className="absolute left-1/2 top-1/2 h-[56%] w-[56%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/82 blur-xl light:bg-white/88" />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[min(72vh,560px)] max-w-4xl flex-col items-center justify-center text-center">
        <h2 className="max-w-[min(94vw,52ch)] font-sans text-[3rem] font-semibold leading-[1.05] tracking-[-0.035em] text-light-space sm:text-[3.75rem] md:text-[5rem] lg:text-[6.25rem]">
          Your own handle,
          <br />
          to your next move
        </h2>
        <div className="mt-10 flex w-full max-w-sm justify-center md:mt-12 md:max-w-none">
          <ClaimIdentityCta href="/waitlist" className="w-full justify-center md:w-auto">
            Join the waitlist
          </ClaimIdentityCta>
        </div>
      </div>
    </section>
  );
}

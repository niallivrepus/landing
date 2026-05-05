export function LandingEditorialSection() {
  return (
    <section
      className="px-3 py-20 md:px-8 md:py-28"
      aria-labelledby="editorial-heading"
    >
      <div className="mx-auto max-w-[min(calc(100vw-1.5rem),720px)] text-center md:max-w-[min(calc(100vw-4rem),820px)]">
        <h2
          id="editorial-heading"
          className="font-sans text-2xl font-semibold leading-tight tracking-[0em] text-light-space light:text-zinc-950 md:text-3xl"
        >
          Today&apos;s AI runs on you. Jokuh runs for you.
        </h2>
        <p className="mt-6 text-[15px] leading-relaxed text-light-space/70 light:text-zinc-600 md:text-base">
          Many mainstream AI services may log or retain prompts depending on plan, settings, and policy.
          Jokuh is designed to reduce company access to user content through encryption, scoped key handling,
          and execution paths built for stronger verification.
        </p>
      </div>
    </section>
  );
}

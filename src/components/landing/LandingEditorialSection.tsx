export function LandingEditorialSection() {
  return (
    <section
      className="landing-cv px-3 py-20 md:px-8 md:py-28"
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
          Most AI products log and retain what you tell them. Jokuh is built the other way: content encrypted,
          keys scoped to you, and access designed to be verified, not assumed.
        </p>
      </div>
    </section>
  );
}

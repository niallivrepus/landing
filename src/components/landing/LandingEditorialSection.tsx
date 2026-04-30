export function LandingEditorialSection() {
  return (
    <section
      className="px-4 py-20 md:px-8 md:py-28"
      aria-labelledby="editorial-heading"
    >
      <div className="mx-auto max-w-[min(calc(100vw-2rem),720px)] text-center md:max-w-[min(calc(100vw-4rem),820px)]">
        <h2
          id="editorial-heading"
          className="font-sans text-2xl font-semibold leading-tight tracking-[0em] text-light-space light:text-zinc-950 md:text-3xl"
        >
          Today&apos;s AI runs on you. Jokuh runs for you.
        </h2>
        <p className="mt-6 text-[15px] leading-relaxed text-light-space/70 light:text-zinc-600 md:text-base">
          Every prompt you type into a mainstream model is logged and retained. Privacy by policy
          changes at 2 a.m. Privacy by mathematics does not. Jokuh is built so the company cannot read
          your data: keys stay with you, computation runs in a Trusted Execution Environment, and
          verification is mathematical—not promised.
        </p>
      </div>
    </section>
  );
}

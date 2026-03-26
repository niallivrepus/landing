import { cn } from "@jokuh/gooey";
import { Link } from "react-router-dom";

const shell = "mx-auto w-full max-w-[1380px] px-5 md:px-8";
/** Use inside a padded shell (e.g. news article column); matches `read` on NewsDetailPage */
const articleMeasure = "mx-auto w-full max-w-[min(100%,720px)]";

type SealCard = {
  quote: string;
  name: string;
  role: string;
  company: string;
  /** tailwind bg classes */
  panelClass: string;
  quoteClass: string;
  metaClass: string;
  logoClass: string;
};

const CARDS: [SealCard, SealCard] = [
  {
    quote: "You just have to use it and you will see—you will feel the difference in how work moves.",
    name: "Morgan Ellis",
    role: "VP Engineering",
    company: "Northline",
    panelClass:
      "relative overflow-hidden bg-gradient-to-br from-[#c4b5fd]/25 via-[#a5b4fc]/20 to-[#93c5fd]/15 ring-1 ring-white/[0.08]",
    quoteClass: "text-[#1c1535]/95",
    metaClass: "text-[#1c1535]/80",
    logoClass: "bg-[#1c1535]/90 text-white",
  },
  {
    quote: "Our speed is intense and Jokuh helps us stay action-biased on long-horizon work.",
    name: "Riley Park",
    role: "Platform Lead",
    company: "Harbor",
    panelClass: "bg-[#b8e600] ring-1 ring-black/[0.06]",
    quoteClass: "text-black/90",
    metaClass: "text-black/75",
    logoClass: "bg-black text-[#b8e600]",
  },
];

function Monogram({ letter, className }: { letter: string; className: string }) {
  return (
    <div
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-lg font-sans text-xs font-semibold tracking-tight",
        className,
      )}
      aria-hidden
    >
      {letter}
    </div>
  );
}

function SealCardView({ card, wide }: { card: SealCard; wide: boolean }) {
  const letter = card.company.slice(0, 1);
  return (
    <div
      className={cn(
        "flex min-h-[220px] flex-col justify-between rounded-2xl p-6 md:min-h-[260px] md:p-8 lg:p-9",
        wide && "md:col-span-2",
        !wide && "md:col-span-1",
        card.panelClass,
      )}
    >
      {wide && (
        <div
          className="pointer-events-none absolute -right-8 -top-8 font-sans text-[140px] font-semibold leading-none text-white/[0.07] md:text-[180px]"
          aria-hidden
        >
          {letter}
        </div>
      )}
      <p
        className={cn(
          "relative z-[1] max-w-[22ch] font-sans text-xl font-medium leading-[1.2] tracking-[-0.03em] md:max-w-none md:text-2xl lg:text-[1.65rem] lg:leading-[1.25]",
          card.quoteClass,
        )}
      >
        “{card.quote}”
      </p>
      <div className="relative z-[1] mt-10 flex items-end gap-3 md:mt-12">
        <Monogram letter={letter} className={card.logoClass} />
        <div>
          <p className={cn("font-sans text-sm font-semibold md:text-[0.9375rem]", card.metaClass)}>{card.name}</p>
          <p className={cn("font-sans text-sm font-normal md:text-[0.9375rem]", card.metaClass)}>
            {card.role}, {card.company}
          </p>
        </div>
      </div>
    </div>
  );
}

export function EndorsementSeal({
  className,
  storiesHref = "/journal",
  articleMeasure: useArticleMeasure,
}: {
  className?: string;
  storiesHref?: string;
  /** Match news article reading column (~720px) */
  articleMeasure?: boolean;
}) {
  const [a, b] = CARDS;
  return (
    <section
      className={cn(useArticleMeasure ? articleMeasure : shell, "py-16 md:py-24", className)}
      aria-labelledby="endorsement-seal-heading"
    >
      <h2 id="endorsement-seal-heading" className="sr-only">
        Trusted by teams
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        <SealCardView card={a} wide />
        <SealCardView card={b} wide={false} />
      </div>
      <div className="mt-8 flex flex-col gap-4 md:mt-10 md:flex-row md:items-center md:justify-between">
        <p className="font-sans text-sm leading-relaxed text-white/45 md:text-[0.9375rem]">
          Jokuh powers product and platform teams—from ambitious startups to major enterprises.
        </p>
        <Link
          to={storiesHref}
          className="inline-flex w-fit items-center gap-1 font-sans text-sm text-white/45 transition-colors hover:text-white/75 md:text-[0.9375rem]"
        >
          Customer stories
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}

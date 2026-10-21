import {
  DEFENSE_BUILT_TODAY,
  DEFENSE_CLOSING,
  DEFENSE_DOC_FOOTER_LINKS,
  DEFENSE_PRINCIPLES,
  DEFENSE_PRINCIPLES_HEADING,
  DEFENSE_ROADMAP,
  DEFENSE_SIGNATURE_TEXT,
  DEFENSE_USE_CASES,
  DEFENSE_WORKING_WITH_US,
} from "../../../data/defense";
import { JokuhButton } from "../../system/JokuhButton";
import { SiteLink } from "../../SiteLink";

/**
 * **Purpose:** The honest back half of `/defense`: principles, where it fits (intent, not deployments), what's built
 * today vs. on the roadmap, the plain government status, and the closing call. Copy and the accuracy rules live in
 * `data/defense.ts`; `tests/defense.spec.ts` pins the load-bearing sentences.
 * **Connects to:** `data/defense.ts`, `defense-goo.css`.
 */
export function DefensePrinciples() {
  return (
    <section className="defense-section" aria-labelledby="defense-principles-title">
      <div className="defense-section__head">
        <h2 id="defense-principles-title" className="defense-h2">
          {DEFENSE_PRINCIPLES_HEADING.title}
        </h2>
        <p className="defense-lede">{DEFENSE_PRINCIPLES_HEADING.intro}</p>
      </div>
      <ul className="defense-cards">
        {DEFENSE_PRINCIPLES.map((p) => (
          <li key={p.id} className="defense-card">
            <h3 className="defense-card__title">{p.title}</h3>
            <p className="defense-card__body">{p.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function DefenseFits() {
  return (
    <section className="defense-section" aria-labelledby="defense-fits-title">
      <div className="defense-section__head">
        <h2 id="defense-fits-title" className="defense-h2">
          {DEFENSE_USE_CASES.title}
        </h2>
        <p className="defense-lede">{DEFENSE_USE_CASES.intro}</p>
      </div>
      <ul className="defense-cards defense-cards--three">
        {DEFENSE_USE_CASES.items.map((u) => (
          <li key={u.id} className="defense-card">
            <h3 className="defense-card__title">{u.title}</h3>
            <p className="defense-card__body">{u.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function DefenseBuilt() {
  return (
    <section className="defense-section" aria-labelledby="defense-built-title">
      <div className="defense-split">
        <div className="defense-panel">
          <h2 id="defense-built-title" className="defense-h2 defense-h2--sm">
            {DEFENSE_BUILT_TODAY.title}
          </h2>
          <p className="defense-lede">{DEFENSE_BUILT_TODAY.intro}</p>
          <ul className="defense-checks">
            {DEFENSE_BUILT_TODAY.items.map((item) => (
              <li key={item}>
                <span aria-hidden className="defense-check" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="defense-panel defense-panel--roadmap">
          <span className="defense-badge" data-status="roadmap">
            {DEFENSE_ROADMAP.badge}
          </span>
          <h2 className="defense-h2 defense-h2--sm">{DEFENSE_ROADMAP.title}</h2>
          <p className="defense-lede">{DEFENSE_ROADMAP.intro}</p>
          <ul className="defense-roadmap">
            {DEFENSE_ROADMAP.items.map((item) => (
              <li key={item.id}>
                <h3 className="defense-card__title">{item.title}</h3>
                <p className="defense-card__body">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function DefenseGovernment() {
  return (
    <section className="defense-section defense-gov" aria-labelledby="defense-gov-title">
      <div className="defense-gov__card">
        <h2 id="defense-gov-title" className="defense-h2 defense-h2--sm">
          {DEFENSE_WORKING_WITH_US.title}
        </h2>
        <p className="defense-gov__body">{DEFENSE_WORKING_WITH_US.body}</p>
        <div className="defense-hero__ctas">
          <JokuhButton href={DEFENSE_WORKING_WITH_US.buttonHref} variant="primary">
            {DEFENSE_WORKING_WITH_US.buttonLabel}
          </JokuhButton>
          <JokuhButton href="/defense/capability-statement.pdf" variant="secondary" download>
            Capability statement (PDF)
          </JokuhButton>
        </div>
      </div>
      <div className="defense-close">
        <p className="defense-close__headline">{DEFENSE_CLOSING.headline}</p>
        <p className="defense-close__sig" aria-label={DEFENSE_SIGNATURE_TEXT}>
          <strong>{DEFENSE_CLOSING.signature.wordmark}</strong>
          <span aria-hidden> · </span>
          {DEFENSE_CLOSING.signature.words.join(" ")}
        </p>
        <nav className="defense-close__links" aria-label="Related">
          {DEFENSE_DOC_FOOTER_LINKS.map((l) => (
            <SiteLink key={l.href} href={l.href}>
              {l.label}
            </SiteLink>
          ))}
        </nav>
      </div>
    </section>
  );
}

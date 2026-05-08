# Jokuh Brand Taxonomy v1.1

Checkpoint A status: founder review required before route, menu, copy, or CI migration.

## Locked Story

Jokuh is the sovereign agentic OS.

ARC Terminal is the first interface.

Spine, Sidekick, Blurbs, Pods, and Wallet are the public primitive set inside ARC Terminal.

The public story must use this hierarchy consistently:

1. Jokuh OS
2. ARC Terminal
3. Spine, Sidekick, Blurbs, Pods, Wallet

## TestFlight Verification

Evidence found in the repo:

- Spine: verified live in TestFlight through the newsroom item "Spine ships to TestFlight."
- Sidekick: not verified as shipping in TestFlight today.
- Blurbs: not verified as shipping in TestFlight today.
- Pods: not verified as shipping in TestFlight today.
- Wallet: not verified as shipping in TestFlight today.

Taxonomy decision:

- Spine remains `status='live'`.
- Sidekick, Blurbs, Pods, and Wallet are demoted to `status='beta'` until founder or release evidence confirms they ship in TestFlight today.
- Roadmap primitives remain `status='roadmap'`.

## Product Category

Primary category: sovereign agentic operating system.

Plain-language category: privacy-first AI operating system for memory, agents, communication, and wallet workflows.

The site must make this category clear above the fold within five seconds on desktop and mobile.

## Domain

Canonical domain: `jokuh.com`

Canonical origin: `https://jokuh.com`

Rules:

- Public copy may reference `jokuh.com` only.
- `jokuh.io` is forbidden.
- Standalone roadmap or lab domains are not public marketing copy unless founder-approved.

## Email Whitelist

Only these addresses may appear in public site copy:

- `sean@sierri.com` - general, early access, founder, investor, and strategic partner surfaces
- `sales@jokuh.com` - sales and business requests
- `support@jokuh.com` - support, privacy, account, and product help
- `careers@jokuh.com` - hiring

Rules:

- `privacy@jokuh.com` is not allowed.
- Privacy contact routes to `support@jokuh.com`.
- Prefer `sales@jokuh.com` for sales-specific flows, `support@jokuh.com` for product and account help, and `sean@sierri.com` for general or early-access outreach when a single mailbox is shown.

## Primitive Canonical Descriptions

Use these sentences verbatim on every public surface.

| Primitive | Status | Route | Canonical description |
| --- | --- | --- | --- |
| Spine | Live | `/spine` | Spine is Jokuh's private memory layer, turning chosen context into structured recall for ARC Terminal. |
| Sidekick | Beta | `/sidekick` | Sidekick is Jokuh's agentic operator, helping plan and act across approved ARC Terminal context. |
| Blurbs | Beta | `/blurbs` | Blurbs turns conversations and rough notes into clean, shareable updates without losing source context. |
| Pods | Beta | `/pods` | Pods are shared ARC Terminal spaces for teams, projects, and communities to keep scoped context together. |
| Wallet | Beta | `/wallet` | Wallet gives Jokuh users identity, payments, and transaction control inside ARC Terminal. |

Rules:

- `status='live'` means verified shipping in iOS TestFlight today.
- `status='beta'` means public primitive, beta or early-access posture, not yet verified as shipping in TestFlight today.
- Beta primitive pages may exist, but must be visibly beta-tagged in the page chrome, cards, search results, and nav metadata.

## Roadmap Primitives

These may be visible only through a roadmap status guard. They must not have public detail-page routes until founder-approved.

| Primitive | Status | Route |
| --- | --- | --- |
| Vortex | Roadmap | None |
| Passport | Roadmap | None |
| Orb | Roadmap | None |
| Realms | Roadmap | None |
| V1llains | Roadmap | None |

Rules:

- Roadmap primitives may appear only in a roadmap rail on `/about`.
- The roadmap rail must be rendered from `status='roadmap'` data.
- Roadmap primitives must not appear in live primitive lists.
- Roadmap primitives must not appear as active product cards, nav routes, or detail pages.
- There is no `/roadmap` route.

## Route Policy

Public routes:

These routes may be mounted publicly. Route availability is separate from primitive maturity; beta primitive pages must be beta-tagged.

- `/`
- `/about`
- `/spine`
- `/sidekick`
- `/blurbs`
- `/pods`
- `/wallet`
- `/download`
- `/contact`
- `/support`
- `/privacy`
- `/terms`
- `/newsroom`
- `/newsroom/:slug`
- `/stories`
- `/stories/:slug`
- `/careers`
- `/brand`

Allowed hidden route:

- `/stories/share`

XML/system routes:

- `/sitemap.xml`
- `/rss.xml`

Hidden or redirected routes:

- `/pricing`
- `/developers/docs`
- `/developers/docs/*`
- `/developers/sdk`
- `/roadmap`
- `/calls`
- `/messages`
- `/profile`
- `/vortex`
- `/passport`
- `/orb`
- `/realms`
- `/v1llains`

Rules:

- `/sitemap` is not a visual page. Sitemap is XML only.
- `/pricing` stays fully hidden with no public inbound links.
- Docs and SDK may appear in menu as `soon`, but must not route to public docs until shipped.
- Developers nav behavior is a disabled `Soon` state with no clickable URL until SDK/docs ship.
- Calls, Messages, and Profile are ARC Terminal features, not standalone marketing routes.
- Old feature paths redirect to relevant primitives: `/calls` to `/spine`, `/messages` to `/pods`, and `/profile` to `/wallet`.

## Legal And Support Posture

Restore lean pages:

- `/support`
- `/privacy`
- `/terms`

Rules:

- Keep legal pages concise and careful.
- Avoid detailed legalese that overstates maturity.
- Privacy page must route contact to `support@jokuh.com`.
- Support page must be real, not a mailto redirect.

## Crypto And Security Claim Policy

Forbidden without published proof, audit, or founder-approved evidence:

- Claims that TEE, ZKP, or FHE are in production.
- Claims that the company cannot read user data.
- Claims that the math proves privacy today.
- Claims that grants, investors, or partners validate implementation security.

Allowed wording patterns:

- "architected for"
- "designed for"
- "audit pending"
- "under review"
- "roadmap"
- "planned security work"
- "early-access implementation"

Required rule:

Every TEE, ZKP, or FHE mention must include either `audit pending`, `architected for`, `designed for`, or `roadmap` until there is founder-approved proof.

## Platform Availability

Live:

- iOS TestFlight

Roadmap:

- macOS desktop, Q3

Rules:

- Download page may show iOS TestFlight as live.
- Desktop must be removed or marked `Roadmap - macOS Q3`.

## Hero Above-Fold Requirements

The hero must pass the five-second category test: a cold visitor can name what Jokuh is from above-the-fold copy alone.

Founder subheadline options:

1. "Jokuh is a sovereign agentic OS for private memory, agents, communication, and wallet workflows."
2. "ARC Terminal is the private command center for your AI memory, agents, messages, and wallet."
3. "A privacy-first AI operating system for teams that need memory, agents, identity, and action in one place."

Recommended option: 1.

Proof-of-life element:

- "iOS TestFlight live."

Rules:

- Keep proof-of-life above the fold.
- Keep it tight.
- Do not introduce investor claims that need proof.

## Contact And Support

Differentiate clearly:

- `/contact` is for sales, pilots, partnerships, business inquiries, and investor/founder-facing requests.
- `/support` is for product help, account issues, privacy requests, troubleshooting, and user questions.

Rules:

- `/contact` may route to `sales@jokuh.com` or the contact form inbox.
- `/support` routes to `support@jokuh.com`.
- Privacy contact routes to `/support` and `support@jokuh.com`.
- Do not merge these pages unless founder approves a single combined intake model.

## Developers Nav

Decision: keep Developers visible as a disabled `Soon` state.

Rules:

- No clickable `/developers/docs` route.
- No clickable `/developers/sdk` route.
- The menu label may say `Docs soon` or `SDK soon`.
- Search must not return hidden docs routes.

## Voice

Voice rules:

- Precise over hype.
- Evidence over adjectives.
- Plain claims over mystique.
- Early-access limits must be named when relevant.

Banned words and phrases:

- revolutionary
- game-changing
- next-gen
- powered by AI
- military-grade
- bank-grade
- bulletproof
- unbreakable
- trustless
- fully secure
- fully private
- impossible to breach
- mathematically guaranteed
- zero-risk
- cannot be hacked

Rule:

Unproven security adjectives are banned unless tied to founder-approved evidence, an audit, or a clear `architected for`, `designed for`, `audit pending`, or `roadmap` qualifier.

## Consent And Analytics

Required posture:

- No implicit analytics accept.
- Analytics defaults to off.
- Marketing defaults to off.
- Banner must include explicit accept, reject, and save controls.
- Consent state must be respected before any analytics or marketing script loads.

## SEO And Crawl

Required:

- Canonical URL.
- OG image at 1200x630.
- Twitter image.
- JSON-LD Organization schema.
- `robots.txt` with sitemap reference.
- Real `sitemap.xml`.

Canonical sitemap URL:

- `https://jokuh.com/sitemap.xml`

## CI Guard Requirements

CI must fail on:

- Any `jokuh.io` reference.
- Any public email outside the whitelist.
- Any public `placeholder`, `lorem`, `TODO`, `TBD`, or unguarded `coming soon` string.
- Any TEE/ZKP/FHE mention without the required qualifier.
- Any roadmap primitive exposed outside a `status='roadmap'` guard.
- Any public detail route for roadmap primitives.
- Any dead internal link.
- Any public inbound link to `/pricing`.
- Any banned voice term on public surfaces.

## Performance Target

Targets:

- Lighthouse Performance desktop: at least 85.
- Lighthouse Performance mobile emulation: at least 75.

Rules:

- Do not over-optimize at the cost of visual quality.
- Produce a bundle visualizer report.
- Identify the top five weight offenders before changing visual assets.

## Founder Approval Required

Founder approval is required before changing:

- Primitive status.
- Public route policy.
- Email whitelist.
- Domain policy.
- Security or privacy claim policy.
- Developer nav behavior.
- Pricing visibility.
- Public product hierarchy.
- Hero H1, subheadline, or proof-of-life line.
- Any roadmap primitive route or placement.
- Deploy command or production build target.

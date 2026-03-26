# Domain Topology

## Purpose

Capture the current and planned public-domain model for Jokuh so navigation, deployment, and future property split-outs follow one shared map.

This document distinguishes between:

- the primary Jokuh marketing property
- sibling Jokuh subdomains that the landing site links out to
- standalone brand properties that may later run in their own environments

## Current Jokuh Public Surface

### Primary marketing host

Canonical public marketing surface:

- `jokuh.com`
- optionally `www.jokuh.com` as an alias or redirect layer

This host is the main public entry for:

- homepage
- product pages
- journal and stories
- support entry
- company pages
- legal and privacy content
- temporary fallback routes for pages that may later move to dedicated hosts

Examples:

- `/`
- `/pods`
- `/blurbs`
- `/spine`
- `/vortex`
- `/journal`
- `/support`
- `/about`
- `/careers`
- `/legal`
- `/privacy`
- `/terms`

### Jokuh sibling subdomains

The repo currently models two sibling Jokuh hosts explicitly.

#### `developers.jokuh.com`

Purpose:

- developer docs
- SDK / API reference
- apps platform
- blog / community surfaces
- accessibility and other developer-facing workspace content

Implementation note:

- the landing site rewrites `/developers/*` links to this host when `VITE_ORIGIN_DEVELOPERS` is configured

#### `status.jokuh.com`

Purpose:

- uptime
- incidents
- maintenance
- status history
- subscriptions / RSS / email updates

Implementation note:

- the landing site rewrites status links to this host when `VITE_ORIGIN_STATUS` is configured
- `/system-status` remains the in-app fallback / redirect route

## Planned Brand Property: V1llains

### `v1llains.com`

`v1llains.com` should be treated as its own property, not just a page on the main Jokuh marketing site.

Intended role:

- dedicated project / brand environment for V1llains
- destination for deeper V1llains storytelling, discovery, and product context beyond the Jokuh ecosystem teaser page

Current landing-site relationship:

- the Jokuh marketing site still exposes `/ecosystem/v1llains` as the current discovery route
- this route should be treated as a bridge or teaser surface until the standalone V1llains property is ready

### V1llains purchase environment

V1llains will also need a dedicated purchase environment for avatar buying / checkout flows.

Current understanding:

- this purchase surface should live on a V1llains-controlled host, not on the main Jokuh marketing host
- it is expected to be a subdomain under `v1llains.com`
- the exact hostname is still to be decided

Examples of the kind of host this could become:

- `buy.v1llains.com`
- `shop.v1llains.com`
- `app.v1llains.com`

Until the hostname is chosen, treat this as:

- `TBD.v1llains.com` -> dedicated avatar purchase environment

## Recommended Canonical Topology

Use the following as the working public-host model:

- `jokuh.com` -> primary marketing, product, company, legal, support
- `developers.jokuh.com` -> developer workspace and docs
- `status.jokuh.com` -> operational status / incident surface
- `v1llains.com` -> standalone V1llains project property
- `TBD.v1llains.com` -> dedicated avatar purchase environment

## Reference Ecosystem Patterns

Observed from official public sites on March 26, 2026.

Important note:

- this is a public-facing host map, not a full DNS inventory
- the goal is to understand how leading product ecosystems split surfaces across hosts

### OpenAI / ChatGPT pattern

OpenAI currently uses a multi-property model that mixes:

- a corporate / marketing root
- separate product domains
- dedicated developer, support, community, learning, and status hosts

Major public hosts observed:

- `openai.com` -> corporate marketing, company, research, business, policy
- `chatgpt.com` -> primary ChatGPT product surface
- `developers.openai.com` -> developer docs and learning hub
- `platform.openai.com` -> API dashboard / authenticated platform surface
- `help.openai.com` -> support center
- `community.openai.com` -> developer forum / community
- `status.openai.com` -> service status
- `academy.openai.com` -> learning / education community hub

Additional notable pattern:

- OpenAI also links to separate product-brand domains where it wants a product to feel like its own destination, for example `sora.com`

What this suggests:

- OpenAI does not force everything under one root host
- product, docs, support, community, and status are allowed to feel like distinct environments
- the ChatGPT product itself is important enough to live on its own primary domain rather than under a `chat.openai.com` style host

### Apple pattern

Apple uses a different model:

- a very strong primary root on `www.apple.com`
- many specialist subdomains for support, developer workflows, media surfaces, programs, and account-adjacent tasks

Major public hosts observed:

- `www.apple.com` -> corporate marketing, product, legal, primary navigation
- `support.apple.com` -> customer support and troubleshooting
- `developer.apple.com` -> developer ecosystem and documentation
- `beta.apple.com` -> public beta program
- `privacy.apple.com` -> privacy and data portal
- `music.apple.com` -> Apple Music web product
- `tv.apple.com` -> Apple TV web product
- `podcasts.apple.com` -> Apple Podcasts web product
- `apps.apple.com` -> App Store web surface
- `account.apple.com` -> Apple account management

Specialized Apple hosts observed from official Apple pages:

- `appstoreconnect.apple.com` -> developer distribution / app operations
- `feedbackassistant.apple.com` -> beta and developer feedback workflow
- `mfi.apple.com` -> Made for iPhone / hardware partner program
- `opensource.apple.com` -> open source portal
- `investor.apple.com` -> investor relations

What this suggests:

- Apple keeps the main brand highly centralized on `www.apple.com`
- operational or role-specific workflows get their own subdomains
- support, developer, commerce, media, partner, and account experiences are all allowed to separate once their workflow depth justifies it

## Reference Takeaways For Jokuh

These two ecosystems point to a useful rule set for Jokuh.

### Likely stable Jokuh host families

- main brand / marketing host
- developer host
- status host
- standalone brand property hosts when a project becomes bigger than a teaser page

### Likely future specialized hosts

Based on OpenAI and Apple patterns, the following host classes are reasonable candidates later if the product depth justifies them:

- account or app host for authenticated user workflows
- support or help host for procedural troubleshooting and account operations
- community host for forum or social product surfaces
- purchase / commerce host for dedicated buying flows
- partner / program host for external builders, vendors, or collaborators

### Current Jokuh implication

Jokuh does not need to create all of these now.

But it should plan the public architecture as if the ecosystem may eventually include:

- `developers.jokuh.com`
- `status.jokuh.com`
- a future authenticated product or account host if account flows outgrow marketing routes
- `v1llains.com`
- a dedicated V1llains purchase subdomain

## Recommended Blended Strategy For Jokuh

The healthiest blend of the OpenAI and Apple models is:

- keep one strong canonical brand root like Apple
- split out deep or mode-switched workflows like OpenAI
- only create a new host when the user is entering a meaningfully different environment

In practice, Jokuh should avoid creating subdomains just because a section has a different topic.

Create a separate host when at least one of these is true:

- the audience changes materially
- the information density changes materially
- the cadence of updates changes materially
- the experience becomes operational or authenticated
- the product deserves its own brand gravity

### Core principle

Each public host should represent a user mode, not just a sitemap bucket.

That means:

- `jokuh.com` = discover and understand
- `developers.jokuh.com` = build and integrate
- `status.jokuh.com` = monitor and trust
- future account or app host = use and manage
- `v1llains.com` = enter a standalone branded world
- future V1llains purchase host = buy and transact

## Recommended Jokuh Host Stack

### Keep centralized on the main host

These should stay on `jokuh.com` unless they become significantly deeper than they are now:

- homepage and narrative marketing
- product explainers
- journal and stories
- company pages
- legal and privacy content
- lightweight support entry pages
- ecosystem teaser pages

Why:

- this preserves one clean public front door
- it keeps the story coherent
- it avoids the “too many empty subdomains” problem

### Make first-class sibling hosts

These already make sense as dedicated environments:

- `developers.jokuh.com`
- `status.jokuh.com`

Why:

- they are different user modes from brand storytelling
- they are likely updated on different cadences
- they benefit from their own layout and mental model

### Likely next host to add

If Jokuh adds one more sibling host after developers and status, the most likely healthy next choice is:

- `account.jokuh.com` or `app.jokuh.com`

Recommended distinction:

- use `account.jokuh.com` if the primary job is identity, billing, subscriptions, settings, access, and workspace switching
- use `app.jokuh.com` if the primary job is actually using Jokuh in a logged-in product environment

This is the most obvious missing host in the current topology.

Right now `/account` exists conceptually in the repo, but it still behaves like a marketing-route placeholder rather than a real operational surface.

## Missing Host Classes To Consider

These are the things most likely to be forgotten early and regretted later.

### 1. Authenticated account or product host

Candidate:

- `account.jokuh.com`
- or `app.jokuh.com`

Purpose:

- sign-in
- account settings
- billing and subscriptions
- workspace / org switching
- user-level preferences
- potentially authenticated product usage

Why it matters:

- this is usually the first major experience that no longer belongs inside marketing navigation

### 2. Product updates / launch pipeline host

Candidate:

- `changelog.jokuh.com`
- `updates.jokuh.com`
- or `releases.jokuh.com`

Purpose:

- product release notes
- launch announcements
- shipping cadence
- versioned product changes
- roadmap-adjacent communication without mixing it into long-form editorial

Why it matters:

- this is often the missing layer between marketing storytelling and raw status incidents
- status tells people when something is broken
- changelog tells people what has improved

Recommended note:

- if volume is still low, keep this on `jokuh.com/journal` for now
- split it only when release communication becomes frequent enough to deserve its own rhythm

### 3. Help or support knowledge-base host

Candidate:

- `help.jokuh.com`
- or `support.jokuh.com`

Purpose:

- troubleshooting
- FAQs
- account recovery
- procedural support articles
- operational support content that is not developer docs

Why it matters:

- Apple does this extremely well
- it prevents support content from bloating the main marketing IA
- it is distinct from both developer docs and incident status

Recommended note:

- do not create this until support content becomes deep and search-driven

### 4. Community host

Candidate:

- `community.jokuh.com`
- `forum.jokuh.com`

Purpose:

- discussion
- community publishing
- ecosystem participation
- feedback loops across builders and users

Why it matters:

- OpenAI separates community from docs and marketing
- this becomes useful once discussion is a durable product surface, not just a link out to Discord or social

### 5. Brand-property purchase host

Candidate:

- `buy.v1llains.com`
- `shop.v1llains.com`

Purpose:

- avatar purchase
- checkout
- commerce-specific onboarding
- transactional trust and ownership flow

Why it matters:

- commerce is a different mode than narrative discovery
- a dedicated purchase host keeps the branded property clean while giving checkout its own focused environment

### 6. Beta or preview host

Candidate:

- `beta.jokuh.com`
- `preview.jokuh.com`
- `labs.jokuh.com`

Purpose:

- early-access programs
- experiments
- invite-only launches
- showcasing in-progress systems without polluting the main IA

Why it matters:

- this is useful if Jokuh expects a strong experimental culture or staged product releases
- Apple uses `beta.apple.com` for this kind of mode separation

Recommended note:

- only create this if preview programs become a recurring operating model

## Proposed Rollout: Now, Soon, Later

### Now

- `jokuh.com`
- `developers.jokuh.com`
- `status.jokuh.com`
- `v1llains.com`
- `TBD.v1llains.com` for V1llains purchase

### Soon

- `account.jokuh.com` or `app.jokuh.com`

This is the strongest missing piece if Jokuh is becoming a real product ecosystem rather than only a marketing property.

### Later, only if justified

- `help.jokuh.com`
- `community.jokuh.com`
- `changelog.jokuh.com`
- `beta.jokuh.com`

## Narrative Guidance

The host structure should tell the story of Jokuh clearly.

Recommended public storyline:

- `jokuh.com` tells people what Jokuh is
- `developers.jokuh.com` shows builders how to extend it
- `status.jokuh.com` proves operational seriousness
- `account.jokuh.com` or `app.jokuh.com` becomes the place where people actually live inside the product
- `v1llains.com` signals when a project has become strong enough to stand on its own

That is likely the cleanest blend:

- Apple-style clarity at the root
- OpenAI-style separation for deep operational modes
- standalone domains only when a project has real cultural or product gravity

## Source Notes

Official pages used for this reference snapshot:

- OpenAI root: [openai.com](https://openai.com)
- ChatGPT: [chatgpt.com](https://chatgpt.com)
- OpenAI Developers: [developers.openai.com](https://developers.openai.com)
- OpenAI Platform: [platform.openai.com](https://platform.openai.com)
- OpenAI Help: [help.openai.com](https://help.openai.com)
- OpenAI Community: [community.openai.com](https://community.openai.com)
- OpenAI Status: [status.openai.com](https://status.openai.com)
- OpenAI Academy: [academy.openai.com](https://academy.openai.com)
- Apple root: [www.apple.com](https://www.apple.com)
- Apple Support: [support.apple.com](https://support.apple.com)
- Apple Developer: [developer.apple.com](https://developer.apple.com)
- Apple Beta: [beta.apple.com](https://beta.apple.com)
- Apple Privacy: [privacy.apple.com](https://privacy.apple.com)
- Apple Music: [music.apple.com](https://music.apple.com)
- Apple TV: [tv.apple.com](https://tv.apple.com)
- Apple Podcasts: [podcasts.apple.com](https://podcasts.apple.com)
- Apple App Store: [apps.apple.com](https://apps.apple.com)
- Apple Account: [account.apple.com](https://account.apple.com)
- Apple Open Source: [opensource.apple.com](https://opensource.apple.com)
- App Store Connect: [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
- Feedback Assistant: [feedbackassistant.apple.com](https://feedbackassistant.apple.com)

## Repo Responsibility

This repository currently owns:

- the Jokuh marketing property
- navigation and handoff logic to sibling Jokuh subdomains
- the temporary marketing-route bridge for V1llains at `/ecosystem/v1llains`

This repository does not yet model V1llains as a first-class deploy target in code the same way it models `developers.jokuh.com` and `status.jokuh.com`.

That is intentional for now:

- `developers` and `status` are active Jokuh sibling hosts
- `v1llains.com` is understood as a planned standalone property
- the purchase host under `v1llains.com` is a confirmed concept, but its exact hostname and deployment wiring are still open

## Environment / Deployment Notes

Current env-driven sibling-host wiring in this repo:

- `VITE_ORIGIN_DEVELOPERS`
- `VITE_ORIGIN_STATUS`

When the V1llains property becomes active, decide whether this repo should:

1. keep only marketing bridge links to `v1llains.com`
2. add a dedicated env variable for the standalone V1llains property
3. add a second env variable for the avatar purchase host if that experience needs separate routing

## Operational Guidance

When adding nav items or launch surfaces in this repo:

- use main-host routes for Jokuh marketing, legal, support, and editorial content
- use `developers.jokuh.com` for developer workspace surfaces
- use `status.jokuh.com` for reliability / incident surfaces
- use `v1llains.com` for standalone V1llains brand/property destinations
- use the future V1llains purchase subdomain for avatar commerce flows, not the main Jokuh host

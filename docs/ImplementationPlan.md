# KomoKode Website Implementation Plan

**Status:** Phase 4 Implementation In Progress

**Branch:** `site-redesign`

**Purpose**

This document controls the implementation of the redesigned KomoKode website. It
is intended to be used as a working checklist for Phase 4 work performed on the
`site-redesign` branch.

This plan converts the approved architecture in `docs/WebsiteArchitecture.md`,
`docs/MigrationPlan.md`, `docs/CurrentState.md`, and `docs/Architecture.md` into
small, testable, reversible work items.

This document does not authorize changes to permanent compatibility endpoints
unless the applicable migration and testing steps are explicitly included. It
keeps visual redesign work separate from production compatibility migrations and
favors small commits that can be reviewed or reversed easily.

This is a living document. Stages may be refined as implementation progresses,
provided changes remain consistent with the approved website architecture.

## Revision History

| Date | Version | Notes |
|------|---------|-------|
| 2026-07-11 | 1.0 | Initial Phase 4 implementation roadmap |

---

## Implementation Rules

1. Work only on `site-redesign` until final approval.
2. Keep `main` deployable and unchanged until launch.
3. Complete one logical task per commit whenever practical.
4. Do not combine visual redesign work with app-facing endpoint migrations.
5. Do not move or remove permanent compatibility resources without an approved compatibility method.
6. Test each completed section before starting the next major section.
7. Preserve a rollback path.
8. Prefer static solutions and zero-cost or low-cost services.
9. Do not add a framework, CMS, database, authentication system, or payment system during the MVP unless separately approved.
10. Do not merge into `main` until the final verification checklist is complete.
11. A stage may use multiple commits when its tasks form separate logical units. Prefer one product, page, migration, or compatibility change per commit over one large stage-wide commit.

---

## Implementation Philosophy

The objective is steady, low-risk progress rather than rapid development.
Each stage should leave the repository in a deployable, testable state and
should be reversible whenever practical.

---

## Open Dependencies

### Blocking Current Work

- Which DebtScope purchase analytics Worker is authoritative. Blocks any change
  to `/api/debtscope/purchase-events`.
- Final canonical privacy-policy URL under `/legal/`. Blocks any privacy-policy
  canonicalization or redirect work, but does not block linking to the existing
  compatibility URL.

### Deferred and Non-Blocking

- Final destinations for website-only resources such as `Manual.pdf` and
  `ScoreKeep.png`. Deferred until Stage 9; does not block initial static pages.
- DevDoctor payment and licensing provider selection. Deferred; MVP pages should
  use download or coming-soon states without payment, licensing, login, or
  protected downloads.
- Production exclusion for internal `docs/`. Stage 1 confirmed `docs/` is
  currently publicly accessible. Internal documentation should not remain
  publicly available, and the eventual production exclusion must keep `docs/` in
  the repository while preventing it from being served by the production
  website. Deferred; do not implement during Stage 2.
- Whether a static-site generator becomes worthwhile later. Deferred; MVP should
  remain static HTML, CSS, and minimal JavaScript.

---

## Protected Compatibility Resources

The following resources are production contracts and must not be moved merely
for cleaner organization:

- `/Teams/index.json`
- `/Teams/message.json`
- `/videos/DebtScope-help-videos.json`
- `/Privacy%20Policy`
- `/api/debtscope/purchase-events`

Any migration requires stable routing, redirects, duplicate compatibility files,
or permanent legacy paths. Older released apps must continue working.

---

# Stage 1 - Repository and Deployment Verification

**Status:** Complete

**Goal**

Verify branch, deployment behavior, production baseline, and current public URL
behavior before redesign work changes any public files.

**Prerequisites**

- Access to the repository on `site-redesign`.
- Access to Cloudflare Pages deployment settings or an owner who can confirm
  them.
- Network access for live URL checks.

**Tasks**

- [x] Verify the current checked-out branch is `site-redesign`.

- [x] Verify `main` remains the Cloudflare production deployment branch.

- [x] Record the current live-site baseline for `https://komakode.com/`.

- [x] Confirm whether `docs/` is publicly deployed by Cloudflare Pages.
  **Result:** Yes. The `docs/` directory is publicly accessible.

- [x] Confirm whether `https://komakode.com/index.html` is directly exposed.
  **Result:** `https://komakode.com/index.html` is publicly reachable but returns an HTTP 308 Permanent Redirect to `/`, which is the canonical home-page URL.

- [x] Confirm current public behavior for root files including `Manual.pdf`, `ScoreKeep.png`, and privacy-policy paths.
  **Result:** All files are directly accessible.

- [x] Confirm current public behavior for `Teams/index.json`, `Teams/message.json`, and at least one `.ScoreKeep_Players` file.
  **Result:** All resources are directly accessible.

- [x] Confirm current public behavior for `videos/DebtScope-help-videos.json` and `videos/help-videos.json`.
  **Result:** Both manifests are directly accessible.

- [x] Determine whether internal documentation should be excluded from production deployment.
  **Result:** Internal documentation will not remain publicly available. The `docs/` directory should be excluded from production deployment during implementation.

- [x] Record findings in the implementation notes or a future documentation update.

- [x] Do not change production routing in this stage.

**Files affected**

- None expected.
- Possible later documentation update only after findings are known.

**Compatibility concerns**

- This stage observes production behavior only.
- Do not alter Cloudflare routing, redirects, branch settings, or deployed files.

**Tests**

- [x] `git branch --show-current` returns `site-redesign`.

- [x] Cloudflare production branch is confirmed as `main`.

- [x] `curl -I https://komakode.com/` returns an expected successful response.
  **Result:** `HTTP/2 200`. The site root is publicly accessible and serves HTML through Cloudflare.

- [x] `curl -I https://komakode.com/index.html` records whether the direct file URL is exposed.
  **Result:** `https://komakode.com/index.html` returns an HTTP 308 Permanent Redirect to `/`, making the site root the canonical home page URL.

- [x] `curl -I https://komakode.com/Privacy%20Policy` succeeds.
  **Result:** HTTP 200 OK. This is the canonical privacy-policy URL.

- [x] `curl -I https://komakode.com/Privacy%20Policy.html` succeeds.
  **Result:** HTTP 308 Permanent Redirect to `/Privacy Policy`.

- [x] `curl -I https://komakode.com/Teams/index.json` succeeds.
  **Result:** HTTP 200 OK. Served as `application/json`.

- [x] `curl -I https://komakode.com/Teams/message.json` succeeds.
  **Result:** HTTP 200 OK. Served as `application/json`.

- [x] `curl -I https://komakode.com/videos/DebtScope-help-videos.json` succeeds.
  **Result:** HTTP 200 OK. Served as `application/json`.

**Completion criteria**

- Current branch and production deployment branch are confirmed.
- Live behavior of root files, `Teams/`, `videos/`, privacy paths, and `docs/`
  is recorded.
- Any deployment-exclusion decision for `docs/` is classified as blocking or
  deferred.

**Suggested commit message**

No commit expected.

**Rollback approach**

No rollback needed because this stage should not modify files or settings.

**Cost classification**

Free.

---

# Stage 2 - Create the New Static Site Structure

**Status:** Complete

**Goal**

Create the approved human-facing static site structure without moving existing
app-facing production resources.

**Prerequisites**

- Stage 1 completed.
- Agreement that basic static structure can be added without production routing
  changes.

**Tasks**

- [x] Create `products/`.
- [x] Create `products/devdoctor/`.
- [x] Create `products/debtscope/`.
- [x] Create `products/scorekeep/`.
- [x] Create `products/platewise/`.
- [x] Create `support/`.
- [x] Create `downloads/`.
- [x] Create `about/`.
- [x] Create `legal/`.
- [x] Create `assets/css/`.
- [x] Create `assets/js/`.
- [x] Create `assets/images/`.
  **Result:** The approved directory structure was created.

- [x] Add only the minimum files needed to establish navigable structure or deployment testing.
  **Result:** Minimal semantic placeholder pages were added for the new human-facing sections.

- [x] Leave `Teams/`, `videos/`, current privacy-policy files, and app-facing API resources in place.
  **Result:** Existing app-facing and root compatibility resources were left unchanged.

- [x] Do not add empty placeholder files unless required for navigation or deployment testing.
  **Result:** Asset subdirectories were documented in `assets/README.md` without adding fake CSS, JavaScript, or image files.

- [x] Commit this stage separately.
  **Result:** Committed and pushed to the `site-redesign` branch with commit message `Create redesigned site directory structure`.

**Files affected**

- New directories under the repository root.
- Minimal `index.html` files only where needed for navigation or deployment
  testing.
- No changes to `Teams/`, `videos/`, `Privacy Policy.html`, `Manual.pdf`, or
  `ScoreKeep.png`.

**Compatibility concerns**

- New human-facing paths must not shadow existing app-facing endpoints.
- No app-facing resources move in this stage.

**Tests**

- [x] Local static open or preview confirms new folder URLs can resolve if files are added.
  **Result:** Each new section has a minimal `index.html` page with semantic `<main>` content and a link back to `/`.

- [x] Existing root files remain at their original paths.
  **Result:** Root compatibility resources were not moved, renamed, or modified.

- [x] Existing `Teams/` and `videos/` files remain unchanged.
  **Result:** `Teams/` and `videos/` were not moved, renamed, or modified.

**Completion criteria**

- Approved static structure exists with only minimal required files.
- App-facing production resources are untouched.
- No framework or external dependency was introduced.
- Stage is ready for a separate user commit after review.

**Suggested commit message**

`Create redesigned site directory structure`

**Rollback approach**

Revert the single structure commit.

**Cost classification**

Free.

---

# Stage 3 - Shared Site Foundation

**Status:** Complete

**Goal**

Create shared static styling and common page foundation for the redesigned site.

**Prerequisites**

- Stage 2 completed.
- No unresolved decision requiring a frontend framework.

**Tasks**

- [x] Create shared CSS for typography, colors, layout, spacing, links, buttons, cards, and responsive behavior.
  **Result:** Shared CSS foundation created.

- [x] Define common page width and spacing rules.
  **Result:** System fonts, accessible color variables, and a reusable content width were added.

- [x] Define semantic header structure.
  **Result:** Common header, navigation, footer, and responsive page structure applied.

- [x] Define main navigation: Home, Products, Support, Downloads, About.
  **Result:** Navigation works without JavaScript.

- [x] Define footer structure with privacy link.
  **Result:** Footer links use the existing `/Privacy%20Policy` compatibility URL.

- [x] Add accessibility basics including skip link, visible focus states, semantic landmarks, and sufficient contrast.
  **Result:** Skip links, focus states, semantic landmarks, and reduced-motion support added.

- [x] Keep pages usable without JavaScript where practical.
  **Result:** All Stage 3 navigation and page structure are static HTML and CSS.

- [x] Add minimal JavaScript only if needed for navigation behavior.
  **Result:** No JavaScript was needed or added.

- [x] Avoid frontend frameworks.
  **Result:** No framework was introduced.

- [x] Avoid external dependencies unless separately approved.
  **Result:** No external dependency was introduced.

**Files affected**

- `assets/css/site.css`
- Stage 2 placeholder pages only

**Compatibility concerns**

- Footer privacy links should point to an existing compatible privacy URL until
  the future `/legal/privacy/` decision is approved.
- Shared assets must not replace or move app-facing resources.

**Tests**

- [x] Validate pages use semantic HTML landmarks.
  **Result:** All updated pages include skip link, semantic header, nav, main, and footer landmarks.

- [x] Confirm keyboard navigation reaches header, nav links, main content, and footer.
  **Result:** Static links and skip links remain keyboard accessible.

- [x] Confirm visible focus states.
  **Result:** CSS includes strong `:focus-visible` styling.

- [x] Check color contrast for text and interactive elements.
  **Result:** Restrained navy, slate, blue, white, and light gray-blue variables were used for adequate contrast.

- [x] Disable JavaScript and confirm core navigation remains usable.
  **Result:** No JavaScript file was added; navigation is plain HTML.

- [x] Test desktop and mobile widths.
  **Result:** Header navigation wraps or stacks at narrower widths, and content uses responsive containers and grids.

**Completion criteria**

- Shared site foundation works across created pages.
- No frontend framework, CMS, database, authentication, or payment system is
  introduced.
- Accessibility basics pass manual review.
- Root `index.html` and protected compatibility resources remained unchanged.

**Implementation Note:**

Python's built-in HTTP server does not emulate Cloudflare Pages' clean URL
routing. During local testing, `/Privacy%20Policy` returns 404 even though the
same URL works correctly in production. Use Cloudflare Preview or production to
verify the extensionless compatibility URL.

**Suggested commit message**

`Add shared static site foundation`

**Result:** Reviewed, committed, and pushed to the `site-redesign` branch with commit message `Add shared static site foundation`.

**Rollback approach**

Revert the shared foundation commit. Existing compatibility files remain
unchanged.

**Cost classification**

Free.

---

# Stage 4 - Home Page

**Status:** Complete

**Goal**

Replace the human-facing home page content while preserving the root URL at
`https://komakode.com/`.

**Prerequisites**

- Stage 3 completed.
- Current live root behavior recorded in Stage 1.

**Tasks**

- [x] Implement the redesigned root `index.html`.
  **Result:** The root home page was redesigned using the shared Stage 3 foundation.

- [x] Introduce KomoKode as an independent developer hub.
  **Result:** KomoKode is introduced as an independent software developer.

- [x] Feature DevDoctor prominently.
  **Result:** DevDoctor is featured as an upcoming macOS product.

- [x] Present DebtScope, ScoreKeep, and PlateWise.
  **Result:** DebtScope, ScoreKeep, and PlateWise are represented.

- [x] Link clearly to Products, Support, Downloads, and About.
  **Result:** Navigation to Products, Support, Downloads, and About was added.

- [x] Avoid claims, purchase actions, payment links, or licensing statements that are not yet available.
  **Result:** No unavailable purchase action, payment link, licensing flow, or unsupported marketing claim was added.

- [x] Preserve links to current compatibility resources where needed.
  **Result:** Existing ScoreKeep manual and roster-download access was preserved.
  **Result:** Team downloads continue using `/Teams/index.json`.
  **Result:** Privacy continues linking to `/Privacy%20Policy`.
  **Result:** No compatibility resource was moved or modified.

- [x] Ensure the page works at `https://komakode.com/`.
  **Result:** The page remains static HTML, CSS, and inline home-page JavaScript suitable for the existing root URL.
  **Result:** No framework or external dependency was introduced.

**Files affected**

- `index.html`
- `assets/css/site.css`
- `assets/images/` only if real approved assets are added
- `assets/js/site.js` only if necessary

**Compatibility concerns**

- Root URL is a permanent public website URL and must continue serving a valid
  public site.
- Do not remove access to ScoreKeep team downloads or privacy links without
  replacing them with equivalent public navigation.

**Tests**

- [x] Open root page locally or in preview.
  **Result:** Root page was opened through a local static server. Python's built-in server does not emulate the production clean URL for `/Privacy%20Policy`, as noted in Stage 3.

- [x] Verify navigation links resolve.
  **Result:** Home, Products, Support, Downloads, and About navigation links are present and point to the approved paths.

- [x] Verify product cards or sections link to correct product pages.
  **Result:** DevDoctor, DebtScope, ScoreKeep, and PlateWise sections link to their product paths.

- [x] Verify privacy link resolves to an existing path.
  **Result:** Footer privacy link remains `/Privacy%20Policy`.

- [x] Verify mobile layout.
  **Result:** Hero actions, product cards, featured content, callout actions, and roster downloads adapt for narrow widths.

- [x] Verify no unavailable purchase action is present.
  **Result:** No purchase, pricing, licensing, or download promise was added.

**Completion criteria**

- Home page presents KomoKode and all current products accurately.
- Root URL remains the canonical entry point.
- No compatibility endpoint is moved or removed.

**Suggested commit message**

`Redesign home page`

**Result:** Reviewed, committed, and pushed to the `site-redesign` branch with commit message `Redesign home page`.

**Rollback approach**

Revert the home page commit. If deployed through preview, compare against the
recorded Stage 1 baseline.

**Cost classification**

Free.

---

# Stage 5 - Product Pages

**Status:** Complete

**Goal**

Create product pages under `/products/` using a consistent static structure
where practical.

**Prerequisites**

- Stage 3 completed.
- Product claims and links verified.
- App Store URLs identified before publication.

## DevDoctor

**Tasks**

- [x] Add overview.
  **Result:** DevDoctor is described as “A native macOS diagnostic utility designed to help developers understand and troubleshoot their development environment.”

- [x] Describe intended audience.
  **Result:** DevDoctor is positioned for Mac software developers diagnosing development-environment problems.

- [x] List key benefits.
  **Result:** Benefits are limited to a native macOS experience, development-environment focus, clearer troubleshooting context, and direct distribution when released.

- [x] Add screenshots or demo placeholders only if real assets are unavailable.
  **Result:** No fake screenshot boxes or invented assets were added. The page states that screenshots and demonstrations will be added as development progresses.

- [x] Add system requirements.
  **Result:** The page states that final system requirements will be published before release.

- [x] Add download or coming-soon state.
  **Result:** The page states that DevDoctor is in development, direct distribution is planned, and it is not currently available for purchase or download.

- [x] Add release notes link.
  **Result:** No dead release-notes link was added. The page states that release notes will be published before release.

- [x] Add support link.
  **Result:** No premature DevDoctor support link was added. The page states that product support information will be published before release.

- [x] Position DevDoctor for direct sale without selecting a payment provider.
  **Result:** Direct distribution is noted without adding purchase, pricing, payment, license, or download actions.

## DebtScope

**Tasks**

- [x] Add overview.
  **Result:** DebtScope is described as an iPhone and iPad finance planner for organizing debts, comparing payoff strategies, and understanding the path toward becoming debt free.

- [x] List main features.
  **Result:** The page covers debt payoff planning, Avalanche, Snowball, Minimum Payment, and Custom strategies, debt-free date and interest comparisons, statement and transaction-file import, cash-flow and net-worth views, and private on-device planning without requiring bank linking.

- [x] Add App Store link.
  **Result:** DebtScope links to `https://apps.apple.com/us/app/debtscope/id6758213398`.

- [x] Add help and support links.
  **Result:** The page links to `/support/` using restrained DebtScope support wording.

- [x] Add help-video links where appropriate.
  **Result:** Help videos are mentioned as available within DebtScope; the raw help-video manifest is not linked as a visitor-facing help page.

- [x] Do not change the app-facing manifest URL.
  **Result:** `videos/DebtScope-help-videos.json` remains unchanged.

## ScoreKeep

**Tasks**

- [x] Add overview.
  **Result:** ScoreKeep is described as a baseball scoring application for recording games, managing lineups, and tracking game statistics.

- [x] Add App Store link.
  **Result:** ScoreKeep links to `https://apps.apple.com/us/app/scorekeep-baseball-scoring/id6748364014`.

- [x] Add manual link.
  **Result:** The page links to `/Manual.pdf`.

- [x] Add team-download link.
  **Result:** The page links to `/` for the existing home-page ScoreKeep team-download experience because the protected root page does not have a stable section-level fragment ID.

- [x] Add support link.
  **Result:** The page links to `/support/` using restrained ScoreKeep support wording.

- [x] Do not change `Teams/index.json` or `Teams/message.json`.
  **Result:** `Teams/index.json`, `Teams/message.json`, and importable ScoreKeep team files remain unchanged.

## PlateWise

**Tasks**

- [x] Add basic product presence.
  **Result:** PlateWise is described as an AI-assisted recipe and meal-planning application.

- [x] Add App Store link.
  **Result:** PlateWise links to `https://apps.apple.com/us/app/plate-wise-meal-planning/id6754467692`.

- [x] Add support link.
  **Result:** The page links to `/support/` using minimal Plate Wise support wording.

- [x] Keep investment minimal and consistent with current priority.
  **Result:** The page remains concise while covering verified capabilities.

**Files affected**

- `products/devdoctor/index.html`
- `products/debtscope/index.html`
- `products/scorekeep/index.html`
- `products/platewise/index.html`
- `assets/css/site.css`
- `docs/ImplementationPlan.md`

**Compatibility concerns**

- Product pages may link to compatibility resources but must not migrate them.
- DebtScope help-video manifest remains `/videos/DebtScope-help-videos.json`.
- ScoreKeep team manifest remains `/Teams/index.json`.

**Tests**

- [x] Open each product page locally or in preview.
  **Result:** Product pages returned `200 OK` through a local static server. Browser automation was not available in this environment.

- [x] Verify navigation and footer links.
  **Result:** All four pages use the shared shell, Products is marked current, each page links back to `/products/`, and footer privacy links use `/Privacy%20Policy`.

- [x] Verify App Store, manual, help-video, support, and download links.
  **Result:** DebtScope, ScoreKeep, and PlateWise use verified App Store links. ScoreKeep links to `/Manual.pdf` and the existing home-page team-download experience. Support links use `/support/`. DebtScope's app-facing help-video manifest remains unchanged and is not used as a visitor-facing page. DevDoctor has no download action.

- [x] Verify no product page references unavailable payment or licensing flows.
  **Result:** No purchase action, pricing, payment provider, license flow, or unavailable download was added.

- [x] Verify mobile layout and keyboard navigation.
  **Result:** Reusable responsive product-page styles were added and reviewed for desktop, laptop, tablet, and phone-width behavior, including stacked product heroes, wrapping actions, one-column feature grids, visible focus states, semantic sections, and keyboard-accessible links. Product pages do not require JavaScript.

**Completion criteria**

- All four product pages exist and follow a consistent structure.
- Product claims are accurate.
- App-facing manifests are unchanged.

**Result:** All four product pages were implemented using the shared design.
**Result:** DevDoctor is positioned as an in-development macOS utility for software developers.
**Result:** No DevDoctor purchase, pricing, or download action was added.
**Result:** DebtScope, ScoreKeep, and PlateWise use verified App Store links.
**Result:** ScoreKeep links to the existing manual and team-download experience.
**Result:** DebtScope's app-facing help-video manifest remains unchanged and is not used as a visitor-facing page.
**Result:** Support links use `/support/` without overstating available support content.
**Result:** Protected compatibility resources remained unchanged.
**Result:** No framework or external dependency was introduced.

**Suggested commit message**

`Add product pages`

**Rollback approach**

Revert the product pages commit. Product compatibility resources remain
untouched.

**Cost classification**

Free.

---

# Stage 6 - Support Section

**Status:** Not started

**Goal**

Create a static support section with product-specific entry points and reusable
public support content.

**Prerequisites**

- Stage 5 completed or product support links known.
- Decision on which source materials may be public.

**Tasks**

- [ ] Create support landing page.
- [ ] Add product-specific support entry points.
- [ ] Add contact links for supported products.
- [ ] Link to manuals, help videos, FAQs, and downloads.
- [ ] Reuse documentation source material where practical.
- [ ] Keep internal `docs/` separate from public support content.
- [ ] Identify which public support content should be HTML.
- [ ] Identify which public support content may originate as Markdown.
- [ ] Do not create a CMS.
- [ ] Do not duplicate long-form source content unnecessarily.

**Files affected**

- `support/index.html`
- Possible future `support/devdoctor/index.html`
- Possible future `support/debtscope/index.html`
- Possible future `support/scorekeep/index.html`
- Possible future `support/platewise/index.html`
- Public Markdown source files only if approved for support content

**Compatibility concerns**

- Internal planning docs under `docs/` are not public support content.
- Existing app support email contracts must remain functional:
  `comment@KomaKode.com` and `support@komakode.com`.

**Tests**

- [ ] Verify support landing page links to all product support entry points.
- [ ] Verify contact links use correct mailboxes.
- [ ] Verify manual, help-video, FAQ, and download links resolve.
- [ ] Verify no internal planning document is exposed as public support content unintentionally.

**Completion criteria**

- Public support entry points exist and are navigable.
- Long-form content strategy is recorded without adding a CMS.

**Suggested commit message**

`Add support section`

**Rollback approach**

Revert the support section commit. Existing mailto and compatibility endpoints
remain unchanged.

**Cost classification**

Free.

---

# Stage 7 - Downloads Section

**Status:** Not started

**Goal**

Create a static downloads section that distinguishes App Store products from
direct downloads.

**Prerequisites**

- Stage 5 completed.
- DevDoctor release state known enough to choose download or coming-soon copy.

**Tasks**

- [ ] Create downloads landing page.
- [ ] Create DevDoctor download page or coming-soon section.
- [ ] Link to ScoreKeep manual access.
- [ ] Link to ScoreKeep team-download access.
- [ ] Clearly distinguish App Store products from direct downloads.
- [ ] Add DevDoctor current version field.
- [ ] Add DevDoctor system requirements field.
- [ ] Add DevDoctor release notes field or link.
- [ ] Add DevDoctor checksum field if a binary is available.
- [ ] Add DevDoctor download button or coming-soon state.
- [ ] Do not implement payment.
- [ ] Do not implement licensing.
- [ ] Do not implement login.
- [ ] Do not implement protected downloads.
- [ ] Do not implement automatic update feeds.

**Files affected**

- `downloads/index.html`
- Possible `downloads/devdoctor/index.html`
- Existing `Manual.pdf` only if Stage 9 later approves a website-only resource migration
- `assets/css/site.css`

**Compatibility concerns**

- Do not move `Manual.pdf` or ScoreKeep team files in this stage.
- Any DevDoctor binary hosting decision must remain static-first and low-cost.

**Tests**

- [ ] Verify downloads landing page links resolve.
- [ ] Verify App Store products are not presented as direct downloads.
- [ ] Verify DevDoctor download state is accurate.
- [ ] Verify ScoreKeep manual and team-download links work.

**Completion criteria**

- Downloads section exists and accurately separates product distribution modes.
- No payment, licensing, login, protected download, or update-feed system is
  added.

**Suggested commit message**

`Add downloads section`

**Rollback approach**

Revert the downloads section commit. Existing direct file URLs remain unchanged.

**Cost classification**

Free for expected usage.

---

# Stage 8 - About and Legal Pages

**Status:** Not started

**Goal**

Create basic About and Legal navigation while preserving current privacy-policy
compatibility URLs.

**Prerequisites**

- Stage 3 completed.
- Privacy canonicalization decision known before any redirect or move.

**Tasks**

- [ ] Create About page.
- [ ] Add footer legal links.
- [ ] Plan future `/legal/privacy/` page if approved.
- [ ] Preserve `https://komakode.com/Privacy%20Policy`.
- [ ] Preserve current `.html` privacy path unless deliberately redirected.
- [ ] Do not remove or rename the current privacy-policy resource during basic redesign work.

**Files affected**

- `about/index.html`
- `legal/index.html` if useful as a legal landing page
- `Privacy Policy.html` should remain in place during basic redesign work
- Future `legal/privacy/index.html` only after canonical URL approval

**Compatibility concerns**

- `/Privacy%20Policy` is a verified permanent compatibility endpoint.
- `Privacy Policy.html` is currently used by the website and should remain
  available unless a deliberate redirect plan is approved and tested.

**Tests**

- [ ] Verify About page navigation.
- [ ] Verify footer privacy link resolves.
- [ ] Verify `/Privacy%20Policy` behavior is unchanged.
- [ ] Verify `/Privacy%20Policy.html` behavior is unchanged unless an approved redirect exists.

**Completion criteria**

- About and legal entry points exist.
- Privacy compatibility paths remain available.

**Suggested commit message**

`Add about and legal pages`

**Rollback approach**

Revert the About and Legal page commit. Do not remove existing privacy files.

**Cost classification**

Free.

---

# Stage 9 - Website-Only Resource Reorganization

**Status:** Not started

**Goal**

Decide and migrate website-only root resources separately from app-facing
resource migrations.

**Prerequisites**

- Stage 1 live URL behavior recorded.
- Product, support, and downloads pages identify final references.
- Proposed destinations approved.

**Tasks**

- [ ] Decide final destination for `ScoreKeep.png`.
- [ ] Decide final destination for `Manual.pdf`.
- [ ] Identify any other root-level website images or downloads.
- [ ] For each resource, record current path.
- [ ] For each resource, record proposed destination.
- [ ] For each resource, update references only after the new destination exists.
- [ ] For each resource, decide whether the old URL should redirect or remain as a compatibility copy.
- [ ] For each resource, define a test procedure.
- [ ] For each resource, define a rollback procedure.
- [ ] Keep this work separate from app-facing resource migrations.

**Resource migration table**

| Resource | Current path | Proposed destination | References to update | Old URL handling | Test procedure | Rollback procedure |
|---|---|---|---|---|---|---|
| ScoreKeep image | `ScoreKeep.png` | Needs decision | Home and ScoreKeep product page | Redirect or compatibility copy, needs decision | Verify image loads at new and old paths | Restore old reference or copy |
| ScoreKeep manual | `Manual.pdf` | Needs decision | Downloads, ScoreKeep product page, support | Redirect or compatibility copy, needs decision | Verify PDF opens/downloads at new and old paths | Restore old reference or copy |
| Other website-only files | Needs inventory | Needs decision | Needs inventory | Needs decision | Verify direct URLs and page references | Restore previous file/reference |

**Files affected**

- `assets/images/` if image files move.
- `downloads/` if download files move.
- Product, support, downloads, and home pages that reference these resources.
- Redirect or routing files only if an approved redirect mechanism exists.

**Compatibility concerns**

- `Manual.pdf` is website-only for the hosted file, but the old public URL may
  have bookmarks or search indexing.
- `ScoreKeep.png` is website-only, but the old public URL may be indexed.
- This stage must not touch app-facing manifests or team files.

**Tests**

- [ ] Verify each new resource URL.
- [ ] Verify each old URL redirects or remains available as approved.
- [ ] Verify every updated page reference loads.
- [ ] Verify no app-facing endpoint changed.

**Completion criteria**

- Website-only resource moves are documented, tested, and reversible.
- Old URL handling is intentionally chosen for each resource.

**Suggested commit message**

`Reorganize website-only resources`

**Rollback approach**

Revert the resource migration commit and restore old references. If redirects
were added, remove or revert only those redirects associated with website-only
resources.

**Cost classification**

Free.

---

# Stage 10 - App-Facing Compatibility Work

**Status:** Not started

**Goal**

Handle any app-facing compatibility migrations separately from visual redesign.

**Prerequisites**

- Explicit approval for each compatibility change.
- Stage 12-style app behavior tests available.
- For purchase analytics, authoritative Worker identified first.

**Tasks**

- [ ] Treat this stage as separate from visual redesign.
- [ ] Do not move protected resources merely for cleaner organization.
- [ ] Preserve older released app behavior.
- [ ] Use stable routing, redirects, duplicate compatibility files, or permanent legacy paths for any migration.
- [ ] Test real ScoreKeep and DebtScope behavior where applicable.

## ScoreKeep Team Files

**Tasks**

- [ ] Keep `Teams/index.json` manifest endpoint stable.
- [ ] Keep `Teams/message.json` endpoint stable.
- [ ] Deploy replacement team files before changing `teams[].url`.
- [ ] Preserve `.ScoreKeep_Players`.
- [ ] Preserve manifest schema fields.
- [ ] Test website download.
- [ ] Test in-app download.
- [ ] Keep old team-file URLs redirected or duplicated where practical.

## DebtScope Help Videos

**Tasks**

- [ ] Keep `videos/DebtScope-help-videos.json` endpoint stable.
- [ ] Keep manifest schema stable.
- [ ] Deploy media before changing manifest URLs.
- [ ] Preserve at least one playable URL per video.
- [ ] Test iPhone video selection and playback.
- [ ] Test iPad video selection and playback.
- [ ] Keep current media URLs redirected or duplicated while active manifests or cached clients may reference them.

## Purchase Analytics API

**Tasks**

- [ ] Do not modify `/api/debtscope/purchase-events` until the authoritative Worker is identified.
- [ ] Identify which purchase analytics Worker is authoritative.
- [ ] Preserve POST behavior.
- [ ] Preserve accepted payload fields.
- [ ] Ensure backend ignores unknown fields.
- [ ] Treat Worker investigation as a prerequisite to any backend change.

**Files affected**

- `Teams/index.json` only with explicit approval.
- `Teams/message.json` only with explicit approval.
- `Teams/*.ScoreKeep_Players` only with explicit approval.
- `videos/DebtScope-help-videos.json` only with explicit approval.
- Cloudflare Worker source and routing only after authoritative Worker is
  identified.
- Redirect/routing configuration only with approved compatibility method.

**Compatibility concerns**

- `/Teams/index.json`, `/Teams/message.json`,
  `/videos/DebtScope-help-videos.json`, `/Privacy%20Policy`, and
  `/api/debtscope/purchase-events` are protected permanent compatibility
  resources.
- Older released apps must continue working without updates.

**Tests**

- [ ] Fetch `https://komakode.com/Teams/index.json`.
- [ ] Fetch `https://komakode.com/Teams/message.json`.
- [ ] Download at least one team file through the website.
- [ ] Download at least one team file inside ScoreKeep.
- [ ] Fetch `https://komakode.com/videos/DebtScope-help-videos.json`.
- [ ] Play each active DebtScope help-video category on iPhone where applicable.
- [ ] Play each active DebtScope help-video category on iPad where applicable.
- [ ] Verify `POST https://komakode.com/api/debtscope/purchase-events` remains available and compatible.

**Completion criteria**

- Any approved app-facing migration is complete, tested with real app behavior
  where applicable, and reversible.
- Protected legacy paths remain available.

**Suggested commit message**

Use one commit per compatibility change, such as:

- `Preserve ScoreKeep team compatibility during resource migration`
- `Preserve DebtScope help-video compatibility during media migration`
- `Update DebtScope purchase analytics routing`

**Rollback approach**

Revert the specific compatibility commit and restore previous manifests,
resources, routes, or Worker deployment. If production app behavior fails, roll
back promptly.

**Cost classification**

Free for static compatibility work. Worth paying for only if a paid service
solves a verified compatibility or operational problem.

---

# Stage 11 - Content and Quality Review

**Status:** Not started

**Goal**

Review content, accessibility, navigation, performance, and product accuracy
before preview or launch testing.

**Prerequisites**

- Stages 4 through 8 completed.
- Any Stage 9 or Stage 10 work included in the release is completed.

**Tasks**

- [ ] Check spelling and grammar.
- [ ] Check navigation consistency.
- [ ] Check for broken links.
- [ ] Check for missing images.
- [ ] Check mobile layout.
- [ ] Check keyboard navigation.
- [ ] Check color contrast.
- [ ] Check page performance.
- [ ] Confirm JavaScript remains minimal.
- [ ] Check titles and metadata.
- [ ] Check product claims for accuracy.
- [ ] Check branding consistency.
- [ ] Confirm no placeholder text is accidentally published.

**Files affected**

- Any public page or asset with review findings.

**Compatibility concerns**

- Review edits must not alter app-facing endpoint behavior unless Stage 10 is
  explicitly in scope.

**Tests**

- [ ] Run local link checks or manually verify every internal link.
- [ ] Test pages at mobile and desktop widths.
- [ ] Navigate using keyboard only.
- [ ] Inspect browser console for errors.
- [ ] Confirm page titles and descriptions are product-appropriate.

**Completion criteria**

- No known broken links, missing images, accidental placeholders, or inaccurate
  product claims remain.
- Accessibility and performance issues are either fixed or documented.

**Suggested commit message**

`Review content and site quality`

**Rollback approach**

Revert the quality review commit if it introduces regressions.

**Cost classification**

Free.

---

# Stage 12 - Preview and End-to-End Testing

**Status:** Not started

**Goal**

Test the redesigned site and protected compatibility endpoints on the
`site-redesign` branch or Cloudflare preview deployment before launch.

**Prerequisites**

- Stages intended for launch are complete.
- Cloudflare preview deployment is available or local static testing is
  sufficient for non-production checks.

**Tasks**

- [ ] Test home page.
- [ ] Test every product page.
- [ ] Test support.
- [ ] Test downloads.
- [ ] Test about.
- [ ] Test privacy links.
- [ ] Test ScoreKeep website team downloads.
- [ ] Test ScoreKeep in-app team downloads.
- [ ] Test ScoreKeep messages.
- [ ] Test DebtScope help-video manifest.
- [ ] Test DebtScope help-video playback.
- [ ] Test purchase analytics endpoint availability.
- [ ] Test direct media URLs still referenced by active manifests.
- [ ] Test existing permanent URLs.
- [ ] Test 404 behavior.
- [ ] Test mobile layouts.
- [ ] Test desktop layouts.
- [ ] Record expected results.
- [ ] Record actual results.

**Test record**

| Area | Expected result | Actual result | Status |
|---|---|---|---|
| Home page | Loads and links to main sections | Not tested | Not started |
| Product pages | All product pages load and link correctly | Not tested | Not started |
| Support | Support landing and product entry points work | Not tested | Not started |
| Downloads | Downloads section distinguishes App Store and direct downloads | Not tested | Not started |
| About | About page loads and navigation works | Not tested | Not started |
| Privacy links | Existing privacy compatibility paths remain available | Not tested | Not started |
| ScoreKeep website team downloads | Website can fetch manifest and download team files | Not tested | Not started |
| ScoreKeep in-app team downloads | Released ScoreKeep can fetch and import teams | Not tested | Not started |
| ScoreKeep messages | Released ScoreKeep can fetch messages | Not tested | Not started |
| DebtScope help-video manifest | Released DebtScope can fetch manifest | Not tested | Not started |
| DebtScope help-video playback | iPhone and iPad playback works | Not tested | Not started |
| Purchase analytics endpoint | POST endpoint remains available | Not tested | Not started |
| Direct media URLs | Active manifest media URLs remain reachable | Not tested | Not started |
| Existing permanent URLs | Permanent URLs resolve correctly | Not tested | Not started |
| 404 behavior | Missing pages produce expected 404 behavior | Not tested | Not started |
| Mobile layout | Pages are usable on narrow screens | Not tested | Not started |
| Desktop layout | Pages are usable on desktop screens | Not tested | Not started |

**Files affected**

- None expected unless test failures require fixes.

**Compatibility concerns**

- Preview testing should not change production routing.
- Production endpoint checks should be read-only except controlled purchase API
  availability checks.

**Tests**

- [ ] Use preview URLs for redesigned pages.
- [ ] Use production URLs for permanent endpoint behavior where needed.
- [ ] Use real released apps for ScoreKeep and DebtScope compatibility where applicable.

**Completion criteria**

- Expected and actual results are recorded.
- Blocking failures are fixed and retested.
- Compatibility endpoints pass required checks.

**Suggested commit message**

No commit expected unless fixes are needed.

**Rollback approach**

If preview testing fails, fix or revert the specific stage commit that caused
the issue.

**Cost classification**

Free for expected usage.

---

# Stage 13 - Launch Preparation

**Status:** Not started

**Goal**

Prepare for final merge without changing production before explicit approval.

**Prerequisites**

- Stage 12 completed.
- All blocking issues resolved.

**Tasks**

- [ ] Confirm all implementation-plan items intended for launch are complete.
- [ ] Confirm working tree is clean.
- [ ] Confirm all `site-redesign` commits are pushed.
- [ ] Review differences between `main` and `site-redesign`.
- [ ] Create a backup or release tag if appropriate.
- [ ] Confirm Cloudflare production branch remains `main`.
- [ ] Prepare rollback instructions.
- [ ] Decide the launch commit or merge message.
- [ ] Do not merge until explicit approval.

**Files affected**

- None expected.
- Possible tag only after approval.

**Compatibility concerns**

- `main` remains deployable and unchanged until launch.
- Do not merge if permanent endpoint tests are incomplete.

**Tests**

- [ ] `git status` shows clean working tree.
- [ ] Branch comparison reviewed.
- [ ] Preview deployment still passes Stage 12 checks.
- [ ] Rollback instructions are written and usable.

**Completion criteria**

- Launch package is ready.
- Explicit approval is the only remaining step before merge.

**Suggested commit message**

No commit expected.

**Rollback approach**

Do not merge. If launch preparation finds issues, return to the relevant stage.

**Cost classification**

Free.

---

# Stage 14 - Merge and Production Verification

**Status:** Not started

**Goal**

Merge the approved redesign into production, monitor deployment, and verify live
site and app-facing compatibility behavior.

**Prerequisites**

- Explicit launch approval.
- Stage 13 completed.
- Rollback instructions prepared.

**Tasks**

- [ ] Merge `site-redesign` into `main`.
- [ ] Push `main`.
- [ ] Monitor Cloudflare production deployment.
- [ ] Verify the live site.
- [ ] Re-run permanent compatibility endpoint tests.
- [ ] Verify ScoreKeep against production.
- [ ] Verify DebtScope against production.
- [ ] Confirm no unexpected redirects.
- [ ] Confirm no missing files.
- [ ] Confirm no unexpected 404s.
- [ ] Roll back promptly if a permanent endpoint fails.

**Files affected**

- Production branch state changes after merge.
- No additional file edits expected during this stage unless emergency rollback
  or hotfix is required.

**Compatibility concerns**

- Production verification must include protected permanent resources.
- A permanent endpoint failure is a launch blocker and rollback trigger.

**Tests**

- [ ] Live `https://komakode.com/` loads.
- [ ] Live product, support, downloads, about, and privacy links load.
- [ ] Live `/Teams/index.json` loads.
- [ ] Live `/Teams/message.json` loads.
- [ ] Live `/videos/DebtScope-help-videos.json` loads.
- [ ] Live `/Privacy%20Policy` loads.
- [ ] Live `/api/debtscope/purchase-events` remains available.
- [ ] Released ScoreKeep works with production team downloads and messages.
- [ ] Released DebtScope works with production help videos.

**Completion criteria**

- Production deployment succeeds.
- Live redesigned site works.
- Permanent compatibility endpoint tests pass.
- ScoreKeep and DebtScope production checks pass.

**Suggested commit message**

`Merge redesigned website`

**Rollback approach**

Revert the merge or redeploy the previous known-good `main` commit. If a
permanent endpoint fails, roll back immediately before continuing investigation.

**Cost classification**

Free for expected usage.

---

# Stage 15 - Post-Launch Cleanup

**Status:** Not started

**Goal**

Perform non-urgent cleanup only after production verification is complete.

**Prerequisites**

- Stage 14 completed successfully.
- Production has remained stable long enough to justify cleanup.

**Tasks**

- [ ] Remove obsolete website-only files after verification.
- [ ] Archive retired Aware Money resources when convenient.
- [ ] Update documentation to reflect production state.
- [ ] Decide whether to delete the `site-redesign` branch.
- [ ] Record lessons learned.
- [ ] Do not remove compatibility resources simply because the redesign is live.

**Files affected**

- Obsolete website-only files only after verification.
- Documentation reflecting production state.
- Retired legacy resources only if confirmed non-blocking and safe.

**Compatibility concerns**

- Do not remove `/Teams/index.json`, `/Teams/message.json`,
  `/videos/DebtScope-help-videos.json`, `/Privacy%20Policy`, or
  `/api/debtscope/purchase-events` simply because the redesign is live.
- Retired Aware Money cleanup is optional and should not affect DebtScope.

**Tests**

- [ ] Re-run live site smoke tests after cleanup.
- [ ] Re-run permanent compatibility endpoint tests after cleanup.
- [ ] Verify old website-only URLs redirect or remain available as intended.

**Completion criteria**

- Cleanup is limited to non-urgent, verified-safe work.
- Production compatibility remains intact.
- Documentation reflects the launched state.

**Suggested commit message**

`Clean up post-launch website resources`

**Rollback approach**

Revert cleanup commits individually. Restore any removed compatibility copy or
legacy website-only file if a broken reference appears.

**Cost classification**

Free.

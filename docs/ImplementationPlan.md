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

**Status:** Complete (Committed and Pushed)

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

**Status:** Complete

**Goal**

Create a static support section with product-specific entry points and reusable
public support content.

**Prerequisites**

- Stage 5 completed or product support links known.
- Decision on which source materials may be public.

**Tasks**

- [x] Create support landing page.
  **Result:** A static Support landing page was created.
- [x] Add product-specific support entry points.
  **Result:** Product-specific support entry points were added without creating unnecessary separate support pages.
- [x] Add contact links for supported products.
  **Result:** DebtScope links to its existing support mailbox. ScoreKeep links to its existing contact mailbox. PlateWise links to `comment@komakode.com` with the subject `plateWise Feedback`.
- [x] Link to manuals, help videos, FAQs, and downloads.
  **Result:** ScoreKeep manual and team downloads are linked. DebtScope's in-app help videos are identified. No FAQ links were added because no public FAQs currently exist. No unsupported general download links were added.
- [x] Reuse documentation source material where practical.
  **Result:** Internal `docs/` remained separate from public support content.
- [x] Keep internal `docs/` separate from public support content.
  **Result:** No internal repository `docs/` files are linked or exposed as public support content.
- [x] Identify which public support content should be HTML.
  **Result:** The Support landing page remains HTML.
- [x] Identify which public support content may originate as Markdown.
  **Result:** No public Markdown source was created because no long-form support article currently requires it. Reusable Markdown may be introduced later for actual long-form articles.
- [x] Do not create a CMS.
  **Result:** No CMS, JavaScript, framework, or external dependency was introduced.
- [x] Do not duplicate long-form source content unnecessarily.
  **Result:** No empty Markdown files or duplicate support articles were created.

**Implementation decision**

The Support landing page remains static HTML. No new public Markdown support
source is needed during Stage 6 because the current support content is short and
primarily consists of navigation and contact links. Longer reusable support
articles may originate as Markdown later when actual article content exists. No
CMS is needed.

**Files affected**

- `support/index.html`
- `assets/css/site.css`
- `docs/ImplementationPlan.md`

**Compatibility concerns**

- Internal planning docs under `docs/` are not public support content.
- Existing app support email contracts must remain functional:
  `comment@KomaKode.com` and `support@komakode.com`.

**Tests**

- [x] Verify support landing page links to all product support entry points.
  **Result:** DebtScope, ScoreKeep, DevDoctor, and PlateWise product pages are linked from the Support landing page.
  
- [x] Verify contact links use correct mailboxes.
  **Result:** DebtScope uses `mailto:support@komakode.com?subject=Debt%20Scope%20support`; ScoreKeep uses `mailto:comment@KomaKode.com?subject=ScoreKeep%20support`; PlateWise uses `mailto:comment@komakode.com?subject=plateWise%20Feedback`.
  
- [x] Verify manual, help-video, FAQ, and download links resolve.
  **Result:** ScoreKeep links to `/Manual.pdf` and the home-page team-download experience. DebtScope identifies in-app help videos without exposing the raw manifest. No FAQ destination was added because no public FAQ currently exists.
  
- [x] Verify no internal planning document is exposed as public support content unintentionally.
  **Result:** No internal `docs/` path is linked from the Support landing page.

**Result:** DevDoctor is accurately identified as unreleased, with support
information deferred until release. PlateWise uses its built-in feedback
workflow as the primary support path; the in-app workflow provides app, version,
device, OS, and troubleshooting context. No separate PlateWise support page,
form, or ticket system was created. Protected compatibility resources remained
unchanged.

**Completion criteria**

- Public support entry points exist and are navigable.
- Long-form content strategy is recorded without adding a CMS.

**Suggested commit message**

`Add support section`

**Result:** Reviewed, committed, and pushed to the `site-redesign` branch with
commit message `Add support section`.

**Rollback approach**

Revert the support section commit. Existing mailto and compatibility endpoints
remain unchanged.

**Cost classification**

Free.

---

# Stage 7 - Downloads Section

**Status:** Complete

**Goal**

Create a static downloads section that distinguishes App Store products from
direct downloads.

**Prerequisites**

- Stage 5 completed.
- DevDoctor release state known enough to choose download or coming-soon copy.

**Tasks**

- [x] Create downloads landing page.
  **Result:** A static Downloads landing page was created using the shared site design.

- [x] Create DevDoctor download page or coming-soon section.
  **Result:** DevDoctor is represented on the landing page as `In development`; no separate page was needed and no download or purchase action was added.

- [x] Link to ScoreKeep manual access.
  **Result:** `/Manual.pdf` is linked.

- [x] Link to ScoreKeep team-download access.
  **Result:** The page links directly to the home-page MLB roster-download panel at `/#scorekeep-team-downloads` without duplicating the roster interface or exposing the raw manifest as the primary user experience.

- [x] Clearly distinguish App Store products from direct downloads.
  **Result:** DebtScope, ScoreKeep, and PlateWise are identified as App Store products, while DevDoctor is described as a future direct-distribution product.

- [x] Add DevDoctor current version field.
  **Result:** Not applicable. DevDoctor has no released version, so no version value was invented.

- [x] Add DevDoctor system requirements field.
  **Result:** The page states that final requirements will be published before release and no requirements were invented.

- [x] Add DevDoctor release notes field or link.
  **Result:** Not applicable. No release notes exist yet, so no dead link was created.

- [x] Add DevDoctor checksum field if a binary is available.
  **Result:** No DevDoctor binary exists, so no checksum was added.

- [x] Add DevDoctor download button or coming-soon state.
  **Result:** The page uses an `In development` state and deliberately provides no download button.

- [x] Do not implement payment.
  **Result:** No payment flow, provider, or purchase action was added.

- [x] Do not implement licensing.
  **Result:** No licensing system or license-key language was added.

- [x] Do not implement login.
  **Result:** No account, authentication, or login system was added.

- [x] Do not implement protected downloads.
  **Result:** No protected download access was added.

- [x] Do not implement automatic update feeds.
  **Result:** No automatic update feed was added.

**Files affected**

- `downloads/index.html`
- `assets/css/site.css`
- `docs/ImplementationPlan.md`

**Result:** No separate DevDoctor download page was created.

**Compatibility concerns**

- Do not move `Manual.pdf` or ScoreKeep team files in this stage.
- Any DevDoctor binary hosting decision must remain static-first and low-cost.

**Tests**

- [x] Verify downloads landing page links resolve.
  **Result:** Local static server responses were confirmed for `/downloads/`, all four product pages, and `/Manual.pdf`.

- [x] Verify App Store products are not presented as direct downloads.
  **Result:** DebtScope, ScoreKeep, and PlateWise are presented as App Store products with verified App Store links and product-page links.

- [x] Verify DevDoctor download state is accurate.
  **Result:** DevDoctor is marked `In development`, described as not currently available for download or purchase, and has no download, purchase, pricing, payment, license, version, build, checksum, macOS requirement, or release-notes action.

- [x] Verify ScoreKeep manual and team-download links work.
  **Result:** ScoreKeep links to `/Manual.pdf` and `/#scorekeep-team-downloads` for the existing home-page MLB roster-download panel.

**Completion criteria**

- Downloads section exists and accurately separates product distribution modes.
- No payment, licensing, login, protected download, or update-feed system is
  added.

**Result:** Downloads correctly separates App Store distribution, future DevDoctor direct distribution, and ScoreKeep resources.
**Result:** ScoreKeep resources are identified as MLB team roster downloads, with a stable `scorekeep-team-downloads` anchor on the home page.
**Result:** The existing roster loader still uses `/Teams/index.json`; post-render scrolling ensures `/#scorekeep-team-downloads` links land on the visible roster-download panel after the asynchronous roster list loads.
**Result:** No manifest schema, team URL, or `.ScoreKeep_Players` file changed.
**Result:** No unavailable system was introduced.
**Result:** Protected resources remained unchanged.

**Suggested commit message**

`Add downloads section`

**Result:** Reviewed, committed, and pushed to the `site-redesign` branch with commit message `Add downloads section`.

**Rollback approach**

Revert the downloads section commit. Existing direct file URLs remain unchanged.

**Cost classification**

Free for expected usage.

---

# Stage 8 - About and Legal Pages

**Status:** Complete

**Goal**

Create basic About and Legal navigation while preserving current privacy-policy
compatibility URLs.

**Prerequisites**

- Stage 3 completed.
- Privacy canonicalization decision known before any redirect or move.

**Tasks**

- [x] Create About page.
  **Result:** A public About page was created using the shared design and accurately describes KomoKode's products and independent development approach.
- [x] Add footer legal links.
  **Result:** Public footers link to `/legal/` and `/Privacy%20Policy.html`.
- [x] Plan future `/legal/privacy/` page if approved.
  **Result:** Resolved for Stage 8. No `/legal/privacy/` page was created, canonicalization remains deferred, and the current compatibility paths remain in use.
- [x] Preserve `https://komakode.com/Privacy%20Policy`.
  **Result:** The protected compatibility endpoint remains untouched.
- [x] Preserve current `.html` privacy path unless deliberately redirected.
  **Result:** `Privacy Policy.html` remains at the repository root and website navigation uses `/Privacy%20Policy.html`.
- [x] Do not remove or rename the current privacy-policy resource during basic redesign work.
  **Result:** The existing file was preserved.

**Files affected**

- `about/index.html`
- `legal/index.html`
- `assets/css/site.css`
- `index.html`
- `products/index.html`
- `products/devdoctor/index.html`
- `products/debtscope/index.html`
- `products/scorekeep/index.html`
- `products/platewise/index.html`
- `support/index.html`
- `downloads/index.html`

**Compatibility concerns**

- `/Privacy%20Policy` is a verified permanent compatibility endpoint.
- `Privacy Policy.html` is currently used by the website and should remain
  available unless a deliberate redirect plan is approved and tested.

**Tests**

- [x] Verify About page navigation.
  **Result:** About uses the shared shell and marks About current in the primary navigation.
- [x] Verify footer privacy link resolves.
  **Result:** Public footers include `/legal/` and `/Privacy%20Policy.html`.
- [x] Verify `/Privacy%20Policy` behavior is unchanged.
  **Result:** No redirect, route, Worker, or privacy-resource change was made; the protected compatibility endpoint remains untouched.
- [x] Verify `/Privacy%20Policy.html` behavior is unchanged unless an approved redirect exists.
  **Result:** `Privacy Policy.html` remains at the repository root and local navigation targets `/Privacy%20Policy.html`.

**Completion criteria**

- About and legal entry points exist.
- Privacy compatibility paths remain available.

**Completion results**

**Result:** About and Legal entry points exist.
**Result:** Footer legal navigation is consistent.
**Result:** Both privacy compatibility paths remain supported.
**Result:** No new privacy canonical path or redirect was introduced.
**Result:** No invented legal documents were added.
**Result:** Protected resources remained unchanged.

**Suggested commit message**

`Add about and legal pages`

**Result:** Reviewed, committed, and pushed to the `site-redesign` branch with commit message `Add about and legal pages`.

**Rollback approach**

Revert the About and Legal page commit. Do not remove existing privacy files.

**Cost classification**

Free.

---

# Stage 9 - Website-Only Resource Reorganization

**Status:** Complete

**Goal**

Decide and migrate website-only root resources separately from app-facing
resource migrations.

**Prerequisites**

- Stage 1 live URL behavior recorded.
- Product, support, and downloads pages identify final references.
- Proposed destinations approved.

**Tasks**

- [x] Decide final destination for `ScoreKeep.png`.
  **Result:** The canonical website location is `/assets/images/scorekeep.png`.
- [x] Decide final destination for `Manual.pdf`.
  **Result:** The canonical website location is `/downloads/scorekeep/scorekeep-manual.pdf`.
- [x] Identify any other root-level website images or downloads.
  **Result:** No other root-level website-only images or downloads were identified. Root-level inventory found `index.html` as the site entry point, `README.md` and `.localized` as deferred candidates requiring a separate decision, and `Privacy Policy.html` as excluded from website-only classification by rule.
- [x] For each resource, record current path.
  **Result:** Recorded `ScoreKeep.png` and `Manual.pdf`.
- [x] For each resource, record proposed destination.
  **Result:** Recorded `ScoreKeep.png` → `assets/images/scorekeep.png` and `Manual.pdf` → `downloads/scorekeep/scorekeep-manual.pdf`.
- [x] For each resource, update references only after the new destination exists.
  **Result:** Copies were created and verified before public website manual links were updated. The redesigned website did not actively reference `ScoreKeep.png`, so no image reference update was needed.
- [x] For each resource, decide whether the old URL should redirect or remain as a compatibility copy.
  **Result:** Both old root files remain unchanged compatibility copies. No redirect or routing mechanism was introduced.
- [x] For each resource, define a test procedure.
  **Result:** Old and new URLs were tested locally, page links were inspected, and file contents were compared byte-for-byte.
- [x] For each resource, define a rollback procedure.
  **Result:** Rollback consists of restoring website references to the existing root files and removing only the new duplicate copies.
- [x] Keep this work separate from app-facing resource migrations.
  **Result:** No team manifest, team file, video manifest, API, Worker, or app-facing endpoint changed.

**Resource migration table**

| Resource | Current path | Proposed destination | References to update | Old URL handling | Test procedure | Rollback procedure |
|---|---|---|---|---|---|---|
| ScoreKeep image | `ScoreKeep.png` | `assets/images/scorekeep.png` | Existing website image references, if any | Keep unchanged root compatibility copy | Compare files and verify old/new URLs | Restore old references and remove new copy |
| ScoreKeep manual | `Manual.pdf` | `downloads/scorekeep/scorekeep-manual.pdf` | Home, ScoreKeep product, Support, and Downloads manual links where present | Keep unchanged root compatibility copy | Compare files, open both URLs, and verify page links | Restore `/Manual.pdf` references and remove new copy |
| Other root-level public files | `index.html`; `README.md`; `.localized`; excluded: `Privacy Policy.html` | Deferred — requires separate decision | Deferred | No change | No change | No change |

**Files affected**

- `assets/images/scorekeep.png`
- `downloads/scorekeep/scorekeep-manual.pdf`
- `index.html`
- `products/scorekeep/index.html`
- `support/index.html`
- `downloads/index.html`
- `docs/ImplementationPlan.md`

Root `ScoreKeep.png` and `Manual.pdf` remain intact as compatibility copies.

**Compatibility concerns**

- `Manual.pdf` is website-only for the hosted file, but the old public URL may
  have bookmarks or search indexing.
- `ScoreKeep.png` is website-only, but the old public URL may be indexed.
- This stage must not touch app-facing manifests or team files.

**Tests**

- [x] Verify each new resource URL.
  **Result:** Local static server checks returned successful responses for `/assets/images/scorekeep.png` and `/downloads/scorekeep/scorekeep-manual.pdf`.
- [x] Verify each old URL redirects or remains available as approved.
  **Result:** Local static server checks returned successful responses for `/ScoreKeep.png` and `/Manual.pdf`; both remain root compatibility copies with no redirects.
- [x] Verify every updated page reference loads.
  **Result:** Local static server checks returned successful responses for `/`, `/products/scorekeep/`, `/support/`, and `/downloads/`; visitor-facing manual links now use `/downloads/scorekeep/scorekeep-manual.pdf`.
- [x] Verify no app-facing endpoint changed.
  **Result:** No `Teams/`, `videos/`, API, Worker, or app-facing resource was edited.

**Completion criteria**

- Website-only resource moves are documented, tested, and reversible.
- Old URL handling is intentionally chosen for each resource.

**Completion results**

**Result:** New organized copies exist at `assets/images/scorekeep.png` and `downloads/scorekeep/scorekeep-manual.pdf`.
**Result:** Old root URLs remain available through unchanged root files.
**Result:** Public website manual references use `/downloads/scorekeep/scorekeep-manual.pdf`.
**Result:** No active website reference to `ScoreKeep.png` was found; the organized image copy was still created.
**Result:** Both new files were verified as byte-for-byte identical copies.
**Result:** No redirect or routing mechanism was added.
**Result:** No app-facing resource changed.
**Result:** The migration is reversible by restoring old manual references and removing only the new duplicate copies.
**Result:** Stage 10 remains Not started.
**Result:** Stage 9 has not been committed or pushed.

**Suggested commit message**

`Reorganize website-only resources`

**Result:** Reviewed, committed, and pushed to the `site-redesign` branch with commit message `Reorganize website-only resources`.

**Rollback approach**

Restore website references to `ScoreKeep.png` and `/Manual.pdf` where applicable,
then remove `assets/images/scorekeep.png` and
`downloads/scorekeep/scorekeep-manual.pdf`. No redirect, routing, app-facing
resource, or compatibility endpoint cleanup is required.

**Cost classification**

Free.

---

# Stage 10 - App-Facing Compatibility Work

**Status:** Complete

**Goal**

Handle any app-facing compatibility migrations separately from visual redesign.

**Prerequisites**

- Explicit approval for each compatibility change.
- Stage 12-style app behavior tests available.
- For purchase analytics, authoritative Worker identified first.

**Audit summary**

Stage 10 was performed as a read-only compatibility audit on July 13, 2026. No
app-facing migration was performed, no replacement URLs were created, and no
protected production resource was moved or modified.

The audit found that current static app-facing URLs and schemas remain
compatible for ScoreKeep team manifests, ScoreKeep message manifests, the
protected privacy-policy URL, and the DebtScope help-video manifest. One
DebtScope iPad media URL in the manifest contains a literal space:
`https://media.komakode.com/DebtScope-Import- files-iPad.mp4`. Generic `curl`
rejects that exact string as malformed, but Swift `URL(string:)` percent-encodes
it to `https://media.komakode.com/DebtScope-Import-%20files-iPad.mp4`, and the
encoded media URL responds successfully with `video/mp4`.

The purchase analytics endpoint was not modified. The repository does not
contain Worker source or Worker routing configuration, so the authoritative
Worker cannot be identified from this repository alone.

Manual released-app verification was completed after the read-only audit.
ScoreKeep loaded messages, downloaded MLB team rosters, and imported downloaded
rosters successfully. DebtScope loaded help-video categories and played help
videos successfully on iPhone and iPad where applicable. No compatibility
issues were observed, and no migration was required.

**Tasks**

- [x] Treat this stage as separate from visual redesign.
  **Result:** The audit was documentation-only and separate from Stages 1-9 visual redesign work.
- [x] Do not move protected resources merely for cleaner organization.
  **Result:** Protected resources were inspected but not moved.
- [x] Preserve older released app behavior.
  **Result:** Existing app-facing URLs and schemas were retained.
- [x] Use stable routing, redirects, duplicate compatibility files, or permanent legacy paths for any migration.
  **Result:** Not applicable. No app-facing migration was performed, so no redirects or compatibility copies were added.
- [x] Test real ScoreKeep and DebtScope behavior where applicable.
  **Result:** Manual released-app verification was completed successfully for ScoreKeep roster downloads/imports and DebtScope help-video playback.

## ScoreKeep Team Files

**Repository inventory**

- `Teams/index.json` remains at the repository path used by the public
  `/Teams/index.json` endpoint.
- `Teams/message.json` remains at the repository path used by the public
  `/Teams/message.json` endpoint.
- The repository contains 30 `.ScoreKeep_Players` files under `Teams/`.
- The team manifest shape is unchanged: top-level `updated` and `divisions`;
  each division has `name` and `teams`; each team has `name` and `url`.
- The manifest contains 6 divisions and 30 team entries.
- All `teams[].url` values point to `https://komakode.com/Teams/...`.
- All `teams[].url` values preserve the `.ScoreKeep_Players` extension.
- Recent Stage 7-9 website redesign commits did not alter `Teams/index.json`,
  `Teams/message.json`, or `Teams/*.ScoreKeep_Players`.

**Tasks**

- [x] Keep `Teams/index.json` manifest endpoint stable.
  **Result:** `https://komakode.com/Teams/index.json` returned HTTP 200, `application/json`, no redirect, and parsed as JSON.
- [x] Keep `Teams/message.json` endpoint stable.
  **Result:** `https://komakode.com/Teams/message.json` returned HTTP 200, `application/json`, no redirect, and parsed as JSON.
- [x] Deploy replacement team files before changing `teams[].url`.
  **Result:** Not applicable. No team-file migration or manifest URL change was performed.
- [x] Preserve `.ScoreKeep_Players`.
  **Result:** All 30 manifest team URLs and local team files preserve the `.ScoreKeep_Players` extension.
- [x] Preserve manifest schema fields.
  **Result:** The current schema remains `updated`, `divisions[].name`, `divisions[].teams[]`, `teams[].name`, and `teams[].url`.
- [x] Test website download.
  **Result:** The manifest URL for Angels, `https://komakode.com/Teams/Angels.ScoreKeep_Players`, returned HTTP 200, `application/octet-stream`, no redirect, and retained the `.ScoreKeep_Players` filename contract.
- [x] Test in-app download.
  **Result:** Manual verification confirmed that released ScoreKeep successfully downloads MLB team rosters, imports downloaded teams, and continues using the existing compatibility endpoints without modification.
- [x] Keep old team-file URLs redirected or duplicated where practical.
  **Result:** Not applicable. No team-file migration or manifest URL change was performed.

## DebtScope Help Videos

**Repository inventory**

- `videos/DebtScope-help-videos.json` remains at the repository path used by the
  public `/videos/DebtScope-help-videos.json` endpoint.
- The manifest schema is unchanged: a top-level array of entries with `id`,
  `title`, `subtitle`, and `urls`; each `urls` object has `iphone` and `ipad`.
- The manifest contains 5 active help-video entries and 10 active media URLs.
- All active media URLs use `https://media.komakode.com/...`.
- Recent Stage 7-9 website redesign commits did not alter
  `videos/DebtScope-help-videos.json`.

**Tasks**

- [x] Keep `videos/DebtScope-help-videos.json` endpoint stable.
  **Result:** `https://komakode.com/videos/DebtScope-help-videos.json` returned HTTP 200, `application/json`, no redirect, and parsed as JSON.
- [x] Keep manifest schema stable.
  **Result:** The current manifest schema remains unchanged.
- [x] Deploy media before changing manifest URLs.
  **Result:** Not applicable. No help-video migration or manifest URL change was performed.
- [x] Preserve at least one playable URL per video.
  **Result:** All active help-video entries have media URLs that resolve to `video/mp4`; the manifest's one literal-space URL was also verified through Swift URL percent-encoding.
- [x] Test iPhone video selection and playback.
  **Result:** Manual verification confirmed that released DebtScope successfully loaded and played help videos on iPhone, with no compatibility problems observed.
- [x] Test iPad video selection and playback.
  **Result:** Manual verification confirmed that released DebtScope successfully loaded and played help videos on iPad where applicable, with no compatibility problems observed.
- [x] Keep current media URLs redirected or duplicated while active manifests or cached clients may reference them.
  **Result:** Not applicable. No help-video migration or manifest URL change was performed.

## Purchase Analytics API

**Repository search results**

- Site repository search found documentation references to
  `/api/debtscope/purchase-events` in `docs/MigrationPlan.md`,
  `docs/WebsiteArchitecture.md`, and this implementation plan.
- `Privacy Policy.html` mentions purchase analytics sent to KomoKode
  infrastructure at `komakode.com` and stored using Cloudflare D1.
- `README.md` identifies the site as deployed with Cloudflare Pages.
- This repository contains no Worker source, no `wrangler.toml`, no
  `wrangler.jsonc`, and no Cloudflare route configuration for the endpoint.
- `docs/MigrationPlan.md` records candidate Worker files from the separate
  DebtScope repository:
  `Cloudflare/PurchaseAnalytics/wrangler.toml`,
  `Cloudflare/PurchaseAnalytics/src/index.js`,
  `debtscope-purchase-analytics/wrangler.jsonc`, and
  `debtscope-purchase-analytics/src/index.ts`.
- Blocked: authoritative Worker cannot be identified from the repository alone.

**Tasks**

- [x] Do not modify `/api/debtscope/purchase-events` until the authoritative Worker is identified.
  **Result:** The endpoint and Worker configuration were not modified.
- [ ] Blocked: Identify which purchase analytics Worker is authoritative.
  **Result:** Authoritative Worker cannot be identified from this repository alone.
- [ ] Blocked: Preserve POST behavior.
  **Result:** Full POST compatibility requires an approved controlled test payload and authoritative Worker identification.
- [ ] Blocked: Preserve accepted payload fields.
  **Result:** Accepted payload fields cannot be verified from this repository alone.
- [ ] Blocked: Ensure backend ignores unknown fields.
  **Result:** Unknown-field tolerance cannot be verified from this repository alone.
- [x] Treat Worker investigation as a prerequisite to any backend change.
  **Result:** No backend, Worker, route, or endpoint change was made.

**Files affected**

- `docs/ImplementationPlan.md`

Protected production resources were inspected but not modified:

- `Teams/index.json`
- `Teams/message.json`
- `Teams/*.ScoreKeep_Players`
- `videos/DebtScope-help-videos.json`
- `Privacy Policy.html`
- `/api/debtscope/purchase-events` Worker, routing, and endpoint behavior

**Compatibility concerns**

- `/Teams/index.json`, `/Teams/message.json`,
  `/videos/DebtScope-help-videos.json`, `/Privacy%20Policy`, and
  `/api/debtscope/purchase-events` are protected permanent compatibility
  resources.
- Older released apps must continue working without updates.
- The manifest string `https://media.komakode.com/DebtScope-Import- files-iPad.mp4`
  contains a literal space. Swift URL parsing percent-encodes it and the encoded
  media resource responds successfully. Manual released-app playback was also
  verified successfully.

**Tests**

- [x] Fetch `https://komakode.com/Teams/index.json`.
  **Result:** HTTP 200; `application/json`; no redirect; JSON parse succeeded.
- [x] Fetch `https://komakode.com/Teams/message.json`.
  **Result:** HTTP 200; `application/json`; no redirect; JSON parse succeeded.
- [x] Download at least one team file through the website.
  **Result:** `https://komakode.com/Teams/Angels.ScoreKeep_Players` returned HTTP 200, `application/octet-stream`, no redirect.
- [x] ScoreKeep released-app verification.
  **Result:** Manual verification confirmed messages load correctly, MLB team downloads work correctly, and downloaded rosters import successfully.
- [x] Fetch `https://komakode.com/videos/DebtScope-help-videos.json`.
  **Result:** HTTP 200; `application/json`; no redirect; JSON parse succeeded.
- [x] Check `https://komakode.com/Privacy%20Policy`.
  **Result:** HTTP 200; `text/html; charset=utf-8`; no redirect.
- [x] Check active DebtScope help-video media URLs.
  **Result:** 9 of 10 exact manifest media strings returned HTTP 200 with `video/mp4` via `curl -I`; the remaining manifest string contains a literal space and was rejected by `curl` as malformed, while Swift `URL(string:)` percent-encoded it and the encoded URL returned HTTP 200 with `video/mp4`.
- [x] DebtScope iPhone playback verification.
  **Result:** Manual verification confirmed help-video categories load correctly and videos play correctly on iPhone.
- [x] DebtScope iPad playback verification.
  **Result:** Manual verification confirmed help-video categories load correctly and videos play correctly on iPad where applicable.
- [ ] Blocked: Verify `POST https://komakode.com/api/debtscope/purchase-events` remains available and compatible.
  **Result:** No production POST request was sent. Non-mutating checks returned HTTP 405 with `application/json` for both HEAD and GET, confirming only that non-POST methods are rejected.
- [ ] Blocked: Identify the authoritative purchase analytics Worker.
  **Result:** Authoritative Worker cannot be identified from this repository alone.

**Completion criteria**

- Any approved app-facing migration is complete, tested with real app behavior
  where applicable, and reversible.
- Protected legacy paths remain available.

**Completion results**

**Result:** Repository audit completed.
**Result:** Public endpoint verification completed.
**Result:** Manual ScoreKeep verification completed successfully.
**Result:** Manual DebtScope verification completed successfully.
**Result:** Existing permanent paths, URLs, and schemas remain compatible.
**Result:** No app-facing migration was required.
**Result:** No Swift code change is required because existing app-facing URLs
and schemas remain intact.
**Result:** The purchase analytics endpoint must remain untouched until its
authoritative Worker is identified.
**Result:** Protected resources had no diff.
**Result:** Purchase analytics Worker identity, accepted payload fields,
unknown-field tolerance, and production POST behavior remain blocked.
**Result:** Stage 11 remains Not started.
**Result:** Stage 10 has not been committed or pushed.

**Suggested commit message**

`Audit app-facing compatibility`

**Rollback approach**

Revert the Stage 10 documentation update. No protected resource, route, Worker,
manifest, team file, media URL, privacy page, Swift source, HTML, CSS, or
JavaScript rollback is required because none were modified.

**Cost classification**

Free for static compatibility work. Worth paying for only if a paid service
solves a verified compatibility or operational problem.

---

# Stage 11 - Content and Quality Review

**Status:** Complete

**Goal**

Review content, accessibility, navigation, performance, and product accuracy
before preview or launch testing.

**Prerequisites**

- Stages 4 through 8 completed.
- Any Stage 9 or Stage 10 work included in the release is completed.

**Tasks**

- [x] Check spelling and grammar.
  **Result:** Reviewed 11 public HTML pages. Corrected visible PlateWise
  brand spacing in product and download calls to action. Preserved intentionally
  encoded mailto subjects and legacy mailbox casing.
- [x] Check navigation consistency.
  **Result:** Verified the shared primary navigation on 10 redesigned pages:
  Home, Products, Support, Downloads, and About appear in the expected order,
  with the correct `class="current"` and `aria-current="page"` state. Legal has
  no primary current item. Footer legal links point to `/legal/` and
  `/Privacy%20Policy.html`.
- [x] Check for broken links.
  **Result:** Checked 148 local links across 11 public HTML pages with no
  failures after URL decoding. Verified App Store URLs for DebtScope,
  ScoreKeep, and PlateWise returned HTTP 200. Verified mailto links without
  sending email.
- [x] Check for missing images.
  **Result:** Checked HTML image references, CSS `url(...)` references, PDF
  links, the ScoreKeep image copies, and the ScoreKeep manual copies. No missing
  public image, CSS, or PDF resources were found.
- [x] Check mobile layout.
  **Result:** Static CSS inspection found responsive breakpoints for narrow and
  tablet layouts, wrapping navigation/actions, single-column grids, and
  overflow handling for roster links. Manual browser verification completed
  successfully at narrow and full-width layouts. No clipping, horizontal
  overflow, or broken responsive behavior was observed on the home page,
  product pages, Support, Downloads, About, Legal, or Privacy Policy pages.
- [x] Check keyboard navigation.
  **Result:** Static review verified skip links, `#main-content` targets,
  semantic links, generated roster links, and visible focus CSS. Added a
  mechanical skip-link and `main id="main-content"` correction to
  `Privacy Policy.html`. Manual keyboard verification completed successfully in
  Safari with Press Tab to highlight each item enabled. The skip link, visible
  focus states, forward and backward tab order, and keyboard access to
  navigation, page links, roster links, and footer were verified. No keyboard
  trap was observed.
- [x] Check color contrast.
  **Result:** WCAG contrast calculations were run for the shared CSS color
  pairs. Body text, muted text, links, buttons, current navigation, footer text,
  error text, and focus outlines met the applicable 4.5:1 or 3:1 targets. No
  CSS color correction was required.
- [x] Check page performance.
  **Result:** Reviewed public assets and scripts. No external fonts,
  third-party scripts, analytics, duplicate CSS, or unnecessary JavaScript were
  found. Recorded major asset sizes. Duplicate ScoreKeep image and manual
  resources remain intentional compatibility copies.
- [x] Confirm JavaScript remains minimal.
  **Result:** Reviewed the inline `index.html` script. It remains limited to
  ScoreKeep roster downloads, fetches `/Teams/index.json`, uses manifest
  `teams[].url` values, preserves division grouping and update-date behavior,
  keeps loading/error messages visible, preserves the no-JavaScript fallback,
  scrolls only for `#scorekeep-team-downloads`, and does not move keyboard
  focus.
- [x] Check titles and metadata.
  **Result:** Verified unique titles, descriptions, UTF-8 metadata, and
  viewport metadata on all 11 public HTML pages. Updated the Products page meta
  description to remove placeholder redesign wording.
- [x] Check product claims for accuracy.
  **Result:** Verified DevDoctor, DebtScope, ScoreKeep, and PlateWise public
  descriptions against the Stage 11 product-accuracy requirements. Replaced
  Products landing placeholder copy with accurate product summaries.
- [x] Check branding consistency.
  **Result:** Verified KomoKode, DevDoctor, DebtScope, ScoreKeep, PlateWise,
  and Independent Software Development usage. Corrected visible `Plate Wise`
  brand references. Preserved mailto subjects and addresses where they reflect
  existing app workflows.
- [x] Confirm no placeholder text is accidentally published.
  **Result:** Searched for TODO, FIXME, placeholder, lorem ipsum, coming soon,
  TBD, example.com, empty links/sources, fake screenshot, sample text,
  temporary, and test content. Replaced accidental Products landing placeholder
  content. Remaining matches are historical implementation-plan or migration
  documentation, intentional DevDoctor future-facing language, or preserved
  compatibility notes.

**Files affected**

- `products/index.html`
- `products/platewise/index.html`
- `downloads/index.html`
- `Privacy Policy.html`
- `docs/ImplementationPlan.md`

Reviewed with no modification required:

- `index.html`
- `products/devdoctor/index.html`
- `products/debtscope/index.html`
- `products/scorekeep/index.html`
- `support/index.html`
- `about/index.html`
- `legal/index.html`
- `assets/css/site.css`

**Compatibility concerns**

Review edits did not alter app-facing endpoint behavior, protected manifests,
team files, videos, Worker routes, app source, Swift source, binary assets, or
compatibility copies.

**Tests**

- [x] Run local link checks or manually verify every internal link.
  **Result:** Checked 11 public HTML pages and 148 local links. No local-link
  failures remained. External App Store links and `https://komakode.com`
  returned HTTP 200. Mailto links were inventoried but not sent.
- [x] Test pages at mobile and desktop widths.
  **Result:** Manual browser verification completed successfully at narrow and
  full-width layouts. No clipping, horizontal overflow, or broken responsive
  behavior was observed. Navigation, cards, actions, roster sections, and the
  footer remained usable.
- [x] Navigate using keyboard only.
  **Result:** Manual keyboard verification completed successfully in Safari.
  Safari's Press Tab to highlight each item on a webpage setting was enabled.
  The skip link appeared when Tab was pressed, activating it moved to the main
  content, focus indicators were visible, Tab and Shift-Tab order was sensible,
  and no keyboard trap was observed.
- [x] Inspect browser console for errors.
  **Result:** Safari's JavaScript Console remained free of errors during home
  page reload and ScoreKeep roster rendering. ScoreKeep roster divisions loaded
  successfully and team roster links remained functional.
- [x] Confirm page titles and descriptions are product-appropriate.
  **Result:** Checked all 11 public HTML pages. Corrected the Products page
  description; all other titles and descriptions were appropriate.

Additional verification:

- Local static server returned HTTP 200 for `/`, `/products/`,
  `/products/devdoctor/`, `/products/debtscope/`, `/products/scorekeep/`,
  `/products/platewise/`, `/support/`, `/downloads/`, `/about/`, `/legal/`,
  `/Privacy%20Policy.html`, `/downloads/scorekeep/scorekeep-manual.pdf`,
  `/assets/images/scorekeep.png`, `/ScoreKeep.png`, `/Manual.pdf`, and
  `/Teams/index.json`.
- Roster manifest review found 6 divisions, 30 teams, update timestamp
  `2026-05-26T23:59:59Z`, and 0 missing local team files when manifest URL
  paths were mapped to local resources.
- Major asset sizes: `assets/css/site.css` 14,905 bytes; `ScoreKeep.png`
  194,427 bytes; `assets/images/scorekeep.png` 194,427 bytes; `Manual.pdf`
  3,415,325 bytes; `downloads/scorekeep/scorekeep-manual.pdf` 3,415,325 bytes.
- Contrast results included body text on page 15.33:1, muted text on surface
  5.78:1, accent links on surface 6.12:1, button text on accent 6.12:1,
  current navigation text 14.25:1, footer muted text 5.78:1, error text 8.02:1,
  and focus outline on surface 3.87:1.
- Manual visual review passed at narrow and full-width browser sizes for the
  home page, product pages, Support, Downloads, About, Legal, and Privacy
  Policy pages.
- Manual keyboard review passed in Safari with visible focus, skip-link access,
  forward and backward tab order, keyboard access to navigation, page links,
  roster links, and footer, and no keyboard trap.
- Browser-console review passed in Safari with no JavaScript errors during home
  page load or ScoreKeep roster rendering.

**Completion criteria**

- No known broken links, missing images, accidental placeholders, or inaccurate
  product claims remain from the automated, static, and manual checks performed.
- Accessibility and performance issues found by automated or static review were
  fixed or documented.
- Manual visual, keyboard, and browser-console verification passed. No blocking
  quality issues remain.

**Completion results**

- Spelling and grammar review: complete for 11 public HTML pages; visible
  PlateWise spacing corrected.
- Navigation consistency: complete for shared navigation and footer links.
- Broken links: 148 local links checked; no failures remain.
- Missing images/resources: no missing public image, PDF, CSS, or roster
  resources found.
- Accessibility: structural and static review complete; `Privacy Policy.html`
  received a mechanical skip-link and main-target correction; manual Safari
  keyboard traversal passed.
- Responsive review: static CSS review complete; manual visual review passed at
  narrow and full-width browser sizes with no clipping, horizontal overflow, or
  broken responsive behavior observed.
- Color contrast: calculated shared CSS color pairs meet applicable targets.
- Performance review: no obvious performance defects found; binary compatibility
  copies left unchanged.
- JavaScript review: inline JavaScript remains limited to ScoreKeep roster
  downloads and does not move focus.
- Browser-console review: Safari's JavaScript Console remained free of errors
  during page load and ScoreKeep roster rendering.
- Title and metadata review: all pages checked; Products description corrected.
- Product accuracy: checked against Stage 11 requirements; Products landing
  placeholder content replaced with accurate summaries.
- Branding consistency: visible PlateWise spacing corrected; approved wording
  and intentional support-mail subjects preserved.
- Placeholder search: accidental Products placeholder copy cleared.
- Automated checks passed.
- Manual visual review passed.
- Manual keyboard review passed.
- Browser-console review passed.
- No blocking quality issues remain.
- Protected resources remained unchanged.
- Stage 12 remains Not started.

**Suggested commit message**

`Review content and site quality`

**Rollback approach**

Revert the quality review commit if it introduces regressions.

**Cost classification**

Free.

---

# Stage 12 - Preview and End-to-End Testing

**Status:** End-to-End Testing Complete — Purchase Analytics Verification Blocked

**Goal**

Test the redesigned site and protected compatibility endpoints on the
`site-redesign` branch or Cloudflare preview deployment before launch.

**Prerequisites**

- Stages intended for launch are complete.
- Cloudflare preview deployment is available or local static testing is
  sufficient for non-production checks.

**Tasks**

- [x] Test home page.
  **Result:** Local static testing at `http://127.0.0.1:8765/` returned HTTP
  200. Header, Home current state, footer links, product links, manual link,
  roster anchor, and local `Teams/index.json` rendering prerequisites passed by
  HTTP/HTML inspection. Cloudflare preview deployment availability was later
  confirmed manually through the Cloudflare dashboard.
- [x] Test every product page.
  **Result:** Local static testing returned HTTP 200 for `/products/`,
  `/products/devdoctor/`, `/products/debtscope/`, `/products/scorekeep/`, and
  `/products/platewise/`. Each page has one `<h1>`, Products is current, internal
  links resolved, App Store links are present for App Store products, DevDoctor
  has no purchase/download action, and DebtScope does not expose the raw video
  manifest as visitor-facing help.
- [x] Test support.
  **Result:** Local static testing returned HTTP 200 for `/support/`. Support is
  current, product support/contact links are present, ScoreKeep manual and
  roster links resolve, DebtScope videos are described as available in the app,
  and no public `docs/` links or nonexistent ticketing/chat/form destination was
  found by HTML inspection. No email was sent.
- [x] Test downloads.
  **Result:** Local static testing returned HTTP 200 for `/downloads/`.
  Downloads is current, DebtScope/ScoreKeep/PlateWise are App Store products,
  DevDoctor is marked in development and explicitly unavailable for download or
  purchase, ScoreKeep manual resolves to
  `/downloads/scorekeep/scorekeep-manual.pdf`, and roster links target
  `/#scorekeep-team-downloads`.
- [x] Test about.
  **Result:** Local static testing returned HTTP 200 for `/about/`. About is
  current, all four products are represented, product/support/download links
  resolve, and no unsupported company-history, staff, customer-count, award, or
  guarantee claims were found by HTML inspection.
- [x] Test privacy links.
  **Result:** Local `/legal/` returned HTTP 200 with no primary nav item marked
  current, and local `/Privacy%20Policy.html` returned HTTP 200. Production
  `https://komakode.com/Privacy%20Policy` returned HTTP 200,
  `text/html; charset=utf-8`, no redirect. Production
  `https://komakode.com/Privacy%20Policy.html` returned HTTP 308 to
  `/Privacy Policy`, with no content type. Privacy legal wording was not edited.
- [x] Test ScoreKeep website team downloads.
  **Result:** Production `https://komakode.com/Teams/index.json` and
  `https://komakode.com/Teams/message.json` returned HTTP 200,
  `application/json`, no redirect, and parsed as JSON. The team manifest contains
  6 divisions and 30 teams; every `teams[].url` preserves
  `.ScoreKeep_Players`. Angels, Cubs, and Yankees team files returned HTTP 200,
  `application/octet-stream`, no redirect.
- [x] Test ScoreKeep in-app team downloads.
  **Result:** Released ScoreKeep app testing passed. MLB roster list loaded, at
  least one roster downloaded successfully, the downloaded roster imported
  successfully, and no compatibility issue was observed.
- [x] Test ScoreKeep messages.
  **Result:** Released ScoreKeep app testing passed. Messages loaded
  successfully. Production `Teams/message.json` returned HTTP 200,
  `application/json`, no redirect, and parsed as JSON with `messages` and
  `version` keys.
- [x] Test DebtScope help-video manifest.
  **Result:** Production
  `https://komakode.com/videos/DebtScope-help-videos.json` returned HTTP 200,
  `application/json`, no redirect, parsed as JSON, and contained 5 active
  entries with iPhone and iPad media URLs.
- [x] Test DebtScope help-video playback.
  **Result:** Released DebtScope app testing passed. Help-video categories
  loaded successfully, active videos were selectable, videos played successfully
  on iPhone, applicable videos played successfully on iPad, and no compatibility
  issue was observed.
- [ ] Blocked: Test purchase analytics endpoint availability.
  **Result:** HEAD and GET returned HTTP 405 with `application/json`.
  Controlled POST compatibility remains unverified because the authoritative
  Worker is unidentified and no approved harmless payload was used.
- [x] Test direct media URLs still referenced by active manifests.
  **Result:** Checked 10 active DebtScope media URLs with lightweight byte-range
  requests. All 10 returned HTTP 206, `video/mp4`, no redirects or failures. The
  literal-space manifest string
  `https://media.komakode.com/DebtScope-Import- files-iPad.mp4` is rejected by
  `curl` as malformed; the percent-encoded URL
  `https://media.komakode.com/DebtScope-Import-%20files-iPad.mp4` returned HTTP
  200 on `HEAD` and HTTP 206 on ranged `GET`, `video/mp4`.
- [x] Test existing permanent URLs.
  **Result:** Production checks completed. `/` returned HTTP 200,
  `text/html; charset=utf-8`; `/index.html` returned HTTP 308 to `/`;
  `/Privacy%20Policy` returned HTTP 200, `text/html; charset=utf-8`;
  `/Privacy%20Policy.html` returned HTTP 308 to `/Privacy Policy`; `/Manual.pdf`
  returned HTTP 200 on `HEAD` and HTTP 206 ranged `GET`, `application/pdf`;
  `/ScoreKeep.png` returned HTTP 200 on `HEAD` and HTTP 206 ranged `GET`,
  `image/png`; `/Teams/index.json`, `/Teams/message.json`, and
  `/videos/DebtScope-help-videos.json` returned HTTP 200, `application/json`.
- [x] Test 404 behavior.
  **Result:** Local
  `http://127.0.0.1:8765/this-page-should-not-exist-stage12-test/` returned a
  true HTTP 404 from Python's static server. Cloudflare Preview 404 verification
  remains unavailable.
- [x] Test mobile layouts.
  **Result:** Manual browser testing passed at approximately 320 px, 375 px, and
  768 px. No horizontal overflow, clipped text, broken responsive behavior, or
  unusable navigation was observed; cards stacked correctly, roster links
  wrapped, actions remained reachable, and the footer remained usable.
- [x] Test desktop layouts.
  **Result:** Manual browser testing passed at approximately 1024 px and 1440
  px. Content width remained readable, cards and grids aligned properly,
  navigation remained consistent, whitespace was appropriate, roster divisions
  remained readable, and the footer layout remained usable.
- [x] Record expected results.
  **Result:** Expected results are recorded in this Stage 12 section.
- [x] Record actual results.
  **Result:** Actual automated results and manual limitations are recorded in
  this Stage 12 section.

**Test record**

| Area | Expected result | Actual result | Status |
|---|---|---|---|
| Home page | Loads and links to main sections | Local `http://127.0.0.1:8765/` returned HTTP 200; header, Home current state, footer links, product links, manual link, and roster anchor target verified by HTTP/HTML inspection. | Passed |
| Product pages | All product pages load and link correctly | `/products/`, `/products/devdoctor/`, `/products/debtscope/`, `/products/scorekeep/`, and `/products/platewise/` returned HTTP 200 locally; each has one `<h1>`, Products current state, correct internal links, and no raw DebtScope manifest visitor link. | Passed |
| Support | Support landing and product entry points work | `/support/` returned HTTP 200 locally; product contact links, ScoreKeep manual/roster links, and no public `docs/` links verified by HTML inspection. | Passed |
| Downloads | Downloads section distinguishes App Store and direct downloads | `/downloads/` returned HTTP 200 locally; App Store products are separated from DevDoctor, which is marked in development and unavailable for download or purchase. | Passed |
| About | About page loads and navigation works | `/about/` returned HTTP 200 locally; product and section links resolved and unsupported company claims were not found by HTML inspection. | Passed |
| Privacy links | Existing privacy compatibility paths remain available | Local legal/privacy pages loaded; production `/Privacy%20Policy` returned HTTP 200 `text/html; charset=utf-8`; production `/Privacy%20Policy.html` returned HTTP 308 to `/Privacy Policy`. | Passed |
| ScoreKeep website team downloads | Website can fetch manifest and download team files | Production manifest and message JSON returned HTTP 200 `application/json` and parsed; 30 teams remain represented; Angels, Cubs, and Yankees `.ScoreKeep_Players` URLs returned HTTP 200 `application/octet-stream`. | Passed |
| ScoreKeep in-app team downloads | Released ScoreKeep can fetch and import teams | Released ScoreKeep loaded the MLB roster list, downloaded at least one roster, and imported the downloaded roster successfully with no compatibility issue observed. | Passed |
| ScoreKeep messages | Released ScoreKeep can fetch messages | Released ScoreKeep loaded messages successfully; production message JSON also passed HTTP/JSON checks. | Passed |
| DebtScope help-video manifest | Released DebtScope can fetch manifest | Production manifest returned HTTP 200 `application/json`, parsed as JSON, and contains active iPhone/iPad media URLs. | Passed |
| DebtScope help-video playback | iPhone and iPad playback works | Released DebtScope loaded help-video categories, allowed active videos to be selected, and played videos successfully on iPhone and applicable videos on iPad with no compatibility issue observed. | Passed |
| Purchase analytics endpoint | POST endpoint remains available | Non-mutating checks returned HTTP 405 `application/json` for HEAD and GET. | Blocked — controlled POST verification not approved and authoritative Worker remains unidentified |
| Direct media URLs | Active manifest media URLs remain reachable | 10 active media URLs checked; 10 succeeded with HTTP 206 `video/mp4`; 0 redirects; 0 failures; percent-encoded literal-space URL succeeded. | Passed |
| Existing permanent URLs | Permanent URLs resolve correctly | Production `/`, `/index.html`, privacy paths, `Manual.pdf`, `ScoreKeep.png`, team JSON, message JSON, and DebtScope manifest checked with exact status/content-type/redirect behavior recorded above. | Passed |
| 404 behavior | Missing pages produce expected 404 behavior | Local nonexistent URL returned true HTTP 404 from Python static server; Cloudflare Preview unavailable. | Passed |
| Mobile layout | Pages are usable on narrow screens | Manual browser testing passed at approximately 320 px, 375 px, and 768 px with no overflow, clipped text, broken responsive behavior, or unusable controls observed. | Passed |
| Desktop layout | Pages are usable on desktop screens | Manual browser testing passed at approximately 1024 px and 1440 px with readable content width, aligned cards/grids, consistent navigation, readable roster divisions, and usable footer layout. | Passed |
| Keyboard and console smoke test | Skip links, tab order, focus visibility, generated roster links, and console remain clean in Safari | Manual Safari testing passed: tab highlighting was enabled, skip link worked, focus indicators were visible, Tab and Shift-Tab order was sensible, generated roster links were keyboard accessible, home reload produced no JavaScript errors, roster divisions and team links loaded, and anchor scrolling produced no console errors. | Passed |

**Files affected**

- `docs/ImplementationPlan.md`

**Compatibility concerns**

- Cloudflare preview deployment availability for `site-redesign` was confirmed
  manually through the Cloudflare dashboard after the detailed Stage 12 checks.
  No preview URL is recorded here. Redesigned pages were tested locally through
  `http://127.0.0.1:8765/`.
- Production endpoint checks were read-only. No production POST request was sent
  to the purchase analytics endpoint.
- Production still serves `main`; redesigned human-facing content was not tested
  against production.

**Tests**

- [x] Use preview URLs for redesigned pages.
  **Result:** Cloudflare preview deployment availability for `site-redesign`
  was confirmed manually through the Cloudflare dashboard. The detailed
  redesigned page checks recorded in Stage 12 were performed using the local
  static server.
- [x] Use production URLs for permanent endpoint behavior where needed.
  **Result:** Production permanent compatibility endpoints were tested with
  read-only HTTP requests.
- [x] Use real released apps for ScoreKeep and DebtScope compatibility where applicable.
  **Result:** Released ScoreKeep and DebtScope manual compatibility testing
  passed.

**Completion criteria**

- Expected and actual results are recorded.
- No website defect requiring a public-file correction was found in automated
  local testing.
- Protected static compatibility endpoints passed read-only checks.
- Purchase analytics POST verification remains blocked and must not be treated
  as passed from HTTP 405 method responses.
- Released-app testing, Safari keyboard/console testing, and measured
  mobile/desktop browser rendering passed by manual verification.
- No launch-blocking website or app compatibility issue remains.

**Completion results**

- Redesigned page results: home, products, support, downloads, about, legal, and
  local privacy page loaded successfully in the local static environment.
- Navigation results: local internal navigation and footer links resolved; page
  current states matched expectations for Home, Products, Support, Downloads,
  and About; Legal and Privacy did not incorrectly mark a primary nav item
  current.
- Privacy results: local `Privacy Policy.html` loaded; production
  `/Privacy%20Policy` returned HTTP 200 and `/Privacy%20Policy.html` returned
  HTTP 308 to `/Privacy Policy`; legal wording was not edited.
- ScoreKeep website results: production team and message JSON passed HTTP/JSON
  checks, 30 teams remain represented, and sampled team files downloaded
  successfully.
- ScoreKeep released-app results: messages loaded, MLB roster list loaded, at
  least one roster downloaded successfully, the downloaded roster imported
  successfully, and no compatibility issue was observed.
- DebtScope manifest results: production manifest passed HTTP/JSON checks and
  active entries included expected iPhone and iPad media URLs.
- DebtScope playback results: help-video categories loaded, active videos were
  selectable, videos played successfully on iPhone, applicable videos played
  successfully on iPad, and no compatibility issue was observed.
- Media URL results: 10 active URLs checked, 10 successful, 0 redirects, 0
  failures; percent-encoded handling for the known literal-space URL succeeded.
- Permanent URL results: production permanent URLs responded as recorded in the
  test record.
- New organized resource URL results:
  `/downloads/scorekeep/scorekeep-manual.pdf` returned HTTP 200,
  `application/pdf`, and `/assets/images/scorekeep.png` returned HTTP 200,
  `image/png`, in local static testing.
- 404 results: local nonexistent URL returned true HTTP 404 from Python's static
  server; Cloudflare Preview 404 behavior remains unavailable.
- Mobile results: manual browser testing passed at approximately 320 px, 375 px,
  and 768 px with no broken responsive behavior observed.
- Desktop results: manual browser testing passed at approximately 1024 px and
  1440 px with no broken desktop layout observed.
- Keyboard results: manual Safari keyboard testing passed with tab highlighting
  enabled, working skip link, visible focus indicators, sensible Tab and
  Shift-Tab order, keyboard-accessible generated roster links, and no keyboard
  trap.
- Browser-console results: manual Safari console testing passed; home reload
  produced no JavaScript errors, ScoreKeep roster divisions loaded, team roster
  links appeared and worked, and anchor scrolling produced no console errors.
- No launch-blocking website or app compatibility issue remains.
- Purchase analytics limitation: controlled POST verification remains blocked;
  only non-mutating HEAD/GET responses were recorded.
- Protected resources remained unchanged.
- Stage 13 remains Not started.

**Suggested commit message**

No commit expected unless fixes are needed.

**Rollback approach**

If preview testing fails, fix or revert the specific stage commit that caused
the issue.

**Cost classification**

Free for expected usage.

---

# Stage 13 - Launch Preparation

**Status:** Ready for Explicit Launch Approval

**Goal**

Prepare for final merge without changing production before explicit approval.

**Prerequisites**

- Stage 12 completed.
- All technical launch blockers resolved or explicitly accepted as deferred
  owner-approved work.

**Tasks**

- [x] Confirm all implementation-plan items intended for launch are complete.
  **Result:** Stages 1 through 12 are complete for the static website launch.
  The unresolved DebtScope purchase-analytics Worker identity and controlled
  POST verification are accepted as deferred work. They do not block the static
  website redesign because this launch includes no API, Worker, routing, or
  application-source changes. `/api/debtscope/purchase-events` will remain
  untouched during the merge.
- [x] Confirm working tree is clean.
  **Result:** Before this Stage 13 synchronization edit, `git status` showed
  only the existing `docs/ImplementationPlan.md` documentation modification and
  no unrelated working-tree changes.
- [x] Confirm all `site-redesign` commits are pushed.
  **Result:** After `git fetch origin`, `git rev-list --left-right --count
  HEAD...@{u}` returned `0 0`. Local `site-redesign` and
  `origin/site-redesign` both point to
  `9b3f479ca73631885d4417d5e2661a14ea6daf83`.
- [x] Review differences between `main` and `site-redesign`.
  **Result:** The branch diff changes the redesigned website pages, adds static
  site directories, adds organized website-only copies of the ScoreKeep image
  and manual, renames `docs/DesignDoc.md` to `docs/Architecture.md`, and updates
  planning documentation. `Teams/`, `videos/`, Worker/API files, root
  `Manual.pdf`, and root `ScoreKeep.png` have no diff. `Privacy Policy.html`
  changed during the redesign and quality review while preserving the
  compatibility file at the root.
- [x] Create a backup or release tag if appropriate.
  **Result:** A pre-launch tag is optional. Recommended tag name remains
  `pre-site-redesign-2026-07-13`, pointing at current `main` commit
  `0c8bc7be1c7913880dca3a898693a7543a68c6d8`. The tag was not created.
- [x] Confirm Cloudflare production branch remains `main`.
  **Result:** Manually verified by the owner in the Cloudflare Pages dashboard.
  The screenshot confirmed the production source branch is `main`, production
  deployment is active, automatic deployments are enabled, `site-redesign`
  preview deployments are being created successfully, and the latest Stage 12
  commit has a successful preview deployment.
- [x] Prepare rollback instructions.
  **Result:** Rollback procedure recorded below.
- [x] Decide the launch commit or merge message.
  **Result:** Merge message is `Merge redesigned website`. A normal merge
  commit preserving stage history is preferred.
- [x] Do not merge until explicit approval.
  **Result:** No merge was performed. `main` remains at
  `0c8bc7be1c7913880dca3a898693a7543a68c6d8`; `origin/main` points to the same
  commit.

**Files affected**

- None expected.
- Possible tag only after approval.

**Compatibility concerns**

- `main` remains deployable and unchanged until launch.
- The unresolved DebtScope purchase-analytics Worker identity, controlled
  production POST verification, accepted payload fields, and unknown-field
  tolerance are accepted as deferred work. They do not block the static website
  redesign because this launch includes no API, Worker, routing, or
  application-source changes. `/api/debtscope/purchase-events` must remain
  untouched during Stage 14. Purchase analytics will be reviewed separately
  after the redesign launches.
- Temporary public access to `docs/` is accepted for this launch. Production
  exclusion remains deferred and will be handled separately after launch. The
  eventual exclusion must keep `docs/` in the repository while preventing it
  from being served publicly. No deployment exclusion or routing change is being
  implemented in Stage 13.

**Tests**

- [x] `git status` shows clean working tree.
  **Result:** Before this synchronization edit, no staged changes or unrelated
  working-tree changes were present. The only modified file was
  `docs/ImplementationPlan.md`.
- [x] Current branch verified.
  **Result:** `git branch --show-current` returned `site-redesign`.
- [x] Branch comparison reviewed.
  **Result:** Local and remote `site-redesign` match. `main` and `origin/main`
  match. The complete `main...site-redesign` diff was reviewed by name, status,
  summary, and stat output.
- [x] Push status verified.
  **Result:** `site-redesign` is even with `origin/site-redesign` after fetch.
- [x] Preview deployment still passes Stage 12 checks.
  **Result:** Cloudflare dashboard manually confirmed successful
  `site-redesign` preview deployments, including a successful preview deployment
  for the latest Stage 12 commit. Stage 12 local, production compatibility,
  manual app, browser, keyboard, and console checks remain the authoritative
  detailed test record.
- [x] Rollback instructions are written and usable.
  **Result:** Rollback procedure recorded below.

**Completion criteria**

- Launch package is ready.
  **Result:** Met.
- No technical or owner-decision blocker remains.
  **Result:** Met. Purchase analytics and temporary public `docs/` exposure are
  accepted as deferred/non-blocking launch decisions.
- Explicit approval to merge `site-redesign` into `main` is the only remaining
  step before Stage 14.
  **Result:** Met.

**Completion results**

- Repository state: current branch is `site-redesign`; before this
  synchronization edit, the only working-tree modification was
  `docs/ImplementationPlan.md` and no unrelated changes were present.
- Remote state: `site-redesign` and `origin/site-redesign` match after
  `git fetch origin`; no local commits remain unpushed.
- Production branch state: local `main` and `origin/main` match at
  `0c8bc7be1c7913880dca3a898693a7543a68c6d8`. No merge was performed.
- Cloudflare production branch: owner manually verified in the Cloudflare Pages
  dashboard that the production source branch is `main`, production deployment
  is active, automatic deployments are enabled, `site-redesign` preview
  deployments are successful, and the latest Stage 12 commit has a successful
  preview deployment.
- Diff summary: changed pages include the root home page, privacy policy,
  product pages, support, downloads, about, and legal. New directories include
  `about/`, `assets/`, `downloads/`, `legal/`, `products/`, and `support/`.
  Website-only resource copies were added at `assets/images/scorekeep.png` and
  `downloads/scorekeep/scorekeep-manual.pdf`. Compatibility resources left
  untouched include `Teams/`, `videos/`, root `Manual.pdf`, root
  `ScoreKeep.png`, and Worker/API files. No unexpected launch files were found.
- Purchase analytics decision: authoritative Worker identification, controlled
  production POST verification, accepted payload fields, and unknown-field
  tolerance remain deferred. These do not block launch because no API, Worker,
  routing, or application-source changes are included. `/api/debtscope/purchase-events`
  remains untouched.
- Internal docs decision: temporary public access to `docs/` is accepted for
  this launch. Production exclusion remains deferred and must later keep
  `docs/` in the repository while preventing public serving.
- Protected resources remain unchanged.
- Release tagging: recommended optional pre-launch tag is
  `pre-site-redesign-2026-07-13` on current `main`. No tag was created.
- Merge strategy: use a normal merge commit preserving stage history.
- Merge message: `Merge redesigned website`.
- Rollback procedure: if launch fails after merge, revert the merge with
  `git revert -m 1 <merge-commit>` and push `main`, or restore the previous
  Cloudflare production deployment for commit
  `0c8bc7be1c7913880dca3a898693a7543a68c6d8` if immediate deployment rollback
  is required. After rollback, verify `/Teams/index.json`,
  `/Teams/message.json`, `/videos/DebtScope-help-videos.json`,
  `/Privacy%20Policy`, `/Manual.pdf`, `/ScoreKeep.png`, and the purchase
  analytics endpoint behavior.
- No merge, push, tag, production deployment, or Cloudflare setting change was
  performed.
- Stage 14 remains `Not started`.
- Explicit owner approval to merge `site-redesign` into `main` is the only
  remaining action.

**Suggested commit message**

No commit expected.

**Rollback approach**

Do not merge until explicit owner approval is given. If launch preparation
finds a new issue, return to the relevant stage.

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

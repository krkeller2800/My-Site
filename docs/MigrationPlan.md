# KomoKode Migration Plan

**Status:** Planning

This document controls the transition from the current KomoKode layout to the redesigned site.

No production file should be moved until its consumers and migration steps are documented here.

---

# Migration Rules

1. Move one service at a time.
2. Update all known consumers before removing an old path.
3. Keep the old path available through a redirect or duplicate file when practical.
4. Test the website and affected apps after every migration.
5. Commit and push each completed migration separately.
6. Do not combine structural moves with visual redesign work.
7. Prefer changes that do not add recurring cost.

# Permanent Compatibility Requirements

The following public URLs, email addresses, deep links, file-format contracts, bundle identifiers, and StoreKit product identifiers are referenced by released applications, App Store metadata, or other production systems. Keep each contract available indefinitely unless a migration strategy has been implemented and verified.

## Public Web and API Endpoints

These are public HTTP(S) URLs used by released apps, website visitors, App Store metadata, or production services. Email addresses, file extensions, bundle identifiers, StoreKit identifiers, and backup filenames are documented in later subsections and are not endpoints.

### Shared

#### `https://komakode.com/`

- Purpose: primary public KomoKode website entry point.
- Consumers: website visitors, search engines, bookmarks, external links, App Store developer or marketing links, and future product pages.
- Compatibility status: **Permanent public website URL**.
- Migration rule: the content may be redesigned completely, but this root URL must continue to serve a valid public website.
- Required schema fields: not applicable.

#### `https://komakode.com/Privacy%20Policy`

- Purpose: permanent app-facing privacy-policy compatibility URL.
- Released application consumers: released ScoreKeep versions; released DebtScope versions; App Store privacy-policy metadata; production applications and website visitors.
- Compatibility status: **Verified permanent compatibility endpoint**; confirmed working on July 11, 2026.
- Related website file URL: `https://komakode.com/Privacy%20Policy.html`.
- Migration rule: keep this extensionless URL permanently available. The `.html` URL is currently used by the website and both URLs should remain available during and after migration unless the `.html` path is deliberately redirected. A canonical future privacy-policy URL is a design decision, not a migration blocker.
- Required schema fields: not applicable.

### ScoreKeep

#### `https://komakode.com/Teams/index.json`

- Purpose: primary roster/team manifest fetched by ScoreKeep and used by the website to generate team download links.
- Released application consumers: released ScoreKeep versions.
- Compatibility status: **Permanent compatibility endpoint**.
- Migration rule: keep this URL live through duplicate content, stable routing, or redirects. Individual team-file URLs may change through `teams[].url` only after replacement files are deployed and legacy URLs are redirected or duplicated.
- Required JSON schema fields: `updated`, `divisions`, `divisions[].name`, `divisions[].teams`, `teams[].name`, and `teams[].url`.

#### `https://komakode.com/Teams/message.json`

- Purpose: remote announcement/message feed for ScoreKeep.
- Released application consumers: released ScoreKeep versions.
- Compatibility status: **Permanent compatibility endpoint**.
- Migration rule: keep this URL live and preserve the message schema. The feed may contain the ScoreKeep app deep link documented below.
- Required JSON schema fields: `messages`, `ctaTitle`, `ctaURL`, `title`, `body`, `start`, and `end`.

### DebtScope

#### `https://komakode.com/videos/DebtScope-help-videos.json`

- Purpose: remote help-video manifest used to populate DebtScope help videos and resolve playable video URLs.
- Released application consumers: released DebtScope versions.
- Compatibility status: **Permanent compatibility endpoint**.
- Migration rule: keep this exact URL available through stable routing, duplicate content, or redirects. If media moves, update manifest URL fields only after new media URLs are deployed and old media URLs redirect or duplicate.
- Required JSON schema fields and accepted URL shapes: `id`, `title`, `subtitle`, `duration`, `durationSeconds`, `seconds`, `url`, `urls`, `urls.iphone`, `urls.ipad`, `iphoneURL`, and `ipadURL`.

#### `https://komakode.com/api/debtscope/purchase-events`

- Purpose: purchase analytics ingestion endpoint.
- Released application consumers: released DebtScope versions when purchase analytics is enabled.
- Compatibility status: **Permanent compatibility endpoint**.
- Migration rule: keep this exact URL available or redirect POST traffic compatibly. Backend changes must wait until the authoritative purchase-analytics Worker is identified.
- Required request schema fields accepted from DebtScope: `installId`, `sessionId`, `eventName`, `paywallSource`, `purchaseResult`, `productLoadResult`, `productLoadState`, `storefrontCountry`, `appVersion`, `buildNumber`, `platform`, `osVersion`, and `channel`. The backend should ignore unknown fields and keep existing fields accepted.

## Contact Addresses

### `comment@KomaKode.com`

- Purpose: ScoreKeep mailto request link.
- Released application consumers: released ScoreKeep versions.
- Compatibility status: **Permanent contact-address contract**.
- Migration rule: keep this mailbox functional or forward it to a replacement mailbox.

### `support@komakode.com`

- Purpose: DebtScope support link, currently used through `mailto:support@komakode.com?subject=Debt%20Scope%20support`.
- Released application consumers: released DebtScope versions.
- Compatibility status: **Permanent contact-address contract**.
- Migration rule: keep this mailbox functional or forward it to a replacement mailbox.

## Deep-Link Contracts

### `scorekeep://share?tab=download`

- Purpose: ScoreKeep call-to-action deep link from `Teams/message.json`.
- Released application consumers: released ScoreKeep versions.
- Compatibility status: **Permanent deep-link contract**.
- Existing contract: `scorekeep://share?tab=download`, with optional `prefill` query behavior.
- Migration rule: keep this route stable; add new query parameters only as optional and preserve existing optional `prefill` behavior.

## File and Import Compatibility Contracts

These contracts are file formats, filenames, extensions, and document types. They are not endpoints.

### ScoreKeep

- `.ScoreKeep_Players`
  - Purpose: imported/exported player roster files and downloaded team files.
  - Released application consumers: released ScoreKeep versions.
  - Compatibility status: **Permanent file-format contract**.
  - Migration rule: keep the extension and JSON file format supported.
- `.ScoreKeep_Games`
  - Purpose: imported/exported game files and the bundled seeded game.
  - Released application consumers: released ScoreKeep versions.
  - Compatibility status: **Permanent file-format contract**.
  - Migration rule: keep the extension and file format supported.
- Existing ScoreKeep document UTIs
  - Purpose: system document handoff for ScoreKeep player roster and game files.
  - Released application consumers: released ScoreKeep versions and iOS document-opening behavior.
  - Compatibility status: **Permanent document-type contract** for existing app declarations.
  - Migration rule: keep existing declared ScoreKeep document UTIs unchanged unless a ScoreKeep app update includes a compatibility and document-handoff migration.

### DebtScope

- `manifest.json`
  - Purpose: backup package manifest filename.
  - Released application consumers: released DebtScope versions.
  - Compatibility status: **Permanent backup-file contract**.
  - Migration rule: keep the filename supported; duplicate support rather than replacing it if adding a new name.
- `.dsbackup`
  - Purpose: DebtScope backup package filename extension.
  - Released application consumers: released DebtScope versions.
  - Compatibility status: **Permanent backup-file contract**.
  - Migration rule: keep import/export support.
- `.ambackup`
  - Purpose: legacy Aware Money-style backup filename extension.
  - Released application consumers: released DebtScope versions.
  - Compatibility status: **Permanent backup-file contract**.
  - Migration rule: keep import support.
- `.debtscopebackup`
  - Purpose: DebtScope backup filename extension.
  - Released application consumers: released DebtScope versions.
  - Compatibility status: **Permanent backup-file contract**.
  - Migration rule: keep import/export support.
- DebtScope backup UTIs: `com.komakode.debtscope.backup`, `com.komakode.debtscope.backup-package`
  - Purpose: system document handoff for single-file and package backups.
  - Released application consumers: released DebtScope versions and iOS document-opening behavior.
  - Compatibility status: **Permanent document-type contract**.
  - Migration rule: keep old UTIs.
- Financial import UTIs: `com.komakode.ofx`, `com.komakode.qfx`, `com.komakode.qif`
  - Purpose: financial import document handoff for OFX, QFX, and QIF files.
  - Released application consumers: released DebtScope versions and iOS document-opening behavior.
  - Compatibility status: **Permanent document-type contract**.
  - Migration rule: keep unless replacing import UTIs with a documented compatibility strategy.

## App and Store Identifiers

These are app identity and purchase contracts. They are not endpoints.

### ScoreKeep

- Existing verified ScoreKeep bundle, StoreKit, and UTI identifiers should be preserved where changing them would break released versions or App Store configuration.
- Exact ScoreKeep bundle identifier, StoreKit identifier, and document UTI values only need to be added to this plan if a future change proposes modifying them. They are not active website migration blockers.

### DebtScope

#### `com.komakode.awaremoney`

- Identifier type: bundle identifier.
- Purpose: installed-app identity and App Store/app update continuity.
- Released application consumers: released DebtScope/Aware Money installations and App Store configuration.
- Compatibility status: **Permanent bundle identifier contract**.
- Migration rule: keep the old bundle ID. Changing it would create a different app identity and requires a separate App Store migration strategy.

#### `com.komakode.awaremoney.lifetime`

- Identifier type: StoreKit product identifier.
- Purpose: lifetime non-consumable purchase.
- Released application consumers: released DebtScope versions.
- Compatibility status: **Permanent StoreKit product identifier contract**.
- Migration rule: keep the product active in App Store Connect. Changing this identifier requires a DebtScope app update and a purchase migration strategy.

# Phase 1 — Inventory and Verification

Status: **Substantially complete.**

All known production resources, compatibility contracts, and application consumers have been documented.

Remaining work is limited to the unresolved investigation items listed near the end of this document.

Document the exact current paths and consumers for:

- Privacy policy
- ScoreKeep manual
- ScoreKeep `Teams/index.json`
- ScoreKeep `Teams/message.json`
- Importable ScoreKeep team files
- DebtScope help-video JSON file
- DebtScope video files
- Images and other shared media

For each item, record:

- Current repository path
- Current public URL
- Consumer
- Proposed destination
- Required code changes
- Compatibility risk
- Test procedure

---

# Phase 2 — Documentation

Status: **Completed**

Internal project documentation now resides under:

```text
docs/
├── Architecture.md
├── CurrentState.md
└── MigrationPlan.md
```

# Phase 3 — Website Architecture

Status: **Not started**

Purpose:

Design the target KomoKode website before any production resources are moved.

This phase should define:

- target directory structure
- public URL strategy
- Cloudflare Pages routing
- redirect strategy
- permanent compatibility URLs
- placement of website assets
- placement of APIs
- placement of downloadable resources
- placement of media
- deployment strategy

The output of this phase will be:

```text
docs/WebsiteArchitecture.md
```

# Phase 4 — Implementation

Status: **Not started**

Purpose:

Execute the approved website architecture one migration at a time.

Implementation should:

- follow the migration rules in this document
- migrate one service at a time
- verify compatibility after every migration
- commit each completed migration separately
- avoid mixing redesign work with compatibility work

The output of this phase will be:

```text
docs/ImplementationPlan.md
```

---

# Production Resource Inventory

This section documents hard-coded paths, URLs, fetch targets, download links, image references, JSON files, PDFs, media manifests, media files, and other externally referenced resources found in the current repository.

Primary files reviewed:

- `index.html`
- `Privacy Policy.html`
- `Teams/index.json`
- `Teams/message.json`
- `videos/help-videos.json`
- `videos/DebtScope-help-videos.json`
- `docs/CurrentState.md`
- `docs/Architecture.md`

The primary public website URL is `https://komakode.com/` based on the absolute URLs in `Teams/index.json` and current documentation. Exact deployment aliases, direct file URLs, and redirects are Needs Investigation.

---

## Website Entry Point

### Home Page

- Current repository path: `index.html`
- Primary public URL: `https://komakode.com/`
- Direct file URL, if exposed by Cloudflare Pages: `https://komakode.com/index.html`
- Consumer(s): Website visitors
- App-facing or website-only: Website-only
- Compatibility class: Permanent public URL for `https://komakode.com/`; Website-only direct file URL for `https://komakode.com/index.html`, exposure **Needs Investigation**
- Proposed migration destination: Needs Investigation
- Files or applications requiring updates if moved: Cloudflare Pages routing or redirects; any external bookmarks or links are Needs Investigation
- Compatibility concerns: Root URL must continue to serve a valid public website. Direct `index.html` exposure must be confirmed before relying on or redirecting that URL.
- Recommended migration order: Migrate after app-facing production services are documented and protected.

### Hard-Coded Resources Referenced by `index.html`

`index.html` currently contains:

- Inline stylesheet: website-only CSS embedded in `index.html`; no external stylesheet file is referenced.
- Inline script: website-only JavaScript embedded in `index.html`; no external script file is referenced.
- Privacy policy link: `Privacy%20Policy.html`
- ScoreKeep image reference: `ScoreKeep.png`
- ScoreKeep manual download link: `Manual.pdf`
- ScoreKeep team manifest fetch target: `Teams/index.json`
- Team download links: generated from `team.url` values loaded from `Teams/index.json`

No external CSS or JavaScript URLs were found in `index.html`.

---

## Privacy Policy

- Current repository path: `Privacy Policy.html`
- Existing website file URL: `https://komakode.com/Privacy%20Policy.html`
- Permanent app-facing compatibility URL: `https://komakode.com/Privacy%20Policy`
- Consumer(s): `index.html`; App Store; released DebtScope versions; released ScoreKeep versions; PlateWise users; future applications, per `docs/CurrentState.md`
- App-facing or website-only: App-facing
- Compatibility class: Permanent app contract for the extensionless URL; website-only/current website file path for the `.html` URL
- Proposed migration destination: Needs Investigation
- Files or applications requiring updates if moved: `index.html`; App Store privacy URL configuration; DebtScope; ScoreKeep; PlateWise; any future applications that link to this policy
- Compatibility concerns: The extensionless URL is a verified permanent compatibility endpoint used by released ScoreKeep and DebtScope versions. The `.html` URL is currently used by the website. Both URLs should remain available during and after migration unless the `.html` path is deliberately redirected. The filename contains a space and is URL-encoded in `index.html`. The canonical future privacy-policy URL is a design decision, not a migration blocker.
- Recommended migration order: Keep both current URLs available before redesigning or moving the policy page.

### Privacy Policy Embedded and External References

- Embedded data URI image:
  - Current repository path: Embedded inside `Privacy Policy.html`
  - Current public URL: Not separately addressable
  - Consumer(s): Privacy policy page
  - App-facing or website-only: Website-only presentation asset inside an app-facing page
  - Proposed migration destination: Needs Investigation
  - Files or applications requiring updates if moved: `Privacy Policy.html`
  - Compatibility concerns: If extracted to a file, the new file path must be deployed and referenced from the privacy policy page.
  - Recommended migration order: Leave embedded unless the privacy policy page is redesigned.

- External legal/regulatory links:
  - Current repository path: Not in repository
  - Current public URLs:
    - `https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm`
    - `https://ico.org.uk/make-a-complaint/data-protection-complaints/data-protection-complaints/`
    - `https://www.edoeb.admin.ch/edoeb/en/home.html`
  - Consumer(s): Privacy policy page visitors
  - App-facing or website-only: Website-only links inside an app-facing page
  - Proposed migration destination: No migration destination; external references
  - Files or applications requiring updates if moved: `Privacy Policy.html`
  - Compatibility concerns: External URLs may change outside repository control.
  - Recommended migration order: Verify as part of privacy policy review.

---

## ScoreKeep Manual

- Current repository path: `Manual.pdf`
- Current public URL: `https://komakode.com/Manual.pdf`
- Consumer(s): `index.html`; website visitors. ScoreKeep source-code inventory verified that the app uses its bundled `Reporting/Manual.pdf`, not the KomoKode-hosted PDF.
- App-facing or website-only: Website-only for the KomoKode-hosted PDF based on repository references and ScoreKeep source-code inventory.
- Compatibility class: Website-only
- Proposed migration destination: Needs Investigation
- Files or applications requiring updates if moved: `index.html`
- Compatibility concerns: **Verified: the KomoKode-hosted `Manual.pdf` has no released ScoreKeep runtime dependency.** Existing website download URL should remain available or redirect. PDF filename is simple and currently linked directly from the home page. Changing the bundled ScoreKeep manual requires an app update, but does not depend on this website file.
- Recommended migration order: Migrate with website download links after app-facing endpoints are protected.

---

## ScoreKeep Image

- Current repository path: `ScoreKeep.png`
- Current public URL: `https://komakode.com/ScoreKeep.png`
- Consumer(s): `index.html`
- App-facing or website-only: Website-only
- Compatibility class: Website-only
- Proposed migration destination: Needs Investigation
- Files or applications requiring updates if moved: `index.html`
- Compatibility concerns: Direct image URL may be bookmarked or indexed, but no app-facing consumer was found in this repository.
- Recommended migration order: Can migrate with website redesign after app-facing resources are protected.

---

## ScoreKeep Team Distribution Service

### Team Manifest

- Current repository path: `Teams/index.json`
- Current public URL: `https://komakode.com/Teams/index.json`
- Consumer(s): `index.html`; released ScoreKeep app versions
- App-facing or website-only: App-facing
- Compatibility class: Permanent app contract
- Proposed migration destination: Keep current public URL stable as a **Permanent Compatibility Endpoint**; internal file reorganization may happen only if routing preserves this URL.
- Files or applications requiring updates if moved: `index.html`; ScoreKeep app update would be required only if this manifest endpoint or schema changes. Individual team-file URLs can change through `teams[].url` values without a ScoreKeep app update.
- Compatibility concerns: Production API. Schema, field names, and current URL should remain backward compatible. Released ScoreKeep versions hard-code this exact manifest URL. `index.html` also uses `team.url` directly and preserves the filename for downloads.
- Recommended migration order: Protect before moving any team files. If a new location is introduced, keep this manifest URL available first, then update `teams[].url` values and website consumers.

### Team Message Manifest

- Current repository path: `Teams/message.json`
- Current public URL: `https://komakode.com/Teams/message.json`
- Consumer(s): released ScoreKeep app versions
- App-facing or website-only: App-facing
- Compatibility class: Permanent app contract
- Proposed migration destination: Keep current public URL stable as a **Permanent Compatibility Endpoint**; internal file reorganization may happen only if routing preserves this URL.
- Files or applications requiring updates if moved: ScoreKeep
- Compatibility concerns: Production API. Existing schema should remain backward compatible. Released ScoreKeep versions hard-code this exact message URL. Contains app deep link `scorekeep://share?tab=download`.
- Recommended migration order: Migrate only after `Teams/index.json` compatibility is protected and ScoreKeep app behavior is verified.

### ScoreKeep App Deep Link

- Current repository path: `Teams/message.json`
- Current public URL: `scorekeep://share?tab=download`
- Consumer(s): ScoreKeep
- App-facing or website-only: App-facing
- Compatibility class: Permanent app contract
- Proposed migration destination: No website migration destination; app URL scheme
- Files or applications requiring updates if moved: ScoreKeep; `Teams/message.json`
- Compatibility concerns: Changing this value may break the call to action in existing ScoreKeep versions.
- Recommended migration order: Do not change during website migration unless ScoreKeep app support is confirmed.

### Importable Team Files

All current team files are app-facing production data. They are consumed by `index.html` through generated download links from `Teams/index.json` and by ScoreKeep, per `docs/CurrentState.md`.

- Current repository paths and public URLs:
  - `Teams/Angels.ScoreKeep_Players` -> `https://komakode.com/Teams/Angels.ScoreKeep_Players`
  - `Teams/Astros.ScoreKeep_Players` -> `https://komakode.com/Teams/Astros.ScoreKeep_Players`
  - `Teams/Athletics.ScoreKeep_Players` -> `https://komakode.com/Teams/Athletics.ScoreKeep_Players`
  - `Teams/Blue Jays.ScoreKeep_Players` -> `https://komakode.com/Teams/Blue Jays.ScoreKeep_Players`
  - `Teams/Braves.ScoreKeep_Players` -> `https://komakode.com/Teams/Braves.ScoreKeep_Players`
  - `Teams/Brewers.ScoreKeep_Players` -> `https://komakode.com/Teams/Brewers.ScoreKeep_Players`
  - `Teams/Cardinals.ScoreKeep_Players` -> `https://komakode.com/Teams/Cardinals.ScoreKeep_Players`
  - `Teams/Cubs.ScoreKeep_Players` -> `https://komakode.com/Teams/Cubs.ScoreKeep_Players`
  - `Teams/Diamondbacks.ScoreKeep_Players` -> `https://komakode.com/Teams/Diamondbacks.ScoreKeep_Players`
  - `Teams/Dodgers.ScoreKeep_Players` -> `https://komakode.com/Teams/Dodgers.ScoreKeep_Players`
  - `Teams/Giants.ScoreKeep_Players` -> `https://komakode.com/Teams/Giants.ScoreKeep_Players`
  - `Teams/Guardians.ScoreKeep_Players` -> `https://komakode.com/Teams/Guardians.ScoreKeep_Players`
  - `Teams/Mariners.ScoreKeep_Players` -> `https://komakode.com/Teams/Mariners.ScoreKeep_Players`
  - `Teams/Marlins.ScoreKeep_Players` -> `https://komakode.com/Teams/Marlins.ScoreKeep_Players`
  - `Teams/Mets.ScoreKeep_Players` -> `https://komakode.com/Teams/Mets.ScoreKeep_Players`
  - `Teams/Nationals.ScoreKeep_Players` -> `https://komakode.com/Teams/Nationals.ScoreKeep_Players`
  - `Teams/Orioles.ScoreKeep_Players` -> `https://komakode.com/Teams/Orioles.ScoreKeep_Players`
  - `Teams/Padres.ScoreKeep_Players` -> `https://komakode.com/Teams/Padres.ScoreKeep_Players`
  - `Teams/Phillies.ScoreKeep_Players` -> `https://komakode.com/Teams/Phillies.ScoreKeep_Players`
  - `Teams/Pirates.ScoreKeep_Players` -> `https://komakode.com/Teams/Pirates.ScoreKeep_Players`
  - `Teams/Rangers.ScoreKeep_Players` -> `https://komakode.com/Teams/Rangers.ScoreKeep_Players`
  - `Teams/Rays.ScoreKeep_Players` -> `https://komakode.com/Teams/Rays.ScoreKeep_Players`
  - `Teams/Red Sox.ScoreKeep_Players` -> `https://komakode.com/Teams/Red Sox.ScoreKeep_Players`
  - `Teams/Reds.ScoreKeep_Players` -> `https://komakode.com/Teams/Reds.ScoreKeep_Players`
  - `Teams/Rockies.ScoreKeep_Players` -> `https://komakode.com/Teams/Rockies.ScoreKeep_Players`
  - `Teams/Royals.ScoreKeep_Players` -> `https://komakode.com/Teams/Royals.ScoreKeep_Players`
  - `Teams/Tigers.ScoreKeep_Players` -> `https://komakode.com/Teams/Tigers.ScoreKeep_Players`
  - `Teams/Twins.ScoreKeep_Players` -> `https://komakode.com/Teams/Twins.ScoreKeep_Players`
  - `Teams/White Sox.ScoreKeep_Players` -> `https://komakode.com/Teams/White Sox.ScoreKeep_Players`
  - `Teams/Yankees.ScoreKeep_Players` -> `https://komakode.com/Teams/Yankees.ScoreKeep_Players`
- Compatibility class: Permanent app contract
- Proposed migration destination: Team-file locations may change if `Teams/index.json` remains available and each `teams[].url` points to the new file location. Keep current public file URLs redirected or duplicated for legacy safety.
- Files or applications requiring updates if moved: `Teams/index.json`; `index.html`. ScoreKeep app update is not required for individual team-file moves if the manifest endpoint and schema remain compatible.
- Compatibility concerns: Production data. Existing filenames, `.ScoreKeep_Players` extension, JSON file format, spaces in filenames, and absolute URLs should remain compatible with released ScoreKeep versions. If files move, redirects or duplicates should preserve the exact current URLs for older clients and cached/shared links.
- Recommended migration order: Keep `Teams/index.json` stable first. Introduce redirects or duplicate files before changing manifest URLs, then update `teams[].url` values.

---

# ScoreKeep Source-Code URL Inventory

The ScoreKeep source-code inventory was completed from the app project and should be treated as authoritative for released-app compatibility concerns.

## Permanent Compatibility Endpoint: `https://komakode.com/Teams/index.json`

- Source-code reference: `ScoreKeep/ScoreKeep/Sharing Data/ShareContentView.swift`, `ShareContentView.getFileNames()`.
- Purpose: primary roster/team manifest fetched by ScoreKeep.
- Dependency status: **Permanent Compatibility Endpoint**.
- Compatibility requirement: released ScoreKeep versions will continue requesting this exact URL unless users install an app update.
- Migration rule: keep this URL live through duplicate content, stable routing, or redirects. Preserve the manifest schema used by the app: `updated`, `divisions`, `divisions[].name`, `divisions[].teams`, `teams[].name`, and `teams[].url`.

## Permanent Compatibility Endpoint: `https://komakode.com/Teams/message.json`

- Source-code reference: `ScoreKeep/ScoreKeep/Sharing Data/AnnouncementCenter.swift`, `AnnouncementCenter.messagesURL`.
- Purpose: remote announcement/message feed.
- Dependency status: **Permanent Compatibility Endpoint**.
- Compatibility requirement: released ScoreKeep versions will continue requesting this exact URL unless users install an app update.
- Migration rule: keep this URL live and preserve the message schema fields used by the app: `messages`, `ctaTitle`, `ctaURL`, `title`, `body`, `start`, and `end`.

## Permanent Compatibility Endpoint: `https://komakode.com/Privacy%20Policy`

- Source-code reference: `ScoreKeep/ScoreKeep/Common/PaywallView.swift`, `PaywallView.privacyURL`.
- Purpose: paywall Privacy Policy link.
- Dependency status: **Permanent Compatibility Endpoint**.
- Compatibility requirement: released ScoreKeep versions open this exact URL.
- Migration rule: keep this URL resolving correctly to the deployed privacy-policy page. If the canonical page remains `Privacy%20Policy.html`, add or preserve routing from extensionless `/Privacy%20Policy`.

## Team Download URL Indirection

- ScoreKeep does not hard-code individual team file URLs in current source.
- ScoreKeep gets individual team download URLs from `teams[].url` in `Teams/index.json`.
- Individual team-file locations can therefore change without a ScoreKeep app update, provided `https://komakode.com/Teams/index.json` remains available and the manifest schema remains compatible.
- Recommended approach: update `teams[].url` only after the new files are deployed, and keep redirects or duplicate files at old team URLs for legacy safety.

## Local Manual Behavior

- `Manual.pdf` is bundled locally inside ScoreKeep at `ScoreKeep/ScoreKeep/Reporting/Manual.pdf`.
- ScoreKeep loads the bundled PDF through `Bundle.main.url(forResource: "Manual", withExtension: "pdf")`.
- ScoreKeep does not download `Manual.pdf` from KomoKode.com.
- **Verified: the KomoKode-hosted `Manual.pdf` has no released ScoreKeep runtime dependency.**
- The website-hosted `https://komakode.com/Manual.pdf` is still a website-only download resource.

## Negative Findings

- No `media.komakode.com` references were found in ScoreKeep app source.
- No standalone hard-coded `https://komakode.com/` home-page link was found in ScoreKeep app source.

## Legacy and Compatibility Contracts

- Legacy `Teams/` parsing code exists in `ScoreKeep/ScoreKeep/Sharing Data/DownloadFiles.swift` inside `DownloadFiles.fetchFileList(from:)`, but no active caller was found in the current ScoreKeep source.
- `.ScoreKeep_Players` is a compatibility contract for imported/exported player roster files and downloaded team files. Keep it supported.
- `.ScoreKeep_Games` is a compatibility contract for imported/exported game files and the bundled seeded game. Keep it supported.
- `scorekeep://share?tab=download` is a compatibility contract for ScoreKeep deep links, including optional `prefill` query behavior. Keep this route stable; add new query parameters only as optional.
- `comment@KomaKode.com` is used by released ScoreKeep versions through a `mailto:` request link. Keep the address functional or forward it elsewhere.

---

# DebtScope Source-Code URL Inventory

The DebtScope source-code URL inventory was completed on July 11, 2026 and should be treated as authoritative for released DebtScope app compatibility concerns. It verified app code, project/config files, plists, scripts/docs, Cloudflare worker code/config, JSON-like manifests, and resource metadata in the DebtScope project. Dependency trees, package lock registry URLs, generated build artifacts, and vendored `node_modules` references were treated as noise unless they directly configured DebtScope endpoints.

## Direct DebtScope Findings

- Exact help-video manifest URL currently used by DebtScope: `https://komakode.com/videos/DebtScope-help-videos.json`.
- `videos/DebtScope-help-videos.json` is used by DebtScope.
- `videos/help-videos.json` is not used by DebtScope.
- DebtScope does not hard-code any direct video `.mp4` URLs. Video URLs are supplied by the help-video manifest.
- DebtScope does not directly reference `media.komakode.com`.
- DebtScope uses privacy-policy URL `https://komakode.com/Privacy%20Policy`.
- DebtScope uses support email link `mailto:support@komakode.com?subject=Debt%20Scope%20support`.
- DebtScope does not reference a KomoKode home page, web support page, or product page.
- No old Aware Money web URLs were found in DebtScope.
- Legacy Aware Money identifiers remain in Xcode product/scheme metadata, bundle identifiers, and StoreKit product ID.
- `Info.plist` contains document UTIs and file-extension handling, but no remote URLs, associated domains, or URL schemes. No tracked `.entitlements` or `.storekit` file was found.

## Verified DebtScope Dependencies

| Reference | Source file | Line | Function, property, or type | Purpose | Kind | App update required to change? | Older released versions continue old location? | Recommended compatibility approach |
|---|---:|---:|---|---|---|---|---|---|
| `https://komakode.com/videos/DebtScope-help-videos.json` | `DebtScope/View/HelpVideosView.swift` | 120 | `HelpVideosViewModel.feedURL` | Remote help-video manifest | Hard-coded directly | Yes | Yes | Keep old URL, or redirect if moved |
| `URLSession.shared.data(from: feedURL)` | `DebtScope/View/HelpVideosView.swift` | 127 | `HelpVideosViewModel.loadVideos()` | Fetches help-video metadata | Constructed from hard-coded URL | Yes | Yes | Keep old URL and JSON shape |
| `id`, `title`, `subtitle`, `duration`, `durationSeconds`, `seconds`, `url`, `urls`, `iphoneURL`, `ipadURL` | `DebtScope/View/HelpVideosView.swift` | 19-24 | `HelpVideo.CodingKeys`, `HelpVideo.URLKeys` | Manifest schema for entries and video URLs | Loaded from JSON manifest | Yes, for schema changes | Yes | Keep schema backward compatible |
| `url` | `DebtScope/View/HelpVideosView.swift` | 34-38 | `HelpVideo.init(from:)` | Legacy universal video URL fallback | Loaded from JSON manifest | No if preserved | Yes | Keep field support |
| `urls.iphone`, `urls.ipad` | `DebtScope/View/HelpVideosView.swift` | 40-42 | `HelpVideo.init(from:)` | Recommended device-specific video URLs | Loaded from JSON manifest | No if preserved | Yes | Keep field support |
| `iphoneURL`, `ipadURL` | `DebtScope/View/HelpVideosView.swift` | 43-45 | `HelpVideo.init(from:)` | Alternate device-specific video URL shape | Loaded from JSON manifest | No if preserved | Yes | Keep field support |
| `urlForCurrentDevice` fallback order | `DebtScope/View/HelpVideosView.swift` | 85-99 | `HelpVideo.urlForCurrentDevice` | Chooses iPad/iPhone/universal video URL | Loaded from JSON manifest | Yes, for resolver behavior | Yes | Preserve at least one usable URL per video |
| `AVURLAsset(url: url)` | `DebtScope/View/HelpVideosView.swift` | 176-179 | `HelpVideosViewModel.loadAssetDuration(from:)` | Loads remote media duration when manifest duration is absent | Constructed dynamically from manifest URL | Yes | Yes | Include `durationSeconds` to avoid duration probing, or keep media URLs reachable |
| `AVPlayer(url: resolvedURL)` | `DebtScope/View/HelpVideosView.swift` | 431-440 | `HelpVideosView.preparePlayer(for:)` | Streams selected help video | Loaded from JSON manifest | Yes | Yes | Keep video URLs stable or redirect |
| `https://komakode.com/api/debtscope/purchase-events` | `DebtScope/Models/PurchaseAnalytics.swift` | 207 | `PurchaseAnalyticsClient.defaultEndpointURL` | Purchase analytics ingestion endpoint | Hard-coded directly | Yes | Yes | Keep old URL or redirect |
| `URLRequest(url: endpointURL)` | `DebtScope/Models/PurchaseAnalytics.swift` | 254-258 | `PurchaseAnalyticsClient.send(_:)` | Sends analytics POST as JSON | Constructed dynamically from endpoint URL | Yes | Yes | Maintain endpoint and JSON contract |
| `installId`, `sessionId`, `eventName`, `paywallSource`, `purchaseResult`, `productLoadResult`, `productLoadState`, `storefrontCountry`, `appVersion`, `buildNumber`, `platform`, `osVersion`, `channel` | `DebtScope/Models/PurchaseAnalytics.swift` | 45-59 | `PurchaseAnalyticsEvent` | Remote purchase analytics JSON payload schema | JSON encoded by app | Yes, for app-side additions/removals | Yes | Backend should ignore unknown fields and keep existing fields accepted |
| `mailto:support@komakode.com?subject=Debt%20Scope%20support` | `DebtScope/View/AboutView.swift` | 37 | `AboutView.supportURL` | Support link in About | Hard-coded directly | Yes | Yes | Keep mailbox or forward |
| `https://komakode.com/Privacy%20Policy` | `DebtScope/View/AboutView.swift` | 38 | `AboutView.privacyPolicyURL` | Privacy Policy link in About | Hard-coded directly | Yes | Yes | Keep old URL or redirect |
| `https://www.apple.com/legal/internet-services/itunes/dev/stdeula/` | `DebtScope/View/AboutView.swift` | 39 | `AboutView.termsOfUseURL` | Standard Apple terms link | Hard-coded directly | Yes | Yes | Keep unless changing legal terms |
| `UIApplication.shared.open(url...)` | `DebtScope/View/AboutView.swift` | 127-128 | `AboutView.LinkButton.openURL(_:)` | Opens support, privacy, and terms URLs | Constructed dynamically from hard-coded URLs | Yes | Yes | Keep linked targets reachable |
| `com.komakode.awaremoney.lifetime` | `DebtScope/Models/PurchaseManager.swift` | 95-96 | `PurchaseManager.productID` | StoreKit non-consumable product ID | Hard-coded configuration | Yes | Yes | Keep product ID active; do not rename without migration strategy |
| `com.komakode.awaremoney` | `DebtScope.xcodeproj/project.pbxproj` | 386, 423 | Build setting `PRODUCT_BUNDLE_IDENTIFIER` | App bundle identifier | Loaded from project configuration | Yes | Installed apps remain tied to old bundle ID | Keep old bundle ID |
| `awaremoney` / `awaremoneyTests` product metadata | `DebtScope.xcodeproj/project.pbxproj`; `DebtScope.xcodeproj/xcshareddata/xcschemes/awaremoney.xcscheme` | 15, 132, 152; 19-21, 39-41, 61-63, 85-87 | Xcode project/scheme metadata | Legacy internal product/scheme names | Loaded from project configuration | Yes | No endpoint impact | Update app/project only if desired |
| `com.komakode.ofx`, `com.komakode.qfx`, `com.komakode.qif` | `DebtScope/Info.plist` | 20-22, 119, 142, 161 | `CFBundleDocumentTypes`, `UTImportedTypeDeclarations` | Financial import document UTIs | Loaded from Info.plist | Yes | Yes, for document handoff | Keep unless replacing import UTIs |
| `com.komakode.debtscope.backup` | `DebtScope/Info.plist`; `DebtScope/Backup/UTTypes+DebtScope.swift` | 34, 71; 10, 18 | Backup document UTI | Single-file backup type | Loaded from Info.plist and code fallback | Yes | Yes | Keep old UTI |
| `com.komakode.debtscope.backup-package` | `DebtScope/Info.plist`; `DebtScope/Backup/UTTypes+DebtScope.swift` | 46, 95; 22, 28 | Backup package UTI | Package backup type | Loaded from Info.plist and code fallback | Yes | Yes | Keep old UTI |
| `ambackup`, `debtscopebackup` | `DebtScope/Info.plist`; `DebtScope/Backup/UTTypes+DebtScope.swift` | 74-78; 31-34 | `UTTypeTagSpecification`, `debtScopeBackupExtensions` | Backup filename extensions, including legacy Aware Money-style extension | Loaded from Info.plist/configuration | Yes | Yes | Keep old extensions |
| `dsbackup` | `DebtScope/Info.plist`; `DebtScope/Backup/UTTypes+DebtScope.swift` | 98-101; 31-34 | `UTTypeTagSpecification`, `debtScopeBackupExtensions` | Backup package filename extension | Loaded from Info.plist/configuration | Yes | Yes | Keep |
| `.json` file-open fallback | `DebtScope/DebtScopeApp.swift`; `DebtScope/Backup/BackupRestoreView.swift` | 181-184; 199-201 | `DebtScopeApp.body`, `BackupRestoreView.isSupportedRestoreURL(_:)` | Allows single-file backup JSON restore | Hard-coded extension check | Yes | Yes | Keep if supporting raw backup JSON |
| `manifest.json` | `DebtScope/Backup/BackupExporter.swift`; `DebtScope/Backup/BackupImporter.swift`; `DebtScope/Backup/BackupRestorePreflight.swift` | 467, 480-481; 60, 63, 69; 140, 147 | Backup package exporter/importer/preflight | Backup package manifest filename | Hard-coded directly | Yes | Yes | Keep old filename; duplicate only if adding a new name |
| `onOpenURL { url in ... }` | `DebtScope/DebtScopeApp.swift` | 171-190 | `DebtScopeApp.body` | Handles file-open/deep-link style app launches for backups/imports | Constructed dynamically from system-provided file URLs | Yes | Yes | Keep backward-compatible file handling |

## DebtScope Help Video Service

### DebtScope Help Video Manifest

- Current repository path: `videos/DebtScope-help-videos.json`
- Current public URL: `https://komakode.com/videos/DebtScope-help-videos.json`
- Consumer(s): released DebtScope versions, verified in source code
- App-facing or website-only: App-facing
- Compatibility class: Permanent app contract
- Proposed migration destination: Keep current public URL stable as a **Permanent Compatibility Endpoint**; internal file reorganization may happen only if routing preserves this URL.
- Files or applications requiring updates if moved: DebtScope app update required if the endpoint changes without a redirect or compatible duplicate.
- Compatibility concerns: Production API. Schema and current manifest URL must remain backward compatible. DebtScope source does not directly reference `media.komakode.com`; video URLs are read from this manifest.
- Required manifest fields and compatibility shapes:
  - Required entry fields: `id`, `title`
  - Optional display fields: `subtitle`, `duration`, `durationSeconds`, `seconds`
  - Video URL fields: legacy `url`, recommended `urls.iphone` / `urls.ipad`, explicit `iphoneURL` / `ipadURL`
- Recommended migration order: Keep old manifest URL available first. If media moves, update manifest URL fields only after the new media URLs are deployed and old media URLs redirect or duplicate.

### Legacy Aware Money Help Video Manifest

- Current repository path:
  - `videos/help-videos.json`
- Current public URL:
  - `https://komakode.com/videos/help-videos.json`
- Original consumer:
  - Aware Money
- Current consumer:
  - None
- Compatibility class: Legacy retired resource
- Status:
  - **Legacy retired resource**
- Decision:
  - Aware Money has been superseded by DebtScope.
  - DebtScope uses `videos/DebtScope-help-videos.json`.
  - Aware Money had some downloads but no paid customers.
  - This manifest is **not** a permanent compatibility endpoint.
- Migration rule:
  - Leave it in place during the redesign because there is no cost to doing so.
  - It may be archived or removed as part of a future legacy cleanup without affecting the KomoKode redesign.

### Video Files Referenced by `videos/DebtScope-help-videos.json`

- Current repository path: Not in repository; existing website inventory lists them as hosted on `media.komakode.com`
- Current public URLs from existing website inventory:
  - `https://media.komakode.com/Import-DebtScope.mp4`
  - `https://media.komakode.com/Import-DebtScope-3rd-iPad.mp4`
  - `https://media.komakode.com/Import-DebtScope-files-iPhone.mp4`
  - `https://media.komakode.com/DebtScope-Import- files-iPad.mp4`
  - `https://media.komakode.com/DebtScope-Strategy-iPhone.mp4`
  - `https://media.komakode.com/DebtScope-Strategy-iPad.mp4`
  - `https://media.komakode.com/Net-Worth-iPhone.mp4`
  - `https://media.komakode.com/Net-Worth-iPad.mp4`
  - `https://media.komakode.com/DebtScope-AI-iPhone.mp4`
  - `https://media.komakode.com/DebtScope-AI-iPad.mp4`
- Consumer(s): DebtScope only through `videos/DebtScope-help-videos.json`; DebtScope does not hard-code these URLs directly.
- App-facing or website-only: App-facing if present in the active manifest.
- Compatibility class: Permanent app contract while referenced by the active DebtScope manifest
- Proposed migration destination: Keep current media URLs stable or redirect them if they remain in the manifest; any media-hosting reorganization is **Needs Investigation**.
- Files or applications requiring updates if moved: `videos/DebtScope-help-videos.json`; no DebtScope app update is required if the manifest stays compatible and reachable.
- Compatibility concerns: URLs include capitalization and one filename with an embedded space: `DebtScope-Import- files-iPad.mp4`. Preserve exact URLs or provide redirects while manifest entries or cached clients may reference them.
- Recommended migration order: Move only after manifest compatibility and media redirects are verified.

### Video Files Referenced by `videos/help-videos.json`

- Current repository path: Not in repository; existing website inventory lists them as hosted on `media.komakode.com`
- Current public URLs from existing website inventory:
  - `https://media.komakode.com/importCreditcard-iPhone.mp4`
  - `https://media.komakode.com/importStatements.mp4`
  - `https://media.komakode.com/importCreditcard-iPhone-file.mp4`
  - `https://media.komakode.com/importStatements-iPad-file.mp4`
  - `https://media.komakode.com/Debt-iPhone.mp4`
  - `https://media.komakode.com/Debt-iPad.mp4`
  - `https://media.komakode.com/Net-Worth-iPhone.mp4`
  - `https://media.komakode.com/Net-Worth-iPad.mp4`
- Consumer(s): legacy Aware Money media references. DebtScope source-code inventory verified that DebtScope does not use `videos/help-videos.json`.
- App-facing or website-only: Legacy retired Aware Money media, not active DebtScope media.
- Compatibility class: Legacy retired resource
- Proposed migration destination: Optional future legacy cleanup.
- Files or applications requiring updates if moved: None for DebtScope. Any cleanup should keep the authoritative legacy-manifest decision above in mind.
- Compatibility concerns: These files are not DebtScope migration blockers and may remain temporarily at no meaningful cost.
- Recommended migration order: Treat only as optional legacy cleanup after active app-facing endpoints and website migration decisions are protected.

## DebtScope Purchase Analytics Service

- App endpoint: `https://komakode.com/api/debtscope/purchase-events`
- App source-code reference: `DebtScope/Models/PurchaseAnalytics.swift:207`, `PurchaseAnalyticsClient.defaultEndpointURL`
- App-facing or website-only: App-facing
- Compatibility class: Permanent app contract
- Compatibility status: **Permanent Compatibility Endpoint**
- Cloudflare/backend references found in the DebtScope repository:
  - `Cloudflare/PurchaseAnalytics/wrangler.toml:5-15`: routes `komakode.com/api/debtscope/purchase-events`, `komakode.com/api/debtscope/purchase-summary`, and `komakode.com/debtscope/purchase-analytics`
  - `Cloudflare/PurchaseAnalytics/src/index.js:45-54`: worker router paths `/api/debtscope/purchase-events`, `/api/debtscope/purchase-summary`, and `/debtscope/purchase-analytics`
  - `debtscope-purchase-analytics/wrangler.jsonc:24-31`: alternate/duplicate route config for `komakode.com/api/debtscope/*` and `komakode.com/debtscope/purchase-analytics`
  - `debtscope-purchase-analytics/src/index.ts:56-72`: alternate/duplicate worker router paths
- Compatibility concerns: Two purchase analytics worker directories overlap on similar KomoKode routes and schema but differ in implementation details. Which worker is authoritative is **Needs Investigation** before backend changes.
- Recommended migration order: Do not change analytics routing until the authoritative worker is identified. Keep the app ingestion endpoint available for released versions.

---

## Other Repository Files

### Internal Documentation

- Current repository paths:
  - `docs/CurrentState.md`
  - `docs/Architecture.md`
  - `docs/MigrationPlan.md`
- Current public URL: Needs Investigation; these files may be deployed by Cloudflare Pages if not excluded
- Consumer(s): Project maintainers
- App-facing or website-only: Internal documentation unless publicly served by deployment
- Compatibility class: Internal documentation
- Proposed migration destination: Completed; files already reside in `docs/`, as listed in Phase 2
- Files or applications requiring updates if moved: Project references have been updated in this plan; any deployment exclusions or links are Needs Investigation
- Compatibility concerns: If currently public, the completed move to `docs/` could have changed public URLs, but no production app consumer was found.
- Recommended migration order: No file move remains; confirm deployment exclusions if internal docs should not be public.

---

# Recommended Migration Order

1. Confirm production public URLs and Cloudflare deployment behavior for current root files, including whether `https://komakode.com/index.html` is directly exposed, plus `Teams/` and `videos/`.
2. Protect permanent ScoreKeep compatibility endpoints before moving files:
   - `https://komakode.com/Teams/index.json`
   - `https://komakode.com/Teams/message.json`
   - `https://komakode.com/Privacy%20Policy`
3. Protect permanent DebtScope compatibility endpoints before moving files:
   - `https://komakode.com/videos/DebtScope-help-videos.json`
   - `https://komakode.com/api/debtscope/purchase-events`
   - `https://komakode.com/Privacy%20Policy`
4. Protect other app-facing URLs with redirects, duplicate files, or stable routing before moving files.
5. Internal documentation move to `docs/` is completed; confirm deployment exclusions if these files should not be public.
6. Migrate website-only resources such as `Manual.pdf`, `ScoreKeep.png`, and `Privacy Policy.html` as part of the website redesign after destinations are decided.
7. Migrate ScoreKeep team files only after `Teams/index.json` compatibility is protected; update `teams[].url` values and keep old file URLs redirected or duplicated.
8. Migrate the active DebtScope help-video manifest and media only after compatibility and redirects are verified. Treat `videos/help-videos.json` as a retired Aware Money resource and handle it separately as legacy cleanup.
9. Remove old paths only after testing website behavior, app behavior, direct downloads, JSON fetches, and media playback.

---

# Unresolved Items

- **Needs Investigation:** Confirm production public URLs and Cloudflare deployment behavior for current root files, including whether `https://komakode.com/index.html` is directly exposed, plus `Teams/` and `videos/`.
- **Needs Investigation:** Decide proposed migration destinations for website-only resources such as `Manual.pdf`, `ScoreKeep.png`, and `Privacy Policy.html`.
- **Needs Investigation:** Determine which purchase analytics worker directory is authoritative before changing backend routes or schema.
- **Needs Investigation:** Confirm whether internal documentation under `docs/` is publicly deployed and whether deployment exclusions are needed.

# Future Design Notes

- A cleaner canonical privacy-policy URL may be added later, but `https://komakode.com/Privacy%20Policy` must remain permanently available.

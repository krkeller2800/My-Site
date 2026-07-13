# KomoKode Website Architecture

**Status:** Phase 3 Complete

**Purpose**

This document defines the target architecture for the redesigned KomoKode website.

It is a planning document for the public website, product pages, documentation,
downloads, app-facing data, media hosting, and future direct sales. It does not
move production files, create redirects, select a payment provider, or implement
the redesign.

The architecture is based on the current production services documented in
`docs/CurrentState.md` and `docs/MigrationPlan.md`, plus the settled Phase 3
decisions.

---

# Revision History

| Date | Version | Notes |
|------|---------|-------|
| 2026-07-11 | 1.0 | Initial Phase 3 architecture |
| 2026-07-11 | 1.1 | Finalized Phase 3 architecture with accessibility, performance, security, and decision-process guidance |

---

# Related Documents

This architecture document is intended to be read together with related planning
documents. Each document serves a different purpose:

- `docs/CurrentState.md` - Inventory of the current production website and
  services.
- `docs/MigrationPlan.md` - Migration strategy and compatibility requirements.
- `docs/ImplementationPlan.md` - Step-by-step implementation plan for the
  redesigned website, planned as a future Phase 4 document.

---

# Core Principles

- Static first.
- Keep recurring costs near zero.
- Prefer free or inexpensive services unless paid services provide clear value.
- Keep the site inexpensive to operate even if product sales are very low.
- Support future growth without requiring significant recurring costs until
  those costs are justified.
- Use Cloudflare Pages for the public website.
- Use Cloudflare DNS.
- Continue using current Cloudflare media hosting.
- Keep GitHub as the source of truth.
- Treat released-app URLs as permanent compatibility contracts.
- Avoid unnecessary CMS, database, authentication, customer accounts, or custom
  commerce infrastructure.
- Reuse documentation and support content wherever practical.
- Do not over-engineer.
- Design for future growth without paying for it today.

The site should be inexpensive to run even if DevDoctor sells poorly. Paid
infrastructure is justified only when it solves a real product, sales, tax,
support, or operational problem.

---

# Non-Goals

- This document does not implement the redesign.
- This document does not define migration steps.
- This document does not select a payment provider.
- This document does not redesign application APIs.
- This document does not replace `docs/MigrationPlan.md`.
- This document intentionally avoids premature technology choices.

---

# Architecture Areas

The redesigned KomoKode web presence is divided into eight distinct areas:

1. Public website
2. Product pages
3. Documentation and support
4. Direct software downloads
5. Future direct sales
6. App-facing JSON and APIs
7. Media hosting
8. Internal project documentation

These areas may share the same repository and deployment pipeline, but they have
different consumers and compatibility requirements. Public website pages may be
redesigned freely. App-facing URLs are production contracts and must remain
compatible with released applications.

---

# Public Website

The public website is the human-facing marketing, product, support, and download
surface at:

```text
https://komakode.com/
```

The target public website should use a clean static structure similar to:

```text
komakode.com/
|-- index.html
|-- products/
|   |-- devdoctor/
|   |-- debtscope/
|   |-- scorekeep/
|   `-- platewise/
|-- support/
|-- downloads/
|-- about/
|-- legal/
`-- assets/
    |-- css/
    |-- js/
    `-- images/
```

Use clean folder-style URLs:

- `/products/devdoctor/`
- `/products/debtscope/`
- `/products/scorekeep/`
- `/products/platewise/`
- `/support/`
- `/downloads/`
- `/about/`

The privacy policy may eventually have a cleaner canonical URL under `/legal/`,
such as `/legal/privacy/`. However, this permanent compatibility URL must remain
available indefinitely:

```text
https://komakode.com/Privacy%20Policy
```

The current `.html` privacy URL may also remain available or redirect if a
canonical legal URL is introduced.

## Main Navigation

The MVP navigation should be:

- Home
- Products
- Support
- Downloads
- About

Privacy should be linked from the footer rather than primary navigation.

---

# Product Pages

Product pages are public website pages under `/products/`.

Each product should use a consistent structure where relevant:

- Overview
- Features
- Screenshots
- Videos
- Documentation
- FAQ
- Release notes
- Download or App Store link
- Support

The product pages should be static HTML for the MVP. Shared CSS and minimal
JavaScript may live under `/assets/`.

## DevDoctor

DevDoctor is the featured direct-sale product.

The DevDoctor product page should be the primary path into direct distribution.
It should explain the product, show screenshots or demos, provide support and
release notes, and eventually provide a download or purchase action.

DevDoctor is not intended for the Mac App Store.

## DebtScope

DebtScope should have a product page that links to the App Store where
applicable. Help videos and public support content may be linked from the page,
but the released-app help-video manifest remains an app-facing compatibility
contract and should not be treated as a redesign-only website asset.

## ScoreKeep

ScoreKeep should have a product page that links to the App Store where
applicable and may link to team downloads, documentation, and support. The
ScoreKeep team distribution data remains app-facing production data.

## PlateWise

PlateWise should have a product page that links to the App Store where
applicable and provides product-level support and documentation as needed.

---

# Documentation and Support

Public support and product documentation should be separate from internal
project documentation.

Public support should live under:

```text
/support/
```

Product-specific documentation may be linked from product pages and support
pages. Markdown is preferred as the source format for long-form documentation.
Markdown documentation may later be rendered into public HTML if documentation
volume justifies it.

Documentation should be structured around reusable source material wherever
practical. The same source material should be able to support:

- Website documentation
- In-app help
- PDF documentation
- Video scripts
- FAQ pages
- Support articles
- Future AI knowledge sources

The goal is a single source of truth for product and support knowledge, with
different outputs generated or adapted from shared material instead of duplicated
documentation.

For the MVP:

- Use static pages.
- Prefer Markdown as source for longer documents.
- Render public docs manually or with simple static output as needed.
- Do not introduce a CMS.
- Do not introduce a database.
- Do not introduce authentication.

A lightweight static-site generator may be considered later only if it clearly
reduces maintenance. No specific static-site generator is selected now.

Internal architecture and migration documents under repository `docs/` should
not automatically be treated as public product documentation.

---

# Direct Software Downloads

Public download pages should live under:

```text
/downloads/
```

The downloads section should provide human-facing download information and links.
Large binaries such as DMGs or ZIPs may be hosted on `media.komakode.com` when
appropriate.

DevDoctor download pages should include:

- Current version
- System requirements
- Release notes
- Checksum
- Older versions later if needed

Downloads should remain static-first. Download protection, license-gated
downloads, and automatic update feeds are deferred until there is a concrete
need.

---

# Future Direct Sales

DevDoctor is the direct-sale product, but custom commerce infrastructure should
not be built initially.

The target flow is:

```text
DevDoctor product page
-> download or purchase action
-> external payment/licensing provider when selected
-> notarized download
-> support and release notes
```

Direct sales decisions:

- DevDoctor is not intended for the Mac App Store.
- No custom shopping cart should be built.
- No customer account system should be built initially.
- Payment provider selection is deferred until DevDoctor is ready to sell.
- A low-cost or transaction-only solution should be favored because sales may be
  low.
- Paid commerce infrastructure is only worth adding when it solves a real sales
  or tax problem.

The future payment or licensing provider should handle as much payment,
tax/VAT, receipt, license delivery, and refund complexity as practical.

---

# App-Facing JSON and APIs

App-facing data should be logically separate from the public website.

For new resources, use a cleaner structure such as:

```text
komakode.com/data/
|-- scorekeep/
|   |-- index.json
|   |-- message.json
|   `-- teams/
`-- debtscope/
    `-- help-videos.json
```

This structure is for new or future resources. It does not mean existing files
must immediately move to `/data/`.

The following existing released-app URLs remain permanent compatibility
contracts:

- `/Teams/index.json`
- `/Teams/message.json`
- `/videos/DebtScope-help-videos.json`
- `/Privacy%20Policy`
- `/api/debtscope/purchase-events`

Compatibility may be maintained through:

- Stable routing
- Redirects
- Duplicate compatibility files
- Permanent legacy paths

Any movement of app-facing data must follow the migration rules in
`docs/MigrationPlan.md`.

## ScoreKeep Data

The website and ScoreKeep both use:

```text
Teams/index.json
```

ScoreKeep also uses:

```text
Teams/message.json
```

ScoreKeep team file URLs come from `teams[].url` in `Teams/index.json`.
Individual team files may move later if the manifest endpoint and schema remain
compatible and the manifest points to valid files.

The `.ScoreKeep_Players` extension remains a permanent file-format contract for
importable team/player files.

Legacy team file URLs should remain redirected or duplicated where practical.
This is especially important for older clients, cached manifests, direct links,
and files with spaces in their names.

## DebtScope Help Videos

DebtScope reads:

```text
videos/DebtScope-help-videos.json
```

Video URLs are supplied by the manifest. DebtScope does not hard-code individual
MP4 URLs.

Media files are hosted on:

```text
media.komakode.com
```

The active manifest URL and schema must remain compatible. If media files move,
the manifest may point to new URLs only after those URLs are deployed and old
media URLs are redirected or duplicated where required.

The old Aware Money resource:

```text
videos/help-videos.json
```

is a retired legacy resource and is not a migration blocker for the redesigned
KomoKode website.

## Purchase Analytics API

DebtScope uses:

```text
/api/debtscope/purchase-events
```

This endpoint is app-facing and should remain available. It is currently a small
dynamic workload and belongs in Cloudflare Workers only because it requires
runtime behavior.

The authoritative purchase analytics Worker remains an investigation item before
backend changes are made.

---

# Media Hosting

Large media should continue to use:

```text
https://media.komakode.com/
```

Use `media.komakode.com` for:

- Help videos
- Demo videos
- Large media assets
- Future large downloads where appropriate

A future logical media structure may look like:

```text
media.komakode.com/
|-- debtscope/
|-- devdoctor/
|-- scorekeep/
`-- shared/
```

Existing media files do not need to move merely for neatness. New media should
follow the cleaner structure.

---

# Internal Project Documentation

Internal project documentation remains under repository:

```text
docs/
```

Internal documents include architecture, migration, inventory, planning, and
implementation notes for maintainers. They should not automatically become
public product documentation.

If the deployment currently exposes `docs/`, decide separately whether that is
acceptable. Deployment exclusions are an implementation concern and should be
handled during a later phase if internal docs should not be publicly served.

## Repository Organization

Public website content and internal project documentation serve different
audiences. Internal planning documents should remain under `docs/`. Public
documentation should be organized under the website support structure.

Repository organization should clearly separate production assets from planning
documents.

---

# Architectural Decision Process

Future architectural decisions should follow these guidelines:

- Prefer the simplest solution that satisfies current requirements.
- Favor static solutions over dynamic ones.
- Evaluate recurring costs before adopting new services.
- Introduce new infrastructure only when a demonstrated need exists.
- Prefer reusable content over duplicated content.
- Preserve compatibility for released applications.
- Avoid optimization for hypothetical future scale.

This process is intended to keep the architecture practical, inexpensive, and
compatible with current products while leaving room for future growth.

---

# Accessibility

Accessibility is part of the public website architecture. The site should strive
to:

- Use semantic HTML.
- Support keyboard navigation.
- Maintain sufficient color contrast.
- Remain usable without JavaScript where practical.

---

# Performance

Performance is an architectural goal. Public pages should stay lightweight and
efficient by:

- Preferring small pages.
- Optimizing images.
- Keeping JavaScript minimal.
- Using efficient browser caching where practical.

---

# Security

The architecture should minimize attack surface by preferring static content
whenever practical. Dynamic services should be introduced only when they provide
clear value.

---

# Technology Direction

For the MVP, use:

- Plain HTML
- Plain CSS
- Minimal JavaScript
- No frontend framework
- No backend
- No database
- No CMS
- No authentication

The site should be deployable as static files through Cloudflare Pages.

A lightweight static-site generator may be introduced later only if it clearly
reduces maintenance. Do not select a specific static-site generator yet.

---

# Cloudflare and Service Responsibilities

## Cloudflare Pages

Responsibility:

- Public static website
- Static product pages
- Static support and download pages
- Static assets under `/assets/`

Cost classification:

- Free for expected usage

## Cloudflare DNS

Responsibility:

- Domain management for `komakode.com`
- DNS records for public website, media, and other KomoKode services

Cost classification:

- Free

## Current Cloudflare Media Hosting

Responsibility:

- Videos and large assets
- Existing `media.komakode.com` media
- Future large downloads where appropriate

Cost classification:

- Free for expected usage

## Cloudflare Workers

Responsibility:

- Existing purchase analytics API
- Future dynamic functions only when required
- Compatibility routing only when static routing cannot solve the problem

Cost classification:

- Free for expected usage for current small workloads, but use only where
  required

## Cloudflare Redirects and Routing

Responsibility:

- Compatibility support where needed
- Permanent legacy URLs
- Clean canonical public URLs

Cost classification:

- Expected to fit within free or existing Cloudflare capabilities for current
  needs

## GitHub

Responsibility:

- Source of truth
- Version history
- Deployment source for Cloudflare Pages

Cost classification:

- Free for expected usage

## Paid CMS

Responsibility:

- None for MVP

Cost classification:

- Probably unnecessary

## Database

Responsibility:

- None for MVP

Cost classification:

- Probably unnecessary

## Customer Accounts

Responsibility:

- None for MVP

Cost classification:

- Probably unnecessary

## Custom Commerce Backend

Responsibility:

- None for MVP

Cost classification:

- Probably unnecessary

## External Payment or Licensing Provider

Responsibility:

- Future DevDoctor checkout, licensing, tax handling, receipt handling, or
  download entitlement when selected

Cost classification:

- Worth paying for only when DevDoctor is ready to sell

---

# MVP Scope

The first version of the redesigned site includes:

- New home page
- Product pages for DevDoctor, DebtScope, ScoreKeep, and PlateWise
- Support landing page
- Downloads landing page
- About page
- Privacy link
- Preservation of current production endpoints
- No payment system yet unless DevDoctor is ready at launch
- No search
- No login
- No customer portal
- No CMS
- No database

The MVP should not migrate production app-facing files unless the compatibility
plan for that specific resource has been implemented and verified.

---

# Deferred Features

The following features are deferred:

- Direct payment provider selection
- License-key delivery
- Automatic app update feed
- Documentation search
- Analytics beyond basic needs
- Customer accounts
- Newsletter
- AI support assistant
- Headless CMS
- Advanced download protection

These features should be added only when they solve a demonstrated need.

---

# Architecture Decisions

The following decisions are approved for Phase 3:

- Cloudflare remains the primary platform.
- GitHub remains the source of truth.
- Static content is the default.
- Existing app-facing URLs remain available.
- New content uses cleaner organization.
- DevDoctor will be distributed directly.
- Commerce is delegated, not custom-built.
- Cost is a primary architectural constraint.
- Failure-safe economics matter: the site should remain inexpensive even if
  DevDoctor sells poorly.

---

# Open Decisions

The following decisions remain open:

- Final canonical privacy policy URL under `/legal/`.
- Whether `docs/` should be excluded from public deployment.
- Final destinations for website-only resources such as `Manual.pdf` and
  `ScoreKeep.png`.
- Which purchase analytics Worker is authoritative.
- DevDoctor payment and licensing provider selection.
- Whether a static-site generator becomes worthwhile after MVP content grows.

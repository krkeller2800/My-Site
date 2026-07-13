# Current State

**Status:** Living Document

**Purpose**

This document describes the production services currently provided by KomaKode.com.

It documents how the existing system works before redesigning the website so that future changes do not unintentionally break released applications.

This document describes services, not implementation.

---

# Public Website

The public website provides information, documentation, downloads, and entry points into KomaKode software products.

The website itself may be redesigned provided production services remain compatible.

---

## Home Page

### Purpose

Introduces KomaKode and its software products.

### Consumers

- Website visitors

### Status

May be redesigned.

---

## Privacy Policy

### Purpose

Provides the privacy policy required by App Store applications.

### Consumers

- App Store
- DebtScope users
- ScoreKeep users
- PlateWise users
- Future applications

### Status

The current URL should remain available or be redirected.

---

## Product Documentation

### Purpose

Provides manuals, documentation, and other product information.

### Current Examples

- ScoreKeep Manual (PDF)

### Status

May be reorganized during the redesign.

---

# Production Application Services

The following services are consumed by released applications.

They should be treated as production APIs.

Future website redesigns should preserve compatibility whenever practical.

---

# ScoreKeep Team Distribution Service

## Purpose

Distribute importable team files for ScoreKeep.

This service supports two independent clients:

1. KomaKode.com
2. ScoreKeep

Both clients should present the same available teams.

---

## Website Client

### Purpose

Allow visitors to browse and download team files.

### Process

Website

↓

Reads `Teams/index.json`

↓

Displays available teams

↓

User downloads a team

↓

User imports the team into ScoreKeep

---

## ScoreKeep Client

### Purpose

Allow users to browse and download teams without leaving ScoreKeep.

### Process

ScoreKeep

↓

Reads `Teams/index.json`

↓

Displays available teams

↓

Reads `Teams/message.json`

↓

Displays download message

↓

Downloads selected team

↓

Imports downloaded file

---

## Teams/index.json

### Purpose

Defines the complete list of downloadable teams.

### Consumers

- KomaKode website
- ScoreKeep

### Responsibilities

- Team list
- Organization
- Display order
- Download information

### Status

Production API.

Schema should remain backward compatible.

---

## Teams/message.json

### Purpose

Provides a message displayed on the ScoreKeep download page.

Examples include:

- announcements
- update notices
- download information

### Consumers

- ScoreKeep

### Status

Production API.

---

## Importable Team Files

### Purpose

Contain the actual team data imported into ScoreKeep.

### Consumers

- Downloaded from KomaKode.com
- Downloaded directly by ScoreKeep

### Status

Production data.

Existing file format and naming should remain compatible with released versions of ScoreKeep.

---

# DebtScope Help Video Service

## Purpose

Provide help videos to DebtScope.

---

## Help Video Manifest

### Purpose

Describes every available help video.

### Consumers

- DebtScope

### Responsibilities

Provides metadata such as:

- title
- description
- category
- thumbnail
- video URL
- additional metadata

### Status

Production API.

Schema should remain backward compatible.

---

## Help Video Files

### Purpose

Provide the actual video content viewed by users.

### Consumers

- DebtScope
- Future website

### Hosted By

Cloudflare

### Status

Media assets.

---

# Shared Media Service

## Purpose

Host media shared across products.

### Current Content

- Images
- Product screenshots
- Help videos
- Future demonstration videos

### Current Hosting

Cloudflare

---

# Infrastructure

## GitHub

### Purpose

Source control.

Cloudflare deployment source.

### Cost

Free for expected usage.

---

## Cloudflare Pages

### Purpose

Static website hosting.

### Cost

Free for expected usage.

---

## Cloudflare DNS

### Purpose

Domain management.

### Cost

Free.

---

## Cloudflare Media Hosting

### Purpose

Host videos and other static media assets.

### Cost

Free for expected usage.

---

# Compatibility Requirements

The following production services should remain compatible whenever practical.

## Website

- Privacy Policy URL

## ScoreKeep

- Team Distribution Service
- Teams/index.json
- Teams/message.json
- Importable Team Files

## DebtScope

- Help Video Manifest
- Help Video Files

---

# Notes

This document intentionally describes the current production system.

It should only change when the production architecture changes.

Future documents will describe:

- Target Architecture
- Roadmap
- Design Decisions
- URL Standards
- Documentation Standards
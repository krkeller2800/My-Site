# KomoKode Developer Hub
## Architecture & Design Document

**Status:** Living Document

**Last Updated:** July 11, 2026

---

# Purpose

This document defines the long-term architecture, goals, and design principles for KomoKode.com. It is intended to guide all future development decisions and provide a single source of truth for the website, supporting services, and related infrastructure.

The objective is to build a sustainable developer platform that remains inexpensive to operate while allowing future growth.

---

# Vision

KomoKode is no longer simply a company website.

It is the central hub for all KomoKode software products and services.

Its responsibilities include:

- Product catalog
- Product documentation
- Help articles
- Customer support
- Demo videos
- Software downloads
- Direct software sales
- Application data distribution
- Media hosting

---

# Current Products

## DebtScope

Primary commercial iPhone/iPad application.

Features include:

- Debt payoff planning
- Statement import
- Payoff strategy comparison
- Payment analysis
- App Store distribution

---

## ScoreKeep

Baseball scorekeeping application.

Responsibilities include:

- Product information
- Documentation
- Support
- Distribution of roster and lineup data

---

## DevDoctor

Native macOS diagnostic utility.

Current direction:

- Direct distribution
- Not intended for the Mac App Store due to App Sandbox limitations
- Future commercial desktop product

---

## PlateWise

AI-assisted recipe generation application.

Current status:

- Functional
- Low commercial priority

---

# Existing Infrastructure

Current services include:

- GitHub
- Cloudflare Pages
- Cloudflare DNS
- Cloudflare media hosting
- Static HTML
- Static JSON
- Static assets

Current operating cost is approximately $0.

Maintaining very low operating costs is a major project goal.

---

# Primary Goals

1. Maintain a simple architecture.
2. Minimize recurring costs.
3. Host static content whenever practical.
4. Avoid unnecessary subscriptions.
5. Build for future growth without over-engineering.
6. Keep maintenance requirements low.
7. Reuse content whenever possible.

---

# Architecture Principles

## 1. Static First

Every feature should be implemented as static content unless there is a compelling reason to introduce server-side functionality.

---

## 2. Cost Matters

Every recommendation must include cost considerations.

Services should be classified as:

- Free
- Free for expected usage
- Worth paying for
- Probably unnecessary

Recurring subscriptions should only be introduced when they clearly save more time or generate more value than they cost.

---

## 3. Simplicity Wins

Prefer understandable, maintainable solutions over technically impressive ones.

---

## 4. Stable App APIs

Application-facing JSON, media, and downloads should be treated as stable APIs.

Website redesigns must not unnecessarily break application URLs.

---

## 5. Single Source of Truth

Documentation should exist in one location and be reused wherever possible.

Examples include:

- Website
- In-app help
- PDF documentation
- Video scripts
- AI-generated support

---

## 6. Grow Only When Necessary

Do not build infrastructure for problems that do not yet exist.

---

# Website Responsibilities

The public website should provide:

- Company information
- Product information
- Documentation
- Support
- Downloads
- Contact information

---

# Application Services

The website infrastructure also serves applications by providing:

- JSON data
- Help video metadata
- Media assets
- Downloadable resources
- Future update information

These machine-consumed resources are considered production services and should remain stable.

---

# Future Direct Sales

DevDoctor will eventually be sold directly rather than through the Mac App Store.

Initial goals:

- Simple purchasing
- Reliable downloads
- License delivery
- Low ongoing cost

The website should hand off payment processing to a suitable commerce provider rather than implementing a custom shopping cart.

Selection of a payment provider will occur later based on actual sales volume.

---

# Service Evaluation Philosophy

Every external service should answer three questions:

1. Does it reduce maintenance?
2. Does it justify its recurring cost?
3. Can it be replaced later without major redesign?

If the answer is "no," the service should generally not be adopted.

---

# Technology Decisions

These remain intentionally undecided until the architecture is finalized:

- HTML framework
- CSS framework
- JavaScript framework
- Documentation generator
- Search
- Analytics
- Payment provider

Technology choices should support the architecture rather than drive it.

---

# Future Topics

The following topics remain to be designed:

- Site navigation
- URL structure
- Documentation organization
- Product page template
- Download architecture
- DevDoctor licensing
- Support workflow
- Release notes
- Demo video organization
- Search
- Branding
- Mobile experience
- SEO strategy
- Analytics
- Content management workflow

---

# Guiding Philosophy

KomoKode should be built as a sustainable developer platform.

Every decision should favor:

- Low cost
- Long-term maintainability
- Simplicity
- Reliability
- Reusable content
- Gradual growth

The architecture should allow KomoKode to remain inexpensive if products are unsuccessful while scaling naturally if future products become successful.
<!--
Sync Impact Report:
Version change: (none) → 1.0.0
Modified principles: N/A (initial ratification)
Added sections:
  - Core Principles: I. Project Scope & Purpose, II. No Backend / Server-less Architecture,
    III. DESIGN.md as Immutable Visual Source of Truth, IV. Relative Paths & Portable Deployment,
    V. Semantic HTML & Keyboard Accessibility, VI. Respect for Reduced Motion,
    VII. Substantive Editorial Content (Not Photo-Only), VIII. Authentic, Licensed Photography,
    IX. Continuous Scroll Experience with Mobile Fallback, X. Minimal Dependencies &
    GitHub Pages-Ready Output
  - Technology Constraints
  - Quality Gates
  - Governance
Removed sections: none (initial creation from template)
Templates requiring updates: none — dependent templates/commands read this constitution at
  runtime and are not modified by this command.
Follow-up TODOs: TODO(RATIFICATION_DATE) — original ratification date not supplied by the user.
-->

# Johor Bahru Golf Travel Site Constitution

## Core Principles

### I. Project Scope & Purpose
This project MUST remain a single-page static website whose sole purpose is introducing golf
travel in the Johor Bahru region of Malaysia. All content, navigation, and interaction MUST
live on that one page.
Rationale: a focused single-page format keeps authorship and delivery simple and matches the
intended presentation of the site.

### II. No Backend / Server-less Architecture
The project MUST NOT include login/authentication, a server, a database, or an API server. All
functionality MUST be achievable with static assets served as-is.
Rationale: this is an informational/marketing site; a backend would add operational and
security burden disproportionate to its purpose and would block simple static hosting.

### III. DESIGN.md as Immutable Visual Source of Truth
`DESIGN.md` at the project root MUST be treated as the primary, highest-priority visual
reference for all UI decisions. The original `DESIGN.md` file MUST NOT be modified during
implementation.
Rationale: preserves a stable, reviewable design contract and prevents design drift from
ad-hoc edits made mid-implementation.

### IV. Relative Paths & Portable Deployment
All page routes and image paths MUST use relative paths so the site functions correctly when
hosted under a GitHub Pages project subpath.
Rationale: GitHub Pages project sites are served from a subpath rather than a domain root;
absolute paths silently break navigation and assets in that environment.

### V. Semantic HTML & Keyboard Accessibility
Markup MUST use semantic HTML elements and MUST support full keyboard accessibility, including
logical focus order, visible focus states, and operable interactive elements.
Rationale: ensures usability for assistive technology and keyboard-only users, and improves
maintainability and SEO as a side effect.

### VI. Respect for Reduced Motion
The site MUST honor `prefers-reduced-motion`. Users with this preference MUST be able to view
all content without relying on non-essential or excessive animation.
Rationale: motion must be an enhancement layered on top of content, never a requirement for
comprehension, out of respect for motion-sensitive users.

### VII. Substantive Editorial Content (Not Photo-Only)
The site MUST NOT be a bare photo gallery. It MUST include a hero lead paragraph and, for each
golf course, two body paragraphs of real written content covering course characteristics,
difficulty, and reasons to recommend it. This body copy MUST be presented as an independent,
readable design element — with appropriately generous type size and line-height — rather than
shrunk into a small caption overlaid on a photo.
Rationale: golf travelers need substantive information to make decisions; captions cannot
carry that weight, and reducing text to decoration would defeat the site's informational
purpose.

### VIII. Authentic, Licensed Photography
Implementation MUST use real photographs of Horizon Hills Golf & Country Club, The Els Club
Desaru Coast, Palm Villa Golf & Country Club, and Impian Golf & Country Club, sourced online
and downloaded into the project rather than hotlinked. Only images whose reuse terms can be
verified MUST be used. The final result MUST NOT contain placeholder images, arbitrary
solid-color boxes, or external image hotlinks. For every image file used, its source,
photographer/author, original URL, and license MUST be recorded in `CREDITS.md`.
Rationale: authentic imagery is essential to a travel site's credibility, and recorded license
provenance protects the project from copyright risk.

### IX. Continuous Scroll Experience with Mobile Fallback
On desktop, the site SHOULD provide a strong scroll-driven interaction, but transitions
between scenes MUST feel continuous rather than abrupt or forcibly jumpy. On mobile, the site
MAY fall back to a normal, easy-to-read vertical flow with simple transitions.
Rationale: rich scroll interaction showcases the destination on larger screens, while mobile
users need predictable, low-friction reading without motion-heavy patterns that hurt usability
on touch devices.

### X. Minimal Dependencies & GitHub Pages-Ready Output
The project MUST NOT add unnecessary frameworks or server-side dependencies beyond what a
static site requires. The final build output MUST be directly deployable to GitHub Pages
without additional server infrastructure.
Rationale: keeps the project simple to build, audit, and host, and is consistent with
Principles I, II, and IV.

## Technology Constraints

The site MUST be implementable as static HTML/CSS/JS (or a minimal static-site toolchain whose
build output is plain static files). Any build-time tooling (e.g., a bundler) is permitted only
if its runtime output remains static, framework-free, and dependency-free — it MUST NOT require
a Node.js server, database, or API server to run once deployed. All navigation and asset
references in the built output MUST resolve correctly via relative paths under a GitHub Pages
project subpath.

## Quality Gates

Before implementation work is considered complete, verify:

- All page/image references use relative paths and the built site works when served from a
  non-root subpath (simulating GitHub Pages).
- Keyboard-only navigation reaches every interactive element in a logical order with visible
  focus indicators.
- The site is tested with `prefers-reduced-motion: reduce` and remains fully readable without
  depending on animation.
- Each golf course section has its two substantive body paragraphs plus the hero lead; none of
  the copy has been reduced to a caption.
- Every image used is a downloaded, license-verified real photograph of the named course; zero
  placeholders, solid-color boxes, or hotlinks remain.
- `CREDITS.md` lists source, author, original URL, and license for every image file.
- No login, server, database, or API server code exists in the repository.
- `DESIGN.md` is unmodified from its original content.

## Governance

This constitution supersedes all other project practices and conventions. Amendments require:
a documented rationale for the change, an updated Sync Impact Report prepended to this file,
and a semantic version bump (MAJOR for incompatible principle removals/redefinitions, MINOR for
new principles or materially expanded guidance, PATCH for clarifications and wording fixes).
Every plan, task breakdown, and implementation MUST be checked for compliance against this
constitution; any deviation must be justified in the relevant planning artifact or the
constitution itself must be amended first. Use `DESIGN.md` for detailed visual/UX guidance and
this constitution for non-negotiable governing rules.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): original ratification date not
supplied | **Last Amended**: 2026-09-12

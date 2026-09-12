# Implementation Plan: 조호바루 골프여행

**Branch**: `001-johor-bahru-golf-travel` | **Date**: 2026-09-12 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-johor-bahru-golf-travel/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

A single-page static site (`index.html` / `styles.css` / `script.js`) presents a hero
introduction and four golf-course profiles (Horizon Hills, The Els Club Desaru Coast, Palm
Villa, Impian) for Johor Bahru golf travel. On desktop, one GSAP `ScrollTrigger` pin plus one
master timeline drives a continuous scroll narrative (image scale, mask reveal, parallax, text
fade/translate, ~20–30% cross-fades, tunnel-style scene entry). On mobile, or when
`prefers-reduced-motion` is set, the pin/timeline is skipped and the same content renders as a
normal vertical document. No build step, framework, or backend is introduced; the site is
served as-is from GitHub Pages using relative paths.

## Technical Context

**Language/Version**: HTML5, CSS3, vanilla JavaScript (ES2019+ browser-native; no
transpilation or bundling step)

**Primary Dependencies**: GSAP core + the ScrollTrigger plugin, vendored locally under
`vendor/gsap/` (self-hosted `<script>` includes; no CDN, no package manager, no other runtime
library)

**Storage**: N/A — all content is static markup/text; media lives in `assets/images/` as
downloaded files

**Testing**: Manual QA against `quickstart.md` (keyboard navigation, reduced-motion fallback,
resize/breakpoint behavior, image integrity, relative-path/subpath deployment check). No
automated test framework is introduced, per Constitution Principle X (minimal dependencies).

**Target Platform**: Static hosting on GitHub Pages; evergreen desktop and mobile browsers
(latest two versions of Chrome, Edge, Firefox, Safari)

**Project Type**: Single static frontend page — no backend

**Performance Goals**: Sustain smooth (~60fps-class) scroll-driven animation on mid-range
hardware by animating only `transform`/`opacity`; hero content visible promptly on typical
broadband/mobile connections; no scroll-jank from layout thrashing

**Constraints**: Zero build step; zero server/runtime dependency; every path is relative
(`./assets/...`, never a leading `/`) for GitHub Pages project-subpath compatibility; no
externally hotlinked images; images carry explicit `width`/`height`/`aspect-ratio` to prevent
loading-time layout shift; full content must remain reachable with JavaScript disabled, with
`prefers-reduced-motion` enabled, and on mobile viewports

**Scale/Scope**: 1 page, 1 hero scene + 4 golf-course scenes, one GSAP master timeline bound to
a single `ScrollTrigger` pin, a small local image set (see `research.md` §15) plus two vendored
GSAP script files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Plan compliance | Status |
|---|---|---|---|
| I | Project Scope & Purpose | Plan builds exactly one static page for JB golf travel; no other pages/routes planned | PASS |
| II | No Backend / Server-less Architecture | Stack is HTML/CSS/vanilla JS + a vendored client-side animation library only; no login, server, DB, or API | PASS |
| III | DESIGN.md as Immutable Visual Source of Truth | `DESIGN.md` does not exist in the repo yet | ⚠ BLOCKED — see Open Dependency below |
| IV | Relative Paths & Portable Deployment | All asset/page references use `./`-relative paths; `.nojekyll` included in the file set | PASS |
| V | Semantic HTML & Keyboard Accessibility | Semantic sectioning (`<header>`/`<section>`/`<main>`) and visible focus states planned; verified in `quickstart.md` | PASS (verify at implementation) |
| VI | Respect for Reduced Motion | `prefers-reduced-motion` disables the ScrollTrigger pin/timeline entirely, falling back to normal flow (research.md §7) | PASS |
| VII | Substantive Editorial Content | All hero/course copy from `spec.md` is placed verbatim in `index.html`, styled as first-class content (research.md §13) | PASS |
| VIII | Authentic, Licensed Photography | Sourcing → license verification → local download → optimize → `CREDITS.md` pipeline defined in research.md §15 | PASS for the hero image (Unsplash License, verified); DEVIATION for the 4 course photos — see Complexity Tracking |
| IX | Continuous Scroll with Mobile Fallback | Single master timeline/pin on desktop; pin released and replaced by static vertical flow below the mobile breakpoint (research.md §8) | PASS |
| X | Minimal Dependencies & GitHub Pages-Ready Output | Only GSAP + ScrollTrigger added (vendored, no build step); justified in Complexity Tracking | PASS |

### Open Dependency (blocks visual styling, not structural/behavioral work)

`DESIGN.md` is referenced by Principle III as the primary visual reference but does not exist
at the project root yet. This plan defers concrete visual tokens (color palette, exact
typography beyond the 17–20px/1.65–1.85 body range given by the user, spacing scale, imagery
art direction beyond "large photo per course") to that file once it is supplied. Markup
structure, the GSAP timeline/behavior, and the image-sourcing pipeline can proceed
independently; final visual styling in `styles.css` should not be treated as finished until
`DESIGN.md` exists and has been read.

## Project Structure

### Documentation (this feature)

```text
specs/001-johor-bahru-golf-travel/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
index.html
styles.css
script.js
DESIGN.md              # read-only design reference — supplied externally, not authored here
CREDITS.md
.nojekyll
assets/
└── images/
    ├── hero/
    ├── horizon-hills/
    ├── els-club-desaru/
    ├── palm-villa/
    └── impian/
vendor/
└── gsap/
    ├── gsap.min.js
    └── ScrollTrigger.min.js
```

**Structure Decision**: The static site lives at the repository root as a flat file set,
matching the exact core-file list the user specified (`index.html`, `styles.css`, `script.js`,
`DESIGN.md`, `CREDITS.md`, `.nojekyll`, `assets/images/`), plus a `vendor/gsap/` folder for the
two self-hosted library files. This is the GitHub Pages publish root — no `docs/` folder or
build output directory is needed since there is no build step.

**Note on the existing `app/` directory**: earlier in this project's setup, a Next.js project
was scaffolded at `app/` before the constitution was ratified. Constitution Principles II and X
now rule out React/Next.js for this feature, so `app/` is **not** part of this feature's
structure and should not be treated as the GitHub Pages source. Whether to remove or repurpose
`app/` is left to the user to decide — it is not touched by this plan.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| Added dependency: GSAP + ScrollTrigger (vendored, no build step) | FR-008 / User Story 3 require one continuous, precisely scroll-scrubbed timeline (scale, mask reveal, parallax, cross-fade, tunnel transition) | A hand-rolled `scroll`/`IntersectionObserver` + manual `requestAnimationFrame` implementation would re-solve scrubbing, easing, pin management, and resize/refresh handling that ScrollTrigger already provides reliably — for a project whose core value proposition *is* this scroll experience, that reimplementation risk outweighs adding one focused, self-hosted animation library |
| Principle VIII deviation: the 4 course photos (Horizon Hills, The Els Club Desaru Coast, Palm Villa, Impian) are sourced from each venue's own official site/listing under an editorial-use assumption, not a confirmed open reuse license | FR-003/FR-004 require one real photograph of each of these four specific, private golf clubs; no freely-licensed, reuse-verified photo of any of them exists on Unsplash, Pexels, Wikimedia Commons, or Flickr CC (verified during implementation — see `CREDITS.md`'s note) | The alternatives were: (a) fabricate/hotlink without any check — rejected, higher risk and explicitly forbidden; (b) substitute a generic, unrelated stock golf photo per course — rejected, misrepresents which venue is shown and still requires a spec.md change to FR-004; (c) leave the image slot empty — rejected as a project-owner decision. The project owner explicitly chose option (a')_use each club's own official press/media photo_ on 2026-09-12, accepting the residual copyright risk in exchange for genuinely showing the correct, specific venue |

---

description: "Task list template for feature implementation"
---

# Tasks: 조호바루 골프여행

**Input**: Design documents from `/specs/001-johor-bahru-golf-travel/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md (all present)

**Tests**: Not requested for this feature (static informational site; validation is via `quickstart.md` manual QA, not an automated test suite — consistent with Constitution Principle X / plan.md's Technical Context).

**Organization**: Tasks are grouped by user story (from `spec.md`) to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files/resources, no unmet dependency)
- **[Story]**: Which user story this task belongs to (US1–US5, per `spec.md` priorities)
- Every task includes an exact repository-relative file path

## Path Conventions

Flat repository-root static site per `plan.md`'s Project Structure (no `src/`, no build output dir):

```text
index.html
styles.css
script.js
DESIGN.md          # read-only — supplied externally, not authored by these tasks
CREDITS.md
.nojekyll
assets/images/{hero,horizon-hills,els-club-desaru,palm-villa,impian}/
vendor/gsap/{gsap.min.js,ScrollTrigger.min.js}
```

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Repository scaffolding needed before any content or behavior can be added.

- [X] T001 Create the directory structure at the repository root: `assets/images/hero/`, `assets/images/horizon-hills/`, `assets/images/els-club-desaru/`, `assets/images/palm-villa/`, `assets/images/impian/`, `vendor/gsap/`
- [X] T002 [P] Create an empty `.nojekyll` file at the repository root (research.md §16)
- [X] T003 [P] Download GSAP core and the ScrollTrigger plugin (minified builds) and vendor them locally at `vendor/gsap/gsap.min.js` and `vendor/gsap/ScrollTrigger.min.js` — no CDN reference (research.md §1)
- [X] T004 [P] Create `CREDITS.md` at the repository root with the header row/table per `contracts/credits-entry-format.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The shared document/markup/script skeleton every user story's content and behavior plugs into.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 Create the `index.html` document shell at the repository root: `<!DOCTYPE html>`, `<html lang="ko">`, `<head>` with UTF-8 charset and viewport meta, `<title>조호바루 골프여행</title>`, `<link rel="stylesheet" href="./styles.css">`, GSAP/ScrollTrigger `<script src="./vendor/gsap/...">` tags followed by `<script src="./script.js" defer>`, and an empty `<main id="stage" data-scene-count="5"></main>`
- [X] T006 Add the 5 `.scene` section skeletons inside `#stage` in `index.html` — `#scene-hero`, `#scene-horizon-hills`, `#scene-els-club-desaru`, `#scene-palm-villa`, `#scene-impian`, each with `data-scene`/`data-kind` attributes and the `.scene__bg > .scene__image`, `.scene__scrim`, `.scene__content` child structure exactly as specified in `contracts/scene-markup-contract.md` (depends on: T005)
- [X] T007 [P] Create the base layer of `styles.css`: CSS reset/`box-sizing`, root font stack (system sans-serif with Korean coverage per research.md §14, e.g. `-apple-system, "Segoe UI", "Noto Sans KR", sans-serif`), full-viewport stacked layout rules for `.scene` / `.scene__bg` / `.scene__image` / `.scene__scrim` / `.scene__content`, and a baseline `:focus-visible` outline
- [X] T008 [P] Create the base layer of `script.js`: a `prefersReducedMotion` and an `isMobile` (`max-width: 768px`) `matchMedia` check, a debounced `resize`/`orientationchange` handler stub, and a `waitForAssets()` helper that resolves after all `.scene__image` elements have loaded/decoded and `document.fonts.ready` has resolved (research.md §7–10)

**Checkpoint**: Foundation ready — user story implementation can now begin.

---

## Phase 3: User Story 1 - Understand the destination at a glance (Priority: P1) 🎯 MVP

**Goal**: A visitor understands from the hero section alone that this site introduces Johor Bahru golf travel with an editorial intent.

**Independent Test**: Load the page and evaluate the hero section in isolation (per `quickstart.md` scenario 1).

### Implementation for User Story 1

- [X] T009 [P] [US1] Search candidate hero photograph(s) representing the Johor Bahru golf-travel destination online; open each candidate's original source/detail page and confirm the photographer/author and reuse terms before selecting one (research.md §15 steps 1–2)
- [X] T010 [US1] Download the selected hero photo original into `assets/images/hero/`, then re-encode/optimize it to `.webp` at a web-appropriate resolution and file size → `assets/images/hero/hero-01.webp` (depends on: T009)
- [X] T011 [US1] Add the hero image's row to `CREDITS.md` (file path, author, source URL, license, verified date) per `contracts/credits-entry-format.md` (depends on: T010, T004)
- [X] T012 [US1] Populate `#scene-hero` in `index.html`: title "조호바루 골프여행", a Korean-language lead paragraph that frames the editorial angle (a curated showcase, not a place-name list), and an `<img>` pointing at `./assets/images/hero/hero-01.webp` with specific descriptive `alt` text and explicit `width`/`height` attributes (depends on: T006, T010)
- [X] T013 [US1] Style the hero scene in `styles.css`: title/lead typographic hierarchy, and a local gradient scrim/panel sized to the text block (never a full-photo dark overlay) per research.md §12–13 (depends on: T007, T012)

**Checkpoint**: User Story 1 is fully functional and independently testable.

---

## Phase 4: User Story 2 - Explore each golf course's profile (Priority: P1)

**Goal**: For each of the four featured courses, a visitor sees one large photograph paired with substantive Korean editorial writing.

**Independent Test**: Scroll to any single course section and verify it independently delivers a complete profile (photo + two paragraphs + keywords), per `quickstart.md` scenario 2.

### Implementation for User Story 2

- [X] T014 [P] [US2] Source, verify author/license on the original source page, download, and optimize (to `.webp`) a photograph of Horizon Hills Golf & Country Club into `assets/images/horizon-hills/` (see CREDITS.md note: sourced from the venue's official site under a documented editorial-use exception — no CC/Unsplash/Commons photo of this specific club exists)
- [X] T015 [P] [US2] Source, verify author/license on the original source page, download, and optimize (to `.webp`) a photograph of The Els Club Desaru Coast into `assets/images/els-club-desaru/` (same documented exception as T014)
- [X] T016 [P] [US2] Source, verify author/license on the original source page, download, and optimize (to `.webp`) a photograph of Palm Villa Golf & Country Club into `assets/images/palm-villa/` (same documented exception as T014)
- [X] T017 [P] [US2] Source, verify author/license on the original source page, download, and optimize (to `.webp`) a photograph of Impian Golf & Country Club into `assets/images/impian/` (same documented exception as T014; sourced via GolfPass listing for Impian Emas GCC, Sekudai — no dedicated official site)
- [X] T018 [US2] Add `CREDITS.md` rows for all four course images per `contracts/credits-entry-format.md` (depends on: T014, T015, T016, T017, T004)
- [X] T019 [US2] Populate `#scene-horizon-hills` in `index.html`: course name, a one-line Korean subtitle, two Korean body paragraphs covering characteristics/difficulty/recommendation reasons, a distinct keyword/tag list, and an `<img>` with local path, specific `alt` text, and `width`/`height` (depends on: T006, T014)
- [X] T020 [US2] Populate `#scene-els-club-desaru` in `index.html` with the same structure as T019 (depends on: T006, T015)
- [X] T021 [US2] Populate `#scene-palm-villa` in `index.html` with the same structure as T019 (depends on: T006, T016)
- [X] T022 [US2] Populate `#scene-impian` in `index.html` with the same structure as T019 (depends on: T006, T017)
- [X] T023 [US2] Style course scene content in `styles.css`: name/subtitle/body/keyword typographic hierarchy, body copy at 17–20px with 1.65–1.85 line-height as an independent readable block (not a caption), local gradient scrim, and keyword tag styling (depends on: T007, T019, T020, T021, T022) — covered by the shared `.scene__name`/`.scene__subtitle`/`.scene__body`/`.scene__keywords` rules already in the base layer (T007); no course-specific override needed pending DESIGN.md

**Checkpoint**: User Stories 1 AND 2 both work independently — the site now has its full core editorial content.

---

## Phase 5: User Story 3 - Enjoy a continuous scroll experience on desktop (Priority: P2)

**Goal**: A desktop visitor experiences smooth, connected transitions between the hero and each course section via one master GSAP timeline and one ScrollTrigger pin.

**Independent Test**: On a desktop-sized viewport, scroll top to bottom slowly and then with a fast flick and confirm no scene is skipped or hard-cut, per `quickstart.md` scenario 3.

### Implementation for User Story 3

- [X] T024 [US3] Implement the single `ScrollTrigger` pin configuration on `#stage` in `script.js` (`trigger: stage, pin: true, scrub: 1, ease: 'none', start: 'top top', end: '+=<N>%'`) (research.md §2–3; depends on: T008, T006)
- [X] T025 [US3] Build the master GSAP timeline spanning all 5 scenes in DOM order, sizing each segment to `SCENE_DURATION=3` timeline units with `OVERLAP=0.8` (~27%) shared between adjacent scenes, in `script.js` (research.md §4–5; depends on: T024)
- [X] T026 [US3] Add the per-scene image-scale tween (`scale` 1 → 1.06 during Hold, → 1.15 during Exit) on `.scene__image` within each segment in `script.js` (depends on: T025)
- [X] T027 [US3] Add the mask/overflow reveal (`clip-path: inset()` animation on the `.scene__bg` wrapper, 8% → 0%) on scene entry in `script.js` (depends on: T025)
- [X] T028 [US3] Add foreground/background parallax (`yPercent` on `.scene__image` vs. `y` on `.scene__content`, differing rates) within each segment's Hold phase in `script.js` (depends on: T025)
- [X] T029 [US3] Add text fade + translate (`opacity` 0→1 with a `y` translate, reversed on exit) for `.scene__content` in `script.js` (depends on: T025)
- [X] T030 [US3] Add the tunnel cross-fade transition — outgoing scene's Exit window and incoming scene's Enter window occupy the exact same absolute timeline position (`exitStart === nextSceneStart`) — in `script.js` (depends on: T026, T029)
- [X] T031 [US3] Gate pin/timeline creation on `waitForAssets()` (T008) resolving, then perform the initial `ScrollTrigger.refresh()` call in `script.js` (research.md §10; depends on: T025)
- [X] T032 [US3] Wire the debounced resize/orientationchange handler (T008) to call `ScrollTrigger.refresh()` in `script.js` (research.md §9; depends on: T031)
- [X] T033 [US3] Toggle `will-change: transform` only on the actively-animating layer per scene window, via `is-active` class add/remove at each scene's Enter start / Exit end, in `script.js` + `styles.css` (research.md §11; depends on: T025)

**Checkpoint**: User Story 3 is independently testable on desktop; US1/US2 content now plays through the full scroll narrative.

---

## Phase 6: User Story 4 - Read comfortably on mobile (Priority: P2)

**Goal**: A mobile visitor gets the same content via a normal vertical scroll with simple transitions, with the pin/timeline released.

**Independent Test**: On a mobile-sized viewport, scroll through the entire page and confirm all content is reachable with no pin/scroll-jacking, per `quickstart.md` scenario 4.

### Implementation for User Story 4

- [X] T034 [US4] Implement the `isMobile` branch in `script.js` (`desiredMode()`/`applyMode()`) that skips pin/timeline creation entirely and leaves `#stage` in its default (non-`stage--pinned`) state (research.md §8; depends on: T008, T024)
- [X] T035 [US4] Implement the normal top-to-bottom document-flow layout in `styles.css` (image, then title/subtitle, then body, then keywords), no pin/scrub — this is the **default** ruleset (no class needed), with the pinned layout as the opt-in override block further down the file, per the scene-markup-contract's no-JS-safe-by-default requirement (depends on: T007)
- [X] T036 [US4] Extend the resize handler (`handleResize`) to detect the mobile breakpoint being crossed and call `applyMode()` (tear down/rebuild pinned-vs-static) rather than only refreshing, in `script.js` (research.md §8–9; depends on: T032, T034)

**Checkpoint**: User Story 4 is independently testable on mobile viewports.

---

## Phase 7: User Story 5 - Access the full page without a mouse or with motion reduced (Priority: P3)

**Goal**: Keyboard-only and reduced-motion visitors can still reach and read the entire page.

**Independent Test**: Tab through the page with no mouse, and separately load with `prefers-reduced-motion` enabled; confirm full reachability/readability in each case, per `quickstart.md` scenarios 5–6.

### Implementation for User Story 5

- [ ] T037 [US5] Implement the `prefersReducedMotion` branch in `script.js` that skips pin/timeline creation entirely and applies the `stage--static` class, reusing T035's CSS (research.md §7; depends on: T008, T035)
- [ ] T038 [US5] Refine `:focus-visible` styling and verify a logical DOM/tab order across the page's header/main/section landmarks in `styles.css` (depends on: T007)
- [ ] T039 [US5] Manually verify keyboard-only navigation and `prefers-reduced-motion` emulation each reach 100% of hero/course content; adjust markup or CSS in `index.html`/`styles.css` as needed (depends on: T037, T038)

**Checkpoint**: All five user stories are independently functional.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Whole-site verification that spans every story.

- [ ] T040 [P] Verify every file under `assets/images/` loads correctly in-browser (no 404, no corrupt file, correct declared format) using the DevTools Network panel
- [ ] T041 [P] Confirm every file under `assets/images/` has exactly one matching row in `CREDITS.md` per `contracts/credits-entry-format.md`
- [ ] T042 Run the full `quickstart.md` validation guide (all 11 scenarios) end to end and record the results
- [ ] T043 Simulate a GitHub Pages project-subpath deployment (serve the site from a nested folder) and confirm zero broken relative-path references (SC-005)
- [ ] T044 Once `DESIGN.md` is supplied at the repository root, read it and reconcile `styles.css`'s visual tokens (colors, exact type scale, spacing) against it, closing the Open Dependency noted in `plan.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories.
- **User Stories (Phase 3–7)**: All depend on Foundational phase completion.
  - US1 and US2 (both P1) have no dependency on each other and can proceed in parallel.
  - US3 depends on `#stage`/`.scene` markup existing (T006) but not on US1/US2 content being final; in practice, verifying US3 is easiest once US1/US2 content is in place.
  - US4 depends on US3's pin implementation (T024) existing, since it branches around it — but its own static-flow CSS (T035) can be built in parallel with US3.
  - US5 depends on US4's static-flow CSS (T035) being present to reuse for the reduced-motion fallback.
- **Polish (Phase 8)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational — no dependency on other stories.
- **User Story 2 (P1)**: Can start after Foundational — no dependency on other stories; independent of US1.
- **User Story 3 (P2)**: Can start after Foundational (needs the `.scene` markup skeleton, not story content).
- **User Story 4 (P2)**: Builds on US3's pin code path (branches around it) but is otherwise independent content-wise.
- **User Story 5 (P3)**: Reuses US4's static-flow CSS for its reduced-motion fallback.

### Within Each User Story

- Image sourcing/licensing before markup population (US1/US2).
- Markup population before styling (US1/US2).
- Pin → timeline → per-effect tweens → load-gating → resize wiring, in that order (US3).
- Mode-detection before its CSS is exercised (US4/US5).

### Parallel Opportunities

- T002, T003, T004 (Setup) can run in parallel.
- T007, T008 (Foundational) can run in parallel once T005/T006 exist.
- T009 (US1 sourcing) and T014–T017 (US2 sourcing, each a different course/file) can all run in parallel with each other.
- Once Foundational is done, US1 and US2 can be staffed and executed in parallel as two independent P1 tracks.
- T040, T041 (Polish) can run in parallel.

---

## Parallel Example: Image Sourcing Across User Stories 1 & 2

```bash
# Launch all five image-sourcing tasks together (different files/network resources, no shared dependency):
Task: "Search/verify/download/optimize hero photo -> assets/images/hero/"
Task: "Search/verify/download/optimize Horizon Hills photo -> assets/images/horizon-hills/"
Task: "Search/verify/download/optimize The Els Club Desaru Coast photo -> assets/images/els-club-desaru/"
Task: "Search/verify/download/optimize Palm Villa photo -> assets/images/palm-villa/"
Task: "Search/verify/download/optimize Impian photo -> assets/images/impian/"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 — both P1)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories).
3. Complete Phase 3 (US1) and Phase 4 (US2) — together these form the minimum viable informational site: hero + all four substantive course profiles, readable with no JavaScript at all.
4. **STOP and VALIDATE**: Run `quickstart.md` scenarios 1–2 and 7 (no-JS baseline).
5. This static, unanimated page is already deployable to GitHub Pages if needed.

### Incremental Delivery

1. Setup + Foundational → foundation ready.
2. Add US1 + US2 → validate independently → deployable content-complete MVP.
3. Add US3 (desktop scroll narrative) → validate independently → richer desktop experience.
4. Add US4 (mobile fallback) → validate independently → mobile-safe.
5. Add US5 (keyboard + reduced motion) → validate independently → accessibility baseline closed.
6. Polish (Phase 8) → final QA, credits/licensing audit, subpath deployment check, DESIGN.md reconciliation.

### Solo Implementer Strategy

Given this is a small static site (no team parallelization needed), the recommended sequential order is exactly the phase order above: Setup → Foundational → US1 → US2 → US3 → US4 → US5 → Polish. Image-sourcing subtasks within US1/US2 (T009, T014–T017) are the best candidates to batch together since they are the same kind of work repeated across scenes.

---

## Notes

- `[P]` tasks touch different files or independent external resources (image sourcing) — no shared-file conflicts.
- `[Story]` label maps each task to its user story for traceability back to `spec.md`.
- No automated tests were generated; `quickstart.md` is the authoritative manual validation suite (T042).
- Commit after each task or logical group.
- Stop at any checkpoint to validate a story independently before continuing.
- Do not mark `DESIGN.md`-dependent visual polish (T044) as blocking the rest of implementation — per `plan.md`'s Open Dependency, it only blocks final visual styling, not structure/behavior/content.

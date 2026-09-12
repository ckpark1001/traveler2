# Phase 1 Data Model: 조호바루 골프여행

This is a static site with no database — "data" here means the content model that
`index.html` must encode and that `script.js` binds its timeline to. There are no state
transitions; every entity is fixed content decided at authoring time.

## Scene

Represents one stop in the single master timeline: the hero, or one golf course profile.

| Field | Type | Notes |
|---|---|---|
| `id` | string slug | One of: `hero`, `horizon-hills`, `els-club-desaru`, `palm-villa`, `impian`. Used as the DOM id/data-attribute and the GSAP timeline label. |
| `order` | integer | Fixed display/timeline order: hero (0), Horizon Hills (1), The Els Club Desaru Coast (2), Palm Villa (3), Impian (4) — per `spec.md` Assumptions. |
| `kind` | enum | `hero` \| `course` |
| `displayName` | string (Korean/English mixed as applicable) | e.g. "Horizon Hills Golf & Country Club" (course names stay in English per the four names fixed by the constitution/spec). |
| `title` | string (Korean) | One-line title/subtitle shown under the display name (hero: the site's editorial framing line; course: a one-line hook). |
| `leadOrParagraphs` | string[] | Hero: exactly 1 lead paragraph. Course: exactly 2 body paragraphs (characteristics, difficulty, recommendation reasons), per FR-002/FR-005. |
| `keywords` | string[] | Short tag/keyword list per scene (e.g. difficulty, terrain, signature feature), rendered with typographic distinction from body copy (research.md §13). |
| `image` | Image (1) | The scene's single large photograph (background layer for parallax). |

## Image

| Field | Type | Notes |
|---|---|---|
| `sceneId` | string | FK to `Scene.id`. |
| `localPath` | string (relative) | e.g. `./assets/images/horizon-hills/horizon-hills-01.webp`. Must never be an external URL (FR-013). |
| `altText` | string | Specific, descriptive alt text — not generic ("golf course photo"). |
| `width` / `height` | integer | Intrinsic pixel dimensions, set as HTML attributes / CSS `aspect-ratio` to prevent layout shift. |
| `creditsEntryId` | string | FK to the matching `CREDITS.md` entry (see `contracts/credits-entry-format.md`). |

## Timeline Segment (behavioral, not persisted data — documented for implementation clarity)

| Field | Notes |
|---|---|
| `label` | GSAP timeline label, equal to `Scene.id`. |
| `startOffset` | Position on the master timeline where this scene's reveal begins; overlaps the previous scene's exit by 20–30% (research.md §4). |
| `holdDuration` | Portion of the segment where the scene is fully visible/readable (research.md §5). |
| `exitOverlap` | Portion overlapping with the next scene's `startOffset` (same 20–30% cross-fade). |
| `mode` | `pinned-timeline` (desktop, motion allowed) \| `static-flow` (mobile or reduced-motion; research.md §7–8). |

## CreditsEntry

One row per image file in `assets/images/`, recorded in `CREDITS.md`. Format defined in
`contracts/credits-entry-format.md`. Fields: `filePath`, `author`, `sourceUrl`, `license`,
`verifiedDate`.

## Validation rules (derived from spec.md Functional Requirements)

- Exactly 5 scenes total: 1 hero + 4 named courses (FR-001, FR-003).
- Every course scene has exactly 1 image and exactly 2 `leadOrParagraphs` entries; the hero
  scene has exactly 1 image (optional per spec Assumptions) and exactly 1 lead paragraph
  (FR-002, FR-004, FR-005).
- Every `Image.localPath` is a relative path under `./assets/images/` — no absolute paths, no
  external URLs (FR-012, FR-013).
- Every `Image` has a corresponding `CreditsEntry` with all five fields populated — no entry may
  cite a placeholder or unverified source (FR-013, Constitution Principle VIII).
- All `title` and `leadOrParagraphs` text is Korean (FR-006).

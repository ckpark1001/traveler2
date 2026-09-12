# Phase 0 Research: 조호바루 골프여행

All items below were either fully specified by the user's `/speckit-plan` input (transcribed
here as binding decisions) or resolved with a documented default where the input left a detail
open. No `NEEDS CLARIFICATION` markers remain.

## 1. GSAP delivery method

- **Decision**: Vendor GSAP core + the ScrollTrigger plugin as local minified files under
  `vendor/gsap/`, loaded via plain `<script>` tags before `script.js`. No CDN, no npm/build
  step.
- **Rationale**: Keeps the site fully self-contained and independent of a third-party CDN's
  availability, consistent with "no build process, static files served as-is" and the general
  no-hotlink spirit of the constitution. GSAP (including ScrollTrigger) is free to use for this
  kind of project under its current license.
- **Alternatives considered**: CDN `<script src>` — rejected to avoid an external runtime
  dependency at page-load time and to guarantee the site works even if a CDN is unreachable.

## 2. Single pin, single master timeline

- **Decision**: One pinned full-viewport "stage" element hosts all scenes as stacked absolutely
  positioned layers; one `gsap.timeline({ scrollTrigger: { trigger: stage, pin: true, scrub: 1,
  ease: "none", start: "top top", end: "+=<N>vh" } })` drives the entire journey via labels
  (`hero`, `horizonHills`, `elsClubDesaru`, `palmVilla`, `impian`, `end`).
- **Rationale**: Explicit instruction: "골프장별로 ScrollTrigger pin을 여러 개 만들지 말고 전체
  여정에 하나의 pin과 하나의 master timeline을 우선 사용". A single pin also makes the required
  20–30% cross-fade between scenes straightforward (overlapping label offsets on one timeline)
  and avoids pin-spacer stacking issues that come with multiple independent pins.
- **Alternatives considered**: One `ScrollTrigger` pin per course section — rejected per
  explicit instruction and because independent pins make continuous cross-fade/tunnel
  transitions between scenes significantly harder to keep smooth.

## 3. Scrub value and easing

- **Decision**: `scrub: 1` (numeric, ~1 second smoothing) on the master timeline's
  `scrollTrigger` config, with `ease: "none"` on the tweens inside the timeline.
- **Rationale**: Explicit instruction to prefer a numeric value in the 1–1.5s range over
  `scrub: true`, and to use `none` easing inside the scrubbed range so scenes never appear to
  suddenly accelerate or decelerate. `1` is the starting value; QA during implementation may
  tune it up to `1.5` if input still feels too tightly coupled to the scrollbar.
- **Alternatives considered**: `scrub: true` — rejected per explicit instruction (feels too
  tightly, non-smoothly coupled to raw scroll position).

## 4. Scene transition techniques (per timeline segment)

- **Decision**: Each of the 5 scene labels spans a generous fraction of the total scroll track
  and layers these effects, all driven by the same scrubbed timeline position:
  - **Image scale**: a subtle `scale` tween (e.g. 1 → 1.06–1.12) on the scene's photo layer.
  - **Reveal**: `clip-path` (or an `overflow: hidden` wrapper) animating a mask open on scene
    entry rather than a hard cut.
  - **Parallax**: the photo (background) layer and the text/keyword block (foreground) layer
    move at different rates (`yPercent`/`y` offsets) within the same segment.
  - **Text fade + translate**: heading/body/keywords animate `opacity` 0→1 with a small `y`
    translate on entry, and reverse on exit.
  - **Cross-fade**: adjacent scene labels overlap by 20–30% of their duration (e.g. the next
    scene's label is placed at `"-=25%"` of the previous scene's segment) so the outgoing and
    incoming scenes are briefly visible together.
  - **Tunnel transition**: the outgoing scene scales up slightly while fading out at the same
    time the incoming scene scales in from slightly-larger-than-1 to 1 while fading in, both
    driven by the overlapping timeline range above, so the motion reads as one continuous push
    rather than two independent cuts.
- **Rationale**: Directly reinterprets the requested effect list without copying a specific
  reference site, using only `transform`/`opacity`/`clip-path` for performance (see §11).
- **Alternatives considered**: Hard cuts between scenes (simplest) — rejected, contradicts the
  explicit "연속적인 스크롤 감각" and "tunnel transition" requirements.

## 5. Scroll distance / dwell time per scene

- **Decision**: Size the pinned track's total scroll distance (`end: "+=<N>vh"`) so each of the
  5 scenes gets generous dwell room for its reveal, a readable hold, and its exit/cross-fade —
  a starting budget of roughly 120–150vh of scroll per scene (≈600–750vh total), tuned during
  implementation QA against "fast wheel movement must not instantly swap scenes."
- **Rationale**: Explicit requirement: "각 골프장에 충분한 스크롤 거리와 본문 체류 구간을 준다"
  and "빠르게 휠을 움직여도 장면이 순간 교체되지 않아야 한다."
- **Alternatives considered**: A fixed short per-scene distance (e.g. 100vh flat) — rejected as
  too tight to guarantee a readable dwell period once cross-fade overlap is subtracted.

## 6. No scroll-snap, no wheel hijacking, no forced scrollTo

- **Decision**: Rely solely on native scrolling plus ScrollTrigger's scrub; do not set
  `scroll-snap-type` anywhere, do not attach `wheel`/`touchmove` interceptors, and never call
  `window.scrollTo`/`scrollIntoView` to force position.
- **Rationale**: Explicit instruction. It also keeps native scroll behavior intact for trackpad,
  touch, and assistive-technology users (supports Principle V/VI).

## 7. Reduced-motion handling

- **Decision**: On init, check
  `window.matchMedia('(prefers-reduced-motion: reduce)').matches`. If true, skip creating the
  ScrollTrigger pin/timeline entirely; apply the same static, normal-vertical-flow CSS used for
  the mobile fallback (§8) so all scenes stack in document order with at most simple CSS
  opacity fades (no pin, no scrub).
- **Rationale**: Explicit instruction: "prefers-reduced-motion에서는 ScrollTrigger 기반 강한
  전환을 끄고 일반 세로 스크롤 페이지로 동작하게 한다." Checking once at load satisfies the
  spec's acceptance criteria; listening for live changes to the media query is a possible
  future enhancement, not required for this feature.

## 8. Mobile fallback breakpoint & mechanism

- **Decision**: Use `window.matchMedia('(max-width: 768px)')` as the signal to skip pin/timeline
  creation and switch to the static stacked layout (image, then heading, then body paragraphs,
  then keywords, per scene, in normal document flow with simple CSS transitions only). Re-check
  this match on a debounced resize/orientation-change handler; if the mode (pinned vs. static)
  needs to change, destroy and rebuild the relevant ScrollTrigger state rather than leaving it
  half-configured.
- **Rationale**: 768px is a conventional tablet/mobile boundary and a reasonable default; the
  user's instruction fixes the *behavior* (release the pin, keep all text) but not an exact
  pixel value.
- **Alternatives considered**: Pointer-type detection (`pointer: coarse`) alone — rejected as
  the sole signal because some coarse-pointer devices (large tablets) have enough width for the
  desktop experience; width is the more direct proxy for whether the pinned stage is usable.

## 9. Resize handling

- **Decision**: Debounce `window resize`/`orientationchange`, then call `ScrollTrigger.refresh()`
  to recompute pin start/end and scene offsets; if the resize crosses the mobile breakpoint
  (§8), tear down and reinitialize the appropriate mode instead of just refreshing.
- **Rationale**: Explicit requirement: "리사이즈 시 timeline과 trigger 위치가 정상적으로 다시
  계산되어야 한다."

## 10. Image/font load gating before first `ScrollTrigger.refresh()`

- **Decision**: Before creating the pin/timeline, wait for all hero/course `<img>` elements to
  finish loading (`decode()`/`load` events) and for `document.fonts.ready`, then perform the
  initial setup and an explicit `ScrollTrigger.refresh()`.
- **Rationale**: Explicit requirement to call `ScrollTrigger.refresh()` after image/font loading
  completes, so pin distances aren't computed against not-yet-final layout.

## 11. Performance rules

- **Decision**: Animate only `transform` (`x`/`y`/`scale`) and `opacity` (plus `clip-path` for
  reveals, which is compositor-friendly); never animate `filter`/`backdrop-filter`/blur
  continuously — if a blurred backdrop is used at all, it is a static, non-animated element.
  Apply `will-change: transform` only to the layer actively animating in the current scene
  window (toggled via the timeline's enter/leave callbacks or a class swap), not globally on
  all layers.
- **Rationale**: Matches the explicit performance/stability principles the user listed
  verbatim.

## 12. Text/photo contrast without darkening the whole photo

- **Decision**: Use a local gradient scrim or panel sized to the text block's footprint (e.g. a
  bottom-anchored `linear-gradient` panel behind the heading/body/keywords), rendered as its own
  element between the photo and the text layer, instead of a full-photo dark overlay.
- **Rationale**: Explicit instruction: "사진 전체를 과도하게 어둡게 하지 말고 텍스트 주변에
  국소 gradient 또는 패널을 사용한다."

## 13. Typography hierarchy

- **Decision**: Four distinct type levels per scene — large course name, a one-line
  subtitle/title, body copy at 17–20px with 1.65–1.85 line-height, and a visually distinct
  smaller keyword/tag row (e.g. small-caps or pill-style labels). Exact font sizes/weights
  beyond the body-copy range are deferred to `DESIGN.md` (see plan.md's Open Dependency); the
  17–20px / 1.65–1.85 body range is binding regardless of `DESIGN.md`'s specifics, per the
  user's explicit instruction.
- **Rationale**: Explicit instruction on body sizing plus a general hierarchy requirement.

## 14. Fonts

- **Decision**: Do not copy any commercial/custom font file without a verified license. Once
  `DESIGN.md` is available, use its specified typeface only if it is self-hostable under a
  confirmed license; otherwise fall back to a visually close system sans-serif stack (e.g.
  `-apple-system, "Segoe UI", "Noto Sans KR", sans-serif`, chosen for Korean body copy support)
  or a legitimately licensed open web font (e.g. a Google Fonts family such as "Noto Sans KR" or
  an OFL-licensed family like "Pretendard") if closer visual matching is later required. This
  decision is provisional pending `DESIGN.md`.
- **Rationale**: Explicit instruction against unauthorized font copying, with a legal fallback
  path.

## 15. Image sourcing, licensing, and local asset pipeline

- **Decision**: For the hero and each of the four courses:
  1. Search candidate photographs online.
  2. Open each candidate's original detail/source page and confirm the author and reuse terms
     before selecting a final image.
  3. Download the selected originals into `assets/images/<scene>/` — never hotlink an external
     URL.
  4. Optimize format/resolution/file size for web delivery (re-encode to a modern format such as
     `.webp`, sized to realistic maximum display dimensions, with reasonable compression).
  5. Reference images in `index.html` via local relative paths (`./assets/images/...`) with
     specific, descriptive `alt` text (not generic).
  6. Record, per file, its path, author, source URL, license, and verification date in
     `CREDITS.md` (format specified in `contracts/credits-entry-format.md`).
  7. Before considering the feature done, verify every image actually loads in a browser (no
     404, no corrupt file, correct declared format).
  8. Never generate or leave in place a placeholder image at any stage.
- **Rationale**: Transcribes the user's explicit sourcing/legal/QA process directly; matches
  Constitution Principle VIII.
- **Open scope note**: `spec.md`'s Assumptions section calls for one large photograph per
  course profile. The plan's foreground/background parallax effect (§4) is achieved by treating
  that single photo as the background layer and the text/keyword block as the foreground layer
  — not by sourcing a second photo per course — to stay consistent with the ratified spec.
  Sourcing a second image per course for a true two-photo parallax is an option for a future
  iteration, not required for this feature.

## 16. GitHub Pages deployment specifics

- **Decision**: Include a root `.nojekyll` file so GitHub Pages' Jekyll processing doesn't
  filter folders like `assets/`; use only `./`-relative paths everywhere (never a leading `/`);
  publish straight from the repository root (e.g. Pages "Deploy from a branch" pointing at
  `/ (root)`) since there is no build output directory.
- **Rationale**: Explicit instruction; matches Constitution Principle IV/X.
- **Related open item**: the previously scaffolded `app/` Next.js project (created before this
  constitution existed) must not be the Pages publish source — see plan.md's structure note.

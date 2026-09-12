# Quickstart & Validation Guide: 조호바루 골프여행

No build step exists for this feature. This guide runs and validates the static site directly.

## Prerequisites

- Any static file server for local testing (the page uses relative paths and should be served
  over `http://`, not opened via `file://`, so behavior matches GitHub Pages). Any of these
  work — pick whichever is already available:
  - `npx serve .`
  - `python -m http.server 8080`
  - VS Code "Live Server" extension
- A browser with DevTools (for responsive mode, network throttling, and the "Emulate CSS
  media feature `prefers-reduced-motion`" panel).

## Run locally

```bash
# from the repository root, once index.html/styles.css/script.js exist
npx serve .
# open the printed local URL in a browser
```

## Validation scenarios (map to spec.md Acceptance Scenarios)

1. **Hero comprehension (User Story 1)** — Load the page. Confirm the hero shows the title
   "조호바루 골프여행" and a Korean lead paragraph above the fold, without scrolling.

2. **Course profiles (User Story 2)** — Scroll through all four course scenes. For each,
   confirm: one large photo, exactly two Korean body paragraphs (not a caption-sized snippet),
   and a keyword row distinct from body copy.

3. **Desktop continuous scroll (User Story 3)** — On a desktop-sized viewport (≥1024px wide),
   scroll from top to bottom slowly, then quickly (fast wheel/trackpad flick). Confirm: no
   scene is skipped or instantly swapped even on a fast flick; adjacent scenes visibly overlap
   (cross-fade) rather than hard-cutting; motion stays smooth without sudden speed changes.

4. **Mobile fallback (User Story 4)** — In DevTools responsive mode at a phone width (e.g.
   390×844), reload the page. Confirm: no pin/scroll-jacking occurs; the hero and all four
   courses appear in normal top-to-bottom order; all text present on desktop is also present
   here, unabridged.

5. **Keyboard access (User Story 5, part 1)** — With a mouse disconnected (or simply not used),
   press Tab repeatedly from page load. Confirm a visible focus indicator moves through every
   interactive element in a logical order, and no content is unreachable.

6. **Reduced motion (User Story 5, part 2)** — In DevTools, enable "Emulate CSS media feature
   `prefers-reduced-motion: reduce`", then reload. Confirm the pinned/scrubbed timeline does not
   run at all and the page behaves like the mobile static-flow fallback, with all content
   visible without needing to trigger any animation.

7. **No-JS baseline (Edge Cases)** — Disable JavaScript and reload. Confirm the hero and all
   four course sections' text and images are still present and readable in normal document
   order (GSAP is purely a progressive enhancement).

8. **Resize correctness (research.md §9)** — On desktop, resize the browser window (including
   crossing the ~768px mobile breakpoint) and confirm the pin/timeline offsets and mode switch
   recompute correctly with no dead zones or misaligned pins.

9. **Relative-path / GitHub Pages subpath simulation (SC-005)** — Serve the project from a
   subdirectory (e.g. copy the site into `./preview/johor-golf/` and serve the parent folder),
   then load `http://localhost:PORT/preview/johor-golf/`. Confirm every navigation and image
   reference still resolves (zero 404s in the network panel) — this simulates a GitHub Pages
   project URL like `https://<user>.github.io/<repo>/`.

10. **Image integrity & credits (SC-002, Constitution Principle VIII)** — With DevTools Network
    panel open, reload and confirm zero broken/404 image requests and zero placeholder or
    solid-color boxes. Then confirm every file under `assets/images/` has exactly one matching
    row in `CREDITS.md` per `contracts/credits-entry-format.md`.

11. **Layout-shift check (research.md §10–11)** — With network throttled ("Slow 3G" or
    similar), reload and visually confirm no layout jump occurs as images finish loading
    (explicit `width`/`height`/`aspect-ratio` should prevent this).

## Definition of done for this feature

All 11 scenarios above pass, the Quality Gates listed in `.specify/memory/constitution.md`
pass, and `DESIGN.md` (once supplied — see plan.md's Open Dependency) has been read and applied
to `styles.css`.

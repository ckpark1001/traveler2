# Contract: Scene Markup ↔ script.js Binding

This project has no external API, but `script.js` (the GSAP master timeline) and `index.html`
must agree on a stable markup contract so the timeline can select and animate each scene's
layers. This file is that contract.

## Stage & scene structure

```html
<main id="stage" data-scene-count="5">
  <section class="scene" id="scene-hero" data-scene="hero" data-kind="hero">
    <div class="scene__bg">
      <img class="scene__image" src="./assets/images/hero/....webp" alt="..." width="…" height="…">
    </div>
    <div class="scene__scrim"></div>
    <div class="scene__content">
      <p class="scene__eyebrow">…</p>       <!-- optional site framing line -->
      <h1 class="scene__title">조호바루 골프여행</h1>
      <p class="scene__lead">…</p>          <!-- hero: 1 lead paragraph -->
    </div>
  </section>

  <section class="scene" id="scene-horizon-hills" data-scene="horizon-hills" data-kind="course">
    <div class="scene__bg">
      <img class="scene__image" src="./assets/images/horizon-hills/....webp" alt="..." width="…" height="…">
    </div>
    <div class="scene__scrim"></div>
    <div class="scene__content">
      <h2 class="scene__name">Horizon Hills Golf & Country Club</h2>
      <p class="scene__subtitle">…</p>       <!-- one-line title -->
      <p class="scene__body">…</p>           <!-- paragraph 1 of 2 -->
      <p class="scene__body">…</p>           <!-- paragraph 2 of 2 -->
      <ul class="scene__keywords">
        <li>…</li>
      </ul>
    </div>
  </section>

  <!-- repeat .scene for els-club-desaru, palm-villa, impian, same shape as horizon-hills -->
</main>
```

## Binding rules `script.js` MUST follow

- Select scenes via `[data-scene]`, never by index alone, and read `data-scene`/`data-kind` to
  know which timeline label and behavior to apply. This keeps HTML content edits from silently
  breaking the timeline.
- `Scene.order` (data-model.md) is expressed purely by document order of `.scene` elements —
  `script.js` MUST NOT reorder scenes; it only reads them in DOM order to build timeline labels.
- Each scene's animatable layers MUST carry stable class hooks: `.scene__bg`/`.scene__image`
  (background/parallax + scale target), `.scene__scrim` (contrast panel, static — never
  animated per research.md §11–12), `.scene__content` (foreground text block — fade/translate +
  parallax target).
- `script.js` MUST NOT depend on any inline styles or JS-generated markup for initial content —
  all text/images must already be present in `index.html` so the page is fully readable with
  JavaScript disabled (Edge Cases in spec.md).
- Mode switching (`pinned-timeline` vs `static-flow`, data-model.md) is expressed by toggling a
  single class on `#stage` (e.g. `stage--static`), never by removing/re-inserting scene markup.

## CSS contract

- `styles.css` MUST provide a fully readable, normally-flowing presentation of `.scene` when
  `#stage` has the `stage--static` class (or no JS has run at all) — this is the mobile and
  reduced-motion fallback baseline, and also the no-JS baseline.
- `styles.css` MUST NOT rely on JavaScript to make `.scene__content` text visible; any
  JS-driven `opacity: 0` starting state must be applied by `script.js` at runtime (e.g. via
  `gsap.set`), never hardcoded in the stylesheet, so static/no-JS rendering is unaffected.

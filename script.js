(function () {
  "use strict";

  var stage = document.getElementById("stage");
  var scenes = Array.prototype.slice.call(stage.querySelectorAll(".scene"));

  var reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var mobileQuery = window.matchMedia("(max-width: 768px)");

  function prefersReducedMotion() {
    return reducedMotionQuery.matches;
  }

  function isMobile() {
    return mobileQuery.matches;
  }

  /** Resolves once every scene image has loaded/decoded and web fonts are ready,
   * so ScrollTrigger never measures against not-yet-final layout (research.md §10). */
  function waitForAssets() {
    var imagePromises = scenes
      .map(function (scene) {
        return scene.querySelector(".scene__image");
      })
      .filter(function (img) {
        return img && img.getAttribute("src");
      })
      .map(function (img) {
        if (img.complete) {
          return img.decode ? img.decode().catch(function () {}) : Promise.resolve();
        }
        return new Promise(function (resolve) {
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true });
        });
      });

    var fontsReady =
      document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();

    return Promise.all([Promise.all(imagePromises), fontsReady]);
  }

  function debounce(fn, wait) {
    var timer = null;
    return function () {
      var args = arguments;
      var context = this;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, wait);
    };
  }

  // ----------------------------------------------------------------------
  // Pinned desktop journey: one ScrollTrigger pin + one master timeline
  // (research.md §2-5). Built once; torn down and rebuilt only if the mode
  // (pinned vs static) needs to change on resize (research.md §8-9).
  // ----------------------------------------------------------------------

  var journeyScrollTrigger = null;
  var journeyTimeline = null;

  function buildPinnedJourney() {
    gsap.registerPlugin(ScrollTrigger);

    var SCENE_DURATION = 3; // arbitrary timeline units; scrub maps these to scroll
    var OVERLAP = 0.8; // ~27% of SCENE_DURATION -> the required 20-30% cross-fade
    var STEP = SCENE_DURATION - OVERLAP;

    stage.classList.add("stage--pinned");

    // Initial per-scene state. Only script.js ever sets opacity:0 / transforms —
    // never hardcoded in CSS — so static/no-JS rendering is unaffected
    // (contracts/scene-markup-contract.md).
    scenes.forEach(function (scene, i) {
      var image = scene.querySelector(".scene__image");
      var bg = scene.querySelector(".scene__bg");
      var content = scene.querySelector(".scene__content");
      var isFirst = i === 0;

      gsap.set(scene, { opacity: isFirst ? 1 : 0 });
      gsap.set(image, { scale: isFirst ? 1 : 1.15, yPercent: 0 });
      gsap.set(bg, { clipPath: isFirst ? "inset(0% 0% 0% 0%)" : "inset(8% 8% 8% 8%)" });
      gsap.set(content, { y: isFirst ? 0 : 40, opacity: isFirst ? 1 : 0 });
      if (isFirst) {
        scene.classList.add("is-active");
      }
    });

    var tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: stage,
        start: "top top",
        end: "+=" + scenes.length * 130 + "%",
        scrub: 1,
        pin: true,
        anticipatePin: 1
      }
    });

    scenes.forEach(function (scene, i) {
      var image = scene.querySelector(".scene__image");
      var bg = scene.querySelector(".scene__bg");
      var content = scene.querySelector(".scene__content");

      var sceneStart = i * STEP;
      var holdStart = sceneStart + OVERLAP;
      var holdDuration = SCENE_DURATION - 2 * OVERLAP;
      var exitStart = sceneStart + SCENE_DURATION - OVERLAP;
      var isLast = i === scenes.length - 1;

      tl.set(scene, { className: "+=is-active" }, sceneStart);

      if (i > 0) {
        // Enter: mask reveal + tunnel scale-in + text fade/translate in,
        // cross-fading with the previous scene's Exit over the same window.
        tl.to(scene, { opacity: 1, duration: OVERLAP }, sceneStart)
          .to(image, { scale: 1, duration: OVERLAP }, sceneStart)
          .to(bg, { clipPath: "inset(0% 0% 0% 0%)", duration: OVERLAP }, sceneStart)
          .to(content, { y: 0, opacity: 1, duration: OVERLAP }, sceneStart);
      }

      // Hold: the scene reads as fully in place; a slow continuous zoom plus a
      // small foreground/background parallax offset keeps the frame alive
      // without any layout-affecting property (transform/opacity only).
      tl.to(image, { scale: 1.06, yPercent: -2, duration: holdDuration }, holdStart).to(
        content,
        { y: -12, duration: holdDuration },
        holdStart
      );

      if (!isLast) {
        // Exit: continues the zoom further (tunnel push-through) while fading,
        // exactly overlapping the next scene's Enter window above.
        tl.to(scene, { opacity: 0, duration: OVERLAP }, exitStart)
          .to(image, { scale: 1.15, duration: OVERLAP }, exitStart)
          .to(content, { y: -40, opacity: 0, duration: OVERLAP }, exitStart);
      }

      tl.set(scene, { className: "-=is-active" }, exitStart + (isLast ? 0 : OVERLAP));
    });

    journeyTimeline = tl;
    journeyScrollTrigger = tl.scrollTrigger;
  }

  function teardownPinnedJourney() {
    if (journeyScrollTrigger) {
      journeyScrollTrigger.kill();
      journeyScrollTrigger = null;
    }
    if (journeyTimeline) {
      journeyTimeline.kill();
      journeyTimeline = null;
    }
    stage.classList.remove("stage--pinned");
    scenes.forEach(function (scene) {
      scene.classList.remove("is-active");
      gsap.set(scene, { clearProps: "opacity" });
      gsap.set(scene.querySelector(".scene__image"), { clearProps: "scale,yPercent" });
      gsap.set(scene.querySelector(".scene__bg"), { clearProps: "clipPath" });
      gsap.set(scene.querySelector(".scene__content"), { clearProps: "y,opacity" });
    });
  }

  // ----------------------------------------------------------------------
  // Mode selection: pinned desktop journey vs. static normal-flow fallback
  // (mobile breakpoint or prefers-reduced-motion — research.md §7-8).
  // ----------------------------------------------------------------------

  var currentMode = null; // "pinned" | "static"

  function desiredMode() {
    return isMobile() || prefersReducedMotion() ? "static" : "pinned";
  }

  function applyMode(mode) {
    if (mode === currentMode) {
      return;
    }
    if (currentMode === "pinned") {
      teardownPinnedJourney();
    }
    if (mode === "pinned") {
      buildPinnedJourney();
    }
    currentMode = mode;
  }

  function init() {
    waitForAssets().then(function () {
      applyMode(desiredMode());
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }
    });
  }

  var handleResize = debounce(function () {
    var next = desiredMode();
    if (next !== currentMode) {
      applyMode(next);
    }
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.refresh();
    }
  }, 200);

  window.addEventListener("resize", handleResize);
  window.addEventListener("orientationchange", handleResize);
  reducedMotionQuery.addEventListener("change", handleResize);
  mobileQuery.addEventListener("change", handleResize);

  init();

  window.__journey = {
    stage: stage,
    scenes: scenes,
    prefersReducedMotion: prefersReducedMotion,
    isMobile: isMobile,
    waitForAssets: waitForAssets,
    debounce: debounce
  };
})();

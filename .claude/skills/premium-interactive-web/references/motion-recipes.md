# Motion recipes (GSAP + ScrollTrigger + Lenis)

## Engine

```ts
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 3), smoothWheel: true });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

Create it once, destroy it on unmount, and do not create it at all under `prefers-reduced-motion`.

## Timing

- Reveals: 0.9 to 1.2s, `power3.out`. Large movement: `expo.out`, 1.2 to 1.6s. Hover: 0.25 to 0.4s, `power2.out`.
- Stagger 0.06 to 0.12s per line or word, in reading order.
- Slightly delayed starts (0.1 to 0.3s) feel deliberate. No bounce, no elastic.
- Scrub values: `scrub: 0.6` to `1` so scrubbed motion trails the scroll smoothly.

## Patterns

- **Line-mask reveal:** split text into lines (SplitText), wrap each in an overflow-hidden mask, animate the inner line from `yPercent: 110` to `0`. Replaces fade-up.
- **Scroll-scrubbed words:** split into words, animate opacity from 0.18 to 1 with `scrub`, `start: "top 75%"`, `end: "bottom 40%"`.
- **Pinned scene:** `ScrollTrigger.create({ trigger, start: "top top", end: "+=150%", pin: true, scrub: 0.8 })` with a timeline for the object and text.
- **Horizontal gallery:** pin the section, tween the track `x` to `-(track.scrollWidth - innerWidth)` with `scrub`. Touch devices use native `overflow-x: auto` with scroll snap.
- **Magnetic button:** on `pointermove` over the element, move it toward the pointer by 0.25 of the offset (clamped), spring back on leave with `elastic`-free `power3.out`.
- **Pointer tilt:** map pointer position to rotateX/rotateY up to 8 degrees with `quickTo`; move a sheen gradient with the same values.
- **Cursor:** one fixed element following with `quickTo` (0.25s). Grows and shows a label on elements with `data-cursor="Open"`. Hidden when `(hover: none)` or reduced motion.
- **Curtain transition:** a full-screen layer wipes in (0.5s), the route swaps and scroll resets, then it wipes out (0.6s).
- **Tone shift:** animate a CSS variable on the root (`--ground`) between scenes with a ScrollTrigger tied to each scene.

## Safeguards

- Create triggers inside `useGSAP` with a `scope` ref so they revert on unmount; call `ScrollTrigger.refresh()` after fonts load.
- Use `gsap.matchMedia()`: full motion for `(prefers-reduced-motion: no-preference)`, stacked static layouts otherwise; swap pinned horizontal scenes for native swipe on narrow touch.
- Animate transform and opacity only. Never animate layout properties.

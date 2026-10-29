---
name: premium-interactive-web
description: Design and build premium, interactive, scroll-driven websites (luxury, music, film, product showcase) that feel subtle, classic and high-grade, with very few words, scrubbed scenes, layered atmosphere and a deliberate motion system. Use when the brief says premium, high-end, interactive, cinematic, Awwwards-level, "looks expensive", 3D, WebGL, Three.js or a 3D product viewer, or when a page is text-heavy, flat or static and must be rebuilt as an experience. Pairs with avoid-ai-design (which polices defaults) and wins over it where the brief asks for motion and interaction.
license: MIT
metadata:
  version: "1.0.0"
  tags: premium interactive scrollytelling gsap lenis cinematic luxury motion
---

# Premium interactive web

A premium site is not a nicer-looking document. It is a short film the visitor scrolls through. This skill records the principles learned the hard way on the KMF Media build, where two polish passes on a text-heavy, card-based page failed and a rebuild around scenes succeeded.

Read this together with `avoid-ai-design` (the catalog of defaults to avoid). Read `references/scene-patterns.md`, `motion-recipes.md`, `background-recipes.md`, `conversion-patterns.md` and `qa-checklist.md` before building. **If the brief involves 3D (WebGL, Three.js, a GLB model, a 3D scroll scene), also read `references/3d-web.md`.**

**Lesson from the KMF build:** the first premium pass was loved for its feel and still failed to persuade, because it was almost wordless and hid its navigation. Beauty gets attention; the conversion layer gets enrollment.

## The ten rules

1. **Words are scarce, but minimal is not empty.** The display layer carries at most about 12 words plus one line of at most 18. Everything else lives behind interaction (hover, click, `details`) or on an inner page. If a section needs a paragraph, it is not a scene yet. **On an acquisition site this is only half the job:** add the conversion layer in `references/conversion-patterns.md` (Login and Sign up in the nav, an inline enroll, proof, a path, objections answered, a repeated CTA). A scene may hold supporting content up to about 45 visible words; proof and FAQ scenes are exempt from the count but not from clarity. Product screens (tables, forms) are exempt.
2. **One scene per viewport; scroll is time.** Each scene has one idea, one focal object and one motion. Order scenes by emotion (arrive, believe, see, choose, act), never by the stock waterfall (hero, logos, features, how it works, pricing, FAQ).
3. **A signature object.** One memorable thing the page is built around (here, the record). Everything else stays quiet so it can be the star. Spend boldness in one place.
4. **Atmosphere is layered, never flat.** A tonal gradient ground, slow warm light, dust or particles, a light cone behind the hero object, 3-4% film grain, a vignette, and a scroll-driven tone shift between scenes. See `background-recipes.md`.
5. **Type does the talking.** Huge, light, tight, sentence case, few words. One display face with real contrast plus a quiet grotesk for small text. Emphasise a whole line, never one word. No ALL-CAPS labels.
6. **Motion is a language, not decoration.** One smooth-scroll engine (Lenis) feeding one animation engine (GSAP ScrollTrigger). Slow, slightly delayed, intentional. `power3.out` and `expo.out`, 0.8 to 1.4 seconds, staggers that follow reading order, line-mask text reveals instead of a uniform fade-up. Scenes begin when they enter the viewport. See `motion-recipes.md`.
7. **Everything answers the pointer.** Custom cursor with contextual labels, magnetic buttons, hover-reveal, pointer tilt on the signature object, drag galleries, curtain page transitions, a one-time preloader. A page where nothing reacts to the pointer reads as a document.
8. **Navigation is solid, complete and always there.** An opaque bar (never transparent, never hidden on scroll, content starts below it) with every destination reachable, grouped into mega-menus where needed, and **Log in and Sign up on the right**, visible without scrolling. On small screens a solid bar with Sign up and a burger opening a sheet under the bar. Do not hide navigation behind a lone Menu button on desktop.
9. **Every effect has a fallback.** `prefers-reduced-motion`: smooth scroll off, scenes stacked, no autoplay motion. Touch: no cursor, native swipe for horizontal scenes. No JS: content still readable. Keyboard focus visible. AA contrast.
10. **Performance is part of premium.** Transform and opacity only, particle cap, device-pixel-ratio cap, pause when offscreen or the tab is hidden, lazy-load heavy scenes. If it drops frames it is not premium.

## Process

1. **Ground in the subject.** What is its world, its artifacts, its most characteristic object? Name the signature object and the emotion of each scene before any code.
2. **Write the scene list** (name, one idea, focal object, motion, word count). Cut any scene that cannot be said in 12 words.
3. **Write the contract** (`DESIGN.md`): palette, type, background stack, interaction vocabulary, word budget, refusals.
4. **Build static first**, then add motion, then add pinned and scrubbed scenes last.
5. **Review each scene in a real browser before starting the next.** Scroll feel is not visible in code.
6. **Run `references/qa-checklist.md`**, including the measured gates.

## Relationship to avoid-ai-design

- That skill removes defaults nobody chose. This one adds a direction. Both apply; where the brief asks for premium and interactive, this skill's choices are brief-driven.
- Tells that interactivity legitimately replaces: **M1** (uniform fade-up on every section) is replaced by line-mask reveals tied to reading order; **K10** (stock Aceternity and Magic UI effects) is replaced by bespoke effects tied to the product's own object; **L9** (section waterfall) is replaced by a scene list; **L1** (centered hero template) is replaced by a staged signature object.
- Still refused: purple gradients, Inter, three identical feature cards, fake logo walls and testimonials, count-up statistics, emoji icons, generic CTA labels, cream-plus-terracotta and near-black-plus-acid-green defaults.
- Style blend stays one primary plus one accent (for example Dark OLED / cinematic plus Kinetic typography). Film grain is a texture layer of the dark surface, documented as such, not a third style.
- Mark brief-driven choices with `avoid-ai-design-ignore: <ID>` and a reason, and list them in `DESIGN.md`.

## Stack (default)

React + Vite + TypeScript, `gsap` (ScrollTrigger and SplitText are included in the free package), `@gsap/react`, `lenis`, plain CSS with tokens. No UI library. Fonts self-hosted through `@fontsource`. Add Three.js (with `@react-three/fiber` and `@react-three/drei`) only when a true 3D object is required, name each as a dependency, and follow `references/3d-web.md` (decision gate, one clock, asset pipeline, budgets, fallback tiers).

# QA checklist

Run this before calling a premium build done. Items marked (measured) need a script, not eyeballing.

## Content

- [ ] (measured) Display text at most 12 words per scene; each scene at most about 45 visible words (proof and FAQ scenes exempt from the count).
- [ ] Every scene can be summarised in one sentence. Detail lives behind interaction or on an inner page.
- [ ] Real headings and a visually hidden summary exist per scene for assistive tech and SEO.

## Conversion (acquisition sites)

- [ ] (measured) Log in and Sign up are visible at scroll 0 on desktop and on a 390px phone, without opening a menu.
- [ ] (measured) The nav background is fully opaque and no page text is visible behind it at any scroll position.
- [ ] (measured) Every route is reachable from the nav (menus count); removed routes return Not Found.
- [ ] One primary CTA with a named action repeats at the end of each scene.
- [ ] Proof is present (roster, platforms, results, quotes) and every unconfirmed item is visibly tagged Placeholder. Nothing invented is stated as fact.
- [ ] Objections are answered (bots, cost, how to start, languages) in a trust scene and an FAQ.
- [ ] The enrollment form validates, confirms, and hands off (for example to WhatsApp) without storing anything it should not.

## Visual

- [ ] A signature object is fully inside the viewport, never cropped, and is the biggest thing on screen in its scene.
- [ ] The background is layered (ground, light, dust, cone, grain, vignette), not one flat colour.
- [ ] Display type is huge and light; small text is quiet; no ALL-CAPS labels, no one-word emphasis.
- [ ] Silhouette test: shrink a screenshot; it should not look like any template page. 25% squint: scenes differ in weight.

## Motion and interaction

- [ ] Smooth scroll feels slow and deliberate, not floaty. Scenes begin on viewport entry.
- [ ] Cursor, magnetic buttons, hover reveals, tilt and the menu all respond.
- [ ] Route transitions do not leak ScrollTriggers (navigate back and forth ten times; trigger count stays constant).
- [ ] (measured) Frame time during a scripted scroll stays near 16ms; no long tasks above 50ms.

## Fallbacks

- [ ] `prefers-reduced-motion`: smooth scroll off, scenes stacked, readable and complete.
- [ ] Touch (`hover: none`): no custom cursor; horizontal scenes use native swipe.
- [ ] Narrow screens (390px): no horizontal overflow on any route.
- [ ] No-JS: static, readable content.
- [ ] Keyboard: visible focus, menu operable, no traps.

## Build

- [ ] `tsc` and the production build pass; zero console errors.
- [ ] (measured) Fonts actually loaded (`document.fonts.check`), not just declared.
- [ ] `avoid-ai-design` scanner: no unexplained P0 or P1; brief-driven ignores carry a reason.

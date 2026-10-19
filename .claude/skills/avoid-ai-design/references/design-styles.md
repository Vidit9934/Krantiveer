# Design styles library (EXTENSION)

Not part of upstream `avoid-ai-design`. Upstream's `aesthetic-directions.md` is *vocabulary for naming moves*. This file is
the opposite: a **working library of named visual systems with their real principles and CSS recipes**, so that when the
user's vibe points at a style ("frosted", "soft", "chunky 3D", "raw", "Apple-like", "bento", "depth"), you build with
that style's actual rules instead of a vague imitation.

## How to use it

1. **Ground first** (SKILL.md step 5). The subject, audience and materials still come before the style. A style is a *means*.
2. **Map the vibe** with the lookup table below. If the user names a style, use it. If they describe a feeling, pick the closest.
3. **Commit to one primary style** (optionally one accent style, see `style-blending.md`). Never three.
4. **Apply its principles + tokens** (not just its look): surfaces, light, depth, type, motion, spacing.
5. **Run its guardrails.** Every style has failure modes (contrast, performance, density). Check them before finishing.
6. **Brief wins.** If the user names a style, a style is *not* an SD tell. Mark with `avoid-ai-design-ignore: <ID>` if the scanner flags it.
7. Never copy example font names blindly; they are face *categories*. Choose the face the subject calls for.

> Universal floor for every style: text contrast ≥ 4.5:1 (3:1 for large text and UI boundaries), visible `:focus-visible`,
> `prefers-reduced-motion` respected, `prefers-reduced-transparency` / `prefers-contrast` fallbacks for blur/glass styles,
> touch targets ≥ 44px, and a solid non-blur fallback via `@supports not (backdrop-filter: blur(1px))`.

## Vibe → style lookup

| User says / feels like | Primary style | Good accent |
|---|---|---|
| "frosted", "see-through", "layered over a photo", "premium OS" | Glassmorphism → Liquid Glass | Bento |
| "Apple-like", "iOS 26", "fluid, refractive, alive" | Liquid Glass | Minimalism |
| "soft", "pillowy", "calm, extruded buttons" | Neumorphism (accent use only) | Minimalism |
| "chunky", "playful 3D", "toy", "inflated", "friendly" | Claymorphism | Playful/Memphis |
| "real materials", "leather / paper / metal", "tactile", "like a physical object" | Skeuomorphism | Grain & halftone |
| "raw", "ugly on purpose", "anti-design", "loud buttons" | Brutalism / Neo-brutalism | Maximalist type |
| "clean", "quiet", "spacious", "less" | Minimalism | Swiss |
| "more is more", "busy, collage, abundant" | Maximalism | Memphis / Y2K |
| "dashboard of cards", "feature grid", "Apple keynote tiles" | Bento grid | Glass / Minimal |
| "depth", "AR/VR", "floating windows", "visionOS", "parallax layers" | Spatial UI | Glass |
| "glow", "dreamy gradient", "AI product" | Aurora / mesh gradient | Glass / Grain |
| "neon", "hacker", "night city" | Cyberpunk / neon | Terminal |
| "90s/2000s web", "chrome, bubbles" | Y2K / retro-futurism | Maximalist |
| "grid, type-first, precise" | Swiss / International | Minimalism |
| "magazine", "story", "long-read" | Editorial | Kinetic type |
| "expressive, shape-rich, Android" | Material 3 Expressive | Bento |
| "scroll story", "type that moves" | Kinetic typography / scrollytelling | Editorial |
| "earthy", "calm, natural, wellness" | Organic / biophilic | Grain |
| "print texture", "riso", "zine", "analog" | Grain & halftone | Brutalism |
| "dark, battery-friendly, cinematic" | Dark-mode OLED | Aurora / Glass |
| "gold, symmetry, 1920s" | Art deco | Luxury |
| "terminal, dev tool, utilitarian" | Industrial / terminal | Swiss |

---

## 1. Skeuomorphism
- **Fits:** audio/hardware metaphors, calculators, games, finance/crafts with a physical heritage, onboarding "wow".
- **Principles:** UI mimics real materials and physics. A single consistent light source (top-left, ~315°). Depth from layered
  gradients, inner/outer shadows, bevels, specular highlights, texture. Controls *look pressable* (affordance by resemblance).
- **Tokens:** `background: linear-gradient(#f5f5f5,#cfcfcf); box-shadow: 0 1px 0 #fff inset, 0 -1px 0 rgba(0,0,0,.25) inset, 0 6px 12px -4px rgba(0,0,0,.45);`
  pressed state: invert inset shadows + `translateY(1px)`. Texture via SVG `feTurbulence` noise or CSS layered gradients.
- **Type:** engraved/debossed labels (`text-shadow: 0 1px 0 rgba(255,255,255,.6)`), humanist or machine-label faces.
- **Palette:** material-true (brushed aluminum, leather brown, felt green, enamel). Limited, low-saturation.
- **Motion:** physical: springs, knob rotation, switch click. Short, with weight.
- **Signature:** one hero object (knob, toggle, dial) rendered with convincing light.
- **Guardrails:** heavy on paint cost; keep texture images small. Don't skeuomorph *everything*, pick one metaphor and stay in it.
- **Watch for:** dated 2010 "leather calendar" kitsch; inconsistent light direction.

## 2. Neumorphism (soft UI)
- **Fits:** calm single-purpose controls (music player, smart home, timers), light-theme dashboards as an *accent*.
- **Principles:** element appears extruded from or pressed into the same surface. Same hue as background; depth from two shadows
  (one light, one dark) on opposite sides. Flat, monochrome, rounded.
- **Tokens:** bg `#e0e5ec`; raised `box-shadow: 8px 8px 16px #a3b1c6, -8px -8px 16px #ffffff;` pressed `inset 6px 6px 12px #a3b1c6, inset -6px -6px 12px #fff;` radius 16-28px.
- **Type:** medium/semibold geometric sans, dark-on-light with strong contrast (never grey-on-grey).
- **Palette:** one soft neutral + **one saturated accent** for state and focus.
- **Motion:** slow ease press-in (150-250ms), no bounce.
- **Signature:** a toggle or dial that physically presses in.
- **Guardrails (important):** shadows alone fail contrast. Always add an accent fill, border or icon for states and boundaries;
  never rely on shadow to show focus/disabled/selected. Avoid for dense or form-heavy UI.
- **Watch for:** an entire app in neumorphism (illegible); elements that don't look clickable.

## 3. Glassmorphism
- **Fits:** overlays on rich backgrounds: nav bars, cards over imagery/gradients, modals, music/weather/finance widgets.
- **Principles:** translucency + background blur imply a frosted-glass layer; a hairline light border sells the edge; the
  background behind it must be colorful or photographic or the effect disappears. Hierarchy by blur/opacity level.
- **Tokens:** `background: rgb(255 255 255 / .12); backdrop-filter: blur(16px) saturate(160%); border: 1px solid rgb(255 255 255 / .25); box-shadow: 0 8px 32px rgb(0 0 0 / .18), inset 0 1px 0 rgb(255 255 255 / .35); border-radius: 20px;`
  Dark glass: `rgb(20 20 30 / .45)`. Add `-webkit-backdrop-filter`.
- **Type:** crisp sans, medium+ weight, white or near-black chosen *by measured contrast against the blurred result*.
- **Palette:** vivid gradient/mesh/photo behind; glass itself neutral.
- **Motion:** parallax of the background under static glass; subtle hover lift.
- **Signature:** the 1px inner highlight on the top edge.
- **Guardrails:** test contrast on the *worst* area of the background; add a darkening scrim under text. Limit to ≤3 blurred layers on screen
  (GPU cost; blur on large animated areas janks mobile). Provide `prefers-reduced-transparency` solid fallback.
- **Watch for:** blur over a flat bg (pointless); low-contrast paragraph text on glass.

## 4. Claymorphism
- **Fits:** friendly consumer, kids/education, fintech-with-personality, onboarding, illustration-led brands.
- **Principles:** inflated, puffy 3D "clay" objects: very large radius, soft double inner shadows (light top-left, dark bottom-right)
  plus a soft outer drop shadow; saturated pastels; rounded 3D illustrations.
- **Tokens:** `border-radius: 28-48px; background: #ffb8d1; box-shadow: inset -8px -8px 16px rgb(0 0 0 / .12), inset 8px 8px 16px rgb(255 255 255 / .55), 12px 16px 28px -8px rgb(0 0 0 / .25);`
- **Type:** rounded, friendly, heavy sans (category: rounded grotesque), generous size.
- **Palette:** candy pastels on a soft tinted bg; 1 deeper color for text/CTA.
- **Motion:** squish/bounce on press (scale .96 → 1, spring); gentle float.
- **Signature:** a puffy button that squashes when pressed.
- **Guardrails:** pastels on pastels fail contrast: text and CTAs need a darker ink. Struggles with dense tables; use for hero/cards.
- **Watch for:** every element puffy (no hierarchy); inconsistent light angle.

## 5. Brutalism / Neo-brutalism
- **Fits:** creative tools, indie products, portfolios, Gen-Z brands, anything that wants to feel un-corporate and confident.
- **Principles:** raw structure over polish. Visible grid, hard edges, no blur, no soft gradients. **Neo-brutalism** adds saturated flat color blocks,
  thick black outlines and offset hard shadows. Honesty of HTML: default-ish fonts used boldly, underlined links, oversized type.
- **Tokens:** `border: 3px solid #000; box-shadow: 6px 6px 0 #000; border-radius: 0-8px; background: var(--flat-color);` hover: `translate(-2px,-2px)` + shadow 8px; active: `translate(4px,4px)` + shadow 2px.
- **Type:** huge heavy grotesque or mono; mixed sizes; tight leading; optional deliberate mismatch.
- **Palette:** 3-5 flat saturated colors (yellow, hot pink, mint, blue) + black + off-white. No gradients.
- **Layout:** exposed grid lines, asymmetry, stacked blocks, overlapping stickers/labels.
- **Motion:** instant/snappy; shadow-snap on press; marquee tickers.
- **Signature:** the offset hard shadow that collapses on press.
- **Guardrails:** "intentionally rough" must still be accessible: keep contrast, keep clear hierarchy, don't let chaos hide the primary action.
  Neo-brutalism is now common as a full-page style: spend it on CTAs/cards, vary the palette per brand.
- **Watch for:** the same yellow+pink+black template; chaos with no hierarchy.

## 6. Minimalism
- **Fits:** products where content/utility is the hero: tools, editors, portfolios, luxury, docs.
- **Principles:** reduce to essentials; whitespace *is* the design; one typeface family, tight scale, 1 accent; every element earns its place.
  Hierarchy by size/weight/space, not color or ornament.
- **Tokens:** spacing scale 4/8/16/24/48/96; 1px hairlines `rgb(0 0 0 / .08)`; radius consistent (0, 4 or 12); shadows near-none.
- **Type:** one superfamily with real optical sizes; 3-4 sizes max; sentence case.
- **Palette:** near-neutral + one accent used rarely.
- **Motion:** minimal, purposeful (state change, orientation only).
- **Signature:** a single perfectly set typographic moment or one oversized element.
- **Guardrails:** minimal ≠ unfinished: spacing and alignment must be exact. Avoid the warm-cream/terracotta "tasteful minimal" default (SD1) unless the subject asks.
- **Watch for:** empty-looking pages with no point of view; low-contrast grey text.

## 7. Maximalism
- **Fits:** fashion, music/festival, culture, entertainment, creative studios, "abundance" brands.
- **Principles:** abundance with control: layered type, pattern, color clash, collage, overlap, scale contrast. Rules still exist: a repeated motif, a dominant color,
  and a clear reading path hold the chaos together.
- **Tokens:** 5-8 colors with one dominant; multiple faces (2-3 deliberate); layered `position:absolute` elements, `mix-blend-mode`, SVG patterns, marquees.
- **Motion:** rich, orchestrated; one big staggered entrance + ambient loops (CSS only, throttle).
- **Signature:** one dense "wall" of overlapping type/imagery.
- **Guardrails:** keep the CTA and body copy calm and readable; honor reduced-motion; test perf with many layers.
- **Watch for:** noise without hierarchy; all elements shouting equally.

## 8. Liquid Glass (Apple, iOS/macOS 26)
- **Fits:** native-feeling web for Apple audiences, media/controls floating over content, toolbars, tab bars, player UIs.
- **Principles:** translucent material that *refracts and reflects* content beneath (lensing), with specular edge highlights that respond to motion/light, adaptive tint,
  and morphing/merging shapes ("liquid" fluid transitions). Controls float *above* content; content is edge-to-edge underneath. Concentric rounded shapes.
- **Tokens (web approximation):** `backdrop-filter: blur(10px) saturate(180%) brightness(1.05);` + SVG `feDisplacementMap` filter for edge refraction (Chromium) + 1px gradient border
  (`linear-gradient(135deg, rgb(255 255 255 / .6), rgb(255 255 255 / 0) 40%, rgb(255 255 255 / .3))` via mask) + soft shadow; radius = height/2 for capsules.
  Fluid morph: animate `border-radius`, `clip-path` or SVG gooey filter; use springy easing `cubic-bezier(.2,.9,.3,1.2)`.
- **Type:** SF-like neutral grotesque (system UI category), semibold, high contrast against the glass.
- **Motion:** spring/morph between states; pointer-following specular highlight; elements gel together when near.
- **Signature:** a capsule control group that morphs and reflects light.
- **Guardrails:** clear glass hurts legibility; add adaptive tint/scrim, never place long text directly on clear glass; use the real `backdrop-filter` only as an
  enhancement with solid fallback; refraction SVG filters are expensive: use on 1-2 hero controls. Respect reduced-transparency/contrast.
- **Watch for:** blur-only "fake" liquid glass (that's glassmorphism); over-using it across all content.

## 9. Bento grid
- **Fits:** feature overviews, product pages, dashboards, portfolios, "about me" pages.
- **Principles:** modular rounded tiles of *different spans* in a tight grid, each tile one idea (a stat, a visual, a demo); consistent gutter and radius;
  hierarchy via tile size; content cropped to the tile.
- **Tokens:** `display:grid; grid-template-columns: repeat(12,1fr); gap: 12-16px; grid-auto-flow: dense;` tiles with spans like `col-span-6 row-span-2`;
  radius 20-28px, 1px border or soft bg tint; container queries so tiles reflow (`container-type:inline-size`). Collapse to 1-2 columns on mobile in reading order.
- **Type:** big number/keyword per tile; short copy.
- **Palette:** neutral tiles with 1-2 colored hero tiles.
- **Motion:** hover lifts/reveals inside tile; staggered tile entrance.
- **Signature:** one oversized tile that anchors the composition.
- **Guardrails:** don't fill every tile with an icon + 2 lines (that's the three-cards cliché in grid clothing, SD/L2); vary content type; keep DOM order logical for screen readers.
- **Watch for:** equal-size tiles (that's just cards); too many tiles competing.

## 10. Spatial UI (visionOS-style depth)
- **Fits:** immersive/product showcase pages, AR/VR/3D tools, creative dashboards, "floating window" interfaces, hero sections with depth.
- **Principles:** UI as objects in space: layered z-planes, parallax, glass windows that float with soft shadows, **depth indicates hierarchy** (focused item comes forward),
  gaze/pointer hover feedback (items scale/glow), ornaments (controls attached outside the window), generous radii and padding for look-and-pinch targets.
- **Tokens:** `perspective: 1200px; transform-style: preserve-3d;` layers with `translateZ(0/40px/80px)`; pointer-driven `rotateX/rotateY` (±6°);
  window = glass material (see §3) + large radius 32-40px + large soft shadow `0 30px 60px rgb(0 0 0 / .35)`; hover: `scale(1.04) translateZ(20px)` + specular glow.
- **Type:** large, light-to-medium weight, ample tracking; avoid thin on translucent.
- **Palette:** dim, desaturated backdrop so glass windows read; one accent for focus.
- **Motion:** smooth spring depth, parallax on scroll/pointer; subtle idle float.
- **Signature:** a tilting window with a floating ornament toolbar.
- **Guardrails:** 3D transforms cost GPU; cap layer count; disable tilt on touch and reduced-motion; don't hide navigation in space.
- **Watch for:** depth as decoration with no hierarchy meaning; motion sickness from large parallax.

## 11. Aurora / mesh gradient
- **Fits:** AI/SaaS/creative products wanting atmosphere; hero backgrounds; pairs well with glass.
- **Principles:** soft multi-point color fields blended like northern lights; luminous, blurred, slowly drifting; content stays crisp on top.
- **Tokens:** stacked `radial-gradient` blobs or blurred absolutely-positioned shapes (`filter: blur(80px)`) with `mix-blend-mode: screen/plus-lighter`, animated slowly (20-40s); grain overlay to avoid banding.
- **Palette:** 3-4 analogous-to-triadic hues on dark, *not* the default purple→blue.
- **Guardrails:** this is the first-order "AI gradient" if purple/blue (C1); choose hues from the subject. Static fallback for reduced-motion; GPU-cheap (few layers).
- **Watch for:** muddy mid-tones; text over bright blobs.

## 12. Cyberpunk / neon
- **Fits:** games, security/dev tools, nightlife, crypto/tech-noir.
- **Principles:** high-contrast neon (cyan/magenta/yellow) on near-black, scanlines, glitch/chromatic aberration, HUD frames, angled corners (`clip-path`), tech mono type.
- **Tokens:** `text-shadow: 0 0 8px currentColor, 0 0 24px currentColor;` borders with glow; scanline overlay `repeating-linear-gradient`; glitch via `clip-path` keyframes.
- **Guardrails:** glow on body text hurts reading: glow headings/accents only; flicker/glitch must respect reduced-motion and avoid seizure-risk rates (<3 flashes/s).
- **Watch for:** the near-black + acid-green cluster (SD2) unless intended.

## 13. Retro-futurism / Y2K
- **Fits:** music, fashion, youth, nostalgia products, playful tech.
- **Principles:** Y2K: chrome gradients, bubbles/blobs, glossy "aqua" buttons, stars/sparkles, translucent plastics, techno-optimism. Retro-futurism (50s-80s): rocket/space optimism, sunset gradients,
  grids, era palettes (cream/orange/teal/avocado, chrome, space black).
- **Tokens:** glossy button: `linear-gradient(#fff 0, rgba(255,255,255,.2) 50%, transparent 51%), var(--color)` + bright inner highlight; chrome text via layered gradients; perspective grid floor.
- **Guardrails:** keep legibility over gloss; commit to one era, don't mix.
- **Watch for:** costume pastiche without a reason.

## 14. Memphis / playful geometry
- **Fits:** kids, events, creative education, toys, youth brands.
- **Principles:** 80s Memphis Group: squiggles, confetti, terrazzo, clashing primaries, bold geometric shapes, asymmetric collage.
- **Tokens:** SVG shape set (circle/triangle/zigzag/dots) reused as motif; thick outlines optional; flat color, rotated placement.
- **Guardrails:** one shape vocabulary; content area stays calm.
- **Watch for:** random shapes with no system.

## 15. Swiss / International typographic
- **Fits:** institutions, tools, publishing, data-heavy, design studios.
- **Principles:** modular grid, flush-left ragged-right, strict type scale, objective photography, asymmetry + whitespace; **Swiss Modernism 2.0** adds oversized type, exaggerated whitespace, subtle motion, type over images.
- **Tokens:** 12-col grid with baseline rhythm (8px); few sizes on a modular scale (1.25-1.5); 1 neutral grotesque; rules (hairlines) as structure; one signal color.
- **Guardrails:** keep rigor: misalignment by 2px ruins it.

## 16. Editorial / magazine
- **Fits:** media, long-form, brands with a voice, case studies.
- **Principles:** expressive type pairing (high-contrast serif + sans), drop caps, pull quotes, multi-column, full-bleed imagery, captions, intentional pacing.
- **Tokens:** `font-size: clamp()` fluid display; `column-count`/CSS grid; `shape-outside` for text wrap; `text-wrap: balance`.
- **Guardrails:** line length 45-75ch; avoid the cream+terracotta editorial default (SD1).

## 17. Material 3 Expressive
- **Fits:** Android/Google-ecosystem apps, product UIs wanting shape and color richness with strong usability.
- **Principles:** dynamic color from a source color (tonal palettes), shape morphing (varied corner families), larger/bolder type, spring motion, prominent containers, haptic-like feedback; research-backed usability.
- **Tokens:** tonal roles (primary/on-primary/container), shape scale, spring easing; use real M3 tokens when MUI/Material Web is in the stack.
- **Watch for:** untouched baseline M3 purple (a default).

## 18. Kinetic typography / scrollytelling
- **Fits:** campaigns, storytelling, launches, portfolios.
- **Principles:** type is the motion; scroll position drives reveal, pinning, scale or variable-font axes; one narrative beat per viewport.
- **Tokens:** CSS `animation-timeline: scroll()/view()` (with IntersectionObserver fallback), variable-font axes (`font-variation-settings`), `position: sticky` stages, `clip-path` reveals.
- **Guardrails:** reduced-motion = static content; never gate essential content behind scroll animation; keep CLS/LCP healthy.

## 19. Organic / biophilic
- **Fits:** wellness, food, sustainability, outdoor, slow-living brands.
- **Principles:** soft irregular shapes (blob `border-radius: 60% 40% 55% 45%`), natural textures, earthy-to-botanical palette sourced from real materials, hand-drawn lines, flowing curves, gentle parallax.
- **Guardrails:** don't reach for beige by default: derive palette from the actual subject (soil, bark, moss, clay); keep contrast.

## 20. Grain & halftone (print texture)
- **Fits:** zines, music, art, indie brands, anything analog; works as an *accent* over aurora/gradient/brutalist.
- **Principles:** tactile imperfection: film grain, risograph misregistration, halftone dots, paper fibers, overprint colors.
- **Tokens:** SVG `feTurbulence` noise overlay at 4-8% opacity with `mix-blend-mode: multiply/overlay`; halftone via `radial-gradient` pattern + `mask`; misregistration with offset duplicate text-shadows.
- **Guardrails:** keep overlay as a single cheap layer; don't reduce text contrast.

## 21. Dark-mode OLED / cinematic
- **Fits:** media, creative tools, developer products, battery-conscious mobile.
- **Principles:** true/near-black surfaces for OLED, depth by *lighter* surfaces (elevation = lightness, not shadow), desaturated accents, soft glow for focus, cinematic imagery.
- **Tokens:** surfaces `#000 → #0d0d0f → #16161a → #1f1f25`; text `#e8e8ec` (not pure white, avoids halation), accents desaturated ~15%.
- **Guardrails:** pure black + pure white causes eye strain/smearing on scroll; keep contrast ≥ 4.5:1 for secondary text.
- **Watch for:** the near-black + acid-green cluster (SD2).

## 22. Afrofuturism
- **Fits:** culture, music, art, storytelling brands honoring African diasporic futures.
- **Principles:** rich, saturated heritage palettes (gold, deep indigo, terracotta-to-copper, emerald), geometric patterns drawn from real textile traditions, cosmic motifs, luminous gradients on dark.
- **Guardrails:** research and credit the real source cultures; avoid decorative pastiche; collaborate with/represent the community the work is about.

## 23. Art deco / geometric luxury
- **Fits:** hospitality, luxury, finance heritage, cocktails, events.
- **Principles:** symmetry, fans/sunbursts, stepped forms, gold linework on deep colors, high-contrast display serif or geometric display, ornamental borders.
- **Tokens:** SVG border ornaments, `conic-gradient` sunbursts, 1px gold rules (`#c9a24a`), uppercase tracked small caps.

## 24. Industrial / terminal / utilitarian
- **Fits:** dev tools, infra, ops, data products.
- **Principles:** function-first density, monospace data, status colors with meaning, visible structure (rules, tables), keyboard-first affordances.
- **Guardrails:** don't stamp mono on everything as "tech vibes" (SD tell); use mono for actual data/code.

---

## Quick-pick matrix: intensity vs context

| Context profile (SKILL.md) | Safe, high-usability styles | Bold styles (spend carefully) |
|---|---|---|
| `dashboard` | Minimalism, Swiss, Bento, Dark OLED, Industrial | Glass accents on cards |
| `app-component` | Minimalism, Material 3, Neumorphism accents | one Claymorphism or Skeuo hero control |
| `marketing-page` / `landing` | Editorial, Bento, Aurora, Glass, Liquid Glass | Brutalism, Maximalism, Spatial, Y2K, Cyberpunk |
| `inside-design-system` | the system's own style | none: surgical only |

---
version: alpha
name: KMF Media
description: Music-growth agency and platform for Indian artists, labels and creators. A dark listening room with a real 3D turntable, broken up by warm-white "paper" scenes. Premium, with a little funk, few words, and type that reacts to the pointer and the scroll.
colors:
  ground: "#070605"
  surface-1: "#0e0c0a"
  surface-2: "#14110e"
  surface-3: "#1d1915"
  ink: "#EFE8DA"
  muted: "#A89E8C"
  gold: "#C9A24B"
  gold-hi: "#ECD493"
  bronze: "#7C5C26"
  signal: "#D9573F"
  paper: "#F4F0E8"
  paper-2: "#E9E3D6"
  ink-paper: "#0B0A08"
  muted-paper: "#5A5246"
  gold-deep: "#7A5A1E"
typography:
  display:
    fontFamily: Bricolage Grotesque Variable
    fontSize: clamp(2.25rem, 4.6vw, 4.25rem)
    fontWeight: 700
    letterSpacing: -0.04em
    axes: wght 200-800, wdth 75-100, opsz 12-96
  ui:
    fontFamily: Bricolage Grotesque Variable
    fontSize: 0.9375rem
    lineHeight: 1.6
  mono:
    fontFamily: DM Mono
    fontSize: 0.8125rem
    use: record-label details only (catalogue numbers, rpm, step numbers, axis labels)
rounded:
  sm: 4px
  pill: 999px
spacing:
  sm: 8px
  md: 16px
  lg: 32px
  xl: 64px
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ground}"
    rounded: "{rounded.pill}"
    padding: 14px 28px
  button-quiet:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: 14px 28px
---

## Overview

KMF Media markets music in India: Spotify and YouTube growth, creator reels campaigns, regional and devotional releases. It has worked with well-known Indian artists. The promise is real listeners only. Audiences are independent artists, labels and agencies, and the creators who work for them.

**Concept: "The listening room".** A dark room with a record turning in a cone of warm light. Scrolling moves you through it, one scene per screen. The record from the user's mockup is the signature object and the only loud thing on the page.

**Home, 3D pass: "The listening room, in the round".** On home the record is a real-time 3D turntable (black lacquer plinth with a gold trim line, dark aluminium platter with a strobe-dot ring, gold tonearm, a vinyl record with a gold metal label). It sits in one fixed WebGL canvas behind the DOM scenes; scrolling moves a slow camera around it in six beats and the record itself tells the story (it plays, it is read like a dial, it is lifted to the light, it steps aside for the decision, it spins up for the close). The Artist / Label toggle physically flips the record to Side B. Inner pages keep the CSS/SVG record. See "3D stage (home)" below.

**Redesign (client feedback, Oct 2026): "Side A, Side B".** The client kept the 3D turntable but rejected the thin classic serif and wanted the whole site to pull artists in: premium, a little funky, reactive to scroll and hover, balanced. Two moves do it:
1. **Rhythm of dark and paper.** Dark scenes are the listening room, where the 3D stage shows. Paper scenes are the record sleeve and liner notes: opaque warm-white panels that open over the stage as they scroll in (a rounded inset card widening to full bleed). Paper is where the reading happens: steps, proof, results, the estimator, FAQ, tables and forms.
2. **Type that plays.** One variable grotesk, Bricolage Grotesque, whose weight and width respond: hero letters swell toward the pointer (`ReactiveType`), giant words condense and lean with scroll speed (`VelocityType`). DM Mono carries the record-label details, so the vernacular is the product's own: catalogue numbers, A1/A2 track numbers, 33⅓.

The funk is rationed: **at most one reactive moment per scene**, and never on body text.

**Style:** primary = Dark-mode OLED / cinematic (depth from lighter surfaces and warm light). Accent = Kinetic typography / scrollytelling (variable-axis type driven by the pointer and scroll). Paper scenes are the light surface of the same system (the sleeve), not a third style. Film grain is a texture layer of the dark surface.

**Principles come from** `.claude/skills/premium-interactive-web` (read it) and `avoid-ai-design`. The English-only decision is fixed: there is no Hindi and no language toggle.

## v3 "Sleek" (client feedback, late Oct 2026)

The client found v2 not impressive: type thin and oversized, almost no imagery, no big signature moments. References: **AJ Marketing** (editorial photo collage, highlighter chips on key words, big stats with highlighted labels, full-bleed "Our Work" bands with the client name in a label box, a coloured CTA band, a hero GIF with a picture turning in 3D) and **Unfold** (bold tight smaller grotesk, a scroll hero where headline words blur away while a curved fan of work cards rises, a services list whose rows light up and show a floating preview that follows the cursor, mega-menus with featured-work cards, one accent on black). The 3D turntable stays.

What v3 changes:
- **Smaller, heavier, tighter type.** Hero `--t-title` 2.25 to 4.25rem at weight 700, wdth 92; section titles `--t-section` 1.75 to 3rem at 650; list rows `--t-row` 1.5 to 2.25rem; stat numerals `--t-stat` 3 to 5.5rem at 800; body 15px. Nothing else exceeds 4.5rem. Tracking -0.04em on display type.
- **Gold is the single accent** (the role lime and orange play in the references): active states, chips, CTA band, pins. White (`--paper`) appears in highlighter chips, reading scenes, tables, forms and cards.
- **Every scene has an image.** `components/Art.tsx` renders a slot from `data/media.ts`: a real photo or video if the manifest has `src` / `video`, otherwise generated cover art in black, gold or paper tone, tagged Placeholder. Dropping real files in `web/public/media/` and filling the manifest replaces the art with no component change.
- **Six 3D beats** (`data-beat`, put on the first scene of each stretch): 1 hero, 2 dream, 3 quiet (services, work; the stage only dims behind opaque scenes), 4 reel (macro fly-over of the grooves, seen through the Reel window), 5 quiet again (stats, path, map, estimator, FAQ), 6 close.

Brief-driven exceptions logged here (`avoid-ai-design-ignore`): **small-caps eyebrows** (`.eyebrow`, DM Mono, uppercase, 0.14em; SD4/T5, from both references), **highlighter chips on single words** (`.hl`, `.hl--gold`; one-word emphasis, from AJ Marketing), **a solid gold CTA band** (a flat colour block, from AJ Marketing's blue band).

Scene list, home (each scene has one idea, one focal object, one motion). **Page order:** Hero, Dream with Depth card, Ticker, Services list, Work, Reel, Stats/proof/results, Path, Regions map, Promise, Estimator, Voices, FAQ, Close. Beats: hero 1, dream 2, services 3, reel 4, stats 5, close 6.
| # | Scene | Surface | Idea and motion |
|---|---|---|---|
| 0 | Intro (once per session, skippable, under 4 s) | black | Gold ring draws, light cone opens, camera pushes in, needle drops, record spins up, headline resolves |
| 1 | Hero (pinned) | dark | Turntable and headline; on scroll the words blur away, the turntable recedes and **seven work cards rise in a curved CSS 3D fan** (`perspective`, `rotateY`, `translateZ`, one scrubbed ScrollTrigger), gold progress line on top, ends on one line, three stat chips and Join KMF |
| 2 | Ticker | dark | The five language names, speed follows scroll |
| 3 | Services list | dark | Numbered rows; hover turns the title, rule and arrow circle gold and a tilted preview card follows the cursor; touch: tap expands the row |
| 4 | Dream with Depth card | dark | Layered cover (back, record, front, glare) turning slowly on a loop and tilting with the pointer |
| 5 | Work | dark | Four full-bleed bands, name in a label box with a gold bar, "Open case", parallax and clip reveal |
| 6 | Reel | dark | A rounded window that grows to full bleed on scroll; real video if present, otherwise the live 3D canvas |
| 7 | Stats, proof, results | paper | Huge numerals with highlighter-chip labels; charts; Placeholder tags |
| 8 | Path | paper | Tracklist A1 to B2 |
| 9 | Regions map | dark | Stylised dot-matrix India, five gold pins, hover shows language and native script |
| 10 | Promise, estimator, voices, FAQ | mixed | Estimator and FAQ on paper |
| 11 | Close | **gold** | Solid gold band, black type, spin badge on Join KMF |

Navigation v3: grouped mega-menus (Services, Platform, Plans, Work, Regional, Company), rounded opaque panel, small-caps eyebrow, link list left, featured-work cards right, stats line, gold "View all" link; page behind dims and blurs; the bar itself stays solid with Log in and Sign up top right.

## Word budget and the conversion layer

Display type stays sparse: about 12 words per scene plus one line of at most 18. A scene may hold supporting content up to about 45 visible words (proof and FAQ scenes are exempt from the count, not from clarity). Inner-page ledes are at most 14 words. **Minimal is not empty:** the site's job is to enroll artists, so every scene serves the conversion layer: dream, path, proof, results, trust, estimator, voices, FAQ and a repeated named CTA.

## Navigation

A solid, opaque bar that never hides. Left: logo and grouped destinations (Services, Platform, Plans, Work, Regional, Company; the groups open opaque mega-menus). Right: **Log in** (quiet) and **Sign up** (gold pill), visible without scrolling. Content starts below the bar so nothing shows behind it. On small screens: logo, Sign up and a burger that opens an accordion sheet under the bar.

## Sign up, Login and proof

There is no account system and no login portal. **Sign up** opens the "Join KMF" form: name, WhatsApp number, a Spotify/YouTube/Instagram link, language and goal. It validates, stores nothing and ends with a prefilled WhatsApp handoff. **Log in** opens a panel: "Member area opens soon." Proof content (roster, stats, quotes) comes from `src/data/proof.ts` with a `confirmed` flag; unconfirmed items show a Placeholder tag.

## Colors

- **Ground (#070605):** the room. Never a flat fill: it sits under a gradient, drifting light, dust, a light cone, grain and a vignette.
- **Surface 1-3:** four steps of warm black for raised areas. Depth by lightness, no shadows.
- **Ink (#EFE8DA):** body and display text, warm, never pure white.
- **Muted (#A89E8C):** secondary text, 7:1 on ground.
- **Gold (#C9A24B) / Gold-hi (#ECD493):** the single accent: primary action, focus, the record label, key figures. Gold type uses a gradient that never goes darker than gold.
- **Bronze (#7C5C26):** hairlines only. **Signal (#D9573F):** live and error states only.
- **Paper (#F4F0E8) / Paper-2 (#E9E3D6):** the sleeve. Opaque, so the 3D stage never shows through it. Paper-2 is the raised surface on paper (inputs, table heads). No pure white.
- **Ink-paper (#0B0A08) / Muted-paper (#5A5246):** text on paper (muted is 7:1 on paper).
- **Gold-deep (#7A5A1E):** gold text and focus on paper. Plain gold on paper fails AA, so it is only a fill there (the gold pill button keeps dark text).
- Inside `.paper`, the `--ink`, `--muted`, `--rule` and `--gold-text` tokens are re-pointed, so components work on both surfaces without forks.

## Typography

Research (Oct 2026): 2026 type leans on variable fonts used for headings and interactive moments, and on expressive, rule-breaking display type (Creative Bloq, "top typography trends for 2026"; Made Good Designs, "Web typography trends 2026"). Chosen to be both premium and an artist's face, not a bank's:

- **Display and UI: Bricolage Grotesque Variable** (Mathieu Triay, SIL OFL, self-hosted through `@fontsource-variable/bricolage-grotesque`, `standard.css` with all three axes). Display sits at weight 350, tight (-0.035em), large optical size. Its ink traps and quirks read as music and art, not finance. UI text uses the same family at small optical size (automatic), weight 400–500, 16px.
- **Accent: DM Mono** (SIL OFL) for record-label details only: catalogue numbers, A1/B2 track numbers, rpm, chart axes, step counters. Never body text, never a whole paragraph.
- **Rejected:** Cormorant (the client disliked it), Bodoni and Schibsted (disliked earlier), Manrope (retired with the serif), Clash Display (fixed weights so it cannot react, ITF licence restricts redistribution), Bebas and Anton (gig-poster default), Fraunces, Instrument Serif, Space Grotesk and Syne (avoid-ai-design T2, overused).
- No italic (Bricolage has none; never synthesise one). Emphasis is a whole line in gold, or a reactive weight change, never one bold word. No ALL-CAPS labels, no letter-spaced eyebrows. The rupee sign is in Bricolage.

## Layout and scenes

Home alternates dark and paper. **Dark:** Hero, Dream, Releases, Doors, Promise, Voices, Close. **Paper:** Path (a tracklist A1–B2), Proof + Results, Estimator, FAQ. Inner pages: a giant velocity title on dark, a DM Mono catalogue line, then alternating dark and paper sections. Tables and forms always sit on paper. Container widths vary by scene.

## Background stack

Tonal gradient ground, two drifting warm light blobs, a dust canvas (about 90 motes, pointer parallax, capped DPR, paused offscreen), a light cone behind the record, static film grain at 4%, a vignette, and a scroll-driven tone shift. Static fallback under reduced motion: gradient, cone, grain and vignette. On home with the 3D stage running, the WebGL dust and light cone replace the CSS dust canvas and CSS cone (never both); ground, drifting light, grain and vignette stay CSS.

## Interaction vocabulary

Custom cursor with labels (Open, Drag, Start), magnetic buttons, pointer tilt and following sheen on the record, groove ripple on hover, hover-reveal doors, drag and scroll gallery, curtain page transitions, full-screen overlay menu, one-time preloader. All have touch and reduced-motion fallbacks.

Added in the redesign (each at most once per scene):
- **Reactive letters** (`motion/ReactiveType.tsx`): weight and width swell toward the pointer; on touch a wave runs through the word as it scrolls past.
- **Velocity type** (`motion/VelocityType.tsx`): giant words condense and lean a few degrees with scroll speed, then settle. Doors words and inner-page titles.
- **Paper wipe** (`motion/PaperScene.tsx`): a paper scene opens from a rounded inset card to full bleed as it scrolls in.
- **Spin badge** (`motion/SpinBadge.tsx`): DM Mono text on a turning ring, like a label; faster while scrolling. On the primary Join CTA, one per screen.
- **Sleeve reveal:** release cards slide their record half out of the sleeve on hover.
- **Ticker:** one line of languages and genres from `src/data/site.ts`, its speed following the scroll.

- **Buttons:** on hover the label swells heavier and narrower (so the pill keeps its width) and grooves ripple out from the centre. On paper the quiet and secondary variants use gold-deep; the gold pill keeps dark text.
- **Catalogue codes** (DM Mono line under every inner title, e.g. "KMF-010 · Services · 33⅓"): Services 010, Plans 020, Work 030, Founder 040, Press 050, Regional 060, Contact 070, Tools 080, Policy 090, Marketplace 100, Creators 110, Campaigns 120, Academy 130, Links 140, Links builder 150, anything else 404. Numbered steps print as tracks: A1, A2, B1, B2.

## Motion

Lenis smooth scroll on the GSAP ticker. `power3.out` and `expo.out`, 0.8 to 1.4 seconds, line-mask reveals, staggers in reading order, scenes begin on viewport entry. Variable-axis changes ease over 0.6–0.7 s. No bounce, no uniform fade-up, no count-up numbers. Reduced motion: reactive and velocity type stay at rest, paper scenes appear without the wipe, badges hold still.

## Components

Disc (the record; on home the poster and static tier of the 3D stage), Scene3D (the 3D gate), Atmosphere, Cursor, Menu, SideToggle (Artist | Label), Magnetic button, SplitLines, ReactiveType, VelocityType, PaperScene, SpinBadge, Preloader, PageTransition, PageHead and Footer are shared and reused verbatim. Shared utility classes: `.paper`, `.mono`.

## 3D stage (home)

**Why real 3D (decision gate, `3d-web.md` section 1):** the client rejected the flat CSS record and asked for 3D; the visitor changes the object (Side A / Side B flip) and the pointer tilts it, so a pre-rendered sequence would not do. One object only: the turntable is the signature object. Headings, cards and the rest of the page stay DOM.

**Dependencies:** `three` 0.182 (pinned below r183, which deprecates the `THREE.Clock` that fiber 9.8 still creates and would print a console warning on every load), `@react-three/fiber` 9.8 (React 19 renderer; peer range `react >=19 <19.4`), `@react-three/drei` 10.7 (`Environment` + `Lightformer`, `ContactShadows`, `RoundedBox`, `PerformanceMonitor`, `useProgress`), `@types/three` (dev). `stats-gl` (a drei dependency we never import) is pinned to our `three` through an npm `overrides` entry so only one copy of three is installed.

**Architecture:** `src/components/Scene3D.tsx` is the gate (tier detection, WebGL2 check before the chunk loads, poster fallback, motion toggle). `src/three/` is the lazy chunk: `Stage.tsx` (Canvas, DPR caps, PerformanceMonitor, context loss, pause when hidden), `Turntable.tsx`, `materials.ts`, `textures.ts`, `rig.ts` (beat poses), `useScrollRig.ts` (the master timeline). One clock: the Canvas runs `frameloop="never"` and is advanced from `gsap.ticker`, the same ticker Lenis runs on. One `ScrollTrigger` maps scroll to beat time on one paused GSAP timeline that mutates a plain rig object; the frame callback reads it. No `setState`, no allocations in the frame loop. It renders continuously only while something moves (record spinning, flip, pointer damping); in the quiet beat it renders on demand.

**Beats** (sections carry `data-beat`; every still pose reads alone and is also the order of the static fallback):

| Beat | DOM scene | Camera pose | Object state | Uniform / material change | DOM text |
|---|---|---|---|---|---|
| 1 Arrive | Hero | Three-quarter, low (about 18 degrees above the plinth), object right of the copy | Record spins at 33 1/3, arm on its rest, pointer tilt up to 4 degrees | Key spot warm and full, cone visible, dust drifting in the beam | Hero copy, toggle, CTAs (as now) |
| 2 Believe | Statement "dream" | Dolly in low over the grooves, close and shallow | Arm swings in and lowers the needle onto the lead-in | Environment intensity up, so the groove sheen brightens | Dream sentence + CTA (as now) |
| 3 See | Path (paper) and the gap before Proof | Rises to top-down; object slides to the right third | Record keeps playing; label reads like a dial | Left scrim fades in behind the text (AA) | Path tracklist sits on paper over the stage |
| 4 Proof in hand | Releases (dark) | Low three-quarter, closer | Record lifts off the platter and turns edge-on above it | Gold rim light from behind traces the edge; key drops a little | Releases gallery. Proof and Results are paper, so nothing 3D sits behind the charts |
| 5 Decide | Doors, Promise, Estimator, Voices, FAQ | Pulled back, object small in the lower-right corner | Spin slows to a stop, arm back to rest | Exposure down to about 35 percent, cone and dust fade; renders on demand | Conversion content leads (as now) |
| 6 Act | Close | Back to the hero pose, mirrored to sit beside "Join KMF" | Record spins up again | Key and cone back to full | "Press your record." + Join KMF |

Signature interaction: the Artist / Label toggle flips the record 180 degrees about its diameter (it lifts, turns, settles) to a second label: Side A is gold metal with dark print, Side B is black lacquer with gold foil print.

**Look:** one warm key spotlight (the cone) plus a procedural environment built from drei `Lightformer`s, rendered once. Vinyl is `MeshPhysicalMaterial` with polar UVs, a generated groove normal map (track gaps, lead-in, lead-out) and anisotropy along the groove so the classic radial sheen appears, plus clearcoat. Labels are `CanvasTexture`s drawn in Bricolage Grotesque (title) and DM Mono (caption, catalogue, rpm) after the fonts have loaded, with a matching roughness/metalness mask so ink is matte and foil is metal. Lacquer, gold and aluminium are shared materials. Contact shadow baked once. A soft additive cone mesh and about 300 dust motes in one `Points` draw. Tone mapping ACES filmic, sRGB output. No WebGL grain, vignette or bloom: grain and vignette stay in CSS, so they are not doubled. The canvas is transparent so the CSS ground, light and vignette stay the room.

**Budgets (measured in the QA run, tune per project):** draw calls under 60, triangles under 80k, textures 2048 max on desktop and 1024 on the light tier, DPR cap 2 desktop and 1.5 mobile (light tier 1), p95 frame time 16.7 ms desktop and 33 ms at 390 px with 4x CPU throttle, 3D chunk loaded lazily after first paint.

**Tiers:** full (desktop: everything, spot shadow from the tonearm), light (touch, small screens, 4 or fewer cores or PerformanceMonitor decline: DPR 1, 120 motes, no real-time shadow, 1024 textures), static (no WebGL2, context lost, `prefers-reduced-motion`, the on-page "Still image" toggle, or PerformanceMonitor giving up: the existing CSS `Disc` poster in the hero, CSS dust, no scrub), no-JS (a `noscript` summary with the promise and the WhatsApp contact). The canvas is `aria-hidden`; all information is in DOM text.

**Provenance:** procedural, no third-party assets. Every mesh, texture and environment is generated in code at runtime; there is no GLB, HDRI or image file, so there is no licence to record.

**Preloader:** the gold ring follows real progress (fonts loaded, 3D chunk loaded, drei `useProgress` for any loader, first frame rendered), never a timer. A safety timeout ends it if the 3D never reports.

## Do's and Don'ts

- Do keep the record fully visible and the biggest thing in its scene.
- Do add a token here before a page uses it.
- Don't change: black and gold identity (paper is the third colour, never a replacement), the rotating record and the 3D turntable, WhatsApp +91 9220545506, English only.
- Do keep the hero copy column clear of the turntable: at least 48px between the text box and the plinth's on-screen box at 1024, 1280, 1440 and 1920.
- Don't put more than one reactive effect in a scene, and never on body text, forms or tables.
- Brief-driven exceptions (`avoid-ai-design-ignore`): near-black ground with a gold accent (SD2, from the mockup), the gold gradient on display words (C6, from the mockup), the placeholder artist-count figure (L4, from the mockup), motion-heavy scenes and custom cursor (M1/K10/L9 replaced by the premium-interactive-web patterns). The 3D stage adds none: it is the product's own object, not a stock effect (K10 does not apply), and the record label's capitals are the printed artifact's vernacular inside a texture, not UI chrome (SD4/T5 not applicable; nothing for the scanner to flag).
- Don't use: purple or indigo gradients, Inter, cream plus terracotta, acid green, three-card rows, panels and boxes as the default grouping, fake logo walls or testimonials, emoji icons, generic CTA labels, count-up numbers, uniform fade-up, ALL-CAPS labels, one-word emphasis.
- Never invent real artist names, logos or statistics; use visible Placeholder / To confirm tags.

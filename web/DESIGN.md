---
version: alpha
name: KMF Media
description: Music-growth agency and platform for Indian artists, labels and creators, presented as a dark listening room you scroll through. Premium, subtle, classic, very few words, every surface reacts to the pointer.
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
typography:
  display:
    fontFamily: Cormorant Garamond
    fontSize: clamp(3.5rem, 11vw, 11rem)
    fontWeight: 300
    letterSpacing: -0.02em
  ui:
    fontFamily: Manrope
    fontSize: 0.9375rem
    lineHeight: 1.6
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

**Style:** primary = Dark-mode OLED / cinematic (depth from lighter surfaces and warm light). Accent = Kinetic typography / scrollytelling (scroll drives text and the record). Film grain is a texture layer of the dark surface, not a third style.

**Principles come from** `.claude/skills/premium-interactive-web` (read it) and `avoid-ai-design`. The English-only decision is fixed: there is no Hindi and no language toggle.

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

## Typography

- **Display:** Cormorant Garamond Light (300) with Regular and Light Italic, huge and tight, sentence case. Italic is for whole lines, never one word.
- **UI and small text:** Manrope, 15px, quiet. No ALL-CAPS labels, no letter-spaced eyebrows.
- English only; Cormorant renders Latin and the rupee sign is set in Manrope.

## Layout and scenes

Home is six scenes: preloader, hero (pinned), statement (word-by-word scrub), releases (pinned horizontal), doors (giant words), plan selector, close. Inner pages: a giant light title, one short line, ruled content. Container widths vary by scene.

## Background stack

Tonal gradient ground, two drifting warm light blobs, a dust canvas (about 90 motes, pointer parallax, capped DPR, paused offscreen), a light cone behind the record, static film grain at 4%, a vignette, and a scroll-driven tone shift. Static fallback under reduced motion: gradient, cone, grain and vignette.

## Interaction vocabulary

Custom cursor with labels (Open, Drag, Start), magnetic buttons, pointer tilt and following sheen on the record, groove ripple on hover, hover-reveal doors, drag and scroll gallery, curtain page transitions, full-screen overlay menu, one-time preloader. All have touch and reduced-motion fallbacks.

## Motion

Lenis smooth scroll on the GSAP ticker. `power3.out` and `expo.out`, 0.8 to 1.4 seconds, line-mask reveals, staggers in reading order, scenes begin on viewport entry. No bounce, no uniform fade-up, no count-up numbers.

## Components

Disc (the record), Atmosphere, Cursor, Menu, SideToggle (Artist | Label), Magnetic button, SplitLines, Preloader, PageTransition, PageHead and Footer are shared and reused verbatim.

## Do's and Don'ts

- Do keep the record fully visible and the biggest thing in its scene.
- Do add a token here before a page uses it.
- Don't change: black and gold identity, the rotating record, WhatsApp +91 9220545506, English only.
- Brief-driven exceptions (`avoid-ai-design-ignore`): near-black ground with a gold accent (SD2, from the mockup), the gold gradient on display words (C6, from the mockup), the placeholder artist-count figure (L4, from the mockup), motion-heavy scenes and custom cursor (M1/K10/L9 replaced by the premium-interactive-web patterns).
- Don't use: purple or indigo gradients, Inter, cream plus terracotta, acid green, three-card rows, panels and boxes as the default grouping, fake logo walls or testimonials, emoji icons, generic CTA labels, count-up numbers, uniform fade-up, ALL-CAPS labels, one-word emphasis.
- Never invent real artist names, logos or statistics; use visible Placeholder / To confirm tags.

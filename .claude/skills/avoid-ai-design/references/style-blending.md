# Style blending rules (EXTENSION)

Companion to `design-styles.md`. Upstream's rule stands: **one committed direction per project, no hedging across three.** Blending is allowed only deliberately.

## The rule
- **1 primary style** sets the surface language (radius, depth, border, color logic, layout).
- **0-1 accent style** may touch *one* component class or *one* layer (a hero control, the nav, a background).
- Never three. If you can't say which style owns the page, you've hedged.
- Keep **one light source, one radius family, one type system** across the blend.

## Proven pairings
| Primary | Accent | How the accent is allowed in |
|---|---|---|
| Bento | Glass / Liquid Glass | tiles are solid; only overlay chips/nav/cards-over-image are glass |
| Minimalism | Skeuomorphism | one tactile hero control (dial, toggle) in an otherwise flat page |
| Minimalism | Neumorphism | form controls only, with an accent fill for state |
| Brutalism | Maximalist type | giant overlapping headlines inside hard-bordered blocks |
| Brutalism | Grain & halftone | print texture over flat color blocks |
| Aurora | Glass | glass cards over the aurora field (aurora = background layer only) |
| Aurora | Grain | grain overlay to kill gradient banding |
| Spatial UI | Liquid Glass | windows are liquid glass; depth layers carry hierarchy |
| Editorial | Kinetic typography | motion confined to display type and reveals |
| Swiss | Minimalism | strict grid + reduced ornament |
| Claymorphism | Memphis | clay objects as the shape vocabulary of a Memphis page |
| Dark OLED | Cyberpunk / Aurora | neon or glow as sparse accents on elevation-by-lightness surfaces |

## Conflicts (don't combine)
- Neumorphism × Glassmorphism: opposite depth logic (extrusion vs translucency).
- Brutalism × Liquid Glass / Skeuomorphism: opposite attitude to polish.
- Minimalism × Maximalism: cancel each other. Pick the loud or the quiet.
- Claymorphism × Brutalism: soft vs hard shadows fight; hard offset shadows only.

## Checklist before shipping a blend
1. Name primary + accent in one sentence and where the accent appears.
2. Tokens: one radius scale, one shadow/light direction, one spacing scale.
3. Contrast + reduced-motion/transparency fallbacks pass (see universal floor in `design-styles.md`).
4. SD1-SD8 check: unless the brief named it, the result must not land in cream+terracotta, near-black+acid-green, mono chrome, etc.
5. For multi-page work, record the primary/accent and tokens in `DESIGN.md` so every page reuses them (catalog X1).

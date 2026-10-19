# Background recipes

A flat colour reads as a template. Premium backgrounds are built from cheap layers.

## The stack (back to front)

1. **Tonal gradient ground.** A deep base with a slight vertical gradient, not one hex. Example: `linear-gradient(180deg, #0b0907 0%, #070605 60%, #0a0806 100%)`.
2. **Drifting warm light.** Two large blurred radial gradients (gold at 8 to 14% alpha) moving on 30 to 50 second CSS loops using transform. Different phases so they never align.
3. **Dust.** A canvas of 60 to 100 small gold motes (0.5 to 1.8px) with slow drift, depth-based parallax to the pointer, and an occasional soft glint. Cap device-pixel-ratio at 1.5. Pause when offscreen or `document.hidden`. Skip entirely under reduced motion.
4. **Light cone.** A conic or linear gradient mask from the top of the hero object, soft edges, 10 to 18% alpha. It sells that the object is lit.
5. **Film grain.** One static SVG `feTurbulence` noise tile as a data URI at 3 to 4% opacity with `mix-blend-mode: overlay`. One cheap layer for the whole page. Never animate it.
6. **Vignette.** A radial gradient darkening the edges by 40 to 55%.
7. **Scroll tone shift.** Tween `--ground` between scenes (for example deep black to warm near-black) so scrolling feels like moving through rooms. Travel a bronze glow down the page with the scroll.
8. **Echo rings.** Faint concentric rings behind the signature object that expand with scroll velocity.

## Rules

- Never more than one grain layer and one canvas.
- Keep text contrast AA on the brightest part of any background layer.
- Everything above is transform or opacity, except the canvas draw.
- Provide a static fallback: layers 1, 4, 5 and 6 are enough when motion is off.

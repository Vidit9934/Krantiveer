# 3D websites

Rules for any brief that says 3D, WebGL, Three.js, React Three Fiber, a 3D product viewer, a GLB model, a shader background or a 3D scroll scene. They sit on top of the ten rules in `SKILL.md`: the 3D object is the signature object, scenes still carry one idea each, the word budget and the solid nav still apply, and every effect still needs a fallback.

**How sure is each rule?** Rules marked *(docs)* come from the R3F, glTF-Transform or MDN documentation. Rules marked *(practice)* come from practitioner write-ups and general Three.js habit. Numbers in the budget table are defaults to tune per project, not standards. Dispose and colour-space guidance was not checked against the Three.js manual (those pages did not load during research); confirm it there before relying on edge cases.

## 1. Decision gate: does this need real 3D?

Ask in order and stop at the first yes:

1. Can the depth come from CSS 3D transforms, layered parallax or a pointer tilt? Use that.
2. Is the object fixed and the camera path fixed? Use a pre-rendered image sequence or a short video scrubbed by scroll. It costs less and looks identical.
3. Does the visitor need to move around, rotate, configure or light the object? Only then, use WebGL.

Use 3D for one hero object. Do not 3D-ify headings, cards or the whole page. If 3D is chosen, name `three`, `@react-three/fiber` and `@react-three/drei` as dependencies in `DESIGN.md`.

## 2. Scene list for 3D

Extend the normal scene list (name, one idea, focal object, motion, word count) with:

| Beat | Camera pose | Object state | Uniform / material change | DOM text |
|---|---|---|---|---|

Keep it to 5 to 7 beats *(practice)*. Each beat has a still pose that reads well on its own, because that pose is also the reduced-motion and no-WebGL fallback.

## 3. Architecture

- **One fixed canvas** behind the DOM. Scenes are real HTML scrolling over it. Text stays selectable and indexable.
- **One clock.** Lenis runs on the GSAP ticker. ScrollTrigger scrub drives a single master timeline that animates camera position, object transforms and shader uniforms. Do not start a second `requestAnimationFrame` loop.
- **Native scroll.** Never hijack wheel, touch or keyboard scrolling. Lenis smooths it, it does not replace it.
- **Lazy-load** the canvas chunk and the model. First paint and LCP come from the DOM and the poster image, never from WebGL.
- **Render on demand** with `<Canvas frameloop="demand">` and call `invalidate()` from the scroll/timeline update *(docs)*. Switch to `always` only while a continuous effect is on screen.

Skeleton (adapt names; keep the single ticker):

```tsx
// scroll.ts: one clock for everything
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export const lenis = new Lenis({ lerp: 0.08 });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
```

```tsx
// Hero3D.tsx: timeline mutates refs, React does not re-render per frame
const rig = useRef({ x: 0, y: 0, z: 6, rot: 0 });
useGSAP(() => {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: "#story", start: "top top", end: "bottom bottom", scrub: 1 },
    onUpdate: () => invalidate(),
  });
  tl.to(rig.current, { z: 3.2, rot: Math.PI * 0.5, ease: "none" })
    .to(rig.current, { x: 1.2, ease: "none" });
}, []);
useFrame(({ camera }) => {
  camera.position.set(rig.current.x, rig.current.y, rig.current.z);
  camera.lookAt(0, 0, 0);
});
```

Rules for the loop *(practice)*: no `setState` inside `useFrame`, no object or array allocation inside it, no per-frame `new THREE.Color/Vector3`.

## 4. Asset pipeline

- **Format:** GLB.
- **Order of work:** inspect, then shrink textures, then compress, then reduce geometry. Textures are usually most of the file and all of the video memory *(practice)*.
- **glTF-Transform** *(docs)*:
  - `gltf-transform inspect model.glb` to find geometry-heavy, texture-heavy or draw-call-heavy models.
  - `gltf-transform optimize in.glb out.glb --compress meshopt --texture-compress webp` as the one-step start. Use `--texture-compress ktx2` style KTX2 compression when GPU memory matters. Run `optimize -h` for the exact flags of the installed version.
  - Individual steps when needed: `dedup`, `prune`, `resize`, `simplify`, `join`, `instance`, `meshopt` or `draco`.
- **Meshopt vs Draco** *(practice, sources disagree)*: Meshopt decodes faster and keeps animation and morph targets intact; Draco usually compresses a little smaller but needs a larger decoder. Default to Meshopt. Choose by measuring the actual model.
- **Poster:** export a still of every beat. Posters are the fallback and the loading state.
- **Provenance:** record the source and licence of every model, HDRI and texture in `DESIGN.md`. Never ship an asset of unknown licence.

## 5. Budgets (defaults, tune per project)

| Item | Desktop | Mobile / low-end |
|---|---|---|
| Hero model, compressed | about 1.5 MB or less | about 0.8 MB or less |
| Triangles on screen | about 100k | about 50k |
| Draw calls | a few hundred at most *(docs: under 1000 hard ceiling)*; aim under 100 | under 50 |
| Texture size | 2048 max | 1024 max |
| Device pixel ratio | cap at 2 | cap at 1.5 |
| Frame time p95 | 16.7 ms | 33 ms (30 fps floor) |
| Lights casting real-time shadows | 1 | 0 |

Draw calls matter more than triangles *(practice)*. Use `instancedMesh` for repeats *(docs)* and share geometry and material instances instead of creating new ones per mesh *(docs)*. `<Detailed />` from drei gives level of detail by distance *(docs)*.

## 6. Rendering and look

- **Colour:** keep colour management on (sRGB output). Colour textures are sRGB, data textures (normal, roughness, metalness, AO) are linear *(practice)*.
- **Tone mapping:** one filmic or neutral tone map, set once.
- **Light:** one small HDRI for reflections plus one key light. A 1k HDRI is enough for most objects. A model lit by a flat ambient light looks like clay.
- **Shadows:** baked or contact shadows. Real-time shadow maps only for one hero light on desktop.
- **Post-processing:** at most bloom (subtle), vignette and grain, merged into one pass chain. Film grain and vignette already belong to the atmosphere stack in `background-recipes.md`, so do not stack a second set in WebGL and CSS.
- **Adaptive quality:** drei `PerformanceMonitor` with `onIncline` / `onDecline`, upper and lower FPS bounds so it cannot oscillate, and `flipflops` to give up gracefully *(docs)*. Start DPR near 1.5, drop to 1 on decline.
- **Loading:** nest `Suspense` so a low-quality model shows first and the full one swaps in *(docs)*. Use `useProgress` for a real preloader percentage, never a fake timer.

## 7. Interaction

- Damp everything (lerp or spring). Pointer tilt on the object, a few degrees at most.
- No auto-rotating `OrbitControls`. If the visitor may orbit, clamp polar and azimuth angles and limit zoom.
- Camera moves are slow and eased. Large scaling or panning of big objects is a vestibular trigger *(docs, MDN)*.
- Touch: native swipe, no custom cursor, simplified or static poses. Never trap vertical scroll inside the canvas.

## 8. Fallback tiers

| Tier | Condition | Behaviour |
|---|---|---|
| Full | WebGL works, desktop-class GPU | Everything above |
| Light | Touch device, low memory, or PerformanceMonitor declined | DPR 1, no post-processing, no real-time shadows, fewer particles, shorter beats |
| Static | No WebGL, context lost, `prefers-reduced-motion: reduce`, or load failed | Poster for each beat, no scrub, no camera motion; fades only *(docs)* |
| No JS | Scripts blocked | Poster and fully readable DOM text |

Also:
- Detect WebGL before loading the heavy chunk. Listen for `webglcontextlost` and `webglcontextrestored` and fall back to the static tier.
- Offer an on-page motion toggle in addition to the system setting *(practice)*.
- The canvas is `aria-hidden` and decorative. The same information lives in DOM text and `alt` on the posters.
- Put a scrim behind text that overlaps bright 3D areas so AA contrast holds on every frame of the scrub.
- Keyboard focus stays visible and keyboard users can reach every beat's content without the canvas.

## 9. Lifecycle

- Dispose geometries, materials, textures and render targets when a scene unmounts. R3F disposes what it created, but anything you create by hand or load outside R3F is yours *(practice)*.
- Pause rendering when the canvas is offscreen (`IntersectionObserver`) and when the tab is hidden.
- Cache loaded assets by URL so repeats reuse them *(docs: `useLoader` caches by URL)*.
- Defer heavy React work with `startTransition` so it cannot jank the scrub *(docs)*.

## 10. 3D slop to refuse

- Spinning chrome blob, icosahedron or torus knot with no tie to the product.
- Floating glass orbs and gradient meshes as decoration.
- Default purple-to-blue glow, bloom on everything.
- Auto-rotating model on a plain background.
- Unlit or default-grey GLB straight from a marketplace.
- A canvas that works as a screensaver while the real content is flat text.
- 3D chosen first and the story invented afterwards.

If a brief-driven 3D choice trips an `avoid-ai-design` tell, mark it `avoid-ai-design-ignore: <ID>` with a reason and list it in `DESIGN.md`, as `SKILL.md` already requires.

## 11. Verification (measured, not eyeballed)

1. `renderer.info.render.calls`, `.triangles` and `renderer.info.memory.textures` logged per beat; compare with the budget table.
2. p95 frame time while scrolling the whole page at desktop, and again with 4x CPU throttle and a 390 px viewport.
3. Screenshots of every beat at 1440, 1024 and 390 that confirm the canvas is not blank (headless Chrome may need software GL flags; say so if it did).
4. A run with `prefers-reduced-motion: reduce` and a run with WebGL disabled; both must show readable posters and content.
5. Console free of WebGL warnings and shader errors; fonts loaded; no horizontal overflow; CLS 0.
6. Total JS and asset weight of the 3D chunk recorded in the report. State what was not tested (for example real mobile hardware).

## Sources

- R3F, Scaling performance: https://r3f.docs.pmnd.rs/advanced/scaling-performance
- glTF-Transform CLI: https://gltf-transform.dev/cli
- MDN, prefers-reduced-motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- Practitioner guides on GLB optimisation, scroll-driven 3D and 3D UX accessibility (secondary, verify before treating as standard).

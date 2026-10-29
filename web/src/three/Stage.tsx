import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { PerformanceMonitor, useProgress } from "@react-three/drei";
import { gsap } from "../motion/gsap";
import { useReady } from "../motion/env";
import { setProgress, stage } from "../motion/stage";
import type { StageTier } from "../motion/stage";
import type { Side } from "../context/SideContext";
import { Turntable } from "./Turntable";
import { consumeDirty, invalidate, moving, rig } from "./rig";
import { useScrollRig, useSideFlip } from "./useScrollRig";

interface StageProps {
  tier: Exclude<StageTier, "static">;
  side: Side;
}

const mobile = () => window.matchMedia("(hover: none), (pointer: coarse)").matches;

/**
 * The fixed WebGL stage behind the home scenes. Loaded lazily, only after the gate in
 * components/Scene3D.tsx has confirmed WebGL2 and motion.
 */
export default function Stage({ tier, side }: StageProps) {
  const quality = tier === "full" ? "full" : "light";
  const cap = mobile() ? 1.5 : 2;
  const native = window.devicePixelRatio || 1;
  const [dpr, setDpr] = useState(() => Math.min(native, quality === "full" ? 1.5 : 1));
  const [quiet, setQuiet] = useState(false);
  const onQuiet = useCallback((q: boolean) => setQuiet(q), []);

  /* A real context loss drops to the static tier. R3F also forces a context loss when the canvas
     unmounts (route change), and that fires before this effect's cleanup can detach, so the
     verdict waits a tick: if the stage has unmounted by then, the loss was ours and is ignored. */
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    let mounted = true;
    const onLost = (e: Event) => {
      e.preventDefault();
      window.setTimeout(() => mounted && stage.degrade("static"), 0);
    };
    const el = canvasEl.current;
    el?.addEventListener("webglcontextlost", onLost);
    return () => {
      mounted = false;
      el?.removeEventListener("webglcontextlost", onLost);
    };
  }, []);

  return (
    <Canvas
      ref={canvasEl}
      className="stage3d__canvas"
      frameloop="never"
      dpr={dpr}
      shadows={quality === "full" ? "percentage" : false}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", stencil: false }}
      camera={{ fov: 30, near: 0.5, far: 60, position: [rig.cx, rig.cy, rig.cz] }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.domElement.setAttribute("aria-hidden", "true");
      }}
    >
      {!quiet && (
        <PerformanceMonitor
          bounds={(refresh) => (refresh > 100 ? [55, 95] : [42, 56])}
          flipflops={3}
          onDecline={() => setDpr(1)}
          onIncline={() => setDpr(Math.min(native, cap))}
          onFallback={() => {
            setDpr(1);
            stage.degrade("light");
          }}
        />
      )}
      <Driver />
      <Rig side={side} onQuiet={onQuiet} />
      <Room />
      <Turntable quality={quality} onReady={onFirstFrame} />
    </Canvas>
  );
}

function onFirstFrame() {
  setProgress("frame", 1);
  stage.setReady(true);
}

function Rig({ side, onQuiet }: { side: Side; onQuiet: (q: boolean) => void }) {
  useScrollRig(onQuiet);
  useSideFlip(side);
  return null;
}

/**
 * One clock: the canvas is advanced from the GSAP ticker (the one Lenis runs on), never from
 * its own requestAnimationFrame. It draws every tick while something moves and only when
 * flagged otherwise. It also pauses while the tab is hidden or the home page is off screen.
 */
function Driver() {
  const advance = useThree((s) => s.advance);
  const gl = useThree((s) => s.gl);
  const size = useThree((s) => s.size);
  const get = useThree((s) => s.get);
  const { progress, active } = useProgress();
  const appReady = useReady();

  useEffect(() => {
    if (active) setProgress("loaders", progress / 100);
    else setProgress("loaders", 1);
  }, [progress, active]);

  useEffect(() => invalidate(2), [size]);

  /* Watchdog: if the first frames have not been drawn a few seconds after mount (seen once in about
     ten route round trips, cause unconfirmed), ask for them again instead of waiting for input. */
  useEffect(() => {
    const t1 = window.setTimeout(() => invalidate(4), 3000);
    const t2 = window.setTimeout(() => invalidate(4), 6000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  /* Arrival: once the preloader has lifted, the camera settles in from a little further out. */
  useEffect(() => {
    if (!appReady) return;
    /* One short timeline on rig fields: the camera pushes in from far and dark, the light cone opens,
       the record spins up, the needle drops into the lead-in and lifts back to the hero pose. */
    gsap.set(rig, { intro: 1, iArm: 0, iNeedle: 0, iSpin: 0, iCone: 0 });
    const tw = gsap.timeline({ delay: 0.05, onUpdate: () => invalidate() });
    tw.to(rig, { intro: 0, duration: 2.4, ease: "expo.out" }, 0)
      .to(rig, { iCone: 1, duration: 1.4, ease: "power2.out" }, 0.2)
      .to(rig, { iSpin: 1, duration: 1.8, ease: "power2.out" }, 0.3)
      .to(rig, { iArm: 1, duration: 0.7, ease: "power2.inOut" }, 0.7)
      .to(rig, { iNeedle: 1, duration: 0.25, ease: "power1.in" }, 1.3)
      .to(rig, { iNeedle: 0, duration: 0.3, ease: "power1.out" }, 1.85)
      .to(rig, { iArm: 0, duration: 0.7, ease: "power2.inOut" }, 1.9);
    return () => {
      tw.kill();
    };
  }, [appReady]);

  useEffect(() => {
    let onScreen = true;
    const main = document.getElementById("main");
    const io = main
      ? new IntersectionObserver(([e]) => {
          onScreen = e.isIntersecting;
          if (onScreen) invalidate();
        })
      : null;
    if (main && io) io.observe(main);

    const info = gl.info;
    const debug = import.meta.env.DEV || /[?&]debug3d/.test(window.location.search);
    const stats = { calls: 0, triangles: 0, textures: 0, geometries: 0, programs: 0, frames: 0, last: 0, cpu: new Float32Array(600) };
    if (debug) (window as unknown as { __kmf3d: unknown }).__kmf3d = { rig, stats, gl, get, moving };

    const tick = (time: number) => {
      if (document.hidden || !onScreen) return;
      const draw = moving.value || consumeDirty();
      if (!draw) return;
      const t0 = debug ? performance.now() : 0;
      advance(time);
      if (debug) {
        stats.cpu[stats.frames % stats.cpu.length] = performance.now() - t0;
        stats.calls = info.render.calls;
        stats.triangles = info.render.triangles;
        stats.textures = info.memory.textures;
        stats.geometries = info.memory.geometries;
        stats.programs = info.programs?.length ?? 0;
        stats.frames++;
        stats.last = time;
      }
    };
    gsap.ticker.add(tick);
    const onVis = () => !document.hidden && invalidate();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      gsap.ticker.remove(tick);
      document.removeEventListener("visibilitychange", onVis);
      io?.disconnect();
    };
  }, [advance, gl, get]);

  return null;
}

/**
 * The room's reflections: a procedural environment of soft light panels (the Lightformer
 * technique: unlit emissive cards), baked once through PMREM into a small cube map. Built here
 * rather than with drei's <Environment>, which would pull its HDR/EXR/gain-map loaders into the
 * chunk for nothing. No HDRI file.
 */
const PANELS: { form: "rect" | "circle"; intensity: number; color: string; scale: [number, number]; position: [number, number, number] }[] = [
  // Overhead softbox, warm
  { form: "rect", intensity: 1.3, color: "#fff0d6", scale: [3.2, 2], position: [-1, 7, 1] },
  // Long strip on the left: the streak that runs along lacquer and gold
  { form: "rect", intensity: 4.6, color: "#ffe2b8", scale: [12, 0.8], position: [-7, 1.1, 2] },
  // Thin cool strip on the right so the black reads as black, not brown
  { form: "rect", intensity: 1.1, color: "#f4efe6", scale: [12, 0.35], position: [7, 1.6, -1.5] },
  // Gold bounce from behind
  { form: "rect", intensity: 1.1, color: "#c99a4a", scale: [9, 0.8], position: [0, 3.2, -8] },
  // Low front fill, very soft
  { form: "circle", intensity: 0.5, color: "#ffe9c8", scale: [4, 4], position: [2, 1.5, 8] },
];

function Room() {
  const get = useThree((s) => s.get);
  useEffect(() => {
    const { gl, scene } = get();
    const room = new THREE.Scene();
    const rect = new THREE.PlaneGeometry(1, 1);
    const disc = new THREE.CircleGeometry(0.5, 48);
    const mats: THREE.Material[] = [];
    for (const p of PANELS) {
      const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(p.color).multiplyScalar(p.intensity), side: THREE.DoubleSide, toneMapped: false });
      mats.push(m);
      const mesh = new THREE.Mesh(p.form === "rect" ? rect : disc, m);
      mesh.scale.set(p.scale[0], p.scale[1], 1);
      mesh.position.set(...p.position);
      mesh.lookAt(0, 0, 0);
      room.add(mesh);
    }
    const pmrem = new THREE.PMREMGenerator(gl);
    const target = pmrem.fromScene(room, 0.02, 0.1, 100, { size: 256 });
    scene.environment = target.texture;
    invalidate(2);
    return () => {
      scene.environment = null;
      target.dispose();
      pmrem.dispose();
      rect.dispose();
      disc.dispose();
      mats.forEach((m) => m.dispose());
    };
  }, [get]);
  return null;
}

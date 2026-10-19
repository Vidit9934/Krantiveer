import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../motion/env";

interface Mote {
  x: number;
  y: number;
  z: number;
  r: number;
  a: number;
  drift: number;
  phase: number;
}

const COUNT = 90;

function makeSprite() {
  const s = document.createElement("canvas");
  s.width = s.height = 64;
  const c = s.getContext("2d")!;
  const g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(236, 212, 147, 1)");
  g.addColorStop(0.25, "rgba(236, 212, 147, 0.55)");
  g.addColorStop(1, "rgba(236, 212, 147, 0)");
  c.fillStyle = g;
  c.fillRect(0, 0, 64, 64);
  return s;
}

/**
 * Gold dust drifting in the light. One canvas for the whole page: capped pixel ratio, a
 * pre-rendered glow sprite instead of per-frame gradients, paused when the tab is hidden,
 * and drawn once (no loop) when the visitor prefers reduced motion.
 */
export function DustField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const sprite = makeSprite();
    const still = prefersReducedMotion();
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let motes: Mote[] = [];

    const seed = () => {
      motes = Array.from({ length: COUNT }, () => {
        const z = 0.25 + Math.random() * 0.75;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          r: 1.6 + z * 5.5,
          a: 0.18 + z * 0.5,
          drift: (Math.random() - 0.5) * 0.12,
          phase: Math.random() * Math.PI * 2,
        };
      });
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;
      for (const m of motes) {
        if (!still) {
          m.x += m.drift * m.z;
          m.y -= (0.06 + m.z * 0.1) * m.z;
          if (m.y < -20) {
            m.y = h + 20;
            m.x = Math.random() * w;
          }
          if (m.x < -20) m.x = w + 20;
          if (m.x > w + 20) m.x = -20;
        }
        const twinkle = still ? 1 : 0.55 + 0.45 * Math.sin(t * 0.0009 + m.phase);
        ctx.globalAlpha = m.a * twinkle;
        const px = m.x + pointer.x * 38 * m.z;
        const py = m.y + pointer.y * 24 * m.z;
        ctx.drawImage(sprite, px - m.r, py - m.r, m.r * 2, m.r * 2);
      }
      ctx.globalAlpha = 1;
    };
    const loop = (t: number) => {
      if (!running) return;
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      pointer.tx = e.clientX / w - 0.5;
      pointer.ty = e.clientY / h - 0.5;
    };
    const onVisibility = () => {
      running = !document.hidden;
      if (running && !still) raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    if (still) {
      draw(0);
    } else {
      window.addEventListener("pointermove", onMove);
      document.addEventListener("visibilitychange", onVisibility);
      raf = requestAnimationFrame(loop);
    }
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="atmos__dust" aria-hidden="true" />;
}

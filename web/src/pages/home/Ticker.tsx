import { useRef } from "react";
import { gsap, useGSAP } from "../../motion/gsap";
import { prefersReducedMotion } from "../../motion/env";
import { scrollVelocity } from "../../motion/Smooth";
import { regions } from "../../data/site";

const words = regions.map((r) => r.name);

/**
 * One running line of the languages KMF markets in, between two paper scenes. It drifts at
 * rest, runs faster with the scroll and turns round when you scroll back up. Decorative: the
 * same languages are in the Doors and Estimator scenes. Still under reduced motion.
 */
export function Ticker() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const t = track.current;
      const host = root.current;
      if (!t || !host || prefersReducedMotion()) return;
      let x = 0;
      let dir = -1;
      let on = false;
      const io = new IntersectionObserver(([e]) => (on = e.isIntersecting));
      io.observe(host);
      const s = { v: 0 };
      const damp = gsap.quickTo(s, "v", { duration: 0.5, ease: "power2.out" });
      const tick = (_time: number, dt: number) => {
        if (!on) return;
        const v = scrollVelocity();
        if (Math.abs(v) > 0.5) dir = v > 0 ? -1 : 1;
        damp(Math.min(40, Math.abs(v)));
        const half = t.scrollWidth / 2;
        x += dir * (0.04 + s.v * 0.02) * dt;
        if (x <= -half) x += half;
        if (x > 0) x -= half;
        t.style.transform = `translate3d(${x}px,0,0)`;
      };
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        io.disconnect();
      };
    },
    { scope: root },
  );

  const run = [...words, ...words];
  return (
    <div ref={root} className="ticker" aria-hidden="true">
      <div ref={track} className="ticker__track">
        {[0, 1].map((k) => (
          <span key={k} className="ticker__run">
            {run.map((w, i) => (
              <span key={i} className="ticker__item">
                {w}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

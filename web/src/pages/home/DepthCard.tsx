import { useRef } from "react";
import { gsap, useGSAP } from "../../motion/gsap";
import { hasFinePointer, prefersReducedMotion } from "../../motion/env";
import { Art } from "../../components/Art";

/**
 * A layered release cover in CSS 3D: back plate, the record sliding from the sleeve, the sleeve art,
 * a front edge and a glare sweep. It turns about 10 degrees each way on a loop and tilts toward the
 * pointer. No WebGL. Still under reduced motion.
 */
export function DepthCard() {
  const tilt = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = tilt.current;
      const host = root.current;
      if (!el || !host || prefersReducedMotion() || !hasFinePointer()) return;
      const rx = gsap.quickTo(el, "rotationX", { duration: 0.8, ease: "power3.out" });
      const ry = gsap.quickTo(el, "rotationY", { duration: 0.8, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        const r = host.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 22);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 16);
      };
      const leave = () => {
        rx(0);
        ry(0);
      };
      host.addEventListener("pointermove", move);
      host.addEventListener("pointerleave", leave);
      return () => {
        host.removeEventListener("pointermove", move);
        host.removeEventListener("pointerleave", leave);
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="depth" aria-hidden="true">
      <div ref={tilt} className="depth__tilt">
        <div className="depth__turn">
          <span className="depth__plate" />
          <span className="depth__disc" />
          <div className="depth__sleeve">
            <Art slot="depth" />
            <span className="depth__glare" />
          </div>
          <span className="depth__edge" />
        </div>
      </div>
      <span className="depth__cap mono">KMF-052 · sleeve and record</span>
    </div>
  );
}

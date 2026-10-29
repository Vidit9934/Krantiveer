import { useRef } from "react";
import type { ElementType, ReactNode } from "react";
import { gsap, useGSAP } from "./gsap";
import { prefersReducedMotion } from "./env";
import { scrollVelocity } from "./Smooth";

interface VelocityTypeProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  id?: string;
  /** Resting weight; the type gets a touch heavier and narrower while the page moves fast. */
  wght?: number;
}

/**
 * Giant type that answers the scroll: width condenses and the letters lean a few degrees with
 * scroll speed, then settle. Runs on the GSAP ticker only while on screen. Static without
 * smooth scroll (reduced motion).
 */
export function VelocityType({ children, as: Tag = "span", className = "", id, wght = 650 }: VelocityTypeProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const s = { v: 0 };
      const paint = () => {
        const a = Math.min(1, Math.abs(s.v));
        el.style.fontVariationSettings = `"wght" ${wght + a * 150}, "wdth" ${94 - a * 16}`;
        el.style.transform = `skewX(${-s.v * 6}deg)`;
      };
      const damp = gsap.quickTo(s, "v", { duration: 0.6, ease: "power3.out", onUpdate: paint });
      let on = false;
      const io = new IntersectionObserver(([e]) => (on = e.isIntersecting));
      io.observe(el);
      const tick = () => {
        if (on) damp(Math.max(-1, Math.min(1, scrollVelocity() / 40)));
      };
      gsap.ticker.add(tick);
      paint();
      return () => {
        gsap.ticker.remove(tick);
        io.disconnect();
      };
    },
    { scope: ref, dependencies: [wght] },
  );

  return (
    <Tag ref={ref} id={id} className={`vtype ${className}`}>
      {children}
    </Tag>
  );
}

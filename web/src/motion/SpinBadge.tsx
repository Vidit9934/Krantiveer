import { useId, useRef } from "react";
import type { ReactNode } from "react";
import { gsap, useGSAP } from "./gsap";
import { prefersReducedMotion } from "./env";
import { scrollVelocity } from "./Smooth";

interface SpinBadgeProps {
  /** Printed around the ring, like a record label. Keep it short. */
  text: string;
  size?: number;
  className?: string;
  children?: ReactNode;
}

/**
 * A ring of DM Mono text that turns like a record label: slowly at rest, faster while the
 * page scrolls. Decorative (the same words exist in the DOM nearby). Still under reduced motion.
 */
export function SpinBadge({ text, size = 112, className = "", children }: SpinBadgeProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const pathId = useId().replace(/:/g, "");

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const ring = ref.current?.querySelector("svg");
      if (!ring) return;
      const spin = gsap.to(ring, { rotation: 360, duration: 18, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
      const rate = gsap.quickTo(spin, "timeScale", { duration: 0.5, ease: "power2.out" });
      const tick = () => {
        rate(1 + Math.min(6, Math.abs(scrollVelocity()) / 6));
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={`spinbadge ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 100 100">
        <defs>
          <path id={pathId} d="M50 50 m-40 0 a40 40 0 1 1 80 0 a40 40 0 1 1 -80 0" />
        </defs>
        <text>
          <textPath href={`#${pathId}`} textLength="251" lengthAdjust="spacing">
            {`${text} · `}
          </textPath>
        </text>
      </svg>
      {children && <span className="spinbadge__core">{children}</span>}
    </span>
  );
}

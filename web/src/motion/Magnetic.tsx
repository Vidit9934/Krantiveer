import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { gsap } from "./gsap";
import { hasFinePointer, prefersReducedMotion } from "./env";

interface MagneticProps {
  children: ReactNode;
  /** Fraction of the pointer offset the element follows. */
  strength?: number;
  className?: string;
}

/** The wrapped control drifts toward the pointer and settles back on leave. Pointer devices only. */
export function Magnetic({ children, strength = 0.28, className = "" }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !hasFinePointer() || prefersReducedMotion()) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);

  return (
    <span ref={ref} className={`magnetic ${className}`}>
      {children}
    </span>
  );
}

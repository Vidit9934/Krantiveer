import { useEffect, useRef } from "react";
import { gsap } from "./gsap";
import { hasFinePointer, prefersReducedMotion } from "./env";

/**
 * A small ring that follows the pointer, grows over interactive things and shows a label
 * for any element with data-cursor="Open". Hidden on touch and with reduced motion.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ring.current;
    if (!el || !hasFinePointer() || prefersReducedMotion()) return;
    document.documentElement.classList.add("has-cursor");
    gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      gsap.to(el, { autoAlpha: 1, duration: 0.3, overwrite: "auto" });
    };
    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      const interactive = target?.closest("a, button, summary, [role='button'], label, select");
      const text = labelled?.dataset.cursor ?? "";
      if (label.current) label.current.textContent = text;
      el.classList.toggle("is-label", Boolean(text));
      el.classList.toggle("on-paper", Boolean(target?.closest(".paper, .scene-paper")));
      el.classList.toggle("on-gold", Boolean(target?.closest("[data-surface='gold'], .scene-close, .footer__cta, .btn--primary, .tag--gold")));
      el.classList.toggle("is-hot", Boolean(interactive) && !text);
    };
    const onLeave = () => gsap.to(el, { autoAlpha: 0, duration: 0.3 });

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerover", onOver);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ring} className="cursor" aria-hidden="true">
      <span ref={label} className="cursor__label" />
    </div>
  );
}

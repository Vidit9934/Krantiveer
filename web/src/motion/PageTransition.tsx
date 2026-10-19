import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { gsap, ScrollTrigger } from "./gsap";
import { prefersReducedMotion } from "./env";
import { scrollControl } from "./Smooth";

/**
 * A curtain that covers the new page for an instant and wipes away upward.
 * The first load is skipped (the preloader handles it). Scroll resets to the top.
 */
export function PageTransition() {
  const { pathname } = useLocation();
  const curtain = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useLayoutEffect(() => {
    scrollControl.toTop();
    if (first.current) {
      first.current = false;
      return;
    }
    const el = curtain.current;
    if (!el || prefersReducedMotion()) return;
    gsap.killTweensOf(el);
    gsap.set(el, { display: "block", yPercent: 0 });
    const tween = gsap.to(el, {
      yPercent: -100,
      duration: 0.9,
      delay: 0.12,
      ease: "power3.inOut",
      onComplete: () => {
        gsap.set(el, { display: "none" });
        ScrollTrigger.refresh();
      },
    });
    return () => {
      tween.kill();
    };
  }, [pathname]);

  return <div ref={curtain} className="curtain" aria-hidden="true" />;
}

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";
import { prefersReducedMotion } from "./env";

let lenis: Lenis | null = null;

/** Menu and preloader pause scrolling through these. */
export const scrollControl = {
  stop: () => lenis?.stop(),
  start: () => lenis?.start(),
  toTop: () => (lenis ? lenis.scrollTo(0, { immediate: true, force: true }) : window.scrollTo(0, 0)),
};

/** Lenis scroll velocity in px per frame (0 without smooth scroll). Read on the GSAP ticker. */
export const scrollVelocity = () => lenis?.velocity ?? 0;

/**
 * Smooth scroll on the GSAP ticker so scrubbed scenes stay in step with the scroll.
 * Not created at all under prefers-reduced-motion.
 */
export function Smooth() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const instance = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 3), smoothWheel: true });
    lenis = instance;
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // Text reflows once the fonts arrive; every pinned scene must re-measure afterwards.
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      lenis = null;
    };
  }, []);
  return null;
}

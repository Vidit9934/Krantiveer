import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { ScrollTrigger, useGSAP } from "../motion/gsap";
import { prefersReducedMotion } from "../motion/env";
import { useStageTier } from "../motion/stage";
import { DustField } from "./DustField";

/**
 * The room: layered, fixed behind every page. Gradient ground, two drifting warm lights,
 * dust, a vignette and film grain. Scroll progress is written to --p so the glow travels
 * down the page and the ground warms between scenes. On home, while the 3D stage runs, its WebGL
 * dust replaces the CSS dust canvas (never both).
 */
export function Atmosphere() {
  const root = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const tier = useStageTier();
  const webglDust = pathname === "/" && tier !== "static";

  useGSAP(
    () => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return;
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => el.style.setProperty("--p", self.progress.toFixed(4)),
      });
    },
    { scope: root },
  );

  return (
    <>
      <div ref={root} className="atmos" aria-hidden="true">
        <div className="atmos__ground" />
        <div className="atmos__blob atmos__blob--a" />
        <div className="atmos__blob atmos__blob--b" />
        <div className="atmos__glow" />
        {!webglDust && <DustField />}
        <div className="atmos__vignette" />
      </div>
      <div className="grain" aria-hidden="true" />
    </>
  );
}

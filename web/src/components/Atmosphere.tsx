import { useRef } from "react";
import { ScrollTrigger, useGSAP } from "../motion/gsap";
import { prefersReducedMotion } from "../motion/env";
import { DustField } from "./DustField";

/**
 * The room: layered, fixed behind every page. Gradient ground, two drifting warm lights,
 * dust, a vignette and film grain. Scroll progress is written to --p so the glow travels
 * down the page and the ground warms between scenes.
 */
export function Atmosphere() {
  const root = useRef<HTMLDivElement>(null);

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
        <DustField />
        <div className="atmos__vignette" />
      </div>
      <div className="grain" aria-hidden="true" />
    </>
  );
}

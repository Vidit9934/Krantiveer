import { useRef } from "react";
import { gsap, useGSAP } from "../../motion/gsap";
import { prefersReducedMotion } from "../../motion/env";
import { useStageTier } from "../../motion/stage";
import { Art } from "../../components/Art";
import { media } from "../../data/media";

/**
 * A rounded window that grows to full bleed as you scroll (pinned). The window is a transparent hole
 * in an opaque ground, so the live 3D canvas (beat 4, macro of the grooves) shows through; a real
 * video replaces it when the manifest has one; without WebGL the Reel art fills it.
 */
export function Reel() {
  const root = useRef<HTMLElement>(null);
  const win = useRef<HTMLDivElement>(null);
  const tier = useStageTier();
  const video = media.reel?.video;
  const live = !video && tier !== "static";

  useGSAP(
    () => {
      const w = win.current;
      if (!w || prefersReducedMotion()) return;
      const phone = () => window.innerWidth < 760;
      gsap.fromTo(
        w,
        {
          width: () => window.innerWidth * (phone() ? 0.86 : 0.56),
          height: () => window.innerWidth * (phone() ? 0.9 : 0.32),
          borderRadius: 28,
        },
        {
          width: () => window.innerWidth,
          height: () => window.innerHeight,
          borderRadius: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=110%", scrub: 0.6, pin: true, invalidateOnRefresh: true },
        },
      );
      gsap.fromTo(
        ".reel__over",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, ease: "none", scrollTrigger: { trigger: root.current, start: "top -30%", end: "top -80%", scrub: true } },
      );
    },
    { scope: root, dependencies: [tier] },
  );

  return (
    <section ref={root} className="reel" aria-label="Showreel" data-beat="4">
      <div ref={win} className={`reel__win${live ? " is-live" : ""}`}>
        {(video || !live) && <Art slot="reel" />}
        <div className="reel__over">
          <p className="reel__line">Drop the needle.</p>
          <p className="reel__cap mono">{live ? "Live 3D · KMF-001" : video ? "Showreel" : "Placeholder reel"}</p>
        </div>
      </div>
    </section>
  );
}

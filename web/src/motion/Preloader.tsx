import { useEffect, useRef, useState } from "react";
import { gsap } from "./gsap";
import { prefersReducedMotion, setReady } from "./env";

const KEY = "kmf-preloaded";

function alreadySeen() {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

/** Once per session: a gold ring draws, the mark resolves, then the curtain lifts. No count-up. */
export function Preloader() {
  const [done, setDone] = useState(() => prefersReducedMotion() || alreadySeen());
  const root = useRef<HTMLDivElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const mark = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (done) {
      setReady();
      return;
    }
    const html = document.documentElement;
    html.style.overflow = "hidden";
    const len = 2 * Math.PI * 46;
    gsap.set(ring.current, { strokeDasharray: len, strokeDashoffset: len });
    gsap.set(mark.current, { autoAlpha: 0, y: 12 });

    const tl = gsap.timeline({
      onComplete: () => {
        html.style.overflow = "";
        try {
          sessionStorage.setItem(KEY, "1");
        } catch {
          /* ignore */
        }
        setReady();
        setDone(true);
      },
    });
    tl.to(ring.current, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" })
      .to(mark.current, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.45")
      .to({}, { duration: 0.35 })
      .to(root.current, { yPercent: -100, duration: 0.95, ease: "power3.inOut" });
    return () => {
      tl.kill();
      html.style.overflow = "";
    };
  }, [done]);

  if (done) return null;
  return (
    <div ref={root} className="preloader" role="status" aria-label="Loading KMF Media">
      <svg viewBox="0 0 100 100" className="preloader__ring" aria-hidden="true">
        <circle cx="50" cy="50" r="46" fill="none" stroke="var(--bronze)" strokeOpacity="0.4" strokeWidth="0.6" />
        <circle ref={ring} cx="50" cy="50" r="46" fill="none" stroke="var(--gold)" strokeWidth="0.8" strokeLinecap="round" transform="rotate(-90 50 50)" />
      </svg>
      <div ref={mark} className="preloader__mark">
        <span>KMF</span>
        <small>Media</small>
      </div>
    </div>
  );
}

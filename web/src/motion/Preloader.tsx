import { useEffect, useRef, useState } from "react";
import { gsap } from "./gsap";
import { prefersReducedMotion, setReady } from "./env";
import { useLoadProgress } from "./stage";

const KEY = "kmf-preloaded";
const LEN = 2 * Math.PI * 46;
/** If the 3D stage never reports (a stalled chunk), the curtain still lifts. Not a progress source. */
const SAFETY_MS = 7000;

function alreadySeen() {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}
/**
 * Once per session, under 4 seconds: black screen, a thin gold ring draws as the page really loads
 * (fonts, the 3D chunk, its first frame; see motion/stage.ts), then the curtain lifts onto the 3D
 * arrival (the stage's intro timeline starts the moment setReady fires). Skip button, Escape or a
 * click ends it at once.
 */
export function Preloader() {
  const [done, setDone] = useState(() => prefersReducedMotion() || alreadySeen());
  const progress = useLoadProgress();
  const root = useRef<HTMLDivElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const finishing = useRef(false);
  const finishRef = useRef<(fast?: boolean) => void>(() => {});

  useEffect(() => {
    if (done) {
      setReady();
      return;
    }
    const html = document.documentElement;
    html.style.overflow = "hidden";
    gsap.set(ring.current, { strokeDasharray: LEN, strokeDashoffset: LEN });
    gsap.set(mark.current, { autoAlpha: 0 });
    gsap.to(mark.current, { autoAlpha: 1, duration: 0.8, delay: 0.2, ease: "power2.out" });
    let tl: gsap.core.Timeline | null = null;

    const end = () => {
      html.style.overflow = "";
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* ignore */
      }
      setReady();
      setDone(true);
    };

    finishRef.current = (fast?: boolean) => {
      if (finishing.current) return;
      finishing.current = true;
      tl?.kill();
      gsap.killTweensOf([ring.current, mark.current]);
      tl = gsap.timeline({ onComplete: end });
      if (fast) {
        tl.call(() => setReady()).to(root.current, { autoAlpha: 0, duration: 0.35, ease: "power2.out" });
        return;
      }
      tl.to(ring.current, { strokeDashoffset: 0, duration: 0.4, ease: "power2.out" })
        .to(mark.current, { autoAlpha: 0, duration: 0.35, ease: "power2.in" }, "+=0.05")
        .to(ring.current, { scale: 1.6, autoAlpha: 0, transformOrigin: "50% 50%", duration: 0.6, ease: "power3.in" }, "<")
        /* The 3D arrival starts as the curtain begins to lift. */
        .call(() => setReady())
        .to(root.current, { yPercent: -100, duration: 0.85, ease: "power3.inOut" }, "<0.1");
    };
    const safety = window.setTimeout(() => finishRef.current(), SAFETY_MS);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finishRef.current(true);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(safety);
      window.removeEventListener("keydown", onKey);
      tl?.kill();
      html.style.overflow = "";
    };
  }, [done]);

  /* The ring follows real progress; at 1 the curtain lifts. */
  useEffect(() => {
    if (done || finishing.current) return;
    if (progress >= 1) {
      finishRef.current();
      return;
    }
    gsap.to(ring.current, { strokeDashoffset: LEN * (1 - progress), duration: 0.6, ease: "power2.out", overwrite: true });
  }, [progress, done]);

  if (done) return null;
  return (
    <div ref={root} className="preloader" role="status" aria-label="Loading KMF Media" onClick={() => finishRef.current(true)}>
      <svg viewBox="0 0 100 100" className="preloader__ring" aria-hidden="true">
        <circle cx="50" cy="50" r="46" fill="none" stroke="var(--gold)" strokeOpacity="0.14" strokeWidth="0.4" />
        <circle ref={ring} cx="50" cy="50" r="46" fill="none" stroke="var(--gold)" strokeWidth="0.5" strokeLinecap="round" transform="rotate(-90 50 50)" />
      </svg>
      <div ref={mark} className="preloader__mark">
        <span>KMF</span>
        <small>Media</small>
      </div>
      <button
        type="button"
        className="preloader__skip"
        onClick={(e) => {
          e.stopPropagation();
          finishRef.current(true);
        }}
      >
        Skip
      </button>
    </div>
  );
}

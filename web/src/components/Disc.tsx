import { useEffect, useRef, useState } from "react";
import { gsap } from "../motion/gsap";
import { hasFinePointer, prefersReducedMotion } from "../motion/env";
import { Tonearm } from "./Tonearm";

interface DiscProps {
  catalog?: string;
  /** Short text printed around the label. */
  caption?: string;
  className?: string;
}

/**
 * The signature object. It keeps turning, tilts toward the pointer, a sheen of light follows
 * the pointer across the grooves, and rings ripple out while it is hovered. Pointer effects
 * are off on touch and with reduced motion; the disc then simply turns (or holds still).
 */
export function Disc({ catalog = "KMF-001", caption = "SIDE A", className = "" }: DiscProps) {
  const root = useRef<HTMLDivElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const [hot, setHot] = useState(false);

  useEffect(() => {
    const host = root.current;
    const inner = tilt.current;
    if (!host || !inner || !hasFinePointer() || prefersReducedMotion()) return;
    const rx = gsap.quickTo(inner, "rotationX", { duration: 0.9, ease: "power3.out" });
    const ry = gsap.quickTo(inner, "rotationY", { duration: 0.9, ease: "power3.out" });
    const sheenX = gsap.quickSetter(host, "--mx", "%");
    const sheenY = gsap.quickSetter(host, "--my", "%");

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      const ny = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
      ry(Math.max(-1, Math.min(1, nx * 2)) * 10);
      rx(Math.max(-1, Math.min(1, ny * 2)) * -10);
      sheenX(50 + nx * 90);
      sheenY(50 + ny * 90);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div
      ref={root}
      className={`disc ${hot ? "is-hot" : ""} ${className}`}
      onPointerEnter={() => setHot(true)}
      onPointerLeave={() => setHot(false)}
      role="img"
      aria-label="KMF Media record turning on a turntable"
    >
      <span className="disc__ring disc__ring--1" />
      <span className="disc__ring disc__ring--2" />
      <span className="disc__ring disc__ring--3" />
      <div ref={tilt} className="disc__tilt">
        <div className="disc__scroll">
          <div className="disc__spin">
            <svg viewBox="0 0 600 600" className="disc__label" aria-hidden="true">
              <defs>
                <radialGradient id="label-metal" cx="35%" cy="30%" r="80%">
                  <stop offset="0%" stopColor="#f2dc9d" />
                  <stop offset="55%" stopColor="#c9a24b" />
                  <stop offset="100%" stopColor="#7c5c26" />
                </radialGradient>
                <path id="label-arc" d="M300 300 m-92 0 a92 92 0 1 1 184 0 a92 92 0 1 1 -184 0" />
              </defs>
              <circle cx="300" cy="300" r="118" fill="url(#label-metal)" />
              <circle cx="300" cy="300" r="108" fill="none" stroke="#070605" strokeOpacity=".28" />
              <circle cx="300" cy="300" r="60" fill="none" stroke="#070605" strokeOpacity=".22" />
              <text fill="#070605" fontSize="14" letterSpacing="3" fontFamily="Cormorant Garamond, serif" fontWeight="600">
                <textPath href="#label-arc">{`KMF MEDIA  ${caption}  ${catalog}  33 1/3 RPM  `}</textPath>
              </text>
              <text x="300" y="304" textAnchor="middle" fill="#070605" fontSize="40" fontWeight="600" fontFamily="Cormorant Garamond, serif">
                KMF
              </text>
              <circle cx="300" cy="300" r="6" fill="#070605" />
            </svg>
          </div>
        </div>
        <div className="disc__sheen" />
        <div className="disc__rim" />
      </div>
      <Tonearm />
    </div>
  );
}

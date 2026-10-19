import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "../../motion/gsap";
import { hasFinePointer, prefersReducedMotion } from "../../motion/env";
import { SplitLines } from "../../motion/SplitLines";
import { Cover } from "../../components/Cover";

const doors = [
  { name: "Growth", to: "/services", line: "Spotify and YouTube, on real listeners.", seed: 41 },
  { name: "Creators", to: "/marketplace", line: "Vetted reels, one invoice.", seed: 42 },
  { name: "Academy", to: "/academy", line: "Courses on releases and reels.", seed: 43 },
  { name: "Links", to: "/links", line: "One page per artist.", seed: 44 },
  { name: "Regional", to: "/regional", line: "Hindi, Punjabi, Haryanvi, Bhojpuri, devotional.", seed: 45 },
] as const;

/**
 * Scene 4. Five giant words. Hovering one dims the others, reveals a single line and brings
 * a piece of artwork that trails the pointer. Without a pointer the lines are always shown.
 */
export function Doors() {
  const [active, setActive] = useState<number | null>(null);
  const root = useRef<HTMLElement>(null);
  const peek = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = peek.current;
    const host = root.current;
    if (!el || !host || !hasFinePointer() || prefersReducedMotion()) return;
    gsap.set(el, { xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" });
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      xTo(e.clientX - r.left + 180);
      yTo(e.clientY - r.top);
    };
    host.addEventListener("pointermove", onMove);
    return () => host.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <section ref={root} className="doors" aria-label="What KMF does" onPointerLeave={() => setActive(null)}>
      <ul className={`doors__list${active !== null ? " has-active" : ""}`}>
        {doors.map((d, i) => (
          <li key={d.name} className={active === i ? "is-active" : ""}>
            <Link to={d.to} className="door" data-cursor="Open" onPointerEnter={() => setActive(i)} onFocus={() => setActive(i)} onBlur={() => setActive(null)}>
              <SplitLines text={d.name} delay={i * 0.08} className="door__name" />
              <span className="door__line">{d.line}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div ref={peek} className={`doors__peek${active !== null ? " is-on" : ""}`} aria-hidden="true">
        {active !== null && <Cover key={doors[active].name} className="cover--poster" seed={doors[active].seed} label="Placeholder" />}
      </div>
    </section>
  );
}

import { useRef } from "react";
import { Link } from "react-router-dom";
import { gsap, useGSAP } from "../../motion/gsap";
import { SplitLines } from "../../motion/SplitLines";
import { Cover } from "../../components/Cover";
import { releases } from "../../data/site";

/**
 * Scene 3. A horizontal gallery: on desktop the scene pins and vertical scroll slides the
 * posters sideways; on touch and with reduced motion it is a native swipeable strip.
 */
export function Releases() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference) and (hover: hover)", () => {
        const t = track.current;
        const p = pin.current;
        if (!t || !p) return;
        root.current?.classList.add("is-pinned");
        const distance = () => Math.max(0, t.scrollWidth - window.innerWidth);
        gsap.to(t, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: { trigger: p, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 0.9, invalidateOnRefresh: true },
        });
        return () => root.current?.classList.remove("is-pinned");
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="releases" aria-label="Releases">
      <div ref={pin} className="releases__pin">
        <div ref={track} className="releases__track">
          <div className="releases__intro">
            <SplitLines as="h2" text="Releases" />
            <p className="muted">Placeholder art until KMF approves real work.</p>
          </div>
          {releases.map((r) => (
            <Link key={r.ref} to="/work" className="poster" data-cursor="Open" aria-label={`${r.title}, ${r.ref}`}>
              <Cover className="cover--poster" seed={r.seed} label="Placeholder" />
              <span className="poster__meta">
                <span className="poster__ref">{r.ref}</span>
                <span className="poster__title">{r.title}</span>
              </span>
            </Link>
          ))}
          <Link to="/work" className="releases__end" data-cursor="Open">
            See the work
          </Link>
        </div>
      </div>
    </section>
  );
}

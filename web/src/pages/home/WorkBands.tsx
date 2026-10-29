import { useRef } from "react";
import { gsap, useGSAP } from "../../motion/gsap";
import { prefersReducedMotion } from "../../motion/env";
import { Art } from "../../components/Art";
import { Button } from "../../components/Button";
import { releases } from "../../data/site";

/** Four full-bleed bands. Title in a black label box with a gold bar; the image drifts slowly; each band opens with a clip reveal. */
export function WorkBands() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>(".band").forEach((band) => {
        gsap.fromTo(
          band,
          { clipPath: "inset(14% 5% 14% 5% round 28px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: band, start: "top 92%", end: "top 35%", scrub: 0.5 } },
        );
        gsap.fromTo(
          band.querySelector(".band__img"),
          { yPercent: -9 },
          { yPercent: 9, ease: "none", scrollTrigger: { trigger: band, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="work" aria-labelledby="work-title">
      <div className="work__head">
        <p className="eyebrow">Selected releases</p>
        <h2 id="work-title" className="label-box">
          Our work
        </h2>
      </div>
      {releases.slice(0, 4).map((r, i) => (
        <article key={r.ref} className="band" aria-label={r.title}>
          <div className="band__img">
            <Art slot={`work-${i + 1}`} />
          </div>
          <div className="band__shade" aria-hidden="true" />
          <div className="band__body">
            <span className="mono band__ref">
              {r.ref} · {r.language}
            </span>
            <h3 className="label-box">{r.title}</h3>
            <p className="band__goal">{r.goal}</p>
            <Button to="/work" variant="secondary" cursor="Open" iconAfter="arrow">
              Open case
            </Button>
          </div>
        </article>
      ))}
    </section>
  );
}

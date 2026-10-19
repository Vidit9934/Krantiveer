import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../../motion/gsap";
import { prefersReducedMotion } from "../../motion/env";
import { SplitLines } from "../../motion/SplitLines";
import { useJoin } from "../../context/JoinContext";
import { Button } from "../../components/Button";

const steps = [
  { title: "Tell us your song", line: "Share a link and what you want from the release." },
  { title: "We plan the release", line: "A manager maps the platforms, languages and dates." },
  { title: "Real creators move it", line: "Approved creators make reels. Every price is logged." },
  { title: "You watch it grow", line: "A clear report shows where the song travelled." },
];

/** Four steps are a true sequence, so numbers are honest here. Each lights up as it passes the middle. */
export function Path() {
  const root = useRef<HTMLElement>(null);
  const { openJoin } = useJoin();

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-step]", root.current);
      if (prefersReducedMotion()) {
        items.forEach((el) => el.classList.add("is-on", "is-now"));
        return;
      }
      /* A step stays lit once reached; the one nearest the middle of the screen glows brightest. */
      items.forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 70%",
          onEnter: () => el.classList.add("is-on"),
          onLeaveBack: () => el.classList.remove("is-on"),
        });
        ScrollTrigger.create({
          trigger: el,
          start: "top 62%",
          end: "bottom 42%",
          toggleClass: { targets: el, className: "is-now" },
        });
      });
      gsap.fromTo(
        "[data-path-line]",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: "[data-path-list]", start: "top 60%", end: "bottom 50%", scrub: 0.5 } },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="path" aria-labelledby="path-title">
      <div className="path__head">
        <SplitLines as="h2" text="Four steps from your song to your audience." className="path__title" id="path-title" />
        <Button onClick={() => openJoin()} magnetic cursor="Join" iconAfter="arrow">
          Join KMF
        </Button>
      </div>
      <ol className="path__list" data-path-list>
        <span className="path__rail" aria-hidden="true">
          <span className="path__line" data-path-line />
        </span>
        {steps.map((s, i) => (
          <li key={s.title} className="path__step" data-step>
            <span className="path__n">{i + 1}</span>
            <div>
              <h3>{s.title}</h3>
              <p>{s.line}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

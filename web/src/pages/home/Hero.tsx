/* avoid-ai-design-ignore-file: SD5, C6, L4
   SD5/C6: the gold gradient on the middle headline line is the user's mockup ("Amplify"). Brief wins.
   L4: the "2,000+" artist figure comes from the mockup and is labelled until KMF confirms it. */
import { useRef } from "react";
import { gsap, useGSAP } from "../../motion/gsap";
import { prefersReducedMotion, useReady } from "../../motion/env";
import { SplitLines } from "../../motion/SplitLines";
import { useSide } from "../../context/SideContext";
import { Button } from "../../components/Button";
import { SideToggle } from "../../components/SideToggle";
import { useJoin } from "../../context/JoinContext";
import { Disc } from "../../components/Disc";
import { site } from "../../data/site";

const copy = {
  a: {
    lines: ["Ready to", "amplify", "your music career?"],
    sub: "Real listeners on Spotify and YouTube, built for Indian artists.",
    caption: "SIDE A",
  },
  b: {
    lines: ["Hire creators", "you can verify.", "Pay once."],
    sub: "Approved creators, logged prices, payouts held until the work is proven.",
    caption: "SIDE B",
  },
} as const;

/**
 * Scene 1. Headline lines rise out of masks, the record fades up in its cone of light, then the
 * scene pins and, as you scroll, the record swells, the tonearm sweeps and the headline dissolves.
 */
export function Hero() {
  const { side } = useSide();
  const ready = useReady();
  const root = useRef<HTMLElement>(null);
  const c = copy[side];
  const { openJoin } = useJoin();

  /* The pin is created once on mount, never gated on the preloader, so every scene below it
     measures its position after the hero's pin spacing exists. */
  useGSAP(
    () => {
      const arm = root.current?.querySelector("[data-arm]");
      if (arm) gsap.set(arm, { rotation: 4, svgOrigin: "190 40" });
      if (prefersReducedMotion()) return;

      const mm = gsap.matchMedia();
      /* Phones have no pin, but the record still turns with the scroll and the arm sweeps. */
      mm.add("(max-width: 899px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 },
        });
        tl.to(".disc__scroll", { rotation: 300, ease: "none" }, 0).to("[data-arm]", { rotation: 14, svgOrigin: "190 40", ease: "none" }, 0);
      });
      mm.add("(min-width: 900px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=115%", pin: true, scrub: 0.8, anticipatePin: 1 },
        });
        tl.to("[data-hero-title]", { yPercent: -28, autoAlpha: 0, ease: "none" }, 0)
          .to("[data-hero-disc]", { scale: 1.32, xPercent: -14, ease: "none" }, 0)
          .to(".disc__scroll", { rotation: 210, ease: "none" }, 0)
          .to("[data-arm]", { rotation: 15, svgOrigin: "190 40", ease: "none" }, 0)
          .to("[data-hero-foot-inner]", { autoAlpha: 0, y: 40, ease: "none" }, 0);
      });
    },
    { scope: root },
  );

  /* The entrance waits for the preloader. It animates inner wrappers so it never fights the scroll timeline. */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const enters = gsap.utils.toArray<HTMLElement>("[data-enter]", root.current);
      if (!ready) {
        gsap.set(enters, { autoAlpha: 0 });
        return;
      }
      gsap.fromTo("[data-hero-spin]", { autoAlpha: 0, scale: 0.88 }, { autoAlpha: 1, scale: 1, duration: 1.8, ease: "expo.out", delay: 0.15 });
      gsap.fromTo("[data-hero-foot]", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1.1, ease: "power3.out", delay: 0.7 });
    },
    { scope: root, dependencies: [ready], revertOnUpdate: true },
  );

  return (
    <section ref={root} className="hero" aria-labelledby="hero-title">
      <div className="hero__stage">
        <div className="hero__copy" data-hero-title>
          <SideToggle />
          <h1 id="hero-title" className="hero__title" aria-label={c.lines.join(" ")}>
            {c.lines.map((line, i) => (
              <SplitLines key={`${side}-${i}`} text={line} mode="load" delay={i * 0.14} className={`hero__line${i === 1 ? " is-gold" : ""}`} />
            ))}
          </h1>
          <p className="hero__sub">{c.sub}</p>
          <div className="hero__ctas">
            {side === "a" ? (
              <Button onClick={() => openJoin()} magnetic cursor="Join">
                Join KMF
              </Button>
            ) : (
              <Button to="/marketplace/campaigns/new" magnetic cursor="Go" icon="wave">
                Post a campaign
              </Button>
            )}
            <Button to="/contact" variant="secondary" magnetic>
              Talk to us
            </Button>
          </div>
        </div>

        <div className="hero__disc" data-hero-disc>
          <div className="hero__cone" />
          <div className="hero__spin" data-hero-spin data-enter>
            <Disc caption={c.caption} />
          </div>
        </div>

        <div className="hero__foot" data-hero-foot data-enter>
          <div className="hero__foot-inner" data-hero-foot-inner>
          <p className="hero__stat">
            {site.artistCount} artists {!site.artistCountConfirmed && <span className="ph">placeholder</span>}
          </p>
          </div>
        </div>
        <span className="hero__scroll" aria-hidden="true">
          Scroll
        </span>
      </div>
    </section>
  );
}

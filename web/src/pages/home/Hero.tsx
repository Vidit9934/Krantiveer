/* avoid-ai-design-ignore-file: SD5, C6, L4
   SD5/C6: the gold gradient on the middle headline line is the user's mockup ("Amplify"). Brief wins.
   L4: the "2,000+" artist figure comes from the mockup and is labelled until KMF confirms it. */
import { useRef } from "react";
import { gsap, useGSAP } from "../../motion/gsap";
import { rig, invalidate } from "../../three/rig";
import { HeroFan, placeFan } from "./HeroFan";
import { stats } from "../../data/proof";
import { prefersReducedMotion, useReady } from "../../motion/env";
import { useStageTier } from "../../motion/stage";
import { SplitLines } from "../../motion/SplitLines";
import { ReactiveType } from "../../motion/ReactiveType";
import { useSide } from "../../context/SideContext";
import { Button } from "../../components/Button";
import { SideToggle } from "../../components/SideToggle";
import { useJoin } from "../../context/JoinContext";
import { HeroObject, MotionToggle } from "../../components/Scene3D";
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
 * Scene 1. Headline lines rise out of masks. On home the record is the 3D turntable on the
 * fixed stage behind this scene (components/Scene3D.tsx); the hero keeps its place in the layout
 * and shows the CSS record poster as the loading state and the static tier. No pin and no
 * scroll scrub here any more: the stage's master timeline owns the scroll.
 */
export function Hero() {
  const { side } = useSide();
  const ready = useReady();
  const root = useRef<HTMLElement>(null);
  const c = copy[side];
  const { openJoin } = useJoin();
  const tier = useStageTier();

  /* The poster's tonearm rests just off the record. */
  useGSAP(
    () => {
      const arm = root.current?.querySelector("[data-arm]");
      if (arm) gsap.set(arm, { rotation: 4, svgOrigin: "190 40" });
    },
    { scope: root, dependencies: [tier] },
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
      const spin = root.current?.querySelector("[data-hero-spin]");
      if (spin) gsap.fromTo(spin, { autoAlpha: 0, scale: 0.88 }, { autoAlpha: 1, scale: 1, duration: 1.8, ease: "expo.out", delay: 0.9 });
      gsap.fromTo("[data-hero-foot]", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1.1, ease: "power3.out", delay: 1.6 });
    },
    { scope: root, dependencies: [ready], revertOnUpdate: true },
  );


  /* The scroll moment. Desktop: one pinned, scrubbed timeline (headline blurs and drifts away, the
     turntable recedes through rig.recede, seven cards rise onto an arc, a gold line scrubs along the top,
     the scene ends on one line, three chips and the CTA). Phones and reduced motion: a static arc. */
  useGSAP(
    () => {
      const q = (sel: string) => gsap.utils.toArray<HTMLElement>(sel, root.current);
      const cards = q("[data-hf-card]");
      const arc = root.current?.querySelector<HTMLElement>(".hf__arc");
      if (!arc || !cards.length) return;
      const mm = gsap.matchMedia();

      const place = (visible: HTMLElement[], step: number, rise: boolean) => {
        const R = () => Math.max(560, arc.clientWidth * (rise ? 0.9 : 1.1));
        const pos = () => placeFan(visible, R(), step);
        const vh = () => window.innerHeight;
        gsap.set(cards, { xPercent: -50, transformOrigin: "50% 100%" });
        return { pos, vh };
      };

      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const { pos, vh } = place(cards, 8.5, true);
        const lines = q(".hero__line");
        const fade = q("[data-hero-sub], [data-hero-ctas], [data-hero-toggle], .hero__stat, .hero__scroll");
        const end = q("[data-hero-end]");
        const chips = q(".hero__chip");
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=260%", pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true },
        });
        tl.fromTo(q(".hero__progress"), { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)
          .to(lines, { filter: "blur(16px)", autoAlpha: 0, y: -50, x: (i) => [-90, 70, -40][i] ?? 0, stagger: 0.04, duration: 0.3, ease: "power2.in" }, 0.02)
          .to(fade, { autoAlpha: 0, y: -24, filter: "blur(8px)", duration: 0.22, ease: "power2.in" }, 0)
          .to(rig, { recede: 1, duration: 0.45, ease: "power2.inOut", onUpdate: () => invalidate() }, 0.05)
          .fromTo(
            cards,
            { autoAlpha: 0, y: () => vh() * 1.1, x: (i) => pos()[i].x * 1.3, rotation: (i) => pos()[i].rotation * 1.8, rotationY: 0 },
            {
              autoAlpha: 1,
              y: (i) => pos()[i].y,
              x: (i) => pos()[i].x,
              rotation: (i) => pos()[i].rotation,
              rotationY: (i) => pos()[i].rotationY,
              stagger: { each: 0.035, from: "center" },
              duration: 0.5,
              ease: "power3.out",
            },
            0.2,
          )
          .fromTo(end, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.18, ease: "power2.out" }, 0.7)
          .fromTo(chips, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, stagger: 0.04, duration: 0.1, ease: "power2.out" }, 0.76)
          .to({}, { duration: 0.02 }, 0.98);
        return () => {
          rig.recede = 0;
          invalidate();
        };
      });

      /* Phones and reduced motion: five cards (or seven) on a static arc, a gentle scrubbed tilt on phones. */
      mm.add("(max-width: 899.98px), (prefers-reduced-motion: reduce)", () => {
        const phone = window.matchMedia("(max-width: 899.98px)").matches;
        const vis = phone ? cards.slice(1, 6) : cards;
        if (phone) {
          gsap.set(cards[0], { display: "none" });
          gsap.set(cards[6], { display: "none" });
        }
        const { pos } = place(vis, phone ? 8 : 10, false);
        const p = pos();
        vis.forEach((c, i) => gsap.set(c, { x: p[i].x, y: p[i].y, rotation: p[i].rotation, rotationY: p[i].rotationY }));
        if (phone && !prefersReducedMotion()) {
          gsap.fromTo(vis, { rotationY: (i) => p[i].rotationY - 18 }, { rotationY: (i) => p[i].rotationY + 18, ease: "none", scrollTrigger: { trigger: arc, start: "top bottom", end: "bottom top", scrub: 0.8 } });
        }
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="hero" aria-labelledby="hero-title" data-beat="1">
      <div className="hero__stage">
        <div className="hero__progress" aria-hidden="true" />
        <div className="hero__copy" data-hero-title>
          <div data-hero-toggle>
            <SideToggle />
          </div>
          <h1 id="hero-title" className="hero__title" aria-label={c.lines.join(" ")}>
            {c.lines.map((line, i) =>
              i === 1 ? (
                /* The one reactive moment of the hero: the gold line swells toward the pointer. */
                <ReactiveType key={`${side}-${i}`} text={line} reveal="load" delay={0.9 + i * 0.14} className="hero__line hero__line--gold" />
              ) : (
                <SplitLines key={`${side}-${i}`} text={line} mode="load" delay={0.9 + i * 0.14} className="hero__line" />
              ),
            )}
          </h1>
          <p className="hero__sub" data-hero-sub>{c.sub}</p>
          <div className="hero__ctas" data-hero-ctas>
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
          <HeroObject caption={c.caption} />
        </div>

        <HeroFan />

        <div className="hero__end" data-hero-end>
          <p className="hero__promise">Real listeners only. No bots. No fake streams.</p>
          <ul className="hero__chips">
            <li className="hero__chip">
              <b>{site.artistCount}</b> artists {!site.artistCountConfirmed && <span className="ph">placeholder</span>}
            </li>
            <li className="hero__chip">
              <b>{stats[0].value}</b> streams {!stats[0].confirmed && <span className="ph">placeholder</span>}
            </li>
            <li className="hero__chip">
              <b>{stats[2].value}</b> to go live {!stats[2].confirmed && <span className="ph">placeholder</span>}
            </li>
          </ul>
          <div className="hero__end-cta">
            {side === "a" ? (
              <Button onClick={() => openJoin()} magnetic cursor="Join">
                Join KMF
              </Button>
            ) : (
              <Button to="/marketplace/campaigns/new" magnetic cursor="Go" icon="wave">
                Post a campaign
              </Button>
            )}
          </div>
        </div>

        <div className="hero__foot" data-hero-foot data-enter>
          <div className="hero__foot-inner" data-hero-foot-inner>
          <p className="hero__stat">
            {site.artistCount} artists {!site.artistCountConfirmed && <span className="ph">placeholder</span>}
          </p>
          <MotionToggle />
          </div>
        </div>
        <span className="hero__scroll" aria-hidden="true">
          Scroll
        </span>
      </div>
    </section>
  );
}

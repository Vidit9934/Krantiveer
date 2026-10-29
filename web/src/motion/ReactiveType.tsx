import { Fragment, useRef, useState } from "react";
import type { ElementType } from "react";
import { gsap, ScrollTrigger, useGSAP } from "./gsap";
import { hasFinePointer, prefersReducedMotion, useReady } from "./env";

interface Axes {
  wght: number;
  wdth: number;
}

interface ReactiveTypeProps {
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
  /** Resting axes of every letter. */
  base?: Axes;
  /** Axes of the letter right under the pointer; neighbours fall off smoothly. */
  peak?: Axes;
  /** Pointer influence radius, in em of the element's font size. */
  radius?: number;
  /** "load" rises after the preloader, "view" on viewport entry, false shows at once. */
  reveal?: "load" | "view" | false;
  delay?: number;
}

/**
 * Letters that swell toward the pointer: each letter's weight and width ease toward `peak`
 * by its distance from the pointer (Bricolage's variable axes). On touch, a slow wave runs
 * through the word as it scrolls by. Static under reduced motion. One per scene at most.
 */
export function ReactiveType({
  text,
  as: Tag = "span",
  className = "",
  id,
  base = { wght: 640, wdth: 94 },
  peak = { wght: 800, wdth: 78 },
  radius = 2.2,
  reveal = "view",
  delay = 0,
}: ReactiveTypeProps) {
  const ref = useRef<HTMLElement>(null);
  const ready = useReady();
  const [armed] = useState(() => !prefersReducedMotion());

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !armed) return;
      const chars = [...el.querySelectorAll<HTMLElement>("[data-ch]")];
      const state = chars.map(() => ({ t: 0 }));
      const paint = (i: number) => {
        const t = state[i].t;
        chars[i].style.fontVariationSettings = `"wght" ${base.wght + (peak.wght - base.wght) * t}, "wdth" ${base.wdth + (peak.wdth - base.wdth) * t}`;
      };
      const to = chars.map((_, i) => gsap.quickTo(state[i], "t", { duration: 0.7, ease: "power3.out", onUpdate: () => paint(i) }));
      chars.forEach((_, i) => paint(i));

      if (reveal && !(reveal === "load" && !ready)) {
        gsap.from(chars, {
          yPercent: 105,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.035,
          delay,
          scrollTrigger: reveal === "view" ? { trigger: el, start: "top 90%", once: true } : undefined,
        });
      }

      if (hasFinePointer()) {
        /* Letter centres, cached relative to the element; re-read when the pointer enters. */
        let centres: { x: number; y: number }[] = [];
        const measure = () => {
          const box = el.getBoundingClientRect();
          centres = chars.map((c) => {
            const r = c.getBoundingClientRect();
            return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
          });
        };
        const onMove = (e: PointerEvent) => {
          const box = el.getBoundingClientRect();
          const px = e.clientX - box.left;
          const py = e.clientY - box.top;
          const reach = parseFloat(getComputedStyle(el).fontSize) * radius;
          if (!centres.length) measure();
          for (let i = 0; i < chars.length; i++) {
            const d = Math.hypot(px - centres[i].x, py - centres[i].y);
            const t = Math.max(0, 1 - d / reach);
            to[i](t * t * (3 - 2 * t));
          }
        };
        const onLeave = () => to.forEach((q) => q(0));
        const host = el.parentElement ?? el;
        host.addEventListener("pointerenter", measure);
        host.addEventListener("pointermove", onMove);
        host.addEventListener("pointerleave", onLeave);
        window.addEventListener("resize", measure);
        return () => {
          host.removeEventListener("pointerenter", measure);
          host.removeEventListener("pointermove", onMove);
          host.removeEventListener("pointerleave", onLeave);
          window.removeEventListener("resize", measure);
        };
      }

      /* Touch: a wave travels through the letters while the word crosses the screen. */
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const p = self.progress * Math.PI * 2;
          for (let i = 0; i < chars.length; i++) to[i](Math.max(0, Math.sin(p * 1.5 - i * 0.45)) * 0.8);
        },
      });
      return () => st.kill();
    },
    { scope: ref, dependencies: [text, ready, armed], revertOnUpdate: true },
  );

  const words = text.split(" ");
  return (
    <Tag ref={ref} id={id} className={`rtype ${className}`} aria-label={text}>
      {words.map((w, wi) => (
        /* The space sits outside the inline-block word, where it can still collapse and wrap. */
        <Fragment key={wi}>
          <span className="rtype__word" aria-hidden="true">
            {[...w].map((ch, ci) => (
              <span key={ci} className="rtype__mask">
                <span data-ch className="rtype__ch">
                  {ch}
                </span>
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

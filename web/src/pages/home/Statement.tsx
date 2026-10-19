import { useRef } from "react";
import type { ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "../../motion/gsap";
import { prefersReducedMotion } from "../../motion/env";
import { useSide } from "../../context/SideContext";

interface StatementProps {
  text: { a: string; b: string };
  label: string;
  children?: ReactNode;
}

/** One sentence; each word lights up as you scroll through it. Used for the dream and the promise. */
export function Statement({ text, label, children }: StatementProps) {
  const { side } = useSide();
  const root = useRef<HTMLElement>(null);
  const line = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = line.current;
      if (!el || prefersReducedMotion()) return;
      const split = SplitText.create(el, { type: "words", wordsClass: "statement__word" });
      gsap.fromTo(
        split.words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 42%", scrub: 0.6 },
        },
      );
    },
    { scope: root, dependencies: [side], revertOnUpdate: true },
  );

  return (
    <section ref={root} className="statement" aria-label={label}>
      <div className="statement__inner">
        <p ref={line} className="statement__text">
          {text[side]}
        </p>
        {children}
      </div>
    </section>
  );
}

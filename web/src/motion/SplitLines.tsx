import { useRef, useState } from "react";
import type { ElementType } from "react";
import { gsap, SplitText, useGSAP } from "./gsap";
import { prefersReducedMotion, useReady } from "./env";

interface SplitLinesProps {
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
  /** Seconds before the reveal starts. Use it to stagger separate lines. */
  delay?: number;
  /** "load" waits for the preloader; "view" starts when the text enters the viewport. */
  mode?: "load" | "view";
}

/**
 * Line-mask reveal: each line rises out of a mask. Replaces the uniform fade-up.
 * The text is hidden only when motion is on, so it is always readable without JS or with reduced motion.
 */
export function SplitLines({ text, as: Tag = "span", className = "", id, delay = 0, mode = "view" }: SplitLinesProps) {
  const ref = useRef<HTMLElement>(null);
  const ready = useReady();
  const [armed] = useState(() => !prefersReducedMotion());

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !armed) return;
      if (mode === "load" && !ready) return;
      el.style.visibility = "visible";
      SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 112,
            duration: 1.15,
            ease: "power3.out",
            stagger: 0.1,
            delay,
            scrollTrigger: mode === "view" ? { trigger: el, start: "top 90%", once: true } : undefined,
          });
        },
      });
    },
    { scope: ref, dependencies: [ready, text, mode, delay, armed], revertOnUpdate: true },
  );

  return (
    <Tag ref={ref} id={id} className={`split ${className}`} style={armed ? { visibility: "hidden" } : undefined}>
      {text}
    </Tag>
  );
}

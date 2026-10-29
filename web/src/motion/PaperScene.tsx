import { useRef } from "react";
import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { gsap, useGSAP } from "./gsap";
import { prefersReducedMotion } from "./env";

type PaperSceneProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: ElementType;
  /** data-* attributes (data-beat, data-veil) pass through. */
  [data: `data-${string}`]: string | undefined;
};

/**
 * An opaque warm-white scene between the dark ones. It covers the 3D stage completely, and
 * opens as it scrolls in: a rounded inset card that widens to full bleed. Reduced motion: it
 * is simply there.
 */
export function PaperScene({ children, as: Tag = "section", className = "", ...rest }: PaperSceneProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      gsap.fromTo(
        el,
        /* Fixed pixel insets: a percentage of a tall section would clip its first heading. */
        { clipPath: "inset(40px 3.5% 0px 3.5% round 36px)" },
        {
          clipPath: "inset(0px 0% 0px 0% round 0px)",
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "top 30%", scrub: 0.6 },
        },
      );
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={`paper ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

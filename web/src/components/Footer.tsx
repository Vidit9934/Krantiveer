import { useRef } from "react";
import { Link } from "react-router-dom";
import { gsap, useGSAP } from "../motion/gsap";
import { prefersReducedMotion } from "../motion/env";
import { allNav } from "../data/nav";

const links = allNav;

/** A giant wordmark that rises into place, with the real routes beneath it. */
export function Footer() {
  const root = useRef<HTMLElement>(null);
  const mark = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!mark.current || prefersReducedMotion()) return;
      gsap.from(mark.current, {
        yPercent: 45,
        opacity: 0,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 85%", end: "bottom bottom", scrub: 0.8 },
      });
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="footer">
      <nav className="footer__links" aria-label="Footer">
        {links.map((l) => (
          <Link key={l.to} to={l.to} data-cursor="Open">
            {l.label}
          </Link>
        ))}
      </nav>
      <div ref={mark} className="footer__mark" aria-hidden="true">
        KMF Media
      </div>
      <p className="footer__legal">© 2026 KMF Media Pvt. Ltd.</p>
    </footer>
  );
}

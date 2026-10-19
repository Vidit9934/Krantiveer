import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap, useGSAP } from "../motion/gsap";
import { prefersReducedMotion } from "../motion/env";
import { scrollControl } from "../motion/Smooth";
import { useJoin } from "../context/JoinContext";
import { allNav } from "../data/nav";
import { site } from "../data/site";

interface MenuProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Narrow screens: an opaque sheet under the bar. It unrolls downward from the bar, the page links
 * rise out of masks one after another, then Log in and WhatsApp fade in. Closing rolls it back up.
 */
export function Menu({ open, onClose }: MenuProps) {
  const root = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const { openLogin } = useJoin();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    scrollControl.stop();
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      scrollControl.start();
      document.documentElement.style.overflow = "";
    };
  }, [open, onClose]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const links = el.querySelectorAll("[data-sheet-link]");
      const foot = el.querySelectorAll("[data-sheet-foot]");
      if (first.current) {
        first.current = false;
        gsap.set(el, { autoAlpha: 0 });
        return;
      }
      if (prefersReducedMotion()) {
        gsap.set(el, { autoAlpha: open ? 1 : 0, clipPath: "none" });
        gsap.set([links, foot], { clearProps: "all" });
        return;
      }
      if (open) {
        gsap.set(el, { autoAlpha: 1 });
        gsap
          .timeline()
          .fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power3.inOut" })
          .fromTo(links, { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: "power3.out", stagger: 0.045 }, 0.25)
          .fromTo(foot, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.1 }, 0.7);
      } else {
        gsap.timeline().to(el, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.55,
          ease: "power3.inOut",
          onComplete: () => {
            gsap.set(el, { autoAlpha: 0 });
          },
        });
      }
    },
    { scope: root, dependencies: [open] },
  );

  return (
    <div ref={root} id="nav-sheet" className="sheet" aria-hidden={!open} inert={!open}>
      <nav className="sheet__links" aria-label="All pages">
        {allNav.map((l) => (
          <span key={l.to} className="sheet__mask">
            <Link to={l.to} onClick={onClose} data-sheet-link>
              {l.label}
            </Link>
          </span>
        ))}
      </nav>
      <div className="sheet__foot">
        <button
          type="button"
          data-sheet-foot
          onClick={() => {
            onClose();
            openLogin();
          }}
        >
          Log in
        </button>
        <a href={site.whatsappLink} target="_blank" rel="noreferrer" data-sheet-foot>
          WhatsApp {site.whatsappDisplay}
        </a>
      </div>
    </div>
  );
}

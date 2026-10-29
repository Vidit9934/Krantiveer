import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap, useGSAP } from "../motion/gsap";
import { prefersReducedMotion } from "../motion/env";
import { scrollControl } from "../motion/Smooth";
import { useJoin } from "../context/JoinContext";
import { navGroups } from "../data/nav";
import type { NavItem } from "../data/nav";
import { services } from "../data/services";
import { regions } from "../data/site";
import { Icon } from "./Icon";
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
  const [exp, setExp] = useState<string | null>(null);

  const itemsFor = (id: string): NavItem[] => {
    if (id === "services") return [{ to: "/services", label: "All services" }, ...services.map((s) => ({ to: "/services", label: s.name, note: s.line }))];
    if (id === "regional") return [{ to: "/regional", label: "All regions" }, ...regions.map((r) => ({ to: `/regional/${r.slug}`, label: `${r.name}  ${r.native}`, note: r.note }))];
    if (id === "work") return [{ to: "/work", label: "All work" }];
    return navGroups.find((g) => g.id === id)?.items ?? [];
  };

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
        {navGroups.map((g) => (
          <div key={g.id} className="sheet__group sheet__mask">
            <div data-sheet-link>
              {g.kind === "link" ? (
                <Link to={g.to!} onClick={onClose} className="sheet__head">
                  {g.label}
                </Link>
              ) : (
                <>
                  <button
                    type="button"
                    className="sheet__head"
                    aria-expanded={exp === g.id}
                    aria-controls={`sheet-${g.id}`}
                    onClick={() => setExp((v) => (v === g.id ? null : g.id))}
                  >
                    {g.label} <Icon name="down" size={18} aria-hidden="true" />
                  </button>
                  <div className="sheet__sub" id={`sheet-${g.id}`} hidden={exp !== g.id}>
                    {itemsFor(g.id).map((l) => (
                      <Link key={l.label} to={l.to} onClick={onClose}>
                        {l.label}
                        {l.note && <span>{l.note}</span>}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
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

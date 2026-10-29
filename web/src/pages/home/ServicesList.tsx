/* avoid-ai-design-ignore-file: SD5 (the highlighter chip on one headline word is the client's reference, AJ Marketing; DESIGN.md v3) */
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap, useGSAP } from "../../motion/gsap";
import { hasFinePointer, prefersReducedMotion } from "../../motion/env";
import { Art } from "../../components/Art";
import { Icon } from "../../components/Icon";
import { services } from "../../data/services";
import { releases } from "../../data/site";

/**
 * Services as numbered rows. With a pointer: the hovered row turns gold and a tilted preview card
 * follows the cursor (smoothed, leaning with pointer speed). Without one: tap opens the row inline.
 */
export function ServicesList() {
  const [active, setActive] = useState<number | null>(null);
  const [fine] = useState(() => hasFinePointer());
  const root = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = card.current;
      const host = root.current;
      if (!el || !host || !fine) return;
      const still = prefersReducedMotion();
      gsap.set(el, { xPercent: -50, yPercent: -50 });
      const xTo = gsap.quickTo(el, "x", { duration: still ? 0.01 : 0.55, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: still ? 0.01 : 0.55, ease: "power3.out" });
      const rTo = gsap.quickTo(el, "rotation", { duration: 0.6, ease: "power3.out" });
      let last = 0;
      let calm: number | undefined;
      const move = (e: PointerEvent) => {
        xTo(e.clientX + 200);
        yTo(e.clientY);
        if (still) return;
        const dx = e.clientX - last;
        last = e.clientX;
        rTo(gsap.utils.clamp(-12, 12, dx * 0.7 - 4));
        window.clearTimeout(calm);
        calm = window.setTimeout(() => rTo(-4), 120);
      };
      host.addEventListener("pointermove", move);
      return () => host.removeEventListener("pointermove", move);
    },
    { scope: root },
  );

  return (
    <section ref={root} className="svc" aria-labelledby="svc-title" data-beat="3" onPointerLeave={() => fine && setActive(null)}>
      <div className="svc__head">
        <p className="eyebrow">Services</p>
        <h2 id="svc-title">
          Six ways to <span className="hl hl--gold">grow</span> a release.
        </h2>
      </div>
      <ul className="svc__list">
        {services.map((s, i) => {
          const open = active === i;
          const ref = releases[i % releases.length].ref;
          const body = (
            <>
              <span className="svc__n mono">{String(i + 1).padStart(2, "0")}</span>
              <span className="svc__name">{s.name}</span>
              <span className="svc__line">{s.line}</span>
              <span className="svc__tag mono">{ref}</span>
              <span className="svc__go" aria-hidden="true">
                <Icon name="arrow" size={18} />
              </span>
            </>
          );
          return (
            <li key={s.slot} className={`svc__row${open ? " is-active" : ""}`}>
              {fine ? (
                <Link
                  to="/services"
                  className="svc__link"
                  data-cursor="Open"
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                >
                  {body}
                </Link>
              ) : (
                <>
                  <button type="button" className="svc__link" aria-expanded={open} onClick={() => setActive(open ? null : i)}>
                    {body}
                  </button>
                  {open && (
                    <div className="svc__panel">
                      <div className="svc__thumb">
                        <Art slot={s.slot} />
                      </div>
                      <p>{s.gets}</p>
                      <Link to="/services" className="svc__more">
                        See services
                      </Link>
                    </div>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ul>
      {fine && (
        <div ref={card} className={`svc__card${active !== null ? " is-on" : ""}`} aria-hidden="true">
          {services.map((s, i) => (
            <div key={s.slot} className={`svc__img${active === i ? " is-on" : ""}`}>
              <Art slot={s.slot} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

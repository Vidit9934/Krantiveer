import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useJoin } from "../context/JoinContext";
import { mainNav, moreNav } from "../data/nav";
import { Icon } from "./Icon";
import { Menu } from "./Menu";

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="KMF Media home" data-cursor="Home">
      <span className="logo__mark">KMF</span>
      <span className="logo__sub">Media</span>
    </Link>
  );
}

/** Opaque, always-visible bar. Every destination is in it; Log in and Sign up sit on the right. */
export function Nav() {
  const [sheet, setSheet] = useState(false);
  const [more, setMore] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const { openJoin, openLogin } = useJoin();
  const { pathname } = useLocation();
  const closeSheet = useCallback(() => setSheet(false), []);

  useEffect(() => {
    setMore(false);
    setSheet(false);
  }, [pathname]);

  useEffect(() => {
    if (!more) return;
    const onDown = (e: PointerEvent) => !moreRef.current?.contains(e.target as Node) && setMore(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMore(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [more]);

  return (
    <>
      <header className="nav">
        <Logo />
        <nav className="nav__links" aria-label="Main">
          {mainNav.map((l) => (
            <NavLink key={l.to} to={l.to} className="nav__link" data-cursor="Open">
              {l.label}
            </NavLink>
          ))}
          <div
            ref={moreRef}
            className="nav__more"
            onMouseEnter={() => matchMedia("(hover: hover)").matches && setMore(true)}
            onMouseLeave={() => matchMedia("(hover: hover)").matches && setMore(false)}
          >
            <button type="button" className="nav__link nav__more-btn" aria-expanded={more} aria-haspopup="true" onClick={() => setMore((v) => !v)}>
              More <Icon name="down" size={14} />
            </button>
            {more && (
              <div className="nav__drop">
                {moreNav.map((l) => (
                  <Link key={l.to} to={l.to} className="nav__drop-link">
                    <strong>{l.label}</strong>
                    <span>{l.note}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
        <div className="nav__right">
          <button type="button" className="nav__login" onClick={openLogin}>
            Log in
          </button>
          <button type="button" className="btn btn--primary nav__join" onClick={() => openJoin()} data-cursor="Join">
            <span>Sign up</span>
          </button>
          <button
            type="button"
            className="nav__burger"
            aria-expanded={sheet}
            aria-controls="nav-sheet"
            aria-label={sheet ? "Close menu" : "Open menu"}
            onClick={() => setSheet((v) => !v)}
          >
            <span className="nav__lines" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>
      <Menu open={sheet} onClose={closeSheet} />
    </>
  );
}

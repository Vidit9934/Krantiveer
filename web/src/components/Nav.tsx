import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useJoin } from "../context/JoinContext";
import { navGroups } from "../data/nav";
import type { NavGroup } from "../data/nav";
import { media } from "../data/media";
import { services } from "../data/services";
import { regions, releases } from "../data/site";
import { stats } from "../data/proof";
import { Art } from "./Art";
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

const refOf = (slot: string) => `KMF-${String(media[slot]?.seed ?? 0).padStart(3, "0")}`;

function PanelLinkRow({ to, name, sub }: { to: string; name: string; sub?: string }) {
  return (
    <Link to={to} className="mega__row" data-cursor="Open">
      <span className="mega__row-name">{name}</span>
      {sub && <span className="mega__row-sub">{sub}</span>}
      <Icon name="upright" size={16} className="mega__row-arrow" aria-hidden="true" />
    </Link>
  );
}

function Panel({ group }: { group: NavGroup }) {
  const head = <p className="eyebrow mega__eyebrow">{group.eyebrow}</p>;
  if (group.kind === "services") {
    return (
      <div className="mega__panel mega__panel--split">
        <div className="mega__list">
          {head}
          {services.map((s) => (
            <PanelLinkRow key={s.slot} to="/services" name={s.name} sub={s.line} />
          ))}
        </div>
        <div className="mega__cards">
          {services.slice(0, 4).map((s) => (
            <Link key={s.slot} to="/services" className="mega__card" data-cursor="Open">
              <Art slot={s.slot} className="mega__art" />
              <span className="mega__card-title">{s.name}</span>
              <span className="mono mega__card-ref">{refOf(s.slot)}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }
  if (group.kind === "work") {
    return (
      <div className="mega__panel mega__panel--work">
        <div className="mega__top">
          {head}
          <Link to="/work" className="mega__all">
            View all work <Icon name="upright" size={14} aria-hidden="true" />
          </Link>
        </div>
        <div className="mega__cards mega__cards--four">
          {releases.slice(0, 4).map((r, i) => (
            <Link key={r.ref} to="/work" className="mega__card" data-cursor="Open">
              <Art slot={`work-${i + 1}`} className="mega__art" />
              <span className="mega__card-title">{r.title}</span>
              <span className="mega__card-goal">{r.goal}</span>
              <span className="mono mega__card-ref">{r.ref}</span>
            </Link>
          ))}
        </div>
        <ul className="mega__stats" aria-label="Headline numbers">
          {stats.map((s) => (
            <li key={s.value} title={s.label}>
              <strong>{s.value}</strong>
              {!s.confirmed && <em className="mono">Placeholder</em>}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (group.kind === "regional") {
    return (
      <div className="mega__panel">
        {head}
        <div className="mega__grid">
          {regions.map((r) => (
            <PanelLinkRow key={r.slug} to={`/regional/${r.slug}`} name={`${r.name}  ${r.native}`} sub={r.note} />
          ))}
          <PanelLinkRow to="/regional" name="All regions" sub="Compare languages and platforms" />
        </div>
      </div>
    );
  }
  return (
    <div className="mega__panel">
      {head}
      <div className="mega__grid">
        {group.items?.map((l) => (
          <PanelLinkRow key={l.to} to={l.to} name={l.label} sub={l.note} />
        ))}
      </div>
    </div>
  );
}

/** Opaque, always-visible bar with grouped mega-menus. Log in and Sign up sit on the right. */
export function Nav() {
  const [sheet, setSheet] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const openRef = useRef<string | null>(null);
  const timer = useRef<number>(0);
  const barRef = useRef<HTMLElement>(null);
  const { openJoin, openLogin } = useJoin();
  const { pathname } = useLocation();
  const closeSheet = useCallback(() => setSheet(false), []);

  const set = useCallback((id: string | null) => {
    openRef.current = id;
    setOpen(id);
  }, []);
  const fine = () => matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hoverOpen = (id: string) => {
    if (!fine()) return;
    window.clearTimeout(timer.current);
    if (openRef.current) set(id);
    else timer.current = window.setTimeout(() => set(id), 110);
  };
  const hoverClose = () => {
    if (!fine()) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => set(null), 170);
  };

  useEffect(() => {
    window.clearTimeout(timer.current);
    set(null);
    setSheet(false);
  }, [pathname, set]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !barRef.current?.contains(e.target as Node) && set(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const btn = barRef.current?.querySelector<HTMLElement>(`[data-group="${open}"] > button`);
      set(null);
      btn?.focus();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, set]);

  const isActive = (g: NavGroup) => g.match.some((m) => pathname === m || pathname.startsWith(`${m}/`));

  return (
    <>
      <div className={`mega-dim${open ? " is-on" : ""}`} aria-hidden="true" onClick={() => set(null)} />
      <header className="nav">
        <Logo />
        <nav ref={barRef} className="nav__links" aria-label="Main">
          {navGroups.map((g) =>
            g.kind === "link" ? (
              <NavLink key={g.id} to={g.to!} className={`nav__link${isActive(g) ? " is-active" : ""}`} data-cursor="Open">
                {g.label}
              </NavLink>
            ) : (
              <div key={g.id} className="nav__group" data-group={g.id} onMouseEnter={() => hoverOpen(g.id)} onMouseLeave={hoverClose}>
                <button
                  type="button"
                  className={`nav__link${isActive(g) ? " is-active" : ""}${open === g.id ? " is-open" : ""}`}
                  aria-expanded={open === g.id}
                  aria-haspopup="true"
                  aria-controls={`mega-${g.id}`}
                  onClick={() => {
                    window.clearTimeout(timer.current);
                    set(open === g.id ? null : g.id);
                  }}
                >
                  {g.label} <Icon name="down" size={14} aria-hidden="true" />
                </button>
                {open === g.id && (
                  <div className="mega" id={`mega-${g.id}`}>
                    <Panel group={g} />
                  </div>
                )}
              </div>
            ),
          )}
        </nav>
        <div className="nav__right">
          <button type="button" className="nav__login" onClick={openLogin}>
            Log in
          </button>
          <button type="button" className="btn btn--primary nav__join" onClick={() => openJoin()} data-cursor="Join">
            <span>Sign up</span>
            <Icon name="upright" size={16} aria-hidden="true" />
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

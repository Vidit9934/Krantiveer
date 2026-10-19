import { useEffect } from "react";
import { Link } from "react-router-dom";
import { scrollControl } from "../motion/Smooth";
import { useJoin } from "../context/JoinContext";
import { allNav } from "../data/nav";
import { site } from "../data/site";

interface MenuProps {
  open: boolean;
  onClose: () => void;
}

/** Narrow screens: an opaque sheet under the bar that lists every page, with Log in and WhatsApp. */
export function Menu({ open, onClose }: MenuProps) {
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

  return (
    <div id="nav-sheet" className={`sheet${open ? " is-open" : ""}`} aria-hidden={!open} inert={!open}>
      <nav className="sheet__links" aria-label="All pages">
        {allNav.map((l) => (
          <Link key={l.to} to={l.to} onClick={onClose}>
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="sheet__foot">
        <button
          type="button"
          onClick={() => {
            onClose();
            openLogin();
          }}
        >
          Log in
        </button>
        <a href={site.whatsappLink} target="_blank" rel="noreferrer">
          WhatsApp {site.whatsappDisplay}
        </a>
      </div>
    </div>
  );
}

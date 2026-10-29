import { Link } from "react-router-dom";
import { VelocityType } from "../motion/VelocityType";
import { useJoin } from "../context/JoinContext";
import { allNav } from "../data/nav";
import { site } from "../data/site";
import { Icon } from "./Icon";

/** Gold CTA row, the real routes, a compact bold sign-off and mono details. */
export function Footer() {
  const { openJoin } = useJoin();
  return (
    <footer className="footer">
      <div className="footer__cta">
        <p className="footer__cta-line">Start your next release with KMF.</p>
        <div className="footer__cta-actions">
          <button type="button" className="footer__join" onClick={() => openJoin()} data-cursor="Join">
            Join KMF <Icon name="upright" size={16} aria-hidden="true" />
          </button>
          <a className="footer__wa" href={site.whatsappLink} target="_blank" rel="noreferrer">
            WhatsApp {site.whatsappDisplay}
          </a>
        </div>
      </div>
      <nav className="footer__links" aria-label="Footer">
        {allNav.map((l) => (
          <Link key={l.to} to={l.to} data-cursor="Open">
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="footer__mark" aria-hidden="true">
        <VelocityType className="footer__word">KMF Media</VelocityType>
      </div>
      <div className="footer__legal">
        <p>© 2026 KMF Media Pvt. Ltd.</p>
        <p className="mono" aria-hidden="true">
          KMF-000 · Side B · 33 1/3 rpm
        </p>
      </div>
    </footer>
  );
}

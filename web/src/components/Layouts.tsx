import { Outlet } from "react-router-dom";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { WhatsAppFab } from "./WhatsAppFab";
import { Atmosphere } from "./Atmosphere";

export function SiteLayout() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Atmosphere />
      <Nav />
      <main id="main" className="site-main">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}

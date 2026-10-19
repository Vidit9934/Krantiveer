import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LinkView } from "./LinkView";
import { loadPage } from "./linksState";
import { usePageTitle } from "../../components/PageHead";

/** Public fan page. Edge-cached in production; here it reads whatever the builder saved. */
export default function PublicLink() {
  const { handle } = useParams();
  const page = loadPage();
  const [tapped, setTapped] = useState("");
  usePageTitle(page.name);

  useEffect(() => {
    document.documentElement.classList.add("is-public-link");
    return () => document.documentElement.classList.remove("is-public-link");
  }, []);

  if (handle !== page.handle && handle !== "artist-name") {
    return (
      <main className="public-link">
        <p>No page lives at kmf.link/{handle} yet.</p>
        <Link to="/links">Build yours with KMF Links</Link>
      </main>
    );
  }

  return (
    <main className="public-link">
      <LinkView page={page} onTap={setTapped} />
      <p className="public-link__note" role="status">
        {tapped ? `Click logged: ${tapped}. Preview only, the live page opens the destination.` : "Tap a link to see click logging in this preview."}
      </p>
    </main>
  );
}

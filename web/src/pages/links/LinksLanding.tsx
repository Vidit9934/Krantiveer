import { PaperScene } from "../../motion/PaperScene";
import { PageHead } from "../../components/PageHead";
import { Button } from "../../components/Button";
import { Icon } from "../../components/Icon";
import { LinkView } from "./LinkView";
import { defaultPage } from "./linksState";

const rows = [
  ["Pages", "1 page", "Unlimited pages"],
  ["Smart links for songs", "Yes", "Yes"],
  ["KMF footer", "Powered by KMF Media", "Removed"],
  ["Custom domain", "No", "Yes"],
  ["Meta and Google pixels", "No", "Yes"],
  ["QR code", "No", "Yes"],
  ["Email capture", "No", "Yes, with DPDP consent"],
  ["Country routing", "No", "Yes"],
];

export default function LinksLanding() {
  return (
    <>
      <PageHead
        title="KMF Links"
        lede="One page per artist. A smart link per song."
        aside={
          <div className="row">
            <Button to="/links/builder" icon="link">
              Build your page
            </Button>
          </div>
        }
      />
      <div className="wrap section">
          <section className="stack" aria-labelledby="ll-how">
            <h2 id="ll-how" style={{ fontSize: "1.75rem" }}>One link for everything you release</h2>
            <p className="lede">Paste one song link and the page lists every platform: Spotify, Apple Music, YouTube Music, JioSaavn and more. If the matching service misses one, you add it by hand.</p>
            <ul className="stack">
              <li className="row" style={{ flexWrap: "nowrap", alignItems: "flex-start" }}><Icon name="link" className="gold" /> kmf.link/artistname for you, kmf.link/artistname/song for each release</li>
              <li className="row" style={{ flexWrap: "nowrap", alignItems: "flex-start" }}><Icon name="chart" className="gold" /> Views, clicks per link, city, device and traffic source, with bot filtering and CSV export</li>
              <li className="row" style={{ flexWrap: "nowrap", alignItems: "flex-start" }}><Icon name="shield" className="gold" /> Reserved usernames, link scanning, takedown tools and explicit consent for fan data</li>
            </ul>
          </section>
      </div>
      <PaperScene className="scene-paper" aria-labelledby="ll-plans">
      <div className="wrap grid grid--sidebar">
          <section className="stack">
            <h2 id="ll-plans" style={{ fontSize: "1.5rem" }}>Free and Pro</h2>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Feature</th>
                    <th scope="col">Free</th>
                    <th scope="col">Pro, included in paid plans</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r[0]}>
                      <th scope="row" style={{ color: "var(--ink)" }}>{r[0]}</th>
                      <td data-label="Free">{r[1]}</td>
                      <td data-label="Pro">{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        <aside className="builder__preview" aria-label="Example page">
          <div className="phone-frame">
            <LinkView page={defaultPage} />
          </div>
        </aside>
      </div>
      </PaperScene>
    </>
  );
}

import { PageHead } from "../components/PageHead";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";

const services = [
  {
    name: "Spotify growth",
    gets: "Playlist pitching, editorial submission support, pre-save setup and a release-week checklist.",
    wont: "Buy plays, use botted playlists or promise follower counts.",
  },
  {
    name: "YouTube growth",
    gets: "Premiere planning, thumbnail and title testing, Shorts cut-downs and creator cross-promotion.",
    wont: "Sell views or subscribers.",
  },
  {
    name: "Creator reels campaigns",
    gets: "Vetted Instagram creators matched to your language and niche, booked through the KMF marketplace with one GST invoice.",
    wont: "Reveal your budget to creators or creator rates to you.",
  },
  {
    name: "Press and EPK",
    gets: "A bio and EPK, plus a feature article on KMF Press with a clearly labelled byline.",
    wont: "Publish unlabelled sponsored content.",
  },
  {
    name: "Release planning",
    gets: "A dated plan from master to week four: content calendar, platform tasks and the KMF Links page for the song.",
    wont: "Hand you a template that ignores your genre or language.",
  },
  {
    name: "Regional and devotional campaigns",
    gets: "Calendars built around festivals and regional release rhythms, with creators who speak the language of the song.",
    wont: "Treat every language as Hindi with a different caption.",
  },
];

export default function Services() {
  return (
    <>
      <PageHead
        title="Services"
        lede="What KMF does, and what it never will."
        aside={
          <div className="notice">
            <p>Each service carries the no-bot badge. See the policy that backs it.</p>
            <div style={{ marginTop: 12 }}>
              <Button to="/policy" variant="quiet" iconAfter="arrow">
                No-bot policy
              </Button>
            </div>
          </div>
        }
      />
      <section className="section--tight">
        <div className="wrap">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Service</th>
                  <th scope="col">What you get</th>
                  <th scope="col">What KMF will not do</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.name}>
                    <th scope="row" style={{ color: "var(--ink)", fontSize: "1.0625rem" }}>
                      <span className="row" style={{ gap: 8, flexWrap: "nowrap" }}>
                        <Icon name="shield" size={18} className="gold" />
                        {s.name}
                      </span>
                    </th>
                    <td>{s.gets}</td>
                    <td className="muted">{s.wont}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap row" style={{ justifyContent: "space-between" }}>
          <h2 style={{ maxWidth: "18ch" }}>Not sure which service fits your release?</h2>
          <div className="row">
            <Button to="/plans" iconAfter="arrow">
              Compare plans
            </Button>
            <Button to="/contact" variant="secondary">
              Talk to the KMF team
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

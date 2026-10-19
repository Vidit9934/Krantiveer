import { PageHead } from "../../components/PageHead";
import { Button } from "../../components/Button";
import { Icon } from "../../components/Icon";
import { bookingSteps, campaigns } from "../../data/marketplace";

export default function MarketplaceHome() {
  return (
    <>
      <PageHead
        title="Campaign marketplace"
        lede="Post a brief. Vetted creators apply. One invoice."
        aside={
          <div className="stack">
            <Button to="/marketplace/campaigns/new" icon="plus">
              Post a campaign
            </Button>
            <Button to="/marketplace/creators/apply" variant="secondary" icon="user">
              Apply as a creator
            </Button>
          </div>
        }
      />
      <div className="wrap section--tight grid grid--sidebar">
        <section className="stack--lg" aria-labelledby="mp-how">
          <h2 id="mp-how" style={{ fontSize: "1.75rem" }}>How a booking runs</h2>
          <ol className="steps">
            {bookingSteps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </section>
        <aside className="stack">
          <div className="panel panel--raised stack">
            <Icon name="lock" size={26} className="gold" />
            <h3>Blind pricing, on both sides</h3>
            <p className="muted">Creators never see the campaign budget. Labels never see creator rates. Only KMF sees both.</p>
          </div>
          <div className="panel stack">
            <Icon name="clock" size={26} className="gold" />
            <h3>Rates lock for 90 days</h3>
            <p className="muted">Once a profile is approved the rate cannot be edited. Managers can override with a logged reason.</p>
          </div>
        </aside>
      </div>
      <section className="section">
        <div className="wrap stack--lg">
          <div className="row">
            <h2 style={{ fontSize: "1.75rem" }}>Live now</h2>
            <span className="ph">sample campaigns</span>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Campaign</th>
                  <th scope="col">Language</th>
                  <th scope="col">Deliverable</th>
                  <th scope="col">Deadline</th>
                  <th scope="col" className="num">Slots</th>
                </tr>
              </thead>
              <tbody>
                {campaigns
                  .filter((c) => c.status === "live")
                  .map((c) => (
                    <tr key={c.id}>
                      <th scope="row" style={{ color: "var(--ink)" }}>
                        {c.title}
                        <div className="muted small">{c.label}</div>
                      </th>
                      <td data-label="Language">{c.language}</td>
                      <td data-label="Deliverable">{c.deliverable}</td>
                      <td data-label="Deadline">{c.deadline}</td>
                      <td className="num" data-label="Slots">{c.slots}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <p className="muted small">The campaign board with budgets hidden is visible only to approved creators.</p>
        </div>
      </section>
    </>
  );
}

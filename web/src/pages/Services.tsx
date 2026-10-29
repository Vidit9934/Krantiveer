import { ReactiveType } from "../motion/ReactiveType";
import { PaperScene } from "../motion/PaperScene";
import { PageHead } from "../components/PageHead";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { services } from "../data/services";



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
      <PaperScene className="scene-paper" aria-label="Services and limits">
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
                    <th scope="row" style={{ color: "var(--ink)", fontSize: "1.0625rem", fontWeight: 650 }}>
                      <span className="row" style={{ gap: 8, flexWrap: "nowrap" }}>
                        <Icon name="shield" size={18} className="gold" />
                        {s.name}
                      </span>
                    </th>
                    <td data-label="What you get">{s.gets}</td>
                    <td className="muted" data-label="What KMF will not do">{s.wont}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PaperScene>
      <section className="section">
        <div className="wrap row" style={{ justifyContent: "space-between" }}>
          <ReactiveType as="h2" className="cta-reactive" text="Not sure which service fits your release?" />
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

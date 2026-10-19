import { PageHead } from "../components/PageHead";
import { Button } from "../components/Button";

export default function Founder() {
  return (
    <>
      <PageHead title="The founder" lede="Started by Kranti. Story and milestones to come." />
      <div className="wrap section--tight grid" style={{ gridTemplateColumns: "minmax(0,1fr)" }}>
        <div className="founder">
          <div className="founder__plate">
            <span>
              <b>Kranti</b>
              Founder, KMF Media
              <br />
              <span className="ph" style={{ marginTop: 12 }}>
                Photo to come
              </span>
            </span>
          </div>
          <div className="stack--lg">
            <section className="stack" aria-labelledby="story">
              <h2 id="story" style={{ fontSize: "1.75rem" }}>Story</h2>
              <p>
                <span className="ph">To be written with Kranti</span>
              </p>
              <p className="muted">Why KMF exists, what the first release looked like and why the no-bot rule is non-negotiable.</p>
            </section>
            <section className="stack" aria-labelledby="miles">
              <h2 id="miles" style={{ fontSize: "1.75rem" }}>Milestones</h2>
              <ol className="steps">
                <li>
                  <span>
                    First release marketed <span className="ph">Date and details to confirm</span>
                  </span>
                </li>
                <li>
                  <span>
                    First one million streams on a client release <span className="ph">To confirm</span>
                  </span>
                </li>
                <li>
                  <span>
                    The KMF platform launches <span className="ph">Launch date to confirm</span>
                  </span>
                </li>
              </ol>
            </section>
            <Button to="/contact" variant="secondary">
              Talk to the KMF team
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

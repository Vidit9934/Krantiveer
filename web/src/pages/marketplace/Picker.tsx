import { PaperScene } from "../../motion/PaperScene";
import { useRef, useState } from "react";
import { PageHead } from "../../components/PageHead";
import { Button } from "../../components/Button";
import { Cover } from "../../components/Cover";
import { creators, campaigns } from "../../data/marketplace";
import { compact, inr } from "../../lib/format";

const BUDGET = 40000;
const TOGGLE_LIMIT = 12;
const GST = 0.18;

/**
 * Label-side picker. Creator `rateInr` is used only to sum against the budget in memory,
 * and is never rendered here. The bar is rounded to 10% steps to blunt price inference.
 * In production the sum runs on the server and only the bar and slots-left are returned.
 */
export default function Picker() {
  const campaign = campaigns[0];
  const [picked, setPicked] = useState<string[]>([]);
  const toggles = useRef(0);
  const [limited, setLimited] = useState(false);
  const [stage, setStage] = useState<"pick" | "pay" | "done">("pick");

  const spent = picked.reduce((s, id) => s + (creators.find((c) => c.id === id)?.rateInr ?? 0), 0);
  const pct = Math.min(100, Math.round((spent / BUDGET) * 10) * 10);
  const slotsLeft = campaign.slots - picked.length;

  function toggle(id: string) {
    if (toggles.current >= TOGGLE_LIMIT) {
      setLimited(true);
      return;
    }
    toggles.current += 1;
    setPicked((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  const total = Math.round(spent * (1 + GST));

  if (stage === "done") {
    return (
      <>
        <PageHead title="Booked" lede="Creators have 48 hours to confirm. Preview only." />
        <PaperScene className="scene-paper">
          <div className="wrap">
            <Button to="/marketplace" iconAfter="arrow">
              Back to the marketplace
            </Button>
          </div>
        </PaperScene>
      </>
    );
  }

  if (stage === "pay") {
    return (
      <>
        <PageHead title="Checkout" lede="One GST invoice. Rates are never itemised." />
        <PaperScene className="scene-paper" aria-label="Checkout">
        <div className="wrap wrap--read stack--lg">
          <div className="panel panel--raised stack">
            <p>{picked.length} creators selected for {campaign.title}.</p>
            <p className="tile__price">{inr(total)}</p>
            <p className="muted small">Includes GST at 18%. Payable by UPI, card or netbanking through Razorpay in the live site.</p>
          </div>
          <div className="row">
            <Button variant="secondary" onClick={() => setStage("pick")}>
              Change selection
            </Button>
            <Button icon="lock" onClick={() => setStage("done")}>
              Pay {inr(total)}
            </Button>
          </div>
        </div>
        </PaperScene>
      </>
    );
  }

  return (
    <>
      <PageHead title={`Applicants for ${campaign.title}`} lede="Profiles and audience quality, never prices." />
      <PaperScene className="scene-paper" aria-label="Applicants">
      <div className="wrap grid grid--sidebar">
        <ul className="creator-list">
          {creators.map((c) => {
            const on = picked.includes(c.id);
            const wouldExceed = !on && spent + c.rateInr > BUDGET;
            return (
              <li key={c.id} className="creator-row">
                <Cover seed={c.seed} label="Sample" />
                <div className="stack">
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <div>
                      <h2 style={{ fontSize: "1.25rem", fontFamily: "var(--font-body)", letterSpacing: 0 }}>{c.handle}</h2>
                      <p className="muted small">
                        {c.niche}, {c.city}
                      </p>
                    </div>
                    <Button variant={on ? "primary" : "secondary"} aria-pressed={on} disabled={wouldExceed && !limited} onClick={() => toggle(c.id)}>
                      {on ? "Picked" : wouldExceed ? "Budget exceeded" : "Pick"}
                    </Button>
                  </div>
                  <div className="row">
                    <span className="tag">{compact(c.followers)} followers</span>
                    <span className="tag tag--gold">{c.audienceMatch}% audience match</span>
                    <span className="tag">{c.languages.join(", ")}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="panel panel--raised stack" style={{ position: "sticky", top: 90 }} aria-label="Selection summary">
          <h2 style={{ fontSize: "1.375rem" }}>Your selection</h2>
          <p>{picked.length} picked</p>
          <div className="budget" aria-live="polite">
            <div className="budget__bar" role="img" aria-label={`Budget used, about ${pct} percent`}>
              <i style={{ width: `${pct}%` }} />
            </div>
            <p className="small muted">Budget used, rounded to the nearest 10%.</p>
          </div>
          <p className="small">{slotsLeft} slots left of {campaign.slots}</p>
          {pct >= 100 && <p className="notice" role="status">Budget exceeded for the next pick. You can go to checkout now.</p>}
          {limited && (
            <p className="field__error" role="alert">
              Too many changes in a short time. Selection is locked for now. Continue to checkout or contact KMF to adjust.
            </p>
          )}
          <Button block disabled={picked.length === 0} onClick={() => setStage("pay")} iconAfter="arrow">
            Go to checkout
          </Button>
        </aside>
      </div>
      </PaperScene>
    </>
  );
}

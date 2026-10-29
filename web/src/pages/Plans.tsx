import { PaperScene } from "../motion/PaperScene";
import { useMemo, useState } from "react";
import { PageHead } from "../components/PageHead";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { plans, addOns } from "../data/site";
import { inr } from "../lib/format";

const GST_RATE = 0.18;
const coupons: Record<string, number> = { KMFWELCOME: 0.1 };

export default function Plans() {
  const [planId, setPlanId] = useState<string>("growth");
  const [picked, setPicked] = useState<string[]>([]);
  const [business, setBusiness] = useState(false);
  const [gstin, setGstin] = useState("");
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");
  const [done, setDone] = useState(false);

  const plan = plans.find((p) => p.id === planId)!;
  const custom = plan.priceInr === null;

  const totals = useMemo(() => {
    const base = plan.priceInr ?? 0;
    const extra = addOns.filter((a) => picked.includes(a.name)).reduce((s, a) => s + a.priceInr, 0);
    const subtotal = base + extra;
    const discount = applied ? Math.round(subtotal * coupons[applied]) : 0;
    const taxable = subtotal - discount;
    const gst = Math.round(taxable * GST_RATE);
    return { subtotal, discount, gst, total: taxable + gst };
  }, [plan, picked, applied]);

  const gstinValid = !business || /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(gstin.trim().toUpperCase());

  function applyCoupon() {
    const c = code.trim().toUpperCase();
    if (coupons[c]) {
      setApplied(c);
      setCouponError("");
    } else {
      setApplied(null);
      setCouponError("That code is not valid. Check the spelling or ask KMF for a current code.");
    }
  }

  if (done) {
    return (
      <>
        <PageHead title="Order received" lede="Preview only. No payment was taken." />
        <PaperScene className="scene-paper">
          <div className="wrap">
            <Button to="/" iconAfter="arrow">
              Back to the homepage
            </Button>
          </div>
        </PaperScene>
      </>
    );
  }

  return (
    <>
      <PageHead
        title="Plans and store"
        lede="Placeholder pricing in rupees."
      />
      <PaperScene className="scene-paper" aria-label="Choose a plan">
      <div className="wrap grid grid--sidebar">
        <div className="stack--lg">
          <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className="sr-only">Choose a plan</legend>
            <div className="plan-list">
              {plans.map((p) => (
                <label key={p.id} className="plan-row" style={{ cursor: "pointer" }}>
                  <div className="check">
                    <input type="radio" name="plan" value={p.id} checked={planId === p.id} onChange={() => setPlanId(p.id)} />
                    <span>
                      <h3>{p.name}</h3>
                      <span className="muted">{p.summary}</span>
                    </span>
                  </div>
                  <ul>
                    {p.includes.map((i) => (
                      <li key={i}>
                        <Icon name="check" size={18} />
                        {i}
                      </li>
                    ))}
                  </ul>
                  <div className="plan-row__price">
                    {p.priceInr ? inr(p.priceInr) : "Custom"}
                    <small>{p.unit}</small>
                  </div>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="stack">
            <h2 style={{ fontSize: "1.75rem" }}>Add-ons</h2>
            {addOns.map((a) => (
              <label key={a.name} className="check">
                <input
                  type="checkbox"
                  checked={picked.includes(a.name)}
                  disabled={custom}
                  onChange={() => setPicked((cur) => (cur.includes(a.name) ? cur.filter((x) => x !== a.name) : [...cur, a.name]))}
                />
                <span>
                  {a.name} <span className="muted">{inr(a.priceInr)}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <aside className="panel panel--raised stack" aria-label="Order summary" style={{ position: "sticky", top: 90 }}>
          <h2 style={{ fontSize: "1.5rem" }}>Order summary</h2>
          {custom ? (
            <>
              <p className="muted">The Label retainer is quoted per label. Tell KMF about your roster and a manager will send a quote.</p>
              <Button to="/contact" block>
                Request a retainer quote
              </Button>
            </>
          ) : (
            <>
              <dl className="stack" style={{ margin: 0 }}>
                <Line label={plan.name} value={inr(plan.priceInr ?? 0)} />
                {addOns
                  .filter((a) => picked.includes(a.name))
                  .map((a) => (
                    <Line key={a.name} label={a.name} value={inr(a.priceInr)} />
                  ))}
                {totals.discount > 0 && <Line label={`Coupon ${applied}`} value={`-${inr(totals.discount)}`} />}
                <Line label="GST at 18%" value={inr(totals.gst)} />
                <Line label="Total" value={inr(totals.total)} strong />
              </dl>

              <div className="field">
                <label htmlFor="coupon">Coupon code</label>
                <div className="row" style={{ flexWrap: "nowrap" }}>
                  <input id="coupon" className="input" value={code} onChange={(e) => setCode(e.target.value)} aria-describedby="coupon-err" />
                  <Button variant="secondary" onClick={applyCoupon}>
                    Apply coupon
                  </Button>
                </div>
                <small id="coupon-err" className={couponError ? "field__error" : ""}>
                  {couponError || (applied ? `${applied} applied.` : "Try KMFWELCOME to see how a coupon looks.")}
                </small>
              </div>

              <label className="check">
                <input type="checkbox" checked={business} onChange={(e) => setBusiness(e.target.checked)} />
                <span>I am buying for a business and need a GST invoice</span>
              </label>
              {business && (
                <div className="field">
                  <label htmlFor="gstin">GSTIN</label>
                  <input id="gstin" className="input" value={gstin} onChange={(e) => setGstin(e.target.value)} aria-invalid={!gstinValid} aria-describedby="gstin-err" placeholder="22AAAAA0000A1Z5" />
                  <small id="gstin-err" className={gstinValid ? "" : "field__error"}>
                    {gstinValid ? "We print this on your invoice." : "A GSTIN has 15 characters, for example 22AAAAA0000A1Z5."}
                  </small>
                </div>
              )}

              <Button block disabled={!gstinValid || (business && !gstin.trim())} icon="lock" onClick={() => setDone(true)}>
                Pay {inr(totals.total)}
              </Button>
              <p className="small muted">Preview only. The live site uses Razorpay hosted checkout for UPI, cards and netbanking.</p>
            </>
          )}
        </aside>
      </div>
      </PaperScene>
    </>
  );
}

function Line({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="row" style={{ justifyContent: "space-between", flexWrap: "nowrap", fontWeight: strong ? 700 : 400, fontSize: strong ? "1.25rem" : "1rem" }}>
      <dt>{label}</dt>
      <dd style={{ margin: 0 }}>{value}</dd>
    </div>
  );
}

import { useState } from "react";
import { PageHead } from "../../components/PageHead";
import { Button } from "../../components/Button";
import { inr } from "../../lib/format";

const steps = ["Profile", "Rate card", "Agreement", "Review"] as const;
const languageOptions = ["Hindi", "Punjabi", "Haryanvi", "Bhojpuri", "Devotional"];

export default function CreatorApply() {
  const [step, setStep] = useState(0);
  const [langs, setLangs] = useState<string[]>([]);
  const [handle, setHandle] = useState("");
  const [followers, setFollowers] = useState("");
  const [rate, setRate] = useState("");
  const [agree, setAgree] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState(false);

  const profileOk = handle.trim().length > 2 && langs.length > 0 && Number(followers) > 0;
  const rateOk = Number(rate) >= 500;
  const canNext = [profileOk, rateOk, agree, true][step];

  function next() {
    setTouched(true);
    if (!canNext) return;
    setTouched(false);
    if (step === steps.length - 1) setSubmitted(true);
    else setStep(step + 1);
  }

  if (submitted) {
    return (
      <>
        <PageHead title="Application sent" lede="A manager reviews every creator." />
        <div className="wrap section--tight stack">
          <p className="muted">Once approved, your rate locks for 90 days. After that you can request a change, which goes back through review. PAN and bank or UPI details are collected before your first payout.</p>
          <Button to="/marketplace" iconAfter="arrow">
            Back to the marketplace
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHead title="Apply as a creator" lede="Build a profile and set your rate per reel." />
      <div className="wrap wrap--read section--tight stack--lg">
        <ol className="row" aria-label="Application steps" style={{ gap: 8 }}>
          {steps.map((s, i) => (
            <li key={s} className={`tag${i === step ? " tag--gold" : ""}`} aria-current={i === step ? "step" : undefined}>
              {i + 1}. {s}
            </li>
          ))}
        </ol>

        <div className="panel form-grid">
          {step === 0 && (
            <>
              <div className="field">
                <label htmlFor="handle">Instagram handle</label>
                <input id="handle" className="input" value={handle} onChange={(e) => setHandle(e.target.value)} aria-invalid={touched && handle.trim().length <= 2} />
              </div>
              <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
                <legend>Languages you create in</legend>
                <div className="row">
                  {languageOptions.map((l) => (
                    <label key={l} className="check">
                      <input type="checkbox" checked={langs.includes(l)} onChange={() => setLangs((cur) => (cur.includes(l) ? cur.filter((x) => x !== l) : [...cur, l]))} />
                      {l}
                    </label>
                  ))}
                </div>
                {touched && langs.length === 0 && <small className="field__error">Pick at least one language.</small>}
              </fieldset>
              <div className="field">
                <label htmlFor="followers">Followers</label>
                <input id="followers" className="input" inputMode="numeric" value={followers} onChange={(e) => setFollowers(e.target.value.replace(/\D/g, ""))} aria-invalid={touched && !Number(followers)} />
              </div>
              <div className="field">
                <label htmlFor="shots">Audience screenshots</label>
                <input id="shots" type="file" accept="image/*" multiple className="input" />
                <small>Gender, age, city and reach from Instagram insights. Preview only, files are not uploaded.</small>
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <div className="field">
                <label htmlFor="rate">Price per reel (INR)</label>
                <input id="rate" className="input" inputMode="numeric" value={rate} onChange={(e) => setRate(e.target.value.replace(/\D/g, ""))} aria-invalid={touched && !rateOk} />
                <small>{rateOk ? `${inr(Number(rate))} per reel. Labels never see this number.` : "Minimum 500. You can add story and carousel rates after approval."}</small>
              </div>
              <p className="notice">After approval this rate is locked for 90 days and you cannot edit it. Managers can override with a logged reason.</p>
            </>
          )}
          {step === 2 && (
            <>
              <p>The creator agreement covers delivery, two rounds of changes, live link submission and payout 15 days after the campaign ends. A dispute freezes the payout until it is resolved.</p>
              <label className="check">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />I accept the creator agreement
              </label>
              {touched && !agree && <small className="field__error">Accept the agreement to continue.</small>}
            </>
          )}
          {step === 3 && (
            <dl className="stack">
              <div>
                <dt className="muted small">Handle</dt>
                <dd style={{ margin: 0 }}>{handle}</dd>
              </div>
              <div>
                <dt className="muted small">Languages</dt>
                <dd style={{ margin: 0 }}>{langs.join(", ")}</dd>
              </div>
              <div>
                <dt className="muted small">Followers and rate</dt>
                <dd style={{ margin: 0 }}>
                  {Number(followers).toLocaleString("en-IN")}, {inr(Number(rate))} per reel
                </dd>
              </div>
            </dl>
          )}
          <div className="row">
            {step > 0 && (
              <Button variant="secondary" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            <Button onClick={next} iconAfter="arrow">
              {step === steps.length - 1 ? "Submit for review" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

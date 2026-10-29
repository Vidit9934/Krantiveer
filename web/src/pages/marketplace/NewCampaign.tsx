import { PaperScene } from "../../motion/PaperScene";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHead } from "../../components/PageHead";
import { Button } from "../../components/Button";
import { inr } from "../../lib/format";

const languageOptions = ["Hindi", "Punjabi", "Haryanvi", "Bhojpuri", "Devotional"];

export default function NewCampaign() {
  const navigate = useNavigate();
  const [f, setF] = useState({ song: "", brief: "", deliverable: "1 reel with hook", deadline: "", budget: "" });
  const [langs, setLangs] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);

  const errors = {
    song: !/^https?:\/\/\S+/.test(f.song) ? "Paste a Spotify, YouTube or Apple Music link that starts with https." : "",
    brief: f.brief.trim().length < 20 ? "Write at least a couple of sentences: the hook, the mood and what must stay the same." : "",
    langs: langs.length === 0 ? "Pick at least one language." : "",
    deadline: !f.deadline ? "Choose a deadline." : "",
    budget: Number(f.budget) < 5000 ? "The minimum budget is 5,000 rupees." : "",
  };
  const valid = Object.values(errors).every((e) => !e);

  return (
    <>
      <PageHead title="Post a campaign" lede="Your budget stays hidden from creators." />
      <PaperScene className="scene-paper" aria-label="Campaign form">
      <div className="wrap wrap--read">
        <form
          className="panel form-grid"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            setTouched(true);
            if (valid) navigate("/marketplace/campaigns/k1/pick");
          }}
        >
          <div className="field">
            <label htmlFor="song">Song link</label>
            <input id="song" className="input" value={f.song} onChange={(e) => setF({ ...f, song: e.target.value })} aria-invalid={touched && !!errors.song} />
            {touched && errors.song && <small className="field__error">{errors.song}</small>}
          </div>
          <div className="field">
            <label htmlFor="brief">Brief</label>
            <textarea id="brief" className="textarea" value={f.brief} onChange={(e) => setF({ ...f, brief: e.target.value })} aria-invalid={touched && !!errors.brief} />
            {touched && errors.brief && <small className="field__error">{errors.brief}</small>}
          </div>
          <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
            <legend>Target languages</legend>
            <div className="row">
              {languageOptions.map((l) => (
                <label key={l} className="check">
                  <input type="checkbox" checked={langs.includes(l)} onChange={() => setLangs((c) => (c.includes(l) ? c.filter((x) => x !== l) : [...c, l]))} />
                  {l}
                </label>
              ))}
            </div>
            {touched && errors.langs && <small className="field__error">{errors.langs}</small>}
          </fieldset>
          <div className="form-grid form-grid--2">
            <div className="field">
              <label htmlFor="deliv">Deliverables</label>
              <select id="deliv" className="select" value={f.deliverable} onChange={(e) => setF({ ...f, deliverable: e.target.value })}>
                <option>1 reel with hook</option>
                <option>1 reel and 1 story</option>
                <option>1 reel and 1 carousel</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="deadline">Deadline</label>
              <input id="deadline" type="date" className="input" value={f.deadline} onChange={(e) => setF({ ...f, deadline: e.target.value })} aria-invalid={touched && !!errors.deadline} />
              {touched && errors.deadline && <small className="field__error">{errors.deadline}</small>}
            </div>
          </div>
          <div className="field">
            <label htmlFor="budget">Total budget (INR)</label>
            <input id="budget" className="input" inputMode="numeric" value={f.budget} onChange={(e) => setF({ ...f, budget: e.target.value.replace(/\D/g, "") })} aria-invalid={touched && !!errors.budget} />
            <small>{Number(f.budget) >= 5000 ? `${inr(Number(f.budget))} before GST. Creators will not see this.` : "GST invoice issued at checkout."}</small>
            {touched && errors.budget && <small className="field__error">{errors.budget}</small>}
          </div>
          <div>
            <Button onClick={() => (document.getElementById("camp-go") as HTMLButtonElement | null)?.click()} iconAfter="arrow">
              Post campaign and review applicants
            </Button>
            <button id="camp-go" type="submit" hidden />
          </div>
        </form>
      </div>
      </PaperScene>
    </>
  );
}

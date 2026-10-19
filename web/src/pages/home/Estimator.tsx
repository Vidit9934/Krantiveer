import { useMemo, useState } from "react";
import { SplitLines } from "../../motion/SplitLines";
import { Button } from "../../components/Button";
import { useJoin } from "../../context/JoinContext";
import { creators } from "../../data/marketplace";
import { plans } from "../../data/site";
import { inr } from "../../lib/format";

const languages = ["Hindi", "Punjabi", "Haryanvi", "Bhojpuri", "Devotional"];
const goals = ["More streams", "Playlist reach", "Reels and creators", "Release plan"];
const MIN = 15000;
const MAX = 250000;
const CREATOR_SHARE = 0.6;

/** Language, goal and budget in; a recommended plan and a rough reel count out. An estimate, never a promise. */
export function Estimator() {
  const { openJoin } = useJoin();
  const [language, setLanguage] = useState("Hindi");
  const [goal, setGoal] = useState(goals[0]);
  const [budget, setBudget] = useState(50000);

  const result = useMemo(() => {
    const planId = budget < 35000 ? "starter" : budget < 150000 ? "growth" : "label";
    const plan = plans.find((p) => p.id === planId)!;
    const pool = creators.filter((c) => c.languages.includes(language) || (language === "Devotional" && c.niche === "Devotional"));
    const rates = (pool.length ? pool : creators).map((c) => c.rateInr);
    const avg = rates.reduce((a, b) => a + b, 0) / rates.length;
    const reels = planId === "starter" ? 0 : Math.max(1, Math.floor((budget * CREATOR_SHARE) / avg));
    return { plan, reels, avg: Math.round(avg) };
  }, [budget, language]);

  const chips = (items: string[], value: string, set: (v: string) => void, label: string) => (
    <div className="chips" role="radiogroup" aria-label={label}>
      {items.map((item) => (
        <button key={item} type="button" role="radio" aria-checked={value === item} className="chip" onClick={() => set(item)} data-cursor="Select">
          {item}
        </button>
      ))}
    </div>
  );

  return (
    <section className="estimator" aria-labelledby="est-title">
      <SplitLines as="h2" text="Plan your release in ten seconds." className="estimator__title" id="est-title" />
      <div className="estimator__grid">
        <div className="estimator__controls">
          <div className="field">
            <span className="field__label">Language you sing in</span>
            {chips(languages, language, setLanguage, "Language")}
          </div>
          <div className="field">
            <span className="field__label">What you want most</span>
            {chips(goals, goal, setGoal, "Goal")}
          </div>
          <div className="field">
            <label htmlFor="est-budget">
              Budget <strong>{inr(budget)}</strong>
            </label>
            <input id="est-budget" className="range" type="range" min={MIN} max={MAX} step={5000} value={budget} onChange={(e) => setBudget(Number(e.target.value))} />
            <span className="range__ends">
              <span>{inr(MIN)}</span>
              <span>{inr(MAX)}</span>
            </span>
          </div>
        </div>
        <div className="estimator__result" aria-live="polite">
          <p className="estimator__kicker">We would suggest</p>
          <p className="estimator__plan">{result.plan.name}</p>
          <p className="estimator__figure">
            {result.reels > 0 ? (
              <>
                About <strong>{result.reels}</strong> creator reels in {language}
              </>
            ) : (
              <>A release plan, pitching brief and bio review</>
            )}
          </p>
          <p className="small muted">Estimate from placeholder creator rates (average {inr(result.avg)}). Not a promise of results.</p>
          <Button onClick={() => openJoin({ language, goal, note: `${result.plan.name}, budget ${inr(budget)}` })} magnetic cursor="Join" iconAfter="arrow">
            Start with this plan
          </Button>
        </div>
      </div>
    </section>
  );
}

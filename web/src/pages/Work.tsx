import { useState } from "react";
import { PageHead } from "../components/PageHead";
import { Cover } from "../components/Cover";
import { releases } from "../data/site";

const filters = ["All", "Hindi", "Punjabi", "Haryanvi", "Devotional"] as const;

export default function Work() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const shown = releases.filter((r) => filter === "All" || r.language === filter);
  return (
    <>
      <PageHead
        title="Our work"
        lede="Placeholder releases until KMF approves real ones."
      />
      <div className="wrap wrap--index section--tight stack--lg">
        <div className="row" role="group" aria-label="Filter by language">
          {filters.map((f) => (
            <button key={f} type="button" className={`tag${filter === f ? " tag--gold" : ""}`} aria-pressed={filter === f} onClick={() => setFilter(f)} style={{ minHeight: 44, cursor: "pointer", background: "none" }}>
              {f}
            </button>
          ))}
        </div>
        {shown.length === 0 ? (
          <p className="empty">No placeholder case studies in this language yet.</p>
        ) : (
          <ul className="index">
            {shown.map((r) => (
              <li key={r.ref}>
                <div className="index__row">
                  <span className="index__ref">{r.ref}</span>
                  <span className="index__title">
                    <strong>{r.title}</strong>
                    <small>{r.artist}</small>
                  </span>
                  <span className="index__lang">{r.language}</span>
                  <span className="index__goal">
                    {r.goal}. {r.result}.
                  </span>
                  <Cover className="index__thumb" seed={r.seed} label="Placeholder" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

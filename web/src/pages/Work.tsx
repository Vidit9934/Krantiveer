import { PaperScene } from "../motion/PaperScene";
import { useState } from "react";
import { PageHead } from "../components/PageHead";
import { Art } from "../components/Art";
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
      <PaperScene className="scene-paper" aria-label="Releases">
      <div className="wrap wrap--index stack--lg">
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
          <ul className="work-grid">
            {shown.map((r) => (
              <li key={r.ref} className="work-card">
                <Art slot={`work-${releases.indexOf(r) + 1}`} className="work-card__art" />
                <div className="work-card__body">
                  <span className="mono work-card__ref">
                    {r.ref} · {r.language}
                  </span>
                  <strong>{r.title}</strong>
                  <small>{r.artist}</small>
                  <p>
                    {r.goal}. {r.result}.
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      </PaperScene>
    </>
  );
}

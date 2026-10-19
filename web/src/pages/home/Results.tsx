import { SplitLines } from "../../motion/SplitLines";
import { stats, story } from "../../data/proof";

function Spark({ points }: { points: number[] }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const d = points
    .map((v, i) => `${i === 0 ? "M" : "L"}${(i / (points.length - 1)) * 100} ${30 - ((v - min) / (max - min || 1)) * 26}`)
    .join(" ");
  return (
    <svg className="spark" viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** One dominant figure and two quieter ones, then a single story. Figures are placeholders until confirmed. */
export function Results() {
  return (
    <section className="results" aria-labelledby="results-title">
      <SplitLines as="h2" text="What a release can become." className="results__title" id="results-title" />
      <div className="results__grid">
        {stats.map((s, i) => (
          <figure key={s.label} className={`stat stat--${i}`}>
            <Spark points={s.trend} />
            <figcaption>
              <span className="stat__value">{s.value}</span>
              <span className="stat__label">
                {s.label} {!s.confirmed && <span className="ph">placeholder</span>}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="results__story">
        <h3>{story.title}</h3>
        <p>
          {story.body} {!story.confirmed && <span className="ph">placeholder</span>}
        </p>
      </div>
    </section>
  );
}

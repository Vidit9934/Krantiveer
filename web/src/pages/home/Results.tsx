import { SplitLines } from "../../motion/SplitLines";
import { Chart } from "../../components/Chart";
import { stats, story } from "../../data/proof";
import { PaperScene } from "../../motion/PaperScene";

/** One dominant figure and two quieter ones, then a single story. Figures are placeholders until confirmed. */
export function Results() {
  return (
    <PaperScene className="results" aria-labelledby="results-title" data-beat="5">
      <SplitLines as="h2" text="What a release can become." className="results__title" id="results-title" />
      <div className="results__grid">
        {stats.map((s, i) => (
          <figure key={s.label} className={`stat stat--${i}`}>
            <figcaption>
              <span className="stat__value">{s.value}</span>
              <span className="stat__label">
                <span className="hl hl--gold">{s.label}</span> {!s.confirmed && <span className="ph">placeholder</span>}
              </span>
            </figcaption>
            <Chart series={s.series} xLabel={s.xLabel} yLabel={s.yLabel} summary={s.yLabel + " by " + s.xLabel.toLowerCase() + ", rising to " + s.value + ". Placeholder data."} />
          </figure>
        ))}
      </div>
      <div className="results__story">
        <h3>{story.title}</h3>
        <p>
          {story.body} {!story.confirmed && <span className="ph">placeholder</span>}
        </p>
      </div>
    </PaperScene>
  );
}

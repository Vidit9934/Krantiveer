import { useState } from "react";
import { Icon } from "../../components/Icon";
import { quotes } from "../../data/proof";

/** One large quote at a time with previous and next. Placeholder quotes are tagged. */
export function Voices() {
  const [i, setI] = useState(0);
  const q = quotes[i];
  const go = (d: number) => setI((v) => (v + d + quotes.length) % quotes.length);
  return (
    <section className="voices" aria-label="What artists say">
      <figure key={i} className="voices__quote" aria-live="polite">
        <blockquote>{q.text}</blockquote>
        <figcaption>
          {q.who}, {q.role} {!q.confirmed && <span className="ph">placeholder quote</span>}
        </figcaption>
      </figure>
      <div className="voices__nav">
        <button type="button" onClick={() => go(-1)} aria-label="Previous quote" data-cursor="Prev">
          <Icon name="arrow" size={20} />
        </button>
        <span aria-hidden="true">
          {i + 1} / {quotes.length}
        </span>
        <button type="button" onClick={() => go(1)} aria-label="Next quote" data-cursor="Next">
          <Icon name="arrow" size={20} />
        </button>
      </div>
    </section>
  );
}

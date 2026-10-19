import { SplitLines } from "../../motion/SplitLines";
import { platforms, press, roster } from "../../data/proof";

/** Roster ribbon, platforms and press. Everything unconfirmed is tagged. Pauses on hover and focus. */
export function Proof() {
  const anyPlaceholder = roster.some((r) => !r.confirmed) || press.some((p) => !p.confirmed);
  const tiles = [...roster, ...roster];
  return (
    <section className="proof" aria-labelledby="proof-title">
      <div className="proof__head">
        <SplitLines as="h2" text="Artists who trusted the plan." className="proof__title" id="proof-title" />
        {anyPlaceholder && <span className="ph">placeholder names, to be replaced with approved artists</span>}
      </div>
      <div className="ribbon" tabIndex={0} aria-label="Artists KMF has worked with">
        <ul className="ribbon__track">
          {tiles.map((a, i) => (
            <li key={i} className="ribbon__tile" aria-hidden={i >= roster.length ? true : undefined}>
              <span className="ribbon__mono" aria-hidden="true">
                {a.name.charAt(0)}
              </span>
              <strong>{a.name}</strong>
              <span>{a.detail}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="proof__base">
        <p className="proof__label">Campaigns run on</p>
        <ul className="proof__list">
          {platforms.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <p className="proof__label">Featured in</p>
        <ul className="proof__list proof__list--press">
          {press.map((p, i) => (
            <li key={i}>
              {p.name} {!p.confirmed && <span className="ph">placeholder</span>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

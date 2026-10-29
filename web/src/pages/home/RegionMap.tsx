/* avoid-ai-design-ignore-file: SD5 (the highlighter chip on one headline word is the client's reference, AJ Marketing; DESIGN.md v3) */
import { useMemo, useState } from "react";
import { regions } from "../../data/site";

type P = [number, number];
/** Simplified outline, [lon, lat]. Hand-drawn and deliberately rough: the map is labelled Stylised. */
const OUTLINE: P[] = [
  [74, 37], [77, 35.6], [79, 34.5], [78.6, 32.6], [80, 30.5], [81, 30], [84, 28.6], [88, 27.6], [88.6, 26.6], [89.8, 26.8],
  [92, 27], [95, 28.2], [97.2, 28], [96, 27], [95, 26], [94, 24.4], [93.2, 22.6], [92.6, 24], [91.5, 25], [89.5, 25.4], [89, 22],
  [88.2, 21.6], [87, 21], [86.5, 20], [85, 19.5], [83, 17.6], [81.6, 16], [80.2, 15], [80, 13], [79.8, 11], [79.2, 10], [78, 8.6],
  [77.5, 8], [76.5, 9.5], [75.5, 11.5], [74.6, 14], [73.5, 16.6], [72.8, 19], [72.8, 21], [72.4, 21.6], [70.5, 21], [69, 22.3],
  [70, 23], [68.3, 23.7], [70, 24.6], [71, 25.6], [70, 27], [71, 28], [73, 30], [74.5, 31.6], [74, 33], [74, 35],
];
const X0 = 67.5;
const Y0 = 37.5;
const K = 3.9;
const proj = ([lon, lat]: P): P => [(lon - X0) * K, (Y0 - lat) * K];
const POLY = OUTLINE.map(proj);
const W = 120;
const H = 120;

function inside(x: number, y: number) {
  let c = false;
  for (let i = 0, j = POLY.length - 1; i < POLY.length; j = i++) {
    const [xi, yi] = POLY[i];
    const [xj, yj] = POLY[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

const PINS: Record<string, P> = {
  hindi: [78.5, 25.2],
  punjabi: [75.2, 31],
  haryanvi: [76.6, 29],
  bhojpuri: [84.6, 25.6],
  devotional: [78.4, 14.2],
};

/** Stylised dot-matrix India with a gold pin per language. Hover, focus or tap a pin for its name, script and note. */
export function RegionMap() {
  const [on, setOn] = useState(0);
  const dots = useMemo(() => {
    const out: P[] = [];
    for (let y = 1; y < H; y += 2.5) for (let x = 1; x < W; x += 2.5) if (inside(x, y)) out.push([x, y]);
    return out;
  }, []);
  const r = regions[on];
  return (
    <section className="map" aria-labelledby="map-title">
      <div className="map__copy">
        <p className="eyebrow">Regions</p>
        <h2 id="map-title">
          Five <span className="hl hl--gold">languages</span>. One plan.
        </h2>
        <div className="map__info" aria-live="polite">
          <p className="map__name">
            {r.name} <span lang="hi">{r.native}</span>
          </p>
          <p>{r.note}</p>
          <p className="mono map__plat">{r.platforms}</p>
        </div>
      </div>
      <div className="map__plot">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Stylised dot map of India with five language pins">
          {dots.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="0.55" />
          ))}
        </svg>
        {regions.map((g, i) => {
          const [x, y] = proj(PINS[g.slug] ?? [78, 22]);
          return (
            <button
              key={g.slug}
              type="button"
              className={`map__pin${on === i ? " is-on" : ""}`}
              style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` }}
              aria-label={`${g.name}, ${g.native}`}
              onPointerEnter={() => setOn(i)}
              onFocus={() => setOn(i)}
              onClick={() => setOn(i)}
            />
          );
        })}
        <span className="map__tag mono">Stylised</span>
      </div>
    </section>
  );
}

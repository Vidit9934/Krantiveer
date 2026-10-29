import { Link } from "react-router-dom";
import { Art } from "../../components/Art";
import { fanSlots } from "../../data/media";

/**
 * The curved fan of work cards that rises at the end of the hero scroll (Unfold's moment).
 * Pure markup: Hero.tsx owns the timeline and calls `placeFan` to put each card on the arc.
 */
export function HeroFan() {
  return (
    <div className="hf" data-hf aria-label="Selected work, placeholder covers">
      <div className="hf__arc">
        {fanSlots.map((slot, i) => (
          <Link key={slot} to="/work" className="hf__card" data-hf-card data-i={i} data-cursor="Open" aria-label={`Open work, ${slot}`} tabIndex={0}>
            <Art slot={slot} />
          </Link>
        ))}
      </div>
    </div>
  );
}

/** Angle and position of card `k` of `n` (centre card k = (n-1)/2) on an arc of radius `R`. */
export function placeFan(cards: HTMLElement[], R: number, step: number) {
  const n = cards.length;
  return cards.map((_, k) => {
    const a = ((k - (n - 1) / 2) * step * Math.PI) / 180;
    return { x: Math.sin(a) * R, y: (1 - Math.cos(a)) * R, rotation: (a * 180) / Math.PI, rotationY: -(a * 180) / Math.PI * 0.55, a };
  });
}

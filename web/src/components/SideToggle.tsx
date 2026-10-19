import { useSide } from "../context/SideContext";
import type { Side } from "../context/SideContext";

const options: { value: Side; label: string }[] = [
  { value: "a", label: "Artist" },
  { value: "b", label: "Label" },
];

/** Artist or Label: swaps the hero message and the calls to action. */
export function SideToggle() {
  const { side, setSide } = useSide();
  return (
    <div className="side-toggle" role="radiogroup" aria-label="I am an">
      <span className="side-toggle__thumb" style={{ transform: `translateX(${side === "a" ? 0 : 100}%)` }} aria-hidden="true" />
      {options.map((o) => (
        <button key={o.value} type="button" role="radio" aria-checked={side === o.value} onClick={() => setSide(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

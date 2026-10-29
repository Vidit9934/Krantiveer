import { SplitLines } from "../../motion/SplitLines";
import { Magnetic } from "../../motion/Magnetic";
import { SpinBadge } from "../../motion/SpinBadge";
import { useJoin } from "../../context/JoinContext";

/** Last scene: one sentence and one large round button. */
export function Close() {
  const { openJoin } = useJoin();
  return (
    <section className="close" aria-label="Join KMF" data-beat="6">
      <span className="close__disc" aria-hidden="true" />
      <SplitLines as="h2" text="Press your record." className="close__title" />
      <div className="close__row">
        <Magnetic strength={0.35}>
          <button type="button" className="close__btn" onClick={() => openJoin()} data-cursor="Join">
            Join KMF
          </button>
        </Magnetic>
        <SpinBadge text="Real listeners only · KMF-001" size={124} className="close__badge" />
      </div>
    </section>
  );
}

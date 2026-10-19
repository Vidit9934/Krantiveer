import { SplitLines } from "../../motion/SplitLines";
import { Magnetic } from "../../motion/Magnetic";
import { useJoin } from "../../context/JoinContext";

/** Last scene: one sentence and one large round button. */
export function Close() {
  const { openJoin } = useJoin();
  return (
    <section className="close" aria-label="Join KMF">
      <SplitLines as="h2" text="Press your record." className="close__title" />
      <Magnetic strength={0.35}>
        <button type="button" className="close__btn" onClick={() => openJoin()} data-cursor="Join">
          Join KMF
        </button>
      </Magnetic>
    </section>
  );
}

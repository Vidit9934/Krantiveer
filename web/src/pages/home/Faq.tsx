import { useState } from "react";
import { SplitLines } from "../../motion/SplitLines";
import { Icon } from "../../components/Icon";
import { faqs } from "../../data/proof";
import { PaperScene } from "../../motion/PaperScene";

/** Answers the doubts an artist has before they join. One open at a time. */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <PaperScene className="faq" aria-labelledby="faq-title">
      <SplitLines as="h2" text="Questions artists ask first." className="faq__title" id="faq-title" />
      <ul className="faq__list">
        {faqs.map((f, i) => (
          <li key={f.q} className={open === i ? "is-open" : ""}>
            <h3>
              <button type="button" aria-expanded={open === i} aria-controls={`faq-${i}`} onClick={() => setOpen(open === i ? null : i)} data-cursor={open === i ? "Close" : "Open"}>
                <span>{f.q}</span>
                <Icon name="plus" size={20} />
              </button>
            </h3>
            <div id={`faq-${i}`} className="faq__panel" role="region" aria-hidden={open !== i} inert={open !== i}>
              <p>{f.a}</p>
            </div>
          </li>
        ))}
      </ul>
    </PaperScene>
  );
}

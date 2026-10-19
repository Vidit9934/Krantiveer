import { site } from "../data/site";
import { Icon } from "./Icon";
import { Magnetic } from "../motion/Magnetic";

/** A small round button that opens out to show the number on hover. */
export function WhatsAppFab() {
  return (
    <div className="fab-wrap">
      <Magnetic strength={0.35}>
        <a className="fab" href={site.whatsappLink} target="_blank" rel="noreferrer" aria-label={`Chat on WhatsApp ${site.whatsappDisplay}`} data-cursor="Chat">
          <Icon name="whatsapp" size={22} />
          <span>{site.whatsappDisplay}</span>
        </a>
      </Magnetic>
    </div>
  );
}

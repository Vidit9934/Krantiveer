import { site } from "../data/site";
import { Button } from "./Button";
import { Modal } from "./Modal";

interface LoginPanelProps {
  open: boolean;
  onClose: () => void;
  onJoin: () => void;
}

/** There is no member area yet. This says so plainly and offers the two real ways forward. */
export function LoginPanel({ open, onClose, onJoin }: LoginPanelProps) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="login-title" className="dialog__panel--small">
      <h2 id="login-title">Member area opens soon</h2>
      <p className="muted">Until then, your KMF manager is one message away.</p>
      <div className="stack">
        <Button href={site.whatsappLink} external icon="whatsapp" block>
          Message us on WhatsApp
        </Button>
        <Button variant="secondary" block onClick={onJoin} data-autofocus>
          Join KMF
        </Button>
      </div>
    </Modal>
  );
}

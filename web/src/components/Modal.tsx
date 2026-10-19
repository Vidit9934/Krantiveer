import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { gsap } from "../motion/gsap";
import { prefersReducedMotion } from "../motion/env";
import { scrollControl } from "../motion/Smooth";
import { Icon } from "./Icon";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
  className?: string;
}

const focusable = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Focus-trapped dialog. Esc and the backdrop close it, focus returns to whatever opened it,
 * and page scrolling is locked while it is open.
 */
export function Modal({ open, onClose, labelledBy, children, className = "" }: ModalProps) {
  const panel = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    scrollControl.stop();
    document.documentElement.style.overflow = "hidden";

    const el = panel.current;
    if (el && !prefersReducedMotion()) {
      gsap.fromTo(backdrop.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
      gsap.fromTo(el, { autoAlpha: 0, y: 28, scale: 0.98 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" });
    }
    (el?.querySelector<HTMLElement>("[data-autofocus]") ?? el?.querySelector<HTMLElement>(focusable))?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !el) return;
      const items = [...el.querySelectorAll<HTMLElement>(focusable)].filter((n) => n.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      scrollControl.start();
      document.documentElement.style.overflow = "";
      opener?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="dialog" role="presentation">
      <div ref={backdrop} className="dialog__backdrop" onClick={onClose} />
      <div ref={panel} className={`dialog__panel ${className}`} role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
        <button type="button" className="dialog__close" onClick={onClose} aria-label="Close" data-cursor="Close">
          <Icon name="close" size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}

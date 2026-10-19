import { useSyncExternalStore } from "react";

const noMotionQuery = "(prefers-reduced-motion: reduce)";
const finePointerQuery = "(hover: hover) and (pointer: fine)";

export const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia(noMotionQuery).matches;
export const hasFinePointer = () => typeof window !== "undefined" && window.matchMedia(finePointerQuery).matches;

function subscribeTo(query: string) {
  return (callback: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener("change", callback);
    return () => mq.removeEventListener("change", callback);
  };
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribeTo(noMotionQuery), prefersReducedMotion, () => false);
}

/* ---- "ready" gate: the hero waits for the preloader before it reveals ---- */
let ready = false;
const listeners = new Set<() => void>();

export function setReady() {
  if (ready) return;
  ready = true;
  listeners.forEach((l) => l());
}

export function useReady() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => ready,
    () => true,
  );
}

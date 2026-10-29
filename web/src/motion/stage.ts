import { useSyncExternalStore } from "react";
import { prefersReducedMotion } from "./env";

/**
 * Shared state between the main bundle and the lazy 3D chunk. No three.js in here, so the
 * main bundle never pulls WebGL code in.
 *
 * tier:   full | light | static. Decided synchronously before the 3D chunk is requested.
 * ready:  the 3D stage has drawn its first real frame (the poster can leave).
 * progress: real loading progress for the preloader ring (fonts, chunk, first frame).
 */
export type StageTier = "full" | "light" | "static";

const MOTION_KEY = "kmf-motion";

function readMotionPref(): boolean {
  try {
    return localStorage.getItem(MOTION_KEY) !== "off";
  } catch {
    return true;
  }
}

/** WebGL2 is what three r163+ needs. Checked on a throwaway canvas before any 3D code loads. */
function hasWebGL2(): boolean {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function lowEnd(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const small = window.innerWidth < 900;
  const cores = nav.hardwareConcurrency ?? 8;
  const mem = nav.deviceMemory ?? 8;
  return coarse || small || cores <= 4 || mem <= 4;
}

let webgl: boolean | null = null;
let motionOn = typeof window !== "undefined" ? readMotionPref() : true;
let degraded: "none" | "light" | "static" = "none";

/** QA only: ?tier3d=full|light|static forces a tier so each can be checked on one machine. */
function forcedTier(): StageTier | null {
  const m = /[?&]tier3d=(full|light|static)/.exec(window.location.search);
  return m ? (m[1] as StageTier) : null;
}

function computeTier(): StageTier {
  if (typeof window === "undefined") return "static";
  const forced = forcedTier();
  if (forced === "static") return "static";
  if (prefersReducedMotion() || !motionOn || degraded === "static") return "static";
  if (webgl === null) webgl = hasWebGL2();
  if (!webgl) return "static";
  if (forced) return forced;
  if (degraded === "light" || lowEnd()) return "light";
  return "full";
}

let tier: StageTier = typeof window !== "undefined" ? computeTier() : "static";
let ready = false;
const progressParts = { fonts: 0, chunk: 0, loaders: 0, frame: 0 };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

function refresh() {
  const next = computeTier();  if (next !== tier) {
    tier = next;
    if (tier === "static") ready = false;
    emit();
  }
}

if (typeof window !== "undefined") {
  window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", refresh);
  document.fonts?.ready.then(() => setProgress("fonts", 1));
}

export const stage = {
  /** Context lost, load failed, or PerformanceMonitor gave up. */
  degrade(to: "light" | "static") {
    if (to === "static" || degraded === "none") degraded = to;
    refresh();
  },
  setMotion(on: boolean) {
    motionOn = on;
    try {
      localStorage.setItem(MOTION_KEY, on ? "on" : "off");
    } catch {
      /* storage blocked: the choice lasts for this page only */
    }
    if (on && degraded === "static") degraded = "none";
    refresh();
  },
  setReady(v: boolean) {
    if (ready === v) return;
    ready = v;
    emit();
  },
};

export function setProgress(part: keyof typeof progressParts, value: number) {
  const v = Math.max(progressParts[part], Math.min(1, value));
  if (v === progressParts[part]) return;
  progressParts[part] = v;
  emit();
}

/** 0..1. When the 3D stage is not going to run, fonts are the only thing to wait for. */
function getProgress(): number {
  if (tier === "static" || window.location.pathname !== "/") return progressParts.fonts;
  const p = progressParts;
  return p.fonts * 0.25 + p.chunk * 0.3 + (p.loaders || p.chunk) * 0.15 + p.frame * 0.3;
}

export const useStageTier = () => useSyncExternalStore(subscribe, () => tier, () => "static" as StageTier);
export const useStageReady = () => useSyncExternalStore(subscribe, () => ready, () => false);
export const useMotionOn = () => useSyncExternalStore(subscribe, () => motionOn, () => true);
export const useLoadProgress = () => useSyncExternalStore(subscribe, getProgress, () => 1);
export const getStageTier = () => tier;
/** The motion toggle only makes sense where the 3D stage could run at all. */
export const canMove = () => {
  if (typeof window === "undefined" || prefersReducedMotion()) return false;
  if (webgl === null) webgl = hasWebGL2();
  return webgl;
};

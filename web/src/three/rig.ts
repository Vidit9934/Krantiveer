/**
 * Beat poses for the turntable and the one mutable rig object the frame loop reads.
 * The scroll timeline writes into `rig`; nothing here allocates per frame.
 *
 * World: plinth top at y = 0, platter centre at PLATTER, tonearm pivot at PIVOT. Units are
 * roughly decimetres (a 12 inch record is 3.05 wide).
 */
export interface Pose {
  /** Camera position */
  cx: number;
  cy: number;
  cz: number;
  /** Look-at target */
  tx: number;
  ty: number;
  tz: number;
  /** Off-axis shift of the frame in NDC (moves the object on screen without changing perspective) */
  sx: number;
  sy: number;
  fov: number;
  /** Record spin, 1 = 33 1/3 rpm */
  spin: number;
  /** Tonearm: 0 on the rest, 1 at the lead-in, 2 well into the record */
  arm: number;
  /** Needle: 0 lifted, 1 in the groove */
  needle: number;
  /** Record lifted above the platter (world units) and its tilt about the x axis (radians) */
  lift: number;
  tilt: number;
  /** Lighting */
  env: number;
  key: number;
  rim: number;
  cone: number;
  dust: number;
  exposure: number;
  /** DOM scrims: `scrim` darkens the text side (left on wide screens), `veil` the whole frame. */
  scrim: number;
  veil: number;
}

export const PLATTER = { x: -0.55, z: 0.05 } as const;
export const PIVOT = { x: 1.85, z: -1.2 } as const;

type Layout = "wide" | "narrow";

const hero: Pose = {
  cx: 9.1, cy: 5.3, cz: 11.8,
  tx: 0.1, ty: -0.15, tz: 0,
  sx: 0.43, sy: -0.06, fov: 30,
  spin: 1, arm: 0, needle: 0, lift: 0, tilt: 0,
  env: 0.8, key: 1, rim: 0.15, cone: 1, dust: 1, exposure: 1, scrim: 0, veil: 0,
};

const quiet: Pose = {
  cx: 8.6, cy: 6.8, cz: 17,
  tx: 0, ty: 0, tz: 0,
  sx: 0.6, sy: -0.52, fov: 30,
  spin: 0, arm: 0, needle: 0, lift: 0, tilt: 0,
  env: 0.5, key: 0.55, rim: 0.1, cone: 0.15, dust: 0.2, exposure: 0.36, scrim: 0, veil: 0.35,
};

/* Six beats (data-beat 1..6): 1 hero, 2 dream, 3 quiet (services and work: the stage only dims behind
   opaque scenes), 4 reel (a macro fly-over of the grooves seen through the Reel window), 5 quiet again
   (stats, path, map, estimator, FAQ), 6 close. */
const reel: Pose = {
  cx: 0.6, cy: 0.55, cz: 2.3,
  tx: -1.05, ty: 0.02, tz: 0.35,
  sx: 0.0, sy: 0.0, fov: 26,
  spin: 2, arm: 1.85, needle: 1, lift: 0, tilt: 0,
  env: 1.7, key: 0.8, rim: 1.9, cone: 0.35, dust: 1, exposure: 1.08, scrim: 0, veil: 0,
};

const wide: Pose[] = [
  hero,
  // 2 Dream: a low dolly across the grooves; the record fills the lower half under the sentence.
  {
    cx: 2.6, cy: 1.55, cz: 5.6,
    tx: -0.75, ty: 0.05, tz: 0.1,
    sx: 0.0, sy: -0.42, fov: 30,
    spin: 1, arm: 1, needle: 1, lift: 0, tilt: 0,
    env: 1.3, key: 0.85, rim: 0.25, cone: 0.7, dust: 1, exposure: 0.92, scrim: 0, veil: 0.35,
  },
  // 3 Quiet: pulled back into the lower-right corner while the opaque scenes pass.
  quiet,
  // 4 Reel: macro fly-over of the grooves.
  reel,
  // 5 Quiet again.
  quiet,
  // 6 Close: the hero pose again, a little lower, beside "Join KMF".
  { ...hero, sx: 0.42, sy: -0.22, scrim: 0, veil: 0 },
];

/* Phones: the object stays smaller and lower (text runs full width), with more veil. */
const narrow: Pose[] = [
  { ...hero, cx: 15, cy: 8.8, cz: 19.5, sx: 0.0, sy: -0.5, fov: 30 },
  { ...wide[1], cx: 4.2, cy: 3.1, cz: 11.5, tx: -0.6, sx: 0.0, sy: -0.62, fov: 30, veil: 0.5 },
  { ...quiet, cx: 14, cy: 11, cz: 28, sx: 0.0, sy: -0.66, fov: 30, exposure: 0.3, veil: 0.5 },
  { ...reel, cx: 2.2, cy: 1.5, cz: 6.4, tx: -0.9, sx: 0.0, sy: 0.05, fov: 30 },
  { ...quiet, cx: 14, cy: 11, cz: 28, sx: 0.0, sy: -0.66, fov: 30, exposure: 0.3, veil: 0.5 },
  // Close on a phone: small, to the right of the round "Join KMF" button.
  { ...hero, cx: 28.5, cy: 16.7, cz: 37, sx: 0.44, sy: 0.17, fov: 30, veil: 0 },
];

/** The aspect each pose table was framed for; narrower screens pull the camera back to keep the object whole. */
export const REF_ASPECT = { wide: 1.6, narrow: 0.46 } as const;

export const layoutFor = (w: number, h: number): Layout => (w / h < 0.95 || w < 760 ? "narrow" : "wide");
export const posesFor = (layout: Layout) => (layout === "narrow" ? narrow : wide);
export const BEATS = wide.length;

/** The live rig. Starts at the hero pose. */
/** `intro` (1 to 0) is the arrival dolly after the preloader; `flip` is 0 for Side A, PI for Side B. */
/** `veilBoost`: extra veil a dense scene asks for with data-veil (proof, results), damped. */
/** `fade` (0..1) hides the stage as the footer comes up, so nothing shows through its links. */
/** `recede` (0..1): the hero scroll pushes the turntable back and dims it while the card fan rises; it fades out as beat 2 begins.
    `iArm`, `iNeedle`, `iSpin`, `iCone`: the arrival timeline (Stage.tsx Driver); at rest 0, 0, 1, 1. */
export const rig: Pose & { beat: number; flip: number; intro: number; veilBoost: number; fade: number; recede: number; iArm: number; iNeedle: number; iSpin: number; iCone: number } = {
  ...hero,
  beat: 0,
  flip: 0,
  intro: 1,
  veilBoost: 0,
  fade: 0,
  recede: 0,
  iArm: 0,
  iNeedle: 0,
  iSpin: 1,
  iCone: 1,
};

/**
 * Our own "invalidate": the canvas runs frameloop="never" and is advanced from the GSAP
 * ticker; this flags that the next tick must draw even if nothing is spinning.
 */
const frame = { dirty: 2 };
export const invalidate = (frames = 1) => {
  frame.dirty = Math.max(frame.dirty, frames);
};
export const consumeDirty = () => {
  if (frame.dirty <= 0) return false;
  frame.dirty--;
  return true;
};

/** Pointer target in -1..1, written by a listener and damped in the frame loop. */
export const pointer = { x: 0, y: 0 };

/** Set by the frame loop: true while something moves, so the ticker keeps drawing. */
export const moving = { value: true };

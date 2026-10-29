import * as THREE from "three";

/**
 * Every texture here is generated at runtime from code. No image files, no licences.
 *
 * The vinyl and the strobe ring use polar UVs (u = angle, v = radius), so a groove is a
 * straight line in texture space: the groove maps are tiny (8 x N) and never alias around the
 * circumference, and the derivative-based tangent frame runs along the groove, which is what
 * the anisotropic sheen needs.
 */

export const VINYL = {
  /** Inner edge of the grooved ring (hidden under the label edge). */
  rIn: 0.49,
  rOut: 1.524,
  label: 0.5,
  thickness: 0.026,
} as const;

/** Track gaps (radius in world units) on the playing surface, wide enough to read as bands. */
const TRACK_GAPS = [0.74, 0.9, 1.03, 1.17, 1.29, 1.39];

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

/** Small deterministic noise so every load presses the same record. */
function rand(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function dataTex(c: HTMLCanvasElement, maxAniso: number, colour = false) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = colour ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.ClampToEdgeWrapping;
  t.anisotropy = maxAniso;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.needsUpdate = true;
  return t;
}

interface GrooveZone {
  /** 0 smooth (land, lead-out, gaps), 1 full groove. */
  groove: number;
  /** Groove pitch in pixels. */
  pitch: number;
}

function zoneAt(r: number, wobble: number): GrooveZone {
  if (r < 0.6) return { groove: 0, pitch: 4 }; // lead-out: polished, wide spiral
  if (r > 1.5) return { groove: 0, pitch: 4 }; // edge land
  if (r > 1.455) return { groove: 0.55, pitch: 9 }; // lead-in: coarse pitch
  for (const g of TRACK_GAPS) if (Math.abs(r - g) < 0.0085) return { groove: 0.12, pitch: 10 };
  // Loud passages press wider grooves: a slow wobble in pitch and depth between tracks.
  return { groove: 0.75 + wobble * 0.25, pitch: 3 + Math.round(wobble * 2) };
}

/**
 * Groove maps for the vinyl ring.
 * normal: tangent-space normal tilting across the groove (bitangent = radial direction).
 * rough:  green channel multiplies roughness (gaps are glossier than grooves).
 * aniso:  red/green = direction in tangent space, blue = strength.
 */
export function makeGrooveMaps(height: number, maxAniso: number) {
  const W = 8;
  const n = canvas(W, height);
  const r = canvas(W, height);
  const a = canvas(W, height);
  const nd = n.getContext("2d")!.createImageData(W, height);
  const rd = r.getContext("2d")!.createImageData(W, height);
  const ad = a.getContext("2d")!.createImageData(W, height);
  const rnd = rand(7);
  let wobble = 0.5;
  let phase = 0;
  for (let y = 0; y < height; y++) {
    // Canvas row 0 is the top of the image, which three maps to v = 1 (flipY).
    const v = 1 - (y + 0.5) / height;
    const radius = VINYL.rIn + v * (VINYL.rOut - VINYL.rIn);
    if (y % 24 === 0) wobble = Math.min(1, Math.max(0, wobble + (rnd() - 0.5) * 0.5));
    const z = zoneAt(radius, wobble);
    phase += (Math.PI * 2) / z.pitch;
    const tilt = Math.sin(phase) * 0.2 * z.groove;
    const nx = 0;
    const ny = tilt;
    const nz = Math.sqrt(Math.max(0, 1 - ny * ny));
    const rough = 0.45 + 0.55 * z.groove; // multiplies material.roughness: gaps glossier, so they read as darker bands
    const strength = 0.25 + 0.75 * z.groove;
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      nd.data[i] = (nx * 0.5 + 0.5) * 255;
      nd.data[i + 1] = (ny * 0.5 + 0.5) * 255;
      nd.data[i + 2] = (nz * 0.5 + 0.5) * 255;
      nd.data[i + 3] = 255;
      rd.data[i] = 255;
      rd.data[i + 1] = rough * 255;
      rd.data[i + 2] = 255;
      rd.data[i + 3] = 255;
      // Direction (0, 1): along the bitangent (radial), so the highlight streaks across the grooves.
      ad.data[i] = 0.5 * 255;
      ad.data[i + 1] = 1 * 255;
      ad.data[i + 2] = strength * 255;
      ad.data[i + 3] = 255;
    }
  }
  n.getContext("2d")!.putImageData(nd, 0, 0);
  r.getContext("2d")!.putImageData(rd, 0, 0);
  a.getContext("2d")!.putImageData(ad, 0, 0);
  return { normal: dataTex(n, maxAniso), rough: dataTex(r, maxAniso), aniso: dataTex(a, maxAniso) };
}

/** Polar strobe ring on the platter rim: three rows of polished dots on brushed aluminium. */
export function makeStrobeMap(maxAniso: number) {
  const W = 2048;
  const H = 64;
  const c = canvas(W, H);
  const g = c.getContext("2d")!;
  g.fillStyle = "#3a3733";
  g.fillRect(0, 0, W, H);
  // Brushed finish: faint lines along the circumference.
  const rnd = rand(11);
  for (let y = 0; y < H; y++) {
    g.fillStyle = `rgba(255,255,255,${0.015 + rnd() * 0.03})`;
    g.fillRect(0, y, W, 1);
  }
  const rows = [
    { v: 0.24, count: 216 },
    { v: 0.5, count: 200 },
    { v: 0.76, count: 180 },
  ];
  // The ring is about 9.9 units around and 0.09 across, so a round dot is a tall ellipse here.
  const pxPerUnitU = W / (2 * Math.PI * 1.575);
  const pxPerUnitV = H / 0.09;
  const d = 0.013;
  for (const row of rows) {
    for (let k = 0; k < row.count; k++) {
      const x = ((k + 0.5) / row.count) * W;
      const y = row.v * H;
      g.beginPath();
      g.ellipse(x, y, d * pxPerUnitU, d * pxPerUnitV, 0, 0, Math.PI * 2);
      g.fillStyle = "#cfcac2";
      g.fill();
    }
  }
  return dataTex(c, maxAniso, true);
}

function arcText(g: CanvasRenderingContext2D, text: string, cx: number, cy: number, radius: number, start: number, spacing: number) {
  let angle = start;
  for (const ch of text) {
    const w = g.measureText(ch).width;
    angle += w / 2 / radius;
    g.save();
    g.translate(cx + Math.cos(angle - Math.PI / 2) * radius, cy + Math.sin(angle - Math.PI / 2) * radius);
    g.rotate(angle);
    g.fillText(ch, 0, 0);
    g.restore();
    angle += (w / 2 + spacing) / radius;
  }
}

export interface LabelSpec {
  side: "a" | "b";
  caption: string;
  catalogue: string;
  title: string;
}

/**
 * A record label in two canvases: colour, and a mask for roughness (G) and metalness (B), so the
 * ink is matte and the foil is metal. Side A is spun gold metal with dark ink; Side B is black
 * lacquer with gold foil. Drawn in Bricolage Grotesque and DM Mono, which must be loaded first.
 */
export function makeLabel(spec: LabelSpec, size: number, maxAniso: number) {
  const colour = canvas(size, size);
  const mask = canvas(size, size);
  const gc = colour.getContext("2d")!;
  const gm = mask.getContext("2d")!;
  const c = size / 2;
  const R = size / 2;
  const gold = spec.side === "a";

  // ---- base ----
  if (gold) {
    const base = gc.createRadialGradient(c * 0.8, c * 0.7, 0, c, c, R);
    base.addColorStop(0, "#f0d999");
    base.addColorStop(0.55, "#cfa955");
    base.addColorStop(1, "#9a7633");
    gc.fillStyle = base;
  } else {
    gc.fillStyle = "#0d0b09";
  }
  gc.fillRect(0, 0, size, size);
  // Spun finish: fine concentric rings of slightly different value.
  const rnd = rand(gold ? 3 : 5);
  for (let r = 4; r < R; r += 1.5) {
    const l = rnd();
    gc.strokeStyle = gold ? `rgba(${l > 0.5 ? "255,240,200" : "90,60,20"},${0.04 + rnd() * 0.06})` : `rgba(255,255,255,${0.008 + rnd() * 0.018})`;
    gc.lineWidth = 1;
    gc.beginPath();
    gc.arc(c, c, r, 0, Math.PI * 2);
    gc.stroke();
  }
  // Mask base: the gold side is metallic ink on paper (semi-metal, so the key light still reads
  // on it); the black side is glossy lacquer (B=0).
  gm.fillStyle = gold ? "rgb(255, 118, 150)" : "rgb(255, 70, 0)";
  gm.fillRect(0, 0, size, size);

  const ink = gold ? "#1b1309" : "#d9b766";
  const inkMask = gold ? "rgb(255, 200, 0)" : "rgb(255, 100, 190)";
  const draw = (g: CanvasRenderingContext2D, fill: string) => {
    g.fillStyle = fill;
    g.strokeStyle = fill;
    g.textAlign = "center";
    g.textBaseline = "middle";
    // Rings
    g.lineWidth = size * 0.0028;
    g.beginPath();
    g.arc(c, c, R * 0.93, 0, Math.PI * 2);
    g.stroke();
    g.lineWidth = size * 0.0014;
    g.beginPath();
    g.arc(c, c, R * 0.7, 0, Math.PI * 2);
    g.stroke();
    // Circular caption
    g.font = `500 ${size * 0.03}px "DM Mono", monospace`;
    const cap = spec.caption;
    let total = 0;
    for (const ch of cap) total += g.measureText(ch).width + size * 0.006;
    const radius = R * 0.81;
    arcText(g, cap, c, c, radius, -total / radius / 2, size * 0.006);
    // Title
    g.font = `700 ${size * 0.19}px "Bricolage Grotesque Variable", sans-serif`;
    g.fillText(spec.title, c, c - R * 0.3);
    g.font = `400 ${size * 0.058}px "Bricolage Grotesque Variable", sans-serif`;
    g.fillText(gold ? "Side A" : "Side B", c, c + R * 0.27);
    g.font = `400 ${size * 0.028}px "DM Mono", monospace`;
    g.fillText(spec.catalogue, c + R * 0.44, c + R * 0.02);
    g.fillText("33 1/3", c - R * 0.44, c + R * 0.02);
    // Thin rule under the title
    g.fillRect(c - R * 0.2, c - R * 0.08, R * 0.4, size * 0.0016);
  };
  draw(gc, ink);
  draw(gm, inkMask);
  // Spindle hole
  for (const g of [gc, gm]) {
    g.fillStyle = "#000";
    g.beginPath();
    g.arc(c, c, R * 0.06, 0, Math.PI * 2);
    g.fill();
  }

  const map = new THREE.CanvasTexture(colour);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = maxAniso;
  const maskTex = new THREE.CanvasTexture(mask);
  maskTex.colorSpace = THREE.NoColorSpace;
  maskTex.anisotropy = maxAniso;
  return { map, mask: maskTex };
}

/** Wait for the label face so the canvas never bakes a fallback serif. */
export async function labelFontsReady() {
  try {
    await Promise.all([
      document.fonts.load('700 40px "Bricolage Grotesque Variable"'),
      document.fonts.load('400 40px "Bricolage Grotesque Variable"'),
      document.fonts.load('500 40px "DM Mono"'), document.fonts.load('400 40px "DM Mono"'),
    ]);
  } catch {
    /* draw with the fallback rather than not at all */
  }
}

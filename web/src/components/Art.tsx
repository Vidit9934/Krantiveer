import { useEffect, useRef } from "react";
import { media } from "../data/media";
import type { MediaSlot } from "../data/media";

function rand(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const TONES = {
  gold: { bg: "#c9a24b", bg2: "#ecd493", ink: "#0b0a08", line: "#0b0a08", accent: "#0b0a08" },
  black: { bg: "#14110e", bg2: "#070605", ink: "#efe8da", line: "#c9a24b", accent: "#c9a24b" },
  paper: { bg: "#f4f0e8", bg2: "#e9e3d6", ink: "#0b0a08", line: "#7a5a1e", accent: "#7a5a1e" },
} as const;

interface ArtProps {
  /** A slot key from data/media.ts, or a slot object. */
  slot: string | MediaSlot;
  className?: string;
  /** Show the Placeholder tag on generated art. Default true; always shown for generated art in work scenes. */
  tag?: boolean;
  /** Autoplay the slot's video when it has one and is on screen. */
  playVideo?: boolean;
  /** Fill the parent (object-fit cover). Default true. */
  fill?: boolean;
}

/**
 * One image slot. A real photo or video when the manifest has one, otherwise deterministic generated
 * cover art in the site palette (record, rings, sleeve lines, level bars), tagged Placeholder so it is
 * never mistaken for real work.
 */
export function Art({ slot, className = "", tag = true, playVideo = true, fill = true }: ArtProps) {
  const s = typeof slot === "string" ? media[slot] : slot;
  const vid = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = vid.current;
    if (!v || !playVideo) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? void v.play().catch(() => {}) : v.pause()), { threshold: 0.2 });
    io.observe(v);
    return () => io.disconnect();
  }, [playVideo, s?.video]);

  if (!s) return null;
  const cls = `art${fill ? " art--fill" : ""} ${className}`;

  if (s.video) {
    return (
      <div className={cls}>
        <video ref={vid} src={s.video} poster={s.poster ?? s.src} muted loop playsInline preload="metadata" aria-label={s.alt ?? s.title} />
      </div>
    );
  }
  if (s.src) {
    return (
      <div className={cls}>
        <img src={s.src} alt={s.alt ?? s.title} loading="lazy" decoding="async" />
      </div>
    );
  }

  const t = TONES[s.tone];
  const r = rand(s.seed);
  const cx = 28 + r() * 44;
  const cy = 30 + r() * 14;
  const rad = 20 + r() * 10;
  const bars = Array.from({ length: 26 }, () => 10 + r() * 62);
  const gid = `g${s.id.replace(/[^a-z0-9]/gi, "")}`;
  // Wrap the title onto at most two lines of about 16 characters, so no title is ever cut off.
  const titleLines: string[] = [];
  for (const w of s.title.split(" ")) {
    const last = titleLines[titleLines.length - 1];
    if (last !== undefined && (last + " " + w).length <= 16) titleLines[titleLines.length - 1] = last + " " + w;
    else titleLines.push(w);
  }
  titleLines.length = Math.min(titleLines.length, 2);
  return (
    <div className={cls} data-tone={s.tone}>
      <svg viewBox="0 0 100 125" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${s.title}, placeholder cover art`}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={t.bg2} />
            <stop offset="1" stopColor={t.bg} />
          </linearGradient>
        </defs>
        <rect width="100" height="125" fill={`url(#${gid})`} />
        {[1, 0.74, 0.5].map((k, i) => (
          <circle key={i} cx={cx} cy={cy} r={rad * k} fill="none" stroke={t.line} strokeOpacity={0.5 - i * 0.12} strokeWidth="0.35" />
        ))}
        <circle cx={cx} cy={cy} r={rad * 0.3} fill={s.tone === "gold" ? t.ink : t.accent} />
        <circle cx={cx} cy={cy} r="1.3" fill={s.tone === "black" ? "#070605" : t.bg} />
        {bars.map((h, i) => (
          <rect key={i} x={5 + i * 3.6} y={118 - h * 0.34} width="1.8" height={h * 0.34} fill={t.accent} opacity={0.3 + (h / 72) * 0.6} />
        ))}
        <text x="6" y="74" fontFamily="DM Mono, monospace" fontSize="3.4" fill={t.ink} opacity="0.75">
          {`KMF-${String(s.seed).padStart(3, "0")}`}
        </text>
        <text x="6" y="84" fontFamily="Bricolage Grotesque Variable, sans-serif" fontWeight="700" fontSize="7.4" fill={t.ink} letterSpacing="-0.3">
          {titleLines.map((ln, i) => (
            <tspan key={i} x="6" dy={i === 0 ? 0 : 8.4}>
              {ln}
            </tspan>
          ))}
        </text>
      </svg>
      {tag && <span className="art__tag">Placeholder</span>}
    </div>
  );
}

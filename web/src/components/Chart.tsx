import { useRef } from "react";
import { gsap, useGSAP } from "../motion/gsap";
import { prefersReducedMotion } from "../motion/env";

interface ChartProps {
  series: { x: string; y: number }[];
  xLabel: string;
  yLabel: string;
  /** Plain-language summary for screen readers. */
  summary: string;
}

const W = 360;
const H = 220;
const M = { top: 14, right: 14, bottom: 52, left: 50 };

/** Rounds a maximum up to the next clean value so the four gridline steps read as round numbers. */
function niceMax(v: number): number {
  const pow = 10 ** Math.floor(Math.log10(v));
  const n = v / pow;
  const step = [1, 1.2, 1.6, 2, 2.4, 3, 4, 5, 6, 8, 10].find((s) => s >= n) ?? 10;
  return step * pow;
}

const fmt = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));

/** A small line chart with real x and y axes, gridlines, tick labels and axis titles. The line draws in on scroll. */
export function Chart({ series, xLabel, yLabel, summary }: ChartProps) {
  const root = useRef<SVGSVGElement>(null);
  const max = niceMax(Math.max(...series.map((p) => p.y)));
  const ticks = [0, 1, 2, 3, 4].map((i) => (max / 4) * i);
  const iw = W - M.left - M.right;
  const ih = H - M.top - M.bottom;
  const x = (i: number) => M.left + (i / (series.length - 1)) * iw;
  const y = (v: number) => M.top + ih - (v / max) * ih;
  const line = series.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(p.y).toFixed(1)}`).join(" ");
  const area = `${line} L${x(series.length - 1)} ${y(0)} L${x(0)} ${y(0)} Z`;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const trigger = { trigger: root.current, start: "top 85%", once: true };
      gsap.fromTo("[data-line]", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut", scrollTrigger: trigger });
      gsap.fromTo("[data-area]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.4, delay: 0.5, scrollTrigger: trigger });
      gsap.fromTo("[data-dot]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, stagger: 0.18, ease: "power2.out", scrollTrigger: trigger });
    },
    { scope: root },
  );

  return (
    <svg ref={root} className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={summary}>
      <defs>
        <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9a24b" stopOpacity="0.28" />
          <stop offset="1" stopColor="#c9a24b" stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((t) => (
        <g key={t}>
          <line className="chart__grid" x1={M.left} x2={W - M.right} y1={y(t)} y2={y(t)} />
          <text className="chart__tick" x={M.left - 8} y={y(t) + 4} textAnchor="end">
            {fmt(t)}
          </text>
        </g>
      ))}
      <line className="chart__axis" x1={M.left} x2={M.left} y1={M.top} y2={y(0)} />
      <line className="chart__axis" x1={M.left} x2={W - M.right} y1={y(0)} y2={y(0)} />
      {series.map((p, i) => (
        <text key={p.x} className="chart__tick" x={x(i)} y={y(0) + 16} textAnchor="middle">
          {p.x}
        </text>
      ))}
      <text className="chart__title" x={M.left + iw / 2} y={H - 8} textAnchor="middle">
        {xLabel}
      </text>
      <text className="chart__title" transform={`translate(12 ${M.top + ih / 2}) rotate(-90)`} textAnchor="middle">
        {yLabel}
      </text>
      <path data-area d={area} fill="url(#chart-fill)" />
      <path data-line d={line} pathLength={1} className="chart__line" />
      {series.map((p, i) => (
        <circle key={p.x} data-dot className="chart__dot" cx={x(i)} cy={y(p.y)} r="3.5" />
      ))}
    </svg>
  );
}

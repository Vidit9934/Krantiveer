import type { SVGProps } from "react";

/**
 * KMF's own icon set: 1.5px strokes, square caps, drawn on a 24px grid.
 * Chosen for meaning and kept small. No tinted chips around them.
 */
const paths = {
  whatsapp: "M4 20l1.3-4.2A8 8 0 1 1 8.4 18.8L4 20zm5-11c0 3 3 6 6 6l1.2-1.4-2-1-1 .6c-.8-.4-1.600-1.200-2-2l.6-1-1-2L9 9z",
  team: "M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8 1a2.500 2.500 0 1 0 0-5 2.500 2.500 0 0 0 0 5zM2.500 19c.4-3 2.700-5 5.500-5s5.100 2 5.500 5M14 14.500c3 0 5.300 1.300 7 4.500",
  arrow: "M5 12h13m-5-5 5 5-5 5",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6 6 18",
  check: "M5 12.500 10 17.500 19 7",
  play: "M8 5.500v13l11-6.500z",
  plus: "M12 5v14M5 12h14",
  lock: "M6 11h12v9H6zM8.500 11V8a3.500 3.500 0 0 1 7 0v3",
  wave: "M3 12h2m3-5v10m3-8v6m3-9v12m3-8v4m3-2h2",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  chart: "M4 20V4m0 16h16M8 16v-4m4 4V8m4 8v-6",
  doc: "M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6",
  link: "M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1M14 10a4 4 0 0 0-5.700 0l-3 3a4 4 0 0 0 5.700 5.700l1-1",
  mic: "M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM6 11a6 6 0 0 0 12 0M12 17v4",
  rupee: "M7 5h10M7 9h10M7 5c5 0 7 2 7 4s-2 4-7 4l7 6",
  shield: "M12 3l8 3v6c0 4.500-3.300 8-8 9-4.700-1-8-4.500-8-9V6z",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20c.8-4 4-6 8-6s7.200 2 8 6",
  down: "M6 9l6 6 6-6",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2",
  external: "M14 4h6v6M20 4l-9 9M18 14v6H4V6h6",
  notch: "M12 2v7M12 15v7M2 12h7M15 12h7",
} as const;

export type IconName = keyof typeof paths;

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 20, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={paths[name]} />
    </svg>
  );
}

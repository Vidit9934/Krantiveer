interface CoverProps {
  seed: number;
  label?: string;
  className?: string;
}

function rand(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/** Generated placeholder artwork. Always tagged, never presented as a real release. */
export function Cover({ seed, label = "Placeholder", className = "" }: CoverProps) {
  const r = rand(seed);
  const bars = Array.from({ length: 22 }, () => 12 + r() * 70);
  const cx = 30 + r() * 40;
  return (
    <figure className={`cover ${className}`}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${label} cover art`}>
        <rect width="100" height="100" fill="var(--surface-2)" />
        <circle cx={cx} cy="38" r="26" fill="none" stroke="var(--bronze)" strokeWidth="0.4" />
        <circle cx={cx} cy="38" r="18" fill="none" stroke="var(--bronze)" strokeWidth="0.4" />
        <circle cx={cx} cy="38" r="9" fill="var(--gold)" />
        <circle cx={cx} cy="38" r="1.4" fill="var(--ground)" />
        {bars.map((h, i) => (
          <rect key={i} x={6 + i * 4.2} y={100 - 6 - h * 0.3} width="2" height={h * 0.3} fill="var(--gold)" opacity={0.25 + (h / 82) * 0.6} />
        ))}
      </svg>
      <figcaption className="cover__tag">{label}</figcaption>
    </figure>
  );
}

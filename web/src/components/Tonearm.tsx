/**
 * Tonearm resting on the record. Its pose is driven by the Hero scene (data-arm), which
 * sweeps it a few degrees as you scroll; everywhere else it holds the resting pose.
 */
export function Tonearm() {
  return (
    <svg className="tonearm" viewBox="0 0 220 320" fill="none" aria-hidden="true">
      <g className="tonearm__arm" data-arm>
        <path d="M190 40 L190 74 C190 158 122 206 76 262" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" />
        <path d="M190 40 L190 74 C190 158 122 206 76 262" stroke="var(--gold-hi)" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
        <path d="M64 252 L88 246 L84 272 L66 276 Z" fill="var(--surface-3)" stroke="var(--gold)" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="75" cy="272" r="2.5" fill="var(--gold-hi)" />
        <circle cx="190" cy="14" r="9" fill="var(--surface-3)" stroke="var(--bronze)" strokeWidth="1.5" />
      </g>
      <circle cx="190" cy="40" r="20" fill="var(--surface-2)" stroke="var(--gold)" strokeWidth="1.5" />
      <circle cx="190" cy="40" r="7" fill="var(--gold)" />
    </svg>
  );
}

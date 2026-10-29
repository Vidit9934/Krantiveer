# KMF Media

Frontend for KMF Media, an Indian music-marketing agency, in `web/` (React + Vite + TypeScript, plain CSS tokens, mock data only, no backend).

## Start here for any design or UI work

1. Use the `premium-interactive-web` skill (`.claude/skills/premium-interactive-web/`) together with `avoid-ai-design`. Read both fully, including their `references/`. For delegated work use the `premium-web-designer` agent (`.claude/agents/`). Any 3D / WebGL / Three.js brief goes to the same agent and also requires `references/3d-web.md`.
2. `web/DESIGN.md` is the design contract. Update it before changing the look; do not drift from it.
3. The user wants a **premium, subtle, classic, interactive** site that also **persuades artists to enroll**. Display type stays sparse (about 12 words per scene), but minimal is not empty: the conversion layer (proof, path, estimator, FAQ, repeated CTA) is required. See `references/conversion-patterns.md`.
4. **Navigation:** solid opaque bar, always visible, every destination reachable, **Log in / Sign up on the right**. No login portals or account screens exist: Sign up opens a 60-second "Join KMF" enrollment form (nothing stored, WhatsApp handoff), Log in opens an "opens soon" panel.
5. **Proof content** (artists, numbers, quotes) lives in `web/src/data/proof.ts` with a `confirmed` flag. Unconfirmed items show a Placeholder tag. Never invent a real person, company or statistic.

## Decisions that are fixed

- **English only.** No Hindi, no language toggle.
- Black and gold identity and the **rotating record** come from the user's mockup (`document/KMFheroUI1 (1).png`) and stay. On home the record is the 3D turntable in `web/src/three/`.
- Type is **Bricolage Grotesque Variable** (display and UI; its weight/width axes drive the reactive type) plus **DM Mono** for record-label details only. The client rejected Cormorant Garamond (Oct 2026); Manrope was retired with it. Bodoni and Schibsted Grotesk were disliked earlier.
- **v3 "Sleek"** (see `web/DESIGN.md`): smaller, heavier, tighter type (hero at most about 4.5rem, weight 700), gold as the single accent, an image in every scene via `components/Art.tsx` and `data/media.ts` (real files in `web/public/media/` override generated Placeholder art), four 3D beats.
- Palette: black and gold, plus warm-white **paper** scenes (`--paper`, `--gold-deep` for gold text on paper). The 3D turntable on home stays.
- Never invent real artist names, logos or statistics. Use visible "Placeholder" / "To confirm" tags. The "2,000+ artists" figure is from the mockup and is labelled.
- The marketplace rule: labels never see creator rates; creators never see budgets; the label budget bar is rounded.

## Commands

- Run: `cd web && npm run dev` (port 5173). Build: `npm run build`. Types: `npx tsc -b`.
- Scanner: `node .claude/skills/avoid-ai-design/scripts/detect.mjs web/src`.
- Verify visually with a scripted scroll and screenshots, not only the scanner.

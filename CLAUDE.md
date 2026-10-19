# KMF Media

Frontend for KMF Media, an Indian music-marketing agency, in `web/` (React + Vite + TypeScript, plain CSS tokens, mock data only, no backend).

## Start here for any design or UI work

1. Use the `premium-interactive-web` skill (`.claude/skills/premium-interactive-web/`) together with `avoid-ai-design`. Read both fully, including their `references/`. For delegated work use the `premium-web-designer` agent (`.claude/agents/`).
2. `web/DESIGN.md` is the design contract. Update it before changing the look; do not drift from it.
3. The user wants a **premium, subtle, classic, interactive** site that also **persuades artists to enroll**. Display type stays sparse (about 12 words per scene), but minimal is not empty: the conversion layer (proof, path, estimator, FAQ, repeated CTA) is required. See `references/conversion-patterns.md`.
4. **Navigation:** solid opaque bar, always visible, every destination reachable, **Log in / Sign up on the right**. No login portals or account screens exist: Sign up opens a 60-second "Join KMF" enrollment form (nothing stored, WhatsApp handoff), Log in opens an "opens soon" panel.
5. **Proof content** (artists, numbers, quotes) lives in `web/src/data/proof.ts` with a `confirmed` flag. Unconfirmed items show a Placeholder tag. Never invent a real person, company or statistic.

## Decisions that are fixed

- **English only.** No Hindi, no language toggle.
- Black and gold identity and the **rotating record** come from the user's mockup (`document/KMFheroUI1 (1).png`) and stay.
- Display type is Cormorant Garamond (light), UI type is Manrope. The user disliked Bodoni and Schibsted Grotesk.
- Never invent real artist names, logos or statistics. Use visible "Placeholder" / "To confirm" tags. The "2,000+ artists" figure is from the mockup and is labelled.
- The marketplace rule: labels never see creator rates; creators never see budgets; the label budget bar is rounded.

## Commands

- Run: `cd web && npm run dev` (port 5173). Build: `npm run build`. Types: `npx tsc -b`.
- Scanner: `node .claude/skills/avoid-ai-design/scripts/detect.mjs web/src`.
- Verify visually with a scripted scroll and screenshots, not only the scanner.

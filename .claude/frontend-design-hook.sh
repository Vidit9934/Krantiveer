#!/bin/bash
# Fires on PreToolUse/Edit|Write — reminds about the "frontend-design" skill's
# design-quality bar whenever a UI file (component/page/style/markup) in ANY
# frontend project is about to be created/edited. The tunefry-frontend repo gets
# its repo-specific conventions appended. Companion to frontend-integration-hook.sh
# (API wiring, tunefry-only); this one covers visual/aesthetic quality.

input=$(cat)

parsed=$(echo "$input" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
except Exception:
    d = {}
print(d.get('tool_name', ''))
print(d.get('tool_input', {}).get('file_path', ''))
" 2>/dev/null)

if [[ -n "$parsed" ]]; then
  tool=$(echo "$parsed" | sed -n '1p')
  file=$(echo "$parsed" | sed -n '2p')
else
  tool=$(echo "$input" | grep -o '"tool_name"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"\([^"]*\)".*/\1/')
  file=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"\([^"]*\)".*/\1/')
fi

if [[ "$tool" != "Edit" && "$tool" != "Write" ]]; then
  exit 0
fi

norm=$(echo "$file" | tr '\\' '/' | tr '[:upper:]' '[:lower:]')

# Skip dependencies, build output and tooling folders.
case "$norm" in
  */node_modules/*|*/dist/*|*/build/*|*/.claude/*|*/.git/*|*/scratchpad/*) exit 0 ;;
esac

# Only UI-bearing files — skip lib/ services and config where aesthetics don't apply.
case "$norm" in
  *.jsx|*.tsx|*.css|*.scss|*.html|*.vue|*.svelte) ;;
  *) exit 0 ;;
esac

if [[ "$norm" == *"tunefry frontend"* ]]; then
  export DESIGN_REPO_RULE="Styling in this repo is component-scoped CSS under src/styles/ (no UI library, no Motion/Framer - keep motion CSS-only) - stay consistent with that convention, do not introduce Tailwind/MUI/etc. without asking."
else
  export DESIGN_REPO_RULE="Follow the styling convention already used in this project (tokens as CSS variables, plain CSS vs. a library) - do not introduce a UI library without asking."
fi

python3 -c "
import json, os
reason = '''FRONTEND DESIGN QUALITY CHECKLIST for this file (frontend-design skill):
1. Ground the design in the subject matter (its audience, materials, vernacular) and commit to ONE bold aesthetic direction before coding - no safe/generic default.
2. Never ship AI-slop: no Inter/Roboto/Arial/system-font defaults, no purple-gradient-on-white, no cookie-cutter layouts. Also avoid the \"tasteful AI\" defaults: cream + terracotta, near-black + acid green, tracked ALL-CAPS eyebrow labels, 01/02/03 markers on non-sequences, one accented word in a headline.
3. Typography: pair a distinctive display font with a refined body font (or use one family with real range) - avoid overused choices (Inter, Space Grotesk). Body line length under ~80 characters.
4. Color: cohesive palette via CSS variables - dominant colors with sharp accents, not timid evenly-distributed palettes.
5. Motion: one well-orchestrated moment beats scattered micro-interactions; motion that answers a user action is welcome. Always respect prefers-reduced-motion.
6. Break the grid: asymmetry, overlap, diagonal flow, generous negative space OR controlled density - avoid predictable centered layouts.
7. Backgrounds need atmosphere/depth (gradients, noise, textures, layered transparency, glows) - never a flat solid-color default.
8. Match code complexity to the aesthetic: maximalist needs elaborate animation/effects; minimalist needs restraint and precise spacing/typography.
9. Vary choices across files/generations - do not converge on the same safe pattern every time.
10. Quality floor: responsive down to mobile, visible keyboard focus, AA contrast.
11. ''' + os.environ.get('DESIGN_REPO_RULE', '')
print(json.dumps({
    'continue': True,
    'hookSpecificOutput': {
        'hookEventName': 'PreToolUse',
        'additionalContext': reason
    }
}))
"

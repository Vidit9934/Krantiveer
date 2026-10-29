#!/bin/bash
# Fires on PreToolUse/ExitPlanMode — the one plan-mode hook that runs no matter
# HOW plan mode was entered (EnterPlanMode only fires when Claude calls the tool;
# plan mode switched on by the user never triggers it).
#
# Enforces the plan-review protocol: the plan (the `plan` argument, or the newest
# file in ~/.claude/plans) must contain a line like "PLAN SCORE: 86/100" with a
# score >= 85. Chat text can't be checked reliably, so the score lives in the plan.

source "$(dirname "${BASH_SOURCE[0]}")/resolve-python.sh"
if [[ -z "$PYTHON" ]]; then
  exit 0
fi

input=$(cat)
HOOK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TMPINPUT=$(mktemp "$HOOK_DIR/.exit_plan_XXXXXX.json") || exit 0
printf '%s' "$input" > "$TMPINPUT"
trap "rm -f '$TMPINPUT'" EXIT
export HOOK_INPUT_FILE="$(native_path "$TMPINPUT")"

"$PYTHON" - <<'PYEOF'
import json, os, re, glob

MIN_SCORE = 85
SCORE_RE = re.compile(r'PLAN SCORE[:\s*]*(\d{1,3})\s*/\s*100', re.IGNORECASE)

try:
    with open(os.environ["HOOK_INPUT_FILE"], "r", encoding="utf-8") as fh:
        data = json.load(fh)
except Exception:
    data = {}

texts = []
plan_arg = (data.get("tool_input") or {}).get("plan")
if isinstance(plan_arg, str) and plan_arg.strip():
    texts.append(plan_arg)

plan_files = glob.glob(os.path.join(os.path.expanduser("~"), ".claude", "plans", "*.md"))
if plan_files:
    newest = max(plan_files, key=os.path.getmtime)
    try:
        with open(newest, "r", encoding="utf-8") as fh:
            texts.append(fh.read())
    except Exception:
        pass

scores = [int(m) for t in texts for m in SCORE_RE.findall(t)]
best = scores[-1] if scores else None

if best is not None and best >= MIN_SCORE:
    print(json.dumps({"continue": True}))
else:
    found = "no PLAN SCORE line found" if best is None else f"PLAN SCORE is {best}/100"
    reason = (
        f"EXIT PLAN MODE BLOCKED: {found} (minimum {MIN_SCORE}).\n\n"
        "Before ExitPlanMode, run the review protocol and put the result IN THE PLAN FILE "
        "(so the user sees it when approving):\n"
        "  1. Architecture deep-think, 2. Failure-mode analysis (min 3 scenarios, blast radius, mitigation), "
        "3. Security pass, 4. Performance pass, 5. Maintainability pass.\n"
        "  2. Add a '## Plan review' section with a per-dimension table "
        "(Architecture /25, Code quality /20, Security /20, Performance /15, Maintainability /20) "
        "and a line exactly like: PLAN SCORE: XX/100 (replace XX with the honest score).\n"
        f"  3. If the score is below {MIN_SCORE}, fix the weak sections of the plan and re-score before exiting."
    )
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",
            "permissionDecisionReason": reason
        }
    }))
PYEOF

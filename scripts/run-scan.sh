#!/bin/bash
# Cron wrapper for the iOS Trainer interview-question scan.
# Runs the local-Ollama pipeline, appends new candidates to the review queue
# (assets/js/questions.auto.js, all reviewed:false), and logs the run.
#
# It does NOT commit or push — auto-generated questions are quarantined and
# must be human-reviewed (flip reviewed:true) before they appear in a quiz.

set -euo pipefail

# cron runs with a minimal PATH; make node + ollama reachable.
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"

REPO="/Users/dmeneses/Documents/Vue/iOSTrainer"
LOG="$REPO/scripts/scan.log"

cd "$REPO"

# Skip gracefully if the Ollama server isn't up (e.g. laptop asleep at run time).
if ! curl -s --max-time 5 http://localhost:11434/api/tags >/dev/null; then
  echo "$(date '+%Y-%m-%d %H:%M:%S') Ollama not reachable — skipping scan." >> "$LOG"
  exit 0
fi

{
  echo "===== scan $(date '+%Y-%m-%d %H:%M:%S') ====="
  GEN_MODEL="${GEN_MODEL:-llama3:latest}" MAX_NEW="${MAX_NEW:-8}" node scripts/scan.mjs
  echo
} >> "$LOG" 2>&1

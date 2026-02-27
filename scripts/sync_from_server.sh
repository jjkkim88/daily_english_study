#!/usr/bin/env bash
set -euo pipefail

# Sync English study data from the server workspace into this git repo.
# - Uses rsync (no --delete) to only add/update files.
# - Commits and pushes only when there are changes.
#
# Reliability:
# - At 10:07 KST we expect today's history JSON to exist (created by archive_daily.py at 10:00 push).
# - If it's missing, retry up to 3 times (30s interval) by re-running archive_daily.py.
# - If still missing, log the failure and exit non-zero.

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_BASE="/home/ubuntu/workspace/english"
FAIL_LOG="$REPO_ROOT/sync_failures.log"

mkdir -p "$REPO_ROOT/data" "$REPO_ROOT/data/history" "$REPO_ROOT/sources"

kst_date() {
  TZ=Asia/Seoul date +%F
}

log_fail() {
  local msg="$1"
  local ts
  ts=$(TZ=Asia/Seoul date '+%F %T %Z')
  echo "[$ts] $msg" | tee -a "$FAIL_LOG" >&2
}

# Ensure today's history exists (retry + archive_daily.py)
TODAY="$(kst_date)"
HIST_EXPECT="$SRC_BASE/outputs/history/${TODAY}.json"

for attempt in 1 2 3; do
  if [[ -f "$HIST_EXPECT" ]]; then
    break
  fi
  log_fail "Missing history file: $HIST_EXPECT (attempt ${attempt}/3). Re-running archive_daily.py."
  python3 "$SRC_BASE/scripts/archive_daily.py" || true
  if [[ "$attempt" -lt 3 ]]; then
    sleep 30
  fi
done

if [[ ! -f "$HIST_EXPECT" ]]; then
  log_fail "Giving up: history file still missing after retries: $HIST_EXPECT"
  exit 1
fi

# today (overwrite)
rsync -a "$SRC_BASE/data/today_study.json" "$REPO_ROOT/data/today_study.json" || true
rsync -a "$SRC_BASE/data/today_delta.json" "$REPO_ROOT/data/today_delta.json" || true

# sources (overwrite)
rsync -a "$SRC_BASE/data/english_vocab.md" "$REPO_ROOT/sources/english_vocab.md" || true
rsync -a "$SRC_BASE/data/english_sentences.md" "$REPO_ROOT/sources/english_sentences.md" || true

# history (append/update; no deletions)
rsync -a "$SRC_BASE/outputs/history/" "$REPO_ROOT/data/history/" || true

cd "$REPO_ROOT"

# Stage first so untracked files are included in change detection.
git add data sources

# If nothing staged/changed, stop.
if git diff --cached --quiet; then
  echo "No changes to commit."
  exit 0
fi

KST_TS=$(TZ=Asia/Seoul date '+%Y-%m-%d %H:%M')

git commit -m "chore(data): sync (${KST_TS} KST)" || exit 0

git push origin HEAD

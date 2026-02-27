#!/usr/bin/env bash
set -euo pipefail

# Sync English study data from the server workspace into this git repo.
# - Uses rsync (no --delete) to only add/update files.
# - Commits and pushes only when there are changes.

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_BASE="/home/ubuntu/workspace/english"

mkdir -p "$REPO_ROOT/data" "$REPO_ROOT/data/history" "$REPO_ROOT/sources"

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

#!/usr/bin/env bash
set -euo pipefail

LOCK_FILE="/var/lock/joao-sistema-deploy.lock"
APP_DIR="${APP_DIR:-/var/www/joao-sistema}"
PM2_NAME="${PM2_NAME:-joao-sistema}"
TARGET_BRANCH="${TARGET_BRANCH:-main}"

mkdir -p "$(dirname "$LOCK_FILE")"

exec 9>"$LOCK_FILE"
flock -n 9 || exit 0

cd "$APP_DIR"

current_branch="$(git rev-parse --abbrev-ref HEAD)"

if [[ "$current_branch" != "$TARGET_BRANCH" ]]; then
  echo "Skipping deploy: current branch is $current_branch, expected $TARGET_BRANCH"
  exit 0
fi

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Skipping deploy: local changes detected"
  exit 0
fi

git fetch origin "$TARGET_BRANCH"

local_head="$(git rev-parse HEAD)"
remote_head="$(git rev-parse "origin/$TARGET_BRANCH")"

if [[ "$local_head" == "$remote_head" ]]; then
  exit 0
fi

git reset --hard "origin/$TARGET_BRANCH"
rm -rf .next
npm ci
npm run build
pm2 reload "$PM2_NAME" --update-env

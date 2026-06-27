#!/usr/bin/env bash
set -euo pipefail

LOCK_FILE="/var/lock/joao-sistema-deploy.lock"
APP_DIR="/var/www/joao-sistema"
PM2_NAME="joao-sistema"

mkdir -p "$(dirname "$LOCK_FILE")"

exec 9>"$LOCK_FILE"
flock -n 9 || exit 0

cd "$APP_DIR"

git fetch origin main

local_head="$(git rev-parse HEAD)"
remote_head="$(git rev-parse origin/main)"

if [[ "$local_head" == "$remote_head" ]]; then
  exit 0
fi

git pull --ff-only origin main
npm ci
npm run build
pm2 reload "$PM2_NAME" --update-env

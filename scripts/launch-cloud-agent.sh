#!/usr/bin/env bash
# Launch a Cursor Cloud Agent on this repo. Requires a user API key from
# https://cursor.com/dashboard/api
set -euo pipefail
: "${CURSOR_API_KEY:?Set CURSOR_API_KEY from https://cursor.com/dashboard/api}"

curl --request POST \
  --url https://api.cursor.com/v1/agents \
  -u "${CURSOR_API_KEY}:" \
  --header 'Content-Type: application/json' \
  --data @- <<'JSON'
{
  "prompt": {
    "text": "Finish the Phase 1 MVP in apps/mobile for https://github.com/rschultz2003/guru-maps-clone. Read README.md, PLAN.md, and CURSOR_AGENT.md and implement only Phase 1 from PLAN.md. Expo + TypeScript + @maplibre/maplibre-react-native. OSM vector style with visible OpenStreetMap attribution. Long-press creates a pin at the coordinate. Pin editor: name, notes, folder, built-in icon, and custom icon upload (PNG/JPEG/WebP) copied into the app documents directory (icons/{id}.webp or original) and persisted in SQLite. Render uploaded icons as MapLibre style images via addImage, not only colored dots. Folders: create, rename, show/hide; hidden folder pins must not render. Pin list with tap-to-fly. SQLite so pins, folders, and icon metadata survive restart. Delete pin without crashing if the icon file is missing. Free-tier stub warns at 15 markers; no IAP, no ads. Wire src/export/gpx.ts and kml.ts into a share action for a single pin. Do not build navigation, track recording, sync, CarPlay, 3D terrain, or App Store submission. Not affiliated with Guru Maps; do not use their name, icons, or assets in UI strings or store metadata. Open a PR. Do not merge."
  },
  "model": { "id": "composer-2" },
  "repos": [
    {
      "url": "https://github.com/rschultz2003/guru-maps-clone",
      "startingRef": "main"
    }
  ],
  "autoCreatePR": true
}
JSON

# Cursor Cloud Agent brief — Phase 1 MVP

Repo: https://github.com/rschultz2003/guru-maps-clone

## Launch (human — API key required)

Generate a key: https://cursor.com/dashboard/api

```bash
curl --request POST \
  --url https://api.cursor.com/v1/agents \
  -u "$CURSOR_API_KEY:" \
  --header 'Content-Type: application/json' \
  --data '{
    "name": "Trail Pin MVP scaffold",
    "prompt": {
      "text": "Read README.md, PLAN.md, and this file first. Scaffold an Expo SDK + TypeScript + Expo Router app named Trail Pin in this repo. Use @maplibre/maplibre-react-native with an OSM-based style and visible © OpenStreetMap contributors attribution. Implement the core differentiator: long-press map → new pin → upload image (expo-image-picker) → persist to FileSystem + SQLite → render that image as the pin icon on the map. Also: default icon set, folders (create/rename/assign/toggle visibility), user location puck, data survives relaunch. Do NOT implement CarPlay, RevenueCat, full country pack downloads, or voice navigation in this PR. Open a PR against main with the working MVP scaffold. Model preference: composer-2."
    },
    "model": { "id": "composer-2" },
    "repos": [
      {
        "url": "https://github.com/rschultz2003/guru-maps-clone",
        "startingRef": "main"
      }
    ],
    "autoCreatePR": true
  }'
```

Auth is HTTP Basic with the API key as username and an empty password (`-u KEY:`), or `Authorization: Bearer KEY`.

## Agent must implement

1. Expo Router scaffold (`npx create-expo-app` pattern if empty aside from docs).
2. MapLibre map, OSM style, OSM attribution.
3. Long-press to create a pin at that coordinate.
4. Custom icon upload stored on device and shown as the map pin (differentiator).
5. Default icon set if no upload.
6. Folders: create/list/assign/toggle visibility.
7. SQLite persistence for pins/icons/folders.
8. Location permission + puck.

Out of scope this PR: CarPlay, subscriptions, offline country packs, TBT nav.

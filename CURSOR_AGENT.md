# Cursor Cloud Agent brief — Phase 1 MVP

Repo: https://github.com/rschultz2003/guru-maps-clone
Starting ref: `main`
Model: `composer-2` (or account default)
autoCreatePR: true
Do not merge. Do not submit to the App Store. Not affiliated with Guru Maps. Do not use the Guru Maps name or assets in the UI. Ship name in code comments may say BossMaps.

Existing draft PR: https://github.com/rschultz2003/guru-maps-clone/pull/2 — inspect it; do not duplicate if it already satisfies acceptance. Prefer a new PR from main if #2 is stale.

## Task

Finish the Phase 1 MVP in `apps/mobile` (Expo + TypeScript + MapLibre):

1. MapLibre map with an OSM style and visible OSM attribution.
2. Long-press the map to create a pin at that coordinate.
3. Pin editor: name, notes, folder, built-in icon, and **custom icon upload** from the photo library (PNG/JPEG/WebP). Copy the file into the app documents directory and persist the URI.
4. Render custom icons on the map via MapLibre style images (not only a colored dot).
5. Folders: create, rename, show/hide. Hidden folder pins must not render.
6. Pin list with tap-to-fly.
7. SQLite so pins, folders, and icon metadata survive restart.
8. Delete pin. Do not crash if an icon file is missing.
9. Free-tier stub: warn at 15 markers (do not add IAP).
10. Wire `src/export/gpx.ts` and `src/export/kml.ts` into a share action for a single pin (one-point GPX/KML). Do not build full track recording.
11. README run notes if setup changes.

## Out of scope

Navigation, track recording, sync, CarPlay, 3D terrain, RevenueCat, App Store submission.

## Acceptance

- 10 mixed pins persist across relaunch and render.
- Folder hide/show works.
- Custom images render at pin size.
- A pin can be exported as GPX and KML.
- Typecheck passes.
- Open a PR. Do not merge.

## Launch

```bash
export CURSOR_API_KEY=key_...
bash scripts/launch-cloud-agent.sh
```

Auth: Basic with the API key as username and an empty password (`-u "$CURSOR_API_KEY:"`), or `Authorization: Bearer`. Key: https://cursor.com/dashboard/api

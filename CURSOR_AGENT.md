# Launch Cursor Cloud Agent (Phase 1 MVP)

API key is not stored in the CoS sandbox. Run this locally with a key that can write to `rschultz2003/guru-maps-clone`.

```bash
curl -sS -X POST https://api.cursor.com/v1/agents \
  -H "Authorization: Bearer $CURSOR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Build Phase 1 MVP of this offline maps app. Read PLAN.md and README.md first.\n\nScaffold an Expo + React Native + TypeScript app in apps/mobile.\nUse MapLibre (@maplibre/maplibre-react-native), NOT Google Maps.\nImplement: full-screen map with an OSM/MapLibre style; long-press to drop a pin; custom icon upload from the photo library (resize to 128 and 256 PNG, strip EXIF); render uploaded images as map markers; pin editor (title, notes, icon); folders/collections (create, assign pin, show/hide); persist pins, folders, and icon files with SQLite + filesystem so data survives app restart; stub UI for downloading one offline region.\nNo auth required. No ads.\nOpen a PR with the working scaffold and short test notes. autoCreatePR is true.\nDo not brand the UI as Guru Maps — use a neutral name like Atlas or keep BossMaps-adjacent labeling.",
    "source": {
      "repository": "https://github.com/rschultz2003/guru-maps-clone",
      "ref": "main"
    },
    "target": {
      "autoCreatePr": true
    },
    "model": "composer-2"
  }'
```

If `composer-2` is rejected, omit `model` and retry with the default.

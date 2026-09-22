# Cursor Cloud Agent — Phase 1 MVP

Repo: `https://github.com/rschultz2003/guru-maps-clone`

```bash
export CURSOR_API_KEY="YOUR_KEY"

curl -sS -X POST https://api.cursor.com/v1/agents \
  -H "Authorization: Bearer $CURSOR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": {
      "text": "Build Phase 1 MVP of this offline maps app (Guru Maps-inspired, NEVER brand the product Guru Maps). Repo already has apps/mobile Expo TS scaffold.\n\nDo:\n1. Keep Expo + React Native + TypeScript in apps/mobile.\n2. Full-screen MapLibre GL map (@maplibre/maplibre-react-native). OSM/OpenFreeMap or demo style. NO Google Maps.\n3. Core differentiator: long-press or tap map → create pin at lat/lng → icon sheet with built-in icons + Upload from camera roll (expo-image-picker) → resize to 128 and 256 PNG, strip EXIF GPS, save under icons/{sha256}.png via expo-file-system → register IconAsset → render that image as the MapLibre symbol for the pin.\n4. Pin editor: title, notes, folder, icon.\n5. Folders/collections: create, rename, move pins, show/hide layer.\n6. Persist pins, folders, icon metadata in expo-sqlite (or AsyncStorage fallback documented). Survive app kill.\n7. Pin list + tap-to-fly-to.\n8. Offline pack manager UI stub (download region placeholder).\n9. README run steps: cd apps/mobile && npx expo start.\n10. Open a PR (autoCreatePR). Do not merge. Do not add analytics/ad SDKs.\n\nDone when: simulator user picks a photo, drops a pin, sees that photo as the marker, files it in a folder, kills the app, data remains."
    },
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

If `composer-2` is rejected, omit `model` and retry (account default).

List / follow:

```bash
curl -sS https://api.cursor.com/v1/agents -H "Authorization: Bearer $CURSOR_API_KEY"
curl -sS https://api.cursor.com/v1/agents/AGENT_ID -H "Authorization: Bearer $CURSOR_API_KEY"
```

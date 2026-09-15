# Trail Pin — master plan

## Outcomes

1. Spec locked to Guru Maps App Store surface area (offline OSM, custom pins/icons, folders, multi-stop routes, GPS tracks + GPX/KML, offline search, 3D terrain, sync, CarPlay, no ads, privacy-first).
2. Differentiator shipped first: **upload an image → pin it on the map**.
3. MVP on a device or simulator, then navigation, tracks, sync, Pro.

## Architecture

```
[Expo RN app]
  MapLibre view ↔ local style + optional PMTiles/MBTiles
  Pin layer     ↔ SQLite + icon files on disk
  Folder layer  ↔ same DB
  GPS           ↔ expo-location background
        |
        | HTTPS when user signed in
        v
[API]  auth, icon blob store, sync feed (pins/folders/tracks/routes)
[Pro]  RevenueCat entitlements gate packs / nav / multi-device
```

Offline-first rules:
- Create/edit/delete pins with no network.
- Icons written to `FileSystem.documentDirectory/icons/{id}`.
- Sync queue table; retry with backoff.
- Location never leaves the device unless sync is enabled.

## Phases

### Phase 0 — Spec (this repo)
- README + PLAN.
- Working name Trail Pin (changeable).

### Phase 1 — MVP (current build target)
Must ship:
- MapLibre map, OSM raster or vector style (e.g. OpenFreeMap / demo tiles for dev).
- User location + follow mode.
- Long-press to drop a pin.
- Pin editor: title, note, folder, default icon **or uploaded image**.
- Image picker → persist file → render as MapLibre symbol/image layer.
- Icon library screen (grid of uploads + defaults).
- Folders: create, rename, assign pin, toggle visibility.
- Local persistence (SQLite).
- Basic online geocode search (Nominatim, rate-limited) with a clear path to offline later.
- Attribution: © OpenStreetMap contributors.

Out of MVP: turn-by-turn, CarPlay, 3D mesh, paid packs, account sync.

### Phase 2 — Navigation + tracks
- Multi-stop planner UI.
- Routing profiles (car/bike/walk/straight-line).
- Voice TBT + reroute (online first).
- Track record + live stats + GPX/KML import/export.
- Elevation graph if DEM available.

### Phase 3 — Offline depth + terrain
- Region pack downloader (PMTiles).
- Offline search index (whoosh/mini or prebuilt).
- Hillshade / contours / pitch 3D.
- MBTiles/sqlitedb import.

### Phase 4 — Sync + Pro + CarPlay
- Auth + icon/pin sync.
- RevenueCat Pro.
- CarPlay / Android Auto.
- Folder share links.

## MVP implementation notes for agents

Stack lock for Phase 1:
- Expo SDK current, TypeScript, Expo Router.
- `@maplibre/maplibre-react-native` (or `maplibre-react-native`).
- `expo-image-picker`, `expo-file-system`, `expo-sqlite`, `expo-location`.
- No Firebase required for MVP.

Pin schema (SQLite):
- `pins(id, title, note, lat, lon, folder_id, icon_id, created_at, updated_at, deleted_at)`
- `icons(id, kind, name, local_path, remote_url, created_at)` kind = default | upload
- `folders(id, name, parent_id, visible, created_at)`

UX for differentiator:
1. Long-press map.
2. Sheet: “New pin”.
3. Tap icon → library or “Upload”.
4. Crop to square, save, pin appears immediately with that artwork.

## Risks

- MapLibre RN + Expo config plugins / new architecture — budget time for a bare prebuild.
- Nominatim ToS: cache, identify UA, do not hammer.
- Store listing must not impersonate Guru Maps.
- Large icon bitmaps on the symbol layer: cap size (e.g. 128–256 px) and compress.

## Done when (Phase 1)

- `npx expo start` runs.
- Simulator: drop pin, upload image, see custom icon on map, file it in a folder, relaunch and data remains.
- PR opened against `main` with scaffold + the above.

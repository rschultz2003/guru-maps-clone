# Master plan — Guru Maps parity

Last updated: 2026-09-19 (CoS).

## Goal

Ship an offline maps app with Guru Maps feature parity, with a sharper custom-icon upload flow. Public spec lives here; product brand to ship is BossMaps unless Reuben decides otherwise.

## Architecture

```
[Expo RN app]
  MapLibre view
  SQLite (pins, folders, icons metadata, tracks, routes, downloads)
  File store (icon blobs, MBTiles, DEM, recordings)
        |
        | opt-in HTTPS
        v
[Sync API]  auth + object store (icons) + JSON documents (pins/folders/tracks)
[Tile CDN / self-host]  vector tiles + style + DEM
[Router packs]  Valhalla/OSRM graphs per region
[Search packs]  offline geocode + POI categories
```

### Data model (MVP)

- `folders(id, name, parent_id, color, sort)`
- `icons(id, kind: preset|upload, local_uri, hash, width, height, created_at)`
- `pins(id, lat, lon, name, notes, folder_id, icon_id, color, created_at, updated_at)`
- `tracks`, `track_points` — Phase 2
- `routes`, `waypoints` — Phase 2
- `map_packs(id, region, bytes, status)` — Phase 1 lite (cache) / Phase 2 full

### Icon pipeline

1. `expo-image-picker` → user image.
2. Resize longest edge 256px, PNG, optional circle mask.
3. SHA-256 hash; store under `FileSystem.documentDirectory/icons/{hash}.png`.
4. Register in `icons` table; attach to pin.
5. MapLibre `Images` / symbol layer uses local file URI as icon-image.
6. Sync (later): upload blob by hash; pins reference `icon_hash`.

## Phases

### Phase 0 — Repo + agent brief (done)
Docs, Cursor agent prompt, STATUS.

### Phase 1 — MVP (now)
Must land in one PR:

- Expo + TypeScript + Expo Router scaffold (iOS + Android)
- MapLibre map, user location, OSM style (demo tiles OK: `https://demotiles.maplibre.org/style.json` or OpenFreeMap)
- Long-press drop pin
- Pin list + tap-to-focus
- **Custom icon upload** + preset set (8–12 glyphs)
- Folders: create, assign pin, filter map by folder
- Local SQLite persistence
- Settings stub: units, privacy copy, no ads
- README run instructions (`npx expo start`)

Out of MVP: routing, tracks, 3D, CarPlay, sync, Pro IAP, offline country packs (online OSM tiles + cache is acceptable for MVP).

### Phase 2 — Navigation + tracks
Multi-stop planner, offline routing pack, voice guidance, track record + stats + GPX/KML import/export, offline search pack for one region (AU first).

### Phase 3 — Terrain + power features
DEM / 3D relief, contours, hillshade, elevation profile, GeoJSON overlay, MBTiles import, coordinate grids.

### Phase 4 — Sync + account
Auth, encrypted sync of pins/folders/icons/tracks, conflict = last-write-wins + deleted tombstones.

### Phase 5 — Pro + CarPlay + store
RevenueCat, pack entitlements, Pro layers, CarPlay map + upcoming turn, privacy nutrition, TestFlight. Human approval required before any App Store submit or spend.

## Coding agents

- Models: **Composer 2.5 or Grok 4.6 only** (org rule).
- Cursor Cloud Agents: `POST https://api.cursor.com/v1/agents` with `autoCreatePR: true`, repo `https://github.com/rschultz2003/guru-maps-clone`.
- Brief: [CURSOR_AGENT.md](./CURSOR_AGENT.md).

## Risks

- Trademark: never ship under the Guru Maps name.
- Offline packs are large; start with cache + one AU extract.
- Background GPS battery + App Store location purpose strings.
- Custom icons as MapLibre images: many unique icons need atlas / per-pin SymbolLayer management.

## Success for MVP PR

App boots on simulator, map renders, user can upload a photo as a pin icon, pin persists after reload, pins group into a folder.

# Master plan — Atlas Maps (Guru Maps clone)

Date: 2026-10-11. Status: Phase 1 scaffold exists on `main`. Cloud Agent requires user-provided `CURSOR_API_KEY` (environment returns 401 without it).

## Architecture

```
+-----------------------+     opt-in sync      +--------------------------+
| Expo / RN app         | <------------------> | Backend API (Phase 4)    |
| MapLibre + OSM style  | markers, tracks,     | Auth (magic link),       |
| SQLite + local files  | icons, folders       | blobs, device list       |
| GPS, routes, offline  |                      +--------------------------+
+-----------------------+                               |
                                                        v
                                                 Object storage (icons)
```

- **On-device first**: Source of truth until sync enabled. Every entity has UUID + `updated_at`. Soft deletes via tombstones.
- **Custom icons differentiator**: Upload image → resize to WebP → store URI in SQLite → `map.addImage(id, image)` → SymbolLayer with `icon-image` property. Fallback to circle if missing.
- **Offline**: MapLibre OfflineManager for regions, or PMTiles extracts bundled/downloaded. No scraping of tile servers.
- **Privacy**: No ads, no analytics SDKs in MVP. Location permissions explained. Sync opt-in. Icons stay local until sync.

### Data model (SQLite)

- `folders(id TEXT PK, name, color, visible INTEGER, sort, updated_at, deleted_at)`
- `markers(id TEXT PK, folder_id, name, notes, lat REAL, lon REAL, icon_id, created_at, updated_at, deleted_at)`
- `icons(id TEXT PK, kind TEXT, builtin_key, file_uri, width, height, updated_at)`
- `tracks(...)` / `track_points(...)` (Phase 3)
- `routes(...)` (Phase 2)
- `regions(...)` for offline packs

### Map rendering

- Default style: OpenFreeMap Liberty (`https://tiles.openfreemap.org/styles/liberty`). Always show OSM attribution.
- Custom icons: Dynamic `Images` component or `addImage` + SymbolLayer from GeoJSON ShapeSource of markers.
- Folders control visibility filter on the source.
- 3D/terrain (later): DEM source + hillshade/fill-extrusion + contour lines.

## Phases

### Phase 1 — MVP (map + custom icon upload + pins + folders)
**Goal**: Usable offline map where users can drop pins and attach their own icons.

- Expo + TS + MapLibre + SQLite + image picker.
- Long-press drops pin at coordinate.
- Pin editor: name, notes, folder, built-in icons, **custom upload** (PNG/JPEG/WebP → resize → `icons/{id}.webp`).
- Render custom icons via MapLibre style images / SymbolLayer (not just colored dots).
- Folders: create, rename, show/hide. Hidden = no render.
- Pin list, tap-to-fly, safe delete.
- Share single pin as GPX/KML.
- Free-tier stub (warn at 15 markers). No IAP, no ads.
- Persist across restarts.

**Out of scope**: Navigation, tracks, sync, CarPlay, 3D, store submission.

**Acceptance**: `npx tsc --noEmit` passes; custom icon path documented; no Guru Maps trademarks in UI.

### Phase 2 — Navigation & multi-stop routes
- Multi-stop with custom waypoints.
- Profiles: car, bike, walk, truck, straight-line.
- Fastest vs shortest.
- Save routes, GPX/KML export.
- Turn-by-turn voice + auto-reroute (online first; offline graph later).
- Lane guidance stretch goal.

### Phase 3 — GPS track recording
- One-tap start/stop, background location.
- Live stats: speed, distance, time, altitude.
- Interactive charts (elevation, speed, slope).
- GPS filtering. Export GPX/KML.

### Phase 4 — Sync + Pro tier
- Magic-link auth, multi-device.
- Sync markers, folders, tracks, icon blobs. Conflict: last-write-wins on `updated_at`; newer tombstone wins.
- Pro flag (unlimited markers, offline regions, tracks, 3D, sync). IAP later (StoreKit / Play Billing). Do not implement billing in agent PRs.

### Phase 5 — Offline search, 3D terrain, CarPlay
- Offline geocoder (bundled gazetteer or Photon index in region).
- Hillshade, contours, elevation profiles, True 3D relief.
- CarPlay map template + voice.
- Apple Watch companion for active track.

## Cloud Agent

See `scripts/launch-cloud-agent.sh` or the curl in STATUS.md / README. Model: `composer-2`. `autoCreatePR: true`. Starts from `main`.

**Next after agent PR**: Review, iterate on Phase 1, then expand phases.

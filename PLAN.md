# Master plan — Atlas Maps

Updated 7 Oct 2026. Product target is public feature parity with Guru Maps (App Store id 321745474), under a different name. Not affiliated. Do not ship their trademarks or assets.

## Product principles

1. Offline first. The map, pins, icons, and tracks work with airplane mode on.
2. Custom icons are the differentiator. Upload a PNG/JPEG/WebP, assign it to a coordinate, see that image on the map.
3. Privacy first. No ads. No location telemetry. Sync is opt-in.
4. Device is source of truth until the user signs in and enables sync.

## Architecture

```
apps/mobile          Expo React Native client (iOS + Android)
  src/map            MapLibre view, style images, camera
  src/pins           pin editor, folders, icon picker/upload
  src/tracks         recorder, stats, charts (later phases)
  src/export         GPX / KML / GeoJSON writers
  src/db             SQLite schema and migrations
services/sync        Cloudflare Worker (Phase 5) — Hono + D1 + R2
packages/shared      types shared by app and sync API
```

### Data model (local)

- `folders(id, name, color, hidden, sort, updated_at)`
- `icons(id, kind builtin|upload, name, file_uri, mime, width, height)`
- `pins(id, folder_id, icon_id, name, notes, lat, lon, created_at, updated_at)`
- `tracks(id, name, started_at, ended_at, distance_m, duration_s, folder_id)`
- `track_points(track_id, seq, lat, lon, ele, speed, ts)`
- `routes(id, name, mode, preference fastest|shortest, stops_json)`
- `packs(id, region, format pmtiles|mbtiles|sqlitedb, path, bytes, updated_at)`

Icon blobs live as files. SQLite stores metadata only. Deletes must tolerate a missing file.

### Map

- Online style: OSM vector tiles (MapTiler or self-hosted OpenMapTiles) with visible © OpenStreetMap attribution.
- Offline: regional PMTiles/MBTiles. Style source swaps when the viewport is covered.
- Custom pins: `addImage` / style image from the local file URI, symbol layer keyed by `icon_id`.
- Terrain (Phase 4): MapLibre terrain + hillshade + contour source. Elevation profile from track or route samples.

### Backend (Phase 5)

- Auth: Sign in with Apple + magic link. No password store in v1.
- Sync protocol: see `docs/sync-api.md`. Last-write-wins per record with `updated_at`, tombstones for deletes.
- Blobs: R2 keyed by `user_id/icons/{id}`. Client uploads after local save.
- Pro: RevenueCat entitlement `pro`. Server checks it only for quota (region packs, pin count). Free: 15 markers, 1 region pack, limited track hours.

### Privacy

- No ad SDK. No third-party analytics in v1.
- GPS stays in SQLite. Background location permission copy explains track recording only.
- Account deletion removes D1 rows and R2 prefixes.

## Phases

### Phase 1 — MVP (now)

Map + custom icon upload + pins + folders.

- Long-press drops a pin.
- Editor: name, notes, folder, built-in icon, upload custom image.
- Uploaded image copied into documents dir, registered as a MapLibre style image, rendered on the pin.
- Folders: create, rename, show/hide. Hidden folders do not render.
- Pin list, tap to fly.
- SQLite persistence across restart.
- Share one pin as GPX or KML (`src/export`).
- Free-tier stub warns at 15 markers. No IAP.
- Out of scope: navigation, tracks, sync, CarPlay, 3D, store submission.

### Phase 2 — Offline maps and search

- Region pack downloader with progress and storage quota.
- Switch MapLibre source to local pack.
- Import user `.mbtiles` / `.sqlitedb`.
- Offline search index (name, address, category, lat/lon) built from the pack.

### Phase 3 — Routes and navigation

- Multi-stop planner. Fastest vs shortest.
- Valhalla (preferred) or OSRM. Modes: drive, bike, truck, walk, straight line.
- Voice prompts, auto reroute, basic lane hints where the engine provides them.
- Save route, export GPX/KML.

### Phase 4 — Tracks and terrain

- One-tap record, background location, live speed / distance / time / altitude.
- Charts: elevation, speed, slope. GPS accuracy filter.
- Export GPX/KML/GeoJSON.
- Hillshade, contours, 3D relief, elevation profile on a route or track.

### Phase 5 — Sync and Pro

- Account, opt-in sync of pins, folders, tracks, icon blobs.
- RevenueCat Pro. No ads on either tier.
- Share a folder with a link (read-only).

### Phase 6 — CarPlay and polish

- CarPlay: map + voice nav using the offline pack when present.
- Compass, scale bar, MGRS/UTM grid, GeoJSON overlay.
- Opening hours from OSM tags when present.
- Store listing under Atlas Maps / BossMaps. Never under the Guru Maps name.

## Acceptance for Phase 1 PR

1. `npx tsc --noEmit` in `apps/mobile` passes.
2. Long-press, save with an uploaded image, kill app, relaunch: pin and image still there.
3. Hidden folder hides its pins.
4. Share sheet produces valid GPX for one pin.
5. UI strings do not say Guru Maps.
6. OSM attribution visible.

## Cursor Cloud Agent

Launch with `scripts/launch-cloud-agent.sh`. Model `composer-2`. `autoCreatePR: true`. Agent must not merge.

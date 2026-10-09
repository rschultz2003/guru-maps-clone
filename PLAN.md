# Master plan — Atlas Maps

Date: 2026-10-10. Status: Phase 1 scaffold on `main`. Cloud Agent not started (no `CURSOR_API_KEY` in the CoS environment; API returns 401).

## Architecture

```
+-------------------+     optional sync      +----------------------+
| Expo app          | <------------------->  | API (Phase 4)        |
| MapLibre + OSM    |   markers, tracks,     | auth, blobs, devices |
| SQLite + files    |   icon blobs           +----------------------+
| GPS / routes      |                                |
+-------------------+                                v
                                              object storage
```

On-device is the source of truth until sync is on. Every pin, folder, track, and icon has a UUID and `updated_at`. Deletes are tombstones.

### Data model

- `folders(id, name, color, visible, sort, updated_at, deleted_at)`
- `markers(id, folder_id, name, notes, lat, lon, icon_id, created_at, updated_at, deleted_at)`
- `icons(id, kind, builtin_key, file_uri, width, height, updated_at)`
- `tracks(id, name, folder_id, started_at, ended_at, distance_m, duration_s, gain_m)`
- `track_points(track_id, seq, lat, lon, ele, speed, ts)`
- `routes(id, name, profile, preference, waypoints_json)`
- `regions(id, name, bbox, mbtiles_path, bytes, updated_at)`

### Map

- Style: OpenFreeMap Liberty or a self-hosted PMTiles extract. OSM attribution always visible.
- Offline: download bbox as PMTiles or MBTiles into documents; register as a MapLibre source. Do not scrape tile servers.
- Custom icons: `Map.addImage(id, image)` then a symbol layer with `icon-image` from feature properties. Fallback circle layer if the image fails.
- 3D (Phase 5): terrain DEM source + `fill-extrusion` / hillshade. Contours as a line layer.

### Privacy

No ads, no third-party analytics in MVP. Location permission strings explain track recording. Sync is opt-in. Icon uploads stay on device until the user enables sync.

## Phases

### Phase 1 — MVP (current)

Map + custom icon upload + pins + folders.

Done on main:

- Expo app, MapLibre, SQLite store, image picker, built-in icons, GPX/KML writers.

Still required for MVP done:

- Long-press creates a pin at the coordinate.
- Editor: name, notes, folder, built-in icon, custom image upload resized and copied to `icons/{id}.webp`.
- Render uploaded icons via MapLibre `addImage`, not only colored dots.
- Folders: create, rename, show/hide. Hidden folders do not render.
- Pin list, tap-to-fly, delete (missing icon file must not crash).
- Share one pin as GPX or KML using `src/export`.
- Free-tier stub: warn at 15 markers. No IAP, no ads.
- Survive restart.

Out of scope for Phase 1: navigation, tracks, sync, CarPlay, 3D, store submission.

### Phase 2 — Navigation

- Multi-stop routes. Profiles: car, bike, walk, truck, straight line.
- Fastest vs shortest.
- Save route. Export GPX/KML.
- Turn-by-turn with voice and reroute (online first, offline graph later).
- Lane guidance is a later stretch.

### Phase 3 — Tracks

- One-tap record, background location.
- Live speed, distance, time, altitude.
- Charts: elevation, speed, slope.
- Filter noisy GPS. Export GPX/KML.

### Phase 4 — Sync and Pro

- Magic-link auth. Device list.
- Push/pull markers, folders, tracks, icon blobs. Conflict: last-write-wins on `updated_at`, tombstones win if newer.
- Pro flag on the account. StoreKit / Play Billing later. Do not ship IAP in the agent PR.

### Phase 5 — Offline search, terrain, CarPlay

- Geocoder index inside the offline region (Photon or a bundled gazetteer).
- Hillshade, contours, elevation profile.
- CarPlay map template. Apple Watch glance for the active track.

## Acceptance for the Cloud Agent PR

1. `cd apps/mobile && npx tsc --noEmit` passes.
2. Custom icon path is implemented and documented in `apps/mobile/README.md`.
3. No Guru Maps trademarks in UI strings.
4. PR opened, not merged.

## Launch

See `scripts/launch-cloud-agent.sh`. Model `composer-2`. `autoCreatePR: true`.

# Master plan — Atlas Maps

Inspired by the public Guru Maps feature set. Original implementation. Not affiliated with Guru Maps.

## Architecture

```
apps/mobile          Expo app (map, pins, icons, folders, later nav/tracks)
packages/core        (later) shared types, GPX/KML, distance math
services/sync        (later) Hono API: auth, pins, folders, icon blobs, tracks
docs/                API contract and phase notes
```

On-device is source of truth until sync is enabled. Sync is opt-in.

```
MapLibre MapView
  OSM vector style + attribution
  SymbolLayer (icon image id per pin)
  LineLayer (route / track)
  TerrainSource (Phase 6)
SQLite: folders, pins, tracks, track_points, icon_assets, routes
FileSystem: icons/{id}.webp, packs/{region}.pmtiles
```

Pin: `id, name, notes, lat, lon, folderId, iconId, color, createdAt, updatedAt`.
Icon: `id, kind (builtin|upload), uri, width, height, mime`.
Folder: `id, name, visible, sort`.
Track: `id, name, folderId, startedAt, endedAt, distanceM, points[]`.

## Tech choices

- React Native (Expo) over Flutter: scaffold exists; `expo-image-picker` + FileSystem covers the differentiator.
- MapLibre over Google/Mapbox: offline OSM styles, no per-load billing, style images for custom icons.
- SQLite over AsyncStorage: query folders, hide/show, export.
- Backend later: Hono + R2 + D1. Do not block MVP on it.
- Pro later: unlimited pins/icons, offline region packs, specialist layers, 3D terrain, CarPlay. Free cap stub: warn at 15 markers. No ads in any tier.

## Phase 0 — spec (done)

README, PLAN, sync contract, Cloud Agent brief.

## Phase 1 — MVP (in progress)

Acceptance:

1. MapLibre map, OSM style, visible OSM attribution.
2. Long-press creates a pin at that coordinate.
3. Editor: name, notes, folder, built-in icon, custom upload (PNG/JPEG/WebP) copied into documents and persisted.
4. Uploaded icons render as MapLibre style images at pin size, not only colored dots.
5. Folders: create, rename, show/hide. Hidden folders do not render.
6. Pin list, tap flies the camera.
7. SQLite survives restart. Delete pin does not crash if the icon file is missing.
8. Share one pin as GPX and KML (`src/export`).
9. Free-tier stub warns at 15 markers. No IAP.
10. Typecheck passes. PR opened. Do not merge. Do not submit to the App Store.

Existing draft: https://github.com/rschultz2003/guru-maps-clone/pull/2

## Phase 2 — offline maps and search

- Region catalog (country / state bounding boxes).
- Download PMTiles or MBTiles; switch style source to local file when the pack covers the viewport.
- Offline search index inside the pack (name, address, category, lat/lon parse; MGRS and Plus codes later).
- Import user MBTiles / sqlitedb.

## Phase 3 — routes and navigation

- Multi-stop planner, fastest vs shortest.
- Valhalla/OSRM. Voice prompts. Reroute when off-route.
- Modes: drive, bike, truck, walk, straight line.
- Export route GPX/KML. Lane guidance is a stretch goal.

## Phase 4 — tracks

- Background location (`expo-location` / task manager).
- Live speed, distance, time, altitude.
- Charts (altitude and speed gradients).
- GPX/KML/GeoJSON export of the full track. GPS accuracy and distance filters.

## Phase 5 — sync and Pro

- Auth. Push/pull pins, folders, tracks. Icon blobs to object storage.
- Conflict: last-write-wins on `updatedAt`, plus a device backup export.
- RevenueCat: Pro unlocks packs, unlimited pins, sync, specialist layers.
- No ads in any tier.

## Phase 6 — terrain, CarPlay, extras

- Hillshade + contour overlay. 3D terrain (MapLibre terrain / custom mesh).
- Elevation profile and slope chart on a route or track.
- CarPlay: map template + navigation session (native module).
- GeoJSON overlay, compass, scale, coordinate formats, bearing line, opening hours from OSM tags.

## Non-goals

- Cloning Guru Maps branding or assets.
- Shipping with ads.
- Uploading location by default.
- App Store submission from an agent.

## Agent loop

1. Finish Phase 1 on a branch and open a PR (`autoCreatePR: true`, model `composer-2`).
2. Review #2 or the new PR. Do not merge blind.
3. Next agent prompt is Phase 2 only after Phase 1 acceptance passes.

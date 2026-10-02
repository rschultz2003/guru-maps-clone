# Master plan — Guru Maps parity (BossMaps)

Target: feature parity with the current Guru Maps App Store listing (id 321745474 / Pro id 891362701): offline OSM maps, custom pins and icons, folders, multi-stop routes, GPS tracks with stats and GPX/KML, offline search, 3D terrain, sync, CarPlay, Apple Watch later, no ads, privacy-first.

Core differentiator: easy upload of custom icons or images onto pin locations.

Ship brand: **BossMaps** (`rschultz2003/bossmaps`). This repo is the public spec and Expo scaffold. Not affiliated with Guru Maps (Evgen Bodunov / WPG). Do not submit an App Store listing that uses the Guru Maps name or assets.

## Architecture

```
[Expo React Native + MapLibre native]
   |
   +-- Map screen (OSM style, camera, user location, symbol layer)
   +-- Pin editor (name, notes, folder, color, builtin or uploaded icon)
   +-- Offline pack manager (PMTiles / MBTiles, region index) — Phase 2
   +-- SQLite (pins, folders, icons, tracks, routes)
   +-- Icon files in app documents (custom uploads)
   +-- GPX/KML writers (apps/mobile/src/export)
   +-- Optional sync client (outbox, last-write-wins)
          |
          v
[Hono API] -- Postgres (entities) + object storage (icons, GPX)
          |
          +-- Auth (magic link)
          +-- RevenueCat webhooks (Pro entitlement)
```

Local-first. The app is fully usable with no account. Sync is opt-in. Location never leaves the device unless sync is on.

## Tech stack decision

- **Client: React Native (Expo + dev client), not Flutter.** Scaffold already exists. `@maplibre/maplibre-react-native` supports custom style images, which is the differentiator path.
- **Map SDK: MapLibre + OpenStreetMap.** No Google Maps (offline rights and license). Style URL configurable. Default a public OSM raster/vector style for MVP. Attribution always visible.
- **Persistence:** `expo-sqlite` for entities. Icon binaries in `FileSystem.documentDirectory/icons/`, referenced by URI.
- **Backend (Phase 5):** Hono, Postgres, S3-compatible object storage. Auth optional. Last-write-wins on `updatedAt` plus an outbox.
- **Pro:** RevenueCat. Free caps stubbed in the client (15 markers, 15 tracks, 3 packs) and enforced when IAP lands. No ads in any tier.
- **Privacy:** no ads, no analytics SDKs in MVP. Location purpose strings explain on-device use.

Flutter remains a fallback only if MapLibre RN blocks custom symbol images on a target OS. Do not rewrite unless that happens.

## Phase 0 — Foundations (done)

- Expo + TypeScript app under `apps/mobile`
- Pin / folder / icon types
- SQLite store with builtin pin asset
- Custom icon file copy into app documents

## Phase 1 — MVP (current)

**Must ship**

- MapLibre map, OSM style, attribution
- User location when permitted
- Long-press → create pin at coordinate
- Pin editor: name, notes, folder, color, icon
- **Custom icon upload** (photo library / files) → stored locally → rendered as a MapLibre style image on the pin
- Folders: create, rename, show/hide
- Pin list + tap-to-fly
- Delete pin; missing icon file must not crash
- Offline-first local DB (no login)
- Free-tier marker cap stub (15)

**Acceptance**

- Drop 10 pins with mixed built-in and uploaded icons; kill and relaunch; all persist and render.
- Hide a folder; its pins leave the map; show again and they return.
- Custom PNG/JPEG/WebP icons render at pin size without crashing MapLibre.
- OSM attribution visible.
- Typecheck passes.

## Phase 2 — Offline maps + search

- Region pack download (country / metro), progress, size, delete
- Offline style + fallback when the device is offline
- MBTiles / PMTiles / sqlitedb import hook
- Offline geocoder: name, address, category, lon/lat
- Typeahead, multi-language labels where the pack has them

## Phase 3 — Routes + navigation

- Multi-stop planner with custom waypoints
- Fastest / shortest
- Straight-line mode (sailing / off-road)
- Modes: car, bike, truck, walk
- Offline routing pack (Valhalla or OSRM); online router first if packs lag
- Turn-by-turn voice + auto-reroute; lane hints when data exists
- Save route; export GPX/KML via `apps/mobile/src/export`

## Phase 4 — Tracks

- Background GPS record (one tap)
- Live stats: speed, distance, time, elevation
- Elevation / speed / slope chart
- Pause / resume; GPS filter for smoother tracks
- GPX / KML export and import
- Track list + overlay on the map

## Phase 5 — Sync + Pro

- Optional account
- Sync pins, folders, custom icons, tracks, routes (last-write-wins)
- Object storage for icons
- RevenueCat Pro: unlimited packs, markers, tracks; satellite and specialist layers (cycling, outdoors, marine, ski)
- Free: 15 markers, 15 tracks, 3 packs
- No ads

## Phase 6 — Terrain + CarPlay + polish

- Hillshade / 3D terrain where the GPU allows
- Contours overlay, elevation profile, slope chart
- CarPlay offline map + voice
- Apple Watch live stats (free) and independent recording (Pro) — later
- Opening hours from OSM
- Share folder / pin
- GeoJSON overlay, MGRS/UTM grid, compass, scale, one-finger zoom
- Privacy policy, location purpose strings, store assets

## Data model

```
Folder { id, name, parentId?, visible, createdAt, updatedAt }
Icon   { id, kind: builtin|upload, localUri, width, height }
Pin    { id, lat, lng, title, notes, folderId?, iconId, createdAt, updatedAt }
Track  { id, name, startedAt, endedAt, distanceM, durationS, folderId? }
TrackPoint { trackId, seq, lat, lng, ele?, time, speed? }
Route  { id, name, mode, preference: fastest|shortest|straight, folderId? }
RouteStop { routeId, seq, lat, lng, name }
MapPack { id, region, bytes, status, updatedAt }
SyncOutbox { id, entity, entityId, op, payload, updatedAt }
```

## Privacy

- Location stays on device unless the user enables sync.
- No third-party ads or trackers.
- Custom icons never leave the device until sync is on.
- OSM attribution required on the map.
- Background location copy must state battery impact.

## Cloud agent brief

See `CURSOR_AGENT.md`. Model: `composer-2` (or default). `autoCreatePR: true`. Do not merge to main without review. Do not submit to the App Store.

## Parallel product repo

`rschultz2003/bossmaps` is the branded app. Keep feature work aligned. Do not duplicate IAP or App Store Connect work in this repo.

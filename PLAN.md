# Master plan — Guru Maps parity (BossMaps)

Target: feature parity with the current Guru Maps App Store listing (offline OSM, custom pins and icons, folders, multi-stop routes, GPS tracks with stats and GPX/KML, offline search, 3D terrain, sync, CarPlay, no ads, privacy-first).

Core differentiator: easy upload of custom icons/images onto pin locations.

Ship brand: **BossMaps**. This repo is the public spec and early scaffold. Not affiliated with Guru Maps.

## Architecture decisions

- **Client:** React Native (Expo + dev client), not Flutter. Scaffold already exists; MapLibre RN supports custom symbol images for uploaded icons.
- **Map SDK:** MapLibre + OSM. No Google Maps (offline + license). Style URL configurable; default a public OSM raster/vector style for MVP.
- **Persistence:** SQLite for pins, folders, icon metadata, later tracks and routes. Icon binaries in the app documents directory, referenced by URI.
- **Backend (Phase 5):** Hono API, Postgres, object storage for custom icons and exports. Auth optional. Last-write-wins on `updatedAt`.
- **Pro:** RevenueCat. Free caps stubbed in the client (15 markers, 15 tracks, 3 packs) and enforced when IAP lands.
- **Privacy:** no ads, no analytics SDKs in MVP. Location permission strings explain on-device use.

## Phase 0 — Foundations (in repo)

- Expo + TypeScript app under `apps/mobile`
- Pin / folder / icon types
- Local store
- Built-in icon catalog
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
- Delete pin; delete unreferenced custom icons
- Offline-first local DB (no login)
- Free-tier marker cap stub (15)

**Acceptance**

- Drop 10 pins with mixed built-in and uploaded icons; kill and relaunch; all persist and render.
- Hide a folder; its pins leave the map; show again and they return.
- Custom PNG/JPEG/WebP icons render at pin size without crashing MapLibre.
- OSM attribution visible.

## Phase 2 — Offline maps + search

- Region pack download (country / metro), progress, size, delete
- Offline style + fallback when the device is offline
- MBTiles / PMTiles import hook
- Offline geocoder: name, address, category, lon/lat
- Typeahead

## Phase 3 — Routes + navigation

- Multi-stop planner with custom waypoints
- Fastest / shortest
- Straight-line mode
- Offline routing pack (Valhalla or OSRM); online router first if packs lag
- Turn-by-turn voice + auto-reroute
- Save route; export GPX/KML

## Phase 4 — Tracks

- Background GPS record (one tap)
- Live stats: speed, distance, time, elevation
- Elevation / speed chart
- Pause / resume
- GPX / KML export and import
- Track list + overlay on the map

## Phase 5 — Sync + Pro

- Optional account
- Sync pins, folders, custom icons, tracks, routes (last-write-wins)
- Object storage for icons
- RevenueCat Pro: unlimited packs, markers, tracks; satellite and specialist layers
- Free: 15 markers, 15 tracks, 3 packs
- No ads

## Phase 6 — Terrain + CarPlay + polish

- Hillshade / 3D terrain where the GPU allows
- Contours overlay, elevation profile, slope chart
- CarPlay offline map + voice
- Opening hours from OSM
- Share folder / pin
- GeoJSON overlay, MGRS/UTM grid, compass, scale
- Privacy policy, location purpose strings, store assets

## Data model (MVP)

```
Folder { id, name, parentId?, visible, createdAt, updatedAt }
Icon   { id, kind: builtin|custom, name, uri, createdAt }
Pin    { id, lat, lng, name, notes, folderId?, iconId, color?, createdAt, updatedAt }
```

Later: `Track`, `TrackPoint`, `Route`, `RouteStop`, `MapPack`, `SyncOutbox`.

## Privacy

- Location stays on device unless the user enables sync.
- No third-party ads or trackers.
- Custom icons never leave the device until sync is on.
- OSM attribution required on the map.

## Cloud agent brief

See `CURSOR_AGENT.md`. Model: `composer-2` (or default). `autoCreatePR: true`. Do not merge to main without review. Do not submit to the App Store.

## Parallel product repo

`rschultz2003/bossmaps` is the branded app. Keep feature work aligned. Do not duplicate IAP or App Store Connect work in this repo.

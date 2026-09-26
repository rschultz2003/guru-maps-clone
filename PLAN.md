# Master plan

Target: feature parity with current Guru Maps (App Store), plus easier custom-icon upload.
Ship brand: **BossMaps**. This repo is the public spec/scaffold.

## Phase 0 — Foundations (done / keep current)

- Expo + TypeScript app under `apps/mobile`
- Pin / folder / icon types
- Local store
- Built-in icon catalog
- Custom icon file copy into app documents

## Phase 1 — MVP (now)

**Must ship**

- MapLibre map, OSM vector style
- User location (when permitted)
- Long-press → create pin at coordinate
- Pin editor: name, notes, folder, color, icon
- **Custom icon upload** (photo library / files) → stored locally → rendered on map
- Folders: create, rename, nest-optional, show/hide
- Pin list + tap-to-fly
- Delete pin / delete custom icon (unreferenced)
- Offline-first local DB (no login)
- Free-tier caps stub: 15 markers (enforce later with RevenueCat)

**Acceptance**

- Drop 10 pins with mixed built-in and uploaded icons; restart app; all persist.
- Hide a folder; its pins leave the map; show again.
- Custom PNG/JPEG/WebP icons render at pin size without crashing MapLibre.

## Phase 2 — Offline maps + search

- Region pack download (country / metro)
- Pack manager UI (size, date, delete)
- Offline style + fallback when offline
- Offline geocoder (name, address, category, lon/lat)
- Typeahead

## Phase 3 — Routes + navigation

- Multi-stop planner
- Fastest / shortest
- Straight-line mode
- Offline routing pack (Valhalla/OSRM)
- TBT voice + reroute (online first if packs lag)
- Save route; export GPX/KML

## Phase 4 — Tracks

- Background GPS record
- Live stats: speed, distance, time, elevation
- Elevation chart
- Pause / resume
- GPX / KML export
- Track list + overlay on map

## Phase 5 — Sync + Pro

- Optional account
- Sync pins, folders, custom icons, tracks, routes (LWW)
- Object storage for icons
- RevenueCat Pro: unlimited packs/markers/tracks; satellite + specialist layers
- Free: 15 markers, 15 tracks, 3 packs
- No ads

## Phase 6 — Terrain + CarPlay + polish

- Hillshade / 3D terrain where supported
- CarPlay offline map + voice
- Opening hours from OSM
- Share folder / pin
- GeoJSON overlay
- Privacy policy, location purpose strings, App Store assets

## Data model (MVP)

```
Folder { id, name, parentId?, visible, createdAt, updatedAt }
Icon   { id, kind: builtin|custom, name, uri, createdAt }
Pin    { id, lat, lng, name, notes, folderId?, iconId, color?, createdAt, updatedAt }
```

## Privacy

- Location stays on device unless user enables sync.
- No third-party ads or trackers.
- Custom icons never leave the device until sync is on.
- OSM attribution required on the map.

## Cloud agent brief

See `CURSOR_AGENT.md`. Model: Composer 2 / Composer 2.5 or Grok 4.6. Open a PR; do not merge to main without review. Do not submit to App Store.

## Parallel product repo

`rschultz2003/bossmaps` is the branded app. Keep feature work aligned. Do not duplicate IAP or ASC work here.

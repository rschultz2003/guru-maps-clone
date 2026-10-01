# Offline Maps — Guru Maps feature-parity target

Privacy-first offline maps: OpenStreetMap via MapLibre, custom uploaded pin icons, folders, multi-stop routes, GPS tracks (GPX/KML), offline search, 3D terrain, optional sync, CarPlay (later), no ads.

**Not affiliated with Guru Maps, iBiker, or WPG.** This is an independent feature-parity target. Do not brand the App Store listing as a Guru Maps clone.

**Ship name:** [BossMaps](https://github.com/rschultz2003/bossmaps) (`com.studiodorje.bossmaps`). This public repo is the spec + Expo scaffold. Prefer `bossmaps` for App Store / TestFlight.

## Core differentiator

Upload any image or icon and drop it on a map coordinate. The icon is stored with the pin (local first; sync later). Folders group pins. Long-press the map → new pin → pick a built-in icon or upload a custom image (PNG / JPEG / WebP / HEIC).

## Feature matrix (current Guru Maps App Store parity)

| Area | Target |
|---|---|
| Offline maps | Download country or region vector packs (OSM). Monthly pack updates. Import MBTiles / sqlitedb. |
| Navigation | Voice turn-by-turn, auto-reroute, lane hints. Modes: car, bike, truck, walk, straight-line (sailing / off-road). |
| Routes | Multi-stop with custom waypoints. Fastest or shortest. Save plans. Export GPX/KML. |
| Terrain | True 3D relief, contours, hillshade, terrain overlays. Elevation profile and slope chart. |
| Tracks | One-tap record (background). Live speed, distance, time, altitude. Interactive graphs. Export GPX/KML. |
| Search | Offline by name, address, category, or coordinates. Typeahead. Multi-language. |
| Pins | Custom pins and icons. Folders / collections. Share with friends. |
| Hours | OSM opening hours when present. |
| Sync | One account syncs markers, tracks, collections across devices. |
| CarPlay | Offline maps + voice directions. |
| Extra | Compass, scale, MGRS/UTM grid, GeoJSON overlay, single-finger zoom. |
| Privacy | No ads. Location stays on device unless the user opts into sync. |
| Pro | Unlimited packs / markers / tracks; satellite and specialist layers. Free caps: 15 markers, 15 tracks, 3 packs. |

## Architecture

```
[Expo React Native + MapLibre native]
   |
   +-- Map screen (style, camera, user location, pins as symbol layer)
   +-- Offline pack manager (PMTiles / MBTiles, region index)
   +-- SQLite (pins, folders, icons metadata, tracks, routes)
   +-- Icon files in app documents (custom uploads)
   +-- Optional sync client (outbox, last-write-wins)
          |
          v
[Hono API] -- Postgres (entities) + object storage (icons, GPX)
          |
          +-- Auth (magic link / Clerk)
          +-- RevenueCat webhooks (Pro entitlement)
```

Local-first: the app is fully usable with no account. Sync is opt-in.

## Tech stack

- **Client:** React Native + Expo (dev client) + TypeScript + `@maplibre/maplibre-react-native`
- **Tiles:** OSM vector style (MapTiler or self-hosted). Offline via PMTiles / MBTiles pack download.
- **Routing:** Valhalla or OSRM offline pack; straight-line fallback. Online router until packs exist.
- **Search:** Offline gazetteer (Nominatim extract or photon-style index) plus coordinate parser.
- **Storage:** SQLite (`expo-sqlite`) for entities; MMKV for settings; icon bytes in `FileSystem.documentDirectory`.
- **Tracks:** `expo-location` background updates; GPX/KML writers.
- **Sync API:** Hono + Postgres + S3-compatible object storage.
- **Auth:** optional email magic link or Clerk. No login required for MVP.
- **IAP:** RevenueCat (Pro monthly / yearly / lifetime).
- **CarPlay:** native module after navigation exists (Phase 6). Not in the Expo Go path.

Flutter was considered (better map plugins in some cases). React Native + Expo wins here because the existing scaffold is Expo, MapLibre RN is mature enough for symbol images, and CarPlay / IAP paths are already known in the BossMaps repo.

## Repo layout

```
README.md            This spec
PLAN.md              Phases and acceptance criteria
CURSOR_AGENT.md      Cloud-agent brief
STATUS.md            Build status
apps/mobile          Expo MVP (map, pins, custom icons, folders)
```

## MVP (Phase 1)

1. MapLibre map with an OSM raster or vector style and OSM attribution.
2. Long-press to drop a pin at the coordinate.
3. Built-in icon set plus **user-uploaded custom icon** attached to the pin and rendered on the map.
4. Folders/collections: create, rename, show/hide.
5. Local persistence. Restart keeps pins, folders, and icon files.
6. Offline-ready tile source hook (online style first; pack download is Phase 2).

## Run

```bash
cd apps/mobile && npm install && npx expo start
```

A dev client is required for MapLibre native modules. Expo Go will not load the map.

## License

Private product work. OSM data © OpenStreetMap contributors (ODbL). Map style attribution required on screen.

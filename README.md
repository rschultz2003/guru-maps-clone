# Guru Maps Clone (working name)

Privacy-first offline maps for iOS, Android, and later macOS. Inspired by [Guru Maps](https://apps.apple.com/us/app/guru-offline-maps-gps-tracker/id321745474): OpenStreetMap tiles, custom pins with user-uploaded icons, folders, multi-stop routes, GPS tracks, GPX/KML, offline search, 3D terrain, sync, CarPlay, no ads.

**Core differentiator:** tap the map → pick or upload an image/icon → pin that exact location. Icons stay on-device first and sync when the user wants.

> Product note: the live branded product in this org is **BossMaps** (`rschultz2003/bossmaps`). This repo is the public clone spec + scaffold. Do not ship App Store listings as “Guru Maps”.

## Feature parity target (current Guru Maps App Store)

| Area | Spec |
|---|---|
| Offline maps | Download country/region packs (OSM / vector). Monthly pack updates. |
| Navigation | Voice turn-by-turn, auto-reroute, lane guidance. Modes: car, bike, truck, walk, straight-line (off-road / sailing). |
| Routes | Multi-stop + custom waypoints. Fastest / shortest. Save plans. GPX/KML export. |
| 3D terrain | True 3D relief, contours, hillshade, topo overlays, elevation + slope profiles. |
| GPS tracks | One-tap record (background). Live speed, distance, time, altitude. Graphs. GPX/KML. |
| Search | Offline by name, address, category, coordinates. Typeahead, multi-language. |
| POI | Custom pins + **user-uploaded icons**. Folders / collections. Share. |
| Hours | Opening hours when OSM / Places data exists. |
| Sync | Account backup of markers, tracks, collections across devices. |
| Import maps | MBTiles / sqlitedb custom sources. |
| CarPlay | Offline map + voice directions on head unit. |
| Monetization | Free + Pro. No ads. Pro: unlimited packs, unlimited markers/tracks, satellite + specialty layers. |
| Privacy | Location stays on device unless user enables sync. No ad SDKs. No sale of location. |

## Tech stack (locked for MVP)

| Layer | Choice | Why |
|---|---|---|
| App | **Expo + React Native** (TypeScript) | Fast iteration, EAS, shared with BossMaps. Flutter is the fallback if RN MapLibre offline packs stall. |
| Maps | **MapLibre GL Native** (`@maplibre/maplibre-react-native`) | OSM-friendly, offline style + tiles, no Google Maps ToS. |
| Tiles | OpenMapTiles / Protomaps PMTiles + regional MBTiles | Downloadable packs. |
| Routing | Valhalla or OSRM graph packs offline; GraphHopper as online fallback | Offline nav later. |
| Search | Offline geocoder index (Pelias extract or compact SQLite / Who’s On First subset) | Offline typeahead. |
| Local DB | SQLite via `expo-sqlite` + Drizzle | Pins, folders, tracks, icon metadata. |
| Icons | On-device filesystem (`expo-file-system`) + optional object store | Upload images → hashed files → pin.iconId. |
| Auth / sync | Optional account: Clerk or Better Auth + Postgres + S3-compatible | Phase 3. Local-first CRDT or last-write-wins per entity. |
| Pro | RevenueCat | IAP without building store glue twice. |
| CarPlay | Native iOS module after MVP | Phase 4. |

## Repo layout (target after MVP scaffold)

```
apps/mobile/          Expo RN app
packages/core/        Shared types, GPX/KML, geo utils
packages/map/         MapLibre style, offline pack manager
docs/                 PLAN.md lives at root
```

## MVP (Phase 1) — ship this first

1. Full-screen MapLibre map (online OSM style first; pack download stub).
2. Long-press / tap → create pin at lat/lng.
3. **Custom icon upload**: camera roll or files → resize/square crop → store locally → render as map symbol.
4. Built-in icon set + “use my image”.
5. Pin editor: title, notes, folder, icon.
6. Folders / collections: create, rename, move pins, show/hide on map.
7. Pin list + tap-to-fly.
8. Offline-capable local store (pins + icons survive kill).
9. No account required.

## Run (after scaffold)

```bash
cd apps/mobile
npx expo start
```

## License / data

Map data © OpenStreetMap contributors. Do not rebrand as Guru Maps. Icon uploads remain the user’s files.

See [PLAN.md](./PLAN.md) for phases, API sketch, and Cursor agent brief.

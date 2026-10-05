# Atlas Maps

Working name: **Atlas Maps** (package `atlas-maps`). Ship name may be **BossMaps**.

Original offline maps client matching the public Guru Maps feature list (App Store id 321745474 / Pro id 891362701). **Not affiliated** with Guru Maps, WPG, or Evgen Bodunov. Do not copy their name, icons, screenshots, or styles into the UI or store listing. OpenStreetMap attribution stays visible.

Repo: https://github.com/rschultz2003/guru-maps-clone

## Core differentiator

Users upload their own icons or photos and drop them on exact coordinates. Icons are stored on device (and later in the account), rendered as map symbols, and grouped in folders. That is the MVP bar.

## Feature parity (public listing)

| Area | Behavior |
| --- | --- |
| Offline maps | Download country or region packs once. Works with no signal. Monthly OSM refresh. Import `.mbtiles` and `.sqlitedb`. |
| Navigation | Voice turn-by-turn, auto reroute, lane guidance. Modes: drive, bike, truck, walk, straight-line (off-road / marine). |
| Routes | Multi-stop, custom waypoints, fastest or shortest, save plans, export GPX/KML. |
| 3D terrain | True 3D relief, contours, hillshade, topo overlay, elevation profile and slope chart. |
| Tracks | One-tap record (background), live speed / distance / time / altitude, charts, GPX/KML/GeoJSON export. |
| Search | Offline by name, address, category, or coordinates. Typeahead. Multi-language. |
| POI | Custom pins and uploaded icons. Folders/collections. Share. Opening hours when OSM has them. |
| Sync | One account across iOS and Android (desktop later). Markers, tracks, collections, icon blobs. |
| CarPlay | Offline map and voice navigation. |
| Privacy | No ads in any tier. Location stays on device unless the user turns sync on. |
| Extra | Compass, scale, MGRS / UTM / Plus codes, GeoJSON and MapCSS overlay, GPS accuracy filter, bearing line to a pin, backup restore. |

Pro (later): unlimited pins, tracks, and region downloads; satellite and specialist layers (cycling, outdoors, marine, ski). Free stub warns at 15 markers. No IAP in Phase 1.

## Stack

- Mobile: Expo / React Native + TypeScript in `apps/mobile`. Flutter was considered; Expo is already scaffolded and ships image upload faster.
- Map: MapLibre (`@maplibre/maplibre-react-native`) with an OSM vector style. Custom icons are style images, not colored dots.
- Local data: `expo-sqlite` for folders, pins, tracks, track points, icon metadata. Icon files in the documents directory (`icons/{id}.webp`).
- Offline tiles (Phase 2): PMTiles or MBTiles regional packs. Switch the style source to a local file when the pack covers the viewport.
- Routing (Phase 3): Valhalla or OSRM. Voice prompts via `expo-speech` first, native TTS later.
- Search (Phase 2): on-device index extracted from the regional pack.
- Sync (Phase 5): Hono on Cloudflare Workers, R2 for icon blobs, D1 for pins/tracks. Contract in `docs/sync-api.md`. Auth: magic link or Sign in with Apple. Pro via RevenueCat.
- On-device is source of truth until sync is opted in.

## Run

```bash
cd apps/mobile
npm install
npx expo prebuild
npx expo run:ios   # or run:android
```

MapLibre needs a dev build. Expo Go is not enough.

## Phases

See `PLAN.md`. Current code is a Phase 1 scaffold: long-press pins, built-in and custom icons, folders, SQLite, GPX/KML writers.

Open draft: https://github.com/rschultz2003/guru-maps-clone/pull/2

## Cloud Agent

```bash
export CURSOR_API_KEY=key_...   # https://cursor.com/dashboard/api
bash scripts/launch-cloud-agent.sh
```

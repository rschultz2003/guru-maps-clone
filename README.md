# Atlas Maps (Guru Maps feature-parity spec)

Working name: **Atlas Maps** (package `atlas-maps`). Product ship name may be **BossMaps**.

This repo is an original offline maps client inspired by the public feature list of Guru Maps (App Store id 321745474). It is **not affiliated** with Guru Maps / WPG / Evgen Bodunov. Do not copy their name, icons, screenshots, or map styles into the app UI or store listing.

Maps are OpenStreetMap-based. OSM attribution must stay visible.

Repo: https://github.com/rschultz2003/guru-maps-clone

## Core differentiator

Users upload their own icons or photos and pin them to exact coordinates. Icons are stored on device (and, later, in the user account), rendered as map symbols, and organized in folders. That is the MVP bar.

## Feature parity (public App Store listing)

| Area | Behavior |
| --- | --- |
| Offline maps | Download country/region packs once. Use with no signal. Monthly OSM refresh. Import MBTiles / sqlitedb. |
| Navigation | Voice turn-by-turn, auto reroute, lane guidance. Modes: drive, bike, truck, walk, straight-line (off-road / marine). |
| Routes | Multi-stop, custom waypoints, fastest or shortest, save plans, export GPX/KML. |
| 3D terrain | True 3D relief, contours, hillshade, topo overlay, elevation profile and slope chart. |
| Tracks | One-tap record (background), live speed/distance/time/altitude, interactive charts, GPX/KML export. |
| Search | Offline by name, address, category, or coordinates. Instant typeahead. Multi-language. |
| POI | Custom pins and uploaded icons. Folders/collections. Share. Opening hours when data exists. |
| Sync | One account across iOS, Android, later desktop. Markers, tracks, collections. |
| CarPlay | Offline map + voice navigation. |
| Privacy | No ads. Location stays on device unless the user turns sync on. |
| Extra | One-finger zoom, compass, scale bar, MGRS/UTM/Plus codes, GeoJSON overlay, GPS accuracy filter, bearing line to a pin. |

## Stack

- Mobile: Expo / React Native + TypeScript (`apps/mobile`). MapLibre (`@maplibre/maplibre-react-native`).
- Local data: `expo-sqlite`. Icon files in the app documents directory.
- Offline tiles: PMTiles or MBTiles regional packs, plus a raster/vector OSM style with attribution.
- Routing (later): Valhalla or OSRM public instance, then self-hosted tiles+routing.
- Search (later): on-device geocoder index extracted from the regional pack (Photon/Pelias extract or Nominatim dump subset).
- Sync API (later): Hono on Cloudflare Workers, R2 for icon blobs, D1/Postgres for pins/tracks. See `docs/sync-api.md`.
- Auth: email magic link or Sign in with Apple. Pro via RevenueCat (not in MVP).
- Flutter was considered; Expo is already scaffolded and ships custom image upload faster.

## Run the mobile scaffold

```bash
cd apps/mobile
npm install
npx expo start
```

Dev build is required for MapLibre native modules (`npx expo prebuild` then run on a device/simulator). Expo Go is not enough.

## Phases

See `PLAN.md`. Current code is Phase 1 scaffold: long-press pins, built-in and custom icons, folders, SQLite, GPX/KML writers.

## Cloud Agent

```bash
export CURSOR_API_KEY=key_...   # https://cursor.com/dashboard/api
bash scripts/launch-cloud-agent.sh
```

Open draft: https://github.com/rschultz2003/guru-maps-clone/pull/2

# Atlas Maps

Privacy-first offline maps client inspired by the public feature set of Guru Maps (App Store id 321745474), **not affiliated** with Evgen Bodunov or Guru Maps. Do not copy their name, icons, screenshots, trademarks, or store copy into the product UI or metadata.

**Core differentiator**: Drop a pin and easily upload your own custom icon or photo onto that coordinate. Organize in folders/collections. Fully offline-capable where possible. Rendered as first-class MapLibre symbols.

Repo: https://github.com/rschultz2003/guru-maps-clone

## Product parity target

Match the public Guru Maps surface (as of v6.4, Oct 2026), then exceed it on custom icons.

- **Offline maps** (OpenStreetMap): Download country/region once. Monthly updates. Import MBTiles / PMTiles / sqlitedb. Vector style (OpenFreeMap Liberty or self-hosted). Visible OSM attribution always.
- **Custom pins & icons**: Users upload PNG/JPEG/WebP images as pin icons at specific locations. Stored locally (resized ~128px WebP), rendered via MapLibre `Images` / `addImage` + SymbolLayer. Built-in icons + user packs. Easy upload is the differentiator.
- **Folders / collections**: Create, rename, reorder, show/hide, share. Hidden folders do not render markers.
- **Multi-stop route planning**: Waypoints, fastest/shortest, modes (drive, bike, walk, truck, straight-line). Save, export GPX/KML.
- **GPS track recording**: Background, live stats (speed, distance, time, altitude), elevation/slope charts, filter noise, export GPX/KML. Optional 3D flyover video share.
- **Offline search**: Name, address, category, coordinates. Instant as-you-type, multi-language. Typo-tolerant online fallback.
- **3D terrain**: Hillshade, contours, True 3D relief, elevation profiles, slope charts.
- **Sync**: Account-based sync of markers, tracks, collections, icons across devices. Opt-in. Last-write-wins + tombstones.
- **CarPlay**: Offline maps + voice directions.
- **Apple Watch**: Companion for active track recording and navigation prompts.
- **No ads. Privacy-first**: Location stays on device. No third-party analytics in free tier.
- Free tier limits (e.g., 15 markers); Pro unlocks unlimited + offline regions + tracks + sync + specialized layers + 3D.

## Tech stack

- **Mobile**: React Native + Expo + TypeScript (`apps/mobile`). Cross-platform iOS/Android (iOS first for CarPlay later).
- **Maps**: `@maplibre/maplibre-react-native`. Style: `https://tiles.openfreemap.org/styles/liberty` (OSM, attribution required). Offline via OfflineManager or PMTiles.
- **Local persistence**: `expo-sqlite` for markers/folders/tracks metadata. Icon files in app documents directory (`icons/{id}.webp`).
- **Images**: `expo-image-picker` + `expo-image-manipulator` (resize to ~128px WebP for performance).
- **Location**: `expo-location` (background for tracks).
- **Backend (Phase 4)**: Lightweight API (Cloudflare Workers or Node) + object storage for icons + Postgres/SQLite for sync. Magic-link auth. Last-write-wins + tombstones.
- **Routing**: Valhalla or OSRM (online first, offline graph later).
- **Export**: GPX/KML writers already scaffolded.

## Layout

```
apps/mobile          Expo app (MVP + future phases)
docs/                API contracts, sync spec
PLAN.md              Phased master plan
CURSOR_AGENT.md      Instructions for Cursor Cloud Agents
scripts/             launch-cloud-agent.sh
STATUS.md            Current status and launch instructions
```

## Run the MVP

```bash
cd apps/mobile
npm install
npx expo start
```

Long-press map to drop pin. Editor supports name, notes, folder, built-in or uploaded custom icon. Data persists in SQLite. Custom icons render via MapLibre SymbolLayer.

## Cloud Agent handoff

Requires `CURSOR_API_KEY` from https://cursor.com/dashboard/api (Basic auth `KEY:`).

```bash
export CURSOR_API_KEY=key_...
bash scripts/launch-cloud-agent.sh
```

Or use the exact curl in STATUS.md. Agent scaffolds/implements/polishes MVP (map + custom icon upload + pins + folders), opens PR.

See PLAN.md for full phases and acceptance criteria.

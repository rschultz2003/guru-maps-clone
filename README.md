# Atlas Maps

Privacy-first offline maps client inspired by the feature set of Guru Maps (App Store id 321745474), not affiliated with Evgen Bodunov or Guru Maps. Do not copy their name, icons, screenshots, or store copy into the product UI.

Core differentiator: drop a pin and upload your own icon or photo onto that coordinate, organized in folders, usable offline.

Repo: https://github.com/rschultz2003/guru-maps-clone

## Product parity target

Match the public Guru Maps surface, then exceed it on custom icons.

- Offline maps from OpenStreetMap. Download a country or region once. Monthly style/data refresh. Import MBTiles / PMTiles.
- Custom pins and user-uploaded icons (PNG, JPEG, WebP) stored locally and rendered as map symbols.
- Folders / collections with show, hide, reorder, and share.
- Multi-stop route planning: fastest or shortest, drive / bike / walk / truck / straight-line. Save plans. GPX and KML export.
- GPS track recording with background support, live stats (speed, distance, time, altitude), elevation and slope charts, GPX/KML export.
- Offline search by name, address, category, or coordinate.
- 3D terrain: hillshade, contours, elevation profile.
- Account sync of markers, tracks, and collections. No ads. Optional Pro tier.
- CarPlay later. Apple Watch companion later.

Free tier: online vector map, 15 markers, 1 custom icon pack of 20 images, no tracks longer than 1 hour. Pro (planned IAP, not in MVP): unlimited markers, offline regions, tracks, 3D terrain, sync.

## Stack

- Mobile: React Native + Expo + TypeScript in `apps/mobile`.
- Map: `@maplibre/maplibre-react-native`. Vector style from a public OSM-compatible source (OpenFreeMap / Protomaps). Attribution required.
- Local data: `expo-sqlite`. Icon files in the app documents directory.
- Location: `expo-location` (Phase 2+).
- Images: `expo-image-picker` + `expo-image-manipulator` (resize to 128px WebP).
- Backend (Phase 4): small Node or Cloudflare Worker API, object storage for icons, Postgres or SQLite for accounts. Auth via email magic link. E2E optional later.
- Routing (Phase 2): Valhalla or OSRM public endpoint, cached offline after download.

## Layout

```
apps/mobile          Expo app (MVP lives here)
docs/sync-api.md     Sync contract
PLAN.md              Phased master plan
CURSOR_AGENT.md      Cloud Agent instructions
scripts/launch-cloud-agent.sh
```

## Run the MVP scaffold

```bash
cd apps/mobile
npm install
npx expo start
```

Long-press the map to drop a pin. Pin editor accepts a name, notes, folder, built-in icon, or an uploaded image. Data is in SQLite.

## Cloud Agent

`CURSOR_API_KEY` is required (Cursor Dashboard → API Keys). Basic auth is `KEY:` (empty password).

```bash
export CURSOR_API_KEY=key_...
bash scripts/launch-cloud-agent.sh
```

The script POSTs `https://api.cursor.com/v1/agents` with `model.id=composer-2`, `autoCreatePR=true`, and this repo as `startingRef=main`.

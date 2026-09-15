# Trail Pin — Guru Maps-inspired offline navigator

Working name: **Trail Pin**. Product goal: feature-parity with [Guru Maps](https://apps.apple.com/us/app/guru-offline-maps-gps-tracker/id321745474) on iOS/Android, with one core differentiator — **upload any image as a map pin icon and drop it on a location in two taps**.

This is an independent app. It is not affiliated with, endorsed by, or a fork of Guru Maps / BRIDGESOFT. Do not copy assets, trademarks, or proprietary map packs.

## Product thesis

Guru Maps wins on offline OSM maps, custom markers, folders, multi-stop routes, GPS tracks, GPX/KML, 3D relief, sync, CarPlay, and a no-ads privacy stance. Trail Pin matches that surface area and makes **custom icon upload** the fastest path from photo → pin → map.

## Feature spec (parity + differentiator)

### Offline maps (OpenStreetMap)
- Download country/region vector tiles once; use with no network.
- Monthly-style pack updates when online.
- Import extra packs: **MBTiles** and **sqlitedb**.
- Online fallback tiles when no pack is installed (user-toggleable).

### Custom pins and icons (core differentiator)
- Long-press map → New pin → name, notes, folder, color, icon.
- Built-in icon set + **user-uploaded images** (PNG/JPEG/WebP/SVG rasterized).
- Per-pin custom image; library of reusable icons scoped to the user.
- Resize, crop, circular/square badge, optional halo for contrast on satellite/terrain.
- Pins work offline; icons stored on-device and sync when Pro/account is on.

### Folders / collections
- Nested folders for pins, tracks, and saved routes.
- Show/hide folder layers on the map.
- Share a folder as GPX/KML/GeoJSON.

### Multi-stop route planning
- Origin + N waypoints + destination.
- Profiles: car, bike, truck, walk, straight-line (off-road / sailing).
- Fastest vs shortest.
- Save plans; export GPX/KML.
- Phase 2: voice TBT, auto-reroute, lane guidance.

### GPS track recording
- One-tap record; background recording on iOS/Android.
- Live stats: speed, distance, time, altitude.
- Post-record graphs: elevation, speed, slope.
- Export/import GPX and KML.

### Offline search
- Name, address, category, coordinates (WGS84, plus MGRS/UTM display).
- Typeahead; multi-language labels from OSM.
- Opening hours when present in OSM tags.

### 3D terrain
- Hillshade, contours, topographic overlay.
- True 3D relief (pitch/bearing) where the SDK allows.
- Elevation profile for selected track/route.

### Sync
- Account (email/Apple/Google).
- Sync pins, icon library, folders, tracks, routes.
- Device-local is source of truth until sync succeeds (CRDT or last-write-wins + tombstones).

### CarPlay / Android Auto
- Phase 3: map + voice directions + recents/favorites. Not in MVP.

### Privacy and monetization
- No ads. Location stays on-device unless the user enables sync.
- Free: map + pins + custom icons (local) + folders + basic search.
- **Pro**: offline country packs beyond a trial region, navigation, track analysis, multi-device sync, CarPlay, MBTiles import extras.

### Extra (later)
- One-finger zoom, compass, scale bar.
- Coordinate grids (MGRS/UTM).
- GeoJSON overlays.

## Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Client | **React Native (Expo)** + TypeScript | Fast iterate, EAS builds, one codebase iOS/Android |
| Map | **MapLibre Native** (`@maplibre/maplibre-react-native`) | OSM-friendly, offline tiles, 3D pitch |
| Offline tiles | PMTiles / MBTiles via local file + MapLibre | Packs downloadable as files |
| Routing (online MVP stub / later offline) | OSRM / Valhalla public or self-host; GraphHopper offline later | Multi-profile |
| Local DB | **WatermelonDB** or SQLite (`expo-sqlite`) | Offline-first pins/folders/tracks |
| Icon files | On-device FS + object storage (R2/S3) when syncing | Differentiator |
| Auth / sync API | Node (Hono) or Supabase | Fast; RLS if Supabase |
| Payments | RevenueCat + App Store / Play | Pro entitlements |

Flutter is a valid alternative if we later need tighter native map performance; Expo is the default so Cursor agents can scaffold and PR quickly.

## Repo layout (target after MVP scaffold)

```
app/                 # Expo Router screens: map, pin editor, folders, library
src/map/             # MapLibre view, style, offline packs
src/pins/            # Pin model, icon upload, drop-on-map
src/folders/
src/tracks/
src/routing/
src/sync/
assets/icons/        # default pin set
docs/                # this spec lives at root as README + PLAN
```

## Legal

- Map data: OpenStreetMap © contributors, ODbL. Attribute in-app and README.
- Do not use the Guru Maps name, logo, or screenshot clones in store listings.
- User-uploaded icons: user retains rights; we store only what they upload.

## Status

See [PLAN.md](./PLAN.md). Phase 0 = spec. Phase 1 = MVP map + custom icon pins + folders.

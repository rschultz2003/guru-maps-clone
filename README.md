# Guru Maps Clone (working title)

Offline-first maps app specified against current Guru Maps (App Store id `321745474`). Core differentiator: **easy upload of custom icons/images onto map pins**.

**Shipping product brand in this org:** [BossMaps](https://github.com/rschultz2003/bossmaps). This repo is the public spec + MVP scaffold target. Do not submit to App Store as "Guru Maps".

## Product (parity with Guru Maps)

- Offline maps powered by OpenStreetMap (download country/region once; monthly updates)
- Custom pins and **user-uploaded icons/images** at any location
- Folders / collections; share collections
- Multi-stop route planning (fastest/shortest), GPX/KML export
- Offline turn-by-turn: car, bike, truck, walk, straight-line; voice + lane guidance; auto-reroute
- GPS track recording (background): speed, distance, time, altitude; charts; GPX/KML export
- Offline search: name, address, category, coordinates; typeahead; multi-language
- True 3D relief / terrain: contours, hillshade, elevation profile + slope
- Account sync of markers, tracks, collections across devices
- CarPlay
- No ads. Privacy-first: location stays on device unless user opts into sync
- Power: one-finger zoom, compass/scale, MGRS/UTM grids, GeoJSON overlays, MBTiles / sqlitedb import
- Hours of operation when OSM data has them

### Pro tier (Guru Maps Pro analog)

- Unlimited offline map downloads
- Unlimited markers and GPS tracks
- Pro map sources (satellite + specialized: cycling, outdoor, nautical, ski)
- Thunderforest-style extra layers

Free tier: limited offline regions + marker/track caps (exact caps TBD; default 3 regions / 100 pins / 20 tracks).

## Differentiator UX (must-ship in MVP)

1. Long-press map → **Drop pin**.
2. Sheet: name, notes, folder, color.
3. **Icon**: pick preset **or Upload photo / PNG / SVG** from camera roll.
4. Icon is cropped to circle/square, stored locally, rendered as the pin glyph at that coordinate.
5. Icon library is reusable across pins; per-pin override allowed.

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| App | **React Native + Expo** (TypeScript) | Fast iOS/Android; EAS; CarPlay later via native module |
| Maps | **MapLibre GL Native** (`@maplibre/maplibre-react-native`) | OSM styles, offline packs, no Google lock-in |
| Tiles | OSM raster/vector via self-hosted or OpenMapTiles + offline MBTiles | Matches Guru Maps OSM base |
| Routing | Valhalla or OSRM offline graph packs | Offline multi-stop |
| Search | Offline geocoder (Pelias extract or Nominatim-derived pack) | Offline typeahead |
| Local DB | SQLite (WatermelonDB or expo-sqlite) + filesystem for icons/tiles | Offline-first |
| Sync | Optional account: Fastify/Hono API + object storage for icons | Privacy: local by default |
| Auth | Apple/Google + email magic link | |
| Billing | RevenueCat + App Store / Play | Pro |
| Tracks | Background location + GPX/KML serializers | |
| 3D | MapLibre terrain + DEM tiles (Terrarium/Mapzen) | True 3D relief |

Not Flutter for this pass: BossMaps / Expo toolchain already in-house.

## Repo layout (target after MVP scaffold)

```
app/                 # Expo Router screens: map, pins, folders, tracks, settings
components/          # MapView, PinMarker, IconPicker, FolderTree
lib/
  db/                # schema: pins, folders, icons, tracks, routes, packs
  maps/              # MapLibre style, offline pack manager
  icons/             # upload, resize, hash, local URI
  export/            # GPX / KML
sync-api/            # optional backend (Phase 4)
assets/
PLAN.md
```

## Privacy

- No ads, no trackers, no third-party analytics by default.
- GPS stays on-device. Sync is opt-in and encrypted in transit.
- Custom icons never leave the device unless sync is enabled.
- Privacy Nutrition Labels: location only for navigation/tracks the user starts.

## Status

See [PLAN.md](./PLAN.md) and [STATUS.md](./STATUS.md). Live build is handed to Cursor Cloud Agents against this repo.

## License

Private/public prototype. OSM data © OpenStreetMap contributors (ODbL).

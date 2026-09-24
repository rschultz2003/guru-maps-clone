# Offline Maps (Guru Maps-inspired)

Privacy-first offline maps: OpenStreetMap via MapLibre, custom uploaded pin icons, folders, multi-stop routes, GPS tracks (GPX/KML), offline search, 3D terrain, optional sync, CarPlay (later), no ads.

**Not affiliated with Guru Maps, iBiker, or WPG.** Feature parity target only.

**Ship name:** [BossMaps](https://github.com/rschultz2003/bossmaps) (`com.studiodorje.bossmaps`). This repo is the public spec + early scaffold. Do not brand the App Store listing as a Guru Maps clone.

## Core differentiator

Upload any image/icon and drop it on a map coordinate. Icons live with the pin (local first; sync later). Folders group pins. Long-press map → new pin → pick built-in or custom icon.

## Feature matrix (parity target)

| Area | Target |
|---|---|
| Offline maps | Download country/region vector packs (OSM). Monthly pack updates. |
| Navigation | Offline TBT, auto-reroute, lane hints. Modes: car, bike, truck, walk, straight-line. |
| Routes | Multi-stop, fastest/shortest, save, GPX/KML export. |
| Terrain | Hillshade / relief / contours (True 3D where GPU allows). |
| Tracks | Record in background, live speed/distance/time/elevation, charts, GPX/KML. |
| Search | Offline name / address / category / coordinates, typeahead, multi-language. |
| Pins | Custom icons (user upload), folders/collections, share. |
| Hours | OSM opening hours when present. |
| Sync | Account backup of markers, tracks, collections (LWW). |
| CarPlay | Offline maps + voice (Phase 6). |
| Privacy | No ads. Location on-device unless user opts into sync. |
| Pro | Unlimited packs / markers / tracks; satellite + specialist layers. Free caps: 15 markers, 15 tracks, 3 packs. |

## Tech stack

- **Client:** React Native + Expo + MapLibre (`@maplibre/maplibre-react-native`) + expo-dev-client
- **Tiles:** OSM vector (MapTiler / self-hosted tiles + offline pack manager)
- **Routing:** offline-capable engine (Valhalla or OSRM pack; straight-line fallback)
- **Storage:** SQLite / MMKV on device; icon files in app documents
- **Sync API:** Hono + Postgres + object storage for icons (Phase 4+)
- **Auth:** Clerk or email magic (optional)
- **IAP:** RevenueCat (Pro monthly / yearly / lifetime)

## Repo layout

```
PLAN.md              Phases
CURSOR_AGENT.md      Cloud-agent brief
apps/mobile          Expo app (if present here)
```

Live product code lives in **rschultz2003/bossmaps**.

## Run

Prefer `bossmaps/apps/mobile`:

```bash
cd apps/mobile && npm install && npm start
```

Dev client required for MapLibre.

## License

Private product work. OSM data © OpenStreetMap contributors (ODbL).

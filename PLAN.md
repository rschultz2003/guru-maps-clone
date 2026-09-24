# Master plan

Updated 25 Sep 2026 (AEST). Ship vehicle: **BossMaps** (`rschultz2003/bossmaps`). This repo holds the public spec.

## Architecture

```
[Expo RN + MapLibre]
  MapView (vector style + hillshade)
  Pin layer (custom icon images registered in style)
  Route layer + track recorder
  Offline pack manager
        |
        +-- local SQLite (pins, folders, tracks, packs)
        +-- local icon files
        |
[optional] Sync API (Hono)
  users, collections, pins, tracks (LWW)
  object store for icon blobs
```

### Why RN/Expo not Flutter

BossMaps is already RN + MapLibre. Do not rewrite.

### Icon pipeline (differentiator)

1. User picks image (camera / library / files).
2. Resize/normalize (e.g. 128² PNG, transparent).
3. Store file + `iconId` on pin.
4. Register image with MapLibre `addImage` before symbol layer render.
5. On sync, upload blob; other devices pull + register.

## Phases

### Phase 0 — Scaffold
Expo app, MapLibre map, location permission, glass map chrome.

### Phase 1 — MVP (current priority if clone scaffold lags)
- Long-press drop pin
- Custom icon upload + built-in set
- Pin edit (name, notes, folder, color)
- Folders / collections
- Offline pack download for visible region (or country list)
- Offline search stub (local POI index or pack gazetteer)

### Phase 2 — Navigation + routes
Multi-stop planner, car/bike/walk, export GPX/KML.

### Phase 3 — Tracks + terrain
Background GPS record, stats + charts, hillshade/3D pitch.

### Phase 4 — Sync + Pro
Auth, LWW sync, RevenueCat gates (15/15/3 free), satellite layer.

### Phase 5 — Parity polish
Truck + straight-line, opening hours, share folder, voice steps, no-ads audit.

### Phase 6 — Platforms
CarPlay, watch, web viewer. Human App Store submit only with Reuben approval.

## Coding agents

Composer 2.5 or Grok 4.6 only. No Claude. No App Store submit / spend without CoS + Reuben.

## Cursor Cloud Agents

POST `https://api.cursor.com/v1/agents` with repo `https://github.com/rschultz2003/guru-maps-clone` or prefer `bossmaps`, `autoCreatePR: true`, model `composer-2`.

Prompt must: scaffold/continue Expo+MapLibre, implement custom icon upload on pins, offline pack hook, open a PR. Never brand UI as Guru Maps.

## Owners

- Product code: BossMaps Bot (`rschultz2003/bossmaps`)
- Coordination: BossMaps Manager + Chief of Staff

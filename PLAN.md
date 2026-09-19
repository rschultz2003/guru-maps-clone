# Master plan — Guru Maps clone / BossMaps sister spec

Last updated: 2026-09-20

## 0. Intent

Build an offline-first maps app that matches current Guru Maps App Store capabilities, with one sharper wedge: **uploading custom images as map pin icons is a first-class, two-tap flow**.

Public repo: https://github.com/rschultz2003/guru-maps-clone
Private product repo: https://github.com/rschultz2003/bossmaps

Cloud coding: Composer 2.5 or Grok 4.6 only. No App Store submit without Reuben / CoS approval.

## 1. Architecture

```
┌───────────────────────────────────────────────┐
│  Expo RN client                             │
│  MapLibre · SQLite · FileSystem · GPS       │
│  local-first entities                       │
└────────────────┬───────────────────────────────┸
                │ optional sync (Phase 3)
                ▼
┌────────────────────────────────────────────────┐
│  API (Hono / Convex / or existing BossMaps) │
│  Auth · icon blobs · CRDT/LWW documents     │
└────────────────┬───────────────────────────────┸
                ▼
         Postgres + object storage
```

**Local-first rule:** every pin, folder, track, and icon file works with airplane mode. Sync is a replica, not the source of truth.

### Data model (MVP)

```ts
type Folder = {
  id: string;
  name: string;
  parentId: string | null;
  visible: boolean;
  updatedAt: number;
};

type IconAsset = {
  id: string;
  kind: "builtin" | "upload";
  localUri: string;      // file:// or asset
  remoteUrl?: string;
  width: number;
  height: number;
};

type Pin = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  notes: string;
  folderId: string | null;
  iconId: string;
  createdAt: number;
  updatedAt: number;
};

type Track = {
  id: string;
  name: string;
  points: { lat: number; lng: number; alt?: number; t: number }[];
  stats: { distanceM: number; durationS: number; elevGainM: number };
};
```

## 2. Phases

### Phase 1 — MVP (this Cursor run)

- Expo TS app + MapLibre map
- Custom icon upload → pin
- Folders
- Local SQLite + filesystem
- Online OSM style; offline pack **manager UI stub** (download one small region if time)
- README run instructions

**Done when:** on a simulator, user picks a photo, drops a pin, sees that photo as the marker, puts it in a folder, kills the app, data is still there.

### Phase 2 — Navigation + tracks

- Multi-stop route planner (online router first)
- Fastest / shortest
- GPX/KML import/export for routes + tracks
- Track recorder + live stats + simple charts
- Background location (with permission copy)

### Phase 3 — Offline + search + sync

- Regional vector/MBTiles or PMTiles downloads
- Offline search index for downloaded region
- Account + sync of pins, icons, folders, tracks
- Conflict policy: LWW per entity, icons content-addressed

### Phase 4 — Terrain, CarPlay, Pro

- Hillshade / contours / 3D pitch+exaggeration
- Elevation profiles
- CarPlay scene (iOS native)
- RevenueCat Pro: unlimited packs, satellite/specialty styles
- Opening hours overlay when tags exist

### Phase 5 — Parity polish

- Lane guidance, truck/bike profiles, straight-line nav
- Share folders
- Custom map sources (MBTiles / sqlitedb)
- macOS / larger iPad layouts

## 3. Custom icon pipeline (differentiator)

1. User taps “Add pin” or long-presses map.
2. Icon sheet: built-ins + “Upload”.
3. `expo-image-picker` → resize to 128×128 and 256×256 PNG, strip EXIF GPS if user opts (default: strip).
4. Write `icons/{sha256}.png` on device.
5. Register `IconAsset`; set `pin.iconId`.
6. MapLibre `Images` / style image runtime add; SymbolLayer uses `icon-image`.
7. Phase 3: upload blob if sync on.

Limits (free): 50 custom icons. Pro: unlimited.

## 4. Privacy

- No ads, no attribution SDKs beyond OSM.
- Location not sent unless routing/search online or sync enabled.
- Icon EXIF stripped by default.
- Account email only if user creates one.

## 5. Pro tier (sketch)

Free: 1 offline region, 100 pins, 5 tracks, 50 custom icons.
Pro: unlimited + satellite / outdoor / nautical / ski styles.

## 6. Cursor Cloud Agent brief (Phase 1)

Repo: `https://github.com/rschultz2003/guru-maps-clone`
`autoCreatePR: true`
Model: `composer-2` (or default)

Prompt summary:

- Scaffold Expo RN + TypeScript in `apps/mobile`
- MapLibre map
- Pin + custom icon upload + folders + SQLite persistence
- Do not use Google Maps
- Open a PR with the scaffold

## 7. Risks

| Risk | Mitigation |
|---|---|
| MapLibre RN offline packs immature | PMTiles or MBTiles + raster fallback |
| Duplicate of private BossMaps | Port types from BossMaps; keep this repo public-spec + MVP |
| Cursor API key not in CoS env | User runs curl locally |
| Branding / trademark | Never ship the name “Guru Maps” |

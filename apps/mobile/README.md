# BossMaps — Phase 1 (Expo + MapLibre)

```bash
cd apps/mobile
npm install
npx expo start
```

## Screens

| Screen | Purpose |
|--------|---------|
| **Map** | OpenFreeMap OSM vector style, user location, long-press to drop a pin, tap a pin to edit |
| **Pin editor** (sheet) | Name, notes, folder, label color, built-in icons, custom upload (photo library or file), save / delete |
| **Pins list** | All pins; tap to fly camera, long-press to edit |
| **Folders** | Create, rename (tap name), show/hide; hidden folders remove pins from the map |
| **Offline packs** | Phase 2 stub (`src/offlinePacks.ts`) — lists placeholder regions and wires `requestOfflinePackDownload` |

## Custom icon upload

1. In the pin editor, tap **Photo library** or **Choose file** (PNG/JPEG/WebP).
2. The image is cropped/resized to 128×128 and 256×256 PNGs, SHA-256 hashed, and copied into `documentDirectory/icons/`.
3. Metadata is stored in SQLite (`icons` table). MapLibre loads textures via `<Images images={…} />` and `SymbolLayer` `iconImage`.
4. Deleting the last pin that references an upload removes the file (`purgeUnusedCustomIcons`).

Data (pins, folders, icons) persists locally in SQLite — no login.

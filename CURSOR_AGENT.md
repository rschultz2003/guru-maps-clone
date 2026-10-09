# Cloud Agent brief

Implement Phase 1 only from PLAN.md in `apps/mobile`.

Repo: https://github.com/rschultz2003/guru-maps-clone
Branch from `main`. Open a PR. Do not merge.

Must ship:

- Expo + TypeScript + `@maplibre/maplibre-react-native`.
- OSM vector style with visible OpenStreetMap attribution.
- Long-press drops a pin at that coordinate.
- Pin editor: name, notes, folder, built-in icon, and custom icon upload (PNG/JPEG/WebP) copied into documents as `icons/{id}.webp` and stored in SQLite.
- Render uploaded icons with MapLibre `addImage` and a symbol layer.
- Folders: create, rename, show/hide. Hidden folder pins do not render.
- Pin list with tap-to-fly. Delete is safe if the icon file is missing.
- Wire `src/export/gpx.ts` and `kml.ts` to a share action for one pin.
- Free-tier stub warns at 15 markers. No IAP. No ads. No analytics SDK.

Do not build navigation, track recording, sync, CarPlay, 3D terrain, or store submission.

Not affiliated with Guru Maps. Do not use that name, icons, or assets in UI or store metadata. Product name in the app: Atlas Maps.

# Cursor Cloud Agent brief — MVP

Repo: https://github.com/rschultz2003/guru-maps-clone
Model: composer-2 (or Composer 2.5 / default). autoCreatePR: true.

## Build

Scaffold an Expo SDK 52+ TypeScript app with Expo Router.

Implement:
1. Full-screen MapLibre map (`@maplibre/maplibre-react-native`) with OSM-compatible style (OpenFreeMap or MapLibre demo tiles if keyless).
2. Show user location (permission flow).
3. Long-press to drop a pin at that coordinate.
4. Pin editor sheet: title, notes, folder picker, color.
5. **Custom icon upload**: image picker → resize → save to app documents → render that image as the map marker. Also ship a small preset icon set.
6. Folders/collections: CRUD, assign pins, filter visible pins.
7. Persist all of the above in SQLite. Survive reload.
8. Basic list screen of pins and folders.
9. Settings screen with privacy-first copy (no ads, location on-device).

Do not implement IAP, auth, CarPlay, or routing in this PR.
Do not add tracking SDKs.
Keep the JS bundle lean. Add README run steps.

Push a PR titled `feat: MVP map + custom icon pins + folders`.

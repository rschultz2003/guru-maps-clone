# Sync API contract (Phase 5)

Not implemented. Local-first until this lands.

Base: `https://api.example.com/v1`
Auth: `Authorization: Bearer <session>` optional. Unauthenticated clients never call this.

## Entities

`folder`, `icon`, `pin`, `track`, `track_point`, `route`, `route_stop`

Each row has `id` (uuid), `updatedAt` (ms), `deletedAt` (nullable).

## Pull

`GET /sync?since=<ms>`

```json
{ "folders": [], "icons": [], "pins": [], "tracks": [], "routes": [], "serverTime": 0 }
```

Icon rows include `sha256` and a signed GET URL, not the bytes.

## Push

`POST /sync` body is the same shape, last-write-wins on `updatedAt`.
Conflicts return both copies; client keeps the newer `updatedAt`.

## Icons

`POST /icons` multipart image. Response `{ id, sha256, url }`.
Client uploads only when sync is enabled.

## Pro

`GET /entitlements` reads RevenueCat webhook state. Free caps stay client-side until this exists: 15 markers, 15 tracks, 3 map packs.

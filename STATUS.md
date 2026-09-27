# Status — 28 Sep 2026 (CoS)

- Public spec repo: https://github.com/rschultz2003/guru-maps-clone
- README.md + PLAN.md already match current Guru Maps App Store feature set (offline OSM, custom pins/icons, folders, multi-stop routes, GPS tracks + GPX/KML, offline search, 3D terrain, sync, CarPlay, no ads, privacy-first). Differentiator: easy custom icon/image upload onto coordinates.
- Expo + MapLibre scaffold lives in `apps/mobile` (long-press pins, built-in + custom icons, local store).
- Branded ship product is **BossMaps** (`rschultz2003/bossmaps`). Do not App Store-brand as a Guru Maps clone.
- Cursor Cloud Agents API (`POST https://api.cursor.com/v1/agents`) returned **401 Invalid User API Key** from this environment. No agent run ID. User must run the curl in the CoS report with a key from https://cursor.com/dashboard/api
- Next: fire Composer 2 agent for MVP PR (map + custom icon upload + folders + offline hook); then Phase 2 packs. Coding agents: Composer 2.5 or Grok 4.6 only.

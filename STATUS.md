# Status — 1 Oct 2026 (CoS)

- Public spec + scaffold: https://github.com/rschultz2003/guru-maps-clone
- README.md + PLAN.md already match current Guru Maps App Store feature set (offline OSM, custom pins/icons, folders, multi-stop routes, GPS tracks + GPX/KML, offline search, 3D terrain, sync, CarPlay, no ads, privacy-first). Differentiator: easy custom icon/image upload onto coordinates.
- Expo + MapLibre scaffold in `apps/mobile` (long-press pins, built-in + custom icons, local store).
- PRs:
  - #1 closed: `feat(mobile): MapLibre style images, SQLite icon persist, pin list fly-to` — https://github.com/rschultz2003/guru-maps-clone/pull/1
  - #2 open draft: `feat(mobile): BossMaps MapLibre Phase 1 MVP polish` — https://github.com/rschultz2003/guru-maps-clone/pull/2 (`cursor/phase1-mvp-polish-d007`)
- Ship product is **BossMaps** (`rschultz2003/bossmaps`, `com.studiodorje.bossmaps`). Do not App Store-brand as a Guru Maps clone.
- Cursor Cloud Agents API (`POST https://api.cursor.com/v1/agents`) has **no API key in this environment**. No new agent run ID this turn. Key: https://cursor.com/dashboard/api
- Next: user fires Composer 2 / Composer 2.5 agent for MVP PR (map + custom icon upload + folders + offline pack hook), or review/merge #2. Coding agents: Composer 2.5 or Grok 4.6 only — no Claude. Do not merge without review. Do not App Store submit.

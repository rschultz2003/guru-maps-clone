# Status — 3 Oct 2026 (CoS)

- Spec + scaffold: https://github.com/rschultz2003/guru-maps-clone
- README.md and PLAN.md cover architecture, Expo + MapLibre stack, Hono sync later, phases 0–6.
- Differentiator: custom icon/image upload onto coordinates.
- Expo scaffold in `apps/mobile` (long-press pins, built-in + custom icons, SQLite).
- GPX/KML writers added under `apps/mobile/src/export`.
- Sync contract in `docs/sync-api.md` (not implemented).
- Prior PRs:
  - #1 closed: MapLibre style images, SQLite icon persist, pin list fly-to — https://github.com/rschultz2003/guru-maps-clone/pull/1
  - #2 draft: Phase 1 MVP polish — https://github.com/rschultz2003/guru-maps-clone/pull/2
- Ship product is **BossMaps** (`rschultz2003/bossmaps`). Do not App Store-brand as a Guru Maps clone.
- Cursor Cloud Agents API has no API key in this environment. No agent run ID. Key: https://cursor.com/dashboard/api
- Next: user runs the curl in the CoS report (model composer-2, autoCreatePR true) or reviews #2. Do not merge without review. Do not App Store submit.

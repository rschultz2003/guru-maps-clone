# Status — 4 Oct 2026 (CoS)

- Spec + scaffold: https://github.com/rschultz2003/guru-maps-clone
- README.md and PLAN.md cover architecture, Expo + MapLibre stack, Hono sync later, phases 0–6.
- Differentiator: custom icon/image upload onto coordinates.
- Expo scaffold in `apps/mobile` (long-press pins, built-in + custom icons, SQLite, GPX/KML writers).
- Sync contract in `docs/sync-api.md` (not implemented).
- PRs:
  - #1 closed: MapLibre style images, SQLite icon persist, pin list fly-to — https://github.com/rschultz2003/guru-maps-clone/pull/1
  - #2 draft open: Phase 1 MVP polish — https://github.com/rschultz2003/guru-maps-clone/pull/2
- Ship product is **BossMaps** (`rschultz2003/bossmaps`). Do not App Store-brand as a Guru Maps clone. Not affiliated with Guru Maps / WPG.
- Cursor Cloud Agents API: no `CURSOR_API_KEY` in this environment. No agent run ID this pass. Key: https://cursor.com/dashboard/api
- Launch command is in `scripts/launch-cloud-agent.sh` and CURSOR_AGENT.md.
- Next: user runs the curl (model composer-2, autoCreatePR true) or reviews #2. Do not merge without review. Do not App Store submit.

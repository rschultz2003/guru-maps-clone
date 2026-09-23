# Status — 2026-09-24 (CoS)

- Public spec + scaffold: https://github.com/rschultz2003/guru-maps-clone
- Private product (do not ship the name Guru Maps): https://github.com/rschultz2003/bossmaps
- Phase 1 on `main` (`apps/mobile`): Expo + TypeScript + MapLibre + local pin/icon/folder store. **PR #1** (draft): MapLibre `Images` + `SymbolLayer`, SHA256-hex icon files (128/256 PNG) + SQLite/files persist, pin list + fly-to; offline pack UI stub unchanged.
- README.md and PLAN.md match the Guru Maps–inspired App Store feature set (offline OSM, custom pins/icons, folders, multi-stop routes, tracks + GPX/KML, offline search, 3D terrain, sync, CarPlay, no ads, privacy-first).
- Cursor Cloud Agents: no `CURSOR_API_KEY` in this environment. Run the curl in `CURSOR_AGENT.md`.
- Coding owners: BossMaps Bot (implement) / BossMaps Manager (queue). Cloud models: Composer 2.5 or Grok 4.6 only.
- No App Store submit without Reuben approval.

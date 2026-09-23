# Status — 2026-09-24 (CoS)

- Public spec + scaffold: https://github.com/rschultz2003/guru-maps-clone
- Private product (do not ship the name Guru Maps): https://github.com/rschultz2003/bossmaps
- Phase 1 scaffold is on `main` (`apps/mobile`): Expo + TypeScript + MapLibre + local pin/icon/folder store + custom icon upload path + offline pack stub.
- README.md and PLAN.md already match Guru Maps App Store feature set (offline OSM, custom pins/icons, folders, multi-stop routes, tracks + GPX/KML, offline search, 3D terrain, sync, CarPlay, no ads, privacy-first).
- Next coding increment should land as a PR: wire uploaded icons as MapLibre style images, persist with expo-sqlite (not just in-memory/AsyncStorage if still stubbed), pin list + fly-to, one sample offline pack if feasible.
- Cursor Cloud Agents: no `CURSOR_API_KEY` in this environment. Run the curl in `CURSOR_AGENT.md`.
- Coding owners: BossMaps Bot (implement) / BossMaps Manager (queue). Cloud models: Composer 2.5 or Grok 4.6 only.
- No App Store submit without Reuben approval.

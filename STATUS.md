# Status — 2026-09-22 (CoS live pass)

- Public repo: https://github.com/rschultz2003/guru-maps-clone
- Spec on `main`: README.md, PLAN.md, CURSOR_AGENT.md (feature parity vs current Guru Maps App Store).
- Phase 1 scaffold already on `main` under `apps/mobile` (Expo + TS + MapLibre + local pin/icon/folder store). **No open PRs** — work landed on main, not a feature branch.
- Cursor Cloud Agents: **API key missing** in this environment (`401 Invalid User API Key`). Run the exact curl in CURSOR_AGENT.md locally with `CURSOR_API_KEY`.
- Sister product (do not conflate branding): private `rschultz2003/bossmaps` + BossMaps Bot / Manager. Do not ship the name “Guru Maps”.
- Next: user runs Cursor agent → PR for real MapLibre symbols + image picker + SQLite persistence QA; Phase 2 routes/tracks after that PR merges.

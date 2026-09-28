# Status — 29 Sep 2026 (CoS)

- Public spec + scaffold: https://github.com/rschultz2003/guru-maps-clone
- README.md + PLAN.md already match current Guru Maps App Store feature set (offline OSM, custom pins/icons, folders, multi-stop routes, GPS tracks + GPX/KML, offline search, 3D terrain, sync, CarPlay, no ads, privacy-first). Differentiator: easy custom icon/image upload onto coordinates.
- Expo + MapLibre scaffold in `apps/mobile` (long-press pins, built-in + custom icons, local store).
- Ship product is **BossMaps** (`rschultz2003/bossmaps`, `com.studiodorje.bossmaps`). Do not App Store-brand as a Guru Maps clone.
- Cursor Cloud Agents API (`POST https://api.cursor.com/v1/agents`) has **no API key in this environment**. No agent run ID from CoS this turn. Key lives at https://cursor.com/dashboard/cloud-agents.
- Next: user fires Composer 2 / Composer 2.5 agent for MVP PR (map + custom icon upload + folders + offline pack hook). Then Phase 2 packs. Coding agents: Composer 2.5 or Grok 4.6 only — no Claude. Do not merge without review. Do not App Store submit.

# Status — 18 Sep 2026 (AEST)

- Repo: https://github.com/rschultz2003/guru-maps-clone (public)
- Spec: README.md + PLAN.md + CURSOR_AGENT.md (Trail Pin; Guru Maps surface area, not a trademark clone)
- App code: still docs-only. Phase 1 MVP not scaffolded.
- Cursor Cloud Agent: **not started**. CoS runtime has no `CURSOR_API_KEY` (POST https://api.cursor.com/v1/agents → 401).
- Related product: private `rschultz2003/bossmaps` already ships MapLibre + custom pins. BossMaps Bot / Manager own that brand. This repo stays an independent Trail Pin experiment unless you merge them.

## Human unblock

1. Create a key at https://cursor.com/dashboard/api
2. Run the curl in CURSOR_AGENT.md
3. Paste agent id / PR URL back to Chief of Staff

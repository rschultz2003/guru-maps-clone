# Status — 11 Oct 2026 (CoS)

- Master plan and full spec updated on main (README.md, PLAN.md).
- Repo: https://github.com/rschultz2003/guru-maps-clone
- Scaffold present: `apps/mobile` Expo + MapLibre + SQLite + image picker + GPX/KML.
- Core differentiator implemented in plan: easy custom icon/image upload to pin locations.
- Cursor Cloud Agents: No API key available in this environment. Probe returns 401.
- Key required: https://cursor.com/dashboard/api
- To start live build of MVP:

```bash
export CURSOR_API_KEY=your_key_here
bash scripts/launch-cloud-agent.sh
```

Exact curl (replace YOUR_API_KEY):

```bash
curl --request POST \
  --url https://api.cursor.com/v1/agents \
  -u "YOUR_API_KEY:" \
  --header 'Content-Type: application/json' \
  --data '{
    "prompt": {
      "text": "Finish the Phase 1 MVP in apps/mobile for https://github.com/rschultz2003/guru-maps-clone. Read README.md, PLAN.md, and CURSOR_AGENT.md and implement only Phase 1. Expo + TypeScript + @maplibre/maplibre-react-native. OSM vector style with visible OpenStreetMap attribution. Long-press creates a pin. Pin editor with custom icon upload (resize to WebP, store in documents/icons/, SQLite). Render via MapLibre addImage + SymbolLayer. Folders create/rename/show/hide. Pin list, tap-to-fly, safe delete. Share GPX/KML. Free-tier stub at 15 markers. No IAP/ads/analytics. Open a PR. Do not merge. Product name Atlas Maps; not affiliated with Guru Maps."
    },
    "model": { "id": "composer-2" },
    "repos": [{"url": "https://github.com/rschultz2003/guru-maps-clone", "startingRef": "main"}],
    "autoCreatePR": true
  }'
```

- UI must not use Guru Maps name or assets.
- Next: User launches agent, then review PR and iterate toward full parity.

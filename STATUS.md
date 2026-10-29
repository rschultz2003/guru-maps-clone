# Status — 30 Oct 2026 (Chief of Staff)

- Master plan and full spec on main (README.md, PLAN.md, CURSOR_AGENT.md).
- Repo: https://github.com/rschultz2003/guru-maps-clone
- Scaffold on `main` is functional for Phase 1 basics in `apps/mobile`: Expo + TypeScript + MapLibre + SQLite + image picker + folders (create/show-hide) + pin list + long-press pin creation + custom icon upload path + SymbolLayer rendering via Images.
- Core differentiator (easy custom icon/image upload to pin locations, rendered as MapLibre style images) is implemented in the scaffold.
- Current style is demo tiles (`https://demotiles.maplibre.org/style.json`); next polish is OpenFreeMap Liberty (`https://tiles.openfreemap.org/styles/liberty`) + visible OSM attribution + free-tier marker limit warning (15) + GPX/KML share wiring + safe delete.
- Architecture: On-device first (SQLite + local icon files in documents/icons/), MapLibre OSM, privacy-first, Pro tier planned for later.
- Product name in app: Atlas Maps. Not affiliated with Guru Maps. Do not copy trademarks.
- Cursor Cloud Agents: No API key available in this environment. Probe returns 401 / Invalid User API Key.
- Key required: https://cursor.com/dashboard/api (Basic auth `KEY:`).
- To start / continue live build (finish Phase 1 MVP polish and open PR):

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
      "text": "Finish and polish the Phase 1 MVP in apps/mobile for https://github.com/rschultz2003/guru-maps-clone. Read README.md, PLAN.md, and CURSOR_AGENT.md. Implement only Phase 1. Switch map style to OpenFreeMap Liberty (https://tiles.openfreemap.org/styles/liberty) or equivalent OSM vector with visible OpenStreetMap attribution. Ensure long-press creates a pin. Pin editor supports name, notes, folder, built-in, and custom icon upload (resize to ~128px WebP in documents/icons/{id}.webp, metadata in SQLite). Render custom icons reliably via MapLibre Images + SymbolLayer (iconImage: [\"get\", \"iconId\"]). Folders create/rename/show-hide; hidden pins do not render. Pin list tap-to-fly. Safe delete. Wire GPX/KML export/share for a pin. Free-tier stub warns at 15 markers. No IAP, no ads, no analytics. Product name Atlas Maps; not affiliated with Guru Maps. Open a PR. Do not merge."
    },
    "model": { "id": "composer-2" },
    "repos": [{"url": "https://github.com/rschultz2003/guru-maps-clone", "startingRef": "main"}],
    "autoCreatePR": true
  }'
```

- Next: User launches with API key (or reviews existing agent branches/PRs if any), then iterate to Phase 2 (routes), Phase 3 (tracks), Phase 4 (sync + Pro), Phase 5 (offline search, 3D, CarPlay) for full Guru Maps parity while keeping the custom-icon differentiator and privacy-first stance.
- Phased master plan complete. Ready for live Cursor Cloud Agent build of MVP.

# Status — 12 Oct 2026 (CoS)

- Master plan and full spec complete on main (README.md, PLAN.md, CURSOR_AGENT.md).
- Repo: https://github.com/rschultz2003/guru-maps-clone
- Scaffold present and functional for Phase 1 basics: `apps/mobile` Expo + TypeScript + MapLibre + SQLite + image picker + folders + pin list + GPX/KML export stubs.
- Core differentiator (easy custom icon/image upload to pin locations) is implemented in the scaffold and fully specified.
- Architecture: On-device first (SQLite + local icon files), MapLibre OSM style, privacy-first, Pro tier planned for later.
- Cursor Cloud Agents: No API key available in this environment. Probe returns 401.
- Key required: https://cursor.com/dashboard/api (Basic auth `KEY:`).
- To start live build / finish Phase 1 MVP and open PR:

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
      "text": "Finish the Phase 1 MVP in apps/mobile for https://github.com/rschultz2003/guru-maps-clone. Read README.md, PLAN.md, and CURSOR_AGENT.md and implement only Phase 1 from PLAN.md. Expo + TypeScript + @maplibre/maplibre-react-native. Prefer OSM vector style (e.g. OpenFreeMap Liberty) with visible OpenStreetMap attribution. Long-press creates a pin at the coordinate. Pin editor: name, notes, folder, built-in icons, and custom icon upload (PNG/JPEG/WebP resized to ~128px WebP stored as icons/{id}.webp in documents, metadata in SQLite). Render uploaded icons via MapLibre Images / addImage + SymbolLayer (not only colored dots). Folders: create, rename, show/hide; hidden folder pins do not render. Pin list with tap-to-fly. Safe delete. Wire GPX/KML share for a pin. Free-tier stub warns at 15 markers. No IAP, no ads, no analytics. Product name Atlas Maps; not affiliated with Guru Maps. Open a PR. Do not merge."
    },
    "model": { "id": "composer-2" },
    "repos": [{"url": "https://github.com/rschultz2003/guru-maps-clone", "startingRef": "main"}],
    "autoCreatePR": true
  }'
```

- Next: User provides/launches with API key, review resulting PR, then iterate phases (navigation, tracks, sync, Pro, 3D, CarPlay) toward full feature parity with Guru Maps while keeping the custom-icon differentiator and privacy-first stance.

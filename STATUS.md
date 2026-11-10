# Status — 11 Nov 2026 (Chief of Staff)

- Master plan and full spec on main (README.md, PLAN.md, CURSOR_AGENT.md). Fully detailed architecture, tech stack (React Native + Expo + MapLibre + SQLite), phases, and acceptance criteria.
- Repo: https://github.com/rschultz2003/guru-maps-clone
- Scaffold on `main` is functional for Phase 1 basics in `apps/mobile`: Expo + TypeScript + MapLibre + SQLite + image picker + folders (create/show-hide) + pin list + long-press pin creation + custom icon upload path + SymbolLayer rendering via Images. Uses demo style; PR #2 switches to OpenFreeMap Liberty + attribution.
- Core differentiator (easy custom icon/image upload to pin locations, rendered as MapLibre style images) is implemented in the scaffold.
- Open PR from previous Cloud Agent: https://github.com/rschultz2003/guru-maps-clone/pull/2 (branch `cursor/phase1-mvp-polish-d007`) — Phase 1 MVP polish (OpenFreeMap style, attribution, better pin editor, GPX/KML, etc.). Review and merge recommended. Independent review notes minor nits (icon file hardening, unused 256px variants).
- Architecture: On-device first (SQLite + local icon files in documents/icons/), MapLibre OSM, privacy-first, Pro tier planned for later.
- Product name in app: Atlas Maps. Not affiliated with Guru Maps. Do not copy trademarks.
- Cursor Cloud Agents: No API key available in this environment. Probe returns 401 / Invalid User API Key. Key required from https://cursor.com/dashboard/api (Basic auth `KEY:`).
- To start / continue live build (finish Phase 1 MVP polish, review PR #2, or expand):

```bash
export CURSOR_API_KEY=your_key_here
bash scripts/launch-cloud-agent.sh
```

Exact curl (replace YOUR_API_KEY) to polish Phase 1 or start next iteration:

```bash
curl --request POST \
  --url https://api.cursor.com/v1/agents \
  -u "YOUR_API_KEY:" \
  --header 'Content-Type: application/json' \
  --data '{
    "prompt": {
      "text": "Review and finish Phase 1 MVP polish in apps/mobile for https://github.com/rschultz2003/guru-maps-clone. Read README.md, PLAN.md, and CURSOR_AGENT.md. Prefer starting from main or addressing nits in PR #2. Implement only Phase 1. Ensure OpenFreeMap Liberty style (https://tiles.openfreemap.org/styles/liberty) with visible OSM attribution. Long-press creates pin. Pin editor: name, notes, folder, built-in + custom icon upload (resize ~128px WebP/PNG to documents/icons/{id}.webp, SQLite metadata). Reliable MapLibre Images + SymbolLayer rendering (iconImage: [\"get\", \"iconId\"]). Folders create/rename/show-hide; hidden do not render. Pin list tap-to-fly. Safe delete + purge unused icons. Wire GPX/KML share for a pin. Free-tier stub warns at 15 markers. Harden against missing icon files. No IAP, no ads, no analytics. Product name Atlas Maps; not affiliated with Guru Maps. Open a PR if changes. Do not merge."
    },
    "model": { "id": "composer-2" },
    "repos": [{"url": "https://github.com/rschultz2003/guru-maps-clone", "startingRef": "main"}],
    "autoCreatePR": true
  }'
```

- Next: Review/merge existing PR #2 or launch new agent with API key, then iterate to Phase 2 (routes), Phase 3 (tracks), Phase 4 (sync + Pro), Phase 5 (offline search, 3D, CarPlay) for full Guru Maps parity while keeping the custom-icon differentiator and privacy-first stance.
- Phased master plan complete. Ready for live Cursor Cloud Agent build of MVP.

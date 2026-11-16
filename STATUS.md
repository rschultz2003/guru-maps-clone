# Status — 17 Nov 2026 (Chief of Staff)

- **Master plan and full spec** live on main: `README.md` (product parity target, tech stack, layout, run instructions) and `PLAN.md` (architecture, data model, phased delivery with acceptance criteria). Core differentiator locked: easy custom icon/image upload to pin locations, rendered as first-class MapLibre symbols.
- **Repo**: https://github.com/rschultz2003/guru-maps-clone
- **Product name**: Atlas Maps (not affiliated with Guru Maps / Evgen Bodunov). Do not copy trademarks, icons, or store copy.
- **Phase 1 scaffold** on `main` in `apps/mobile`: Expo + TypeScript + MapLibre + SQLite + image picker + folders (create/show-hide) + pin list + long-press pin creation + custom icon upload path + SymbolLayer rendering. Demo style currently; previous Cloud Agent PR targets OpenFreeMap Liberty + attribution.
- **Open PR**: https://github.com/rschultz2003/guru-maps-clone/pull/2 (branch `cursor/phase1-mvp-polish-d007`, agent `bc-6e852429-517d-501a-b705-da3d429cd007`) — Phase 1 MVP polish. Review and merge recommended.
- **Architecture**: On-device first (SQLite + local icon files under documents/icons/), MapLibre OSM vector, privacy-first, no ads/analytics in free tier. Pro tier and sync planned for Phase 4.
- **Cursor Cloud Agents**: No `CURSOR_API_KEY` available in the current environment (probe returns 401). Key required from https://cursor.com/dashboard/api (Basic auth `KEY:` or Bearer).

## Launch / continue live build

To finish Phase 1 polish, review/merge PR #2, or expand to later phases:

```bash
export CURSOR_API_KEY=your_key_here
bash scripts/launch-cloud-agent.sh
```

**Exact curl** (replace `YOUR_API_KEY`) to polish Phase 1 MVP:

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

## Next steps for full parity

1. Review/merge PR #2 or launch new agent with API key for Phase 1 polish.
2. Iterate Phase 2 (multi-stop routes + navigation).
3. Phase 3 (GPS track recording + stats + GPX/KML).
4. Phase 4 (sync + Pro tier).
5. Phase 5 (offline search, 3D terrain, CarPlay, Watch).

Keep the custom-icon differentiator and privacy-first stance throughout.

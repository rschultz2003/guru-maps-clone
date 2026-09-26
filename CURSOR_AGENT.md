# Cursor Cloud Agent brief — MVP

Repo: https://github.com/rschultz2003/guru-maps-clone
Branch from `main`. Open a PR (`autoCreatePR: true`).
Model: composer-2 / Composer 2.5 (or default). No Claude.

## Goal

Finish the Expo MapLibre MVP:

1. Map renders OSM style.
2. Long-press creates a pin.
3. User can upload a custom icon/image and attach it to that pin.
4. Pins persist locally; folders group them.
5. Offline-ready structure (local store + hook for tile packs).

## Constraints

- React Native + Expo. MapLibre only (not Google Maps).
- Do not brand UI as "Guru Maps". Working title: Offline Maps / BossMaps.
- Do not add IAP, auth, or App Store submit.
- Keep TypeScript strict.
- Small, reviewable PR.

## Files already present

`apps/mobile/App.tsx`, `src/store.ts`, `src/types.ts`, `src/icons.ts`, `src/builtinIcons.ts`.

Extend these. Do not rewrite from scratch unless they are broken.

## Done when

- `npx tsc --noEmit` in `apps/mobile` is clean (or documented).
- README run steps still work.
- PR description lists screens and how custom icon upload works.

/**
 * Online OSM-based vector style (MapLibre). Phase 2 will prefer a downloaded pack style URI when available.
 */
export const ONLINE_OSM_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

export function getActiveMapStyleUrl(): string {
  return ONLINE_OSM_STYLE_URL;
}

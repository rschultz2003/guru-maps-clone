/**
 * Phase 2 hook: regional offline map packs (MBTiles / PMTiles). Phase 1 exposes types + stub API only.
 */
export type OfflinePackStatus = "placeholder" | "queued" | "downloading" | "ready" | "failed";

export type OfflineMapPack = {
  id: string;
  name: string;
  status: OfflinePackStatus;
  bytesDownloaded: number;
  bytesTotal: number;
  updatedAt: number;
};

/** Sample regions shown in the stub UI; real metadata arrives with Phase 2 pack manager. */
export const OFFLINE_PACK_PLACEHOLDERS: OfflineMapPack[] = [
  {
    id: "sample-metro",
    name: "Sample metro region",
    status: "placeholder",
    bytesDownloaded: 0,
    bytesTotal: 0,
    updatedAt: 0,
  },
];

export function listOfflinePacks(): OfflineMapPack[] {
  return OFFLINE_PACK_PLACEHOLDERS;
}

/** Called when the user taps download in Phase 2; throws until pack pipeline exists. */
export async function requestOfflinePackDownload(_packId: string): Promise<void> {
  throw new Error("Offline pack downloads ship in Phase 2. Online OSM style is used until then.");
}

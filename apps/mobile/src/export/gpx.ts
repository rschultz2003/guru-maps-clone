export type GpxPoint = {
  lat: number;
  lng: number;
  ele?: number;
  time?: number;
  name?: string;
};

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function iso(ms: number): string {
  return new Date(ms).toISOString();
}

export function pinToGpx(name: string, lat: number, lng: number, notes = ""): string {
  return tracksToGpx(name, [[{ lat, lng, name, time: Date.now() }]], notes);
}

export function tracksToGpx(name: string, tracks: GpxPoint[][], desc = ""): string {
  const body = tracks
    .map((pts, i) => {
      const segs = pts
        .map((p) => {
          const ele = p.ele != null ? `<ele>${p.ele}</ele>` : "";
          const time = p.time != null ? `<time>${iso(p.time)}</time>` : "";
          return `<trkpt lat="${p.lat}" lon="${p.lng}">${ele}${time}</trkpt>`;
        })
        .join("");
      return `<trk><name>${esc(name)} ${i + 1}</name><trkseg>${segs}</trkseg></trk>`;
    })
    .join("");
  const wpt = tracks
    .flat()
    .filter((p) => p.name)
    .map(
      (p) =>
        `<wpt lat="${p.lat}" lon="${p.lng}"><name>${esc(p.name || "")}</name></wpt>`,
    )
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="BossMaps" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata><name>${esc(name)}</name><desc>${esc(desc)}</desc></metadata>
  ${wpt}
  ${body}
</gpx>
`;
}

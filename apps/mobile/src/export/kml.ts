function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function pinToKml(name: string, lat: number, lng: number, notes = ""): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${esc(name)}</name>
    <Placemark>
      <name>${esc(name)}</name>
      <description>${esc(notes)}</description>
      <Point><coordinates>${lng},${lat},0</coordinates></Point>
    </Placemark>
  </Document>
</kml>
`;
}

export function lineToKml(name: string, coords: { lat: number; lng: number; ele?: number }[]): string {
  const path = coords.map((c) => `${c.lng},${c.lat},${c.ele ?? 0}`).join(" ");
  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${esc(name)}</name>
    <Placemark>
      <name>${esc(name)}</name>
      <LineString><coordinates>${path}</coordinates></LineString>
    </Placemark>
  </Document>
</kml>
`;
}

import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";
import { BUILTIN_ICON_DEFS } from "./builtinIcons";
import type { Folder, IconAsset, Pin } from "./types";

const db = SQLite.openDatabaseSync("atlas.db");
const ICON_DIR = FileSystem.documentDirectory + "icons/";

const FREE_MARKER_CAP = 15;

async function ensureBuiltinIcons(): Promise<void> {
  const enc = FileSystem.EncodingType.Base64;
  for (const def of BUILTIN_ICON_DEFS) {
    const path = ICON_DIR + def.id + ".128.png";
    if (!(await FileSystem.getInfoAsync(path)).exists) {
      await FileSystem.writeAsStringAsync(path, def.b64, { encoding: enc });
    }
  }
}

function rowToFolder(row: Folder & { visible: number | boolean }): Folder {
  return { ...row, visible: !!row.visible };
}

function rowToPin(row: Pin & { color?: string | null }): Pin {
  return { ...row, color: row.color ?? null };
}

function ensurePinColorColumn() {
  const cols = db.getAllSync<{ name: string }>("PRAGMA table_info(pins)");
  if (!cols.some((c) => c.name === "color")) {
    db.execSync("ALTER TABLE pins ADD COLUMN color TEXT");
  }
}

export async function initStore() {
  await FileSystem.makeDirectoryAsync(ICON_DIR, { intermediates: true }).catch(() => {});
  db.execSync(`
    CREATE TABLE IF NOT EXISTS folders (
      id TEXT PRIMARY KEY, name TEXT, parentId TEXT, visible INTEGER, updatedAt INTEGER
    );
    CREATE TABLE IF NOT EXISTS icons (
      id TEXT PRIMARY KEY, kind TEXT, localUri TEXT, width INTEGER, height INTEGER
    );
    CREATE TABLE IF NOT EXISTS pins (
      id TEXT PRIMARY KEY, lat REAL, lng REAL, title TEXT, notes TEXT,
      folderId TEXT, iconId TEXT, color TEXT, createdAt INTEGER, updatedAt INTEGER
    );
  `);
  ensurePinColorColumn();
  await ensureBuiltinIcons();

  const count = db.getFirstSync<{ c: number }>("SELECT COUNT(*) as c FROM folders");
  if (!count || count.c === 0) {
    const now = Date.now();
    db.runSync("INSERT INTO folders VALUES (?, ?, ?, ?, ?)", ["default", "Saved places", null, 1, now]);
  }

  for (const def of BUILTIN_ICON_DEFS) {
    const path = ICON_DIR + def.id + ".128.png";
    db.runSync("INSERT OR REPLACE INTO icons VALUES (?, ?, ?, ?, ?)", [
      def.id,
      "builtin",
      path,
      128,
      128,
    ]);
  }
}

export function listFolders(): Folder[] {
  return db.getAllSync<Folder & { visible: number }>("SELECT * FROM folders ORDER BY name").map(rowToFolder);
}

export function listPins(): Pin[] {
  return db
    .getAllSync<Pin & { color?: string | null }>("SELECT * FROM pins ORDER BY updatedAt DESC")
    .map(rowToPin);
}

export function listIcons(): IconAsset[] {
  return db.getAllSync<IconAsset>("SELECT * FROM icons");
}

export function upsertFolder(f: Folder) {
  db.runSync("INSERT OR REPLACE INTO folders VALUES (?, ?, ?, ?, ?)", [
    f.id,
    f.name,
    f.parentId,
    f.visible ? 1 : 0,
    f.updatedAt,
  ]);
}

export function upsertPin(p: Pin) {
  db.runSync("INSERT OR REPLACE INTO pins VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
    p.id,
    p.lat,
    p.lng,
    p.title,
    p.notes,
    p.folderId,
    p.iconId,
    p.color,
    p.createdAt,
    p.updatedAt,
  ]);
}

export function upsertIcon(i: IconAsset) {
  db.runSync("INSERT OR REPLACE INTO icons VALUES (?, ?, ?, ?, ?)", [
    i.id,
    i.kind,
    i.localUri,
    i.width,
    i.height,
  ]);
}

export function deletePin(id: string) {
  db.runSync("DELETE FROM pins WHERE id = ?", [id]);
  purgeUnusedCustomIcons();
}

export function deleteFolder(id: string) {
  if (id === "default") return;
  const pins = listPins().filter((p) => p.folderId === id);
  const now = Date.now();
  for (const p of pins) {
    upsertPin({ ...p, folderId: "default", updatedAt: now });
  }
  db.runSync("DELETE FROM folders WHERE id = ?", [id]);
}

export function pinCount(): number {
  return db.getFirstSync<{ c: number }>("SELECT COUNT(*) as c FROM pins")?.c ?? 0;
}

export function freeMarkerCap(): number {
  return FREE_MARKER_CAP;
}

export function isOverFreeMarkerCap(additional = 0): boolean {
  return pinCount() + additional > FREE_MARKER_CAP;
}

export function purgeUnusedCustomIcons(): void {
  const used = new Set(listPins().map((p) => p.iconId));
  for (const icon of listIcons()) {
    if (icon.kind !== "upload" || used.has(icon.id)) continue;
    db.runSync("DELETE FROM icons WHERE id = ?", [icon.id]);
    FileSystem.deleteAsync(icon.localUri, { idempotent: true }).catch(() => {});
    const large = icon.localUri.replace(".128.png", ".256.png");
    FileSystem.deleteAsync(large, { idempotent: true }).catch(() => {});
  }
}

export function iconDir() {
  return ICON_DIR;
}

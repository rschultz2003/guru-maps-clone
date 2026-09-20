import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";
import type { Folder, IconAsset, Pin } from "./types";

const db = SQLite.openDatabaseSync("atlas.db");
const ICON_DIR = FileSystem.documentDirectory + "icons/";

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
      folderId TEXT, iconId TEXT, createdAt INTEGER, updatedAt INTEGER
    );
  `);
  const count = db.getFirstSync<{ c: number }>("SELECT COUNT(*) as c FROM folders");
  if (!count || count.c === 0) {
    const now = Date.now();
    db.runSync("INSERT INTO folders VALUES (?, ?, ?, ?, ?)", ["default", "Saved places", null, 1, now]);
    db.runSync("INSERT INTO icons VALUES (?, ?, ?, ?, ?)", ["pin-red", "builtin", "builtin:pin-red", 64, 64]);
  }
}

export function listFolders(): Folder[] {
  return db.getAllSync<Folder>("SELECT * FROM folders ORDER BY name");
}
export function listPins(): Pin[] {
  return db.getAllSync<Pin>("SELECT * FROM pins ORDER BY updatedAt DESC");
}
export function listIcons(): IconAsset[] {
  return db.getAllSync<IconAsset>("SELECT * FROM icons");
}

export function upsertFolder(f: Folder) {
  db.runSync(
    "INSERT OR REPLACE INTO folders VALUES (?, ?, ?, ?, ?)",
    [f.id, f.name, f.parentId, f.visible ? 1 : 0, f.updatedAt]
  );
}
export function upsertPin(p: Pin) {
  db.runSync(
    "INSERT OR REPLACE INTO pins VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [p.id, p.lat, p.lng, p.title, p.notes, p.folderId, p.iconId, p.createdAt, p.updatedAt]
  );
}
export function upsertIcon(i: IconAsset) {
  db.runSync("INSERT OR REPLACE INTO icons VALUES (?, ?, ?, ?, ?)", [
    i.id, i.kind, i.localUri, i.width, i.height,
  ]);
}
export function deletePin(id: string) {
  db.runSync("DELETE FROM pins WHERE id = ?", [id]);
}
export function iconDir() {
  return ICON_DIR;
}

import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";
import { PIN_RED_128_B64, PIN_RED_256_B64 } from "./builtinIcons";
import type { Folder, IconAsset, Pin } from "./types";

const db = SQLite.openDatabaseSync("atlas.db");
const ICON_DIR = FileSystem.documentDirectory + "icons/";

async function ensureBuiltinIcons(): Promise<void> {
  const dir = ICON_DIR;
  const path128 = dir + "pin-red.128.png";
  const path256 = dir + "pin-red.256.png";
  const enc = FileSystem.EncodingType.Base64;
  if (!(await FileSystem.getInfoAsync(path128)).exists) {
    await FileSystem.writeAsStringAsync(path128, PIN_RED_128_B64, { encoding: enc });
  }
  if (!(await FileSystem.getInfoAsync(path256)).exists) {
    await FileSystem.writeAsStringAsync(path256, PIN_RED_256_B64, { encoding: enc });
  }
}

function rowToFolder(row: Folder & { visible: number | boolean }): Folder {
  return { ...row, visible: !!row.visible };
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
      folderId TEXT, iconId TEXT, createdAt INTEGER, updatedAt INTEGER
    );
  `);
  await ensureBuiltinIcons();
  const builtin128 = ICON_DIR + "pin-red.128.png";
  const count = db.getFirstSync<{ c: number }>("SELECT COUNT(*) as c FROM folders");
  if (!count || count.c === 0) {
    const now = Date.now();
    db.runSync("INSERT INTO folders VALUES (?, ?, ?, ?, ?)", ["default", "Saved places", null, 1, now]);
    db.runSync("INSERT INTO icons VALUES (?, ?, ?, ?, ?)", ["pin-red", "builtin", builtin128, 128, 128]);
  } else {
    db.runSync("UPDATE icons SET localUri = ?, width = 128, height = 128 WHERE id = 'pin-red'", [builtin128]);
  }
}

export function listFolders(): Folder[] {
  return db.getAllSync<Folder & { visible: number }>("SELECT * FROM folders ORDER BY name").map(rowToFolder);
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
    [f.id, f.name, f.parentId, f.visible ? 1 : 0, f.updatedAt],
  );
}
export function upsertPin(p: Pin) {
  db.runSync(
    "INSERT OR REPLACE INTO pins VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [p.id, p.lat, p.lng, p.title, p.notes, p.folderId, p.iconId, p.createdAt, p.updatedAt],
  );
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
}
export function iconDir() {
  return ICON_DIR;
}

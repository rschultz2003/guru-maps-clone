import * as Crypto from "expo-crypto";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { iconDir, listIcons, upsertIcon } from "./store";
import type { IconAsset } from "./types";

function bufferToHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function readFileBytes(uri: string): Promise<Uint8Array> {
  const b64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  const raw = atob(b64);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

async function sha256File(uri: string): Promise<string> {
  const bytes = await readFileBytes(uri);
  const digest = await Crypto.digest(Crypto.CryptoDigestAlgorithm.SHA256, bytes);
  return bufferToHex(digest);
}

export async function pickAndStoreIcon(): Promise<IconAsset | null> {
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
    allowsEditing: true,
    aspect: [1, 1],
    exif: false,
  });
  if (res.canceled || !res.assets[0]) return null;

  const src = res.assets[0].uri;
  const small = await ImageManipulator.manipulateAsync(
    src,
    [{ resize: { width: 128, height: 128 } }],
    { compress: 0.9, format: ImageManipulator.SaveFormat.PNG },
  );
  const large = await ImageManipulator.manipulateAsync(
    src,
    [{ resize: { width: 256, height: 256 } }],
    { compress: 0.9, format: ImageManipulator.SaveFormat.PNG },
  );

  const hash = await sha256File(small.uri);
  const path128 = iconDir() + hash + ".128.png";
  const path256 = iconDir() + hash + ".256.png";

  const existing = listIcons().find((i) => i.id === hash);
  if (existing) {
    await FileSystem.deleteAsync(small.uri, { idempotent: true }).catch(() => {});
    await FileSystem.deleteAsync(large.uri, { idempotent: true }).catch(() => {});
    return existing;
  }

  await FileSystem.copyAsync({ from: small.uri, to: path128 });
  await FileSystem.copyAsync({ from: large.uri, to: path256 });
  await FileSystem.deleteAsync(small.uri, { idempotent: true }).catch(() => {});
  await FileSystem.deleteAsync(large.uri, { idempotent: true }).catch(() => {});

  const icon: IconAsset = { id: hash, kind: "upload", localUri: path128, width: 128, height: 128 };
  upsertIcon(icon);
  return icon;
}

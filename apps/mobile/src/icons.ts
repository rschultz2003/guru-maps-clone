import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import { iconDir, upsertIcon } from "./store";
import type { IconAsset } from "./types";

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
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
    { compress: 0.9, format: ImageManipulator.SaveFormat.PNG }
  );
  const id = uid();
  const dest = iconDir() + id + ".png";
  await FileSystem.copyAsync({ from: small.uri, to: dest });
  const icon: IconAsset = { id, kind: "upload", localUri: dest, width: 128, height: 128 };
  upsertIcon(icon);
  return icon;
}

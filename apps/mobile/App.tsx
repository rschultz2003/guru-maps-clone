import MapLibreGL, { type CameraRef } from "@maplibre/maplibre-react-native";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { pickAndStoreIconFromFiles, pickAndStoreIconFromLibrary } from "./src/icons";
import { getActiveMapStyleUrl } from "./src/mapStyle";
import { listOfflinePacks, requestOfflinePackDownload } from "./src/offlinePacks";
import {
  deleteFolder,
  deletePin,
  freeMarkerCap,
  initStore,
  isOverFreeMarkerCap,
  listFolders,
  listIcons,
  listPins,
  pinCount,
  upsertFolder,
  upsertPin,
} from "./src/store";
import type { Folder, IconAsset, Pin } from "./src/types";

const PIN_COLORS = ["#ea4335", "#1a73e8", "#34a853", "#fbbc04", "#9334e6", "#5f6368"] as const;
const DEFAULT_PIN_COLOR = PIN_COLORS[1];

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function isNewPin(draft: Pin, pins: Pin[]) {
  return !pins.some((p) => p.id === draft.id);
}

export default function App() {
  const cameraRef = useRef<CameraRef>(null);
  const [ready, setReady] = useState(false);
  const [pins, setPins] = useState<Pin[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [icons, setIcons] = useState<IconAsset[]>([]);
  const [draft, setDraft] = useState<Pin | null>(null);
  const [showFolders, setShowFolders] = useState(false);
  const [showPins, setShowPins] = useState(false);
  const [showPacks, setShowPacks] = useState(false);
  const [newFolder, setNewFolder] = useState("");
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null);
  const [renameFolderText, setRenameFolderText] = useState("");

  const refresh = () => {
    setPins(listPins());
    setFolders(listFolders());
    setIcons(listIcons());
  };

  useEffect(() => {
    initStore().then(() => {
      refresh();
      setReady(true);
    });
  }, []);

  const visiblePins = useMemo(() => {
    const hidden = new Set(folders.filter((f) => !f.visible).map((f) => f.id));
    return pins.filter((p) => !p.folderId || !hidden.has(p.folderId));
  }, [pins, folders]);

  const styleImages = useMemo(() => {
    const map: Record<string, { uri: string }> = {};
    for (const icon of icons) {
      map[icon.id] = { uri: icon.localUri };
    }
    return map;
  }, [icons]);

  const builtinIcons = useMemo(() => icons.filter((i) => i.kind === "builtin"), [icons]);
  const customIcons = useMemo(() => icons.filter((i) => i.kind === "upload"), [icons]);

  const pinCollection = useMemo(
    (): GeoJSON.FeatureCollection => ({
      type: "FeatureCollection",
      features: visiblePins.map((p) => ({
        type: "Feature",
        id: p.id,
        geometry: { type: "Point", coordinates: [p.lng, p.lat] },
        properties: {
          id: p.id,
          title: p.title,
          iconId: p.iconId,
          color: p.color ?? DEFAULT_PIN_COLOR,
        },
      })),
    }),
    [visiblePins],
  );

  const openNewPinAt = (lng: number, lat: number) => {
    const now = Date.now();
    const folderId = folders.find((f) => f.id === "default")?.id ?? folders[0]?.id ?? null;
    setDraft({
      id: uid(),
      lat,
      lng,
      title: "New place",
      notes: "",
      folderId,
      iconId: "pin-red",
      color: DEFAULT_PIN_COLOR,
      createdAt: now,
      updatedAt: now,
    });
  };

  const onLongPress = (feature: GeoJSON.Feature) => {
    if (feature.geometry?.type !== "Point") return;
    const [lng, lat] = feature.geometry.coordinates;
    openNewPinAt(lng, lat);
  };

  const onPinPress = (event: { features?: GeoJSON.Feature[] }) => {
    const id = event.features?.[0]?.properties?.id as string | undefined;
    if (!id) return;
    const pin = pins.find((p) => p.id === id);
    if (pin) setDraft({ ...pin });
  };

  const saveDraft = () => {
    if (!draft) return;
    const creating = isNewPin(draft, pins);
    if (creating && isOverFreeMarkerCap(1)) {
      Alert.alert(
        "Free tier",
        `BossMaps will cap markers at ${freeMarkerCap()} on the free tier. Cap is not enforced in this MVP build yet.`,
      );
    }
    upsertPin({ ...draft, updatedAt: Date.now() });
    setDraft(null);
    refresh();
  };

  const removeDraft = () => {
    if (!draft) return;
    if (!isNewPin(draft, pins)) {
      Alert.alert("Delete pin?", draft.title, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deletePin(draft.id);
            setDraft(null);
            refresh();
          },
        },
      ]);
      return;
    }
    setDraft(null);
  };

  const attachUploadedIcon = async (source: "library" | "files") => {
    try {
      const icon =
        source === "library" ? await pickAndStoreIconFromLibrary() : await pickAndStoreIconFromFiles();
      if (icon && draft) setDraft({ ...draft, iconId: icon.id });
      refresh();
    } catch (err) {
      Alert.alert("Icon upload failed", String(err));
    }
  };

  const addFolder = () => {
    const name = newFolder.trim();
    if (!name) return;
    upsertFolder({ id: uid(), name, parentId: null, visible: true, updatedAt: Date.now() });
    setNewFolder("");
    refresh();
  };

  const startRenameFolder = (folder: Folder) => {
    setRenamingFolderId(folder.id);
    setRenameFolderText(folder.name);
  };

  const commitRenameFolder = () => {
    if (!renamingFolderId) return;
    const name = renameFolderText.trim();
    const folder = folders.find((f) => f.id === renamingFolderId);
    if (folder && name) {
      upsertFolder({ ...folder, name, updatedAt: Date.now() });
      refresh();
    }
    setRenamingFolderId(null);
    setRenameFolderText("");
  };

  const flyToPin = (pin: Pin) => {
    cameraRef.current?.setCamera({
      centerCoordinate: [pin.lng, pin.lat],
      zoomLevel: 14,
      animationDuration: 1200,
      animationMode: "flyTo",
    });
    setShowPins(false);
  };

  const offlinePacks = listOfflinePacks();

  if (!ready) {
    return (
      <View style={styles.center}>
        <Text>Loading BossMaps…</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="auto" />
      <MapLibreGL.MapView
        style={styles.map}
        mapStyle={getActiveMapStyleUrl()}
        onLongPress={onLongPress}
        attributionEnabled
        logoEnabled
      >
        <MapLibreGL.Camera ref={cameraRef} defaultSettings={{ zoomLevel: 3, centerCoordinate: [0, 20] }} />
        <MapLibreGL.Images images={styleImages} />
        <MapLibreGL.UserLocation visible />
        <MapLibreGL.ShapeSource id="pins" shape={pinCollection} onPress={onPinPress}>
          <MapLibreGL.SymbolLayer
            id="pin-symbols"
            style={{
              iconImage: ["get", "iconId"],
              iconSize: 0.35,
              iconAllowOverlap: true,
              iconIgnorePlacement: true,
              textField: ["get", "title"],
              textSize: 11,
              textOffset: [0, 1.4],
              textAnchor: "top",
              textOptional: true,
              textAllowOverlap: false,
              textHaloColor: ["get", "color"],
              textHaloWidth: 2,
            }}
          />
        </MapLibreGL.ShapeSource>
      </MapLibreGL.MapView>

      <SafeAreaView style={styles.hud} pointerEvents="box-none">
        <Text style={styles.brand}>BossMaps</Text>
        <Pressable style={styles.hudBtn} onPress={() => setShowPins(true)}>
          <Text style={styles.hudTxt}>Pins ({pinCount()})</Text>
        </Pressable>
        <Pressable style={styles.hudBtn} onPress={() => setShowFolders(true)}>
          <Text style={styles.hudTxt}>Folders</Text>
        </Pressable>
        <Pressable style={styles.hudBtn} onPress={() => setShowPacks(true)}>
          <Text style={styles.hudTxt}>Offline packs</Text>
        </Pressable>
      </SafeAreaView>

      <Modal visible={!!draft} animationType="slide" transparent>
        <View style={styles.sheet}>
          <Text style={styles.h}>{isNewPin(draft!, pins) ? "New pin" : "Edit pin"}</Text>
          <Text style={styles.meta}>
            {draft?.lat.toFixed(5)}, {draft?.lng.toFixed(5)}
          </Text>
          <TextInput
            style={styles.input}
            value={draft?.title}
            onChangeText={(t) => draft && setDraft({ ...draft, title: t })}
            placeholder="Name"
          />
          <TextInput
            style={[styles.input, { height: 72 }]}
            value={draft?.notes}
            onChangeText={(t) => draft && setDraft({ ...draft, notes: t })}
            placeholder="Notes"
            multiline
          />
          <Text style={styles.meta}>Folder</Text>
          <View style={styles.rowWrap}>
            {folders.map((f) => (
              <Pressable
                key={f.id}
                style={[styles.chip, draft?.folderId === f.id && styles.chipOn]}
                onPress={() => draft && setDraft({ ...draft, folderId: f.id })}
              >
                <Text>{f.name}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.meta}>Label color</Text>
          <View style={styles.rowWrap}>
            {PIN_COLORS.map((c) => (
              <Pressable
                key={c}
                style={[styles.colorDot, { backgroundColor: c }, draft?.color === c && styles.colorDotOn]}
                onPress={() => draft && setDraft({ ...draft, color: c })}
              />
            ))}
          </View>
          <Text style={styles.meta}>Built-in icons</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.iconRow}>
            {builtinIcons.map((icon) => (
              <Pressable
                key={icon.id}
                style={[styles.iconPick, draft?.iconId === icon.id && styles.iconPickOn]}
                onPress={() => draft && setDraft({ ...draft, iconId: icon.id })}
              >
                <Image source={{ uri: icon.localUri }} style={styles.iconThumb} />
              </Pressable>
            ))}
          </ScrollView>
          {customIcons.length > 0 && (
            <>
              <Text style={styles.meta}>Your uploads</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.iconRow}>
                {customIcons.map((icon) => (
                  <Pressable
                    key={icon.id}
                    style={[styles.iconPick, draft?.iconId === icon.id && styles.iconPickOn]}
                    onPress={() => draft && setDraft({ ...draft, iconId: icon.id })}
                  >
                    <Image source={{ uri: icon.localUri }} style={styles.iconThumb} />
                  </Pressable>
                ))}
              </ScrollView>
            </>
          )}
          <View style={styles.row}>
            <Pressable style={styles.secondary} onPress={() => attachUploadedIcon("library")}>
              <Text style={styles.secondaryTxt}>Photo library</Text>
            </Pressable>
            <Pressable style={styles.secondary} onPress={() => attachUploadedIcon("files")}>
              <Text style={styles.secondaryTxt}>Choose file</Text>
            </Pressable>
          </View>
          <Text style={styles.hint}>
            Custom icons are resized to 128/256 px PNG, hashed, and saved under the app documents folder. MapLibre
            registers them via Images + SymbolLayer.
          </Text>
          <View style={styles.row}>
            <Pressable onPress={removeDraft}>
              <Text style={draft && !isNewPin(draft, pins) ? styles.danger : styles.meta}>
                {draft && !isNewPin(draft, pins) ? "Delete" : "Cancel"}
              </Text>
            </Pressable>
            <Pressable style={styles.primary} onPress={saveDraft}>
              <Text style={styles.primaryTxt}>Save pin</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={showPins} animationType="slide">
        <SafeAreaView style={styles.modalPage}>
          <Text style={styles.h}>Pins</Text>
          <Text style={styles.meta}>Tap to fly. Long-press a row to edit.</Text>
          <FlatList
            data={pins}
            keyExtractor={(p) => p.id}
            ListEmptyComponent={<Text style={styles.meta}>Long-press the map to add a pin.</Text>}
            renderItem={({ item }) => (
              <Pressable
                style={styles.listRow}
                onPress={() => flyToPin(item)}
                onLongPress={() => setDraft({ ...item })}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.pinTitle}>{item.title}</Text>
                  <Text style={styles.meta}>
                    {item.lat.toFixed(4)}, {item.lng.toFixed(4)}
                  </Text>
                </View>
                <Text style={styles.link}>Go</Text>
              </Pressable>
            )}
          />
          <Pressable onPress={() => setShowPins(false)}>
            <Text style={styles.link}>Close</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>

      <Modal visible={showFolders} animationType="slide">
        <SafeAreaView style={styles.modalPage}>
          <Text style={styles.h}>Folders</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={newFolder}
              onChangeText={setNewFolder}
              placeholder="New folder name"
            />
            <Pressable style={styles.primary} onPress={addFolder}>
              <Text style={styles.primaryTxt}>Add</Text>
            </Pressable>
          </View>
          <FlatList
            data={folders}
            keyExtractor={(f) => f.id}
            renderItem={({ item }) => (
              <View style={styles.listRow}>
                {renamingFolderId === item.id ? (
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={renameFolderText}
                    onChangeText={setRenameFolderText}
                    onSubmitEditing={commitRenameFolder}
                    autoFocus
                  />
                ) : (
                  <Pressable style={{ flex: 1 }} onPress={() => startRenameFolder(item)}>
                    <Text style={styles.pinTitle}>{item.name}</Text>
                    <Text style={styles.meta}>Tap name to rename</Text>
                  </Pressable>
                )}
                <Pressable
                  onPress={() => {
                    upsertFolder({ ...item, visible: !item.visible, updatedAt: Date.now() });
                    refresh();
                  }}
                >
                  <Text style={styles.link}>{item.visible ? "Hide" : "Show"}</Text>
                </Pressable>
                {item.id !== "default" && (
                  <Pressable
                    onPress={() => {
                      Alert.alert("Delete folder?", item.name, [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: () => {
                            deleteFolder(item.id);
                            refresh();
                          },
                        },
                      ]);
                    }}
                  >
                    <Text style={styles.danger}>Del</Text>
                  </Pressable>
                )}
                {renamingFolderId === item.id && (
                  <Pressable onPress={commitRenameFolder}>
                    <Text style={styles.link}>Save</Text>
                  </Pressable>
                )}
              </View>
            )}
          />
          <Pressable onPress={() => setShowFolders(false)}>
            <Text style={styles.link}>Close</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>

      <Modal visible={showPacks} animationType="slide">
        <SafeAreaView style={styles.modalPage}>
          <Text style={styles.h}>Offline packs (Phase 2)</Text>
          <Text style={styles.meta}>
            Hook only in Phase 1. Online OSM vector style loads until regional MBTiles / PMTiles download ships.
          </Text>
          <FlatList
            data={offlinePacks}
            keyExtractor={(p) => p.id}
            renderItem={({ item }) => (
              <View style={styles.listRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pinTitle}>{item.name}</Text>
                  <Text style={styles.meta}>Status: {item.status}</Text>
                </View>
              </View>
            )}
          />
          <Pressable
            style={[styles.primary, { opacity: 0.6 }]}
            onPress={() => {
              requestOfflinePackDownload("sample-metro").catch((err) =>
                Alert.alert("Coming in Phase 2", String(err.message ?? err)),
              );
            }}
          >
            <Text style={styles.primaryTxt}>Download sample region</Text>
          </Pressable>
          <Pressable onPress={() => setShowPacks(false)}>
            <Text style={styles.link}>Close</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  hud: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    alignItems: "center",
  },
  brand: { fontWeight: "800", fontSize: 16, backgroundColor: "#fff", paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8 },
  hudBtn: { backgroundColor: "#fff", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, elevation: 2 },
  hudTxt: { fontWeight: "600" },
  sheet: {
    marginTop: "auto",
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    gap: 8,
    maxHeight: "92%",
  },
  modalPage: { flex: 1, padding: 16, gap: 12 },
  h: { fontSize: 20, fontWeight: "700" },
  meta: { color: "#555" },
  hint: { color: "#666", fontSize: 12, lineHeight: 16 },
  pinTitle: { fontWeight: "600", fontSize: 16 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderWidth: 1, borderColor: "#ccc", borderRadius: 16, paddingHorizontal: 10, paddingVertical: 6 },
  chipOn: { backgroundColor: "#e8f0fe", borderColor: "#1a73e8" },
  colorDot: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: "transparent" },
  colorDotOn: { borderColor: "#111" },
  iconRow: { gap: 8, paddingVertical: 4 },
  iconPick: { padding: 4, borderRadius: 8, borderWidth: 2, borderColor: "transparent" },
  iconPickOn: { borderColor: "#1a73e8", backgroundColor: "#e8f0fe" },
  iconThumb: { width: 40, height: 40, borderRadius: 4 },
  primary: { backgroundColor: "#1a73e8", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  primaryTxt: { color: "#fff", fontWeight: "600" },
  secondary: { flex: 1, backgroundColor: "#eef3fc", paddingHorizontal: 10, paddingVertical: 10, borderRadius: 8 },
  secondaryTxt: { color: "#1a73e8", fontWeight: "600", textAlign: "center" },
  listRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ddd",
    gap: 8,
  },
  link: { color: "#1a73e8", fontSize: 16 },
  danger: { color: "#c5221f", fontWeight: "600" },
});

import MapLibreGL, { type CameraRef } from "@maplibre/maplibre-react-native";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { initStore, listFolders, listIcons, listPins, upsertFolder, upsertPin } from "./src/store";
import { pickAndStoreIcon } from "./src/icons";
import type { Folder, IconAsset, Pin } from "./src/types";

const STYLE = "https://demotiles.maplibre.org/style.json";

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
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

  const pinCollection = useMemo(
    (): GeoJSON.FeatureCollection => ({
      type: "FeatureCollection",
      features: visiblePins.map((p) => ({
        type: "Feature",
        id: p.id,
        geometry: { type: "Point", coordinates: [p.lng, p.lat] },
        properties: { id: p.id, title: p.title, iconId: p.iconId },
      })),
    }),
    [visiblePins],
  );

  const onLongPress = (feature: GeoJSON.Feature) => {
    if (feature.geometry?.type !== "Point") return;
    const [lng, lat] = feature.geometry.coordinates;
    const now = Date.now();
    const folderId = folders[0]?.id ?? null;
    setDraft({
      id: uid(),
      lat,
      lng,
      title: "New place",
      notes: "",
      folderId,
      iconId: "pin-red",
      createdAt: now,
      updatedAt: now,
    });
  };

  const saveDraft = () => {
    if (!draft) return;
    upsertPin({ ...draft, updatedAt: Date.now() });
    setDraft(null);
    refresh();
  };

  const uploadIcon = async () => {
    try {
      const icon = await pickAndStoreIcon();
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

  const flyToPin = (pin: Pin) => {
    cameraRef.current?.setCamera({
      centerCoordinate: [pin.lng, pin.lat],
      zoomLevel: 14,
      animationDuration: 1200,
      animationMode: "flyTo",
    });
    setShowPins(false);
  };

  if (!ready) {
    return (
      <View style={styles.center}>
        <Text>Loading Atlas Maps…</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="auto" />
      <MapLibreGL.MapView style={styles.map} mapStyle={STYLE} onLongPress={onLongPress}>
        <MapLibreGL.Camera ref={cameraRef} defaultSettings={{ zoomLevel: 3, centerCoordinate: [0, 20] }} />
        <MapLibreGL.Images images={styleImages} />
        <MapLibreGL.UserLocation visible />
        <MapLibreGL.ShapeSource id="pins" shape={pinCollection}>
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
            }}
          />
        </MapLibreGL.ShapeSource>
      </MapLibreGL.MapView>

      <SafeAreaView style={styles.hud} pointerEvents="box-none">
        <Pressable style={styles.hudBtn} onPress={() => setShowPins(true)}>
          <Text style={styles.hudTxt}>Pins</Text>
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
          <Text style={styles.h}>Pin</Text>
          <Text style={styles.meta}>
            {draft?.lat.toFixed(5)}, {draft?.lng.toFixed(5)}
          </Text>
          <TextInput
            style={styles.input}
            value={draft?.title}
            onChangeText={(t) => draft && setDraft({ ...draft, title: t })}
            placeholder="Title"
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
          <Pressable style={styles.primary} onPress={uploadIcon}>
            <Text style={styles.primaryTxt}>Upload custom icon</Text>
          </Pressable>
          <View style={styles.row}>
            <Pressable onPress={() => setDraft(null)}>
              <Text>Cancel</Text>
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
          <Text style={styles.meta}>Tap a pin to fly the map there.</Text>
          <FlatList
            data={pins}
            keyExtractor={(p) => p.id}
            ListEmptyComponent={<Text style={styles.meta}>Long-press the map to add a pin.</Text>}
            renderItem={({ item }) => (
              <Pressable style={styles.listRow} onPress={() => flyToPin(item)}>
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
              <Pressable
                style={styles.listRow}
                onPress={() => {
                  upsertFolder({ ...item, visible: !item.visible, updatedAt: Date.now() });
                  refresh();
                }}
              >
                <Text>{item.name}</Text>
                <Text>{item.visible ? "visible" : "hidden"}</Text>
              </Pressable>
            )}
          />
          <Pressable onPress={() => setShowFolders(false)}>
            <Text style={styles.link}>Close</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>

      <Modal visible={showPacks} animationType="slide">
        <SafeAreaView style={styles.modalPage}>
          <Text style={styles.h}>Offline packs (stub)</Text>
          <Text style={styles.meta}>
            Phase 1 stub. Phase 3 will download regional MBTiles / PMTiles. Online OSM style is used until then.
          </Text>
          <Pressable style={[styles.primary, { opacity: 0.5 }]}>
            <Text style={styles.primaryTxt}>Download sample region — coming next</Text>
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
  hud: { position: "absolute", top: 12, left: 12, right: 12, flexDirection: "row", gap: 8, flexWrap: "wrap" },
  hudBtn: { backgroundColor: "#fff", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, elevation: 2 },
  hudTxt: { fontWeight: "600" },
  sheet: {
    marginTop: "auto",
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    gap: 8,
  },
  modalPage: { flex: 1, padding: 16, gap: 12 },
  h: { fontSize: 20, fontWeight: "700" },
  meta: { color: "#555" },
  pinTitle: { fontWeight: "600", fontSize: 16 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderWidth: 1, borderColor: "#ccc", borderRadius: 16, paddingHorizontal: 10, paddingVertical: 6 },
  chipOn: { backgroundColor: "#e8f0fe", borderColor: "#3b6" },
  primary: { backgroundColor: "#1a73e8", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  primaryTxt: { color: "#fff", fontWeight: "600" },
  listRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: "#ddd" },
  link: { color: "#1a73e8", fontSize: 16, marginTop: 16 },
});

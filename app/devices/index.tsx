import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Device = {
  id: string;
  deviceType: string;
  brand: string;
  serialNumber: string;
  imei?: string; // optional
  deviceName: string;
  createdAt: number;
};

const STORAGE_KEY = "devices";
const DEVICE_TYPES = [
  "Phone",
  "Tablet",
  "Laptop",
  "Desktop PC",
  "Smart Watch",
  "Game Console",
  "Router / MiFi",
  "VR Headset",
  "Headphones / Earbuds",
  "Power Bank",
  "External Hard Drive",
  "Flash Drive",
  "Other",
] as const;

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function DevicesPage() {
  const router = useRouter();

  const params = useLocalSearchParams();
  const add = Array.isArray(params.add) ? params.add[0] : params.add;
  const edit = Array.isArray(params.edit) ? params.edit[0] : params.edit;

  const isAddMode = useMemo(() => add === "1", [add]);
  const isEditMode = useMemo(() => !!edit, [edit]);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Dropdown modal state
  const [typePickerOpen, setTypePickerOpen] = useState(false);

  const [deviceType, setDeviceType] = useState("");
  const [brand, setBrand] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [imei, setImei] = useState("");
  const [deviceName, setDeviceName] = useState("");

  useEffect(() => {
    if (isAddMode) {
      setEditingId(null);
      setOpen(true);
    }

    if (isEditMode && typeof edit === "string") {
      setEditingId(edit);
      setOpen(true);
      preloadDevice(edit);
    }
  }, [isAddMode, isEditMode, edit]);

  const preloadDevice = async (id: string) => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const list: Device[] = raw ? JSON.parse(raw) : [];
      const found = list.find((d) => d.id === id);

      if (!found) {
        Alert.alert("Oops", "Device not found.");
        return;
      }

      setDeviceType(found.deviceType ?? "");
      setBrand(found.brand ?? "");
      setSerialNumber(found.serialNumber ?? "");
      setImei(found.imei ?? "");
      setDeviceName(found.deviceName ?? "");
    } catch (e) {
      console.log("Preload error:", e);
    }
  };

  const resetForm = () => {
    setDeviceType("");
    setBrand("");
    setSerialNumber("");
    setImei("");
    setDeviceName("");
  };

  const selectDeviceType = (type: string) => {
    setDeviceType(type);
    setTypePickerOpen(false);
  };

  const saveDevice = async () => {
    const cleanDeviceType = deviceType.trim();
    const cleanBrand = brand.trim();
    const cleanSerial = serialNumber.trim();
    const cleanImei = imei.trim();
    const cleanName = deviceName.trim();

    if (!cleanDeviceType || !cleanBrand || !cleanSerial || !cleanName) {
      Alert.alert("Missing info", "Fill all required fields.");
      return;
    }

    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const list: Device[] = raw ? JSON.parse(raw) : [];

      if (editingId) {
        const updated = list.map((d) =>
          d.id === editingId
            ? {
                ...d,
                deviceType: cleanDeviceType,
                brand: cleanBrand,
                serialNumber: cleanSerial,
                imei: cleanImei.length ? cleanImei : undefined,
                deviceName: cleanName,
              }
            : d
        );

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        setOpen(false);
        resetForm();
        setEditingId(null);

        router.replace("/home");
        return;
      }

      const newDevice: Device = {
        id: makeId(),
        deviceType: cleanDeviceType,
        brand: cleanBrand,
        serialNumber: cleanSerial,
        imei: cleanImei.length ? cleanImei : undefined,
        deviceName: cleanName,
        createdAt: Date.now(),
      };

      list.push(newDevice);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));

      setOpen(false);
      resetForm();

      router.replace("/home");
    } catch (e) {
      console.log("Save error:", e);
      Alert.alert("Error", "Could not save device.");
    }
  };

  const closeModal = () => {
    setOpen(false);
    setEditingId(null);
    resetForm();
    router.back();
  };

  return (
    <View style={styles.page}>
      <Text style={styles.h1}>Devices</Text>
      <Text style={styles.sub}>This page hosts Add or Edit Device modal.</Text>

      <Modal visible={open} transparent animationType="slide" onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingId ? "Edit Device" : "Add Device"}
              </Text>
            </View>

            <ScrollView contentContainerStyle={{ gap: 10 }} showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.select}
                onPress={() => setTypePickerOpen(true)}
              >
                <Text style={deviceType ? styles.selectText : styles.selectPlaceholder}>
                  {deviceType ? deviceType : "Device Type (Select)"}
                </Text>
                <Text style={styles.chev}>›</Text>
              </TouchableOpacity>

              <TextInput
                value={brand}
                onChangeText={setBrand}
                placeholder="Brand (e.g. Samsung, HP)"
                placeholderTextColor="#777"
                style={styles.input}
              />

              <TextInput
                value={serialNumber}
                onChangeText={setSerialNumber}
                placeholder="Serial Number"
                placeholderTextColor="#777"
                style={styles.input}
              />

              <TextInput
                value={imei}
                onChangeText={setImei}
                placeholder="IMEI (optional)"
                placeholderTextColor="#777"
                style={styles.input}
                keyboardType="numeric"
              />

              <TextInput
                value={deviceName}
                onChangeText={setDeviceName}
                placeholder="Device Name (what you’ll see on dashboard)"
                placeholderTextColor="#777"
                style={styles.input}
              />

              <TouchableOpacity style={styles.add} activeOpacity={0.85} onPress={saveDevice}>
                <Text style={styles.addText}>{editingId ? "Save Changes" : "Add"}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancel} activeOpacity={0.85} onPress={closeModal}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <Modal
            visible={typePickerOpen}
            transparent
            animationType="fade"
            onRequestClose={() => setTypePickerOpen(false)}
          >
            <View style={styles.pickerOverlay}>
              <View style={styles.pickerCard}>
                <Text style={styles.pickerTitle}>Select Device Type</Text>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {DEVICE_TYPES.map((t) => (
                    <TouchableOpacity
                      key={t}
                      activeOpacity={0.85}
                      style={[
                        styles.pickerItem,
                        deviceType === t ? styles.pickerItemActive : null,
                      ]}
                      onPress={() => selectDeviceType(t)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          deviceType === t ? styles.pickerItemTextActive : null,
                        ]}
                      >
                        {t}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  style={styles.pickerCancel}
                  activeOpacity={0.85}
                  onPress={() => setTypePickerOpen(false)}
                >
                  <Text style={styles.pickerCancelText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff", padding: 16, paddingTop: 50, gap: 12 },
  h1: { color: "#12121A", fontSize: 40, fontWeight: "600" },
  sub: { color: "#A1A1AA", fontSize: 14 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(53, 52, 52, 0.6)", justifyContent: "flex-end" },
  modalCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(92, 84, 84, 0.38)",
    maxHeight: "85%",
    gap: 12,
  },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  modalTitle: { color: "#0F0F16", fontSize: 26, fontWeight: "600" },

  input: {
    backgroundColor: "#0F0F16",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  // ✅ Dropdown field
  select: {
    backgroundColor: "#0F0F16",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectPlaceholder: { color: "#777", fontWeight: "700" },
  selectText: { color: "#fff", fontWeight: "800" },
  chev: { color: "#A1A1AA", fontSize: 20, fontWeight: "900" },

  add: { backgroundColor: "#000", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginTop: 4 },
  addText: { color: "#fff", fontWeight: "800" },

  cancel: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  cancelText: { color: "#A1A1AA", fontWeight: "800" },

  // ✅ Picker modal
  pickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 16,
  },
  pickerCard: {
    backgroundColor: "#12121A",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    maxHeight: "80%",
    gap: 12,
  },
  pickerTitle: { color: "#fff", fontSize: 16, fontWeight: "900" },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "#0F0F16",
  },
  pickerItemActive: {
    borderColor: "rgba(154, 201, 164, 0.8)",
  },
  pickerItemText: { color: "#fff", fontWeight: "800" },
  pickerItemTextActive: { color: "#9ac9a4ff" },

  pickerCancel: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  pickerCancelText: { color: "#A1A1AA", fontWeight: "800" },
});
